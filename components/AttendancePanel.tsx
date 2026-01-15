
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  Lock,
  ChevronDown,
  BellRing,
  Smartphone,
  AlertTriangle,
  History,
  FileJson,
  UserCheck,
  CalendarDays,
  ShieldAlert,
  MessageSquareWarning,
  Send,
  UserX,
  Loader2,
  Database,
  X,
  Clock,
  Check,
  CheckCheck,
  FileSpreadsheet,
  BarChart3,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Cloud
} from 'lucide-react';
import { TEAMS } from '../constants';
import { subscribeToPlayers, saveAttendanceRecord } from '../services/playerService';

interface AttendancePanelProps {
  restrictedTeam?: string;
}

// محاكاة لسجل غياب الأمس لتمكين ميزة "يومين متتاليين"
const MOCK_YESTERDAY_ABSENTEES = ['1', '3', '7', '12', '18'];

// بيانات محاكاة لسجل التنبيهات المرسلة سابقاً
const MOCK_ALERT_LOGS = [
  { id: 'L1', player: 'أحمد العتيبي', team: 'فريق الصقور', type: 'إنذار ثاني', date: '2024-05-18', time: '05:30 م', status: 'delivered' },
  { id: 'L2', player: 'خالد محمد', team: 'فريق النمور', type: 'إخطار غياب', date: '2024-05-18', time: '06:15 م', status: 'read' },
  { id: 'L3', player: 'سلمان الفرج', team: 'فريق الصقور', type: 'إنذار نهائي', date: '2024-05-17', time: '05:05 م', status: 'delivered' },
  { id: 'L4', player: 'نواف العقيدي', team: 'فريق النجوم', type: 'إخطار غياب', date: '2024-05-17', time: '08:45 م', status: 'failed' },
];

