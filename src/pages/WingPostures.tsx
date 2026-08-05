import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { BIRDS } from '@/data/birds';
import { ChevronDown, ChevronUp, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import wingPosturesImage from '@/assets/uploads/wing-postures-grid.png';

// Wing posture definitions with their corresponding bird attribute
interface WingPosture {
  id: string;
  name: string;
  description: string;
  attrKey: string;
  // Position in the grid (percentage based)
  gridPosition: {row: number;col: number;};
}

const WING_POSTURES: WingPosture[] = [
{
  id: 'shallow_v',
  name: 'V רדוד',
  description: 'כנפיים מורמות קלות',
  attrKey: 'shallow_v',
  gridPosition: { row: 0, col: 0 }
},
{
  id: 'deep_v',
  name: 'V עמוק',
  description: 'כנפיים מורמות בזווית חדה',
  attrKey: 'deep_v',
  gridPosition: { row: 0, col: 1 }
},
{
  id: 'flat',
  name: 'שטוח / ישר',
  description: 'כנפיים במישור אופקי',
  attrKey: 'flat_wings',
  gridPosition: { row: 0, col: 2 }
},
{
  id: 'drooping',
  name: 'כנפיים שמוטות',
  description: 'קצוות הכנפיים נמוכים מהגוף',
  attrKey: 'drooping',
  gridPosition: { row: 1, col: 0 }
},
{
  id: 'kinked',
  name: 'כנף כפופה (M חד)',
  description: 'אמה מורמת, יד מושפלת',
  attrKey: 'kinked_wing',
  gridPosition: { row: 1, col: 1 }
}];


export default function WingPostures() {
  const [selectedPosture, setSelectedPosture] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get birds for a specific wing posture
  const getBirdsForPosture = (attrKey: string): {id: string;name: string;}[] => {
    const birds: {id: string;name: string;}[] = [];

    Object.entries(BIRDS).forEach(([id, bird]) => {
      // For flat_wings, check if bird doesn't have deep_v, shallow_v, kinked_wing, or drooping
      if (attrKey === 'flat_wings') {
        if (!bird.attrs.deep_v && !bird.attrs.shallow_v && !bird.attrs.kinked_wing && !bird.attrs.drooping) {
          birds.push({ id, name: bird.name });
        }
      } else if (bird.attrs[attrKey] === true) {
        birds.push({ id, name: bird.name });
      }
    });

    return birds.sort((a, b) => a.name.localeCompare(b.name, 'he'));
  };

  const handleBirdClick = (birdId: string) => {
    navigate(`/quiz?bird=${birdId}`);
  };

  const handlePostureClick = (postureId: string) => {
    setSelectedPosture(selectedPosture === postureId ? null : postureId);
  };

  const selectedPostureData = WING_POSTURES.find((p) => p.id === selectedPosture);
  const selectedBirds = selectedPostureData ? getBirdsForPosture(selectedPostureData.attrKey) : [];

  return (
    <Layout>
      <div data-ev-id="ev_95afd82f60" className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
        {/* Header */}
        <div data-ev-id="ev_99f89bed02" className="text-center mb-6">
          <h1 data-ev-id="ev_f017d3e2e3" className="text-2xl font-bold text-forest mb-2">זיהוי לפי מנח כנפיים</h1>
          <p data-ev-id="ev_3352158e86" className="text-muted-foreground">
            בחרו את מנח הכנפיים שראיתם בשטח - ותקבלו רשימת דורסים אפשריים
          </p>
          <p data-ev-id="ev_cb398113eb" className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 mt-4 inline-block">
            💡 מנח הכנפיים בגלישה הוא אחד הסימנים החשובים ביותר לזיהוי דורסים מרחוק!
          </p>
        </div>

        {/* Wing Postures Image with Clickable Regions */}
        <div data-ev-id="ev_16d8e4e418" className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <img data-ev-id="ev_18e676daab"
          src={wingPosturesImage}
          alt="תצורות כנפיים ואופני תעופה"
          className="w-full h-auto" />

          
          {/* Clickable overlay regions */}
          <div data-ev-id="ev_e1fca571d0" className="absolute inset-0">
            {/* Grid: 3 columns, 2 rows (excluding header ~15% top) */}
            {WING_POSTURES.map((posture) => {
              const top = posture.gridPosition.row === 0 ? '15%' : '57%';
              const height = '42%';
              const left = `${posture.gridPosition.col * 33.33}%`;
              const width = '33.33%';

              return (
                <button data-ev-id="ev_8b24dce32c"
                key={posture.id}
                onClick={() => handlePostureClick(posture.id)}
                className={`absolute transition-all duration-200 ${
                selectedPosture === posture.id ?
                'bg-forest/20 ring-4 ring-forest ring-inset' :
                'hover:bg-forest/10'}`
                }
                style={{
                  top,
                  left,
                  width,
                  height
                }}
                title={posture.name} />);


            })}
          </div>
        </div>

        {/* Selected Posture Results */}
        {selectedPosture && selectedPostureData &&
        <div data-ev-id="ev_44f9502907" className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div data-ev-id="ev_3b0f310f70" className="flex items-center justify-between mb-4">
              <div data-ev-id="ev_240f8185ac">
                <h2 data-ev-id="ev_76b3649fbd" className="text-xl font-bold text-forest">{selectedPostureData.name}</h2>
                <p data-ev-id="ev_462ca3be9d" className="text-sm text-gray-500">{selectedPostureData.description}</p>
              </div>
              <button data-ev-id="ev_0533abfd0b"
            onClick={() => setSelectedPosture(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p data-ev-id="ev_c9b2045e79" className="text-sm text-forest font-medium mb-3">
              {selectedBirds.length} דורסים במנח זה:
            </p>
            
            <div data-ev-id="ev_131f7a57c3" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedBirds.length > 0 ?
            selectedBirds.map((bird) =>
            <button data-ev-id="ev_6398e510e9"
            key={bird.id}
            onClick={() => handleBirdClick(bird.id)}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-forest/5 transition-colors text-right">

                    <span data-ev-id="ev_e5698d87c2" className="font-medium text-gray-800 text-sm">{bird.name}</span>
                    <ArrowLeft className="w-4 h-4 text-forest flex-shrink-0" />
                  </button>
            ) :

            <p data-ev-id="ev_9439c6f879" className="text-sm text-gray-500 col-span-full text-center py-4">
                  אין דורסים במנח זה
                </p>
            }
            </div>
          </div>
        }

        {/* Hint when nothing selected */}
        {!selectedPosture &&
        <div data-ev-id="ev_75dfe67d58" className="text-center text-gray-500 py-8">
            <p data-ev-id="ev_316da53f76">👆 לחצו על אחד ממנחי הכנפיים בתמונה למעלה</p>
          </div>
        }

        {/* Footer Note */}
        <div data-ev-id="ev_300310f638" className="mt-8 text-center text-sm text-gray-500">
          <p data-ev-id="ev_170c9e5d5b">שימו לב: חלק מהדורסים יכולים להופיע ביותר ממנח אחד, בהתאם לתנאי הרוח והתעופה</p>
        </div>
      </div>
    </Layout>);

}