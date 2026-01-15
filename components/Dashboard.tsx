
import React, { useState, useEffect } from 'react';
import { MOCK_SUMMARY, COLORS, MOCK_PLAYERS, AGE_GROUPS } from '../constants';
import { UserRole } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Info, 
  MessageCircle,
  Share2,
  CheckCircle2, 
  Zap,
  Crown,
  Star,
  CloudUpload,
  RefreshCw,
  UserPlus,
  ShieldCheck,
  Lock,
  Database,
  Inbox,
  LayoutDashboard,
  Trophy,
  Activity,
  AlertTriangle,
  Clock,
  ArrowLeftRight,
  ListChecks,
  BellRing,
  ExternalLink,
  X,
  BrainCircuit,
  Sparkles,
  Cloud,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { subscribeToPlayers, syncGlobalState } from '../services/playerService';

interface DashboardProps {
  userRole: UserRole;
  adminName?: string;
  onRegister?: () => void;
  onViewRequests?: () => void;
  onGoToTab?: (tab: string, params?: any) => void;
}

const FIXED_PLANS = [
  {
    id: 'p1',
    title: 'تطوير بناء اللعب من الخلف',
    category: 'تكتيكي',
    duration: '90 دقيقة',
    details: '1. إحماء بالكرة (15د)\n2. تمرير في مساحات ضيقة (20د)\n3. التحرك لفتح زوايا التمرير (25د)\n4. مناورة تطبيقية 8 ضد 8 (30د)',
    icon: <Zap className="text-amber-500" />
  },
  {
    id: 'p2',
    title: 'رفع الكفاءة اللياقية والتحمل',
    category: 'بدني',
    duration: '75 دقيقة',
    details: '1. جري تزايدي (10د)\n2. تدريبات سرعة ورد فعل (20د)\n3. محطات تقوية عضلية (25د)\n4. إطالات وتبريد (20د)',
    icon: <Activity className="text-emerald-500" />
  },
  {
    id: 'p3',
    title: 'إتقان أساسيات المراوغة (U11)',
    category: 'أساسيات',
    duration: '60 دقيقة',
    details: '1. التحكم بالكرة بالقدمين (15د)\n2. مراوغة الأقماع المتعرجة (20د)\n3. مواقف 1 ضد 1 (20د)\n4. تحدي الدقة (5د)',
    icon: <Star className="text-blue-500" />
  }
];

