import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { BIRDS, Bird, FAMILY_NAMES, BirdFamily, Region, SeasonStatus, REGION_NAMES, SEASON_STATUS_NAMES, RARITY_NAMES } from '@/data/birds';
import { getWingspan } from '@/data/wingspans';
import { RegionSeasonSelector, FilterSelection } from '@/components/RegionSeasonSelector';
import { Question } from '@/data/questions';
import { useQuestionsWithOverrides } from '@/hooks/useQuestionsWithOverrides';
import { Layout } from '@/components/Layout';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { validateBirdIdentification } from '@/utils/validateBirds';
import { getSimilarityWarning, getKnownPairHint, getDetailedComparison, findKnownGroupInCandidates, getPreQuestionWarning } from '@/utils/similarityWarning';
import { Camera, HelpCircle, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { HintModal } from '@/components/HintModal';
import { BirdPhotoLightbox } from '@/components/BirdPhotoLightbox';
import { TagFilter } from '@/components/TagFilter';
import { supabase } from '@/integrations/supabase/client';
import { useBirdsWithOverrides, BirdWithOverrides } from '@/hooks/useBirdsWithOverrides';

interface HistoryState {
  candidates: string[];
  answered: Record<string, string>;
  qCount: number;
}

type ViewMode = 'quiz' | 'tags';
type SetupPhase = 'selecting' | 'ready';

// חודשי נדידה בישראל
const MIGRATION_MONTHS = [3, 4, 5, 9, 10, 11]; // מרץ-מאי, ספט'-נוב'

// פונקציה להמרת חודש לסטטוס עונתי
function getSeasonStatusForMonth(month: number): SeasonStatus[] {
  // חורף: נוב'-מרץ
  if (month >= 11 || month <= 3) return ['resident', 'winter'];
  // קיץ: מאי-אוג'
  if (month >= 5 && month <= 8) return ['resident', 'summer'];
  // מעבר: אפריל, ספט'-אוק'
  return ['resident', 'passage', 'summer', 'winter']; // בזמן מעבר הכל אפשרי
}

// פונקציה לבדיקה אם דורס רלוונטי לסינון
function isBirdRelevant(
bird: Bird,
region: Region | null,
month: number | null)
: boolean {
  // אם אין סינון - הכל רלוונטי
  if (!region && !month) return true;

  // בדיקת אזור
  if (region && region !== 'all') {
    const birdRegions = bird.regions || [];
    const regionMatches = birdRegions.includes('all') || birdRegions.includes(region);

    // אם זו עונת נדידה והדורס נפוץ בנדידה - להציג בכל האזורים
    const isMigrationSeason = month && MIGRATION_MONTHS.includes(month);
    const migrationBonus = isMigrationSeason && bird.migrationCommon;

    if (!regionMatches && !migrationBonus) return false;
  }

  // בדיקת עונה
  if (month) {
    const birdSeasons = bird.seasonStatus || [];
    const relevantSeasons = getSeasonStatusForMonth(month);
    const seasonMatches = birdSeasons.some((s) => relevantSeasons.includes(s));

    // מזדמנים תמיד רלוונטיים (נדירים אבל אפשריים)
    const isVagrant = birdSeasons.includes('vagrant');

    if (!seasonMatches && !isVagrant) return false;
  }

  return true;
}

// בדיקה אם כל המועמדים שייכים לאותה משפחה
function getSingleFamily(candidates: string[], birdsData: Record<string, BirdWithOverrides>): BirdFamily | null {
  if (candidates.length === 0) return null;
  const families = new Set(candidates.map((id) => birdsData[id]?.family).filter(Boolean));
  if (families.size === 1) {
    return families.values().next().value as BirdFamily;
  }
  return null;
}

// קבלת שם התצוגה למשפחה - עם טיפול מיוחד בעקבים + איית צרעים
function getFamilyDisplayName(candidates: string[], birdsData: Record<string, BirdWithOverrides>, family: BirdFamily): string {
  if (family === 'buzzards') {
    const hasSnakeEagle = candidates.includes('snake_eagle');
    const hasOtherBuzzards = candidates.some((id) => id !== 'snake_eagle' && birdsData[id]?.family === 'buzzards');

    if (hasSnakeEagle && hasOtherBuzzards) {
      return 'עקבים ואיית צרעים';
    }
    if (hasSnakeEagle && !hasOtherBuzzards) {
      // רק איית צרעים - לא להציג באנר
      return '';
    }
    // רק עקבים רגילים
    return FAMILY_NAMES[family];
  }
  return FAMILY_NAMES[family];
}

// Lead photos map: bird_id -> image_url
type LeadPhotos = Record<string, string>;

export default function Index() {
  const { birds: BIRDS_DATA, loading: birdsLoading } = useBirdsWithOverrides();
  const { questions: QUESTIONS, loading: questionsLoading } = useQuestionsWithOverrides();
  const [candidates, setCandidates] = useState<string[]>([]);
  const [answered, setAnswered] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [qCount, setQCount] = useState(0);
  const [detail, setDetail] = useState<string | null>(null);
  const [hintModal, setHintModal] = useState<import('@/types/diagrams').DiagramType>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('quiz');
  const [leadPhotos, setLeadPhotos] = useState<LeadPhotos>({});
  const [shortcutDismissed, setShortcutDismissed] = useState(false);
  const [lightboxBird, setLightboxBird] = useState<{id: string;name: string;} | null>(null);
  const [setupPhase, setSetupPhase] = useState<SetupPhase>('selecting');
  const [filterSelection, setFilterSelection] = useState<FilterSelection>({ region: null, month: null });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Save quiz state and navigate to gallery
  const navigateToGallery = (birdKey: string) => {
    if (history.length > 0) {
      sessionStorage.setItem('quizState', JSON.stringify({
        candidates,
        answered,
        history,
        qCount
      }));
      navigate(`/gallery?bird=${birdKey}&fromQuiz=true`);
    } else {
      navigate(`/gallery?bird=${birdKey}`);
    }
  };

  // Scroll to top on mount and when view mode changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [viewMode]);

  // Scroll to top when opening/closing detail view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [detail]);

  // Initialize candidates only once when birds data first loads
  useEffect(() => {
    if (!birdsLoading && !questionsLoading && candidates.length === 0 && setupPhase === 'ready') {
      // Check if returning from gallery with quiz state
      const fromQuiz = searchParams.get('fromQuiz') === 'true';
      const savedState = sessionStorage.getItem('quizState');

      if (fromQuiz && savedState) {
        try {
          const state = JSON.parse(savedState);
          setCandidates(state.candidates);
          setAnswered(state.answered);
          setHistory(state.history);
          setQCount(state.qCount);
          sessionStorage.removeItem('quizState');
          return;
        } catch (e) {
          console.error('Failed to restore quiz state:', e);
        }
      }

      // Filter birds based on region/season selection
      const allBirds = Object.keys(BIRDS_DATA);
      const filteredBirds = allBirds.filter((birdId) => {
        const bird = BIRDS_DATA[birdId];
        return isBirdRelevant(bird, filterSelection.region, filterSelection.month);
      });

      setCandidates(filteredBirds.length > 0 ? filteredBirds : allBirds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birdsLoading, questionsLoading, searchParams, setupPhase, filterSelection, BIRDS_DATA]);

  // Skip to ready phase if returning from gallery
  useEffect(() => {
    const fromQuiz = searchParams.get('fromQuiz') === 'true';
    if (fromQuiz) {
      setSetupPhase('ready');
    }
  }, [searchParams]);

  // Handle mode param from navbar dropdown
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'quiz' || modeParam === 'tags') {
      setViewMode(modeParam);
      setSetupPhase('ready');
    } else if (modeParam === 'location') {
      // מצב location - להציג את בורר האזור/חודש
      setSetupPhase('selecting');
    }
  }, [searchParams]);

  // Fetch lead photos from database
  useEffect(() => {
    async function fetchLeadPhotos() {
      if (!supabase) return;

      const { data, error } = await supabase.
      from('photos').
      select('bird_id, image_url').
      eq('is_lead', true);

      if (!error && data) {
        const photosMap: LeadPhotos = {};
        data.forEach((photo) => {
          photosMap[photo.bird_id] = photo.image_url;
        });
        setLeadPhotos(photosMap);
      }
    }

    fetchLeadPhotos();
  }, []);

  // בדיקת תקינות הזיהוי - רק במצב פיתוח
  useEffect(() => {
    if (import.meta.env.DEV) {
      const result = validateBirdIdentification();
      if (!result.isValid) {
        console.warn('⚠️ יש ציפורים שלא ניתן להבחין ביניהן:');
        result.duplicatePairs.forEach((pair) => {
          console.warn(`  ${pair.bird1} ↔ ${pair.bird2}`);
        });
      } else {
        console.log('✅ כל הציפורים ניתנות לזיהוי ייחודי');
      }
    }
  }, []);

  // Clean up any invalid candidates (in case of stale state)
  useEffect(() => {
    const validKeys = Object.keys(BIRDS);
    setCandidates((prev) => {
      const filtered = prev.filter((b) => validKeys.includes(b));
      return filtered.length !== prev.length ? filtered : prev;
    });
  }, []);

  // Check for bird query param to show result card directly (from gallery back-link)
  useEffect(() => {
    const birdParam = searchParams.get('bird');
    if (birdParam && BIRDS_DATA[birdParam]) {
      setDetail(birdParam);
    }
  }, [searchParams, BIRDS_DATA]);

  const total = Object.keys(BIRDS_DATA).length;
  const remaining = candidates.length;

  const getBestQuestion = useCallback((): Question | null => {
    let best: Question | null = null;
    let bestScore = -1;
    const candidateCount = candidates.length;

    for (const q of QUESTIONS) {
      if (answered[q.id] !== undefined) continue;

      const yes = candidates.filter((b) => BIRDS_DATA[b]?.attrs[q.id] === true).length;
      const no = candidates.filter((b) => BIRDS_DATA[b]?.attrs[q.id] === false).length;

      if (yes === 0 || no === 0) continue;

      // Base score: how well the question splits candidates
      let score = Math.min(yes, no);

      // Signature question bonus: if this question is a signature for any current candidate
      // Only apply bonus if signature_requires condition is met (or no condition exists)
      const requiresMet = !q.signature_requires || answered[q.signature_requires] === 'y';
      if (requiresMet && q.signature_for && q.signature_for.some((bird) => candidates.includes(bird))) {
        const strength = q.signature_strength ?? 1; // עוצמה 2 = שאלה ראשית, 1 = משנית
        score += 25 * strength; // בונוס לפי עוצמת החתימה
      }

      // When we have fewer candidates, give bonus to questions that identify rare birds
      // This ensures rare species can be reached via their unique traits
      if (candidateCount <= 15) {
        if (yes === 1) {
          score += 20; // Strong bonus for unique identifier
        } else if (yes === 2) {
          score += 15; // Good bonus for rare trait
        } else if (yes === 3) {
          score += 5; // Small bonus
        }
      }

      if (score > bestScore) {
        bestScore = score;
        best = q;
      }
    }
    return best;
  }, [candidates, answered, BIRDS_DATA, QUESTIONS]);

  const handleAnswer = (qId: string, resp: 'y' | 'n' | '?') => {
    setHistory((prev) => [...prev, { candidates: [...candidates], answered: { ...answered }, qCount }]);

    setAnswered((prev) => ({ ...prev, [qId]: resp }));

    if (resp === 'y') {
      setCandidates((prev) => prev.filter((b) => BIRDS_DATA[b]?.attrs[qId] !== false));
    } else if (resp === 'n') {
      setCandidates((prev) => prev.filter((b) => BIRDS_DATA[b]?.attrs[qId] !== true));
    }

    setQCount((prev) => prev + 1);
    setDetail(null);

    // Scroll to top after answering
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goBack = () => {
    if (history.length === 0) {
      // אין היסטוריית שאלון - חזרה בהיסטוריית הדפדפן
      window.history.back();
      return;
    }
    const prev = history[history.length - 1];
    setCandidates(prev.candidates);
    setAnswered(prev.answered);
    setQCount(prev.qCount);
    setDetail(null);
    setHistory((h) => h.slice(0, -1));
    setShortcutDismissed(false); // לאפשר לקיצור להופיע שוב אחרי חזרה אחורה

    // Scroll to top after going back
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const restart = () => {
    setCandidates([]);
    setAnswered({});
    setHistory([]);
    setQCount(0);
    setDetail(null);
    setShortcutDismissed(false);
    setSetupPhase('selecting');
    setFilterSelection({ region: null, month: null });
    // ניקוי הכתובת מפרמטרים כדי לחזור למסך הבחירה
    navigate('/', { replace: true });
  };

  // Handler for region/season selection
  const handleFilterStart = (selection: FilterSelection) => {
    setFilterSelection(selection);
    setSetupPhase('ready');
  };

  const handleFilterSkip = () => {
    setFilterSelection({ region: null, month: null });
    setSetupPhase('ready');
  };

  const nextQ = getBestQuestion();
  const progress = (total - remaining) / total * 100;

  // Show loading state while birds data is loading
  if (birdsLoading) {
    return (
      <div data-ev-id="ev_ca0ea85125" className="min-h-screen flex flex-col bg-[#eef2ee]" dir="rtl">
        <Navbar />
        <div data-ev-id="ev_1747da995c" className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-forest" />
        </div>
        <Footer />
      </div>);
  }

  // Show region/season selector before quiz starts
  // BUT skip if we have a direct bird link (from gallery, wing postures, etc.)
  const directBirdParam = searchParams.get('bird');
  const hasDirectBirdLink = directBirdParam && BIRDS_DATA[directBirdParam];

  if (setupPhase === 'selecting' && !hasDirectBirdLink) {
    return (
      <div data-ev-id="ev_78696b9f20" className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50" dir="rtl">
        <Navbar />
        <RegionSeasonSelector
          onStart={handleFilterStart}
          onSkip={handleFilterSkip} />
      </div>);
  }

  // Show result if detail is set
  if (detail) {
    const bird = BIRDS_DATA[detail];
    const leadPhoto = leadPhotos[detail] || undefined;
    const fromGallery = searchParams.get('from') === 'gallery';
    const fromQuiz = searchParams.get('fromQuiz') === 'true';
    const hasQuizHistory = history.length > 0 || fromQuiz;

    return (
      <div data-ev-id="ev_00392725f6" className="min-h-screen flex flex-col bg-[#eef2ee]" dir="rtl">
        <Navbar />
        <div data-ev-id="ev_7b0d77c536" className="flex-1 flex flex-col items-center p-5">
          {fromGallery && !fromQuiz ?
          <GalleryHeader birdName={bird.name} /> :

          <Header onRestart={restart} showRestart={false} />
          }
          <div data-ev-id="ev_90c8c786f2" className={`bg-white rounded-[14px] shadow-lg p-6 max-w-[580px] w-full ${fromGallery ? 'animate-fade-in' : ''}`}>
            <ResultCard
              bird={bird}
              birdKey={detail}
              onRestart={restart}
              onBack={goBack}
              showBackToList={remaining > 1 && (remaining <= 4 || !nextQ)}
              onBackToList={() => setDetail(null)}
              leadPhoto={leadPhoto}
              fromGallery={fromGallery}
              hasQuizHistory={hasQuizHistory}
              onNavigateToGallery={() => navigateToGallery(detail)}
              onPhotoClick={() => setLightboxBird({ id: detail, name: bird.name })} />
          </div>
          <HintModal isOpen={!!hintModal} onClose={() => setHintModal(null)} hintType={hintModal} />
          <BirdPhotoLightbox
            birdId={lightboxBird?.id || null}
            birdName={lightboxBird?.name || ''}
            isOpen={!!lightboxBird}
            onClose={() => setLightboxBird(null)} />
        </div>
        <Footer />
      </div>);
  }

  // Auto-show result if only 1 candidate
  if (remaining === 1) {
    setDetail(candidates[0]);
    return null;
  }

  // No candidates found
  if (remaining === 0) {
    return (
      <div data-ev-id="ev_a3d5e59bfa" className="min-h-screen flex flex-col bg-[#eef2ee]" dir="rtl">
        <Navbar />
        <div data-ev-id="ev_94234c5b87" className="flex-1 flex flex-col items-center p-5">
          <Header onRestart={restart} showRestart={true} />
          <div data-ev-id="ev_cf45f95ca2" className="bg-white rounded-[14px] shadow-lg p-6 max-w-[580px] w-full text-center">
            <p data-ev-id="ev_f5de6a42f5" className="text-gray-500 py-5">לא נמצא דורס מתאים.</p>
            <button data-ev-id="ev_a0e04265cf"
            className="text-[#2c5f2e] underline text-sm hover:text-[#1e4620] font-medium"
            onClick={goBack}>
              ← חזרה
            </button>
          </div>
        </div>
        <Footer />
      </div>);


  }

  // Show candidate list if <=4 or no more questions
  if (remaining <= 4 || !nextQ) {
    return (
      <div data-ev-id="ev_245df8b551" className="min-h-screen flex flex-col bg-[#eef2ee]" dir="rtl">
        <Navbar />
        <div data-ev-id="ev_6ddef0d9b2" className="flex-1 flex flex-col items-center p-5">
          <Header onRestart={restart} showRestart={false} />
          <div data-ev-id="ev_5a7eb97161" className="bg-white rounded-[14px] shadow-lg p-6 max-w-[580px] w-full">
            {/* מחוון קבוצה - מוצג רק כשכל המועמדים מאותה משפחה */}
            {(() => {
              const singleFamily = getSingleFamily(candidates, BIRDS_DATA);
              if (!singleFamily || singleFamily === 'other') return null;
              const displayName = getFamilyDisplayName(candidates, BIRDS_DATA, singleFamily);
              if (!displayName) return null;
              return (
                <div data-ev-id="ev_971c5a1ba3" className="text-[#5a8a5c] text-sm font-medium mb-3 border-b border-[#5a8a5c33] pb-2">
                  🦭 מזהים כעת: <span data-ev-id="ev_c9e91444a1" className="font-bold">{displayName}</span>
                </div>);

            })()}
            <CandidateList
              candidates={candidates}
              nextQ={nextQ}
              onSelect={(id) => setDetail(id)}
              onAnswer={handleAnswer}
              onBack={goBack}
              onRestart={restart}
              onShowHint={(h) => setHintModal(h as import('@/components/HintModal').DiagramType)}
              hasHistory={history.length > 0}
              leadPhotos={leadPhotos}
              birdsData={BIRDS_DATA}
              onPhotoClick={(birdId, birdName) => setLightboxBird({ id: birdId, name: birdName })}
              onNavigateToGallery={(birdId) => navigateToGallery(birdId)} />
          </div>
          <HintModal isOpen={!!hintModal} onClose={() => setHintModal(null)} hintType={hintModal} />
          <BirdPhotoLightbox
            birdId={lightboxBird?.id || null}
            birdName={lightboxBird?.name || ''}
            isOpen={!!lightboxBird}
            onClose={() => setLightboxBird(null)} />
        </div>
        <Footer />
      </div>);


  }

  // Normal question view
  return (
    <div data-ev-id="ev_3d2e175354" className="min-h-screen flex flex-col bg-[#eef2ee]" dir="rtl">
      <Navbar />
      <div data-ev-id="ev_38a896bf68" className="flex-1 flex flex-col items-center p-5">
        <Header onRestart={restart} showRestart={false} />
        <div data-ev-id="ev_629248f961" className="bg-white rounded-[14px] shadow-lg p-4 md:p-6 max-w-[580px] w-full">
          {/* Mode toggle */}
          <div data-ev-id="ev_c11e4a3aa2" className="flex gap-2 mb-3 md:mb-4">
            <button data-ev-id="ev_39f06670e5"
            onClick={() => setViewMode('quiz')}
            className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            viewMode === 'quiz' ?
            'bg-[#2c5f2e] text-white' :
            'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
            }>

              🎯 שאלון זיהוי
            </button>
            <button data-ev-id="ev_91b9f3d61e"
            onClick={() => setViewMode('tags')}
            className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            viewMode === 'tags' ?
            'bg-[#2c5f2e] text-white' :
            'bg-[#d4edda] text-[#155724] hover:bg-[#c3e6cb]'}`
            }>

              🏷️ זיהוי על פי תיוג
            </button>
          </div>

          {viewMode === 'tags' ?
          <TagFilter onSelectBird={(id) => setDetail(id)} birdsData={BIRDS_DATA} /> :

          <>
              {/* Progress bar */}
              <div data-ev-id="ev_fbd70676b0" className="h-[5px] bg-gray-200 rounded mb-4 overflow-hidden">
                <div data-ev-id="ev_50e0b82867"
              className="h-full bg-[#2c5f2e] rounded transition-all duration-400"
              style={{ width: `${progress}%` }} />
              </div>

              {/* Meta info */}
              <div data-ev-id="ev_69ed4cc8be" className="flex justify-between items-center mb-3">
                <span data-ev-id="ev_32670bf047" className="text-xs text-gray-400">שאלה {qCount + 1}</span>
                <span data-ev-id="ev_89a90db87b" className="text-xs text-[#2c5f2e] bg-[#eef8ee] px-2.5 py-0.5 rounded-xl font-bold">
                  נותרו {remaining} דורסים
                </span>
              </div>

              {/* מחוון קבוצה - מוצג רק כשכל המועמדים מאותה משפחה */}
              {(() => {
              const singleFamily = getSingleFamily(candidates, BIRDS_DATA);
              if (!singleFamily || singleFamily === 'other') return null;
              const displayName = getFamilyDisplayName(candidates, BIRDS_DATA, singleFamily);
              if (!displayName) return null;
              return (
                <div data-ev-id="ev_875e1314cd" className="text-[#5a8a5c] text-sm font-medium mb-4 border border-[#5a8a5c40] rounded-lg px-3 py-2 bg-[#f0f8f0]">
                    🦭 מזהים כעת: <span data-ev-id="ev_f734c48fa0" className="font-bold">{displayName}</span>
                  </div>);

            })()}

              {/* Shortcut to known similar group - only after answering yes to carpal */}
              {(() => {
              if (answered['carpal'] !== 'y') return null; // להציג רק אחרי שענו "כן" על כתם כהה בפרק היד
              const knownGroup = !shortcutDismissed ? findKnownGroupInCandidates(candidates) : null;
              if (!knownGroup) return null;
              return (
                <div data-ev-id="ev_caca821939" className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-4">
                    <div data-ev-id="ev_3dd91ec4f8" className="flex items-start gap-2 mb-3">
                      <span data-ev-id="ev_4a59c7f758" className="text-xl">💡</span>
                      <div data-ev-id="ev_92ce4d386d">
                        <p data-ev-id="ev_b01224b545" className="font-bold text-amber-800 mb-1">זיהינו קבוצה של דורסים דומים</p>
                        <p data-ev-id="ev_fafc55d777" className="text-sm text-amber-700">
                          בין המועמדים יש {knownGroup.birdIds.length} דורסים שקשה להבדיל ביניהם:
                          <span data-ev-id="ev_aa47c90522" className="font-bold"> {knownGroup.birdNames.join(', ')}</span>
                        </p>
                      </div>
                    </div>
                    <div data-ev-id="ev_3f4e8fd215" className="flex flex-col gap-2">
                      <button data-ev-id="ev_c59340aea1"
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      setHistory((prev) => [...prev, { candidates: [...candidates], answered: { ...answered }, qCount }]);
                      setCandidates(knownGroup.birdIds);
                      setQCount((prev) => prev + 1);
                    }}>

                        🔍 השווה בין {knownGroup.birdNames.join(', ')}
                      </button>
                      <button data-ev-id="ev_9c0513a4dd"
                    className="text-sm text-amber-700 hover:text-amber-900 underline"
                    onClick={() => setShortcutDismissed(true)}>

                        המשך עם כל {remaining} הדורסים ברשימה ←
                      </button>
                    </div>
                  </div>);

            })()}

              {/* Pre-question warning for similar pairs */}
              {(() => {
              const preWarning = getPreQuestionWarning(nextQ.id, candidates);
              if (!preWarning) return null;
              return (
                <div data-ev-id="ev_prequestion_warning" className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-4">
                    <p data-ev-id="ev_prequestion_title" className="font-bold text-amber-800 mb-2">{preWarning.title}</p>
                    <p data-ev-id="ev_prequestion_msg" className="text-sm text-amber-700 mb-3 whitespace-pre-line">{preWarning.message}</p>
                    
                    {/* Behavior question */}
                    <div data-ev-id="ev_behavior_q" className="bg-white rounded-lg p-3 mb-3">
                      <p data-ev-id="ev_behavior_text" className="text-sm font-bold text-gray-800 mb-3">{preWarning.behaviorQuestion}</p>
                      <div data-ev-id="ev_behavior_btns" className="flex flex-col gap-2">
                        <button
                        data-ev-id="ev_behavior_yes"
                        className="w-full py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                        onClick={() => {
                          // Save current state to history
                          setHistory((prev) => [...prev, { candidates: [...candidates], answered: { ...answered }, qCount }]);
                          // Mark the behavior question as answered
                          setAnswered((prev) => ({ ...prev, [preWarning.behaviorQuestionId]: 'y' }));
                          // Set candidates to only the result bird
                          setCandidates([preWarning.yesAnswer.resultBirdId]);
                          setQCount((prev) => prev + 1);
                        }}>

                          {preWarning.yesAnswer.label}
                        </button>
                        <button
                        data-ev-id="ev_behavior_no"
                        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                        onClick={() => {
                          // Mark behavior question as answered "no" - this eliminates lesser_kestrel from flocking attribute
                          // But we don't eliminate it from candidates yet - let the spotted_back question decide
                          setHistory((prev) => [...prev, { candidates: [...candidates], answered: { ...answered }, qCount }]);
                          setAnswered((prev) => ({ ...prev, [preWarning.behaviorQuestionId]: 'n' }));
                          setQCount((prev) => prev + 1);
                        }}>

                          {preWarning.noAnswer.label}
                        </button>
                      </div>
                    </div>
                  </div>);

            })()}

              {/* Question */}
              <div data-ev-id="ev_402f55d0d7" className="mb-5">
                <span data-ev-id="ev_4ad78f17c2" className="text-lg font-bold leading-relaxed text-gray-900">
                  {nextQ.text}
                </span>
                {(nextQ.diagram || nextQ.hint) &&
              <button data-ev-id="ev_d548aa0c12"
              className="bg-amber-100 border-2 border-amber-400 rounded-lg px-2 py-0.5 text-xs font-bold cursor-pointer text-amber-700 inline-flex items-center justify-center hover:bg-amber-200 hover:scale-105 transition-all shadow-sm mr-2 align-middle"
              onClick={() => setHintModal(nextQ.diagram || nextQ.hint as import('@/components/HintModal').DiagramType)}>
                    תרשים עזר
                  </button>
              }
                {nextQ.explanation &&
              <p data-ev-id="ev_fc1f045f64" className="text-sm text-gray-500 mt-2">
                  {nextQ.explanation}
                </p>
              }
              </div>

              {/* Answer buttons */}
              <div data-ev-id="ev_7cbdd30ad4" className="flex gap-2.5">
                <button data-ev-id="ev_d17ce4b0e1"
              className="flex-1 py-3 px-1.5 text-base border-none rounded-lg cursor-pointer font-bold transition-colors bg-[#2c5f2e] text-white hover:bg-[#245226] active:scale-[0.97]"
              onClick={() => handleAnswer(nextQ.id, 'y')}>

                  ✓ כן
                </button>
                <button data-ev-id="ev_aba1b33ea5"
              className="flex-1 py-3 px-1.5 text-sm border-none rounded-lg cursor-pointer font-bold transition-colors bg-[#e8d9a8] text-[#4a3a00] hover:bg-[#dccf98] active:scale-[0.97]"
              onClick={() => handleAnswer(nextQ.id, '?')}>

                  לא ברור
                </button>
                <button data-ev-id="ev_91b9f3d61e"
              className="flex-1 py-3 px-1.5 text-base border-none rounded-lg cursor-pointer font-bold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-[0.97]"
              onClick={() => handleAnswer(nextQ.id, 'n')}>

                  ✗ לא
                </button>
              </div>

              {/* Back button */}
              {history.length > 0 &&
            <div data-ev-id="ev_quiz_nav_buttons" className="flex flex-row gap-3 mt-10">
              <button data-ev-id="ev_110233d081"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#e8f4e8] border border-[#c5e1c5] text-[#2c5f2e] cursor-pointer text-sm py-3 px-4 rounded-lg hover:bg-[#d4edda] font-medium transition-colors"
              onClick={goBack}>
                  ← חזרה
                </button>
              <button data-ev-id="ev_quiz_restart"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#2c5f2e] border border-[#2c5f2e] text-white cursor-pointer text-sm py-3 px-4 rounded-lg hover:bg-[#245226] font-medium transition-colors"
              onClick={restart}>
                  🔄 התחלת זיהוי חדש
                </button>
            </div>
            }
            </>
          }
        </div>
        <HintModal isOpen={!!hintModal} onClose={() => setHintModal(null)} hintType={hintModal} />
      </div>
      <Footer />
    </div>);


}

interface HeaderProps {
  onRestart?: () => void;
  showRestart?: boolean;
}

function Header({ onRestart, showRestart }: HeaderProps) {
  return (
    <header data-ev-id="ev_f9c7989a3a" className="text-center mb-5">
      <p data-ev-id="ev_854813f333" className="text-lg text-[#2c5f2e] font-medium">ענו על שאלות לזיהוי דורס</p>
      {showRestart && onRestart &&
      <button data-ev-id="ev_a5565a15a8"
      onClick={onRestart}
      className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-gray-700 text-sm mt-2 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium transition-colors">
        🔄 התחלת זיהוי חדש
      </button>
      }
    </header>);
}

interface GalleryHeaderProps {
  birdName: string;
}

function GalleryHeader({ birdName }: GalleryHeaderProps) {
  return (
    <header data-ev-id="ev_75cd155f29" className="text-center mb-5 animate-fade-in">
      <p data-ev-id="ev_bfa1a2bd05" className="text-sm text-gray-500 mb-1">הגעתם מהגלריה</p>
      <p data-ev-id="ev_4cdc0000ba" className="text-xl text-[#2c5f2e] font-bold">צפייה בפרטי {birdName}</p>
    </header>);

}

interface ResultCardProps {
  bird: BirdWithOverrides;
  birdKey: string;
  onRestart: () => void;
  onBack: () => void;
  showBackToList: boolean;
  onBackToList: () => void;
  leadPhoto?: string;
  fromGallery?: boolean;
  hasQuizHistory?: boolean;
  onNavigateToGallery: () => void;
  onPhotoClick?: () => void;
}

function ResultCard({ bird, birdKey, onRestart, onBack, showBackToList, onBackToList, leadPhoto, fromGallery, hasQuizHistory, onNavigateToGallery, onPhotoClick }: ResultCardProps) {
  // Detect mobile for conditional behavior
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const handlePhotoClick = () => {
    // On desktop, go directly to gallery; on mobile, open lightbox
    if (isMobile) {
      onPhotoClick?.();
    } else {
      onNavigateToGallery();
    }
  };

  return (
    <div data-ev-id="ev_efa064a60b" className="text-center">


      {leadPhoto ?
      <img data-ev-id="ev_00e77d5d4c"
      src={leadPhoto}
      alt={bird.name}
      loading="lazy"
      onClick={handlePhotoClick}
      className="w-32 h-32 object-cover rounded-full mx-auto mb-3 shadow-lg border-4 border-[#2c5f2e] cursor-pointer hover:opacity-90 hover:scale-105 transition-all" /> :


      <div data-ev-id="ev_9b9377b534" className="text-5xl mb-2">🦅</div>
      }
      <div data-ev-id="ev_0caa228b9a" className="text-3xl font-bold text-[#2c5f2e] mb-1">
        {bird.name}
        {bird.rare && <span data-ev-id="ev_12f05bf23f" className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mr-2 align-middle">נדיר בישראל</span>}
      </div>
      <div data-ev-id="ev_1734c6cf4c" className="text-sm text-gray-400 italic mb-2">{bird.latin}</div>
      
      {/* סימני זיהוי מהירים */}
      {bird.quick_marks && bird.quick_marks.length > 0 &&
      <div data-ev-id="ev_699de6f4b0" className="flex flex-wrap justify-center gap-2 mb-4">
          {bird.quick_marks.map((mark, idx) =>
        <span data-ev-id="ev_9d6837809d" key={idx} className="inline-block bg-[#e8f4e8] text-[#2c5f2e] text-sm px-3 py-1 rounded-full border border-[#c5e1c5] font-medium">
              {mark}
            </span>
        )}
        </div>
      }

      {/* מידע על גודל, אזור ועונה */}
      <div data-ev-id="ev_region_season_info" className="flex flex-wrap justify-center gap-2 mb-4">
          {/* מוטת כנפיים */}
          {getWingspan(birdKey) &&
        <span data-ev-id="ev_f22827310a" className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200">
              📏 {getWingspan(birdKey)}
            </span>
        }
          {/* סטטוס עונתי */}
          {bird.seasonStatus && bird.seasonStatus.length > 0 &&
        <span data-ev-id="ev_197f72bcbc" className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200">
              📅 {bird.seasonStatus.map((s) => SEASON_STATUS_NAMES[s]).join(' / ')}
              {bird.seasonMonths && <span data-ev-id="ev_ab05d696d2" className="text-blue-500">({bird.seasonMonths})</span>}
            </span>
        }
          {/* אזור */}
          {bird.regions && bird.regions.length > 0 && !bird.regions.includes('all') &&
        <span data-ev-id="ev_a4ace7c0a0" className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full border border-amber-200">
              📍 {bird.regions.map((r) => REGION_NAMES[r]).join(', ')}
            </span>
        }
          {bird.regions && bird.regions.includes('all') &&
        <span data-ev-id="ev_1ab7062e09" className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full border border-amber-200">
              📍 כל הארץ
            </span>
        }
          {/* נפוץ בנדידה */}
          {bird.migrationCommon &&
        <span data-ev-id="ev_c5d091b650" className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full border border-purple-200">
              🦅 נפוץ בנדידה
            </span>
        }
        </div>
      
      <div data-ev-id="ev_f17d4715ba" className="text-base text-gray-600 leading-relaxed bg-[#f6f9f6] border-r-[3px] border-[#2c5f2e] p-3 rounded-md text-right mb-5">
        {(() => {
          // צביעת ביטויים עם "נדיר" באדום במקומם
          const rarePatterns = /(נדיר ביותר|נדירה מאוד|נדירה|נדיר)/g;
          const rareWords = ['נדיר ביותר', 'נדירה מאוד', 'נדירה', 'נדיר'];
          const match = bird.desc.match(rarePatterns);
          if (match) {
            const parts = bird.desc.split(rarePatterns);
            return parts.map((part, idx) =>
            rareWords.includes(part) ?
            <span data-ev-id="ev_3f6afb2cd5" key={idx} className="text-red-600 font-semibold">{part}</span> :
            part
            );
          }
          return bird.desc;
        })()}
      </div>

      <div data-ev-id="ev_5d24a71ffe" className="text-right mb-5">
        <h3 data-ev-id="ev_790783289c" className="text-xs text-gray-400 mb-2.5 tracking-wide">סימנים עיקריים</h3>
        {bird.features.map((f, i) =>
        <div data-ev-id="ev_d8d3ea9bb1" key={i} className="flex items-start gap-2 mb-2 text-base leading-normal">
            <span data-ev-id="ev_aab86f6f23" className="text-[#2c5f2e] font-bold flex-shrink-0">✓</span>
            <span data-ev-id="ev_03cff02291">{f}</span>
          </div>
        )}
      </div>


      
      {/* קישורים חיצוניים */}
      {(bird.link1_url && bird.link1_label || bird.link2_url && bird.link2_label) &&
      <div data-ev-id="ev_external_links" className="flex flex-col items-center gap-1 mb-4 mt-2">
          <span data-ev-id="ev_35881e81cf" className="text-sm text-gray-500 mb-1">קישורים למידע נוסף:</span>
          
          {bird.link1_url && bird.link1_label &&
        <a data-ev-id="ev_6f955e10b2"
        href={bird.link1_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[#2563eb] hover:underline text-sm">
              <ExternalLink className="w-3.5 h-3.5" />
              {bird.link1_label}
            </a>
        }
          
          {bird.link2_url && bird.link2_label &&
        <a data-ev-id="ev_6bc7d0833f"
        href={bird.link2_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[#2563eb] hover:underline text-sm">
              <ExternalLink className="w-3.5 h-3.5" />
              {bird.link2_label}
            </a>
        }
        </div>
      }

      {/* כפתורי ניווט בתחתית */}
      <div data-ev-id="ev_bottom_buttons" className="flex flex-col gap-3 mt-10">
          {/* שורה עליונה - צפייה בצילומים */}
          <button data-ev-id="ev_photos_btn"
        onClick={onNavigateToGallery}
        className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] text-white cursor-pointer text-sm py-3 px-4 rounded-lg hover:bg-[#2563eb] font-medium transition-colors">
            <Camera className="w-4 h-4" />
            צפייה בצילומים
          </button>
          
          {/* שורה תחתונה - חזרה והתחלה מחדש */}
          <div data-ev-id="ev_nav_row" className="flex flex-row gap-3">
            <button data-ev-id="ev_back_btn"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#e8f4e8] border border-[#c5e1c5] text-[#2c5f2e] cursor-pointer text-sm py-3 px-4 rounded-lg hover:bg-[#d4edda] font-medium transition-colors"
          onClick={showBackToList ? onBackToList : onBack}>
                ← חזרה
              </button>
            
            <button data-ev-id="ev_restart_btn"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#2c5f2e] border border-[#2c5f2e] text-white cursor-pointer text-sm py-3 px-4 rounded-lg hover:bg-[#245226] font-medium transition-colors"
          onClick={onRestart}>
              🔄 התחלת זיהוי חדש
            </button>
          </div>
        </div>
    </div>);


}

interface CandidateListProps {
  candidates: string[];
  nextQ: Question | null;
  onSelect: (id: string) => void;
  onAnswer: (qId: string, resp: 'y' | 'n' | '?') => void;
  onBack: () => void;
  onRestart: () => void;
  onShowHint: (hint: string) => void;
  hasHistory: boolean;
  leadPhotos: Record<string, string>;
  birdsData: Record<string, BirdWithOverrides>;
  onPhotoClick: (birdId: string, birdName: string) => void;
  onNavigateToGallery: (birdId: string) => void;
}

function CandidateList({ candidates, nextQ, onSelect, onAnswer, onBack, onRestart, onShowHint, hasHistory, leadPhotos, birdsData, onPhotoClick, onNavigateToGallery }: CandidateListProps) {
  // Detect mobile for conditional behavior
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  // בדיקת דמיון בין המועמדים
  const detailedComparison = getDetailedComparison(candidates);
  const similarityWarning = !detailedComparison ? getSimilarityWarning(candidates, birdsData) : null;
  const knownPairHint = !detailedComparison ? getKnownPairHint(candidates) : null;

  return (
    <div data-ev-id="ev_e7fec6faeb">
      <div data-ev-id="ev_815d4df47a" className="text-base font-bold text-gray-700 mb-1.5">
        🧐 הדורס שלכם הוא כנראה אחד מאלה:
      </div>
      <p data-ev-id="ev_928f4a8c20" className="text-sm text-gray-400 mb-4">הקישו על שם הדורס לסימנים מלאים</p>

      {/* השוואה מפורטת לקבוצות ידועות */}
      {detailedComparison &&
      <div data-ev-id="ev_8b0b1785dc" className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div data-ev-id="ev_80e821ca8e" className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p data-ev-id="ev_750b57547f" className="text-sm font-bold text-amber-800">
              שימו לב! {detailedComparison.birdNames.join(', ')} דומים
            </p>
          </div>
          
          {/* סימנים משותפים */}
          <div data-ev-id="ev_78784a0cca" className="bg-gray-100 rounded-md p-2 mb-3">
            <p data-ev-id="ev_30b4b23230" className="text-xs font-bold text-gray-600 mb-1">🔗 סימנים משותפים (לא יעזרו להבדיל):</p>
            <div data-ev-id="ev_bcf6dabfae" className="flex flex-wrap gap-1">
              {detailedComparison.commonFeatures.map((feature, i) =>
            <span data-ev-id="ev_dd0b50cc21" key={i} className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded">
                  {feature}
                </span>
            )}
            </div>
          </div>
          
          {/* סימנים מבדילים */}
          <div data-ev-id="ev_31e3218a18" className="bg-green-50 rounded-md p-2">
            <p data-ev-id="ev_f820660810" className="text-xs font-bold text-green-700 mb-1">🔍 מה כן מבדיל:</p>
            <div data-ev-id="ev_ac8e203082" className="text-sm text-green-800">
              {detailedComparison.distinguishingFeatures.map((item, i) =>
            <p data-ev-id="ev_d018bf41ce" key={i} className="mb-1">
                  <strong data-ev-id="ev_82581ff92f">{item.name}:</strong> {item.feature}
                </p>
            )}
            </div>
          </div>
        </div>
      }

      {/* אזהרת דמיון רגילה (לקבוצות לא ידועות) */}
      {!detailedComparison && (similarityWarning || knownPairHint) &&
      <div data-ev-id="ev_afc4254d17" className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div data-ev-id="ev_b69a50b312" className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div data-ev-id="ev_1616b10196" className="flex-1">
              <p data-ev-id="ev_2ae24ca554" className="text-sm font-bold text-amber-800 mb-1">
                שימו לב! {similarityWarning ? `${similarityWarning.birdNames.join(' ו')} דומים` : 'דורסים דומים'}
              </p>
              {knownPairHint ?
            <p data-ev-id="ev_47a9380d2b" className="text-sm text-amber-700 whitespace-pre-line">{knownPairHint}</p> :
            similarityWarning?.keyDifferences &&
            <div data-ev-id="ev_d8eaa5c91c" className="text-sm text-amber-700">
                  {similarityWarning.keyDifferences.map((diff, i) =>
              <p data-ev-id="ev_721991b319" key={i} className="mb-1" dangerouslySetInnerHTML={{
                __html: diff.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
              )}
                </div>
            }
            </div>
          </div>
        </div>
      }

      {candidates.map((id) => {
        const bird = birdsData[id];
        const leadPhoto = leadPhotos[id];
        return (
          <div data-ev-id="ev_41fe69cbc7"
          key={id}
          className="border-[1.5px] border-gray-200 rounded-lg p-2.5 sm:p-3.5 mb-2 cursor-pointer transition-all hover:border-[#2c5f2e] hover:bg-[#f8fbf8] flex gap-2.5 sm:gap-3"
          onClick={() => onSelect(id)}>

            {leadPhoto ?
            <img data-ev-id="ev_ba7ebec64e"
            src={leadPhoto}
            alt={bird.name}
            loading="lazy"
            onClick={(e) => {
              e.stopPropagation();
              // On desktop, go directly to gallery; on mobile, open lightbox
              if (isMobile) {
                onPhotoClick(id, bird.name);
              } else {
                onNavigateToGallery(id);
              }
            }}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0 hover:opacity-80 hover:scale-105 transition-all" /> :


            <div data-ev-id="ev_5c9843bac6" className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xl sm:text-2xl">
                🦅
              </div>
            }
            <div data-ev-id="ev_535f320ca4" className="flex-1 min-w-0">
              <span data-ev-id="ev_9c873fc453" className="float-left text-gray-300 text-sm mt-0.5">◂</span>
              <div data-ev-id="ev_b8a7f9217f" className="font-bold text-sm sm:text-base text-[#2c5f2e]">{bird.name}{bird.rare && <span data-ev-id="ev_1da389f8d1" className="inline-block bg-red-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full mr-1.5 align-middle">נדיר</span>}</div>
              <div data-ev-id="ev_ce81b2e59a" className="text-[10px] sm:text-xs text-gray-400 italic">{bird.latin}</div>
              {bird.quick_marks && bird.quick_marks.length > 0 &&
              <div data-ev-id="ev_quick_marks" className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                  {bird.quick_marks.slice(0, 2).map((mark, idx) =>
                <span data-ev-id="ev_fd04632a8d" key={idx} className="inline-block bg-[#e8f4e8] text-[#2c5f2e] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border border-[#c5e1c5]">
                      {mark}
                    </span>
                )}
                </div>
              }
              {bird.diff_desc && !detailedComparison &&
              <div data-ev-id="ev_2f03a1b9df" className="hidden sm:block text-sm text-gray-600 mt-2 leading-relaxed border-r-2 border-[#d4e8d4] pr-2.5">
                    {(() => {
                  const rarePatterns = /(נדיר ביותר|נדירה מאוד|נדירה|נדיר)/g;
                  const rareWords = ['נדיר ביותר', 'נדירה מאוד', 'נדירה', 'נדיר'];

                  const renderWithRareHighlight = (text: string) => {
                    const match = text.match(rarePatterns);
                    if (match) {
                      const parts = text.split(rarePatterns);
                      return parts.map((part, idx) =>
                      rareWords.includes(part) ?
                      <span data-ev-id="ev_6c5883c16d" key={idx} className="text-red-600 font-semibold">{part}</span> :
                      part
                      );
                    }
                    return text;
                  };

                  if (bird.diff_desc.includes('טיפ:')) {
                    return (
                      <>
                            <span data-ev-id="ev_c722014f85">{renderWithRareHighlight(bird.diff_desc.split('טיפ:')[0].trim())}</span>
                            <span data-ev-id="ev_818e50a660" className="block mt-1 italic text-[#b91c1c] font-medium">
                              טיפ: {bird.diff_desc.split('טיפ:')[1].trim()}
                            </span>
                          </>);

                  }

                  return <span data-ev-id="ev_3ab865487f" className="line-clamp-2">{renderWithRareHighlight(bird.diff_desc)}</span>;
                })()}
                  </div>
              }
            </div>
          </div>);

      })}

      {nextQ &&
      <>
          <hr data-ev-id="ev_3ae9f990ca" className="border-none border-t border-gray-100 my-4" />
          <p data-ev-id="ev_6113a40232" className="text-sm text-gray-400 mb-3">רוצים לצמצם עוד?<br data-ev-id="ev_14592bac6f" />ענו על שאלה נוספת:</p>
          
          <div data-ev-id="ev_3514f51e38" className="mb-4">
            <span data-ev-id="ev_1d8df7bda1" className="text-base font-bold leading-relaxed text-gray-900">
              {nextQ.text}
            </span>
            {(nextQ.diagram || nextQ.hint) &&
          <button data-ev-id="ev_cdc088df76"
          className="bg-amber-100 border-2 border-amber-400 rounded-lg px-2 py-0.5 text-xs font-bold cursor-pointer text-amber-700 inline-flex items-center justify-center hover:bg-amber-200 hover:scale-105 transition-all shadow-sm mr-2 align-middle"
          onClick={() => onShowHint(nextQ.diagram || nextQ.hint!)}>
                תרשים עזר
              </button>
          }
            {nextQ.explanation &&
          <p data-ev-id="ev_fb1816cd87" className="text-sm text-gray-500 mt-2">
              {nextQ.explanation}
            </p>
          }
          </div>

          <div data-ev-id="ev_f61b903ad3" className="flex gap-2.5">
            <button data-ev-id="ev_66725c51e8"
          className="flex-1 py-3 px-1.5 text-base border-none rounded-lg cursor-pointer font-bold transition-colors bg-[#2c5f2e] text-white hover:bg-[#245226] active:scale-[0.97]"
          onClick={() => onAnswer(nextQ.id, 'y')}>

              ✓ כן
            </button>
            <button data-ev-id="ev_e8ef43d65f"
          className="flex-1 py-3 px-1.5 text-sm border-none rounded-lg cursor-pointer font-bold transition-colors bg-[#e8d9a8] text-[#4a3a00] hover:bg-[#dccf98] active:scale-[0.97]"
          onClick={() => onAnswer(nextQ.id, '?')}>

              לא ברור
            </button>
            <button data-ev-id="ev_4968c5c819"
          className="flex-1 py-3 px-1.5 text-base border-none rounded-lg cursor-pointer font-bold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-[0.97]"
          onClick={() => onAnswer(nextQ.id, 'n')}>

              ✗ לא
            </button>
          </div>
        </>
      }

      {/* כפתורי ניווט */}
      <div data-ev-id="ev_candidate_buttons" className="flex flex-row gap-3 mt-10">
        {hasHistory &&
        <button data-ev-id="ev_41d288492f"
        className="flex-1 flex items-center justify-center gap-1.5 bg-[#e8f4e8] border border-[#c5e1c5] text-[#2c5f2e] cursor-pointer text-sm py-3 px-4 rounded-lg hover:bg-[#d4edda] font-medium transition-colors"
        onClick={onBack}>
            ← חזרה
          </button>
        }
        <button data-ev-id="ev_restart_candidates"
        className="flex-1 flex items-center justify-center gap-1.5 bg-[#2c5f2e] border border-[#2c5f2e] text-white cursor-pointer text-sm py-3 px-4 rounded-lg hover:bg-[#245226] font-medium transition-colors"
        onClick={onRestart}>
            🔄 התחלת זיהוי חדש
          </button>
      </div>
    </div>);


}