import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useBirdsWithOverrides } from '@/hooks/useBirdsWithOverrides';
import { Camera, X, ChevronRight, ChevronLeft, Filter, ArrowRight } from 'lucide-react';
import { ImageMagnifier } from '@/components/ImageMagnifier';
import type { Tables } from '@/integrations/supabase/helpers';

type Photo = Tables<'photos'>;

const FAMILIES = [
{ id: 'all', name: 'הכל' },
{ id: 'נשרים', name: 'נשרים' },
{ id: 'עיטים', name: 'עיטים' },
{ id: 'איות', name: 'איות' },
{ id: 'דיות', name: 'דיות' },
{ id: 'דאות', name: 'דאות' },
{ id: 'עקבים', name: 'עקבים' },
{ id: 'זרונים', name: 'זרונים' },
{ id: 'ניצים', name: 'ניצים' },
{ id: 'בזים', name: 'בזים' },
{ id: 'שלך', name: 'שלך' },
{ id: 'אחר', name: 'אחר' }];


export default function Gallery() {
  const [searchParams] = useSearchParams();
  const birdFilter = searchParams.get('bird');
  const fromQuiz = searchParams.get('fromQuiz') === 'true';
  const { birds: BIRDS_DATA } = useBirdsWithOverrides();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  // Scroll to top on mount and when family filter changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedFamily]);

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle swipe gestures - touch handlers defined as simple functions
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  useEffect(() => {
    async function fetchPhotos() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.
      from('photos').
      select('*').
      order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data ?? []);
      }
      setLoading(false);
    }

    fetchPhotos();
  }, []);

  const filteredPhotos = photos.filter((p) => {
    const matchesFamily = selectedFamily === 'all' || p.family === selectedFamily;
    const matchesBird = !birdFilter || p.bird_id === birdFilter;
    return matchesFamily && matchesBird;
  });

  const openLightbox = (photo: Photo) => {
    const index = filteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(index);
    setLightboxPhoto(photo);
  };

  const closeLightbox = useCallback(() => {
    setLightboxPhoto(null);
  }, []);

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    setLightboxIndex((prev) => {
      const len = filteredPhotos.length;
      if (len === 0) return prev;
      const newIndex = direction === 'next' ?
      (prev + 1) % len :
      (prev - 1 + len) % len;
      setLightboxPhoto(filteredPhotos[newIndex]);
      return newIndex;
    });
  }, [filteredPhotos]);

  // Handle swipe end - defined after navigateLightbox
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left - go to previous (RTL)
        navigateLightbox('prev');
      } else {
        // Swiped right - go to next (RTL)
        navigateLightbox('next');
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox('next');
      if (e.key === 'ArrowRight') navigateLightbox('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto, closeLightbox, navigateLightbox]);

  const getBirdName = (birdId: string) => {
    return BIRDS_DATA[birdId]?.name || birdId;
  };

  const filteredBirdName = birdFilter ? getBirdName(birdFilter) : null;

  return (
    <Layout>
      <div data-ev-id="ev_9f11301f76" className="max-w-7xl mx-auto px-4 py-8">
        {/* כותרת */}
        <div data-ev-id="ev_271dec9178" className="text-center mb-8">
          <h1 data-ev-id="ev_d650c49d70" className="text-3xl font-bold text-forest mb-2 flex items-center justify-center gap-3">
            <Camera className="w-8 h-8" />
            {filteredBirdName ? `צילומי ${filteredBirdName}` : 'גלריית צילומים'}
          </h1>
          <p data-ev-id="ev_922c5b2a59" className="text-muted-foreground">
            צילומי דורסים מישראל | צילום: רענן ארבל
          </p>
          
          {birdFilter &&
          <div data-ev-id="ev_1ef47993c3" className="flex flex-row items-center justify-center gap-3 mt-4">
            <Link
              to={`/quiz?bird=${birdFilter}&from=gallery${fromQuiz ? '&fromQuiz=true' : ''}`}
              className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#e8f4e8] border border-[#c5e1c5] text-[#2c5f2e] rounded-lg hover:bg-[#d4edda] font-medium transition-colors text-sm">
              <ArrowRight className="w-4 h-4" />
              חזרה לכרטיס
            </Link>
            <Link
              to="/gallery"
              className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] font-medium transition-colors text-sm">
              <Camera className="w-4 h-4" />
              כל הצילומים
            </Link>
          </div>
          }
        </div>

        {/* פילטר משפחות */}
        {!birdFilter &&
        <div data-ev-id="ev_38353f38fb" className="mb-8">
            <div data-ev-id="ev_2a9c63af25" className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span data-ev-id="ev_b818d0d395">סינון לפי משפחה:</span>
            </div>
            <div data-ev-id="ev_5202cd3b30" className="flex flex-wrap gap-2">
              {FAMILIES.map((family) =>
            <button data-ev-id="ev_8a9237e7f6"
            key={family.id}
            onClick={() => setSelectedFamily(family.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedFamily === family.id ?
            'bg-forest text-white' :
            'bg-white text-forest-dark hover:bg-forest-light border border-forest/20'}`
            }>

                  {family.name}
                </button>
            )}
            </div>
          </div>
        }

        {/* גלריה */}
        {loading ?
        <div data-ev-id="ev_2f6284f37f" className="flex items-center justify-center py-20">
            <div data-ev-id="ev_fcaf94545c" className="animate-spin rounded-full h-12 w-12 border-4 border-forest border-t-transparent"></div>
          </div> :
        filteredPhotos.length === 0 ?
        <div data-ev-id="ev_6c4bd5b7d2" className="text-center py-20 text-muted-foreground">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p data-ev-id="ev_08275e8351" className="text-lg">אין צילומים להצגה</p>
            <p data-ev-id="ev_36356868b8" className="text-sm">צילומים חדשים יתווספו בקרוב</p>
          </div> :

        <div data-ev-id="ev_7aa5b077c4" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) =>
          <div data-ev-id="ev_34b3e066a9" key={photo.id} className="flex flex-col">
                <div data-ev-id="ev_28a6430612"
            onClick={() => openLightbox(photo)}
            className="group relative aspect-[4/3] rounded-t-xl overflow-hidden cursor-pointer shadow-card hover:shadow-xl transition-all hover:scale-[1.02]">

                  <img data-ev-id="ev_8ba4fbcc45"
              src={photo.image_url}
              alt={getBirdName(photo.bird_id)}
              className="w-full h-full object-cover"
              loading="lazy" />

                  <div data-ev-id="ev_666acf93c7" className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div data-ev-id="ev_97b27c6dfa" className="absolute bottom-0 right-0 left-0 p-4 text-white">
                      <h3 data-ev-id="ev_d0c0dd4046" className="font-bold text-lg">{getBirdName(photo.bird_id)}</h3>
                      <p data-ev-id="ev_13b418f0dd" className="text-sm text-white/80">{photo.family}</p>
                      {photo.caption &&
                  <p data-ev-id="ev_74dbeb3a82" className="text-sm text-white/70 mt-1">{photo.caption}</p>
                  }
                    </div>
                  </div>
                </div>
                <div data-ev-id="ev_aab6d48fef" className="bg-white rounded-b-xl px-3 py-2 shadow-card">
                  <p data-ev-id="ev_9f55b562a5" className="text-sm font-medium text-forest">{getBirdName(photo.bird_id)}</p>
                  <p data-ev-id="ev_c1ada3ab24" className="text-xs text-muted-foreground">צילום: {photo.photographer}</p>
                </div>
              </div>
          )}
          </div>
        }

        {/* Lightbox */}
        {lightboxPhoto &&
        <div data-ev-id="ev_c7a74429d7"
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={closeLightbox}>

            {/* כפתור סגירה */}
            <button data-ev-id="ev_73f57cc557"
          onClick={closeLightbox}
          className="absolute top-4 left-4 p-2 text-white/80 hover:text-white transition-colors z-10">

              <X className="w-8 h-8" />
            </button>

            {/* ניווט - desktop only */}
            {!isMobile &&
            <>
            <button data-ev-id="ev_ec1fa60c4e"
          onClick={(e) => {e.stopPropagation();navigateLightbox('prev');}}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-colors shadow-lg">

              <ChevronRight className="w-8 h-8" />
            </button>
            <button data-ev-id="ev_21de55b760"
          onClick={(e) => {e.stopPropagation();navigateLightbox('next');}}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-colors shadow-lg">

              <ChevronLeft className="w-8 h-8" />
            </button>
            </>
            }

            {/* תמונה עם זכוכית מגדלת */}
            <div data-ev-id="ev_9b004f1b68"
          className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>

              <ImageMagnifier
              src={lightboxPhoto.image_url}
              alt={getBirdName(lightboxPhoto.bird_id)}
              magnifierSize={180}
              zoomLevel={3} />


              <div data-ev-id="ev_78b4762ba1" className="mt-4 text-center text-white">
                <h3 data-ev-id="ev_66cbd45a1e" className="font-bold text-xl">{getBirdName(lightboxPhoto.bird_id)}</h3>
                <p data-ev-id="ev_56fc73a1e1" className="text-white/70">{lightboxPhoto.family}</p>
                {lightboxPhoto.caption &&
              <p data-ev-id="ev_90e3a55c17" className="text-white/60 mt-2">{lightboxPhoto.caption}</p>
              }
                <p data-ev-id="ev_bfef1a92fe" className="text-sm text-white/50 mt-2">צילום: {lightboxPhoto.photographer}</p>
              </div>
            </div>

            {/* Thumbnail strip */}
            {filteredPhotos.length > 1 &&
          <div data-ev-id="ev_f0bef22a49" className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
                {filteredPhotos.map((photo, idx) =>
            <button data-ev-id="ev_a4415e6f5e"
            key={photo.id}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(idx);
              setLightboxPhoto(photo);
            }}
            className={`w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
            idx === lightboxIndex ?
            'border-white scale-110' :
            'border-transparent opacity-60 hover:opacity-100'}`
            }>

                    <img data-ev-id="ev_78cfc17378"
              src={photo.image_url}
              alt=""
              className="w-full h-full object-cover" />

                  </button>
            )}
              </div>
          }
          </div>
        }
      </div>
    </Layout>);

}