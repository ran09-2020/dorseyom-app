import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { BookOpen, Wind, Feather, Eye, Palette, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ImageIcon, X, HelpCircle } from 'lucide-react';
import { DIAGRAMS, type DiagramType } from '@/components/HintModal';

interface Term {
  term: string;
  description: string;
  example?: string;
  color?: string;
  diagram?: Exclude<DiagramType, null>;
}

interface TermCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  terms: Term[];
  diagram?: DiagramType;
}

const GLOSSARY_DATA: TermCategory[] = [
{
  id: 'wing-postures',
  title: 'תנוחות כנף (בגלישה)',
  icon: <Wind className="w-5 h-5" />,
  diagram: 'wing_posture',
  terms: [
  { term: 'V עמוק', description: 'כנפיים מורמות בזווית חדה', example: 'דאה שחורת כתף' },
  { term: 'V רדוד', description: 'כנפיים מורמות קלות', example: 'עקבים, זרונים' },
  { term: 'כנף כפופה / M', description: 'אמה מורמת, יד מושפלת - צורת M', example: 'שלך' },
  { term: 'כנפיים שטוחות / ישרות', description: 'במישור אופקי', example: 'חיוויאי (בגלישה איטית)' },
  { term: 'כנפיים שמוטות', description: 'קצוות הכנפיים נמוכים מהגוף', example: 'עיט חורש, דיה שחורה' },
  { term: 'מפרק משוך קדימה', description: 'מפרק הכנף ("מרפק") בולט קדימה, יוצר צללית עם כנפיים מכופפות מטה וקצוות סגורים ומחודדים', example: 'חיוויאי', diagram: 'forward_wrist' }]

},
{
  id: 'tail-shapes',
  title: 'צורות זנב',
  icon: <Feather className="w-5 h-5" />,
  diagram: 'tails',
  terms: [
  { term: 'מזלגי עמוק', description: 'שסוע בבירור, צורת V ברורה', example: 'דיה אדומה' },
  { term: 'מזלגי רדוד / משולש', description: 'שקע קל באמצע הזנב', example: 'דיה שחורה' },
  { term: 'מעוגל', description: 'קצוות חיצוניים קצרים יותר, יוצרים קשת', example: 'נץ מצוי' },
  { term: 'מעויין', description: 'צורת יהלום - רחב באמצע וצר בקצוות', example: 'פרס, רחם' },
  { term: 'מרובע', description: 'קצה ישר, ללא שקע', example: 'נשר מקראי' }]

},
{
  id: 'field-marks',
  title: 'סימנים ייחודיים',
  icon: <Eye className="w-5 h-5" />,
  diagram: 'markings',
  terms: [
  { term: 'אצבעות', description: 'הנוצות הראשוניות הבולטות בקצה הכנף', example: 'נשר - 7 אצבעות' },
  { term: 'חלונות בהירים', description: 'חלקן הפנימי של אברות היד והאמה מציג גוון לבנבן-מפוספס המייצר מראה של חלונות בהירים, המוגדרים בשוליים אחוריים כהים (שפת זרימה כהה)', example: 'עקב חורף', diagram: 'bright_windows' },
  { term: 'כנפיים דו-גוניות', description: 'לבנות/בהירות מקדימה ושחורות/כהות מאחורה', example: 'עיט גמדי (מופע בהיר)', diagram: 'two_tone_wings' },
  { term: 'כתם כהה בפרק הכנף', description: 'כתם כהה באזור "המרפק" של הכנף', example: 'עקבים' },
  { term: 'מכנסיים', description: 'אזור ה"שוק" – החלק העליון של רגל הציפור. אצל דורסים רבים, אזור זה מכוסה בנוצות ארוכות ובולטות המזכירות בצורתן מכנסיים רחבים', example: 'עקב עיטי ("מכנסיים" כהים), בז ערב ("מכנסיים" אדומים)' },
  { term: 'סהר בהיר', description: 'צורת חצי-סהר בהיר על החזה העליון', example: 'עקב חורף', diagram: 'crescent' },
  { term: 'סוככות', description: 'נוצות המכסות את בסיס הכנף מלמעלה ומלמטה', example: '' },
  { term: 'על-שת', description: 'האזור מעל בסיס הזנב', example: 'זרונים - על-שת לבן', diagram: 'rump' },
  { term: 'פנסים / אורות נחיתה', description: 'כתמי לבן בולטים בבסיס הכנף הקדמי', example: 'עיט גמדי', diagram: 'lanterns' },
  { term: 'קסדה', description: 'כיסוי כהה בראש, כמו קסדה', example: 'בז נודד', diagram: 'helmet_moustache' },
  { term: 'ראש קרמבו', description: 'ראש כהה על רקע גוף בהיר מלמטה', example: 'חיוויאי' },
  { term: 'שפם', description: 'פס כהה יורד מהמקור לאורך הלחי', example: 'בז נודד, בז ערב', diagram: 'helmet_moustache' },
  { term: 'שפת זרימה כהה', description: 'פס כהה לאורך השפה האחורית של הכנף', example: 'עקבים' }]

},
{
  id: 'behavior',
  title: 'התנהגות בתעופה',
  icon: <Wind className="w-5 h-5" />,
  terms: [
  { term: 'גולש', description: 'עף ללא תנועת כנפיים, על זרמי אוויר', example: '' },
  { term: 'דואה', description: 'עולה בסחרור תרמי (עמוד אוויר חם)', example: 'נשרים, עיטים' },
  { term: 'חותר', description: 'טס במהירות עם נפנופי כנפיים חזקים', example: 'בזים' },
  { term: 'מרפרף', description: 'מנפנף בכנפיים ועומד באוויר במקום אחד', example: 'בז מצוי, חיוויאי' }]

},
{
  id: 'colors',
  title: 'תיאורי צבע',
  icon: <Palette className="w-5 h-5" />,
  terms: [
  { term: 'חום שוקולד', description: 'חום כהה עמוק, כמו שוקולד מריר', example: 'עיט חורש', color: '#3D1C02' },
  { term: 'חלוד', description: 'חום-אדמדם, כמו חלודה', example: 'בז מצוי', color: '#AD6E52' },
  { term: 'צפחה', description: 'אפור-כחלחל', example: 'בז נודד', color: '#708090' },
  { term: 'קרמי', description: 'בז\' בהיר, שמנת', example: 'כיפה של זרון סוף נקבה', color: '#F5DEB3' }]

},
{
  id: 'patterns',
  title: 'דפוסים',
  icon: <Palette className="w-5 h-5" />,
  terms: [
  { term: 'אחיד', description: 'צבע אחיד ללא דגמים בולטים', example: 'גב של עיט חורש' },
  { term: 'מנוקד', description: 'עם נקודות כהות פזורות', example: 'גב של בז מצוי' },
  { term: 'מנומר / כתמי', description: 'כתמים לא סדורים בגדלים שונים', example: 'בז מצוי נקבה, חיוויאי' },
  { term: 'פסי רוחב', description: 'פסים אופקיים על הבטן', example: 'נץ מצוי' },
  { term: 'פספוס אורך', description: 'קווים קטנים ואנכיים על החזה/בטן', example: 'עיט ניצי, בז עצים' }]

}];

