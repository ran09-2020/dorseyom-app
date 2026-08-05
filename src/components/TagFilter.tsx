import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Bird } from '@/data/birds';
import { Search, Loader2, Ruler, Wind, Sparkles, Feather, ArrowDownRight, Activity, Bird as BirdIcon } from 'lucide-react';
import { useFilterTags, type FilterCategory, type FilterTag } from '@/hooks/useFilterTags';

// מיפוי ציפורים למשפחות
const BIRD_FAMILIES: Record<string, string[]> = {
  vulture: ['cinereous_vulture', 'lappet_faced', 'griffon', 'lammergeier', 'egyptian'],
  eagle: ['golden', 'imperial', 'steppe', 'tawny', 'greater_spotted', 'lesser_spotted', 'bonelli', 'booted', 'white_tail', 'short_toed'],
  snake_eagles: ['snake_eagle'],
  diya: ['black_kite', 'red_kite'],
  daa: ['black_shouldered'],
  buzzard: ['long_legged', 'common_buzzard', 'steppe_buzzard', 'rough_legged'],
  harrier: ['marsh_harrier', 'hen_harrier', 'pallid_harrier', 'montagu_harrier'],
  accipiter: ['sparrowhawk', 'goshawk', 'levant_sparrowhawk'],
  falcon: ['lesser_kestrel', 'common_kestrel', 'red_footed_falcon', 'merlin', 'peregrine', 'barbary_falcon', 'hobby', 'lanner', 'sooty_falcon', 'eleanora', 'saker'],
  osprey: ['osprey']
};

interface FamilyCategory {
  id: string;
  name: string;
  tags: {id: string;label: string;family: string;}[];
}

const FAMILY_CATEGORY: FamilyCategory = {
  id: 'family',
  name: 'משפחה',
  tags: [
  { id: 'vulture', label: 'עזניות ונשרים', family: 'vulture' },
  { id: 'eagle', label: 'עיטים', family: 'eagle' },
  { id: 'snake_eagles', label: 'איות', family: 'snake_eagles' },
  { id: 'diya', label: 'דיות', family: 'diya' },
  { id: 'daa', label: 'דאות', family: 'daa' },
  { id: 'buzzard', label: 'עקבים', family: 'buzzard' },
  { id: 'harrier', label: 'זרונים', family: 'harrier' },
  { id: 'accipiter', label: 'ניצים', family: 'accipiter' },
  { id: 'falcon', label: 'בזים', family: 'falcon' },
  { id: 'osprey', label: 'שלך', family: 'osprey' }]
};

// אייקונים לקטגוריות
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'גודל': <Ruler className="w-3.5 h-3.5" />,
  'מנח כנפיים (בגלישה)': <Wind className="w-3.5 h-3.5" />,
  'סימנים בולטים': <Sparkles className="w-3.5 h-3.5" />,
  'צורת כנפיים': <Feather className="w-3.5 h-3.5" />,
  'זנב': <ArrowDownRight className="w-3.5 h-3.5" />,
  'התנהגות': <Activity className="w-3.5 h-3.5" />,
  'משפחה': <BirdIcon className="w-3.5 h-3.5" />
};

interface SelectedTag {
  attr: string;
  value: boolean;
  customKey?: string; // tag id if has custom list
  label: string;
}

interface TagFilterProps {
  onSelectBird: (birdId: string) => void;
  birdsData: Record<string, Bird>;
}