const StatCard: React.FC<{ item: any, onClick?: () => void }> = ({ item, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl text-white ${item.color} shadow-lg shadow-inherit/20`}>
        {item.icon || <Activity size={24} />}
      </div>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.change?.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
        {item.change}
      </span>
    </div>
    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
    <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{item.value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ userRole, adminName = 'مصطفى علي', onRegister, onViewRequests, onGoToTab }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [syncStage, setSyncStage] = useState<'idle' | 'connecting' | 'players' | 'success'>('idle');
  
  // حالات الخطط الثابتة
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const isAdmin = userRole === UserRole.ADMIN;
  const isCoach = userRole === UserRole.COACH;

  useEffect(() => {
    const unsubscribe = subscribeToPlayers((data) => {
      setPlayers(data);
      setPendingRequests(data.filter(p => p.status === 'pending').length);
    });
    return () => unsubscribe();
  }, []);

  const atRiskPlayers = players.filter(p => p.status === 'active' && (p.attendanceRate || 0) < 80).slice(0, 3);

  const handleSync = async () => {
    setSyncStage('connecting');
    await syncGlobalState();
    setSyncStage('success');
    setTimeout(() => setSyncStage('idle'), 3000);
  };

  const chartData = [
    { name: 'سبت', attendance: 85, revenue: 4000 },
    { name: 'أحد', attendance: 90, revenue: 3000 },
    { name: 'اثنين', attendance: 75, revenue: 2000 },
    { name: 'ثلاثاء', attendance: 95, revenue: 6000 },
    { name: 'أربعاء', attendance: 88, revenue: 4500 },
    { name: 'خميس', attendance: 92, revenue: 5000 },
    { name: 'جمعة', attendance: 0, revenue: 0 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10 text-right font-['Cairo']" dir="rtl">
      
      {/* Modal: Fixed Training Plans */}
      {showPlansModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800">مكتبة الخطط التدريبية</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">خطط فنية معتمدة من الأكاديمية</p>
                  </div>
               </div>
               <button onClick={() => { setShowPlansModal(false); setSelectedPlan(null); }} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={24}/></button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              {!selectedPlan ? (
                <div className="space-y-4">
                  {FIXED_PLANS.map(plan => (
                    <button 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center justify-between hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          {plan.icon}
                        </div>
                        <div className="text-right">
                          <h4 className="font-black text-gray-800">{plan.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{plan.category} • {plan.duration}</p>
                        </div>
                      </div>
                      <ChevronLeft className="text-gray-300 group-hover:text-emerald-600 group-hover:-translate-x-2 transition-all" size={20} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-8 animate-in slide-in-from-left-4">
                   <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
                      <button onClick={() => setSelectedPlan(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><ChevronRight size={24} /></button>
                      <div>
                        <h4 className="text-2xl font-black text-emerald-600">{selectedPlan.title}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase">{selectedPlan.category} • المنهج الرسمي</p>
                      </div>
                   </div>
                   
                   <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 space-y-6">
                      <div className="flex items-center gap-2 text-emerald-700 font-black mb-4">
                        <Clock size={18} />
                        التوزيع الزمني للحصة
                      </div>
                      <p className="text-sm font-bold text-gray-700 leading-loose whitespace-pre-wrap">
                        {selectedPlan.details}
                      </p>
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-8 border-t border-gray-50 flex gap-4 bg-gray-50/30">
               <button onClick={() => window.print()} className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 font-black rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                 <Share2 size={18} /> طباعة الخطة
               </button>
               {selectedPlan && (
                 <button 
                  onClick={() => {
                    onGoToTab?.('communication', { 
                      message: `كابتن أكاديمية النخبة يحييكم،\nإليكم الخطة التدريبية للأسبوع القادم:\n\n*الهدف:* ${selectedPlan.title}\n*الفئة:* ${selectedPlan.category}\n*التفاصيل:*\n${selectedPlan.details}\n\nنأمل من الجميع الالتزام بالمواعيد والتحضير الجيد.`,
                      target: 'PARENTS'
                    });
                    setShowPlansModal(false);
                  }}
                  className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                 >
                   <MessageCircle size={18} /> إرسال للأهالي
                 </button>
               )}
               {!selectedPlan && (
                 <button onClick={() => { setShowPlansModal(false); setSelectedPlan(null); }} className="flex-1 py-4 bg-gray-800 text-white font-black rounded-2xl shadow-lg hover:bg-gray-900 transition-all">
                   إغلاق
                 </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Coach's Urgent Focus Area */}
      {isCoach && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Next Session Card */}
          <div className="lg:col-span-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={14} className="animate-pulse" />
                    الحصة التدريبية القادمة
                  </div>
                  <div>
                    <h2 className="text-4xl font-black mb-2">اليوم: تدريب فريق الصقور</h2>
                    <p className="text-emerald-100/80 font-bold">ملعب (أ) • الساعة 05:00 مساءً • تدريب تكتيكي مكثف</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => onGoToTab?.('attendance')}
                      className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-50 transition-all flex items-center gap-2 active:scale-95"
                    >
                      <ListChecks size={20} />
                      بدء التحضير الفوري
                    </button>
                    <button 
                      onClick={() => setShowPlansModal(true)}
                      className="bg-emerald-500/20 border border-white/20 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <BookOpen size={18} />
                      عرض الخطط الثابتة
                    </button>
                  </div>
               </div>
               <div className="w-48 h-48 bg-white/10 rounded-[3rem] backdrop-blur-md flex flex-col items-center justify-center border border-white/20 shadow-2xl">
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">يبدأ بعد</p>
                  <p className="text-5xl font-black tabular-nums">01:45</p>
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-60 mt-1">ساعة/دقيقة</p>
               </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          </div>

          {/* Urgent Alerts Side */}
          <div className="lg:col-span-4 bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-800 flex items-center gap-2">
                <BellRing size={20} className="text-red-500 animate-bounce" />
                تنبيهات عاجلة
              </h3>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black">{atRiskPlayers.length}</span>
            </div>

            <div className="space-y-4 flex-1">
              {atRiskPlayers.length > 0 ? atRiskPlayers.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all group">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black text-xs">
                        {p.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800">{p.fullName?.split(' ')[0]}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">الحضور: {p.attendanceRate || 0}%</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => onGoToTab?.('communication', { playerId: p.id })}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                   >
                     <MessageCircle size={16} />
                   </button>
                </div>
              )) : (
                <div className="py-10 text-center space-y-3 opacity-40">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                  <p className="text-xs font-bold">لا توجد غيابات حرجة حالياً</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => onGoToTab?.('performance')}
              className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              عرض التقارير الفنية الكاملة
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Admin Specific Header */}
      {isAdmin && (
        <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border-b-8 border-emerald-500">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-emerald-300 text-xs font-black uppercase tracking-widest">
                <Crown size={16} className="text-amber-400" />
                لوحة تحكم المدير العام
              </div>
              <h1 className="text-5xl font-black leading-tight tracking-tighter">مرحباً كابتن {adminName}</h1>
              <p className="text-emerald-100/70 text-lg font-medium max-w-2xl">تتم الآن مزامنة كافة بيانات الأكاديمية لحظياً. يمكنك متابعة الأداء المالي والفني من هنا.</p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={onViewRequests}
                  className="bg-blue-600 text-white font-black px-10 py-5 rounded-2xl shadow-2xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-3 text-sm"
                >
                  <Inbox size={22} />
                  طلبات بانتظار المراجعة ({pendingRequests})
                </button>
                <button 
                  onClick={handleSync}
                  className="bg-white text-emerald-900 font-black px-10 py-5 rounded-2xl shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-3 text-sm"
                >
                  {syncStage === 'connecting' ? <RefreshCw className="animate-spin" size={22} /> : <CloudUpload size={22} />}
                  مزامنة البيانات السحابية
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
               <div className="w-64 h-64 bg-emerald-800 rounded-[4rem] border-8 border-emerald-700/50 flex items-center justify-center rotate-3 shadow-2xl group hover:rotate-0 transition-transform">
                  <Trophy size={80} className="text-amber-400 mb-4 drop-shadow-xl" />
                  <p className="text-xs font-black uppercase tracking-widest">موسم 2024</p>
               </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      )}

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          item={{ 
            label: 'إجمالي اللاعبين', 
            value: players.filter(p => p.status === 'active').length.toString(), 
            change: '+10%', 
            color: 'bg-blue-600', 
            icon: <Users size={24} /> 
          }} 
          onClick={() => onGoToTab?.('players')}
        />
        <StatCard 
          item={{ 
            label: 'نسبة الانضباط', 
            value: '94%', 
            change: '+2%', 
            color: 'bg-emerald-600', 
            icon: <Activity size={24} /> 
          }} 
          onClick={() => onGoToTab?.('attendance')}
        />
        {isAdmin && (
          <StatCard 
            item={{ 
              label: 'إيرادات الشهر', 
              value: '45.2K ر.س', 
              change: '+8%', 
              color: 'bg-amber-500', 
              icon: <DollarSign size={24} /> 
            }} 
            onClick={() => onGoToTab?.('finance')}
          />
        )}
        <StatCard 
          item={{ 
            label: 'الفرق النشطة', 
            value: '10', 
            change: '+1', 
            color: 'bg-purple-600', 
            icon: <Trophy size={24} /> 
          }} 
          onClick={() => onGoToTab?.('teams')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-fit">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner"><Activity size={24} /></div>
              <h3 className="text-xl font-black text-gray-800 tracking-tighter">نسب الحضور الأسبوعية</h3>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] font-bold text-gray-400">محدث سحابياً</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: '900'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                />
                <Bar dataKey="attendance" fill={COLORS.primary} radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4 text-blue-600">
                <div className="p-3 bg-blue-50 rounded-2xl shadow-inner"><DollarSign size={24} /></div>
                <h3 className="text-xl font-black text-gray-800 tracking-tighter">تحليل التدفق المالي</h3>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                إدارة فقط
              </div>
            </div>
            <div className="h-80 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: '900'}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>
        )}

        {isCoach && (
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                 <ListChecks className="text-emerald-600" />
                 قائمة مهام المدرب
              </h3>
              <div className="space-y-4">
                 {[
                   { id: 'attendance', t: 'رصد غياب حصة اليوم (فريق الصقور)', d: '05:00 م', done: false },
                   { id: 'performance', t: 'تحديث تقييم اللاعب فيصل الغامدي', d: 'عاجل', done: false },
                   { id: 'communication', t: 'إرسال خطة التدريب الأسبوعية للأهالي', d: 'غداً', done: false },
                 ].map((task, i) => (
                   <div key={i} className={`p-6 rounded-[1.8rem] border flex items-center justify-between transition-all group ${task.done ? 'bg-gray-50 opacity-60' : 'bg-white hover:border-emerald-200 hover:shadow-xl'}`}>
                      <div className="flex items-center gap-4">
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 group-hover:border-emerald-500'}`}>
                            {task.done && <CheckCircle2 size={14} />}
                         </div>
                         <div>
                            <p className={`text-sm font-black ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.t}</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{task.d}</p>
                         </div>
                      </div>
                      {!task.done && (
                        <button 
                          onClick={() => onGoToTab?.(task.id, task.id === 'communication' ? { target: 'PARENTS' } : undefined)}
                          className="text-[10px] font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          انتقال للمهمة ←
                        </button>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