const AttendancePanel: React.FC<AttendancePanelProps> = ({ restrictedTeam }) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'monthly'>('daily');
  const [selectedTeam, setSelectedTeam] = useState(restrictedTeam || TEAMS[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // لفلترة الشهر في التقرير الشهري
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'excused'>>({});
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [activeAction, setActiveAction] = useState<'notifying' | 'updating' | 'alerting' | null>(null);
  const [showToast, setShowToast] = useState<{show: boolean, msg: string, type: 'success' | 'warning' | 'info' | 'critical'}>({show: false, msg: '', type: 'success'});

  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  useEffect(() => {
    const unsubscribe = subscribeToPlayers((data) => {
      setAllPlayers(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (restrictedTeam) {
      setSelectedTeam(restrictedTeam);
    }
    setAttendance({});
    setIsArchived(false);
  }, [restrictedTeam, selectedTeam, selectedDate]);

  const teamPlayers = allPlayers.filter(p => p.team === selectedTeam);

  const atRiskPlayers = teamPlayers.filter(p => 
    attendance[p.id] === 'absent' && MOCK_YESTERDAY_ABSENTEES.includes(p.id)
  );

  const handleToggle = (id: string, status: 'present' | 'absent' | 'excused') => {
    if (isArchived) return;
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const triggerToast = (msg: string, type: 'success' | 'warning' | 'info' | 'critical' = 'success') => {
    setShowToast({ show: true, msg, type });
    setTimeout(() => setShowToast({ show: false, msg: '', type: 'success' }), 5000);
  };

  const handleApproveFinalAttendance = async () => {
    const totalMarked = Object.keys(attendance).length;
    if (totalMarked < teamPlayers.length * 0.1) {
      triggerToast("يرجى تحضير اللاعبين أولاً قبل عملية الأرشفة والاعتماد.", "warning");
      return;
    }

    setIsSaving(true);
    
    try {
      await saveAttendanceRecord(selectedDate, selectedTeam, attendance);
      const riskCount = atRiskPlayers.length;
      setIsSaving(false);
      setIsArchived(true);
      
      if (riskCount > 0) {
        triggerToast(
          `تمت أرشفة الكشف بنجاح! تم رصد ${riskCount} حالات غياب متكرر وإرسال تحذيرات "اليوم الثاني" آلياً لأولياء أمورهم.`,
          "critical"
        );
      } else {
        triggerToast(`تم اعتماد وأرشفة كشف حضور فريق ${selectedTeam} ليوم ${selectedDate}.`, "success");
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setIsSaving(false);
      triggerToast("فشلت عملية الأرشفة، يرجى التحقق من الاتصال بالإنترنت.", "critical");
    }
  };

  const handleIndividualWarning = (playerName: string) => {
    triggerToast(`جاري إرسال تحذير مخصص لولي أمر اللاعب: ${playerName}`, "info");
    setTimeout(() => {
      triggerToast(`تم تسليم تحذير الغياب المتكرر لـ ${playerName} بنجاح.`, "success");
    }, 1500);
  };

  const handleWhatsappNotifications = () => {
    const absentees = teamPlayers.filter(p => attendance[p.id] === 'absent').length;
    if (absentees === 0) {
      triggerToast("لا يوجد غيابات لإرسال إخطارات بشأنها.", "info");
      return;
    }
    setActiveAction('notifying');
    setTimeout(() => {
      setActiveAction(null);
      triggerToast(`تم إرسال رسائل إخطار يومية لأولياء أمور ${absentees} لاعب غائب.`, "success");
    }, 1800);
  };

  const filteredLogs = MOCK_ALERT_LOGS.filter(log => 
    log.player.includes(logSearchQuery) || log.team.includes(logSearchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right relative" dir="rtl">
      {/* Sub-Tab Navigation */}
      <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm flex gap-2 w-fit mb-4">
        <button 
          onClick={() => setActiveSubTab('daily')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeSubTab === 'daily' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <Calendar size={18} />
          التحضير اليومي
        </button>
        <button 
          onClick={() => setActiveSubTab('monthly')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeSubTab === 'monthly' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <BarChart3 size={18} />
          التقرير الشهري
        </button>
      </div>

      {activeSubTab === 'daily' ? (
        <>
          {/* Logs Review Modal */}
          {isLogsModalOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xl animate-in fade-in">
              <div className="bg-white w-full max-w-3xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                <div className="p-10 border-b border-gray-100 bg-red-50/30 flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-lg">
                      <BellRing size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-800 tracking-tighter">سجل مراجعة التنبيهات</h3>
                      <p className="text-xs text-red-600 font-bold mt-1 uppercase tracking-widest">أرشيف الإنذارات المرسلة عبر النظام</p>
                    </div>
                  </div>
                  <button onClick={() => setIsLogsModalOpen(false)} className="p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
                    <X size={32} />
                  </button>
                </div>

                <div className="p-8 bg-gray-50 border-b border-gray-100">
                   <div className="relative">
                     <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                     <input 
                      type="text" 
                      placeholder="ابحث باسم اللاعب أو الفريق في الأرشيف..."
                      className="w-full pr-12 pl-6 py-4 bg-white border border-gray-200 rounded-[1.8rem] outline-none font-bold text-sm shadow-inner focus:ring-4 focus:ring-red-500/5 transition-all"
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                     />
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar">
                   {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                     <div key={log.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xl shadow-inner group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                              {log.player.charAt(0)}
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-lg font-black text-gray-800 leading-none">{log.player}</h4>
                                <span className="text-[10px] bg-red-50 text-red-600 px-3 py-0.5 rounded-full font-black border border-red-100">{log.type}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                 <p className="flex items-center gap-1"><Database size={10}/> {log.team}</p>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                 <p className="flex items-center gap-1"><Calendar size={10}/> {log.date}</p>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                 <p className="flex items-center gap-1"><Clock size={10}/> {log.time}</p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="text-left">
                           <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                             log.status === 'read' ? 'bg-blue-50 text-blue-600' : 
                             log.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                           }`}>
                              {log.status === 'read' ? <CheckCheck size={14}/> : log.status === 'delivered' ? <Check size={14}/> : <XCircle size={14}/>}
                              {log.status === 'read' ? 'تمت القراءة' : log.status === 'delivered' ? 'تم التسليم' : 'فشل التسليم'}
                           </div>
                           <p className="text-[9px] text-gray-400 mt-1 font-bold">عبر بوابة الواتساب</p>
                        </div>
                     </div>
                   )) : (
                     <div className="py-20 text-center space-y-4">
                        <Search size={64} className="mx-auto text-gray-100" />
                        <p className="text-gray-400 font-black text-xl">لم يتم العثور على نتائج في الأرشيف</p>
                     </div>
                   )}
                </div>

                <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                   <button onClick={() => setIsLogsModalOpen(false)} className="px-10 py-4 bg-gray-800 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">إغلاق السجل</button>
                </div>
              </div>
            </div>
          )}

          {showToast.show && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] animate-in fade-in slide-in-from-top-4">
              <div className={`
                ${showToast.type === 'success' ? 'bg-emerald-600' : 
                  showToast.type === 'warning' ? 'bg-amber-600' : 
                  showToast.type === 'critical' ? 'bg-red-700 shadow-red-200' : 'bg-blue-600'} 
                text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-4 font-black border border-white/20 max-w-lg
              `}>
                {showToast.type === 'success' ? <CheckCircle2 size={28} /> : 
                showToast.type === 'warning' ? <AlertTriangle size={28} /> : 
                showToast.type === 'critical' ? <ShieldAlert size={32} className="animate-pulse" /> : <MessageSquareWarning size={28} />}
                <p className="leading-relaxed">{showToast.msg}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <CalendarDays size={18} className="text-emerald-600" />
                  إعدادات الكشف
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">تاريخ التحضير</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      disabled={isArchived}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">الفريق المستهدف</label>
                  <div className="relative">
                    <select 
                      disabled={!!restrictedTeam || isArchived}
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className={`w-full pr-4 pl-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-sm font-bold appearance-none ${restrictedTeam || isArchived ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:border-emerald-300'}`}
                    >
                      {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      {restrictedTeam || isArchived ? <Lock size={16} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {isArchived && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in zoom-in-95">
                    <Database className="text-emerald-600" size={18} />
                    <span className="text-xs font-black text-emerald-800">تمت أرشفة سجل اليوم</span>
                  </div>
                )}
              </div>

              <div className={`p-8 rounded-[3rem] transition-all duration-700 relative overflow-hidden ${atRiskPlayers.length > 0 ? 'bg-red-50 border-2 border-red-200 shadow-2xl shadow-red-100/50' : 'bg-white border border-gray-100 opacity-60'}`}>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h4 className={`font-black text-sm flex items-center gap-2 ${atRiskPlayers.length > 0 ? 'text-red-800' : 'text-gray-400'}`}>
                    <ShieldAlert size={20} className={atRiskPlayers.length > 0 ? 'animate-pulse' : ''} />
                    رصد غياب اليوم الثاني
                  </h4>
                  {atRiskPlayers.length > 0 && (
                    <span className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-black animate-bounce shadow-lg">
                      تنبيه آلي نشط
                    </span>
                  )}
                </div>
                
                {atRiskPlayers.length > 0 ? (
                  <div className="space-y-6 relative z-10">
                    <div className="p-4 bg-white/60 rounded-2xl border border-red-100 text-xs font-bold text-red-900 leading-relaxed">
                      سيقوم النظام بإرسال تحذيرات تلقائية لهؤلاء اللاعبين بمجرد الضغط على <b>اعتماد التحضير</b>.
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                      {atRiskPlayers.map(p => (
                        <div key={p.id} className="bg-white p-3 rounded-2xl border border-red-100 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-xs font-black shadow-lg">
                              {p.fullName?.charAt(0)}
                            </div>
                            <span className="text-xs font-black text-gray-800 truncate max-w-[80px]">{p.fullName?.split(' ')[0]}</span>
                          </div>
                          {!isArchived && (
                            <button 
                              onClick={() => handleIndividualWarning(p.fullName)}
                              className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Send size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                      <CheckCircle2 size={32} className="text-gray-200" />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold">لا توجد غيابات متكررة حالياً</p>
                  </div>
                )}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50/30">
                  <div className="flex items-center gap-5">
                    <div className={`p-5 rounded-[1.8rem] shadow-inner ${isArchived ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isArchived ? <Database size={32} /> : <UserCheck size={32} />}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-800 tracking-tighter">
                        {isArchived ? 'سجل مؤرشف ومعتمد' : 'كشف حضور الفريق'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${isArchived ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {Object.keys(attendance).length} لاعبين تم رصدهم
                        </p>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedDate}</p>
                      </div>
                    </div>
                  </div>

                  {!isArchived && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handleApproveFinalAttendance}
                        disabled={isSaving || isLoading}
                        className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 text-base"
                      >
                        {isSaving ? <RefreshCw className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                        اعتماد وأرشفة السجل
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest">
                        <th className="px-10 py-8">اللاعب</th>
                        <th className="px-6 py-8 text-center">حاضر</th>
                        <th className="px-6 py-8 text-center">غائب</th>
                        <th className="px-6 py-8 text-center">بعذر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="p-40 text-center">
                            <Loader2 className="animate-spin mx-auto text-emerald-500 mb-4" size={48} />
                            <p className="text-sm font-bold text-gray-400">مزامنة سجلات الحضور...</p>
                          </td>
                        </tr>
                      ) : teamPlayers.length > 0 ? teamPlayers.map(player => {
                        const isAtRisk = MOCK_YESTERDAY_ABSENTEES.includes(player.id);
                        const isMarkedAbsent = attendance[player.id] === 'absent';
                        const isCritical = isMarkedAbsent && isAtRisk;
                        
                        return (
                          <tr key={player.id} className={`transition-all duration-300 group ${isCritical ? 'bg-red-50/60' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-5">
                                <div className="relative">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all border ${isCritical ? 'bg-red-600 text-white border-red-500 scale-110 shadow-xl shadow-red-200' : 'bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 border-gray-100'}`}>
                                    {player.fullName?.charAt(0)}
                                  </div>
                                  {isAtRisk && (
                                    <div className={`absolute -top-2 -right-2 p-1.5 rounded-full border-2 border-white shadow-lg animate-pulse ${isMarkedAbsent ? 'bg-red-600 text-white' : 'bg-amber-50 text-white'}`}>
                                      <AlertTriangle size={12} />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-black text-gray-800 text-lg leading-none mb-2">{player.fullName}</p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{player.level}</span>
                                    {isAtRisk && (
                                      <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-tighter ${isMarkedAbsent ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
                                        {isMarkedAbsent ? 'تنبيه: غياب لليوم الثاني' : 'كان غائباً بالأمس'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-center">
                              <button 
                                disabled={isArchived}
                                onClick={() => handleToggle(player.id, 'present')}
                                className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center mx-auto transition-all ${
                                  attendance[player.id] === 'present' 
                                  ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200' 
                                  : 'bg-gray-50 text-gray-300 hover:bg-emerald-100 hover:text-emerald-600 border border-gray-100'
                                } ${isArchived ? 'cursor-default opacity-90' : ''}`}
                              >
                                <UserCheck size={28} />
                              </button>
                            </td>
                            <td className="px-6 py-6 text-center">
                              <button 
                                disabled={isArchived}
                                onClick={() => handleToggle(player.id, 'absent')}
                                className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center mx-auto transition-all ${
                                  attendance[player.id] === 'absent' 
                                  ? 'bg-red-600 text-white shadow-2xl shadow-red-200' 
                                  : 'bg-gray-50 text-gray-300 hover:bg-red-100 hover:text-red-600 border border-gray-100'
                                } ${isArchived ? 'cursor-default opacity-90' : ''}`}
                              >
                                <UserX size={28} />
                              </button>
                            </td>
                            <td className="px-6 py-6 text-center">
                              <button 
                                disabled={isArchived}
                                onClick={() => handleToggle(player.id, 'excused')}
                                className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center mx-auto transition-all ${
                                  attendance[player.id] === 'excused' 
                                  ? 'bg-amber-50 text-white shadow-2xl shadow-amber-200' 
                                  : 'bg-gray-50 text-gray-300 hover:bg-amber-100 hover:text-amber-50 border border-gray-100'
                                } ${isArchived ? 'cursor-default opacity-90' : ''}`}
                              >
                                <AlertCircle size={28} />
                              </button>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={4} className="p-40 text-center">
                            <Search size={64} className="mx-auto text-gray-100 mb-6" />
                            <p className="text-gray-400 font-black text-xl">لا يوجد لاعبين في هذا الفريق</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {teamPlayers.length > 0 && (
                  <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-6">
                      <div className={`p-5 rounded-3xl border shadow-sm group hover:rotate-6 transition-transform ${isArchived ? 'bg-blue-600 text-white border-blue-400' : 'bg-white border-gray-100 text-emerald-600'}`}>
                        {isArchived ? <Cloud size={40} /> : <History size={40} />}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-gray-800 tracking-tight">
                            {isArchived ? 'تمت أرشفة البيانات سحابياً' : 'إتمام رصد الحصة التدريبية'}
                        </p>
                        <p className="text-xs text-gray-500 font-bold max-w-sm">
                            {isArchived 
                              ? `هذا السجل محفوظ ليوم ${selectedDate} ولا يمكن تعديله.` 
                              : 'سيتم إغلاق الكشف، مزامنة البيانات، وحفظ السجل اليومي في الأرشيف.'}
                        </p>
                      </div>
                    </div>
                    {!isArchived && (
                      <button 
                        onClick={handleApproveFinalAttendance}
                        disabled={isSaving || isLoading}
                        className="w-full lg:w-auto flex items-center justify-center gap-4 px-16 py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-2 transition-all active:scale-95 disabled:opacity-50 text-xl border-b-4 border-emerald-800"
                      >
                        {isSaving ? <RefreshCw className="animate-spin" size={32} /> : <><Cloud size={32} /> اعتماد وأرشفة اليوم</>}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                <button 
                  onClick={handleWhatsappNotifications}
                  disabled={activeAction === 'notifying' || !isArchived}
                  className={`p-8 bg-white border border-gray-100 rounded-[2.5rem] flex items-center gap-6 transition-all group ${!isArchived ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-emerald-500 hover:shadow-2xl'}`}
                >
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                    <Smartphone size={32}/>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">إخطار يومي</p>
                    <p className="text-xs text-gray-400 font-bold">إبلاغ أولياء الأمور بالحالة</p>
                  </div>
                </button>

                <button 
                  onClick={() => triggerToast("جاري تصدير ملف PDF للكشف المعتمد...", "info")}
                  className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex items-center gap-6 hover:border-blue-500 hover:shadow-2xl transition-all group"
                >
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <FileJson size={32}/>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">تصدير الكشف</p>
                    <p className="text-xs text-gray-400 font-bold">حفظ بصيغة Excel/PDF</p>
                  </div>
                </button>

                <button 
                  onClick={() => setIsLogsModalOpen(true)}
                  className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex items-center gap-6 hover:border-red-500 hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
                    <BellRing size={32}/>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800 uppercase tracking-widest mb-1">سجل التنبيهات</p>
                    <p className="text-xs text-gray-400 font-bold">مراجعة الإنذارات المرسلة</p>
                  </div>
                  {atRiskPlayers.length > 0 && !isArchived && (
                    <div className="absolute top-4 left-4 w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Monthly Report View */
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 pb-20">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.8rem] flex items-center justify-center shadow-inner">
                <FileSpreadsheet size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-800">التقرير الشهري للانضباط</h2>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">متابعة الأداء الشهري لفريق {selectedTeam}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
               <button onClick={() => setSelectedMonth(m => (m === 0 ? 11 : m - 1))} className="p-2 hover:bg-white hover:text-blue-600 rounded-xl transition-all shadow-sm"><ChevronRight size={20}/></button>
               <span className="px-6 font-black text-gray-700 min-w-[120px] text-center">{months[selectedMonth]} {selectedYear}</span>
               <button onClick={() => setSelectedMonth(m => (m === 11 ? 0 : m + 1))} className="p-2 hover:bg-white hover:text-blue-600 rounded-xl transition-all shadow-sm"><ChevronLeft size={20}/></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">متوسط حضور الفريق</p>
                <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">88.5%</h3>
                <div className="mt-4 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[88.5%] rounded-full"></div>
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">إجمالي الغيابات</p>
                <h3 className="text-4xl font-black text-red-600 tracking-tighter">14 <span className="text-sm font-bold opacity-30">حالة</span></h3>
                <p className="text-xs text-gray-400 font-bold mt-2 flex items-center gap-1"><TrendingDown size={14} className="text-red-500"/> زيادة 2% عن الشهر الماضي</p>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
                   <Download size={20} />
                   تحميل التقرير الكامل (Excel)
                </button>
             </div>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-right border-collapse">
                 <thead>
                   <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] text-gray-400 uppercase font-black tracking-widest">
                     <th className="px-10 py-8">اسم اللاعب</th>
                     <th className="px-6 py-8 text-center">أيام الحضور</th>
                     <th className="px-6 py-8 text-center">أيام الغياب</th>
                     <th className="px-6 py-8 text-center">أيام العذر</th>
                     <th className="px-6 py-8 text-center">نسبة الالتزام</th>
                     <th className="px-10 py-8 text-center">إجراء</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {teamPlayers.length > 0 ? teamPlayers.map(player => {
                     // محاكاة إحصائيات شهرية
                     const present = Math.floor(Math.random() * 5) + 12;
                     const absent = Math.floor(Math.random() * 3);
                     const excused = Math.floor(Math.random() * 2);
                     const rate = Math.round((present / (present + absent + excused)) * 100);

                     return (
                       <tr key={player.id} className="hover:bg-gray-50 transition-all group">
                         <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                               {player.fullName?.charAt(0)}
                             </div>
                             <span className="font-black text-gray-800">{player.fullName}</span>
                           </div>
                         </td>
                         <td className="px-6 py-6 text-center">
                           <span className="font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{present}</span>
                         </td>
                         <td className="px-6 py-6 text-center">
                           <span className={`font-black px-4 py-2 rounded-xl border ${absent > 2 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>{absent}</span>
                         </td>
                         <td className="px-6 py-6 text-center">
                           <span className="font-black text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">{excused}</span>
                         </td>
                         <td className="px-6 py-6 text-center">
                           <div className="flex flex-col items-center gap-1.5">
                              <span className={`text-sm font-black ${rate < 75 ? 'text-red-600' : 'text-emerald-600'}`}>{rate}%</span>
                              <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${rate < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${rate}%`}}></div>
                              </div>
                           </div>
                         </td>
                         <td className="px-10 py-6 text-center">
                            <button className="p-3 bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all shadow-sm">
                               <Smartphone size={18}/>
                            </button>
                         </td>
                       </tr>
                     );
                   }) : (
                     <tr>
                        <td colSpan={6} className="p-40 text-center">
                          <BarChart3 size={64} className="mx-auto text-gray-100 mb-6" />
                          <p className="text-gray-400 font-black text-xl">لا توجد بيانات لهذا الشهر</p>
                        </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePanel;
