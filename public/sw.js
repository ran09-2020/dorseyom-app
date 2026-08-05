// Service Worker for דאה - זיהוי דורסים בתעופה
// גרסה מתעדכנת - שנה את המספר בכל פריסה!
const CACHE_VERSION = 7;
const CACHE_NAME = `daa-cache-v${CACHE_VERSION}`;

// קבצים לשמירה ב-cache בהתקנה
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/app-icon-512.png'
];

// התקנת Service Worker - שמירת קבצים בסיסיים
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching assets');
        // שמירה של כל קובץ בנפרד - אם אחד נכשל, האחרים ימשיכו
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Failed to cache:', url, err);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
  );
});

// הפעלה - ניקוי כל ה-cache הישן והשתלטות מיידית
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // מחק את כל ה-caches הישנים
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete, taking control');
        // השתלט מיידית על כל הטאבים
        return self.clients.claim();
      })
  );
});

// אסטרטגיית Network First עם fallback ל-Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // לא לטפל בבקשות שאינן GET
  if (request.method !== 'GET') return;

  // לא לטפל בבקשות API של Supabase
  if (url.hostname.includes('supabase')) return;

  // לא לטפל בextensions של Chrome
  if (url.protocol === 'chrome-extension:') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // אם הצליח - שמור בcache
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // אם נכשל (אופליין) - נסה מהcache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // אם זה ניווט לדף - תחזיר את הדף הראשי
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// האזנה להודעות מהאפליקציה
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
