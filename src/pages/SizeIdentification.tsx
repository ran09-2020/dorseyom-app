import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '@/components/Layout';
import { BIRDS } from '@/data/birds';
import { ArrowLeft, X } from 'lucide-react';

// נתוני מוטת כנפיים לכל דורס
interface BirdWingspan {
  id: string;
  wingspan: string;
}

interface SizeCategory {
  id: string;
  name: string;
  wingspanRange: string;
  description: string;
  birds: BirdWingspan[];
}

const SIZE_CATEGORIES: SizeCategory[] = [
{
  id: 'giant',
  name: 'ענק',
  wingspanRange: '240-285 ס"מ',
  description: 'נשרים ועזניות',
  birds: [
  { id: 'cinereous_vulture', wingspan: '285 ס"מ' },
  { id: 'lappet_faced', wingspan: '280 ס"מ' },
  { id: 'lammergeier', wingspan: '275 ס"מ' },
  { id: 'griffon', wingspan: '265 ס"מ' },
  { id: 'white_tail', wingspan: '240 ס"מ' }]

},
{
  id: 'very_large',
  name: 'גדול מאוד',
  wingspanRange: '185-225 ס"מ',
  description: 'עיטים גדולים',
  birds: [
  { id: 'golden', wingspan: '225 ס"מ' },
  { id: 'imperial', wingspan: '205 ס"מ' },
  { id: 'steppe', wingspan: '190 ס"מ' },
  { id: 'tawny', wingspan: '185 ס"מ' }]

},
{
  id: 'large',
  name: 'גדול',
  wingspanRange: '177-178 ס"מ',
  description: 'חיוויאי ועיט צפרדעים',
  birds: [
  { id: 'short_toed', wingspan: '178 ס"מ' },
  { id: 'greater_spotted', wingspan: '177 ס"מ' }]

},
{
  id: 'medium_large',
  name: 'בינוני-גדול',
  wingspanRange: '165-170 ס"מ',
  description: 'עיטים בינוניים, שלך, דיה אדומה',
  birds: [
  { id: 'egyptian', wingspan: '170 ס"מ' },
  { id: 'lesser_spotted', wingspan: '168 ס"מ' },
  { id: 'osprey', wingspan: '167 ס"מ' },
  { id: 'bonelli', wingspan: '165 ס"מ' },
  { id: 'red_kite', wingspan: '165 ס"מ' }]

},
{
  id: 'medium',
  name: 'בינוני',
  wingspanRange: '85-155 ס"מ',
  description: 'עקבים, זרונים, דיות, בזים גדולים',
  birds: [
  { id: 'black_kite', wingspan: '155 ס"מ' },
  { id: 'long_legged', wingspan: '135-150 ס"מ' },
  { id: 'common_buzzard', wingspan: '135-150 ס"מ' },
  { id: 'steppe_buzzard', wingspan: '135-150 ס"מ' },
  { id: 'rough_legged', wingspan: '135-150 ס"מ' },
  { id: 'snake_eagle', wingspan: '135-150 ס"מ' },
  { id: 'marsh_harrier', wingspan: '115-140 ס"מ' },
  { id: 'booted', wingspan: '135 ס"מ' },
  { id: 'goshawk', wingspan: '93-127 ס"מ' },
  { id: 'saker', wingspan: '105-129 ס"מ' },
  { id: 'hen_harrier', wingspan: '97-118 ס"מ' },
  { id: 'pallid_harrier', wingspan: '97-118 ס"מ' },
  { id: 'montagu_harrier', wingspan: '96-116 ס"מ' },
  { id: 'peregrine', wingspan: '89-113 ס"מ' },
  { id: 'lanner', wingspan: '95-105 ס"מ' },
  { id: 'eleanora', wingspan: '87-104 ס"מ' },
  { id: 'barbary_falcon', wingspan: '76-98 ס"מ' },
  { id: 'sooty_falcon', wingspan: '78-90 ס"מ' },
  { id: 'black_shouldered', wingspan: '85 ס"מ' }]

},
{
  id: 'small',
  name: 'קטן',
  wingspanRange: 'פחות מ-85 ס"מ',
  description: 'בזים קטנים וניצים',
  birds: [
  { id: 'hobby', wingspan: '70-84 ס"מ' },
  { id: 'sparrowhawk', wingspan: '58-80 ס"מ' },
  { id: 'common_kestrel', wingspan: '68-78 ס"מ' },
  { id: 'levant_sparrowhawk', wingspan: '63-76 ס"מ' },
  { id: 'red_footed_falcon', wingspan: '65-76 ס"מ' },
  { id: 'lesser_kestrel', wingspan: '63-72 ס"מ' },
  { id: 'merlin', wingspan: '55-69 ס"מ' }]

}];



