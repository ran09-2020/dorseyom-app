import { Link, useLocation } from 'react-router';
import { Home, Shield, BookOpen, HelpCircle } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav data-ev-id="ev_6dbcd2dee1" className="bg-forest text-white shadow-lg sticky top-0 z-50">
      <div data-ev-id="ev_57d09fd73e" className="max-w-6xl mx-auto px-3 sm:px-4">
        <div data-ev-id="ev_c3ac5ae20e" className="flex items-center justify-between h-auto py-1 sm:py-2">
          {/* לוגו */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity flex-shrink-0">
            <img data-ev-id="ev_90f32cd81e" src="/favicon.png" alt="דאה" className="w-6 h-6 sm:w-9 sm:h-9 rounded-full" />
            <div data-ev-id="ev_2df0adff4a" className="flex flex-col leading-none">
              <span data-ev-id="ev_3f76ea91fa" className="font-bold text-base sm:text-xl leading-tight">דאה</span>
              
              {/* מובייל בלבד - שתי שורות */}
              <div data-ev-id="ev_58c0daf882" className="sm:hidden">
                <span data-ev-id="ev_7572118d4f" className="text-white/80 text-[8px] leading-tight block">אפליקציה לזיהוי דורסים בתעופה</span>
                <span data-ev-id="ev_063ef180ed" className="text-white/60 text-[7px] leading-tight block">על פי תצפית בשטח</span>
              </div>
              
              {/* דסקטופ בלבד - שורה אחת */}
              <span data-ev-id="ev_199925a425" className="hidden sm:block text-white/80 text-[11px] leading-tight">אפליקציה לזיהוי דורסים בתעופה - על פי תצפית בשטח</span>
            </div>
          </Link>
          
          {/* תפריט ניווט */}
          <div data-ev-id="ev_32881ab373" className="flex items-center gap-0.5 sm:gap-1">
            <NavLink to="/" icon={<Home className="w-4 h-4 sm:w-5 sm:h-5" />} label="בית" active={isActive('/')} />
            <NavLink to="/glossary" icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />} label="מונחון" active={isActive('/glossary')} highlight />
            <NavLink to="/help" icon={<HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />} label="עזרה" active={isActive('/help')} />
            <NavLink to="/admin" icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />} label="ניהול" active={isActive('/admin')} />
          </div>
        </div>
      </div>
    </nav>);

}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  highlight?: boolean;
}

function NavLink({ to, icon, label, active, highlight }: NavLinkProps) {
  const baseClasses = "flex items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-0.5 sm:py-2 rounded-lg text-sm font-medium transition-colors";

  let stateClasses: string;
  if (highlight) {
    stateClasses = active ?
    'bg-amber-500 text-white' :
    'bg-amber-500/80 text-white hover:bg-amber-500';
  } else {
    stateClasses = active ?
    'bg-white/20 text-white' :
    'text-white/80 hover:bg-white/10 hover:text-white';
  }

  return (
    <Link to={to} className={`${baseClasses} ${stateClasses}`}>
      {icon}
      <span data-ev-id="ev_481d513233" className="hidden sm:inline">{label}</span>
    </Link>);

}