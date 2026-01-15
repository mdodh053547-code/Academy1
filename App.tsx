
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PlayerList from './components/PlayerList';
import FinancePanel from './components/FinancePanel';
import SettingsPanel from './components/SettingsPanel';
import TeamsPanel from './components/TeamsPanel';
import AttendancePanel from './components/AttendancePanel';
import PerformancePanel from './components/PerformancePanel';
import CommunicationPanel from './components/CommunicationPanel';
import CoachGroupPanel from './components/CoachGroupPanel';
import MemberPortal from './components/MemberPortal';
import VisitorPortal from './components/VisitorPortal';
import LandingPage from './components/LandingPage';
import PlayerRegistration from './components/PlayerRegistration';
import JoinRequestsPanel from './components/JoinRequestsPanel';
import { UserRole } from './types';
import { MOCK_COACHES } from './constants';
import { subscribeToPlayers } from './services/playerService';
import { 
  X, 
  UserCog, 
  LogOut, 
  ShieldCheck, 
  User, 
  ChevronLeft,
  Crown,
  Trophy,
  Users,
  Lock,
  LogIn,
  Search,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ArrowRight
} from 'lucide-react';

const DEFAULT_TOUR_DATA = [
  {
    title: "ملاعبنا الاحترافية",
    desc: "نمتلك ملاعب بمواصفات دولية معتمدة من الفيفا، مجهزة بأنظمة إنارة متطورة للتدريبات المسائية.",
    img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1000",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  },
  {
    title: "التحليل الفني الذكي",
    desc: "نستخدم كاميرات تتبع وأنظمة AI لتحليل تحركات كل لاعب وتقديم نصائح تطويرية دقيقة.",
    img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=1000",
    videoUrl: "https://www.youtube.com/embed/3AtDnEC4zak?autoplay=1"
  },
  {
    title: "صالة الإعداد البدني",
    desc: "صالة رياضية متكاملة مخصصة لرفع الكفاءة اللياقية والوقاية من الإصابات تحت إشراف متخصصين.",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000",
    videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E?autoplay=1"
  }
];

const App: React.FC = () => {
  const [portal, setPortal] = useState<'landing' | 'staff' | 'member' | 'visitor' | 'registration'>('landing');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.COACH);
  const [activeCoachId, setActiveCoachId] = useState<string>(MOCK_COACHES[0].id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabParams, setTabParams] = useState<any>(null);
  
  const [adminProfile, setAdminProfile] = useState({
    name: 'مصطفى علي',
    password: '123'
  });

  const [academyLinks, setAcademyLinks] = useState({
    whatsapp: 'https://wa.me/966500000000',
    instagram: 'https://instagram.com/academy',
    twitter: 'https://twitter.com/academy',
    maps: 'https://goo.gl/maps/example',
    website: 'https://academy-hub.sa'
  });

  const [tourData, setTourData] = useState(DEFAULT_TOUR_DATA);
  const [coachesList, setCoachesList] = useState(MOCK_COACHES);
  const [playersList, setPlayersList] = useState<any[]>([]);
  const [loggedInMember, setLoggedInMember] = useState<any | null>(null);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'staff' | 'member'>('staff');
  const [selectedProfileForLogin, setSelectedProfileForLogin] = useState<any | null>(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToPlayers((data) => {
      setPlayersList(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAdminLoginInitiate = () => {
    setSelectedProfileForLogin({ ...adminProfile, type: 'ADMIN' });
    setLoginError('');
    setLoginPassword('');
  };

  const selectCoachProfile = (coach: any) => {
    const currentCoach = coachesList.find(c => c.id === coach.id);
    if (!currentCoach?.password) {
      setUserRole(UserRole.COACH);
      setActiveCoachId(currentCoach?.id || coach.id);
      setPortal('staff');
      setActiveTab('dashboard');
      setShowLoginModal(false);
    } else {
      setSelectedProfileForLogin({ ...currentCoach, type: 'COACH' });
      setLoginError('');
      setLoginPassword('');
    }
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'member') {
      if (loginPassword === '1234') {
        setLoggedInMember(selectedProfileForLogin);
        setPortal('member');
        setShowLoginModal(false);
        setSelectedProfileForLogin(null);
      } else {
        setLoginError('كلمة المرور غير صحيحة. جرب "1234"');
      }
      return;
    }

    const targetPassword = selectedProfileForLogin.type === 'ADMIN' ? adminProfile.password : selectedProfileForLogin.password;
    if (loginPassword === targetPassword) {
      if (selectedProfileForLogin.type === 'ADMIN') {
        setUserRole(UserRole.ADMIN);
      } else {
        setUserRole(UserRole.COACH);
        setActiveCoachId(selectedProfileForLogin.id);
      }
      setPortal('staff');
      setActiveTab('dashboard');
      setShowLoginModal(false);
      setSelectedProfileForLogin(null);
    } else {
      setLoginError('كلمة المرور غير صحيحة.');
    }
  };

  const logout = () => {
    setPortal('landing');
    setUserRole(UserRole.COACH);
    setActiveTab('dashboard');
    setLoggedInMember(null);
    setSelectedProfileForLogin(null);
    setTabParams(null);
  };

  const navigateToTab = (tab: string, params?: any) => {
    setActiveTab(tab);
    setTabParams(params || null);
  };

  const renderContent = () => {
    if (portal === 'landing') {
      return (
        <LandingPage 
          onStaffClick={() => { setLoginType('staff'); setShowLoginModal(true); setSelectedProfileForLogin(null); }} 
          onMemberClick={() => { setLoginType('member'); setShowLoginModal(true); setSelectedProfileForLogin(null); }}
          onVisitorClick={() => setPortal('visitor')}
          socialLinks={academyLinks}
        />
      );
    }
    if (portal === 'member') return <MemberPortal onBack={logout} player={loggedInMember} />;
    if (portal === 'visitor') return <VisitorPortal onBack={() => setPortal('landing')} onRegister={() => setPortal('registration')} tourData={tourData} />;
    if (portal === 'registration') return <div className="min-h-screen bg-gray-50 p-6 md:p-20"><PlayerRegistration onBack={() => setPortal('visitor')} onSuccess={() => { setPortal('landing'); alert("تم تقديم طلب انضمام بنجاح! سيتم التواصل معكم قريباً."); }} /></div>;

    const currentCoach = coachesList.find(c => c.id === activeCoachId);
    const coachTeam = userRole === UserRole.COACH ? currentCoach?.team : undefined;

    switch (activeTab) {
      case 'dashboard': return <Dashboard userRole={userRole} adminName={adminProfile.name} onRegister={() => navigateToTab('players')} onViewRequests={() => navigateToTab('requests')} onGoToTab={navigateToTab} />;
      case 'requests': return <JoinRequestsPanel />;
      case 'coach-group': return <CoachGroupPanel coachId={activeCoachId} onGoToAttendance={() => navigateToTab('attendance')} onGoToPerformance={() => navigateToTab('performance')} />;
      case 'players': return <PlayerList restrictedTeam={coachTeam} />;
      case 'teams': return <TeamsPanel restrictedTeam={coachTeam} />;
      case 'attendance': return <AttendancePanel restrictedTeam={coachTeam} />;
      case 'performance': return <PerformancePanel restrictedTeam={coachTeam} />;
      case 'finance': return <FinancePanel />;
      case 'communication': return <CommunicationPanel params={tabParams} />;
      case 'settings': return <SettingsPanel coaches={coachesList} onCoachesUpdate={setCoachesList} adminProfile={adminProfile} onAdminUpdate={setAdminProfile} academyLinks={academyLinks} onAcademyLinksUpdate={setAcademyLinks} tourData={tourData} onTourDataUpdate={setTourData} players={playersList} />;
      default: return null;
    }
  };

  const currentUserName = userRole === UserRole.ADMIN ? adminProfile.name : (coachesList.find(c => c.id === activeCoachId)?.name || 'المدرب');

  return (
    <>
      {portal === 'staff' ? (
        <Layout 
          activeTab={activeTab} 
          setActiveTab={(tab) => navigateToTab(tab)} 
          userRole={userRole}
          userName={currentUserName}
          roleSwitcher={
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${userRole === UserRole.ADMIN ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500'}`}>
                <UserCog size={14} /> {userRole === UserRole.ADMIN ? 'مدير النظام' : 'مدرب'}
              </div>
              <button onClick={logout} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={16} /></button>
            </div>
          }
          onLogout={logout}
        >
          {renderContent()}
        </Layout>
      ) : renderContent()}

      {showLoginModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-8">
              <div className="flex justify-between items-center">
                <div className="w-12">{selectedProfileForLogin && <button onClick={() => { setSelectedProfileForLogin(null); setLoginError(''); }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-all flex items-center gap-1"><ArrowRight size={20} /></button>}</div>
                <div className="flex flex-col items-center">
                   <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">{loginType === 'member' ? <Users size={24} /> : <ShieldCheck size={24} />}</div>
                   <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{loginType === 'member' ? 'دخول بوابة الأعضاء' : 'دخول الكادر الإداري'}</h3>
                </div>
                <button onClick={() => { setShowLoginModal(false); setSelectedProfileForLogin(null); }} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X size={24} /></button>
              </div>
              {!selectedProfileForLogin ? (
                <div className="space-y-6">
                  {loginType === 'staff' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                      <button onClick={handleAdminLoginInitiate} className="group relative bg-emerald-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center gap-4 transition-all hover:scale-[1.02] shadow-xl border-2 border-transparent hover:border-emerald-400">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-950 shadow-inner"><Crown size={40} /></div>
                        <div className="text-center"><h4 className="text-xl font-black">{adminProfile.name}</h4><p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">المدير العام</p></div>
                      </button>
                      <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-right mr-2 mb-2">طاقم التدريب</p>
                        {coachesList.map((coach) => (
                          <button key={coach.id} onClick={() => selectCoachProfile(coach)} className="w-full bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4 transition-all hover:bg-white hover:border-emerald-500 hover:shadow-lg group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">{coach.name.charAt(7)}</div>
                            <div className="text-right flex-1"><p className="text-sm font-black text-gray-800">{coach.name}</p><p className="text-[10px] text-gray-500 font-bold uppercase">{coach.team}</p></div>
                            <ChevronLeft size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 py-4">
                      <div className="relative max-w-md mx-auto">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="ابحث عن اسمك للدخول..." className="w-full pr-14 pl-6 py-5 bg-gray-50 border border-gray-200 rounded-[2rem] outline-none font-bold text-lg focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner" value={playerSearchQuery} onChange={(e) => setPlayerSearchQuery(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                        {playersList.filter(p => p.fullName?.toLowerCase().includes(playerSearchQuery.toLowerCase())).slice(0, 6).map(player => (
                          <button key={player.id} onClick={() => { setSelectedProfileForLogin(player); setLoginError(''); }} className="p-5 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-center gap-4 hover:bg-blue-600 hover:text-white transition-all group shadow-sm">
                            <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">{player.fullName?.charAt(0)}</div>
                            <div className="flex-1"><p className="text-sm font-black leading-none mb-1.5">{player.fullName}</p><p className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">{player.team}</p></div>
                            <ChevronLeft size={18} className="opacity-40 group-hover:opacity-100 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 max-w-md mx-auto w-full animate-in slide-in-from-bottom-6 duration-400 text-right">
                  <div className="flex flex-col items-center gap-4 mb-10">
                    <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-100">{selectedProfileForLogin.fullName?.charAt(0) || selectedProfileForLogin.name.charAt(7)}</div>
                    <div className="text-center"><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">تسجيل دخول باسم</p><h4 className="text-2xl font-black text-gray-800">{selectedProfileForLogin.fullName || selectedProfileForLogin.name}</h4></div>
                  </div>
                  <form onSubmit={handlePasswordLogin} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-4">كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input type="password" placeholder={loginType === 'member' ? "أدخل كلمة المرور (1234)" : "أدخل كلمة المرور"} autoFocus className="w-full pr-14 pl-8 py-5 bg-gray-50 border border-gray-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-black text-center text-xl tracking-[0.5em]" value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }} />
                      </div>
                    </div>
                    {loginError && <div className="flex items-center gap-2 justify-center text-red-500 text-sm font-black animate-shake bg-red-50 py-3 rounded-2xl border border-red-100"><AlertCircle size={18} />{loginError}</div>}
                    <button type="submit" className={`w-full py-5 rounded-[2rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 text-lg ${loginType === 'member' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'}`}><LogIn size={24} />دخول باسم {selectedProfileForLogin.fullName?.split(' ')[0] || selectedProfileForLogin.name.split(' ')[0]}</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; animation-iteration-count: 2; }
      `}</style>
    </>
  );
};

export default App;
