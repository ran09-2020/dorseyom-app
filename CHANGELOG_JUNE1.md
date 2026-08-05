# יומן שינויים - 1 ביוני 2025

תיעוד כל השינויים שבוצעו מ-1 ביוני 17:09 לצורך שחזור.

---

## שלב 1: מיגרציית Database - תגים

### יצירת קובץ מיגרציה
**נתיב:** `supabase/migrations/20260602090000_add_red_trousers_fix_white_rump.sql`

```sql
-- תיקון תגים: הוספת red_trousers ותיקון white_rump ל-low_white_rump

-- 1. הוספת תג "מכנסיים אדומים" (red_trousers) - נפרד מ-rusty_trousers
INSERT INTO public.tags (category_id, label, attr, attr_value, has_custom_list, sort_order)
SELECT 
  (SELECT id FROM public.tag_categories WHERE name = 'סימנים בולטים'),
  'מכנסיים אדומים',
  'red_trousers',
  true,
  true,
  8
WHERE NOT EXISTS (SELECT 1 FROM public.tags WHERE attr = 'red_trousers');

-- 2. הוספת רשימת הדורסים עם מכנסיים אדומים
INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
SELECT t.id, bird_id, note, sort_order
FROM public.tags t, (VALUES
  ('hobby', 'מכנסיים חלודים', 0),
  ('red_footed_falcon', 'מכנסיים ורגליים אדומות (זכר)', 1)
) AS birds(bird_id, note, sort_order)
WHERE t.attr = 'red_trousers'
AND NOT EXISTS (
  SELECT 1 FROM public.tag_birds tb 
  WHERE tb.tag_id = t.id AND tb.bird_id = birds.bird_id
);

-- 3. עדכון תג "על-שת לבן" להשתמש ב-low_white_rump במקום white_rump
UPDATE public.tags 
SET attr = 'low_white_rump'
WHERE attr = 'white_rump';
```

---

## שלב 2: עדכון quick_marks בעקבים

**קובץ:** `src/data/birds.ts`

### common_buzzard (עקב חורף)
```typescript
quick_marks: ['זנב עם הרבה פסים דקים'],
```

### steppe_buzzard (עקב מזרחי)
```typescript
features: ['זנב חלודי מפוספס', 'V רדוד (בגלישה)', 'קטן מעקב עיטי', 'חלונות בהירים', 'מרפרף'],
diff_desc: 'כתם כהה במפרק הכנף. סהר בהיר על החזה. זנב חלודי מפוספס. קטן יותר מעקב עיטי.',
quick_marks: ['זנב חלודי מפוספס'],
```

### rough_legged (עקב מכנסיים)
```typescript
quick_marks: ['זנב לבן עם פס שחור רחב בקצה'],
```

### long_legged (עקב עיטי)
```typescript
quick_marks: ['זנב בהיר מלמעלה', 'הגדול ביותר', 'מכנסיים כהים'],
```

---

## שלב 3: עדכון quick_marks בזרונים

**קובץ:** `src/data/birds.ts`

### hen_harrier (זרון תכול)
```typescript
quick_marks: ['אפור בהיר', 'על-שת לבן', 'קצוות רחבות'],
```

### pallid_harrier (זרון שדות)
```typescript
quick_marks: ['לבן כמעט', 'קצוות חדות כדיו', 'על-שת לבן'],
```

---

## שלב 4: עדכון quick_marks בבזים

**קובץ:** `src/data/birds.ts`

### lesser_kestrel (בז אדום)
```typescript
quick_marks: ['גב חלוד נקי!', 'קטן יותר', 'ראש אפור'],
```

### common_kestrel (בז מצוי)
```typescript
quick_marks: ['גב מנוקד בשחור', 'מרחף', 'ראש אפור (זכר)'],
```

---

## שלב 5: תיקון טבלת השוואה

**קובץ:** `src/utils/similarityWarning.ts`

### החלפה גלובלית (6 מופעים)
**מ:**
```typescript
{ name: 'עקב מזרחי', feature: 'זנב חלוד אחיד (ללא פסים)' }
```

**ל:**
```typescript
{ name: 'עקב מזרחי', feature: 'זנב חלודי מפוספס' }
```

---

## שלב 6: שיפורי ביצועים

### 6.1 ScrollToTop.tsx

**קובץ:** `src/components/ScrollToTop.tsx`

**להחליף את ה-useEffect השני** (זה עם pathname) ב:
```typescript
useEffect(() => {
  // Simple scroll to top - no DOM scanning needed
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}, [pathname]);
```

### 6.2 Index.tsx - validateBirdIdentification

**קובץ:** `src/pages/Index.tsx`

**למצוא** את ה-useEffect עם validateBirdIdentification **ולעטוף** ב-DEV check:
```typescript
useEffect(() => {
  if (import.meta.env.DEV) {
    const result = validateBirdIdentification();
    if (!result.isValid) {
      console.warn('⚠️ יש ציפורים שלא ניתן להבחין ביניהן:');
      result.duplicatePairs.forEach((pair) => {
        console.warn(`  ${pair.bird1} ↔ ${pair.bird2}`);
      });
    } else {
      console.log('✅ כל הציפורים ניתנות לזיהוי ייחודי');
    }
  }
}, []);
```

