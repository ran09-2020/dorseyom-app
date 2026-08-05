import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '@/components/Layout';
import { HelpCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, ListChecks, Tags, Ruler, BookOpen, Lightbulb } from 'lucide-react';

// אייקון מנח כנפיים
function WingIcon({ className }: {className?: string;}) {
  return (
    <svg data-ev-id="ev_0a7b8ef31b"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>

      <path data-ev-id="ev_835a3f87ed" d="M2 10 L12 14" />
      <path data-ev-id="ev_86ba5f91db" d="M22 10 L12 14" />
    </svg>);

}

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div data-ev-id="ev_12986a0b00" className="border border-gray-200 rounded-xl overflow-hidden">
      <button data-ev-id="ev_684b52bdc8"
      onClick={() => setIsOpen(!isOpen)}
      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">

        <div data-ev-id="ev_8f35965dc9" className="flex items-center gap-3">
          <div data-ev-id="ev_7f270a6ab8" className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest">
            {icon}
          </div>
          <span data-ev-id="ev_075c0e4144" className="font-medium text-gray-800">{title}</span>
        </div>
        {isOpen ?
        <ChevronUp className="w-5 h-5 text-gray-400" /> :

        <ChevronDown className="w-5 h-5 text-gray-400" />
        }
      </button>
      {isOpen &&
      <div data-ev-id="ev_9d5901f485" className="p-4 pt-0 bg-white">
          <div data-ev-id="ev_c05c6ab78c" className="pt-3 border-t border-gray-100">
            {children}
          </div>
        </div>
      }
    </div>);

}

interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  whenToUse: string;
  tip: string;
  onClick: () => void;
  color: string;
}

function MethodCard({ icon, title, description, whenToUse, tip, onClick, color }: MethodCardProps) {
  return (
    <button data-ev-id="ev_20c108c37b"
    onClick={onClick}
    className="w-full text-right bg-white rounded-xl border border-gray-200 p-4 hover:border-forest/30 hover:shadow-md transition-all">

      <div data-ev-id="ev_e67c59e1cf" className="flex items-start gap-3">
        <div data-ev-id="ev_16376f19e9" className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div data-ev-id="ev_d93da492bb" className="flex-1 min-w-0">
          <h3 data-ev-id="ev_e763cdb3b5" className="font-bold text-gray-800 mb-1">{title}</h3>
          <p data-ev-id="ev_913e43725f" className="text-sm text-gray-600 mb-2">{description}</p>
          <p data-ev-id="ev_69536910cc" className="text-xs text-gray-500 mb-1">
            <span data-ev-id="ev_d897d4d5f1" className="font-medium">מתי להשתמש:</span> {whenToUse}
          </p>
          <p data-ev-id="ev_f8f7c2593c" className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 inline-block">
            💡 {tip}
          </p>
        </div>
      </div>
    </button>);

}

