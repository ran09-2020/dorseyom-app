import { useState, useEffect } from 'react';
import { useTagCategories } from '@/hooks/useTagCategories';
import { useTags } from '@/hooks/useTags';
import { useTagBirds } from '@/hooks/useTagBirds';
import { TagCategoryList } from './TagCategoryList';
import { TagList } from './TagList';
import { TagBirdList } from './TagBirdList';
import { TagBirdPreview } from './TagBirdPreview';
import { Loader2, AlertCircle, Tags } from 'lucide-react';

export function TagManagement() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error';text: string;} | null>(null);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
  } = useTagCategories();

  const {
    tags,
    loading: tagsLoading,
    addTag,
    updateTag,
    deleteTag,
    reorderTags
  } = useTags();

  const {
    tagBirds,
    loading: tagBirdsLoading,
    addTagBird,
    updateTagBird,
    deleteTagBird,
    reorderTagBirds
  } = useTagBirds();

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedTag = tags.find((t) => t.id === selectedTagId);

  // Reset selections when data changes
  useEffect(() => {
    if (selectedCategoryId && !categories.find((c) => c.id === selectedCategoryId)) {
      setSelectedCategoryId(null);
      setSelectedTagId(null);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (selectedTagId && !tags.find((t) => t.id === selectedTagId)) {
      setSelectedTagId(null);
    }
  }, [tags, selectedTagId]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCategory = async (name: string) => {
    try {
      await addCategory(name);
      showMessage('success', 'הקטגוריה נוספה בהצלחה');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בהוספת קטגוריה');
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    try {
      await updateCategory(id, name);
      showMessage('success', 'הקטגוריה עודכנה');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בעדכון קטגוריה');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('למחוק את הקטגוריה? כל התגים שלה יימחקו גם.')) return;
    try {
      await deleteCategory(id);
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
        setSelectedTagId(null);
      }
      showMessage('success', 'הקטגוריה נמחקה');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה במחיקת קטגוריה');
    }
  };

  const handleAddTag = async (input: Parameters<typeof addTag>[0]) => {
    try {
      await addTag(input);
      showMessage('success', 'התג נוסף בהצלחה');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בהוספת תג');
    }
  };

  const handleUpdateTag = async (id: string, updates: Parameters<typeof updateTag>[1]) => {
    try {
      await updateTag(id, updates);
      showMessage('success', 'התג עודכן');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בעדכון תג');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('למחוק את התג?')) return;
    try {
      await deleteTag(id);
      if (selectedTagId === id) {
        setSelectedTagId(null);
      }
      showMessage('success', 'התג נמחק');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה במחיקת תג');
    }
  };

  const handleAddTagBird = async (input: Parameters<typeof addTagBird>[0]) => {
    try {
      await addTagBird(input);
      showMessage('success', 'הדורס נוסף לרשימה');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בהוספת דורס');
    }
  };

  const handleUpdateTagBird = async (id: string, updates: Parameters<typeof updateTagBird>[1]) => {
    try {
      await updateTagBird(id, updates);
      showMessage('success', 'ההערה עודכנה');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בעדכון הערה');
    }
  };

  const handleDeleteTagBird = async (id: string) => {
    try {
      await deleteTagBird(id);
      showMessage('success', 'הדורס הוסר מהרשימה');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בהסרת דורס');
    }
  };

  const handleConvertToManual = async (tagId: string, birdIds: string[]) => {
    try {
      // First update the tag to manual list
      await updateTag(tagId, { has_custom_list: true });
      
      // Then add all the birds
      for (let i = 0; i < birdIds.length; i++) {
        await addTagBird({
          tag_id: tagId,
          bird_id: birdIds[i],
          sort_order: i
        });
      }
      
      showMessage('success', `הומר לרשימה ידנית עם ${birdIds.length} דורסים`);
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'שגיאה בהמרה');
    }
  };

  if (categoriesLoading || tagsLoading || tagBirdsLoading) {
    return (
      <div data-ev-id="ev_7a6783d239" className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>);

  }

  if (categoriesError) {
    return (
      <div data-ev-id="ev_2be1f56f55" className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p data-ev-id="ev_fcca07e42d" className="text-red-700">{categoriesError}</p>
      </div>);

  }

  return (
    <div data-ev-id="ev_ec73cc804c" className="space-y-6">
      {/* Header */}
      <div data-ev-id="ev_d2d76cf9e2" className="bg-white rounded-2xl shadow-card p-6">
        <h2 data-ev-id="ev_23b9ab720b" className="text-lg font-bold mb-2 flex items-center gap-2">
          <Tags className="w-5 h-5" />
          ניהול תיוגים
        </h2>
        <p data-ev-id="ev_7f9d8a9d1c" className="text-sm text-gray-600">
          נהל קטגוריות, תגים ורשימות דורסים מותאמות. שנויים נשמרים אוטומטית.
        </p>
      </div>

      {/* Message */}
      {message &&
      <div data-ev-id="ev_1d33e52132" className={`p-4 rounded-xl text-sm font-medium ${
      message.type === 'success' ?
      'bg-green-50 text-green-700 border border-green-200' :
      'bg-red-50 text-red-700 border border-red-200'}`
      }>
          {message.text}
        </div>
      }

      {/* Three column layout */}
      <div data-ev-id="ev_72461f8032" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Categories column */}
        <TagCategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onReorderCategories={reorderCategories} />


        {/* Tags column */}
        {selectedCategory ?
        <TagList
          tags={tags}
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          selectedTagId={selectedTagId}
          onSelectTag={(id) => setSelectedTagId(id)}
          onAddTag={handleAddTag}
          onUpdateTag={handleUpdateTag}
          onDeleteTag={handleDeleteTag}
          onReorderTags={reorderTags} /> :


        <div data-ev-id="ev_474610476a" className="bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center p-8">
            <p data-ev-id="ev_61d386867e" className="text-gray-500 text-sm text-center">בחר קטגוריה כדי לראות את התגים שלה</p>
          </div>
        }

        {/* Bird list column */}
        {selectedTag ?
        selectedTag.has_custom_list ?
        <TagBirdList
          tagBirds={tagBirds}
          tag={selectedTag}
          onAddTagBird={handleAddTagBird}
          onUpdateTagBird={handleUpdateTagBird}
          onDeleteTagBird={handleDeleteTagBird}
          onReorderTagBirds={reorderTagBirds}
          onConvertToAutomatic={() => handleUpdateTag(selectedTag.id, { has_custom_list: false })}
        /> :


        <TagBirdPreview
          tag={selectedTag}
          onConvertToManual={(birdIds) => handleConvertToManual(selectedTag.id, birdIds)}
        /> :


        <div data-ev-id="ev_b467f79955" className="bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center p-8">
            <p data-ev-id="ev_64cac5fcb2" className="text-gray-500 text-sm text-center">
              בחר תג כדי לראות את הדורסים שיוצגו
            </p>
          </div>
        }
      </div>
    </div>);

}