### 6.3 הוספת lazy loading לתמונות

**קובץ:** `src/pages/Index.tsx`

להוסיף `loading="lazy"` לתגי img של תמונות מובילות:
```tsx
<img
  src={leadPhoto}
  alt={bird.name}
  loading="lazy"
  className="..." />
```

**קובץ:** `src/pages/Admin.tsx`

להוסיף `loading="lazy"` לתגי img של תמונות גלריה.

---

## שלב 7: צמצום מרווחים בניווט (מובייל)

**קובץ:** `src/components/Navbar.tsx`

**למצוא** את baseClasses ב-NavLink **ולשנות** ערכי מובייל:
```typescript
const baseClasses = "flex items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-0.5 sm:py-2 rounded-lg text-sm font-medium transition-colors";
```

---

## שלב 8: עמוד עזרה

### 8.1 יצירת הקובץ

**קובץ:** `src/pages/Help.tsx`

```tsx
import { Layout } from '@/components/Layout';
import { HelpCircle, Search, Tags, Camera, BookOpen, Wifi, WifiOff, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-forest">{icon}</div>
          <h2 className="text-lg font-bold text-stone-800">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-stone-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-stone-100">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* כותרת */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-forest/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-forest" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2">הוראות שימוש</h1>
          <p className="text-stone-600">איך לזהות דורסים בעזרת האפליקציה</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* מה זו האפליקציה */}
          <Section title="מה זו האפליקציה?" icon={<HelpCircle className="w-5 h-5" />} defaultOpen={true}>
            <p className="text-stone-700 mt-3 leading-relaxed">
              אפליקציה לזיהוי דורסים בישראל. מתאימה לצפרים מתחילים ומתקדמים כאחד.
              האפליקציה עוזרת לזהות את הדורס שראיתם בשטח על סמך מאפיינים חזותיים והתנהגותיים.
            </p>
          </Section>

          {/* שתי דרכים לזהות */}
          <Section title="שתי דרכים לזהות דורס" icon={<Search className="w-5 h-5" />} defaultOpen={true}>
            <div className="mt-3 flex flex-col gap-4">
              {/* שאלון מודרך */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                  <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                  שאלון מודרך (מומלץ למתחילים)
                </h3>
                <ul className="text-emerald-900 flex flex-col gap-1.5 text-sm">
                  <li>• האפליקציה שואלת שאלות פשוטות על מה שרואים</li>
                  <li>• כל תשובה מצמצמת את רשימת האפשרויות</li>
                  <li>• בסוף מקבלים רשימה קצרה של מועמדים עם תמונות</li>
                </ul>
                <div className="mt-3 bg-emerald-100 rounded-lg p-3 text-sm text-emerald-800">
                  <strong>💡 טיפ:</strong> אם לא בטוחים בתשובה - לחצו "לא בטוח/לא רואה"
                </div>
              </div>

              {/* סינון לפי תגים */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                  סינון לפי תגים (למתקדמים)
                </h3>
                <ul className="text-amber-900 flex flex-col gap-1.5 text-sm">
                  <li>• בחרו סימנים שאתם רואים על הדורס (צבעים, צורות, התנהגות)</li>
                  <li>• הרשימה מתעדכנת בזמן אמת</li>
                  <li>• ניתן לבחור כמה תגים במקביל</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* מה לשים לב אליו בשטח */}
          <Section title="מה לשים לב אליו בשטח?" icon={<Camera className="w-5 h-5" />}>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'גודל יחסי', examples: 'ענק / גדול / בינוני / קטן' },
                { label: 'צורת כנפיים', examples: 'רחבות / צרות / מחודדות' },
                { label: 'צורת זנב', examples: 'מזלג / מרובע / עגול / ארוך' },
                { label: 'צבעים בולטים', examples: 'כתמים / פסים / ראש בולט' },
                { label: 'אופן תעופה', examples: 'מרחף / גולש / מרפרף / צולל' },
                { label: 'בית גידול', examples: 'מדבר / יער / מים / צוקים' },
              ].map((item) => (
                <div key={item.label} className="bg-stone-50 rounded-lg p-3 text-center">
                  <div className="font-bold text-stone-800 text-sm mb-1">{item.label}</div>
                  <div className="text-xs text-stone-600">{item.examples}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* התגיות הירוקות */}
          <Section title="התגיות הירוקות" icon={<Tags className="w-5 h-5" />}>
            <div className="mt-3">
              <p className="text-stone-700 mb-3">
                בכרטיס כל דורס יש <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">תגיות ירוקות</span> - אלה הסימנים הכי חשובים להבדלה:
              </p>
              <ul className="text-stone-700 flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>קראו אותן לפני שמחליטים</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>הן עוזרות להבדיל בין מינים דומים</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>לדוגמה: "זנב חלוד אחיד" מבדיל עקב מזרחי מעקב חורף</span>
                </li>
              </ul>
            </div>
          </Section>

          {/* כשיש מינים דומים */}
          <Section title="כשיש כמה אפשרויות דומות" icon={<BookOpen className="w-5 h-5" />}>
            <div className="mt-3">
              <p className="text-stone-700 mb-3">
                האפליקציה מציגה <strong>טבלת השוואה</strong> אוטומטית כשיש מינים מבלבלים:
              </p>
              <ul className="text-stone-700 flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">→</span>
                  <span>קראו את ההבדלים בין העמודות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">→</span>
                  <span>התמקדו בסימן אחד ברור שאתם רואים בשטח</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">→</span>
                  <span>אם עדיין לא בטוחים - זה בסדר! צפרות זה תרגול</span>
                </li>
              </ul>
            </div>
          </Section>

          {/* כלים נוספים */}
          <Section title="כלים נוספים" icon={<BookOpen className="w-5 h-5" />}>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex items-start gap-3 bg-stone-50 rounded-lg p-3">
                <div className="bg-forest/10 p-2 rounded-lg">
                  <Camera className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <div className="font-bold text-stone-800">גלריה</div>
                  <div className="text-sm text-stone-600">תמונות של כל הדורסים לפי מין</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-stone-50 rounded-lg p-3">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-stone-800">מילון מונחים</div>
                  <div className="text-sm text-stone-600">הסברים על מונחים מקצועיים (על-שת, שפת זרימה וכו')</div>
                </div>
              </div>
            </div>
          </Section>

          {/* טיפים לזיהוי מוצלח */}
          <Section title="טיפים לזיהוי מוצלח" icon={<HelpCircle className="w-5 h-5" />}>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { num: 1, text: 'אל תמהרו', desc: 'עדיף לצפות עוד כמה שניות מלנחש' },
                { num: 2, text: 'התחילו מהגודל', desc: 'זה מצמצם הרבה אפשרויות' },
                { num: 3, text: 'חפשו סימן בולט אחד', desc: 'לא צריך לראות הכל' },
                { num: 4, text: 'השתמשו במונחון', desc: 'אם לא מבינים מונח' },
                { num: 5, text: 'תרגלו!', desc: 'ככל שתשתמשו יותר, תזהו מהר יותר' },
              ].map((tip) => (
                <div key={tip.num} className="flex items-center gap-3 bg-stone-50 rounded-lg p-3">
                  <span className="bg-forest text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {tip.num}
                  </span>
                  <div>
                    <span className="font-bold text-stone-800">{tip.text}</span>
                    <span className="text-stone-600"> - {tip.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* אופליין */}
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-xl p-4 border border-sky-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Wifi className="w-8 h-8 text-sky-600" />
                <WifiOff className="w-4 h-4 text-emerald-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800">האפליקציה עובדת אופליין!</h3>
                <p className="text-sm text-stone-600">לאחר טעינה ראשונה, ניתן להשתמש גם ללא אינטרנט - מושלם לשטח!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
```

