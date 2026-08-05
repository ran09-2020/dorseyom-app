import { useState } from 'react';
import { Plus, GripVertical, Pencil, Trash2, Check, X, List, ChevronLeft, Eye } from 'lucide-react';
import type { Tag, TagInput } from '@/hooks/useTags';

interface TagListProps {
  tags: Tag[];
  categoryId: string;
  categoryName: string;
  selectedTagId: string | null;
  onSelectTag: (id: string) => void;
  onAddTag: (input: TagInput) => Promise<void>;
  onUpdateTag: (id: string, updates: Partial<TagInput>) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
  onReorderTags: (tags: Tag[]) => Promise<void>;
}

export function TagList({
  tags,
  categoryId,
  categoryName,
  selectedTagId,
  onSelectTag,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
  onReorderTags
}: TagListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAttr, setNewAttr] = useState('');
  const [newHasCustomList, setNewHasCustomList] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [editingAttr, setEditingAttr] = useState('');
  const [editingHasCustomList, setEditingHasCustomList] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const categoryTags = tags.filter((t) => t.category_id === categoryId);

  const handleAdd = async () => {
    if (!newLabel.trim() || !newAttr.trim()) return;
    await onAddTag({
      category_id: categoryId,
      label: newLabel.trim(),
      attr: newAttr.trim(),
      has_custom_list: newHasCustomList
    });
    setNewLabel('');
    setNewAttr('');
    setNewHasCustomList(false);
    setIsAdding(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editingLabel.trim() || !editingAttr.trim()) return;
    await onUpdateTag(id, {
      label: editingLabel.trim(),
      attr: editingAttr.trim(),
      has_custom_list: editingHasCustomList
    });
    setEditingId(null);
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingLabel(tag.label);
    setEditingAttr(tag.attr);
    setEditingHasCustomList(tag.has_custom_list);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTags = [...categoryTags];
    const [removed] = newTags.splice(draggedIndex, 1);
    newTags.splice(index, 0, removed);
    setDraggedIndex(index);
    onReorderTags(newTags);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div data-ev-id="ev_069a3d9e07" className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div data-ev-id="ev_f6942dd220" className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 data-ev-id="ev_4c6c1cef8b" className="font-bold text-gray-900">תגים: {categoryName}</h3>
        <button data-ev-id="ev_6162195084"
        onClick={() => setIsAdding(true)}
        className="p-1.5 text-forest hover:bg-forest/10 rounded-lg transition-colors"
        title="הוסף תג">

          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div data-ev-id="ev_458aec6419" className="divide-y divide-gray-100">
        {isAdding &&
        <div data-ev-id="ev_6c6320609d" className="p-3 bg-green-50 space-y-2">
            <input data-ev-id="ev_4acb63ec14"
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="תווית התג (עברית)"
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          autoFocus />

            <input data-ev-id="ev_935f70fbaa"
          type="text"
          value={newAttr}
          onChange={(e) => setNewAttr(e.target.value)}
          placeholder="מזהה התכונה (attr באנגלית)"
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-mono" />

            <label data-ev-id="ev_e54e29c789" className="flex items-center gap-2 text-sm text-gray-700">
              <input data-ev-id="ev_caa1b1dce4"
            type="checkbox"
            checked={newHasCustomList}
            onChange={(e) => setNewHasCustomList(e.target.checked)}
            className="rounded border-gray-300" />

              רשימת דורסים מותאמת
            </label>
            <div data-ev-id="ev_da40c1a57b" className="flex gap-2 justify-end">
              <button data-ev-id="ev_d32ff1460f" onClick={handleAdd} className="px-3 py-1.5 bg-forest text-white rounded-lg text-sm font-medium">
                הוסף
              </button>
              <button data-ev-id="ev_220c09f101" onClick={() => {setIsAdding(false);setNewLabel('');setNewAttr('');}} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
                ביטול
              </button>
            </div>
          </div>
        }

        {categoryTags.map((tag, index) =>
        <div data-ev-id="ev_04b1ebeb8d"
        key={tag.id}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        className={`flex items-center gap-2 p-3 cursor-pointer transition-colors ${
        selectedTagId === tag.id ?
        'bg-forest/10 border-r-4 border-forest' :
        'hover:bg-gray-50'} ${
        draggedIndex === index ? 'opacity-50' : ''}`}>

            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />

            {editingId === tag.id ?
          <div data-ev-id="ev_5aa766a39d" className="flex-1 space-y-2">
                <input data-ev-id="ev_54595ee824"
            type="text"
            value={editingLabel}
            onChange={(e) => setEditingLabel(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="תווית" />

                <input data-ev-id="ev_23b70c6677"
            type="text"
            value={editingAttr}
            onChange={(e) => setEditingAttr(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
            placeholder="attr" />

                <label data-ev-id="ev_020f8b272a" className="flex items-center gap-2 text-sm text-gray-700">
                  <input data-ev-id="ev_354307435a"
              type="checkbox"
              checked={editingHasCustomList}
              onChange={(e) => setEditingHasCustomList(e.target.checked)}
              className="rounded border-gray-300" />

                  רשימת דורסים מותאמת
                </label>
                <div data-ev-id="ev_972b82ffd7" className="flex gap-2">
                  <button data-ev-id="ev_1f63d4aecb" onClick={() => handleUpdate(tag.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button data-ev-id="ev_2650a8e06d" onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div> :

          <>
                <div data-ev-id="ev_b9e47db22f"
            onClick={() => onSelectTag(tag.id)}
            className="flex-1">

                  <div data-ev-id="ev_7a08986749" className="text-sm font-medium text-gray-700">{tag.label}</div>
                  <div data-ev-id="ev_9d0f34133d" className="text-xs text-gray-400 font-mono">{tag.attr}</div>
                </div>
                {tag.has_custom_list ? (
                  <List className="w-4 h-4 text-amber-500" title="רשימה ידנית" />
                ) : (
                  <Eye className="w-4 h-4 text-blue-500" title="סינון אוטומטי" />
                )}
                <button data-ev-id="ev_9399f1d003"
            onClick={(e) => {e.stopPropagation();startEdit(tag);}}
            className="p-1 text-gray-400 hover:text-forest hover:bg-forest/10 rounded">

                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button data-ev-id="ev_528ed8c9a5"
            onClick={(e) => {e.stopPropagation();onDeleteTag(tag.id);}}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">

                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </>
          }
          </div>
        )}

        {categoryTags.length === 0 && !isAdding &&
        <div data-ev-id="ev_c690696043" className="p-8 text-center text-gray-500 text-sm">
            אין תגים בקטגוריה זו
          </div>
        }
      </div>
    </div>);

}