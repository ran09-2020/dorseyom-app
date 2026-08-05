import { X } from 'lucide-react';
import wingPosturesImage from '@/assets/uploads/wing-postures.png';
import diagramMarkings from '@/assets/uploads/diagram-markings.jpg';
import diagramTails from '@/assets/uploads/diagram-tails.jpg';
import diagramLanterns from '@/assets/uploads/diagram-lanterns.jpg';
import diagramRump from '@/assets/uploads/diagram-rump.jpg';
import diagramWings from '@/assets/uploads/diagram-wings.jpg';
import diagramTwoToneWings from '@/assets/uploads/diagram-two-tone-wings.png';
import diagramForwardWrist from '@/assets/uploads/forward-wrist-diagram.png';
import diagramBrightWindows from '@/assets/uploads/bright-windows-diagram.png';
import diagramCrescent from '@/assets/uploads/crescent-diagram.png';
import diagramHelmetMoustache from '@/assets/uploads/helmet_moustache.png';
import type { DiagramType } from '@/types/diagrams';

export type { DiagramType };

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintType: DiagramType;
}

const DIAGRAMS: Record<Exclude<DiagramType, null>, {image: string;title: string;alt: string;}> = {
  wing_posture: {
    image: wingPosturesImage,
    title: 'מנחי כנף בגלישה',
    alt: 'תרשים מנחי כנפיים בגלישה - V עמוק, V רדוד, שטוח, שמוט'
  },
  markings: {
    image: diagramMarkings,
    title: 'סימונים ודגמים',
    alt: 'תרשים סימונים על גוף דורס - כתם בפרק, מכנסיים, אצבעות, פסים'
  },
  tails: {
    image: diagramTails,
    title: 'צורות זנב',
    alt: 'תרשים צורות זנב - מרובע, ארוך, מעויין, קצר, מזולג, משולש'
  },
  lanterns: {
    image: diagramLanterns,
    title: 'אורות נחיתה',
    alt: 'תרשים אורות נחיתה - פנסים לבנים בבסיס הכנף של עיט גמדי'
  },
  rump: {
    image: diagramRump,
    title: 'על-שת לבן',
    alt: 'תרשים על-שת לבן - כתם לבן בבסיס הזנב'
  },
  wing_shapes: {
    image: diagramWings,
    title: 'צורות כנף',
    alt: 'תרשים צורות כנף - כנפיים מחודדות כמו בז לעומת כנפיים רחבות עם אצבעות כמו עיט'
  },
  two_tone_wings: {
    image: diagramTwoToneWings,
    title: 'כנפיים דו-גוניות',
    alt: 'תרשים כנפיים דו-גוניות - רחם מדברי, שלך ועיט גמדי עם כנפיים לבנות מקדימה ושחורות מאחורה'
  },
  forward_wrist: {
    image: diagramForwardWrist,
    title: 'מפרקים משוכים קדימה',
    alt: 'תרשים המראה מפרק כנף משוך קדימה (מרפק), כנפיים מכופפות מטה (שבירה וקשת מטה), וקצות כנפיים סגורים ומחודדים'
  },
  bright_windows: {
    image: diagramBrightWindows,
    title: 'חלונות בהירים',
    alt: 'תרשים עקב עם סימון חלונות בהירים על הכנפיים'
  },
  crescent: {
    image: diagramCrescent,
    title: 'סהר בהיר',
    alt: 'תרשים עקב עם סימון סהר בהיר על החזה'
  },
  helmet_moustache: {
    image: diagramHelmetMoustache,
    title: 'קסדה ושפם',
    alt: 'תרשים המראה קסדה ושפם על בז נודד - קסדה היא כיסוי כהה בראש, שפם הוא פס כהה יורד מהמקור לאורך הלחי'
  }
};

export function HintModal({ isOpen, onClose, hintType }: HintModalProps) {
  if (!isOpen || !hintType) return null;

  const diagram = DIAGRAMS[hintType];
  if (!diagram) return null;

  return (
    <div data-ev-id="ev_a96d5b5950"
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    onClick={onClose}>

      <div data-ev-id="ev_61910b81ae"
      className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden relative shadow-xl"
      onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div data-ev-id="ev_ab6d472265" className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 data-ev-id="ev_b306768031" className="font-bold text-lg text-forest">{diagram.title}</h3>
          <button data-ev-id="ev_b2a6c94198"
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          onClick={onClose}>

            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Image */}
        <div data-ev-id="ev_edca3013a1" className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          <img data-ev-id="ev_2b6378e7db"
          src={diagram.image}
          alt={diagram.alt}
          className="w-full rounded-lg" />

        </div>
      </div>
    </div>);

}

// Export diagram data for use in Glossary
export { DIAGRAMS };