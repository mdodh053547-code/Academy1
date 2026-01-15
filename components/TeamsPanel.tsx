
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  X, 
  Save, 
  User, 
  Settings2,
  CheckCircle2,
  Trash2,
  Zap,
  UserPlus,
  ArrowLeftRight,
  ArrowRightCircle,
  Check,
  RefreshCw,
  Search,
  Edit3,
  UserMinus,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { TEAMS, AGE_GROUPS, MOCK_COACHES } from '../constants';
import { subscribeToPlayers, updatePlayerTeam, deletePlayer } from '../services/playerService';

interface TeamData {
  id?: string;
  name: string;
  ageGroup: string;
  coachId: string;
  trainingDays: string[];
  field: string;
}

interface TrainingSession {
  id: string;
  day: string;
  time: string;
  team: string;
  field: string;
  type: string;
}

interface TeamsPanelProps {
  restrictedTeam?: string;
}

const TeamsPanel: React.FC<TeamsPanelProps> = ({ restrictedTeam }) => {
  const [activeView, setActiveView] = useState<'list' | 'schedule'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'info' | 'roster'>('info');
  const [editingTeam, setEditingTeam] = useState<TeamData | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [teamPlayers, setTeamPlayers] = useState<any[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  
  // حالات الإدارة
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [transferringPlayer, setTransferringPlayer] = useState<any | null>(null);
  const [coordinatingPlayer, setCoordinatingPlayer] = useState<any | null>(null);

  const [formData, setFormData] = useState<TeamData>({
    name: '',
    ageGroup: AGE_GROUPS[0],
    coachId: MOCK_COACHES[0].id,
    trainingDays: [],
    field: 'ملعب (أ)'
  });

  const [sessions, setSessions] = useState<TrainingSession[]>([
    { id: 's1', day: 'السبت', time: '05:00 م', team: 'فريق الصقور', field: 'ملعب (أ)', type: 'تدريب مهارات' },
    { id: 's2', day: 'الأحد', time: '06:30 م', team: 'فريق النمور', field: 'ملعب (ب)', type: 'لياقة بدنية' },
    { id: 's3', day: 'الاثنين', time: '05:00 م', team: 'فريق الأبطال', field: 'ملعب (أ)', type: 'تكتيك ومناورة' },
    { id: 's4', day: 'الثلاثاء', time: '04:30 م', team: 'فريق المستقبل', field: 'الصالة المغلقة', type: 'أساسيات' },
    { id: 's5', day: 'الاربعاء', time: '08:00 م', team: 'فريق النجوم', field: 'ملعب (أ)', type: 'تقسيمة ودية' },
  ]);

  useEffect(() => {
    const unsubscribe = subscribeToPlayers((data) => {
      setAllPlayers(data);
      if (editingTeam) {
        const filtered = data.filter(p => p.team === editingTeam.name);
        setTeamPlayers(filtered);
      }
    });
    return () => unsubscribe();
  }, [editingTeam]);

  const daysOfWeek = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  const handleOpenAddModal = () => {
    setEditingTeam(null);
    setModalTab('info');
    setFormData({
      name: '',
      ageGroup: AGE_GROUPS[0],
      coachId: MOCK_COACHES[0].id,
      trainingDays: [],
      field: 'ملعب (أ)'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teamName: string) => {
    const teamInfo = {
      name: teamName,
      ageGroup: AGE_GROUPS[0],
      coachId: MOCK_COACHES[0].id,
      trainingDays: ['السبت', 'الاثنين'],
      field: 'ملعب (أ)'
    };
    setEditingTeam(teamInfo);
    setFormData(teamInfo);
    const filtered = allPlayers.filter(p => p.team === teamName);
    setTeamPlayers(filtered);
    setModalTab('info');
    setIsModalOpen(true);
  };

  const handleOpenSessionEdit = (session: TrainingSession) => {
    setEditingSession(session);
    setIsEditingSession(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsModalOpen(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 1000);
  };

  const handleSaveSession = () => {
    if (!editingSession) return;
    setIsSaving(true);
    setTimeout(() => {
      setSessions(prev => prev.map(s => s.id === editingSession.id ? editingSession : s));
      setIsSaving(false);
      setIsEditingSession(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 800);
  };

  const confirmTransfer = async (targetTeam: string) => {
    if (!transferringPlayer) return;
    setIsSaving(true);
    try {
      await updatePlayerTeam(transferringPlayer.id, targetTeam);
      setTeamPlayers(prev => prev.filter(p => p.id !== transferringPlayer.id));
      setTransferringPlayer(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      alert("حدث خطأ أثناء نقل اللاعب.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoordinatePlayer = async () => {
    if (!coordinatingPlayer) return;
    setIsSaving(true);
    try {
      await deletePlayer(coordinatingPlayer.id);
      setTeamPlayers(prev => prev.filter(p => p.id !== coordinatingPlayer.id));
      setCoordinatingPlayer(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      alert("تعذر تنسيق اللاعب حالياً.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPlayerToTeam = async (player: any) => {
    if (!editingTeam) return;
    setIsSaving(true);
    try {
      await updatePlayerTeam(player.id, editingTeam.name);
      setPlayerSearchTerm('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      alert("تعذر إضافة اللاعب للفريق.");
    } finally {
      setIsSaving(false);
    }
  };

  const availablePlayers = allPlayers.filter(p => 
    p.team !== editingTeam?.name && 
    (p.fullName?.toLowerCase().includes(playerSearchTerm.toLowerCase()) || 
     p.team?.toLowerCase().includes(playerSearchTerm.toLowerCase()))
  ).slice(0, 5); // عرض أفضل 5 نتائج فقط لتوفير المساحة

  const schedule = restrictedTeam ? sessions.filter(item => item.team === restrictedTeam) : sessions;
  const displayedTeams = restrictedTeam ? TEAMS.filter(t => t === restrictedTeam) : TEAMS;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative text-right" dir="rtl">
      {showSuccessToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 font-bold">
            <CheckCircle2 size={24} />
            تم تحديث بيانات الفريق بنجاح!
          </div>
        </div>
      )}

      {/* مودال تأكيد التنسيق (استبعاد لاعب) */}
      {coordinatingPlayer && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-red-100">
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-800">تنسيق لاعب من الفريق</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-bold">
                  هل أنت متأكد من تنسيق اللاعب <span className="text-red-600">({coordinatingPlayer.fullName})</span>؟ 
                  <br/>سيتم استبعاده نهائياً من قائمة الفريق وحذف سجلاته.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setCoordinatingPlayer(null)} 
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                >
                  تراجع
                </button>
                <button 
                  onClick={handleCoordinatePlayer}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <UserMinus size={18} />}
                  تأكيد التنسيق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال تعديل الحصة التدريبية */}
      {isEditingSession && editingSession && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Calendar size={20} />
                </div>
                <h3 className="text-xl font-bold">تعديل موعد تدريب: {editingSession.team}</h3>
              </div>
              <button onClick={() => setIsEditingSession(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 mr-2">اليوم</label>
                  <select 
                    value={editingSession.day}
                    onChange={(e) => setEditingSession({...editingSession, day: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 mr-2">الوقت</label>
                  <div className="relative">
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      value={editingSession.time}
                      onChange={(e) => setEditingSession({...editingSession, time: e.target.value})}
                      className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsEditingSession(false)} className="px-6 py-2.5 text-gray-500 font-bold">إلغاء</button>
              <button 
                onClick={handleSaveSession}
                disabled={isSaving}
                className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black shadow-lg flex items-center gap-2"
              >
                {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-8 pb-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${editingTeam ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {editingTeam ? <Settings2 size={24} /> : <Plus size={24} />}
                  </div>
                  <h3 className="text-2xl font-bold">{editingTeam ? editingTeam.name : 'إضافة فريق'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>
              {editingTeam && (
                <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                  <button onClick={() => setModalTab('info')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${modalTab === 'info' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>البيانات الفنية</button>
                  <button onClick={() => setModalTab('roster')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${modalTab === 'roster' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>كشف اللاعبين ({teamPlayers.length})</button>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 pt-6">
              {modalTab === 'info' ? (
                <form id="teamForm" onSubmit={handleSaveTeam} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 mr-2">اسم الفريق</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 mr-2">الفئة العمرية</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none" value={formData.ageGroup} onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}>
                          {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                   </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {/* قسم إضافة لاعب جديد للفريق */}
                  <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 space-y-4 shadow-sm animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <UserPlus size={18} />
                      <h4 className="text-sm font-black uppercase tracking-widest">إضافة لاعب للفريق</h4>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="ابحث عن اسم لاعب لإضافته لهذه القائمة..."
                        className="w-full pr-10 pl-4 py-3 bg-white border border-emerald-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                        value={playerSearchTerm}
                        onChange={(e) => setPlayerSearchTerm(e.target.value)}
                      />
                    </div>

                    {playerSearchTerm.length > 0 && (
                      <div className="bg-white rounded-xl border border-emerald-50 divide-y divide-emerald-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {availablePlayers.length > 0 ? availablePlayers.map(p => (
                          <div key={p.id} className="p-3 flex items-center justify-between hover:bg-emerald-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                                {p.fullName?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-800 leading-none mb-1">{p.fullName}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">{p.team || 'غير مصنف'}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleAddPlayerToTeam(p)}
                              disabled={isSaving}
                              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                              title="إضافة للفريق"
                            >
                              <UserPlus size={14} />
                            </button>
                          </div>
                        )) : (
                          <div className="p-4 text-center text-[10px] text-gray-400 font-bold italic">لا يوجد نتائج تطابق البحث</div>
                        )}
                      </div>
                    )}
                  </div>

                  {transferringPlayer && (
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 space-y-4 animate-in slide-in-from-top-2">
                       <h4 className="font-bold text-amber-800">نقل اللاعب: {transferringPlayer.fullName}</h4>
                       <div className="grid grid-cols-2 gap-3">
                        {TEAMS.filter(t => t !== editingTeam?.name).map(t => (
                          <button key={t} onClick={() => confirmTransfer(t)} className="p-4 bg-white border border-amber-100 rounded-2xl text-xs font-black text-amber-900 hover:bg-emerald-600 hover:text-white transition-all flex justify-between items-center group">
                            {t}
                            <ArrowRightCircle size={16} />
                          </button>
                        ))}
                       </div>
                       <button onClick={() => setTransferringPlayer(null)} className="text-[10px] text-gray-400 font-bold hover:text-red-500">إلغاء النقل</button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2 px-2">
                      <UserCheck size={16} className="text-blue-600" />
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">قائمة اللاعبين الحالية</h4>
                    </div>
                    <div className="divide-y divide-gray-50 bg-white border border-gray-50 rounded-[2rem] overflow-hidden">
                      {teamPlayers.length > 0 ? teamPlayers.map(p => (
                        <div key={p.id} className="py-5 flex justify-between items-center group hover:bg-gray-50/50 px-6 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all text-xs">
                              {p.fullName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{p.fullName}</p>
                              <p className="text-[10px] text-gray-400 font-bold">{p.level}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button 
                              onClick={() => setTransferringPlayer(p)} 
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all"
                             >
                              <ArrowLeftRight size={14} />
                              نقل
                             </button>
                             <button 
                              onClick={() => setCoordinatingPlayer(p)} 
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-600 hover:text-white transition-all"
                             >
                              <UserMinus size={14} />
                              تنسيق
                             </button>
                          </div>
                        </div>
                      )) : (
                        <div className="py-12 text-center text-gray-400 font-bold">لا يوجد لاعبين في هذا الفريق</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 border-t border-gray-50 flex justify-end gap-4 bg-gray-50/50">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-gray-500 font-bold">إغلاق</button>
              {modalTab === 'info' && !restrictedTeam && (
                <button form="teamForm" type="submit" disabled={isSaving} className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black shadow-lg">
                  {isSaving ? <RefreshCw className="animate-spin" size={20} /> : 'حفظ التعديلات'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* واجهة العرض الرئيسية */}
      <div className="flex justify-between items-center">
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          <button onClick={() => setActiveView('list')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeView === 'list' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>قائمة الفرق</button>
          <button onClick={() => setActiveView('schedule')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeView === 'schedule' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>الجدول التدريبي</button>
        </div>
        {!restrictedTeam && (
          <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-emerald-100 transition-all active:scale-95">
            <Plus size={18} /> إضافة فريق جديد
          </button>
        )}
      </div>

      {activeView === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedTeams.map((team, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all border-b-8 border-b-emerald-500">
              <div className="p-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:rotate-6 transition-transform"><Trophy size={32} /></div>
                <h3 className="text-xl font-black text-gray-800 mb-6">{team}</h3>
                <button onClick={() => handleOpenEditModal(team)} className="w-full py-4 text-emerald-600 bg-emerald-50 rounded-2xl text-sm font-black hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Settings2 size={18} /> إدارة الفريق واللاعبين
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Calendar size={22} />
                </div>
                <h3 className="text-xl font-black text-gray-800">المواعيد الأسبوعية</h3>
             </div>
           </div>
           
           <div className="space-y-6">
             {schedule.length > 0 ? schedule.map((item, i) => (
               <div key={i} className="flex flex-col md:flex-row justify-between items-center p-6 bg-gray-50 rounded-[2rem] border border-gray-100 gap-6 group hover:border-emerald-200 hover:bg-white transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-900 text-white rounded-[1.5rem] flex flex-col items-center justify-center font-black border-2 border-emerald-500 shadow-lg">
                      <span className="text-[10px] opacity-60 mb-1">{item.day.charAt(0)}</span>
                      <span className="text-lg">{item.day}</span>
                    </div>
                    <div>
                      <p className="font-black text-xl text-gray-800">{item.team}</p>
                      <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-1">
                        <Zap size={14} className="text-amber-500" />
                        {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-6 py-3 bg-white rounded-2xl text-sm font-black flex items-center gap-2 border border-gray-100 shadow-sm">
                      <Clock size={18} className="text-amber-500" />
                      {item.time}
                    </div>
                  </div>
                  
                  {(restrictedTeam === item.team || !restrictedTeam) && (
                    <button 
                      onClick={() => handleOpenSessionEdit(item)}
                      className="px-6 py-3 bg-white text-emerald-600 rounded-xl text-xs font-black border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                    >
                      <Edit3 size={16} />
                      تعديل الموعد
                    </button>
                  )}
               </div>
             )) : (
               <div className="py-20 text-center text-gray-400 font-bold">لا توجد تمارين مسجلة حالياً</div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPanel;
