import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';

type TagCategory = Tables<'tag_categories'>;
type Tag = Tables<'tags'>;
type TagBird = Tables<'tag_birds'>;

export interface FilterTag {
  id: string;
  label: string;
  attr: string;
  value: boolean;
  customKey?: string; // tag id if has_custom_list
}

export interface FilterCategory {
  id: string;
  name: string;
  tags: FilterTag[];
}

export interface CustomBirdEntry {
  id: string;
  note?: string;
}

export function useFilterTags() {
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [customTagBirds, setCustomTagBirds] = useState<Record<string, CustomBirdEntry[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Fetch categories ordered by sort_order
        const { data: categoriesData, error: catError } = await supabase
          .from('tag_categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (catError) throw catError;

        // Fetch all tags ordered by sort_order
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('*')
          .order('sort_order', { ascending: true });

        if (tagsError) throw tagsError;

        // Fetch all tag_birds for tags with custom lists
        const customTags = tagsData?.filter(t => t.has_custom_list) || [];
        const customTagIds = customTags.map(t => t.id);

        const tagBirdsMap: Record<string, CustomBirdEntry[]> = {};

        if (customTagIds.length > 0) {
          const { data: tagBirdsData, error: tbError } = await supabase
            .from('tag_birds')
            .select('*')
            .in('tag_id', customTagIds)
            .order('sort_order', { ascending: true });

          if (tbError) throw tbError;

          // Group by tag_id
          for (const tb of tagBirdsData || []) {
            if (!tagBirdsMap[tb.tag_id]) {
              tagBirdsMap[tb.tag_id] = [];
            }
            tagBirdsMap[tb.tag_id].push({
              id: tb.bird_id,
              note: tb.note || undefined
            });
          }
        }

        // Build the categories with their tags
        const mappedCategories: FilterCategory[] = (categoriesData || []).map(cat => ({
          id: cat.id,
          name: cat.name,
          tags: (tagsData || [])
            .filter(t => t.category_id === cat.id)
            .map(t => ({
              id: t.id,
              label: t.label,
              attr: t.attr,
              value: t.attr_value,
              customKey: t.has_custom_list ? t.id : undefined
            }))
        }));

        setCategories(mappedCategories);
        setCustomTagBirds(tagBirdsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching filter tags:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tags');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { categories, customTagBirds, isLoading, error };
}