### 8.2 הוספה לניווט

**קובץ:** `src/components/Navbar.tsx`

**להוסיף** ל-imports:
```typescript
import { Images, Home, Shield, BookOpen, HelpCircle } from 'lucide-react';
```

**להוסיף** NavLink לפני admin:
```tsx
<NavLink to="/help" icon={<HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />} label="עזרה" active={isActive('/help')} />
```

### 8.3 הוספה ל-routing

**קובץ:** `src/App.tsx`

**להוסיף** import:
```typescript
import Help from '@/pages/Help';
```

**להוסיף** route:
```tsx
<Route path="/help" element={<Help />} />
```

---

## שלב 9: main.tsx נקי (ללא Service Worker)

**קובץ:** `src/main.tsx`

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { AppProviders } from './providers';
import './index.css';

/**
 * ⚠️ ROUTER LIVES HERE — Do NOT add <BrowserRouter>, <Router>, or <MemoryRouter> anywhere else.
 * All route definitions go in App.tsx using <Routes> and <Route>.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </StrictMode>,
);
```

---

## סדר ביצוע מומלץ

1. ✅ שלב 1 - מיגרציית Database (להריץ ב-SQL Editor או כמיגרציה)
2. ✅ שלבים 2-4 - עדכוני quick_marks ב-birds.ts
3. ✅ שלב 5 - תיקון טבלת השוואה
4. ✅ שלב 6 - שיפורי ביצועים
5. ✅ שלב 7 - צמצום מרווחים בניווט
6. ✅ שלב 8 - עמוד עזרה (אופציונלי)
7. ✅ שלב 9 - ניקוי main.tsx

---

## הערות

- **בעיית הפרסום** לא נפתרה - ייתכן שקשורה לפלטפורמה ולא לקוד
- **Service Worker** הושבת לצורך בדיקה
- **עמוד העזרה** נמחק לצורך בדיקה - יש ליצור מחדש לפי שלב 8

---

*נוצר ב-1 ביוני 2025*
