import { useState } from 'react';
import { Plus, GripVertical, Pencil, Trash2, Check, X, ChevronLeft } from 'lucide-react';
import type { TagCategory } from '@/hooks/useTagCategories';

interface TagCategoryListProps {
  categories: TagCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onAddCategory: (name: string) => Promise<void>;
  onUpdateCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onReorderCategories: (categories: TagCategory[]) => Promise<void>;
}

export function TagCategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories
}: TagCategoryListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await onAddCategory(newName.trim());
    setNewName('');
    setIsAdding(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    await onUpdateCategory(id, editingName.trim());
    setEditingId(null);
    setEditingName('');
  };

  const startEdit = (category: TagCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...categories];
    const [removed] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, removed);
    setDraggedIndex(index);
    onReorderCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div data-ev-id="ev_63b5d03053" className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div data-ev-id="ev_e51871fa26" className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 data-ev-id="ev_0820563ed6" className="font-bold text-gray-900">קטגוריות</h3>
        <button data-ev-id="ev_b134998cec"
        onClick={() => setIsAdding(true)}
        className="p-1.5 text-forest hover:bg-forest/10 rounded-lg transition-colors"
        title="הוסף קטגוריה">

          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div data-ev-id="ev_8dc61c6447" className="divide-y divide-gray-100">
        {isAdding &&
        <div data-ev-id="ev_1b70a2943f" className="p-3 bg-green-50 flex items-center gap-2">
            <input data-ev-id="ev_3a1d81c530"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="שם הקטגוריה"
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          autoFocus />

            <button data-ev-id="ev_7aea61c34d" onClick={handleAdd} className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg">
              <Check className="w-4 h-4" />
            </button>
            <button data-ev-id="ev_9e1ac85d2c" onClick={() => {setIsAdding(false);setNewName('');}} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        }

        {categories.map((category, index) =>
        <div data-ev-id="ev_3637bb4d0e"
        key={category.id}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        className={`flex items-center gap-2 p-3 cursor-pointer transition-colors ${
        selectedCategoryId === category.id ?
        'bg-forest/10 border-r-4 border-forest' :
        'hover:bg-gray-50'} ${
        draggedIndex === index ? 'opacity-50' : ''}`}>

            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />

            {editingId === category.id ?
          <div data-ev-id="ev_177d2d464f" className="flex-1 flex items-center gap-2">
                <input data-ev-id="ev_e2f2c5f3ad"
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(category.id)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            autoFocus />

                <button data-ev-id="ev_af12c70e8a" onClick={() => handleUpdate(category.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                  <Check className="w-4 h-4" />
                </button>
                <button data-ev-id="ev_f397a76edf" onClick={() => setEditingId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div> :

          <>
                <span data-ev-id="ev_b2bdb924ba"
            onClick={() => onSelectCategory(category.id)}
            className="flex-1 text-sm font-medium text-gray-700">

                  {category.name}
                </span>
                <button data-ev-id="ev_5809b0e479"
            onClick={(e) => {e.stopPropagation();startEdit(category);}}
            className="p-1 text-gray-400 hover:text-forest hover:bg-forest/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">

                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button data-ev-id="ev_54c6ff9aeb"
            onClick={(e) => {e.stopPropagation();onDeleteCategory(category.id);}}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">

                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </>
          }
          </div>
        )}

        {categories.length === 0 && !isAdding &&
        <div data-ev-id="ev_554b9e18be" className="p-8 text-center text-gray-500 text-sm">
            אין קטגוריות עדיין
          </div>
        }
      </div>
    </div>);

}