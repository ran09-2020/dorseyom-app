import { useNavigate } from 'react-router';
import { Layout } from '@/components/Layout';
import { ListChecks, Tags, MapPin, Images, Ruler } from 'lucide-react';

// אייקון מנח כנפיים V רדוד
function ShallowVIcon({ className }: {className?: string;}) {
  return (
    <svg data-ev-id="ev_4201ef1662"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>

      <path data-ev-id="ev_9a8830b9b5" d="M2 10 L12 14" />
      <path data-ev-id="ev_c18de473b8" d="M22 10 L12 14" />
    </svg>);

}

interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

function MethodCard({ icon, title, description, onClick, color }: MethodCardProps) {
  return (
    <button data-ev-id="ev_28d2359678"
    onClick={onClick}
    className={`flex flex-col items-center p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-transparent hover:border-forest/20 text-center`}>

      <div data-ev-id="ev_4717d036cd" className={`w-14 h-14 rounded-full ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 data-ev-id="ev_72ed3ae8a7" className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p data-ev-id="ev_d83f87661a" className="text-sm text-gray-500">{description}</p>
    </button>);

}

export default function Home() {
  const navigate = useNavigate();

  const methods = [
  {
    id: 'quiz',
    icon: <ListChecks className="w-7 h-7 text-white" />,
    title: 'שאלון',
    description: 'ענו על שאלות ומצאו את הדורס',
    color: 'bg-forest',
    action: () => navigate('/quiz?mode=quiz')
  },
  {
    id: 'size',
    icon: <Ruler className="w-7 h-7 text-white" />,
    title: 'גודל',
    description: 'זהו לפי גודל משוער',
    color: 'bg-orange-500',
    action: () => navigate('/size')
  },
  {
    id: 'location',
    icon: <MapPin className="w-7 h-7 text-white" />,
    title: 'מיקום ותאריך',
    description: 'סננו לפי אזור ועונה',
    color: 'bg-blue-500',
    action: () => navigate('/quiz?mode=location')
  },
  {
    id: 'wings',
    icon: <ShallowVIcon className="w-7 h-7 text-white" />,
    title: 'מנח כנפיים',
    description: 'זהו לפי צורת הכנפיים בגלישה',
    color: 'bg-amber-500',
    action: () => navigate('/wing-postures')
  },
  {
    id: 'tags',
    icon: <Tags className="w-7 h-7 text-white" />,
    title: 'תיוג',
    description: 'סננו לפי גודל, צבע או משפחה',
    color: 'bg-emerald-500',
    action: () => navigate('/quiz?mode=tags')
  },
  {
    id: 'gallery',
    icon: <Images className="w-7 h-7 text-white" />,
    title: 'גלריה',
    description: 'דפדפו בתמונות כל הדורסים',
    color: 'bg-purple-500',
    action: () => navigate('/gallery')
  }];


  return (
    <Layout>
      <div data-ev-id="ev_58c1378aa1" className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
        {/* מבוא */}
        <div data-ev-id="ev_dd6afadebd" className="text-center mb-10">
          <div data-ev-id="ev_53e8d063b4" className="flex justify-center mb-4">
            <img data-ev-id="ev_d3c29312a0" src="/favicon.png" alt="דאה" className="w-20 h-20 rounded-full shadow-lg" />
          </div>
          <h1 data-ev-id="ev_7cb8f796fe" className="text-3xl font-bold text-forest mb-3">ברוכים הבאים לדאה</h1>
          <p data-ev-id="ev_cc09a5565a" className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            {/* מובייל - ללא מקף */}
            <span data-ev-id="ev_e07989e4d7" className="sm:hidden">
              אפליקציה לזיהוי דורסים בתעופה<br data-ev-id="ev_ce9c8c6474" />
              על פי תצפיות בשטח
            </span>
            {/* דסקטופ - עם מקף */}
            <span data-ev-id="ev_7a1ac69064" className="hidden sm:inline">
              אפליקציה לזיהוי דורסים בתעופה - על פי תצפיות בשטח
            </span>
          </p>
          <p data-ev-id="ev_b34e1ccd68" className="text-sm text-gray-500 mt-2">
            בחרו את שיטת הזיהוי המתאימה לכם:
          </p>
        </div>

        {/* כרטיס שאלון - מודגש */}
        <div data-ev-id="ev_34062ba9e4" className="mb-6">
          <div data-ev-id="ev_be67fbc889" className="bg-forest/5 border border-forest/20 rounded-xl p-4 mb-3">
            <p data-ev-id="ev_44e6e18e0b" className="text-sm text-forest font-medium text-center">
              💡 מומלץ להתחיל כאן - השאלון מנחה צעד אחר צעד, בלי צורך בידע מוקדם
            </p>
          </div>
          <button data-ev-id="ev_51a8857892"
          onClick={() => navigate('/quiz?mode=quiz')}
          className="w-full flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] border-2 border-forest text-center">

            <div data-ev-id="ev_fdf2a403c0" className="w-16 h-16 rounded-full bg-forest flex items-center justify-center mb-3">
              <ListChecks className="w-8 h-8 text-white" />
            </div>
            <h3 data-ev-id="ev_5cace09c85" className="text-xl font-bold text-forest mb-1">שאלון מודרך</h3>
            <p data-ev-id="ev_ef6e7bfce1" className="text-sm text-gray-500">ענו על שאלות ומצאו את הדורס</p>
          </button>
        </div>

        {/* שיטות נוספות */}
        <p data-ev-id="ev_7ae5d42c5e" className="text-sm text-gray-400 text-center mb-3">שיטות זיהוי נוספות</p>
        
        {/* כרטיסיות שיטות זיהוי */}
        <div data-ev-id="ev_6ad2fad8c4" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {methods.filter((m) => m.id !== 'quiz').map((method) =>
          <MethodCard
            key={method.id}
            icon={method.icon}
            title={method.title}
            description={method.description}
            color={method.color}
            onClick={method.action} />

          )}
        </div>

      </div>
    </Layout>);

}