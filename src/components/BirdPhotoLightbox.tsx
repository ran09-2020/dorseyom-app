import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ImageMagnifier } from './ImageMagnifier';

interface Photo {
  id: string;
  image_url: string;
  photographer: string | null;
  caption: string | null;
}

interface BirdPhotoLightboxProps {
  birdId: string | null;
  birdName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BirdPhotoLightbox({ birdId, birdName, isOpen, onClose }: BirdPhotoLightboxProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
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

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left - go to previous (RTL)
        goPrev();
      } else {
        // Swiped right - go to next (RTL)
        goNext();
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Fetch photos when lightbox opens
  useEffect(() => {
    if (!isOpen || !birdId || !supabase) {
      setPhotos([]);
      setCurrentIndex(0);
      return;
    }

    async function fetchPhotos() {
      setLoading(true);
      const { data, error } = await supabase.
      from('photos').
      select('id, image_url, photographer, caption').
      eq('bird_id', birdId).
      order('sort_order', { ascending: true });

      if (!error && data) {
        setPhotos(data);
      }
      setLoading(false);
    }

    fetchPhotos();
  }, [isOpen, birdId]);

  const goNext = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const goPrev = () => {
    if (photos.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goNext();
      if (e.key === 'ArrowRight') goPrev();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, photos.length, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div data-ev-id="ev_2f6191a53d"
    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
    onClick={onClose}>

      {/* Close button */}
      <button data-ev-id="ev_f57475ad00"
      onClick={onClose}
      className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
      aria-label="סגור">

        <X className="w-6 h-6" />
      </button>

      {/* Bird name header */}
      <div data-ev-id="ev_6e7dd4cd13" className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-lg font-bold bg-black/50 px-4 py-2 rounded-full">
        {birdName}
      </div>

      {loading ?
      <div data-ev-id="ev_4f47de3959" className="text-white flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span data-ev-id="ev_c323e952d5">טוען תמונות...</span>
        </div> :
      photos.length === 0 ?
      <div data-ev-id="ev_8c59ec8254" className="text-white text-center">
          <p data-ev-id="ev_c96c95a94a" className="text-xl mb-2">אין תמונות זמינות</p>
          <p data-ev-id="ev_9ef66940c8" className="text-gray-400">לדורס זה עדיין לא הועלו תמונות</p>
        </div> :

      <>
          {/* Navigation arrows - desktop only */}
          {photos.length > 1 && !isMobile &&
        <>
              <button data-ev-id="ev_964cf72ca1"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-colors shadow-lg"
          aria-label="התמונה הבאה">

                <ChevronLeft className="w-8 h-8" />
              </button>
              <button data-ev-id="ev_9c81fb68ea"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-colors shadow-lg"
          aria-label="התמונה הקודמת">

                <ChevronRight className="w-8 h-8" />
              </button>
            </>
        }

          {/* Main image */}
          <div data-ev-id="ev_f5fec90543"
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>

            <ImageMagnifier
            src={currentPhoto.image_url}
            alt={birdName}
            magnifierSize={180}
            zoomLevel={3} />


            {/* Photo info */}
            <div data-ev-id="ev_02aaae89ac" className="text-white text-center mt-4">
              {currentPhoto.photographer &&
            <p data-ev-id="ev_3217ead72f" className="text-sm text-gray-300">📷 {currentPhoto.photographer}</p>
            }
              {currentPhoto.caption &&
            <p data-ev-id="ev_aab81d52d7" className="text-sm text-gray-400 mt-1">{currentPhoto.caption}</p>
            }
              {photos.length > 1 &&
            <p data-ev-id="ev_1d93dcbc4a" className="text-xs text-gray-500 mt-2">
                  {currentIndex + 1} / {photos.length}
                </p>
            }
            </div>
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 &&
        <div data-ev-id="ev_e5471d2d91" className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
              {photos.map((photo, idx) =>
          <button data-ev-id="ev_acc16b1432"
          key={photo.id}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(idx);
          }}
          className={`w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
          idx === currentIndex ?
          'border-white scale-110' :
          'border-transparent opacity-60 hover:opacity-100'}`
          }>

                  <img data-ev-id="ev_95d24a47b6"
            src={photo.image_url}
            alt=""
            className="w-full h-full object-cover" />

                </button>
          )}
            </div>
        }
        </>
      }
    </div>);

}