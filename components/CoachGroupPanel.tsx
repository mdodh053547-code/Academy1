
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  MessageSquare, 
  ClipboardCheck, 
  BrainCircuit, 
  Shield, 
  Edit3, 
  Star,
  Zap,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { MOCK_COACHES, COLORS } from '../constants';
import { subscribeToPlayers } from '../services/playerService';

interface CoachGroupPanelProps {
  coachId: string;
  onGoToAttendance?: () => void;
  onGoToPerformance?: () => void;
}

const CoachGroupPanel: React.FC<CoachGroupPanelProps> = ({ coachId, onGoToAttendance, onGoToPerformance }) => {
  const coach = MOCK_COACHES.find(c => c.id === coachId) || MOCK_COACHES[0];
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPlayers((data) => {
      setAllPlayers(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const myPlayers = allPlayers.filter(p => p.team === coach.team);

  // حالات ديناميكية للنسب المئوية
  const [teamDiscipline, setTeamDiscipline] = useState(parseInt(coach.attendance));
  const [passingAccuracy, setPassingAccuracy] = useState(75);
  const [staminaLevel, setStaminaLevel] = useState(90);
  const [tacticalAwareness, setTacticalAwareness] = useState(60);
  
  const [isActing, setIsActing] = useState<'boosting' | 'disciplining' | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'warning' } | null>(null);

  const handleUpdateTeamStats = (action: 'up' | 'down') => {
    if (isActing) return;
    
    setIsActing(action === 'up' ? 'boosting' : 'disciplining');
    const factor = action === 'up' ? 1 : -1;
    const changeAmount = action === 'up' ? 2 : -2;

    setTimeout(() => {
      setTeamDiscipline(prev => Math.max(0, Math.min(prev + changeAmount, 100)));
      setPassingAccuracy(prev => Math.max(0, Math.min(prev + (factor * 1), 100)));
      setStaminaLevel(prev => Math.max(0, Math.min(prev + (factor * 1), 100)));
      setTacticalAwareness(prev => Math.max(0, Math.min(prev + (factor * 1), 100)));
      
      setIsActing(null);
      setToastMessage({
        text: action === 'up' ? 'كفو! تم رفع الروح المعنوية للفريق' : 'تم تنبيه الفريق ومراجعة الانضباط',
        type: action === 'up' ? 'success' : 'warning'
      });
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 relative text-right" dir="rtl">
      
      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 ${
            toastMessage.type === 'success' 
            ? 'bg-emerald-500 text-white border-emerald-400' 
            : 'bg-red-500 text-white border-red-400'
          }`}>
            {toastMessage.type === 'success' ? <Zap size={24} className="fill-white" /> : <AlertTriangle size={24} />}
            <p className="font-bold text-lg">{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* Group Header Info */}
      <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border-b-8 border-emerald-500">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold text-emerald-950 text-xl shadow-lg">
                {coach.name.charAt(7)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider">المدرب المسؤول</span>
                  <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                    <Shield size={10} />
                    {(coach as any).category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mt-1">{coach.team}</h1>
              </div>
            </div>
            <p className="text-emerald-100/70 mr-14">أهلاً بك كابتن {coach.name.split(' ')[1]}، تخصصك في ({coach.specialty}) يرفع مستوى الفريق.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl text-center border border-white/10 min-w-[130px]">
              <p className="text-[10px] text-emerald-200 uppercase mb-1 font-bold">عدد لاعبيك (سحابي)</p>
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto text-emerald-400" size={24} />
              ) : (
                <p className="text-3xl font-black">{myPlayers.length}</p>
              )}
            </div>
            <div className={`bg-white/10 backdrop-blur-md p-5 rounded-2xl text-center border border-white/10 min-w-[130px] transition-all duration-500 ${isActing ? 'scale-110' : ''} ${isActing === 'disciplining' ? 'border-red-400 bg-red-500/10' : ''}`}>
              <p className="text-[10px] text-emerald-200 uppercase mb-1 font-bold">انضباط الفريق</p>
              <p className={`text-3xl font-black transition-colors ${isActing === 'disciplining' ? 'text-red-400' : ''}`}>{teamDiscipline}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
              <ClipboardCheck className="text-emerald-600" size={20} />
              إدارة الأداء الفوري
            </h3>
            
            <button 
              onClick={onGoToAttendance}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
            >
              <Calendar size={18} />
              تحضير اللاعبين اليوم
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleUpdateTeamStats('up')}
                disabled={!!isActing}
                className={`py-4 rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 ${isActing === 'boosting' ? 'bg-amber-100 text-amber-600' : 'bg-amber-400 text-amber-950 hover:bg-amber-500 shadow-amber-100'}`}
              >
                {isActing === 'boosting' ? (
                  <Loader2 className="animate-spin text-amber-600" size={20} />
                ) : (
                  <>
                    <Zap size={18} className="fill-amber-950" />
                    <span className="text-xs">تحفيز</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => handleUpdateTeamStats('down')}
                disabled={!!isActing}
                className={`py-4 rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 ${isActing === 'disciplining' ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-red-50'}`}
              >
                {isActing === 'disciplining' ? (
                  <Loader2 className="animate-spin text-red-600" size={20} />
                ) : (
                  <>
                    <TrendingDown size={18} />
                    <span className="text-xs">تنبيه</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-blue-600">
              <TrendingUp size={20} />
              <h3 className="font-bold">أهداف تطوير الفريق</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'دقة التمرير', val: passingAccuracy, color: 'bg-blue-500' },
                { label: 'اللياقة البدنية', val: staminaLevel, color: 'bg-emerald-500' },
                { label: 'الوعي التكتيكي', val: tacticalAwareness, color: 'bg-purple-500' }
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-600">{goal.label}</span>
                    <span className={`transition-all duration-500 ${isActing ? 'scale-110' : 'text-gray-900'} ${isActing === 'disciplining' ? 'text-red-500' : isActing === 'boosting' ? 'text-amber-500' : ''}`}>{goal.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${goal.color} ${isActing === 'disciplining' ? 'opacity-70' : ''}`} 
                      style={{width: `${goal.val}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Players List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-emerald-600" />
              <h3 className="text-lg font-bold">قائمة لاعبي {coach.team}</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-gray-50">
            {isLoading ? (
               <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500 mb-2" size={32} /><p className="text-sm text-gray-500">جاري تحميل القائمة السحابية...</p></div>
            ) : myPlayers.length > 0 ? myPlayers.map(player => (
              <div key={player.id} className="p-5 flex items-center justify-between hover:bg-emerald-50/30 transition-colors group">
                <div className="flex items-center gap-4">
                  {player.personalPhotoUrl ? (
                    <img src={player.personalPhotoUrl} className="w-12 h-12 rounded-2xl object-cover border border-emerald-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                      {player.fullName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-800">{player.fullName}</p>
                      {player.level === 'متقدم' && <Star size={12} className="text-amber-500 fill-amber-500" />}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">{player.ageGroup} • {player.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-left hidden md:block">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">الانضباط الفردي</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                          style={{width: `${player.attendanceRate || 0}%`}}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-gray-700">{player.attendanceRate || 0}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={onGoToPerformance}
                      className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto opacity-50">
                  <Users size={40} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">لا يوجد لاعبين مسجلين في هذا الفريق حالياً</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachGroupPanel;
