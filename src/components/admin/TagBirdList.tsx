import { useState } from 'react';
import { Plus, GripVertical, Pencil, Trash2, Check, X, Search, Eye } from 'lucide-react';
import type { TagBird, TagBirdInput } from '@/hooks/useTagBirds';
import type { Tag } from '@/hooks/useTags';
import { BIRDS as birdsData } from '@/data/birds';

interface TagBirdListProps {
  tagBirds: TagBird[];
  tag: Tag;
  onAddTagBird: (input: TagBirdInput) => Promise<void>;
  onUpdateTagBird: (id: string, updates: {note?: string;}) => Promise<void>;
  onDeleteTagBird: (id: string) => Promise<void>;
  onReorderTagBirds: (birds: TagBird[]) => Promise<void>;
  onConvertToAutomatic?: () => void;
}

export function TagBirdList({
  tagBirds,
  tag,
  onAddTagBird,
  onUpdateTagBird,
  onDeleteTagBird,
  onReorderTagBirds,
  onConvertToAutomatic
}: TagBirdListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const currentTagBirds = tagBirds.filter((tb) => tb.tag_id === tag.id);
  const existingBirdIds = new Set(currentTagBirds.map((tb) => tb.bird_id));

  const allBirds = Object.entries(birdsData).map(([id, bird]) => ({
    id,
    name: bird.name,
    latin: bird.latin
  }));

  const filteredBirds = allBirds.filter((bird) => {
    if (existingBirdIds.has(bird.id)) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return bird.name.includes(query) || bird.latin.toLowerCase().includes(query);
  });

  const handleAddBird = async (birdId: string) => {
    await onAddTagBird({
      tag_id: tag.id,
      bird_id: birdId
    });
    setSearchQuery('');
  };

  const handleUpdateNote = async (id: string) => {
    await onUpdateTagBird(id, { note: editingNote });
    setEditingId(null);
    setEditingNote('');
  };

  const startEditNote = (tagBird: TagBird) => {
    setEditingId(tagBird.id);
    setEditingNote(tagBird.note || '');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newBirds = [...currentTagBirds];
    const [removed] = newBirds.splice(draggedIndex, 1);
    newBirds.splice(index, 0, removed);
    setDraggedIndex(index);
    onReorderTagBirds(newBirds);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getBirdName = (birdId: string) => {
    return birdsData[birdId]?.name || birdId;
  };

  return (
    <div data-ev-id="ev_3fc31ffabc" className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div data-ev-id="ev_2d724c5712" className="p-4 border-b border-gray-100">
        <h3 data-ev-id="ev_2181a40993" className="font-bold text-gray-900">דורסים: {tag.label}</h3>
        <p data-ev-id="ev_8b54aa7853" className="text-xs text-gray-500 mt-1">רשימת הדורסים שיוצגו כאשר נבחר תג זה</p>
      </div>

      {/* Add bird search */}
      <div data-ev-id="ev_7af4366c9b" className="p-3 border-b border-gray-100 bg-gray-50">
        <div data-ev-id="ev_28eeab920c" className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input data-ev-id="ev_142403ba0c"
          type="text"
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value);setIsAdding(true);}}
          onFocus={() => setIsAdding(true)}
          placeholder="חפש דורס להוספה..."
          className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm" />

        </div>

        {isAdding && searchQuery.trim() &&
        <div data-ev-id="ev_372fa06982" className="mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
            {filteredBirds.slice(0, 10).map((bird) =>
          <button data-ev-id="ev_9d0dd9334e"
          key={bird.id}
          onClick={() => handleAddBird(bird.id)}
          className="w-full px-3 py-2 text-right hover:bg-forest/10 transition-colors flex items-center justify-between">

                <span data-ev-id="ev_bf63b3278a" className="text-sm font-medium text-gray-700">{bird.name}</span>
                <span data-ev-id="ev_d668c1a9a6" className="text-xs text-gray-400">{bird.latin}</span>
              </button>
          )}
            {filteredBirds.length === 0 &&
          <div data-ev-id="ev_f460f58e25" className="px-3 py-2 text-sm text-gray-500 text-center">
                לא נמצאו דורסים
              </div>
          }
          </div>
        }
      </div>

      {/* Bird list */}
      <div data-ev-id="ev_2649904420" className="divide-y divide-gray-100">
        {currentTagBirds.map((tagBird, index) =>
        <div data-ev-id="ev_e1677160a6"
        key={tagBird.id}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        className={`flex items-center gap-2 p-3 transition-colors hover:bg-gray-50 ${
        draggedIndex === index ? 'opacity-50' : ''}`
        }>

            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />

            <div data-ev-id="ev_d3fdf2c179" className="flex-1">
              <div data-ev-id="ev_81034438c2" className="text-sm font-medium text-gray-700">{getBirdName(tagBird.bird_id)}</div>
              {editingId === tagBird.id ?
            <div data-ev-id="ev_c41ac804e9" className="flex items-center gap-2 mt-1">
                  <input data-ev-id="ev_da47e0b8f1"
              type="text"
              value={editingNote}
              onChange={(e) => setEditingNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateNote(tagBird.id)}
              placeholder="הערה (לא חובה)"
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
              autoFocus />

                  <button data-ev-id="ev_c42b8e22f9" onClick={() => handleUpdateNote(tagBird.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button data-ev-id="ev_de711a2888" onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div> :

            tagBird.note &&
            <div data-ev-id="ev_4c2a5559a8" className="text-xs text-amber-600 mt-0.5">{tagBird.note}</div>

            }
            </div>

            {editingId !== tagBird.id &&
          <>
                <button data-ev-id="ev_44e5674a53"
            onClick={() => startEditNote(tagBird)}
            className="p-1 text-gray-400 hover:text-forest hover:bg-forest/10 rounded"
            title="ערוך הערה">

                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button data-ev-id="ev_845fd969cb"
            onClick={() => onDeleteTagBird(tagBird.id)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            title="הסר">

                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
          }
          </div>
        )}

        {currentTagBirds.length === 0 &&
        <div data-ev-id="ev_fa0c85a324" className="p-8 text-center text-gray-500 text-sm">
            אין דורסים ברשימה.<br data-ev-id="ev_e75c2a66b2" />
            <span data-ev-id="ev_3206d0357e" className="text-xs">חפש והוסף דורסים למעלה</span>
          </div>
        }
      </div>

      <div data-ev-id="ev_333aaa7bbd" className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span data-ev-id="ev_043231c04d" className="text-xs text-gray-500">
          {currentTagBirds.length} דורסים ברשימה
        </span>
        {onConvertToAutomatic &&
        <button data-ev-id="ev_94eaf9ecf1"
        onClick={onConvertToAutomatic}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors">

            <Eye className="w-3.5 h-3.5" />
            חזור לסינון אוטומטי
          </button>
        }
      </div>
    </div>);

}