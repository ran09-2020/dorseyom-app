import { MapPin, Calendar, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { Region, REGION_NAMES } from '@/data/birds';

// חודשים בעברית
const MONTHS = [
{ value: 1, label: 'ינואר' },
{ value: 2, label: 'פברואר' },
{ value: 3, label: 'מרץ' },
{ value: 4, label: 'אפריל' },
{ value: 5, label: 'מאי' },
{ value: 6, label: 'יוני' },
{ value: 7, label: 'יולי' },
{ value: 8, label: 'אוגוסט' },
{ value: 9, label: 'ספטמבר' },
{ value: 10, label: 'אוקטובר' },
{ value: 11, label: 'נובמבר' },
{ value: 12, label: 'דצמבר' }];


// קיבוץ אזורים להצגה
const DISPLAY_REGIONS: {value: Region;label: string;}[] = [
{ value: 'galil', label: 'גליל' },
{ value: 'golan', label: 'גולן' },
{ value: 'hula', label: 'עמק החולה' },
{ value: 'mayanot', label: 'עמק המעיינות' },
{ value: 'shomron', label: 'שומרון' },
{ value: 'center', label: 'מרכז' },
{ value: 'coast', label: 'חוף' },
{ value: 'negev', label: 'נגב' },
{ value: 'arava', label: 'ערבה' },
{ value: 'eilat', label: 'אילת' },
{ value: 'judean_desert', label: 'מדבר יהודה' }];


export interface FilterSelection {
  region: Region | null;
  month: number | null;
}

interface RegionSeasonSelectorProps {
  onStart: (selection: FilterSelection) => void;
  onSkip: () => void;
}

export function RegionSeasonSelector({ onStart, onSkip }: RegionSeasonSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [ignoreMonth, setIgnoreMonth] = useState(false);

  const handleStart = () => {
    onStart({
      region: selectedRegion,
      month: ignoreMonth ? null : selectedMonth
    });
  };

  const currentMonth = MONTHS.find((m) => m.value === selectedMonth);

  return (
    <div data-ev-id="ev_7eb62a94c6" className="flex-1 flex flex-col items-center justify-center p-4">
      <div data-ev-id="ev_274d385b3e" className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div data-ev-id="ev_42d5dff2f3" className="text-center space-y-1">
          <div data-ev-id="ev_1b3e557894" className="flex justify-center mb-3">
            <img data-ev-id="ev_3117f6f46b"
            src="https://dorseyom.sticklight.app/favicon.png"
            alt="דאה בתעופה"
            className="w-20 h-20 rounded-full object-cover shadow-lg shadow-orange-200/50 border-2 border-amber-100" />

          </div>
          <h1 data-ev-id="ev_68c18ac03d" className="text-3xl font-bold text-gray-800">דאה</h1>
          <h2 data-ev-id="ev_705a8ef802" className="text-lg font-semibold text-amber-600">זיהוי דורסים בתעופה</h2>
          <p data-ev-id="ev_238557dc79" className="text-sm text-gray-500">על פי תצפית בשטח</p>
          <p data-ev-id="ev_325bed6109" className="text-gray-600 text-sm pt-3">
            היכן ומתי צפיתם בדורס?<br data-ev-id="ev_e02ac6843e" />
            בחרו לתוצאות מדויקות יותר
          </p>
        </div>

        {/* Region Selection */}
        <div data-ev-id="ev_195873ccfe" className="space-y-3">
          <div data-ev-id="ev_071b6d21d1" className="flex items-center gap-2 text-gray-700 font-medium">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span data-ev-id="ev_0a01120a1c">היכן צפיתם?</span>
          </div>
          
          <div data-ev-id="ev_430ee23988" className="grid grid-cols-3 gap-2">
            {DISPLAY_REGIONS.map((region) =>
            <button data-ev-id="ev_64677640b7"
            key={region.value}
            onClick={() => selectedRegion === region.value ? setSelectedRegion(null) : setSelectedRegion(region.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
            selectedRegion === region.value ?
            'bg-amber-500 text-white shadow-md scale-105' :
            'bg-gray-100 text-gray-700 hover:bg-amber-100'}`
            }>
                {region.label}
                {selectedRegion === region.value && <X className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* All regions button */}
          <button data-ev-id="ev_7b590d384e"
          onClick={() => selectedRegion === 'all' ? setSelectedRegion(null) : setSelectedRegion('all')}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          selectedRegion === 'all' ?
          'bg-amber-500 text-white shadow-md' :
          'bg-gray-100 text-gray-700 hover:bg-amber-100'}`
          }>
            🇮🇱 כל הארץ
            {selectedRegion === 'all' && <X className="w-4 h-4" />}
          </button>
        </div>

        {/* Month Selection */}
        <div data-ev-id="ev_20eee2a5b8" className="space-y-3">
          <div data-ev-id="ev_4d546c0613" className="flex items-center gap-2 text-gray-700 font-medium">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span data-ev-id="ev_f7d3cdcc5e">מתי צפיתם?</span>
          </div>

          {!ignoreMonth &&
          <div data-ev-id="ev_e0f85461c5" className="relative">
              <button data-ev-id="ev_9ed5a96502"
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-200 transition-colors">
                <span data-ev-id="ev_f9ae43e793" className="text-gray-700">{currentMonth?.label || 'בחר חודש'}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`} />
              </button>

              {showMonthPicker &&
            <div data-ev-id="ev_3697ef3d1e" className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                  {MONTHS.map((month) =>
              <button data-ev-id="ev_50e0099da8"
              key={month.value}
              onClick={() => {
                setSelectedMonth(month.value);
                setShowMonthPicker(false);
              }}
              className={`w-full px-4 py-2 text-right hover:bg-amber-50 transition-colors ${
              selectedMonth === month.value ? 'bg-amber-100 text-amber-700 font-medium' : 'text-gray-700'}`
              }>

                      {month.label}
                    </button>
              )}
                </div>
            }
            </div>
          }

          <label data-ev-id="ev_7bb4c047a4" className="flex items-center gap-2 cursor-pointer">
            <input data-ev-id="ev_2604995374"
            type="checkbox"
            checked={ignoreMonth}
            onChange={(e) => setIgnoreMonth(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500" />

            <span data-ev-id="ev_be769db7c0" className="text-sm text-gray-600">לא זכור לי / לא משנה</span>
          </label>
        </div>

        {/* Migration Notice */}
        {selectedMonth && !ignoreMonth && [3, 4, 5, 9, 10, 11].includes(selectedMonth) &&
        <div data-ev-id="ev_ab7e8d1a56" className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            🐦 זו עונת נדידה - דורסים רבים עוברים ויכולים להופיע בכל הארץ!
          </div>
        }

        {/* Action Buttons */}
        <div data-ev-id="ev_dae4d0d537" className="space-y-3 pt-2">
          {/* מצב 1: נבחר אזור + חודש (לא "כל הארץ + לא זכור") */}
          {selectedRegion && !(selectedRegion === 'all' && ignoreMonth) &&
          <button data-ev-id="ev_6d74d0025e"
          onClick={handleStart}
          className="w-full py-3 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]">
              🎯 לשאלון זיהוי מותאם
            </button>
          }
          
          {/* מצב 2: כל הארץ + לא זכור לי */}
          {selectedRegion === 'all' && ignoreMonth &&
          <button data-ev-id="ev_7a762a21e1"
          onClick={onSkip}
          className="w-full py-3 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]">
              🎯 המשיכו כאן
            </button>
          }
          
          {/* מצב 3: לא נבחר כלום */}
          {!selectedRegion &&
          <button data-ev-id="ev_start_here"
          onClick={onSkip}
          className="w-full py-3 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]">
              🎯 לשאלון זיהוי מלא
            </button>
          }
        </div>
      </div>
    </div>);

}