// תרשימים להצגה בגלריה
const DIAGRAM_GALLERY: {id: Exclude<DiagramType, null>;title: string;}[] = [
{ id: 'markings', title: 'סימונים ודגמים' },
{ id: 'tails', title: 'צורות זנב' },
{ id: 'wing_posture', title: 'מנחי כנף' },
{ id: 'wing_shapes', title: 'צורות כנף' },
{ id: 'two_tone_wings', title: 'כנפיים דו-גוניות' },
{ id: 'lanterns', title: 'אורות נחיתה' },
{ id: 'forward_wrist', title: 'מפרקים משוכים קדימה' },
{ id: 'bright_windows', title: 'חלונות בהירים' },
{ id: 'crescent', title: 'סהר בהיר' },
{ id: 'rump', title: 'על-שת לבן' },
{ id: 'helmet_moustache', title: 'קסדה ושפם' }];



export default function Glossary() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    GLOSSARY_DATA.map((c) => c.id) // כל הקטגוריות פתוחות כברירת מחדל
  );
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>(null);
  const [activeTab, setActiveTab] = useState<'diagrams' | 'glossary'>('diagrams');

  // ניווט בלייטבוקס
  const currentIndex = selectedDiagram ? DIAGRAM_GALLERY.findIndex((d) => d.id === selectedDiagram) : -1;

  // תמיכה במקלדת
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDiagram) return;
      if (e.key === 'ArrowRight') {
        // goToPrev - RTL
        if (currentIndex > 0) {
          setSelectedDiagram(DIAGRAM_GALLERY[currentIndex - 1].id);
        } else {
          setSelectedDiagram(DIAGRAM_GALLERY[DIAGRAM_GALLERY.length - 1].id);
        }
      }
      if (e.key === 'ArrowLeft') {
        // goToNext - RTL
        if (currentIndex < DIAGRAM_GALLERY.length - 1) {
          setSelectedDiagram(DIAGRAM_GALLERY[currentIndex + 1].id);
        } else {
          setSelectedDiagram(DIAGRAM_GALLERY[0].id);
        }
      }
      if (e.key === 'Escape') setSelectedDiagram(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDiagram, currentIndex]);

  const goToNext = () => {
    if (currentIndex < DIAGRAM_GALLERY.length - 1) {
      setSelectedDiagram(DIAGRAM_GALLERY[currentIndex + 1].id);
    } else {
      setSelectedDiagram(DIAGRAM_GALLERY[0].id); // חזרה להתחלה
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedDiagram(DIAGRAM_GALLERY[currentIndex - 1].id);
    } else {
      setSelectedDiagram(DIAGRAM_GALLERY[DIAGRAM_GALLERY.length - 1].id); // חזרה לסוף
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
    prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div data-ev-id="ev_1e3f3e1a18" className="max-w-3xl mx-auto px-4 py-8">
        {/* כותרת */}
        <div data-ev-id="ev_206439dd1a" className="text-center mb-8">
          <h1 data-ev-id="ev_11342f9cd0" className="text-3xl font-bold text-forest mb-2 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8" />
            מונחון
          </h1>
          <p data-ev-id="ev_2a3dc16af1" className="text-muted-foreground">
            מונחים ומושגים לזיהוי דורסים בתעופה
          </p>
        </div>

        {/* לשוניות */}
        <div data-ev-id="ev_5a3e241245" className="flex gap-2 mb-6">
          <button data-ev-id="ev_583f1b2e50"
          onClick={() => setActiveTab('diagrams')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
          activeTab === 'diagrams' ?
          'bg-amber-500 text-white shadow-md' :
          'bg-white text-amber-600 border-2 border-amber-300 hover:border-amber-400'}`
          }>

            <ImageIcon className="w-5 h-5" />
            תרשימי עזר
          </button>
          <button data-ev-id="ev_87be37729a"
          onClick={() => setActiveTab('glossary')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
          activeTab === 'glossary' ?
          'bg-forest text-white shadow-md' :
          'bg-white text-forest border-2 border-forest/20 hover:border-forest/40'}`
          }>

            <BookOpen className="w-5 h-5" />
            מונחון
          </button>
        </div>

        {/* גלריית תרשימים */}
        {activeTab === 'diagrams' &&
        <div data-ev-id="ev_f1ebda49ef" className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
          <div data-ev-id="ev_de0ff3e457" className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div data-ev-id="ev_ba35786d66" className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 data-ev-id="ev_22ac4c3203" className="font-bold text-lg text-forest">תרשימי עזר</h2>
          </div>
          <div data-ev-id="ev_a0801ac39e" className="p-4">
            <div data-ev-id="ev_d4620edaf4" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DIAGRAM_GALLERY.map((item) => {
                const diagram = DIAGRAMS[item.id];
                return (
                  <button data-ev-id="ev_801103c1c0"
                  key={item.id}
                  onClick={() => setSelectedDiagram(item.id)}
                  className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-forest transition-colors aspect-[4/3] bg-gray-50">

                    <img data-ev-id="ev_14b63e05f8"
                    src={diagram.image}
                    alt={diagram.alt}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />

                    <div data-ev-id="ev_d241e05e9d" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <span data-ev-id="ev_ed086fac95" className="text-white text-xs font-medium">{item.title}</span>
                    </div>
                  </button>);

              })}
            </div>
          </div>
        </div>
        }

        {/* קטגוריות */}
        {activeTab === 'glossary' &&
        <div data-ev-id="ev_45a6319d48" className="flex flex-col gap-4">
          {GLOSSARY_DATA.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            return (
              <div data-ev-id="ev_c1c7ef84b7"
              key={category.id}
              className="bg-white rounded-xl shadow-card overflow-hidden">

                {/* כותרת קטגוריה */}
                <button data-ev-id="ev_916c7c1bd2"
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">

                  <div data-ev-id="ev_779cace277" className="flex items-center gap-3">
                    <div data-ev-id="ev_9335ba86bf" className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center text-forest">
                      {category.icon}
                    </div>
                    <h2 data-ev-id="ev_c6182f3dfd" className="font-bold text-lg text-forest">{category.title}</h2>
                    {category.diagram &&
                    <button data-ev-id="ev_d1908db193"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDiagram(category.diagram!);
                    }}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="צפה בתרשים">

                        <HelpCircle className="w-5 h-5" />
                      </button>
                    }
                  </div>
                  {isExpanded ?
                  <ChevronUp className="w-5 h-5 text-gray-400" /> :

                  <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </button>

                {/* רשימת מונחים */}
                {isExpanded &&
                <div data-ev-id="ev_b473779562" className="border-t border-gray-100">
                    {category.terms.map((term, index) =>
                  <div data-ev-id="ev_163c2b0fef"
                  key={index}
                  className={`p-4 ${index !== category.terms.length - 1 ? 'border-b border-gray-50' : ''}`}>

                        <div data-ev-id="ev_172ec72833" className="flex flex-col gap-1">
                          <div data-ev-id="ev_558d6fa3bc" className="flex items-center gap-2">
                            {term.color &&
                        <span data-ev-id="ev_96cff0f920"
                        className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: term.color }} />

                        }
                            <span data-ev-id="ev_a2fd140878" className="font-bold text-forest-dark">{term.term}</span>
                            {term.diagram &&
                        <button data-ev-id="ev_f410ef32fe"
                        onClick={() => setSelectedDiagram(term.diagram!)}
                        className="text-amber-500 hover:text-amber-600 transition-colors"
                        title="צפה בתרשים">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                        }
                          </div>
                          <span data-ev-id="ev_f53aff59b8" className="text-gray-600 text-sm">{term.description}</span>
                          {term.example &&
                      <span data-ev-id="ev_16bca46e60" className="text-xs text-gray-400 mt-1">
                              דוגמה: {term.example}
                            </span>
                      }
                        </div>
                      </div>
                  )}
                  </div>
                }
              </div>);

          })}
        </div>
        }
      </div>

      {/* לייטבוקס תרשים */}
      {selectedDiagram &&
      <div data-ev-id="ev_877fb1b46f"
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={() => setSelectedDiagram(null)}>

          <div data-ev-id="ev_3db84d7457"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative shadow-xl"
        onClick={(e) => e.stopPropagation()}>

            <div data-ev-id="ev_be5706613a" className="flex items-center justify-between p-4 border-b border-gray-100">
              <div data-ev-id="ev_fab76ad8a6" className="flex items-center gap-3">
                <h3 data-ev-id="ev_458550404c" className="font-bold text-lg text-forest">{DIAGRAMS[selectedDiagram].title}</h3>
                <span data-ev-id="ev_7d53cd2fc9" className="text-sm text-gray-400">({currentIndex + 1}/{DIAGRAM_GALLERY.length})</span>
              </div>
              <button data-ev-id="ev_4c57ef74b1"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            onClick={() => setSelectedDiagram(null)}>

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div data-ev-id="ev_5ba7543213" className="p-4 overflow-y-auto max-h-[calc(90vh-160px)]">
              <img data-ev-id="ev_3b0be9367b"
            src={DIAGRAMS[selectedDiagram].image}
            alt={DIAGRAMS[selectedDiagram].alt}
            className="w-full rounded-lg" />

            </div>

            {/* כפתורי ניווט */}
            <div data-ev-id="ev_6ddfef3a97" className="flex justify-center gap-4 p-4 border-t border-gray-100 bg-white">
              <button data-ev-id="ev_68bd7a2c9c"
            onClick={goToPrev}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-forest font-medium">

                <ChevronRight className="w-5 h-5" />
                הקודם
              </button>
              <button data-ev-id="ev_d77176a4fa"
            onClick={goToNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-forest font-medium">

                הבא
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      }
    </Layout>);

}