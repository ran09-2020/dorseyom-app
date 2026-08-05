import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BIRDS, Bird, Region, SeasonStatus, Rarity } from '@/data/birds';

export interface BirdWithOverrides extends Bird {
  isOverridden?: boolean;
  link1_url?: string;
  link1_label?: string;
  link2_url?: string;
  link2_label?: string;
  // Override fields for region/season
  overriddenRegions?: Region[];
  overriddenSeasonStatus?: SeasonStatus[];
  overriddenRarity?: Rarity;
  overriddenMigrationCommon?: boolean;
}

export function useBirdsWithOverrides() {
  const [birds, setBirds] = useState<Record<string, BirdWithOverrides>>(BIRDS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOverrides() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: overrides } = await supabase
          .from('bird_overrides')
          .select('*');

        if (overrides && overrides.length > 0) {
          const mergedBirds = { ...BIRDS };

          for (const override of overrides) {
            if (mergedBirds[override.bird_id]) {
              mergedBirds[override.bird_id] = {
                ...mergedBirds[override.bird_id],
                name: override.name || mergedBirds[override.bird_id].name,
                desc: override.description || mergedBirds[override.bird_id].desc,
                diff_desc: override.diff_desc || mergedBirds[override.bird_id].diff_desc,
                features: (override.features as string[]) || mergedBirds[override.bird_id].features,
                quick_marks: (override.quick_marks as string[]) || mergedBirds[override.bird_id].quick_marks,
                link1_url: override.link1_url || undefined,
                link1_label: override.link1_label || undefined,
                link2_url: override.link2_url || undefined,
                link2_label: override.link2_label || undefined,
                // Merge region/season overrides
                regions: (override.regions as Region[]) || mergedBirds[override.bird_id].regions,
                seasonStatus: (override.season_status as SeasonStatus[]) || mergedBirds[override.bird_id].seasonStatus,
                rarity: (override.rarity as Rarity) || mergedBirds[override.bird_id].rarity,
                migrationCommon: override.migration_common ?? mergedBirds[override.bird_id].migrationCommon,
                isOverridden: true
              };
            }
          }

          setBirds(mergedBirds);
        }
      } catch (error) {
        console.error('Error fetching bird overrides:', error);
      }

      setLoading(false);
    }

    fetchOverrides();
  }, []);

  return { birds, loading };
}

// פונקציה סטטית לקבלת נתוני ציפורים ממוזגים (לשימוש חד פעמי)
export async function getBirdsWithOverrides(): Promise<Record<string, BirdWithOverrides>> {
  if (!supabase) {
    return BIRDS;
  }

  try {
    const { data: overrides } = await supabase
      .from('bird_overrides')
      .select('*');

    if (!overrides || overrides.length === 0) {
      return BIRDS;
    }

    const mergedBirds = { ...BIRDS };

    for (const override of overrides) {
      if (mergedBirds[override.bird_id]) {
        mergedBirds[override.bird_id] = {
          ...mergedBirds[override.bird_id],
          name: override.name || mergedBirds[override.bird_id].name,
          desc: override.description || mergedBirds[override.bird_id].desc,
          diff_desc: override.diff_desc || mergedBirds[override.bird_id].diff_desc,
          features: (override.features as string[]) || mergedBirds[override.bird_id].features,
          quick_marks: (override.quick_marks as string[]) || mergedBirds[override.bird_id].quick_marks,
          // Merge region/season overrides
          regions: (override.regions as Region[]) || mergedBirds[override.bird_id].regions,
          seasonStatus: (override.season_status as SeasonStatus[]) || mergedBirds[override.bird_id].seasonStatus,
          rarity: (override.rarity as Rarity) || mergedBirds[override.bird_id].rarity,
          migrationCommon: override.migration_common ?? mergedBirds[override.bird_id].migrationCommon,
          isOverridden: true
        };
      }
    }

    return mergedBirds;
  } catch (error) {
    console.error('Error fetching bird overrides:', error);
    return BIRDS;
  }
}
