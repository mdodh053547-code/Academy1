
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  BrainCircuit, 
  CheckCircle2, 
  User,
  Settings,
  ArrowLeftRight,
  TrendingUp,
  X,
  Save,
  ChevronDown,
  RotateCcw,
  RefreshCw,
  LayoutGrid,
  List,
  AlertTriangle,
  Mail,
  Smartphone,
  Trophy,
  Zap,
  Sparkles,
  Calendar,
  Users,
  ShieldCheck,
  Fingerprint,
  Key,
  ShieldAlert
} from 'lucide-react';
import { getPlayerInsights } from '../services/geminiService';
import { subscribeToPlayers, updatePlayerProfile, deletePlayer, registerNewPlayer } from '../services/playerService';
import PlayerRegistration from './PlayerRegistration';
import { TEAMS, LEVELS, AGE_GROUPS } from '../constants';

interface PlayerListProps {
  initialView?: 'list' | 'register';
  onViewChange?: (view: 'list' | 'register') => void;
  restrictedTeam?: string; 
}

const PlayerList: React.FC<PlayerListProps> = ({ initialView = 'list', onViewChange, restrictedTeam }) => {
  const [view, setView] = useState<'list' | 'register'>(initialView);
  const [displayMode, setDisplayMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAgeFilter, setActiveAgeFilter] = useState<string>('الكل');
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [managingPlayer, setManagingPlayer] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [managementTab, setManagementTab] = useState<'info' | 'access'>('info');
  
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showToast, setShowToast] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({show: false, msg: '', type: 'success'});
  const [isLoading, setIsLoading] = useState(true);

  // States for management actions
  const [newTeam, setNewTeam] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // State for manual add form
  const [manualPlayerData, setManualPlayerData] = useState({
    fullName: '',
    ageGroup: AGE_GROUPS[0],
    level: LEVELS[0],
    team: TEAMS[0],
    parentName: '',
    parentPhone: '',
    birthDate: ''
  });

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToPlayers((data) => {
      const approvedPlayers = data.filter(p => p.status === 'active' || p.status === 'inactive');
      const filteredData = restrictedTeam 
        ? approvedPlayers.filter(p => p.team === restrictedTeam)
        : approvedPlayers;
      setPlayers(filteredData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [restrictedTeam]);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ show: true, msg, type });
    setTimeout(() => setShowToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const handleManualAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPlayerData.fullName || !manualPlayerData.parentPhone) {
      alert("يرجى إكمال الحقول الأساسية");
      return;
    }
    setIsUpdating(true);
    try {
      const playerData = {
        ...manualPlayerData,
        username: manualPlayerData.fullName.split(' ')[0] + "_" + Math.floor(Math.random() * 999),
        password: Math.random().toString(36).slice(-6).toUpperCase()
      };
      await registerNewPlayer(playerData, undefined, undefined, 'active', 'paid');
      setIsAddModalOpen(false);
      triggerToast("تمت إضافة اللاعب وتفعيل عضويته ونفاذ بنجاح!");
      setManualPlayerData({
        fullName: '',
        ageGroup: AGE_GROUPS[0],
        level: LEVELS[0],
        team: TEAMS[0],
        parentName: '',
        parentPhone: '',
        birthDate: ''
      });
    } catch (error) {
      triggerToast("حدث خطأ أثناء الإضافة اليدوية", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const generateQuickAccess = () => {
    if (!managingPlayer) return;
    const user = managingPlayer.fullName.trim().split(' ')[0] + "_" + Math.floor(100 + Math.random() * 899);
    const pass = Math.random().toString(36).slice(-6).toUpperCase();
    setNewUsername(user);
    setNewPassword(pass);
  };

  const handleAnalyze = async (player: any) => {
    setIsAnalyzing(true);
    setSelectedPlayer(player);
    const result = await getPlayerInsights({
      name: player.fullName,
      ageGroup: player.ageGroup,
      metrics: player.metrics || { dribbling: 7, passing: 6, stamina: 8 }
    });
    setAiReportWithEffect(result);
    setIsAnalyzing(false);
  };

  const setAiReportWithEffect = (text: string) => {
    setAiInsight(text);
    if (window.innerWidth < 1024) {
      document.getElementById('ai-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openManagement = (player: any) => {
    setManagingPlayer(player);
    setNewTeam(player.team || '');
    setNewLevel(player.level || '');
    setNewUsername(player.username || '');
    setNewPassword(player.password || '');
    setManagementTab('info');
  };

  const handleUpdatePlayer = async () => {
    if (!managingPlayer) return;
    setIsUpdating(true);
    try {
      await updatePlayerProfile(managingPlayer.id, {
        team: newTeam,
        level: newLevel,
        username: newUsername,
        password: newPassword
      });
      triggerToast(`تم تحديث بيانات ${managingPlayer.fullName} بنجاح!`);
      setManagingPlayer(null);
    } catch (e) {
      triggerToast("حدث خطأ أثناء تحديث البيانات", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredPlayers = players.filter(p => {
    const nameStr = (p.fullName || p.name || '').toLowerCase();
    const teamStr = (p.team || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = nameStr.includes(search) || teamStr.includes(search);
    const matchesAge = activeAgeFilter === 'الكل' || p.ageGroup === activeAgeFilter;
    return matchesSearch && matchesAge;
  });

  if (view === 'register') {
    return (
      <PlayerRegistration 
        onBack={() => setView('list')} 
        onSuccess={() => {
          setView('list');
          triggerToast("تم تقديم طلب انضمام بنجاح!");
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative text-right pb-10" dir="rtl">
      {showToast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[250] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${showToast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 border border-white/20 font-black`}>
            {showToast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            <p>{showToast.msg}</p>
          </div>
        </div>
      )}

      {/* Manual Add Player Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-gray-100 bg-emerald-50/30 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-lg">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tighter">إضافة لاعب (يدوي)</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">تفعيل مباشر للمدير العام</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">اسم اللاعب الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="الاسم الرباعي"
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800"
                      value={manualPlayerData.fullName}
                      onChange={(e) => setManualPlayerData({...manualPlayerData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">تاريخ الميلاد</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="date" 
                      required
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800"
                      value={manualPlayerData.birthDate}
                      onChange={(e) => setManualPlayerData({...manualPlayerData, birthDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">اسم ولي الأمر</label>
                  <div className="relative">
                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="اسم الأب أو الوكيل"
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800"
                      value={manualPlayerData.parentName}
                      onChange={(e) => setManualPlayerData({...manualPlayerData, parentName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">رقم الجوال</label>
                  <div className="relative">
                    <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      required
                      placeholder="05XXXXXXXX"
                      className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800"
                      value={manualPlayerData.parentPhone}
                      onChange={(e) => setManualPlayerData({...manualPlayerData, parentPhone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">الفئة العمرية</label>
                  <select 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800 appearance-none"
                    value={manualPlayerData.ageGroup}
                    onChange={(e) => setManualPlayerData({...manualPlayerData, ageGroup: e.target.value})}
                  >
                    {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">المستوى</label>
                  <select 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800 appearance-none"
                    value={manualPlayerData.level}
                    onChange={(e) => setManualPlayerData({...manualPlayerData, level: e.target.value})}
                  >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">الفريق</label>
                  <select 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800 appearance-none"
                    value={manualPlayerData.team}
                    onChange={(e) => setManualPlayerData({...manualPlayerData, team: e.target.value})}
                  >
                    {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={20} />
                <p className="text-xs text-blue-800 font-bold leading-relaxed">بإتمام هذه العملية، سيتم تسجيل اللاعب كـ "نشط" و "مسدد للرسوم" فوراً، وسيكون اسم مستخدمه هو اسمه الكامل.</p>
              </div>
            </form>

            <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex gap-4">
               <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 text-gray-400 font-black hover:text-red-500 transition-colors">إلغاء</button>
               <button 
                onClick={handleManualAddSubmit}
                disabled={isUpdating}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
               >
                 {isUpdating ? <RefreshCw className="animate-spin" size={24} /> : <><Save size={24} /> حفظ وإضافة اللاعب</>}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Management Modal (Enhanced with Access Tab) */}
      {managingPlayer && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-[1.2rem] flex items-center justify-center shadow-inner">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tighter">إدارة ملف اللاعب</h3>
                    <p className="text-[10px] text-gray-400 font-bold">{managingPlayer.fullName}</p>
                  </div>
                </div>
                <button onClick={() => setManagingPlayer(null)} className="p-2 text-gray-300 hover:text-red-500 transition-all">
                  <X size={24} />
                </button>
            </div>

            <div className="p-6 bg-gray-100/50 border-b border-gray-100 flex gap-2">
               <button 
                onClick={() => setManagementTab('info')} 
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${managementTab === 'info' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100' : 'text-gray-400 hover:bg-white/50'}`}
               >
                 <User size={16} /> البيانات الفنية
               </button>
               <button 
                onClick={() => setManagementTab('access')} 
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${managementTab === 'access' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/50'}`}
               >
                 <Fingerprint size={16} /> ربط نفاذ (الوصول)
               </button>
            </div>

            <div className="p-8 space-y-6">
              {managementTab === 'info' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">النقل إلى فريق جديد</label>
                    <div className="relative">
                      <ArrowLeftRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select 
                        className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800 appearance-none cursor-pointer"
                        value={newTeam}
                        onChange={(e) => setNewTeam(e.target.value)}
                      >
                        {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">تحديث المستوى الفني</label>
                    <div className="relative">
                      <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select 
                        className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-800 appearance-none cursor-pointer"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                      >
                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                  <div className="p-5 bg-purple-50 rounded-[2rem] border border-purple-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Fingerprint className="text-purple-600" size={24} />
                        <div>
                           <p className="text-xs font-black text-purple-900">حالة الربط الرقمي</p>
                           <p className="text-[10px] text-purple-500 font-bold uppercase">{newUsername ? 'حساب نشط' : 'غير مرتبط بالبوابة'}</p>
                        </div>
                     </div>
                     <button 
                      onClick={generateQuickAccess}
                      className="px-4 py-2 bg-white text-purple-600 rounded-xl text-[10px] font-black border border-purple-200 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                     >
                        توليد دخول ذكي
                     </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">اسم المستخدم (Username)</label>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="user_name"
                          className="w-full pr-10 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-black text-xs text-purple-900 focus:bg-white"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">كلمة المرور (Password)</label>
                      <div className="relative">
                        <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="********"
                          className="w-full pr-10 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-black text-xs text-purple-900 focus:bg-white tracking-widest"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <ShieldAlert size={18} className="text-amber-600 mt-1 shrink-0" />
                    <p className="text-[10px] text-amber-800 font-bold leading-relaxed">بمجرد الحفظ، سيتمكن اللاعب من الدخول لبوابة الأعضاء باستخدام هذه البيانات. يرجى تزويد ولي الأمر بها.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setManagingPlayer(null)} className="flex-1 py-4 text-gray-400 font-black hover:text-red-500 transition-colors">إلغاء</button>
                <button 
                  onClick={handleUpdatePlayer}
                  disabled={isUpdating}
                  className={`flex-[2] flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black shadow-2xl transition-all active:scale-95 disabled:opacity-50 text-white ${managementTab === 'access' ? 'bg-purple-600 shadow-purple-100' : 'bg-emerald-600 shadow-emerald-100'}`}
                >
                  {isUpdating ? <RefreshCw className="animate-spin" size={24} /> : <><Save size={24} /> اعتماد التغييرات</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 relative">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text"
              placeholder="ابحث عن لاعب باسمه أو فريقه..."
              className="w-full pr-14 pl-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none text-lg font-bold shadow-inner focus:ring-4 focus:ring-emerald-500/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                <button onClick={() => setDisplayMode('cards')} className={`p-2.5 rounded-xl transition-all ${displayMode === 'cards' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-400 hover:text-emerald-600'}`}><LayoutGrid size={22} /></button>
                <button onClick={() => setDisplayMode('table')} className={`p-2.5 rounded-xl transition-all ${displayMode === 'table' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-400 hover:text-emerald-600'}`}><List size={22} /></button>
             </div>
             {!restrictedTeam && (
               <div className="flex gap-2">
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-5 bg-blue-600 text-white rounded-[1.8rem] font-black hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all active:scale-95 text-sm"
                  >
                    <Plus size={20} />
                    إضافة يدوية
                  </button>
                  <button 
                    onClick={() => setView('register')}
                    className="flex items-center gap-2 px-6 py-5 bg-emerald-600 text-white rounded-[1.8rem] font-black hover:bg-emerald-700 shadow-2xl shadow-emerald-100 transition-all active:scale-95 text-sm"
                  >
                    <UserPlus size={20} />
                    طلبات التسجيل
                  </button>
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">تصفية حسب الفئة:</span>
          {['الكل', ...AGE_GROUPS].map(age => (
            <button 
              key={age}
              onClick={() => setActiveAgeFilter(age)}
              className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${activeAgeFilter === age ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500 shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'}`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="bg-white p-32 rounded-[3rem] border border-gray-100 text-center">
              <RefreshCw className="animate-spin text-emerald-500 mx-auto mb-6" size={48} />
              <p className="text-xl font-black text-gray-400">جاري مزامنة بيانات اللاعبين...</p>
            </div>
          ) : filteredPlayers.length > 0 ? (
            displayMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                {filteredPlayers.map(player => (
                  <div key={player.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden border-r-8 border-r-blue-600">
                    <div className="flex items-start justify-between mb-8">
                       <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                            {player.fullName?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-gray-800 leading-tight mb-1">{player.fullName}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">{player.team}</span>
                              <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">{player.level}</span>
                            </div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <button onClick={() => openManagement(player)} className="p-2.5 text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Settings size={20} /></button>
                          <button onClick={() => handleAnalyze(player)} className="p-2.5 text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"><BrainCircuit size={20} /></button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                          <p className="text-[9px] text-gray-400 font-black uppercase mb-1">نسبة الحضور</p>
                          <p className="text-lg font-black text-emerald-600">{player.attendanceRate || 85}%</p>
                       </div>
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center relative overflow-hidden group/item">
                          <p className="text-[9px] text-gray-400 font-black uppercase mb-1">حالة نفاذ</p>
                          <div className="flex items-center justify-center gap-2">
                             {player.username ? (
                               <span className="text-xs font-black text-emerald-600 flex items-center gap-1"><Fingerprint size={12}/> مرتبط</span>
                             ) : (
                               <span className="text-xs font-black text-gray-400 flex items-center gap-1 opacity-50"><ShieldAlert size={12}/> غير مرتبط</span>
                             )}
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] text-gray-400 uppercase tracking-widest font-black">
                      <th className="px-8 py-6">اللاعب</th>
                      <th className="px-8 py-6">الفريق</th>
                      <th className="px-8 py-6">بوابة نفاذ</th>
                      <th className="px-8 py-6 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPlayers.map(player => (
                      <tr key={player.id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                              {player.fullName?.charAt(0)}
                            </div>
                            <span className="font-black text-gray-800">{player.fullName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black border border-blue-100">{player.team}</span>
                        </td>
                        <td className="px-8 py-5">
                           {player.username ? (
                             <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit"><Fingerprint size={12}/> مرتبط</span>
                           ) : (
                             <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full w-fit"><ShieldAlert size={12}/> غير مرتبط</span>
                           )}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex items-center justify-center gap-1">
                             <button onClick={() => handleAnalyze(player)} className="p-2.5 text-purple-600 hover:bg-purple-100 rounded-xl transition-all"><BrainCircuit size={18}/></button>
                             <button onClick={() => openManagement(player)} className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"><Settings size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="bg-white p-32 rounded-[3rem] border border-gray-100 text-center">
               <Search size={64} className="mx-auto text-gray-100 mb-6" />
               <p className="text-xl font-black text-gray-400 italic">لا يوجد نتائج تطابق بحثك حالياً..</p>
            </div>
          )}
        </div>

        {/* AI Insight Section */}
        <div id="ai-section" className="space-y-6">
          <div className="bg-gray-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl border-b-8 border-purple-600 group">
             <div className="relative z-10">
                <div className="flex items-center gap-3 text-purple-400 mb-8">
                  <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/20 animate-pulse">
                    <BrainCircuit size={32} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter">التحليل الذكي (AI)</h3>
                </div>

                {isAnalyzing ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping"></div>
                      <div className="relative z-10 w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                        <RefreshCw className="animate-spin text-white" size={32} />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-black tracking-tight">جاري استدعاء Gemini...</p>
                      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1">يتم الآن تحليل الأرقام والبيانات السحابية</p>
                    </div>
                  </div>
                ) : selectedPlayer ? (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-3xl border border-white/5">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                        {selectedPlayer.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-purple-400 uppercase tracking-widest">تقرير اللاعب</p>
                        <h4 className="text-lg font-black">{selectedPlayer.fullName}</h4>
                      </div>
                    </div>

                    <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 text-purple-100 leading-relaxed text-sm font-medium shadow-inner backdrop-blur-md relative">
                       <div className="absolute top-4 left-4">
                        <Sparkles size={20} className="text-purple-400 opacity-40" />
                       </div>
                       <p className="whitespace-pre-wrap">{aiInsight}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-3">
                        <Zap size={20} className="text-amber-400" />
                        <div>
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">التوصية</p>
                          <p className="text-xs font-black">تركيز بدني</p>
                        </div>
                      </div>
                      <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-3">
                        <Trophy size={20} className="text-emerald-400" />
                        <div>
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">المستوى</p>
                          <p className="text-xs font-black">يتطور بسرعة</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-32 text-center space-y-6">
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/5 group-hover:scale-110 transition-transform">
                      <BrainCircuit size={48} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-gray-500 font-black text-lg">اختر لاعباً للتحليل</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">سيقوم الذكاء الاصطناعي بتقديم نصائح تطويرية</p>
                    </div>
                  </div>
                )}
             </div>
             
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none"></div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
             <h4 className="font-black text-gray-800 flex items-center gap-2">
                <Smartphone size={20} className="text-emerald-600" />
                تواصل سريع
             </h4>
             <p className="text-xs text-gray-400 font-bold leading-relaxed">يمكنك إرسال إشعار مباشر لولي أمر اللاعب المختار بضغطة واحدة.</p>
             <div className="flex gap-2">
                <button className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm">واتساب</button>
                <button className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm">رسالة SMS</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