export function TagFilter({ onSelectBird, birdsData }: TagFilterProps) {
  const { categories, customTagBirds, isLoading, error } = useFilterTags();
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // חישוב כמות ציפורים לכל תגית
  const getTagBirdCount = useCallback((tag: FilterTag): number => {
    if (tag.customKey && customTagBirds[tag.customKey]) {
      // תגית עם רשימה מותאמת אישית
      return customTagBirds[tag.customKey].length;
    }
    // תגית מבוססת attr
    return Object.entries(birdsData).filter(([_, bird]) => {
      if (tag.attr === '_medium') {
        const isGiant = bird.attrs['giant'] === true;
        const isVeryLarge = bird.attrs['very_large'] === true;
        const isSmall = bird.attrs['small'] === true;
        return !isGiant && !isVeryLarge && !isSmall;
      }
      return bird.attrs[tag.attr] === tag.value;
    }).length;
  }, [birdsData, customTagBirds]);

  // חישוב כמות למשפחות
  const getFamilyBirdCount = useCallback((family: string): number => {
    return (BIRD_FAMILIES[family] || []).length;
  }, []);

  // Scroll to expanded category
  useEffect(() => {
    if (expandedCategory && categoryRefs.current[expandedCategory]) {
      setTimeout(() => {
        categoryRefs.current[expandedCategory]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [expandedCategory]);

  const toggleTag = (attr: string, value: boolean, customKey?: string, label?: string) => {
    const exists = selectedTags.find((t) => t.attr === attr && t.value === value);
    if (exists) {
      setSelectedTags(selectedTags.filter((t) => !(t.attr === attr && t.value === value)));
    } else {
      setSelectedTags([...selectedTags, { attr, value, customKey, label: label || attr }]);
    }
  };

  const toggleFamily = (family: string) => {
    setSelectedFamily(selectedFamily === family ? null : family);
  };

  const isTagSelected = (attr: string, value: boolean) => {
    return selectedTags.some((t) => t.attr === attr && t.value === value);
  };

  const clearAll = () => {
    setSelectedTags([]);
    setSelectedFamily(null);
    setSearchQuery('');
  };

  // Unified AND filtering - combines all filters
  const filteredResults = useMemo(() => {
    // Start with all birds
    let results = Object.entries(birdsData);

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      results = results.filter(([id, bird]) => {
        const nameMatch = bird.name.toLowerCase().includes(query);
        const latinMatch = bird.latin.toLowerCase().includes(query);
        return nameMatch || latinMatch;
      });
    }

    // Family filter (AND)
    if (selectedFamily) {
      const familyBirds = BIRD_FAMILIES[selectedFamily] || [];
      results = results.filter(([id]) => familyBirds.includes(id));
    }

    // Tag filters (AND) - each tag narrows down the results
    for (const tag of selectedTags) {
      if (tag.customKey && customTagBirds[tag.customKey]) {
        // Custom list tag - intersect with the birds in the list
        const listBirdIds = new Set(customTagBirds[tag.customKey].map((b) => b.id));
        results = results.filter(([id]) => listBirdIds.has(id));
      } else {
        // Attribute-based tag
        results = results.filter(([id, bird]) => {
          // Special case for medium size
          if (tag.attr === '_medium') {
            const isGiant = bird.attrs['giant'] === true;
            const isVeryLarge = bird.attrs['very_large'] === true;
            const isSmall = bird.attrs['small'] === true;
            return !isGiant && !isVeryLarge && !isSmall;
          }
          return bird.attrs[tag.attr] === tag.value;
        });
      }
    }

    return results;
  }, [birdsData, searchQuery, selectedFamily, selectedTags, customTagBirds]);

  // Get notes for birds from custom list tags
  const getBirdNotes = (birdId: string): string[] => {
    const notes: string[] = [];
    for (const tag of selectedTags) {
      if (tag.customKey && customTagBirds[tag.customKey]) {
        const birdEntry = customTagBirds[tag.customKey].find((b) => b.id === birdId);
        if (birdEntry?.note) {
          notes.push(birdEntry.note);
        }
      }
    }
    return notes;
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedFamily !== null || searchQuery.trim() !== '';

  if (isLoading) {
    return (
      <div data-ev-id="ev_c1c1fbe039" className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span data-ev-id="ev_1e15a3836e" className="text-sm text-gray-500">טוען פילטרים...</span>
      </div>);

  }

  if (error) {
    return (
      <div data-ev-id="ev_a0c697f9df" className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p data-ev-id="ev_78fd0b14f8" className="text-red-700 text-sm">שגיאה בטעינת הפילטרים</p>
        <p data-ev-id="ev_49008d0277" className="text-red-500 text-xs mt-1">{error}</p>
      </div>);

  }

  return (
    <div data-ev-id="ev_759c61f99e" className="flex flex-col gap-3 md:gap-4">
      {/* Search input */}
      <div data-ev-id="ev_ed5642fe60" className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input data-ev-id="ev_539507c922"
        type="text"
        placeholder="חיפוש לפי שם..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />

      </div>

      {/* Selected tags summary */}
      {hasActiveFilters &&
      <div data-ev-id="ev_e7a0123d5e" className="bg-blue-50 rounded-lg p-2.5 md:p-3">
          <div data-ev-id="ev_9a7700dbfa" className="flex items-center justify-between mb-2">
            <span data-ev-id="ev_6a3977754e" className="text-xs md:text-sm font-medium text-blue-800">
              סינון פעיל (AND):
            </span>
            <button data-ev-id="ev_aabc2933e3"
          onClick={clearAll}
          className="text-xs text-blue-600 hover:text-blue-800 underline">

              נקה הכל
            </button>
          </div>
          <div data-ev-id="ev_e28748ae7e" className="flex flex-wrap gap-1 md:gap-1.5">
            {searchQuery.trim() &&
          <span data-ev-id="ev_e70f21f729"
          onClick={() => setSearchQuery('')}
          className="bg-green-200 text-green-800 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs cursor-pointer hover:bg-green-300">

                חיפוש: {searchQuery} ✕
              </span>
          }
            {selectedFamily &&
          <span data-ev-id="ev_47a4253ea6"
          onClick={() => setSelectedFamily(null)}
          className="bg-purple-200 text-purple-800 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs cursor-pointer hover:bg-purple-300">

                {FAMILY_CATEGORY.tags.find((t) => t.family === selectedFamily)?.label} ✕
              </span>
          }
            {selectedTags.map((tag, i) =>
          <span data-ev-id="ev_7e62d66256"
          key={i}
          onClick={() => toggleTag(tag.attr, tag.value, tag.customKey, tag.label)}
          className="bg-blue-200 text-blue-800 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs cursor-pointer hover:bg-blue-300">

                {tag.label} ✕
              </span>
          )}
          </div>
        </div>
      }

      {/* Tag categories */}
      <div data-ev-id="ev_b3c4e1352a" className="flex flex-col gap-1.5 md:gap-2">
        {/* Family category - always first */}
        <div ref={(el) => {categoryRefs.current['family'] = el;}} data-ev-id="ev_8fedd9a52d" className="border border-purple-200 rounded-lg overflow-hidden">
          <button data-ev-id="ev_f3f8350f90"
          onClick={() => setExpandedCategory(expandedCategory === 'family' ? null : 'family')}
          className="w-full px-2.5 md:px-3 py-1.5 md:py-2 bg-purple-50 text-right text-sm md:text-base font-medium text-purple-700 flex items-center justify-between hover:bg-purple-100 transition-colors">

            <span data-ev-id="ev_928ce329af" className="flex items-center gap-1.5">
              {CATEGORY_ICONS['משפחה']}
              משפחה
            </span>
            <span data-ev-id="ev_57df5eda7c" className="text-purple-400 text-xs">
              {expandedCategory === 'family' ? '▲' : '▼'}
            </span>
          </button>
          {expandedCategory === 'family' &&
          <div data-ev-id="ev_e88d2d3cf1" className="p-1.5 md:p-2 flex flex-wrap gap-1 md:gap-1.5 bg-white">
              {FAMILY_CATEGORY.tags.map((tag) => {
              const count = getFamilyBirdCount(tag.family);
              return (
                <button data-ev-id="ev_67782d4a4e"
                key={tag.id}
                onClick={() => toggleFamily(tag.family)}
                className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-xs md:text-sm transition-colors flex items-center gap-1 ${
                selectedFamily === tag.family ?
                'bg-purple-600 text-white' :
                'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }>
                    {tag.label}
                    <span data-ev-id="ev_2399c7ea51" className={`text-[10px] ${selectedFamily === tag.family ? 'text-purple-200' : 'text-gray-400'}`}>({count})</span>
                  </button>);

            })}
            </div>
          }
        </div>

        {/* Dynamic tag categories from database */}
        {categories.map((category) => {
          const icon = CATEGORY_ICONS[category.name];
          const isHighPriority = category.name === 'גודל' || category.name === 'מנח כנפיים (בגלישה)';

          return (
            <div ref={(el) => {categoryRefs.current[category.id] = el;}}
            data-ev-id="ev_1dc6eb7cfc"
            key={category.id}
            className={`border rounded-lg overflow-hidden ${isHighPriority ? 'border-green-200' : 'border-gray-200'}`}>

              <button data-ev-id="ev_3e5ff448b6"
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className={`w-full px-2.5 md:px-3 py-1.5 md:py-2 text-right text-sm md:text-base font-medium flex items-center justify-between transition-colors ${
              isHighPriority ?
              'bg-green-50 text-green-700 hover:bg-green-100' :
              'bg-gray-50 text-gray-700 hover:bg-gray-100'}`
              }>

                <span data-ev-id="ev_1f87f1ce38" className="flex items-center gap-1.5">
                  {icon}
                  {category.name}
                  {isHighPriority && <span data-ev-id="ev_63389c1d0d" className="text-[10px] bg-green-200 text-green-800 px-1.5 rounded-full">מומלץ</span>}
                </span>
                <span data-ev-id="ev_746578c10d" className={`text-xs ${isHighPriority ? 'text-green-400' : 'text-gray-400'}`}>
                  {expandedCategory === category.id ? '▲' : '▼'}
                </span>
              </button>
              {expandedCategory === category.id &&
              <div data-ev-id="ev_e533880726" className="p-1.5 md:p-2 flex flex-wrap gap-1 md:gap-1.5 bg-white">
                {category.tags.map((tag) => {
                  const count = getTagBirdCount(tag);
                  const isSelected = isTagSelected(tag.attr, tag.value);
                  const isEmpty = count === 0;

                  return (
                    <button data-ev-id="ev_3e40b7b121"
                    key={tag.id}
                    onClick={() => !isEmpty && toggleTag(tag.attr, tag.value, tag.customKey, tag.label)}
                    disabled={isEmpty}
                    className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-xs md:text-sm transition-colors flex items-center gap-1 ${
                    isEmpty ?
                    'bg-gray-50 text-gray-300 cursor-not-allowed' :
                    isSelected ?
                    'bg-green-600 text-white' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                    }>
                      {tag.label}
                      <span data-ev-id="ev_4100ae9a23" className={`text-[10px] ${
                      isEmpty ?
                      'text-gray-300' :
                      isSelected ?
                      'text-green-200' :
                      'text-gray-400'}`
                      }>({count})</span>
                    </button>);

                })}
              </div>
              }
            </div>);

        })}
      </div>

      {/* Results */}
      <div data-ev-id="ev_1324715152" className="mt-3 md:mt-4">
        <div data-ev-id="ev_2445da5e50" className="text-xs md:text-sm text-gray-500 mb-2">
          {!hasActiveFilters ?
          `כל הדורסים (${Object.keys(birdsData).length})` :
          `נמצאו ${filteredResults.length} דורסים`}
        </div>
        <div data-ev-id="ev_4b8f5f2c11" className="flex flex-col gap-1 md:gap-1.5 max-h-64 overflow-y-auto">
          {filteredResults.map(([id, bird]) => {
            const notes = getBirdNotes(id);
            return (
              <button data-ev-id="ev_6108b242b7"
              key={id}
              onClick={() => onSelectBird(id)}
              className="w-full text-right px-2.5 md:px-3 py-1.5 md:py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors">

                <div data-ev-id="ev_d2ac34e09a" className="flex items-baseline gap-2">
                  <span data-ev-id="ev_fc6b5c343e" className="font-medium text-gray-900 text-sm md:text-base">
                    {bird.name}
                  </span>
                  {notes.length > 0 &&
                  <span data-ev-id="ev_fa88a33724" className="text-[10px] md:text-xs text-green-700 font-medium">
                      {notes.join(' • ')}
                    </span>
                  }
                </div>
                <span data-ev-id="ev_3fce131a77" className="text-[10px] md:text-xs text-gray-400">
                  {bird.latin}
                </span>
              </button>);

          })}
        </div>
      </div>
    </div>);

}