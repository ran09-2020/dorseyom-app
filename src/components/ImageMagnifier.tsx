import { useState, useRef, useEffect } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  magnifierSize?: number;
  zoomLevel?: number;
}

export function ImageMagnifier({
  src,
  alt,
  magnifierSize = 150,
  zoomLevel = 2.5
}: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [imgBounds, setImgBounds] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // זיהוי מכשיר מובייל
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setImgBounds({ width, height });
    }
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMobile) return;
    if (!imgRef.current) return;

    const { left, top } = imgRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setMagnifierPos({ x, y });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setShowMagnifier(false);
  };

  const handleClick = () => {
    if (isMobile) {
      setMobileZoom(!mobileZoom);
    }
  };

  // מובייל - הגדלה בלחיצה
  if (isMobile) {
    return (
      <div data-ev-id="ev_e65b5fc9dc" className="relative inline-block overflow-auto max-w-full max-h-[75vh]">
        <img data-ev-id="ev_4a09624e31"
        ref={imgRef}
        src={src}
        alt={alt}
        className="max-w-full max-h-[75vh] object-contain rounded-lg transition-transform duration-300"
        style={{
          transform: mobileZoom ? `scale(${zoomLevel})` : 'scale(1)',
          transformOrigin: 'center center',
          cursor: mobileZoom ? 'zoom-out' : 'zoom-in'
        }}
        onClick={handleClick} />
      </div>);

  }

  // דסקטופ - זכוכית מגדלת
  return (
    <div data-ev-id="ev_a38b46bcb4" className="relative inline-block">
      <img data-ev-id="ev_dbea56ace4"
      ref={imgRef}
      src={src}
      alt={alt}
      className="max-w-full max-h-[75vh] object-contain rounded-lg cursor-none"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave} />

      
      {showMagnifier &&
      <div data-ev-id="ev_5f225c4a7f"
      className="absolute pointer-events-none border-4 border-white shadow-2xl"
      style={{
        width: magnifierSize,
        height: magnifierSize,
        borderRadius: '50%',
        left: magnifierPos.x - magnifierSize / 2,
        top: magnifierPos.y - magnifierSize / 2,
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${imgBounds.width * zoomLevel}px ${imgBounds.height * zoomLevel}px`,
        backgroundPosition: `-${magnifierPos.x * zoomLevel - magnifierSize / 2}px -${magnifierPos.y * zoomLevel - magnifierSize / 2}px`,
        boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.2)'
      }} />

      }
    </div>);

}