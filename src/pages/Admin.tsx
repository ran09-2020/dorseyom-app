import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { BIRDS, REGION_NAMES, SEASON_STATUS_NAMES, RARITY_NAMES, Region, SeasonStatus, Rarity } from '@/data/birds';
import { QUESTIONS } from '@/data/questions';
import { Upload, Trash2, LogIn, LogOut, Camera, AlertCircle, Check, Loader2, Pencil, X, Star, Bird, Plus, Save, RotateCcw, HelpCircle, AlertTriangle, ChevronDown, ChevronUp, GripVertical, ArrowUpDown, Tags, ExternalLink } from 'lucide-react';
import { TagManagement } from '@/components/admin/TagManagement';
import type { Tables } from '@/integrations/supabase/helpers';
import type { User } from '@supabase/supabase-js';
import { calculateQuestionStats, checkQuestionHealth, type QuestionStats, type QuestionHealth } from '@/hooks/useQuestionsWithOverrides';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Photo = Tables<'photos'>;
type BirdOverride = Tables<'bird_overrides'>;
type QuestionOverride = Tables<'question_overrides'>;

const FAMILIES = [
'נשרים', 'עיטים', 'איות', 'דיות', 'דאות', 'עקבים', 'זרונים', 'ניצים', 'בזים', 'שלך', 'אחר'];


const FAMILY_FOLDERS: Record<string, string> = {
  'נשרים': 'vultures',
  'עיטים': 'eagles',
  'איות': 'snake_eagles',
  'דיות': 'kites',
  'דאות': 'kites_other',
  'עקבים': 'buzzards',
  'זרונים': 'harriers',
  'ניצים': 'accipiters',
  'בזים': 'falcons',
  'שלך': 'osprey',
  'אחר': 'other'
};

// Sortable photo component for drag and drop
interface SortablePhotoProps {
  photo: Photo;
  index: number;
  getBirdName: (id: string) => string;
}

function SortablePhoto({ photo, index, getBirdName }: SortablePhotoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };

  return (
    <div data-ev-id="ev_47de49bac2"
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className={`relative cursor-grab active:cursor-grabbing ${isDragging ? 'ring-2 ring-forest' : ''}`}>

      <div data-ev-id="ev_dc50259469" className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
        {index + 1}
      </div>
      <div data-ev-id="ev_7e82c1e0ca" className="absolute top-2 right-2 z-10 bg-white/90 text-gray-600 p-1 rounded">
        <GripVertical className="w-4 h-4" />
      </div>
      <img data-ev-id="ev_1d2e4494a5"
      src={photo.image_url}
      alt={getBirdName(photo.bird_id)}
      className="w-full aspect-square object-cover rounded-lg"
      loading="lazy"
      draggable={false} />

      <div data-ev-id="ev_8f8ffbe6c7" className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-b-lg">
        <p data-ev-id="ev_caab3e11e7" className="text-white text-xs font-medium truncate">
          {getBirdName(photo.bird_id)}
        </p>
      </div>
    </div>);

}