export default function Help() {
  const navigate = useNavigate();

  const methods = [
  {
    id: 'quiz',
    icon: <ListChecks className="w-6 h-6 text-white" />,
    title: 'שאלון מודרך',
    description: 'עונים על שאלות פשוטות, האפליקציה מצמצמת את האפשרויות',
    whenToUse: 'ראיתם כמה פרטים ויש לכם זמן לחשוב',
    tip: 'לא בטוחים בתשובה? דלגו לשאלה הבאה',
    color: 'bg-forest',
    action: () => navigate('/quiz?mode=quiz')
  },
  {
    id: 'tags',
    icon: <Tags className="w-6 h-6 text-white" />,
    title: 'סינון לפי תגיות',
    description: 'בוחרים מאפיינים שראיתם ומקבלים רשימה מצומצמת',
    whenToUse: 'יש לכם סימן בולט אחד או שניים',
    tip: 'התחילו מהדבר הכי בולט שראיתם',
    color: 'bg-emerald-500',
    action: () => navigate('/quiz?mode=tags')
  },
  {
    id: 'wings',
    icon: <WingIcon className="w-6 h-6 text-white" />,
    title: 'זיהוי לפי מנח כנפיים',
    description: 'בוחרים את תנוחת הכנפיים מתוך איורים',
    whenToUse: 'הדורס גולש ורואים את הכנפיים ברור',
    tip: 'זה אחד הסימנים הכי אמינים מרחוק!',
    color: 'bg-amber-500',
    action: () => navigate('/wing-postures')
  },
  {
    id: 'size',
    icon: <Ruler className="w-6 h-6 text-white" />,
    title: 'זיהוי לפי גודל',
    description: 'משווים לציפור מוכרת כמו יונה, עורב או חסידה',
    whenToUse: 'רק הגודל נראה לכם ברור',
    tip: 'השוואה לציפור אחרת באותו מקום עוזרת מאוד',
    color: 'bg-orange-500',
    action: () => navigate('/size')
  }];


  const tips = [
  {
    title: 'לא הצלחתם לזהות - זה בסדר!',
    content: 'גם מומחים לא מזהים הכל. תעדו מה שראיתם (צילום או תיאור) ונסו שוב בהזדמנות הבאה.'
  },
  {
    title: 'התמקדו בצללית',
    content: 'צבעים משתנים לפי תאורה ומרחק, אבל הצורה הכללית - הצללית - נשארת קבועה.'
  },
  {
    title: 'התחילו מהנפוצים',
    content: 'בז מצוי, חיוויאי, עקב, דיה, זרון סוף - אלה הדורסים שתפגשו הכי הרבה. הכירו אותם קודם.'
  }];


  return (
    <Layout>
      <div data-ev-id="ev_b921abb83e" className="max-w-3xl mx-auto px-4 py-8" dir="rtl">
        {/* כותרת */}
        <div data-ev-id="ev_27b328da4f" className="text-center mb-8">
          <div data-ev-id="ev_2a8ea1e055" className="flex justify-center mb-3">
            <div data-ev-id="ev_8a69022d79" className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-forest" />
            </div>
          </div>
          <h1 data-ev-id="ev_937ee839f4" className="text-2xl font-bold text-forest mb-2">עזרה והדרכה</h1>
          <p data-ev-id="ev_e75d47bd66" className="text-gray-600">כל מה שצריך לדעת כדי להתחיל לזהות דורסים</p>
        </div>

        {/* סקשן 1: מה האפליקציה ומה לא */}
        <section data-ev-id="ev_ae6cf62a6c" className="mb-8">
          <h2 data-ev-id="ev_837b74d2f6" className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span data-ev-id="ev_f5d116c9bf" className="w-6 h-6 rounded-full bg-forest text-white text-sm flex items-center justify-center">1</span>
            לפני שמתחילים
          </h2>
          
          <div data-ev-id="ev_e5f6bfe499" className="bg-white rounded-2xl border border-gray-200 p-5">
            {/* מה כן */}
            <div data-ev-id="ev_a2a78eb1dd" className="mb-5">
              <h3 data-ev-id="ev_239f4a1159" className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                האפליקציה היא:
              </h3>
              <ul data-ev-id="ev_6582113ac1" className="flex flex-col gap-2 text-sm text-gray-600 mr-7">
                <li data-ev-id="ev_9202880554">• כלי עזר ראשוני לזיהוי דורסים נפוצים בישראל</li>
                <li data-ev-id="ev_30e9bc5d40">• נקודת התחלה ללימוד עצמי</li>
                <li data-ev-id="ev_d635871129">• דרך ללמוד את המונחים והמאפיינים החשובים</li>
                <li data-ev-id="ev_9ec89a3bf5">• עוזרת לצמצם אפשרויות ולכוון לכיוון הנכון</li>
              </ul>
            </div>
            
            {/* מה לא */}
            <div data-ev-id="ev_2815e0bde5" className="mb-5">
              <h3 data-ev-id="ev_feaf9492c1" className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                האפליקציה <span data-ev-id="ev_91638d89a9" className="font-bold">אינה</span>:
              </h3>
              <ul data-ev-id="ev_6d8ec41d1c" className="flex flex-col gap-2 text-sm text-gray-600 mr-7">
                <li data-ev-id="ev_7e5478fcc4">• תחליף לעבודת שטח ולניסיון אישי</li>
                <li data-ev-id="ev_bcb288c0ea">• מסוגלת לזהות 100% מהמקרים (גם מומחים לא תמיד מצליחים!)</li>
                <li data-ev-id="ev_8e37ff7916">• כוללת את כל גילאי הנוצה, עונות ומצבי תאורה</li>
                <li data-ev-id="ev_420572d397">• תחליף למדריכי שדה מקיפים ולהדרכה מקצועית</li>
              </ul>
            </div>
            
            {/* מסר מעודד */}
            <div data-ev-id="ev_0dbc4c8f97" className="bg-forest/5 rounded-xl p-4 border border-forest/10">
              <p data-ev-id="ev_1c239ebd86" className="text-sm text-forest leading-relaxed">
                <span data-ev-id="ev_7edf21e00f" className="font-medium">זיהוי דורסים הוא מיומנות שמתפתחת עם הזמן.</span>
                {' '}
                האפליקציה תעזור לכם להתחיל, אבל הדרך האמיתית ללמוד היא לצאת לשטח, להסתכל, לטעות ולנסות שוב. בהצלחה! 🦅
              </p>
            </div>
          </div>
        </section>

        {/* סקשן 2: שיטות זיהוי */}
        <section data-ev-id="ev_deb0905ef6" className="mb-8">
          <h2 data-ev-id="ev_d25fd9f7d7" className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span data-ev-id="ev_5e3c4708d2" className="w-6 h-6 rounded-full bg-forest text-white text-sm flex items-center justify-center">2</span>
            איך האפליקציה יכולה לעזור
          </h2>
          
          <div data-ev-id="ev_7a676bc0d8" className="flex flex-col gap-3">
            {methods.map((method) =>
            <MethodCard
              key={method.id}
              icon={method.icon}
              title={method.title}
              description={method.description}
              whenToUse={method.whenToUse}
              tip={method.tip}
              color={method.color}
              onClick={method.action} />

            )}
          </div>
        </section>

        {/* סקשן 3: המונחון */}
        <section data-ev-id="ev_1a7d2e09af" className="mb-8">
          <h2 data-ev-id="ev_0d57413bbd" className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span data-ev-id="ev_cea679a7cc" className="w-6 h-6 rounded-full bg-forest text-white text-sm flex items-center justify-center">3</span>
            המונחון - ללמוד את השפה
          </h2>
          
          <div data-ev-id="ev_f95a85509d" className="bg-white rounded-2xl border border-gray-200 p-5">
            <p data-ev-id="ev_6714c9a2ea" className="text-sm text-gray-600 mb-4 leading-relaxed">
              כדי לזהות דורסים, כדאי קודם להכיר את המונחים. מה זה "V עמוק"? מה זה "זנב מזלגי"? 
              במונחון תמצאו הסברים ותרשימים שיעזרו לכם להבין את השפה.
            </p>
            <button data-ev-id="ev_a6b273cc95"
            onClick={() => navigate('/glossary')}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition-colors">

              <BookOpen className="w-5 h-5" />
              למונחון ולתרשימים
            </button>
          </div>
        </section>

        {/* סקשן 4: טיפים */}
        <section data-ev-id="ev_c8ec8ccd30" className="mb-8">
          <h2 data-ev-id="ev_eb133780f5" className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span data-ev-id="ev_069fc62cb1" className="w-6 h-6 rounded-full bg-forest text-white text-sm flex items-center justify-center">4</span>
            טיפים למתחילים
          </h2>
          
          <div data-ev-id="ev_dadbd7f606" className="flex flex-col gap-3">
            {tips.map((tip, index) =>
            <AccordionItem
              key={index}
              title={tip.title}
              icon={<Lightbulb className="w-4 h-4" />}
              defaultOpen={index === 0}>

                <p data-ev-id="ev_035d0ecb44" className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
              </AccordionItem>
            )}
          </div>
        </section>

        {/* כפתור חזרה לדף הבית */}
        <div data-ev-id="ev_688119d3a6" className="text-center">
          <button data-ev-id="ev_fe4956464b"
          onClick={() => navigate('/')}
          className="text-forest hover:text-forest/80 font-medium transition-colors">

            ← חזרה לדף הבית
          </button>
        </div>
      </div>
    </Layout>);

}