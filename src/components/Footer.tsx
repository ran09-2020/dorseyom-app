import { useState } from 'react';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <footer data-ev-id="ev_03b8c80bac" className="bg-forest-dark text-white mt-8">
      <div data-ev-id="ev_c7fb16a034" className="max-w-6xl mx-auto px-4 py-6">
        {/* מקורות מתקפלים */}
        <div data-ev-id="ev_6f1780a59b" className="border-b border-white/20 pb-4">
          <button data-ev-id="ev_936336750a"
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className="flex items-center justify-center gap-2 w-full text-white/70 text-sm hover:text-white transition-colors">

            <span data-ev-id="ev_bacd1b44a6">מקורות</span>
            {sourcesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {sourcesOpen &&
          <p data-ev-id="ev_be78d677d9" className="text-white/60 text-xs leading-relaxed mt-3 text-center">
              אביהוד ענת (2004), מגדיר דורסים, החברה להגנת הטבע;
              פורטר, ויליס, כריסטיאנסן ונילסן (1987), זיהוי דורסים בתעופה;
              מולארני, סוונסון, צטרסטרום וגרנט (2003), הציפורים - המדריך השלם;
              לשם יוסי (1979), העופות הדורסים בישראל;
              נועם קירשנבאום (2015), ציפורים נודדות;
              פוסטר מנחי כנפיים: מעוף הציפור - ד"ר עודד בן מנחם.
            </p>
          }
        </div>
        
        {/* קרדיט */}
        <div data-ev-id="ev_d7fb54dc62" className="pt-4 text-center text-sm text-white/60">
          האתר תוכנן ואורגן ע״י רענן ארבל
        </div>
        
        {/* זכויות יוצרים + מייל */}
        <div data-ev-id="ev_d7fb54dc62" className="pt-2 flex items-center justify-center gap-3 text-sm text-white/60">
          <a data-ev-id="ev_6eefd75371"
          href="mailto:raanan.arbel@gmail.com"
          className="hover:text-white/80 transition-colors"
          title="שלח מייל">

            <Mail className="w-4 h-4" />
          </a>
          <span data-ev-id="ev_80478528d1">© ארבל {currentYear}</span>
        </div>
      </div>
    </footer>);

}