export default function SizeIdentification() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const navigate = useNavigate();

  // קבלת דורסים לפי קטגוריית גודל
  const getBirdsForSize = (sizeId: string): {id: string;name: string;wingspan: string;}[] => {
    const category = SIZE_CATEGORIES.find((c) => c.id === sizeId);
    if (!category) return [];

    return category.birds.
    map((bird) => {
      const birdData = BIRDS[bird.id];
      if (!birdData) return null;
      return {
        id: bird.id,
        name: birdData.name,
        wingspan: bird.wingspan
      };
    }).
    filter((b): b is {id: string;name: string;wingspan: string;} => b !== null);
  };

  const handleBirdClick = (birdId: string) => {
    navigate(`/quiz?bird=${birdId}`);
  };

  const handleSizeClick = (sizeId: string) => {
    setSelectedSize(selectedSize === sizeId ? null : sizeId);
  };

  const selectedSizeData = SIZE_CATEGORIES.find((c) => c.id === selectedSize);
  const selectedBirds = selectedSizeData ? getBirdsForSize(selectedSize!) : [];

  return (
    <Layout>
      <div data-ev-id="ev_eeff099f55" className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
        {/* כותרת */}
        <div data-ev-id="ev_aeaacc313f" className="text-center mb-6">
          <h1 data-ev-id="ev_17613aab0a" className="text-2xl font-bold text-forest mb-2">זיהוי לפי גודל</h1>
          <p data-ev-id="ev_6dd69164af" className="text-muted-foreground">
            בחרו את הגודל המשוער של הדורס שראיתם
          </p>
          <p data-ev-id="ev_37e54a1f63" className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 mt-4 inline-block">
            💡 הגודל הוא אחד הסימנים הראשונים להערכה בשטח!
          </p>
        </div>

        {/* כרטיסיות גודל */}
        <div data-ev-id="ev_89c10a55f7" className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {SIZE_CATEGORIES.map((category) => {
            const birdCount = category.birds.length;
            const isSelected = selectedSize === category.id;
            return (
              <button data-ev-id="ev_c0b20ba7f1"
              key={category.id}
              onClick={() => handleSizeClick(category.id)}
              className={`p-4 rounded-xl text-center transition-all border-2 ${
              isSelected ?
              'bg-forest/5 border-forest shadow-md' :
              'bg-white border-gray-200 hover:border-forest/30 hover:shadow-sm'}`
              }>

                <div data-ev-id="ev_e959606170" className={`text-xl font-bold mb-1 ${isSelected ? 'text-forest' : 'text-gray-800'}`}>
                  {category.name}
                </div>
                <div data-ev-id="ev_977c9e2bf5" className="text-sm text-gray-500">{category.wingspanRange}</div>
                <div data-ev-id="ev_781327686a" className="text-xs text-gray-400 mt-1">{category.description}</div>
                <div data-ev-id="ev_b9c5a6b51a"
                className={`text-xs mt-2 rounded-full px-2 py-0.5 inline-block ${
                isSelected ? 'bg-forest/10 text-forest' : 'bg-gray-100 text-gray-500'}`
                }>

                  {birdCount} דורסים
                </div>
              </button>);

          })}
        </div>

        {/* תוצאות הבחירה */}
        {selectedSize && selectedSizeData &&
        <div data-ev-id="ev_3b8cb0e20c" className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div data-ev-id="ev_3301c7fc17" className="flex items-center justify-between mb-4">
              <div data-ev-id="ev_1a207a61d0">
                <h2 data-ev-id="ev_f38675df65" className="text-xl font-bold text-forest">{selectedSizeData.name}</h2>
                <p data-ev-id="ev_9f770e5581" className="text-sm text-gray-500">מוטת כנפיים: {selectedSizeData.wingspanRange}</p>
              </div>
              <button data-ev-id="ev_09b25f3dd2"
            onClick={() => setSelectedSize(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p data-ev-id="ev_d12cd48b5a" className="text-sm text-forest font-medium mb-3">
              {selectedBirds.length} דורסים בקטגוריה זו:
            </p>

            <div data-ev-id="ev_acaf59413f" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedBirds.length > 0 ?
            selectedBirds.map((bird) =>
            <button data-ev-id="ev_772c70e782"
            key={bird.id}
            onClick={() => handleBirdClick(bird.id)}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-forest/5 transition-colors text-right">

                    <div data-ev-id="ev_b958c2b1a7" className="flex flex-col items-start">
                      <span data-ev-id="ev_7adde6ab77" className="font-medium text-gray-800 text-sm">{bird.name}</span>
                      <span data-ev-id="ev_90ac59c0f1" className="text-xs text-gray-500">{bird.wingspan}</span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-forest flex-shrink-0" />
                  </button>
            ) :

            <p data-ev-id="ev_ef8139108e" className="text-sm text-gray-500 col-span-full text-center py-4">
                  אין דורסים בקטגוריה זו
                </p>
            }
            </div>
          </div>
        }

        {/* רמז לבחירה */}
        {!selectedSize &&
        <div data-ev-id="ev_754aa0f507" className="text-center text-gray-500 py-8">
            <p data-ev-id="ev_6953649e22">👆 לחצו על קטגוריית גודל למעלה</p>
          </div>
        }

        {/* הערה */}
        <div data-ev-id="ev_5bd3d0661a" className="mt-8 text-center text-sm text-gray-500">
          <p data-ev-id="ev_bbf12f5724">הגודל מתייחס למוטת הכנפיים - המרחק מקצה לקצה בתעופה</p>
        </div>
      </div>
    </Layout>);

}