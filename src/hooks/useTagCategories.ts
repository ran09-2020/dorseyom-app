import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TagCategory {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useTagCategories() {
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!supabase) {
      setError('Database not enabled');
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('tag_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string) => {
    if (!supabase) return null;

    const maxOrder = categories.length > 0 
      ? Math.max(...categories.map(c => c.sort_order)) + 1 
      : 0;

    const { data, error: insertError } = await supabase
      .from('tag_categories')
      .insert({ name, sort_order: maxOrder })
      .select()
      .single();

    if (insertError) throw insertError;
    await fetchCategories();
    return data;
  };

  const updateCategory = async (id: string, name: string) => {
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from('tag_categories')
      .update({ name })
      .eq('id', id);

    if (updateError) throw updateError;
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!supabase) return;

    const { error: deleteError } = await supabase
      .from('tag_categories')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    await fetchCategories();
  };

  const reorderCategories = async (reorderedCategories: TagCategory[]) => {
    if (!supabase) return;

    const updates = reorderedCategories.map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      sort_order: index
    }));

    for (const update of updates) {
      await supabase
        .from('tag_categories')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id);
    }

    await fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    refetch: fetchCategories
  };
}
