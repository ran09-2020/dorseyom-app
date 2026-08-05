import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TagBird {
  id: string;
  tag_id: string;
  bird_id: string;
  note: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TagBirdInput {
  tag_id: string;
  bird_id: string;
  note?: string;
}

export function useTagBirds(tagId?: string) {
  const [tagBirds, setTagBirds] = useState<TagBird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTagBirds = useCallback(async () => {
    if (!supabase) {
      setError('Database not enabled');
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('tag_birds')
        .select('*')
        .order('sort_order', { ascending: true });

      if (tagId) {
        query = query.eq('tag_id', tagId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTagBirds(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tag birds');
    } finally {
      setLoading(false);
    }
  }, [tagId]);

  useEffect(() => {
    fetchTagBirds();
  }, [fetchTagBirds]);

  const addTagBird = async (input: TagBirdInput) => {
    if (!supabase) return null;

    const currentTagBirds = tagBirds.filter(tb => tb.tag_id === input.tag_id);
    const maxOrder = currentTagBirds.length > 0 
      ? Math.max(...currentTagBirds.map(tb => tb.sort_order)) + 1 
      : 0;

    const { data, error: insertError } = await supabase
      .from('tag_birds')
      .insert({
        tag_id: input.tag_id,
        bird_id: input.bird_id,
        note: input.note || null,
        sort_order: maxOrder
      })
      .select()
      .single();

    if (insertError) throw insertError;
    await fetchTagBirds();
    return data;
  };

  const updateTagBird = async (id: string, updates: { note?: string }) => {
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from('tag_birds')
      .update({ note: updates.note || null })
      .eq('id', id);

    if (updateError) throw updateError;
    await fetchTagBirds();
  };

  const deleteTagBird = async (id: string) => {
    if (!supabase) return;

    const { error: deleteError } = await supabase
      .from('tag_birds')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    await fetchTagBirds();
  };

  const reorderTagBirds = async (reorderedBirds: TagBird[]) => {
    if (!supabase) return;

    for (let i = 0; i < reorderedBirds.length; i++) {
      await supabase
        .from('tag_birds')
        .update({ sort_order: i })
        .eq('id', reorderedBirds[i].id);
    }

    await fetchTagBirds();
  };

  return {
    tagBirds,
    loading,
    error,
    addTagBird,
    updateTagBird,
    deleteTagBird,
    reorderTagBirds,
    refetch: fetchTagBirds
  };
}
