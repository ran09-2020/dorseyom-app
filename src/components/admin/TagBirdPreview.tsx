import { BIRDS as birdsData } from '@/data/birds';
import type { Tag } from '@/hooks/useTags';
import { Eye, List } from 'lucide-react';

interface TagBirdPreviewProps {
  tag: Tag;
  onConvertToManual: (birdIds: string[]) => void;
}

export function TagBirdPreview({ tag, onConvertToManual }: TagBirdPreviewProps) {
  // Filter birds based on the tag's attribute
  const filteredBirds = Object.entries(birdsData).filter(([id, bird]) => {
    // Special case for medium size (not giant, not very_large, not small)
    if (tag.attr === '_medium') {
      const isGiant = bird.attrs['giant'] === true;
      const isVeryLarge = bird.attrs['very_large'] === true;
      const isSmall = bird.attrs['small'] === true;
      return !isGiant && !isVeryLarge && !isSmall;
    }

    // Regular attribute check
    return bird.attrs[tag.attr] === tag.attr_value;
  });

  return (
    <div data-ev-id="ev_22669b5c49" className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div data-ev-id="ev_0a443d0bda" className="p-4 border-b border-gray-100 bg-blue-50">
        <h3 data-ev-id="ev_b130be19f4" className="font-bold text-gray-900 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-500" />
          תצוגה מקדימה: {tag.label}
        </h3>
        <p data-ev-id="ev_ac0d230d88" className="text-xs text-blue-600 mt-1">
          סינון אוטומטי לפי תכונה: <code data-ev-id="ev_2fc4f61df2" className="bg-blue-100 px-1 rounded">{tag.attr}={String(tag.attr_value)}</code>
        </p>
      </div>

      <div data-ev-id="ev_7913e6bb50" className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {filteredBirds.map(([id, bird]) =>
        <div data-ev-id="ev_24e6d3d881"
        key={id}
        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">

            <div data-ev-id="ev_6b8c1e5047" className="flex-1">
              <div data-ev-id="ev_a8ae0c16f2" className="text-sm font-medium text-gray-700">{bird.name}</div>
              <div data-ev-id="ev_f732b1bf0b" className="text-xs text-gray-400">{bird.latin}</div>
            </div>
          </div>
        )}

        {filteredBirds.length === 0 &&
        <div data-ev-id="ev_f2b6803f94" className="p-8 text-center text-gray-500 text-sm">
            אין דורסים שמתאימים לסינון זה
          </div>
        }
      </div>

      <div data-ev-id="ev_5b78563875" className="p-3 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
        <span data-ev-id="ev_54b03efc2c" className="text-xs text-blue-600">
          {filteredBirds.length} דורסים מתאימים
        </span>
        <button data-ev-id="ev_690fa07ba2"
        onClick={() => onConvertToManual(filteredBirds.map(([id]) => id))}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors">

          <List className="w-3.5 h-3.5" />
          המר לרשימה ידנית
        </button>
      </div>
    </div>);

}