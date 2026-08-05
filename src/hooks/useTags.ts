import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tag {
  id: string;
  category_id: string;
  label: string;
  attr: string;
  attr_value: boolean;
  has_custom_list: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TagInput {
  category_id: string;
  label: string;
  attr: string;
  attr_value?: boolean;
  has_custom_list?: boolean;
}

export function useTags(categoryId?: string) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    if (!supabase) {
      setError('Database not enabled');
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('tags')
        .select('*')
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTags(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const addTag = async (input: TagInput) => {
    if (!supabase) return null;

    const categoryTags = tags.filter(t => t.category_id === input.category_id);
    const maxOrder = categoryTags.length > 0 
      ? Math.max(...categoryTags.map(t => t.sort_order)) + 1 
      : 0;

    const { data, error: insertError } = await supabase
      .from('tags')
      .insert({
        category_id: input.category_id,
        label: input.label,
        attr: input.attr,
        attr_value: input.attr_value ?? true,
        has_custom_list: input.has_custom_list ?? false,
        sort_order: maxOrder
      })
      .select()
      .single();

    if (insertError) throw insertError;
    await fetchTags();
    return data;
  };

  const updateTag = async (id: string, updates: Partial<TagInput>) => {
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id);

    if (updateError) throw updateError;
    await fetchTags();
  };

  const deleteTag = async (id: string) => {
    if (!supabase) return;

    const { error: deleteError } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    await fetchTags();
  };

  const reorderTags = async (reorderedTags: Tag[]) => {
    if (!supabase) return;

    for (let i = 0; i < reorderedTags.length; i++) {
      await supabase
        .from('tags')
        .update({ sort_order: i })
        .eq('id', reorderedTags[i].id);
    }

    await fetchTags();
  };

  const moveTagToCategory = async (tagId: string, newCategoryId: string) => {
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from('tags')
      .update({ category_id: newCategoryId })
      .eq('id', tagId);

    if (updateError) throw updateError;
    await fetchTags();
  };

  return {
    tags,
    loading,
    error,
    addTag,
    updateTag,
    deleteTag,
    reorderTags,
    moveTagToCategory,
    refetch: fetchTags
  };
}