type AdminTab = 'gallery' | 'birds' | 'questions' | 'tags';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error';text: string;} | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');

  // טופס התחברות
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // טופס העלאה
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [birdId, setBirdId] = useState('');
  const [caption, setCaption] = useState('');
  const [photographer, setPhotographer] = useState('רענן ארבל');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // עריכת צילום
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editBirdId, setEditBirdId] = useState('');
  const [editFamily, setEditFamily] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editPhotographer, setEditPhotographer] = useState('');

  // סידור מחדש של תמונות
  const [isReordering, setIsReordering] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // עריכת דורסים
  const [birdOverrides, setBirdOverrides] = useState<BirdOverride[]>([]);
  const [selectedBirdId, setSelectedBirdId] = useState('');
  const [editBirdName, setEditBirdName] = useState('');
  const [editBirdDesc, setEditBirdDesc] = useState('');
  const [editBirdDiffDesc, setEditBirdDiffDesc] = useState('');
  const [editBirdFeatures, setEditBirdFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [savingBird, setSavingBird] = useState(false);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
  const [editingFeatureText, setEditingFeatureText] = useState('');

  // עריכת סימני זיהוי מהירים
  const [editBirdQuickMarks, setEditBirdQuickMarks] = useState<string[]>([]);
  const [newQuickMark, setNewQuickMark] = useState('');
  const [editingQuickMarkIndex, setEditingQuickMarkIndex] = useState<number | null>(null);
  const [editingQuickMarkText, setEditingQuickMarkText] = useState('');

  // קישורים חיצוניים
  const [editLink1Url, setEditLink1Url] = useState('');
  const [editLink1Label, setEditLink1Label] = useState('');
  const [editLink2Url, setEditLink2Url] = useState('');
  const [editLink2Label, setEditLink2Label] = useState('');

  // אזורים ועונות
  const [editBirdRegions, setEditBirdRegions] = useState<Region[]>([]);
  const [editBirdSeasonStatus, setEditBirdSeasonStatus] = useState<SeasonStatus[]>([]);
  const [editBirdRarity, setEditBirdRarity] = useState<Rarity | ''>('');
  const [editBirdMigrationCommon, setEditBirdMigrationCommon] = useState(false);

  // עריכת שאלות
  const [questionOverrides, setQuestionOverrides] = useState<QuestionOverride[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editQuestionHint, setEditQuestionHint] = useState('');
  const [editQuestionExplanation, setEditQuestionExplanation] = useState('');
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [questionStats, setQuestionStats] = useState<QuestionStats[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Ref for scrolling to content area
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to content area when switching tabs
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  // Scroll expanded question into view
  useEffect(() => {
    if (expandedQuestion) {
      const element = document.getElementById(`question-${expandedQuestion}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [expandedQuestion]);

  useEffect(() => {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchPhotos();
          fetchBirdOverrides();
          fetchQuestionOverrides();
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    // חישוב סטטיסטיקות שאלות
    setQuestionStats(calculateQuestionStats());
  }, []);

  async function checkUser() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      fetchPhotos();
      fetchBirdOverrides();
      fetchQuestionOverrides();
    }
    setLoading(false);
  }

  async function fetchPhotos() {
    if (!supabase) return;

    const { data } = await supabase.
    from('photos').
    select('*').
    order('sort_order', { ascending: true });

    setPhotos(data ?? []);
  }

  async function fetchBirdOverrides() {
    if (!supabase) return;

    const { data } = await supabase.
    from('bird_overrides').
    select('*');

    setBirdOverrides(data ?? []);
  }

  async function fetchQuestionOverrides() {
    if (!supabase) return;

    const { data } = await supabase.
    from('question_overrides').
    select('*');

    setQuestionOverrides(data ?? []);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    setAuthLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage({ type: 'error', text: 'שגיאה בהתחברות: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'התחברת בהצלחה!' });
    }
    setAuthLoading(false);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setPhotos([]);
    setBirdOverrides([]);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !selectedFile || !birdId) return;

    setUploading(true);
    setMessage(null);

    try {
      const birdFamily = BIRDS[birdId]?.family || 'אחר';
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${birdId}.${fileExt}`;
      const folderName = FAMILY_FOLDERS[birdFamily] || 'other';
      const filePath = `${folderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage.
      from('photos').
      upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.
      from('photos').
      getPublicUrl(filePath);

      const { error: dbError } = await supabase.
      from('photos').
      insert({
        bird_id: birdId,
        family: birdFamily,
        image_url: publicUrl,
        caption: caption || null,
        photographer: photographer || 'רענן ארבל'
      });

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'הצילום הועלה בהצלחה!' });
      setSelectedFile(null);
      setBirdId('');
      setCaption('');
      setPhotographer('רענן ארבל');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchPhotos();

    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'שגיאה בהעלאה: ' + (error as Error).message });
    }

    setUploading(false);
  }

  async function handleDelete(photo: Photo) {
    if (!supabase) return;
    if (!confirm(`למחוק את הצילום של ${BIRDS[photo.bird_id]?.name || photo.bird_id}?`)) return;

    try {
      const urlParts = photo.image_url.split('/photos/');
      if (urlParts[1]) {
        await supabase.storage.from('photos').remove([urlParts[1]]);
      }

      const { error } = await supabase.from('photos').delete().eq('id', photo.id);
      if (error) throw error;

      setMessage({ type: 'success', text: 'הצילום נמחק' });
      fetchPhotos();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה במחיקה: ' + (error as Error).message });
    }
  }

  async function handleSetLead(photo: Photo) {
    if (!supabase) return;

    try {
      await supabase.
      from('photos').
      update({ is_lead: false }).
      eq('bird_id', photo.bird_id);

      if (!photo.is_lead) {
        const { error } = await supabase.
        from('photos').
        update({ is_lead: true }).
        eq('id', photo.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'הצילום הוגדר כצילום מוביל' });
      } else {
        setMessage({ type: 'success', text: 'הצילום הוסר מצילום מוביל' });
      }

      fetchPhotos();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בעדכון: ' + (error as Error).message });
    }
  }

  function openEdit(photo: Photo) {
    setEditingPhoto(photo);
    setEditBirdId(photo.bird_id);
    setEditFamily(photo.family);
    setEditCaption(photo.caption || '');
    setEditPhotographer(photo.photographer || 'רענן ארבל');
  }

  function closeEdit() {
    setEditingPhoto(null);
    setEditBirdId('');
    setEditFamily('');
    setEditCaption('');
    setEditPhotographer('');
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !editingPhoto) return;

    try {
      const { error } = await supabase.
      from('photos').
      update({
        bird_id: editBirdId,
        family: editFamily,
        caption: editCaption || null,
        photographer: editPhotographer || 'רענן ארבל'
      }).
      eq('id', editingPhoto.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'הצילום עודכן בהצלחה!' });
      closeEdit();
      fetchPhotos();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בעדכון: ' + (error as Error).message });
    }
  }

  // פונקציות עריכת דורסים
  function selectBirdForEdit(birdKey: string) {
    setSelectedBirdId(birdKey);

    const override = birdOverrides.find((o) => o.bird_id === birdKey);
    const bird = BIRDS[birdKey];

    if (override) {
      setEditBirdName(override.name || bird.name);
      setEditBirdDesc(override.description || '');
      setEditBirdDiffDesc(override.diff_desc || '');
      setEditBirdFeatures(override.features as string[] || bird.features);
      setEditBirdQuickMarks(override.quick_marks as string[] || bird.quick_marks || []);
      setEditLink1Url(override.link1_url || '');
      setEditLink1Label(override.link1_label || '');
      setEditLink2Url(override.link2_url || '');
      setEditLink2Label(override.link2_label || '');
      setEditBirdRegions(override.regions as Region[] || bird.regions || []);
      setEditBirdSeasonStatus(override.season_status as SeasonStatus[] || bird.seasonStatus || []);
      setEditBirdRarity(override.rarity as Rarity || bird.rarity || '');
      setEditBirdMigrationCommon(override.migration_common ?? bird.migrationCommon ?? false);
    } else {
      setEditBirdName(bird.name);
      setEditBirdDesc('');
      setEditBirdDiffDesc('');
      setEditBirdFeatures([...bird.features]);
      setEditBirdQuickMarks([...(bird.quick_marks || [])]);
      setEditLink1Url('');
      setEditLink1Label('');
      setEditLink2Url('');
      setEditLink2Label('');
      setEditBirdRegions([...bird.regions]);
      setEditBirdSeasonStatus([...bird.seasonStatus]);
      setEditBirdRarity(bird.rarity || '');
      setEditBirdMigrationCommon(bird.migrationCommon ?? false);
    }
    setNewFeature('');
    setNewQuickMark('');

    // Scroll to edit form
    setTimeout(() => {
      const editForm = document.getElementById('bird-edit-form');
      if (editForm) {
        editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  function addFeature() {
    if (newFeature.trim()) {
      setEditBirdFeatures([...editBirdFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  }

  function removeFeature(index: number) {
    setEditBirdFeatures(editBirdFeatures.filter((_, i) => i !== index));
  }

  function moveFeature(index: number, direction: 'up' | 'down') {
    const newFeatures = [...editBirdFeatures];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFeatures.length) return;
    [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
    setEditBirdFeatures(newFeatures);
  }

  function startEditFeature(index: number) {
    setEditingFeatureIndex(index);
    setEditingFeatureText(editBirdFeatures[index]);
  }

  function cancelEditFeature() {
    setEditingFeatureIndex(null);
    setEditingFeatureText('');
  }

  function saveEditFeature() {
    if (editingFeatureIndex === null || !editingFeatureText.trim()) return;
    const newFeatures = [...editBirdFeatures];
    newFeatures[editingFeatureIndex] = editingFeatureText.trim();
    setEditBirdFeatures(newFeatures);
    setEditingFeatureIndex(null);
    setEditingFeatureText('');
  }

  // פונקציות עריכת סימני זיהוי מהירים
  function addQuickMark() {
    if (newQuickMark.trim()) {
      setEditBirdQuickMarks([...editBirdQuickMarks, newQuickMark.trim()]);
      setNewQuickMark('');
    }
  }

  function removeQuickMark(index: number) {
    setEditBirdQuickMarks(editBirdQuickMarks.filter((_, i) => i !== index));
  }

  function moveQuickMark(index: number, direction: 'up' | 'down') {
    const newMarks = [...editBirdQuickMarks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newMarks.length) return;
    [newMarks[index], newMarks[newIndex]] = [newMarks[newIndex], newMarks[index]];
    setEditBirdQuickMarks(newMarks);
  }

  function startEditQuickMark(index: number) {
    setEditingQuickMarkIndex(index);
    setEditingQuickMarkText(editBirdQuickMarks[index]);
  }

  function cancelEditQuickMark() {
    setEditingQuickMarkIndex(null);
    setEditingQuickMarkText('');
  }

  function saveEditQuickMark() {
    if (editingQuickMarkIndex === null || !editingQuickMarkText.trim()) return;
    const newMarks = [...editBirdQuickMarks];
    newMarks[editingQuickMarkIndex] = editingQuickMarkText.trim();
    setEditBirdQuickMarks(newMarks);
    setEditingQuickMarkIndex(null);
    setEditingQuickMarkText('');
  }

  async function saveBirdChanges() {
    // בדיקת תנאים מוקדמים עם הודעות שגיאה ברורות
    if (!supabase) {
      setMessage({ type: 'error', text: 'בעיית חיבור לדאטהבייס. נסי לרענן את הדף.' });
      return;
    }
    if (!selectedBirdId) {
      setMessage({ type: 'error', text: 'יש לבחור ציפור לעריכה.' });
      return;
    }
    if (!user) {
      setMessage({ type: 'error', text: 'יש להתחבר מחדש כדי לשמור. נסי לרענן את הדף ולהתחבר שוב.' });
      console.log('Save failed: user is null. Session may have expired.');
      return;
    }

    setSavingBird(true);
    setMessage(null);

    try {
      const existingOverride = birdOverrides.find((o) => o.bird_id === selectedBirdId);

      if (existingOverride) {
        const { error } = await supabase.
        from('bird_overrides').
        update({
          name: editBirdName,
          description: editBirdDesc,
          diff_desc: editBirdDiffDesc || null,
          features: editBirdFeatures,
          quick_marks: editBirdQuickMarks.length > 0 ? editBirdQuickMarks : null,
          link1_url: editLink1Url || null,
          link1_label: editLink1Label || null,
          link2_url: editLink2Url || null,
          link2_label: editLink2Label || null,
          regions: editBirdRegions.length > 0 ? editBirdRegions : null,
          season_status: editBirdSeasonStatus.length > 0 ? editBirdSeasonStatus : null,
          rarity: editBirdRarity || null,
          migration_common: editBirdMigrationCommon,
          updated_by: user.email
        }).
        eq('id', existingOverride.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.
        from('bird_overrides').
        insert({
          bird_id: selectedBirdId,
          name: editBirdName,
          description: editBirdDesc,
          diff_desc: editBirdDiffDesc || null,
          features: editBirdFeatures,
          quick_marks: editBirdQuickMarks.length > 0 ? editBirdQuickMarks : null,
          link1_url: editLink1Url || null,
          link1_label: editLink1Label || null,
          link2_url: editLink2Url || null,
          link2_label: editLink2Label || null,
          regions: editBirdRegions.length > 0 ? editBirdRegions : null,
          season_status: editBirdSeasonStatus.length > 0 ? editBirdSeasonStatus : null,
          rarity: editBirdRarity || null,
          migration_common: editBirdMigrationCommon,
          updated_by: user.email
        });

        if (error) throw error;
      }

      setMessage({ type: 'success', text: `השינויים ל${editBirdName} נשמרו בהצלחה!` });
      fetchBirdOverrides();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בשמירה: ' + (error as Error).message });
    }

    setSavingBird(false);
  }

  function resetBirdToDefault() {
    if (!selectedBirdId) return;
    const bird = BIRDS[selectedBirdId];
    setEditBirdName(bird.name);
    setEditBirdDesc('');
    setEditBirdFeatures([...bird.features]);
    setEditBirdQuickMarks([...(bird.quick_marks || [])]);
    setEditBirdDiffDesc('');
    setEditLink1Url('');
    setEditLink1Label('');
    setEditLink2Url('');
    setEditLink2Label('');
    setEditBirdRegions([...bird.regions]);
    setEditBirdSeasonStatus([...bird.seasonStatus]);
    setEditBirdRarity(bird.rarity || '');
    setEditBirdMigrationCommon(bird.migrationCommon ?? false);
  }

  async function deleteBirdOverride() {
    if (!supabase || !selectedBirdId) return;

    const override = birdOverrides.find((o) => o.bird_id === selectedBirdId);
    if (!override) return;

    if (!confirm('למחוק את השינויים ולחזור לברירת מחדל?')) return;

    try {
      const { error } = await supabase.
      from('bird_overrides').
      delete().
      eq('id', override.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'השינויים נמחקו' });
      resetBirdToDefault();
      fetchBirdOverrides();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה במחיקה: ' + (error as Error).message });
    }
  }

  function getQuestionDisplayText(questionId: string): string {
    const override = questionOverrides.find((o) => o.question_id === questionId);
    const question = QUESTIONS.find((q) => q.id === questionId);
    return override?.text || question?.text || '';
  }

  function getQuestionExplanation(questionId: string): string {
    const override = questionOverrides.find((o) => o.question_id === questionId);
    const question = QUESTIONS.find((q) => q.id === questionId);
    return override?.explanation || question?.explanation || '';
  }

  // פונקציות עריכת שאלות
  function selectQuestionForEdit(questionId: string) {
    setSelectedQuestionId(questionId);

    const override = questionOverrides.find((o) => o.question_id === questionId);
    const question = QUESTIONS.find((q) => q.id === questionId);

    if (!question) return;

    if (override) {
      setEditQuestionText(override.text || question.text);
      setEditQuestionHint(override.hint || question.hint || '');
      setEditQuestionExplanation(override.explanation || question.explanation || '');
    } else {
      setEditQuestionText(question.text);
      setEditQuestionHint(question.hint || '');
      setEditQuestionExplanation(question.explanation || '');
    }
  }

  async function saveQuestionChanges() {
    // בדיקת תנאים מוקדמים עם הודעות שגיאה ברורות
    if (!supabase) {
      setMessage({ type: 'error', text: 'בעיית חיבור לדאטהבייס. נסי לרענן את הדף.' });
      return;
    }
    if (!selectedQuestionId) {
      setMessage({ type: 'error', text: 'יש לבחור שאלה לעריכה.' });
      return;
    }
    if (!user) {
      setMessage({ type: 'error', text: 'יש להתחבר מחדש כדי לשמור. נסי לרענן את הדף ולהתחבר שוב.' });
      console.log('Save failed: user is null. Session may have expired.');
      return;
    }

    setSavingQuestion(true);
    setMessage(null);

    try {
      const existingOverride = questionOverrides.find((o) => o.question_id === selectedQuestionId);

      if (existingOverride) {
        const { error } = await supabase.
        from('question_overrides').
        update({
          text: editQuestionText,
          hint: editQuestionHint || null,
          explanation: editQuestionExplanation || null,
          updated_by: user.email
        }).
        eq('id', existingOverride.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.
        from('question_overrides').
        insert({
          question_id: selectedQuestionId,
          text: editQuestionText,
          hint: editQuestionHint || null,
          explanation: editQuestionExplanation || null,
          updated_by: user.email
        });

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'השאלה עודכנה בהצלחה!' });
      fetchQuestionOverrides();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בשמירה: ' + (error as Error).message });
    }

    setSavingQuestion(false);
  }

  function resetQuestionToDefault() {
    if (!selectedQuestionId) return;
    const question = QUESTIONS.find((q) => q.id === selectedQuestionId);
    if (question) {
      setEditQuestionText(question.text);
      setEditQuestionHint(question.hint || '');
      setEditQuestionExplanation(question.explanation || '');
    }
  }

  async function deleteQuestionOverride() {
    if (!supabase || !selectedQuestionId) return;

    const override = questionOverrides.find((o) => o.question_id === selectedQuestionId);
    if (!override) return;

    if (!confirm('למחוק את השינויים ולחזור לברירת מחדל?')) return;

    try {
      const { error } = await supabase.
      from('question_overrides').
      delete().
      eq('id', override.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'השינויים נמחקו' });
      resetQuestionToDefault();
      fetchQuestionOverrides();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה במחיקה: ' + (error as Error).message });
    }
  }

  const birdOptions = Object.entries(BIRDS).map(([key, bird]) => ({
    value: key,
    label: bird.name,
    family: bird.family
  })).sort((a, b) => a.label.localeCompare(b.label, 'he'));

  const isAdmin = user?.email === 'raanan.arbel@gmail.com';
  const hasOverride = birdOverrides.some((o) => o.bird_id === selectedBirdId);
  const hasQuestionOverride = questionOverrides.some((o) => o.question_id === selectedQuestionId);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Handle drag end for reordering
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => p.id === active.id);
      const newIndex = photos.findIndex((p) => p.id === over.id);

      const newPhotos = arrayMove(photos, oldIndex, newIndex);
      setPhotos(newPhotos);
    }
  }

  // Save the new order to database
  async function savePhotoOrder() {
    if (!supabase) return;

    setSavingOrder(true);
    try {
      const updates = photos.map((photo, index) => ({
        id: photo.id,
        sort_order: index + 1
      }));

      for (const update of updates) {
        await supabase.
        from('photos').
        update({ sort_order: update.sort_order }).
        eq('id', update.id);
      }

      setMessage({ type: 'success', text: 'הסדר נשמר בהצלחה!' });
      setIsReordering(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בשמירה: ' + (error as Error).message });
    }
    setSavingOrder(false);
  }

  // Quick sort functions
  function sortByBird() {
    const sorted = [...photos].sort((a, b) => {
      const nameA = BIRDS[a.bird_id]?.name || a.bird_id;
      const nameB = BIRDS[b.bird_id]?.name || b.bird_id;
      return nameA.localeCompare(nameB, 'he');
    });
    setPhotos(sorted);
  }

  function sortByFamily() {
    const sorted = [...photos].sort((a, b) => {
      const familyCompare = a.family.localeCompare(b.family, 'he');
      if (familyCompare !== 0) return familyCompare;
      const nameA = BIRDS[a.bird_id]?.name || a.bird_id;
      const nameB = BIRDS[b.bird_id]?.name || b.bird_id;
      return nameA.localeCompare(nameB, 'he');
    });
    setPhotos(sorted);
  }

  function sortByDate() {
    const sorted = [...photos].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setPhotos(sorted);
  }

  function cancelReorder() {
    setIsReordering(false);
    fetchPhotos(); // Reset to saved order
  }

  if (loading) {
    return (
      <Layout>
        <div data-ev-id="ev_23552a9bda" className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-forest" />
        </div>
      </Layout>);

  }

  if (!supabase) {
    return (
      <Layout>
        <div data-ev-id="ev_c6d987c6dd" className="max-w-lg mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 data-ev-id="ev_53dcc799d1" className="text-2xl font-bold mb-2">המערכת לא מחוברת</h1>
          <p data-ev-id="ev_da35589741" className="text-muted-foreground">יש להפעיל את Cloud Backend כדי להשתמש באזור הניהול</p>
        </div>
      </Layout>);

  }

  if (!user) {
    return (
      <Layout>
        <div data-ev-id="ev_80b778cda1" className="max-w-md mx-auto px-4 py-16">
          <div data-ev-id="ev_6917b685fa" className="bg-white rounded-2xl shadow-card p-8">
            <div data-ev-id="ev_d44fd8ea8d" className="text-center mb-6">
              <LogIn className="w-12 h-12 mx-auto mb-3 text-forest" />
              <h1 data-ev-id="ev_c856653486" className="text-2xl font-bold">התחברות לניהול</h1>
              <p data-ev-id="ev_3b8b39cd43" className="text-muted-foreground text-sm mt-1">אזור זה מיועד למנהל בלבד</p>
            </div>

            {message &&
            <div data-ev-id="ev_9c5cc49360" className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
            message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`
            }>
                {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                {message.text}
              </div>
            }

            <form data-ev-id="ev_f4d1a1cd8c" onSubmit={handleLogin} className="flex flex-col gap-4">
              <div data-ev-id="ev_037da94166">
                <label data-ev-id="ev_2472e3e490" className="block text-sm font-medium mb-1">אימייל</label>
                <input data-ev-id="ev_eef574848b"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                required />

              </div>
              <div data-ev-id="ev_de7c60663c">
                <label data-ev-id="ev_cd39652f74" className="block text-sm font-medium mb-1">סיסמה</label>
                <input data-ev-id="ev_bf72307a20"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                required />

              </div>
              <button data-ev-id="ev_50b053f365"
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-forest text-white font-medium rounded-lg hover:bg-forest-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">

                {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                התחברות
              </button>
            </form>
          </div>
        </div>
      </Layout>);

  }

  if (!isAdmin) {
    return (
      <Layout>
        <div data-ev-id="ev_f93577479b" className="max-w-lg mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <h1 data-ev-id="ev_a32a89c6d6" className="text-2xl font-bold mb-2">אין הרשאה</h1>
          <p data-ev-id="ev_f420915acc" className="text-muted-foreground mb-6">אזור זה מיועד למנהל בלבד</p>
          <button data-ev-id="ev_96823eb460"
          onClick={handleLogout}
          className="px-6 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors">

            התנתק
          </button>
        </div>
      </Layout>);

  }

  return (
    <Layout>
      <div data-ev-id="ev_b16041f452" className="max-w-5xl mx-auto px-4 py-8">
        {/* כותרת */}
        <div data-ev-id="ev_47ee1568e4" className="flex items-center justify-between mb-6">
          <div data-ev-id="ev_a9e204b2f2">
            <h1 data-ev-id="ev_5d262556a7" className="text-2xl font-bold text-forest">ניהול</h1>
            <p data-ev-id="ev_8eaee7ae9c" className="text-muted-foreground text-sm">מחובר כ: {user.email}</p>
          </div>
          <button data-ev-id="ev_8acf75a83b"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">

            <LogOut className="w-5 h-5" />
            התנתק
          </button>
        </div>

        {/* טאבים */}
        <div data-ev-id="ev_104a31a612" className="flex gap-2 mb-6">
          <button data-ev-id="ev_2db5871192"
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'gallery' ?
          'bg-forest text-white' :
          'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
          }>

            <Camera className="w-5 h-5" />
            ניהול גלריה
          </button>
          <button data-ev-id="ev_58907cb929"
          onClick={() => setActiveTab('birds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'birds' ?
          'bg-forest text-white' :
          'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
          }>

            <Bird className="w-5 h-5" />
            ניהול דורסים
          </button>
          <button data-ev-id="ev_e2f1ef9caa"
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'questions' ?
          'bg-forest text-white' :
          'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
          }>

            <HelpCircle className="w-5 h-5" />
            ניהול שאלות
          </button>
          <button data-ev-id="ev_56185b6d7a"
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'tags' ?
          'bg-forest text-white' :
          'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
          }>

            <Tags className="w-5 h-5" />
            ניהול תיוגים
          </button>
        </div>

        {/* מודל עריכת צילום */}
        {editingPhoto &&
        <div data-ev-id="ev_19847234c0" className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={closeEdit}>
            <div data-ev-id="ev_28776e26f3"
          className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
              <div data-ev-id="ev_17a370d55d" className="flex items-center justify-between mb-4">
                <h3 data-ev-id="ev_96dd3b6e86" className="text-lg font-bold">עריכת צילום</h3>
                <button data-ev-id="ev_74df9fe7d8" onClick={closeEdit} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img data-ev-id="ev_d6e47f42ce"
            src={editingPhoto.image_url}
            alt={BIRDS[editingPhoto.bird_id]?.name || editingPhoto.bird_id}
            className="w-full aspect-video object-cover rounded-lg mb-4" />


              <form data-ev-id="ev_27b41dcc24" onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div data-ev-id="ev_841e5679bc">
                  <label data-ev-id="ev_822ed5a8c4" className="block text-sm font-medium mb-1">מין הדורס</label>
                  <select data-ev-id="ev_9225c327ab"
                value={editBirdId}
                onChange={(e) => {
                  setEditBirdId(e.target.value);
                  const bird = BIRDS[e.target.value];
                  if (bird) setEditFamily(bird.family);
                }}
                className="w-full px-4 py-2 border border-border rounded-lg"
                required>
                    <option data-ev-id="ev_073117cc26" value="">בחר דורס...</option>
                    {birdOptions.map((bird) =>
                  <option data-ev-id="ev_22c8553119" key={bird.value} value={bird.value}>
                        {bird.label}
                      </option>
                  )}
                  </select>
                </div>

                <div data-ev-id="ev_4492386787">
                  <label data-ev-id="ev_9338b137e6" className="block text-sm font-medium mb-1">משפחה</label>
                  <select data-ev-id="ev_50ebd8a233"
                value={editFamily}
                onChange={(e) => setEditFamily(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg"
                required>
                    <option data-ev-id="ev_fc23f87c99" value="">בחר משפחה...</option>
                    {FAMILIES.map((f) =>
                  <option data-ev-id="ev_cec0882613" key={f} value={f}>{f}</option>
                  )}
                  </select>
                </div>

                <div data-ev-id="ev_48a4efef42">
                  <label data-ev-id="ev_ad00f39ecb" className="block text-sm font-medium mb-1">תיאור</label>
                  <input data-ev-id="ev_476a7a9dbf"
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="תיאור הצילום"
                className="w-full px-4 py-2 border border-border rounded-lg" />
                </div>

                <div data-ev-id="ev_1c8a63a8f1">
                  <label data-ev-id="ev_b1e1f4904f" className="block text-sm font-medium mb-1">צלם</label>
                  <input data-ev-id="ev_4152098558"
                type="text"
                value={editPhotographer}
                onChange={(e) => setEditPhotographer(e.target.value)}
                placeholder="שם הצלם"
                className="w-full px-4 py-2 border border-border rounded-lg" />
                </div>

                <div data-ev-id="ev_8762cc742a" className="flex gap-2 mt-2">
                  <button data-ev-id="ev_65e9b34ffb"
                type="submit"
                className="flex-1 py-2 bg-forest text-white font-medium rounded-lg hover:bg-forest-dark transition-colors">
                    שמור שינויים
                  </button>
                  <button data-ev-id="ev_ab392f99f0"
                type="button"
                onClick={closeEdit}
                className="flex-1 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors">
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        }

        {/* תוכן הטאבים */}
        <div data-ev-id="ev_61c972321c" ref={contentRef}>
        {/* תוכן טאב גלריה */}
        {activeTab === 'gallery' &&
          <>
            {/* טופס העלאה */}
            <div data-ev-id="ev_0758b81405" className="bg-white rounded-2xl shadow-card p-6 mb-8">
              <h2 data-ev-id="ev_94c5927ee0" className="text-lg font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                העלאת צילום חדש
              </h2>

              <form data-ev-id="ev_1ff4f37ffe" onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div data-ev-id="ev_c000b259a5" className="md:col-span-2">
                  <label data-ev-id="ev_88d60ae74b" className="block text-sm font-medium mb-1">בחר קובץ</label>
                  <input data-ev-id="ev_ec4a5d00b5"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                  required />

                </div>

                <div data-ev-id="ev_fe52956e20" className="md:col-span-2">
                  <label data-ev-id="ev_d9311db970" className="block text-sm font-medium mb-1">מין הדורס</label>
                  <select data-ev-id="ev_bb5ae2f4e3"
                  value={birdId}
                  onChange={(e) => setBirdId(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                  required>

                    <option data-ev-id="ev_b424a1bf92" value="">בחר דורס...</option>
                    {birdOptions.map((bird) =>
                    <option data-ev-id="ev_86ab6473c4" key={bird.value} value={bird.value}>
                        {bird.label}
                      </option>
                    )}
                  </select>
                </div>

                <div data-ev-id="ev_64edd5e91e" className="md:col-span-2">
                  <label data-ev-id="ev_7a7f471330" className="block text-sm font-medium mb-1">תיאור (אופציונלי)</label>
                  <input data-ev-id="ev_eeca6738c6"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="למשל: זכר בוגר בטיסה, עמק החולה"
                  className="w-full px-4 py-2 border border-border rounded-lg" />

                </div>

                <div data-ev-id="ev_df276c8ee5" className="md:col-span-2">
                  <label data-ev-id="ev_17100c6fb1" className="block text-sm font-medium mb-1">צלם</label>
                  <input data-ev-id="ev_4efac4e822"
                  type="text"
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                  placeholder="רענן ארבל"
                  className="w-full px-4 py-2 border border-border rounded-lg" />

                </div>

                <div data-ev-id="ev_105ef9e7cf" className="md:col-span-2">
                  <button data-ev-id="ev_12c63394cf"
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="w-full py-3 bg-forest text-white font-medium rounded-lg hover:bg-forest-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">

                    {uploading ?
                    <><Loader2 className="w-5 h-5 animate-spin" /> מעלה...</> :

                    <><Upload className="w-5 h-5" /> העלה צילום</>
                    }
                  </button>
                </div>
              </form>
            </div>

            {/* רשימת צילומים */}
            <div data-ev-id="ev_807a9820c4" className="bg-white rounded-2xl shadow-card p-6">
              <div data-ev-id="ev_da10dde635" className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 data-ev-id="ev_80f28d8408" className="text-lg font-bold">צילומים בגלריה ({photos.length})</h2>
                
                {photos.length > 0 &&
                <div data-ev-id="ev_b7ee507018" className="flex flex-wrap gap-2">
                    {isReordering ?
                  <>
                        <button data-ev-id="ev_22bd95358a"
                    onClick={sortByBird}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1">

                          <ArrowUpDown className="w-4 h-4" />
                          לפי דורס
                        </button>
                        <button data-ev-id="ev_fb2b5cc29c"
                    onClick={sortByFamily}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1">

                          <ArrowUpDown className="w-4 h-4" />
                          לפי משפחה
                        </button>
                        <button data-ev-id="ev_b9f665cba3"
                    onClick={sortByDate}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1">

                          <ArrowUpDown className="w-4 h-4" />
                          לפי תאריך
                        </button>
                        <button data-ev-id="ev_87a7f81020"
                    onClick={savePhotoOrder}
                    disabled={savingOrder}
                    className="px-3 py-1.5 text-sm bg-forest text-white hover:bg-forest-dark rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50">

                          {savingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          שמור סדר
                        </button>
                        <button data-ev-id="ev_b25c49b66e"
                    onClick={cancelReorder}
                    className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-1">

                          <X className="w-4 h-4" />
                          ביטול
                        </button>
                      </> :

                  <button data-ev-id="ev_95d1e45fb1"
                  onClick={() => setIsReordering(true)}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-1">

                        <GripVertical className="w-4 h-4" />
                        סדר מחדש
                      </button>
                  }
                  </div>
                }
              </div>

              {isReordering &&
              <div data-ev-id="ev_0dce3babb3" className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  <p data-ev-id="ev_bdad38554f" className="font-medium">מצב סידור מחדש</p>
                  <p data-ev-id="ev_6b1efa3eb3">גרור תמונות לשינוי הסדר, או השתמש בכפתורי המיון המהיר. לחץ "שמור סדר" לסיום.</p>
                </div>
              }

              {photos.length === 0 ?
              <p data-ev-id="ev_a0c88335c4" className="text-muted-foreground text-center py-8">אין צילומים עדיין</p> :

              isReordering ?
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>

                <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
                  <div data-ev-id="ev_1703ca4dd9" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) =>
                    <SortablePhoto
                      key={photo.id}
                      photo={photo}
                      index={index}
                      getBirdName={(id) => BIRDS[id]?.name || id} />

                    )}
                  </div>
                </SortableContext>
              </DndContext> :

              <div data-ev-id="ev_7ec1b1f318" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((photo) =>
                <div data-ev-id="ev_bc8e639907" key={photo.id} className="relative group">
                      {photo.is_lead &&
                  <div data-ev-id="ev_9459308490" className="absolute top-2 right-2 z-10 bg-yellow-400 text-yellow-900 rounded-full p-1">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                  }

                      <img data-ev-id="ev_b9893cf15d"
                  src={photo.image_url}
                  alt={BIRDS[photo.bird_id]?.name || photo.bird_id}
                  className="w-full aspect-square object-cover rounded-lg"
                  loading="lazy" />


                      <div data-ev-id="ev_02df70db77" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                        <p data-ev-id="ev_9984fea5fd" className="text-white text-sm font-medium text-center mb-2">
                          {BIRDS[photo.bird_id]?.name || photo.bird_id}
                        </p>
                        <div data-ev-id="ev_3da8835b3a" className="flex gap-2 flex-wrap justify-center">
                          <button data-ev-id="ev_b0c01bcad8"
                      onClick={() => handleSetLead(photo)}
                      className={`p-2 rounded-lg transition-colors ${
                      photo.is_lead ?
                      'bg-yellow-400 text-yellow-900 hover:bg-yellow-500' :
                      'bg-yellow-500 text-white hover:bg-yellow-600'}`
                      }
                      title={photo.is_lead ? 'הסר מצילום מוביל' : 'הגדר כצילום מוביל'}>

                            <Star className={`w-4 h-4 ${photo.is_lead ? 'fill-current' : ''}`} />
                          </button>
                          <button data-ev-id="ev_73ba8c59d1"
                      onClick={() => openEdit(photo)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="ערוך">

                            <Pencil className="w-4 h-4" />
                          </button>
                          <button data-ev-id="ev_369b69acaf"
                      onClick={() => handleDelete(photo)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="מחק">

                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                )}
                </div>
              }
            </div>
          </>
          }

        {/* תוכן טאב דורסים */}
        {activeTab === 'birds' &&
          <div data-ev-id="ev_7ee5709412" className="flex flex-col gap-6">
            {/* רשימת דורסים - כפתורים לרוחב */}
            <div data-ev-id="ev_509fed2813" className="bg-white rounded-2xl shadow-card p-6">
              <h2 data-ev-id="ev_0403f3cc30" className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bird className="w-5 h-5" />
                בחר דורס לעריכה
              </h2>
              <div data-ev-id="ev_269f0682a8" className="flex flex-wrap gap-2">
                {birdOptions.map((bird) => {
                  const hasChange = birdOverrides.some((o) => o.bird_id === bird.value);
                  return (
                    <button data-ev-id="ev_bd6a5ea3f5"
                    key={bird.value}
                    onClick={() => selectBirdForEdit(bird.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedBirdId === bird.value ?
                    'bg-forest text-white' :
                    hasChange ?
                    'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                    'bg-gray-100 hover:bg-gray-200'}`
                    }>

                    {bird.label}
                  </button>);

                })}
              </div>
            </div>

            {/* עורך דורס */}
            <div id="bird-edit-form" data-ev-id="ev_330655dcd0" className="bg-white rounded-2xl shadow-card p-6">
              {!selectedBirdId ?
              <div data-ev-id="ev_d543040429" className="text-center py-12 text-muted-foreground">
                  <Bird className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p data-ev-id="ev_00b1946605">בחר דורס מהרשימה לעריכה</p>
                </div> :

              <>
                  <h2 data-ev-id="ev_d2155b5a29" className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Pencil className="w-5 h-5" />
                    עריכת {BIRDS[selectedBirdId].name}
                  </h2>

                  {/* שם הדורס */}
                  <div data-ev-id="ev_5efb65de9f" className="mb-4">
                    <label data-ev-id="ev_bca218ed64" className="block text-sm font-medium mb-2">שם הדורס</label>
                    <input data-ev-id="ev_e161cb6810"
                  type="text"
                  value={editBirdName}
                  onChange={(e) => setEditBirdName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg text-lg" />

                  </div>

                  {/* תיאור */}
                  <div data-ev-id="ev_d440939287" className="mb-6">
                    <label data-ev-id="ev_60b1edb4cb" className="block text-sm font-medium mb-2">תיאור</label>
                    <textarea data-ev-id="ev_b5441fc535"
                  value={editBirdDesc || BIRDS[selectedBirdId].desc}
                  onChange={(e) => setEditBirdDesc(e.target.value)}
                  rows={3}
                  placeholder={BIRDS[selectedBirdId].desc}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm resize-none" />

                    <p data-ev-id="ev_25351cb2a2" className="text-xs text-gray-400 mt-1">השאר ריק לשימוש בתיאור המקורי</p>
                  </div>

                  {/* תיאור הבדלה */}
                  <div data-ev-id="ev_76947af1b8" className="mb-6">
                    <label data-ev-id="ev_57470ae331" className="block text-sm font-medium mb-2">תיאור הבדלה (מופיע בכרטיס התוצאה)</label>
                    <textarea data-ev-id="ev_02c54fbafe"
                  value={editBirdDiffDesc || BIRDS[selectedBirdId].diff_desc}
                  onChange={(e) => setEditBirdDiffDesc(e.target.value)}
                  rows={3}
                  placeholder={BIRDS[selectedBirdId].diff_desc}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm resize-none" />
                    <p data-ev-id="ev_0f0ce3271a" className="text-xs text-gray-400 mt-1">השאר ריק לשימוש בתיאור המקורי</p>
                  </div>

                  {/* קריטריונים */}
                  <div data-ev-id="ev_56732af3b4" className="mb-6">
                    <label data-ev-id="ev_2523e19130" className="block text-sm font-medium mb-2">קריטריונים לזיהוי</label>
                    <div data-ev-id="ev_f7939fb7fc" className="flex flex-col gap-2 mb-3">
                      {editBirdFeatures.map((feature, index) =>
                    <div data-ev-id="ev_85a5ba6288" key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          {editingFeatureIndex === index ?
                      <>
                              <input data-ev-id="ev_a585fe441a"
                        type="text"
                        value={editingFeatureText}
                        onChange={(e) => setEditingFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEditFeature();
                          } else if (e.key === 'Escape') {
                            cancelEditFeature();
                          }
                        }}
                        className="flex-1 px-2 py-1 border border-forest rounded text-sm"
                        autoFocus />

                              <button data-ev-id="ev_653e831bda"
                        type="button"
                        onClick={saveEditFeature}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="שמור">

                                <Check className="w-4 h-4" />
                              </button>
                              <button data-ev-id="ev_2330ec031c"
                        type="button"
                        onClick={cancelEditFeature}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="בטל">

                                <X className="w-4 h-4" />
                              </button>
                            </> :

                      <>
                              <span data-ev-id="ev_1a0d9df233" className="flex-1 text-sm cursor-pointer hover:text-forest"
                        onClick={() => startEditFeature(index)}
                        title="לחץ לעריכה">

                                {feature}
                              </span>
                              <div data-ev-id="ev_414e0c1e2d" className="flex gap-1">
                                <button data-ev-id="ev_5a74547caf" type="button"
                          onClick={() => startEditFeature(index)}
                          className="p-1 text-blue-400 hover:text-blue-600"
                          title="ערוך">

                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button data-ev-id="ev_0d9abfe32b" type="button"
                          onClick={() => moveFeature(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="הזז למעלה">

                                  ↑
                                </button>
                                <button data-ev-id="ev_393d48f198" type="button"
                          onClick={() => moveFeature(index, 'down')}
                          disabled={index === editBirdFeatures.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="הזז למטה">

                                  ↓
                                </button>
                                <button data-ev-id="ev_720905d07b" type="button"
                          onClick={() => removeFeature(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="מחק">

                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                      }
                        </div>
                    )}
                    </div>

                    {/* הוספת קריטריון */}
                    <div data-ev-id="ev_3f71b3cfd4" className="flex gap-2">
                      <input data-ev-id="ev_0184556f14"
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="הוסף קריטריון חדש..."
                    className="flex-1 px-4 py-2 border border-border rounded-lg" />

                      <button data-ev-id="ev_69f808b4e7"
                    type="button"
                    onClick={addFeature}
                    disabled={!newFeature.trim()}
                    className="px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark disabled:opacity-50 flex items-center gap-1">

                        <Plus className="w-4 h-4" />
                        הוסף
                      </button>
                    </div>
                  </div>

                  {/* סימני זיהוי מהירים */}
                  <div data-ev-id="ev_quick_marks_section" className="mb-6">
                    <label data-ev-id="ev_quick_marks_label" className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Tags className="w-4 h-4" />
                      סימני זיהוי מהירים (תגיות ירוקות)
                    </label>
                    <p data-ev-id="ev_1eac369408" className="text-xs text-muted-foreground mb-3">סימנים קצרים שמופיעים בכרטיס הציפור כתגיות ירוקות</p>
                    <div data-ev-id="ev_quick_marks_list" className="flex flex-col gap-2 mb-3">
                      {editBirdQuickMarks.map((mark, index) =>
                    <div data-ev-id="ev_quick_mark_item" key={index} className="flex items-center gap-2 bg-green-50 rounded-lg p-2 border border-green-200">
                          {editingQuickMarkIndex === index ?
                      <>
                              <input data-ev-id="ev_quick_mark_edit_input"
                        type="text"
                        value={editingQuickMarkText}
                        onChange={(e) => setEditingQuickMarkText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEditQuickMark();
                          } else if (e.key === 'Escape') {
                            cancelEditQuickMark();
                          }
                        }}
                        className="flex-1 px-2 py-1 border border-green-400 rounded text-sm"
                        autoFocus />
                              <button data-ev-id="ev_quick_mark_save_btn"
                        type="button"
                        onClick={saveEditQuickMark}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="שמור">
                                <Check className="w-4 h-4" />
                              </button>
                              <button data-ev-id="ev_quick_mark_cancel_btn"
                        type="button"
                        onClick={cancelEditQuickMark}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="בטל">
                                <X className="w-4 h-4" />
                              </button>
                            </> :
                      <>
                              <span data-ev-id="ev_quick_mark_text" className="flex-1 text-sm text-green-800 cursor-pointer hover:text-green-600"
                        onClick={() => startEditQuickMark(index)}
                        title="לחץ לעריכה">
                                {mark}
                              </span>
                              <div data-ev-id="ev_quick_mark_actions" className="flex gap-1">
                                <button data-ev-id="ev_quick_mark_edit" type="button"
                          onClick={() => startEditQuickMark(index)}
                          className="p-1 text-green-400 hover:text-green-600"
                          title="ערוך">
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button data-ev-id="ev_quick_mark_up" type="button"
                          onClick={() => moveQuickMark(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="הזז למעלה">
                                  ↑
                                </button>
                                <button data-ev-id="ev_quick_mark_down" type="button"
                          onClick={() => moveQuickMark(index, 'down')}
                          disabled={index === editBirdQuickMarks.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="הזז למטה">
                                  ↓
                                </button>
                                <button data-ev-id="ev_quick_mark_delete" type="button"
                          onClick={() => removeQuickMark(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="מחק">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                      }
                        </div>
                    )}
                    </div>

                    {/* הוספת סימן זיהוי מהיר */}
                    <div data-ev-id="ev_add_quick_mark" className="flex gap-2">
                      <input data-ev-id="ev_new_quick_mark_input"
                    type="text"
                    value={newQuickMark}
                    onChange={(e) => setNewQuickMark(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addQuickMark();
                      }
                    }}
                    placeholder="הוסף סימן זיהוי מהיר..."
                    className="flex-1 px-4 py-2 border border-border rounded-lg" />
                      <button data-ev-id="ev_add_quick_mark_btn"
                    type="button"
                    onClick={addQuickMark}
                    disabled={!newQuickMark.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        הוסף
                      </button>
                    </div>
                  </div>

                  {/* אזורים */}
                  <div data-ev-id="ev_regions_section" className="mb-6">
                    <label data-ev-id="ev_regions_label" className="block text-sm font-medium mb-2">
                      אזורים בהם נצפה הדורס
                    </label>
                    <p data-ev-id="ev_regions_hint" className="text-xs text-muted-foreground mb-3">בחרו את האזורים הרלוונטיים</p>
                    <div data-ev-id="ev_regions_grid" className="flex flex-wrap gap-2">
                      {(Object.entries(REGION_NAMES) as [Region, string][]).map(([key, label]) =>
                    <button data-ev-id="ev_29d1cc399e"
                    key={key}
                    type="button"
                    onClick={() => {
                      if (editBirdRegions.includes(key)) {
                        setEditBirdRegions(editBirdRegions.filter((r) => r !== key));
                      } else {
                        setEditBirdRegions([...editBirdRegions, key]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    editBirdRegions.includes(key) ?
                    'bg-forest text-white' :
                    'bg-gray-100 hover:bg-gray-200'}`
                    }>

                          {label}
                        </button>
                    )}
                    </div>
                  </div>

                  {/* סטטוס עונתי */}
                  <div data-ev-id="ev_season_section" className="mb-6">
                    <label data-ev-id="ev_season_label" className="block text-sm font-medium mb-2">
                      סטטוס עונתי
                    </label>
                    <p data-ev-id="ev_season_hint" className="text-xs text-muted-foreground mb-3">בחרו את כל הסטטוסים הרלוונטיים</p>
                    <div data-ev-id="ev_season_grid" className="flex flex-wrap gap-2">
                      {(Object.entries(SEASON_STATUS_NAMES) as [SeasonStatus, string][]).map(([key, label]) =>
                    <button data-ev-id="ev_b4e6c49838"
                    key={key}
                    type="button"
                    onClick={() => {
                      if (editBirdSeasonStatus.includes(key)) {
                        setEditBirdSeasonStatus(editBirdSeasonStatus.filter((s) => s !== key));
                      } else {
                        setEditBirdSeasonStatus([...editBirdSeasonStatus, key]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    editBirdSeasonStatus.includes(key) ?
                    'bg-blue-600 text-white' :
                    'bg-gray-100 hover:bg-gray-200'}`
                    }>

                          {label}
                        </button>
                    )}
                    </div>
                  </div>

                  {/* נדירות */}
                  <div data-ev-id="ev_rarity_section" className="mb-6">
                    <label data-ev-id="ev_rarity_label" className="block text-sm font-medium mb-2">
                      רמת שכיחות
                    </label>
                    <div data-ev-id="ev_rarity_grid" className="flex flex-wrap gap-2">
                      {(Object.entries(RARITY_NAMES) as [Rarity, string][]).map(([key, label]) =>
                    <button data-ev-id="ev_cecf422651"
                    key={key}
                    type="button"
                    onClick={() => setEditBirdRarity(editBirdRarity === key ? '' : key)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    editBirdRarity === key ?
                    'bg-orange-500 text-white' :
                    'bg-gray-100 hover:bg-gray-200'}`
                    }>

                          {label}
                        </button>
                    )}
                    </div>
                  </div>

                  {/* נפוץ בנדידה */}
                  <div data-ev-id="ev_migration_section" className="mb-6">
                    <label data-ev-id="ev_migration_label" className="flex items-center gap-3 cursor-pointer">
                      <input data-ev-id="ev_c314f52034"
                    type="checkbox"
                    checked={editBirdMigrationCommon}
                    onChange={(e) => setEditBirdMigrationCommon(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-forest focus:ring-forest" />

                      <span data-ev-id="ev_2232dd1b53" className="text-sm font-medium">נפוץ בנדידה</span>
                    </label>
                    <p data-ev-id="ev_migration_hint" className="text-xs text-muted-foreground mt-1 mr-8">
                      אם מסומן, הדורס יוצג בכל האזורים בעונת המעבר (אביב וסתיו)
                    </p>
                  </div>

                  {/* קישורים חיצוניים */}
                  <div data-ev-id="ev_links_section" className="mb-6">
                    <label data-ev-id="ev_links_label" className="block text-sm font-medium mb-3 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      קישורים חיצוניים (אופציונלי)
                    </label>
                    
                    {/* קישור 1 */}
                    <div data-ev-id="ev_link1_container" className="flex gap-2 mb-3">
                      <input data-ev-id="ev_link1_label"
                    type="text"
                    value={editLink1Label}
                    onChange={(e) => setEditLink1Label(e.target.value)}
                    placeholder="שם לתצוגה (למשל: ויקיפדיה)"
                    className="w-1/3 px-3 py-2 border border-border rounded-lg text-sm" />
                      <input data-ev-id="ev_link1_url"
                    type="url"
                    value={editLink1Url}
                    onChange={(e) => setEditLink1Url(e.target.value)}
                    placeholder="כתובת URL"
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm" dir="ltr" />
                    </div>
                    
                    {/* קישור 2 */}
                    <div data-ev-id="ev_link2_container" className="flex gap-2">
                      <input data-ev-id="ev_link2_label"
                    type="text"
                    value={editLink2Label}
                    onChange={(e) => setEditLink2Label(e.target.value)}
                    placeholder="שם לתצוגה (למשל: xeno-canto)"
                    className="w-1/3 px-3 py-2 border border-border rounded-lg text-sm" />
                      <input data-ev-id="ev_link2_url"
                    type="url"
                    value={editLink2Url}
                    onChange={(e) => setEditLink2Url(e.target.value)}
                    placeholder="כתובת URL"
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm" dir="ltr" />
                    </div>
                  </div>

                  {/* כפתורי פעולה */}
                  <div data-ev-id="ev_399c30fa69" className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    <button data-ev-id="ev_a9179c821b" type="button"
                  onClick={saveBirdChanges}
                  disabled={savingBird}
                  className="flex-1 py-3 bg-forest text-white font-medium rounded-lg hover:bg-forest-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">

                      {savingBird ?
                    <Loader2 className="w-5 h-5 animate-spin" /> :

                    <Save className="w-5 h-5" />
                    }
                      שמור שינויים
                    </button>
                    <button data-ev-id="ev_e49d700e61" type="button"
                  onClick={resetBirdToDefault}
                  className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">

                      <RotateCcw className="w-5 h-5" />
                      אפס לברירת מחדל
                    </button>
                    {hasOverride &&
                  <button data-ev-id="ev_ff86ab5644" type="button"
                  onClick={deleteBirdOverride}
                  className="px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">

                        <Trash2 className="w-5 h-5" />
                        מחק שינויים
                      </button>
                  }
                  </div>

                  {/* השוואה לברירת מחדל */}
                  <div data-ev-id="ev_276d42052c" className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 data-ev-id="ev_9742b85cfa" className="text-sm font-medium mb-2 text-gray-600">ברירת מחדל (להשוואה):</h4>
                    <p data-ev-id="ev_3628d855ee" className="text-sm text-gray-500">
                      <strong data-ev-id="ev_b6fb46c412" className="text-gray-600">שם:</strong> {BIRDS[selectedBirdId].name}
                    </p>
                    <p data-ev-id="ev_8335edf985" className="text-sm text-gray-500 mt-1">
                      <strong data-ev-id="ev_d28412a3c8" className="text-gray-600">קריטריונים:</strong> {BIRDS[selectedBirdId].features.join(' | ')}
                    </p>
                  </div>
                </>
              }
            </div>
          </div>
          }

        {/* תוכן טאב שאלות */}
        {activeTab === 'questions' &&
          <div data-ev-id="ev_19c45b34e6" className="flex flex-col gap-6">
            {/* רשימת שאלות */}
            <div data-ev-id="ev_822a111a64" className="bg-white rounded-2xl shadow-card p-6">
              <h2 data-ev-id="ev_a48e2e7e2f" className="text-lg font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                שאלות הזיהוי ({QUESTIONS.length})
              </h2>
              
              <div data-ev-id="ev_25340c0752" className="flex flex-col gap-2">
                {QUESTIONS.map((question) => {
                  const stats = questionStats.find((s) => s.questionId === question.id);
                  const health = stats ? checkQuestionHealth(stats) : { isHealthy: true, warnings: [] };
                  const hasChange = questionOverrides.some((o) => o.question_id === question.id);
                  const isExpanded = expandedQuestion === question.id;

                  return (
                    <div data-ev-id="ev_514bb86ced" key={question.id} id={`question-${question.id}`} className="border border-border rounded-lg overflow-hidden">
                      {/* שורת השאלה */}
                      <div data-ev-id="ev_9d230f24d5"
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                      selectedQuestionId === question.id ? 'bg-forest/10' :
                      !health.isHealthy ? 'bg-orange-50' :
                      hasChange ? 'bg-blue-50' : 'hover:bg-gray-50'}`
                      }
                      onClick={() => selectQuestionForEdit(question.id)}>

                        {/* אייקון אזהרה */}
                        {!health.isHealthy &&
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        }
                        
                        {/* טקסט השאלה */}
                        <div data-ev-id="ev_d6eef84338" className="flex-1 min-w-0">
                          <p data-ev-id="ev_45318db1a4" className={`text-sm ${hasChange ? 'text-blue-700' : ''}`}>
                            {getQuestionDisplayText(question.id)}
                          </p>
                          {getQuestionExplanation(question.id) &&
                          <p data-ev-id="ev_b8ca11973d" className="text-xs text-gray-500 mt-0.5">
                            {getQuestionExplanation(question.id)}
                          </p>
                          }
                          {hasChange &&
                          <span data-ev-id="ev_f73bc3bd74" className="text-xs text-blue-500">שונה מברירת מחדל</span>
                          }
                        </div>
                        
                        {/* סטטיסטיקות */}
                        {stats &&
                        <div data-ev-id="ev_9f9eea2591" className="flex items-center gap-2 text-xs flex-shrink-0">
                            <span data-ev-id="ev_d6ee41c958" className="px-2 py-1 bg-green-100 text-green-700 rounded">
                              כן: {stats.yesCount}
                            </span>
                            <span data-ev-id="ev_9f1851f247" className="px-2 py-1 bg-red-100 text-red-700 rounded">
                              לא: {stats.noCount}
                            </span>
                          </div>
                        }
                        
                        {/* כפתור הרחבה */}
                        <button data-ev-id="ev_75f8884af3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedQuestion(isExpanded ? null : question.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded">

                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* פרטים מורחבים */}
                      {isExpanded && stats &&
                      <div data-ev-id="ev_515f4c3032" className="border-t border-border p-3 bg-gray-50 text-sm">
                          {/* אזהרות */}
                          {health.warnings.length > 0 &&
                        <div data-ev-id="ev_c1fd81a891" className="mb-3 p-2 bg-orange-100 rounded-lg">
                              <p data-ev-id="ev_e2831d3c37" className="font-medium text-orange-800 mb-1">אזהרות:</p>
                              <ul data-ev-id="ev_35e7d31a4f" className="text-orange-700 text-xs list-disc list-inside">
                                {health.warnings.map((w, i) => <li data-ev-id="ev_edbd1cbae7" key={i}>{w}</li>)}
                              </ul>
                            </div>
                        }
                          
                          {/* דורסים שעונים כן */}
                          <div data-ev-id="ev_6b5d656bfe" className="mb-2">
                            <span data-ev-id="ev_1656fc2b1d" className="font-medium text-green-700">עונים כן ({stats.yesCount}): </span>
                            <span data-ev-id="ev_5aad5778cb" className="text-gray-600">
                              {stats.yesBirds.map((id) => BIRDS[id]?.name).filter(Boolean).join(', ') || 'אין'}
                            </span>
                          </div>
                          
                          {/* דורסים שעונים לא */}
                          <div data-ev-id="ev_95d5f3ab9b">
                            <span data-ev-id="ev_cb424dad28" className="font-medium text-red-700">עונים לא ({stats.noCount}): </span>
                            <span data-ev-id="ev_81fbf926a0" className="text-gray-600">
                              {stats.noBirds.map((id) => BIRDS[id]?.name).filter(Boolean).join(', ') || 'אין'}
                            </span>
                          </div>
                        </div>
                      }
                    </div>);

                })}
              </div>
            </div>

            {/* עורך שאלה */}
            <div data-ev-id="ev_546a2fb63c" className="bg-white rounded-2xl shadow-card p-6">
              {!selectedQuestionId ?
              <div data-ev-id="ev_7f4dce9091" className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p data-ev-id="ev_4661eef8d5">בחר שאלה מהרשימה לעריכה</p>
                </div> :

              <>
                  <h2 data-ev-id="ev_7a7c6e9daf" className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Pencil className="w-5 h-5" />
                    עריכת שאלה
                  </h2>

                  {/* טקסט השאלה */}
                  <div data-ev-id="ev_56744a250f" className="mb-4">
                    <label data-ev-id="ev_9d30614d3a" className="block text-sm font-medium mb-2">ניסוח השאלה</label>
                    <textarea data-ev-id="ev_eccf11d0bb"
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg resize-none" />

                  </div>

                  {/* הסבר */}
                  <div data-ev-id="ev_explanation_field" className="mb-4">
                    <label data-ev-id="ev_6e6e27ec3a" className="block text-sm font-medium mb-2">הסבר (מופיע מתחת לשאלה)</label>
                    <input data-ev-id="ev_025ca80035"
                  type="text"
                  value={editQuestionExplanation}
                  onChange={(e) => setEditQuestionExplanation(e.target.value)}
                  placeholder="למה השאלה חשובה ולאן היא חותרת"
                  className="w-full px-4 py-2 border border-border rounded-lg" />
                  </div>

                  {/* רמז */}
                  <div data-ev-id="ev_1dca12cd31" className="mb-6">
                    <label data-ev-id="ev_9dee6d4ea3" className="block text-sm font-medium mb-2">רמז (אופציונלי)</label>
                    <input data-ev-id="ev_a5e47f2ec4"
                  type="text"
                  value={editQuestionHint}
                  onChange={(e) => setEditQuestionHint(e.target.value)}
                  placeholder="מזהה רמז (למשל: wing_posture)"
                  className="w-full px-4 py-2 border border-border rounded-lg" />

                  </div>

                  {/* כפתורי פעולה */}
                  <div data-ev-id="ev_bf5a7338ce" className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    <button data-ev-id="ev_091b381ebc" type="button"
                  onClick={saveQuestionChanges}
                  disabled={savingQuestion}
                  className="flex-1 py-3 bg-forest text-white font-medium rounded-lg hover:bg-forest-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {savingQuestion ?
                    <Loader2 className="w-5 h-5 animate-spin" /> :
                    <Save className="w-5 h-5" />
                    }
                      שמור שינויים
                    </button>
                    <button data-ev-id="ev_a54fa0a3ee" type="button"
                  onClick={resetQuestionToDefault}
                  className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      אפס לברירת מחדל
                    </button>
                    {hasQuestionOverride &&
                  <button data-ev-id="ev_8fb994511e" type="button"
                  onClick={deleteQuestionOverride}
                  className="px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        מחק שינויים
                      </button>
                  }
                  </div>

                  {/* השוואה לברירת מחדל */}
                  <div data-ev-id="ev_dd7b3689c1" className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 data-ev-id="ev_b2107c8dd7" className="text-sm font-medium mb-2 text-gray-600">ברירת מחדל (להשוואה):</h4>
                    <p data-ev-id="ev_0d13a27bde" className="text-sm text-gray-500">
                      {QUESTIONS.find((q) => q.id === selectedQuestionId)?.text}
                    </p>
                  </div>
                </>
              }
            </div>
          </div>
          }

        {/* ניהול תיוגים */}
        {activeTab === 'tags' &&
          <TagManagement />
          }
        </div>
      </div>
    </Layout>);

}