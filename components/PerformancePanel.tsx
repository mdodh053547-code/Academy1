
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Zap, 
  BrainCircuit, 
  Search, 
  Save, 
  Edit3, 
  CheckCircle2,
  Sparkles,
  RefreshCcw,
  Loader2,
  // Fix: add missing icon imports from lucide-react
  Trophy,
  Users,
  Clock,
  Shield
} from 'lucide-react';
import { COLORS } from '../constants';
import { getPlayerInsights } from '../services/geminiService';
import { subscribeToPlayers, updatePlayerProfile } from '../services/playerService';

interface PerformancePanelProps {
  restrictedTeam?: string;
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({ restrictedTeam }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // مهارات اللاعب القابلة للتعديل
  const [metrics, setMetrics] = useState({
    dribbling: 85,
    passing: 70,
    stamina: 90,
    tactical: 65,
    shooting: 80,
    discipline: 95
  });

  const [aiReport, setAiReport] = useState<string>('');

  // مزامنة البيانات السحابية
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToPlayers((data) => {
      // فقط اللاعبين المقبولين (active)
      const activePlayers = data.filter(p => p.status === 'active');
      const filtered = restrictedTeam 
        ? activePlayers.filter(p => p.team === restrictedTeam)
        : activePlayers;
      
      setPlayers(filtered);
      
      // اختيار أول لاعب في القائمة تلقائياً إذا لم يتم اختيار أحد
      if (filtered.length > 0 && !selectedPlayer) {
        setSelectedPlayer(filtered[0]);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [restrictedTeam]);

  // تحديث البيانات عند اختيار لاعب جديد
  useEffect(() => {
    if (selectedPlayer) {
      const pMetrics = selectedPlayer.metrics || {
        dribbling: 75,
        passing: 70,
        stamina: 80,
        tactical: 60,
        shooting: 75,
        discipline: 90
      };
      
      // تحويل القيم من 0-10 إلى 0-100 للعرض
      setMetrics({
        dribbling: pMetrics.dribbling * 10 || 75,
        passing: pMetrics.passing * 10 || 70,
        stamina: pMetrics.stamina * 10 || 80,
        tactical: pMetrics.tactical * 10 || 60,
        shooting: pMetrics.shooting * 10 || 75,
        discipline: pMetrics.discipline * 10 || 90
      });
      setAiReport('');
      setIsEditing(false);
    }
  }, [selectedPlayer]);

  const radarData = [
    { subject: 'المراوغة', A: metrics.dribbling, fullMark: 100 },
    { subject: 'التمرير', A: metrics.passing, fullMark: 100 },
    { subject: 'اللياقة', A: metrics.stamina, fullMark: 100 },
    { subject: 'التكتيك', A: metrics.tactical, fullMark: 100 },
    { subject: 'التسديد', A: metrics.shooting, fullMark: 100 },
    { subject: 'الانضباط', A: metrics.discipline, fullMark: 100 },
  ];

  const handleMetricChange = (key: keyof typeof metrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAssessment = async () => {
    if (!selectedPlayer) return;
    setIsSaving(true);
    try {
      // تحويل القيم مرة أخرى إلى 0-10 للتخزين
      const updatedMetrics = {
        dribbling: metrics.dribbling / 10,
        passing: metrics.passing / 10,
        stamina: metrics.stamina / 10,
        tactical: metrics.tactical / 10,
        shooting: metrics.shooting / 10,
        discipline: metrics.discipline / 10
      };
      
      await updatePlayerProfile(selectedPlayer.id, { metrics: updatedMetrics });
      
      setIsSaving(false);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      alert("حدث خطأ أثناء حفظ التقييم");
      setIsSaving(false);
    }
  };

  const generateAiInsight = async () => {
    if (!selectedPlayer) return;
    setIsGeneratingAi(true);
    const report = await getPlayerInsights({
      name: selectedPlayer.fullName,
      ageGroup: selectedPlayer.ageGroup,
      metrics: {
        dribbling: metrics.dribbling / 10,
        passing: metrics.passing / 10,
        stamina: metrics.stamina / 10
      }
    });
    setAiReport(report);
    setIsGeneratingAi(false);
  };

  const filteredList = players.filter(p => 
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 font-black">
            <CheckCircle2 size={24} />
            تم تحديث تقييم اللاعب وحفظه سحابياً!
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Player Selection Sidebar */}
        <div className="w-full md:w-80 space-y-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest">قائمة اللاعبين</h3>
               <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-1 rounded-md font-black">
                 {restrictedTeam || 'كل الأكاديمية'}
               </span>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن لاعب..." 
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-xs font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 max-h-[500px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-12 text-center text-gray-400">
                <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                <p className="text-[10px] font-bold">جاري المزامنة...</p>
              </div>
            ) : filteredList.length > 0 ? (
              filteredList.map(player => (
                <button 
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`w-full p-5 flex items-center gap-4 transition-all ${selectedPlayer?.id === player.id ? 'bg-emerald-50 border-r-8 border-r-emerald-600' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center font-black text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                    {player.fullName?.charAt(0)}
                  </div>
                  <div className="text-right flex-1 overflow-hidden">
                    <p className="text-sm font-black text-gray-800 leading-none mb-1.5 truncate">{player.fullName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">{player.team} • {player.ageGroup}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-20 text-center text-gray-300 italic font-bold">لا يوجد لاعبين</div>
            )}
          </div>
        </div>

        {/* Performance Details */}
        <div className="flex-1 space-y-8">
          {selectedPlayer ? (
            <>
              {/* Top Profile Card */}
              <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden border-b-8 border-emerald-500">
                <div className="relative z-10 flex items-center gap-8 text-right w-full md:w-auto">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border-4 border-white/10 text-4xl font-black shrink-0 shadow-2xl">
                    {selectedPlayer.fullName?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h2 className="text-3xl font-black leading-tight">{selectedPlayer.fullName}</h2>
                       <div className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {selectedPlayer.level}
                       </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-emerald-200 text-sm">
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <Trophy size={14} />
                        <span className="font-bold">{selectedPlayer.team}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <Users size={14} />
                        <span className="font-bold">{selectedPlayer.ageGroup}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center gap-4 w-full md:w-auto justify-end">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-4 bg-white text-emerald-950 rounded-2xl font-black text-sm shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-3 active:scale-95"
                    >
                      <Edit3 size={20} />
                      تعديل التقييم الفني
                    </button>
                  ) : (
                    <div className="flex gap-4">
                       <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all"
                      >
                        إلغاء
                      </button>
                      <button 
                        onClick={handleSaveAssessment}
                        disabled={isSaving}
                        className="px-10 py-4 bg-emerald-400 text-emerald-950 rounded-2xl font-black text-sm shadow-2xl hover:bg-emerald-300 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                      >
                        {isSaving ? <RefreshCcw size={20} className="animate-spin" /> : <Save size={20} />}
                        حفظ التقييم السحابي
                      </button>
                    </div>
                  )}
                </div>
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Stats & Sliders */}
                <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                        <Target size={28} />
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter">توزيع المهارات</h3>
                    </div>
                    {isEditing && (
                      <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100 animate-pulse uppercase tracking-widest">
                        وضع التعديل نشط
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-8 flex-1">
                      {(Object.keys(metrics) as Array<keyof typeof metrics>).map((key) => (
                        <div key={key} className="space-y-3">
                          <div className="flex justify-between items-center px-4">
                            <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
                              {key === 'dribbling' ? 'المراوغة' : 
                               key === 'passing' ? 'التمرير' : 
                               key === 'stamina' ? 'اللياقة البدنية' : 
                               key === 'tactical' ? 'الوعي التكتيكي' : 
                               key === 'shooting' ? 'التسديد' : 'الانضباط'}
                            </span>
                            <span className="text-emerald-600 font-black bg-emerald-50 px-3 py-1 rounded-xl text-sm border border-emerald-100 shadow-sm">{metrics[key]}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="10"
                            value={metrics[key]}
                            onChange={(e) => handleMetricChange(key, parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-emerald-600 shadow-inner"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-96 w-full flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#f1f5f9" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 13, fontWeight: '900'}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                          <Radar
                            name={selectedPlayer.fullName}
                            dataKey="A"
                            stroke={COLORS.primary}
                            fill={COLORS.primary}
                            fillOpacity={0.6}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Right Column: AI Insights */}
                <div className="bg-gray-900 p-10 rounded-[3.5rem] border border-gray-100 shadow-2xl border-t-[12px] border-t-purple-600 relative overflow-hidden flex flex-col group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-4 text-purple-400">
                      <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/20 shadow-inner">
                        <BrainCircuit size={32} />
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter text-white">تحليل Gemini AI</h3>
                    </div>
                    <button 
                      onClick={generateAiInsight}
                      disabled={isGeneratingAi}
                      className="p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-500 transition-all disabled:opacity-50 shadow-xl shadow-purple-900/50 group-hover:rotate-12"
                      title="تحديث التحليل الذكي"
                    >
                      <Sparkles size={24} className={isGeneratingAi ? 'animate-pulse' : ''} />
                    </button>
                  </div>

                  <div className="space-y-8 relative z-10 flex-1">
                    {isGeneratingAi ? (
                      <div className="space-y-6 animate-pulse py-10">
                        <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                        <div className="h-4 bg-white/5 rounded-full w-full"></div>
                        <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                        <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
                        <div className="flex gap-4 mt-12">
                          <div className="h-20 bg-white/5 rounded-[2rem] flex-1"></div>
                          <div className="h-20 bg-white/5 rounded-[2rem] flex-1"></div>
                        </div>
                      </div>
                    ) : aiReport ? (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/5 text-purple-100 leading-relaxed text-sm font-bold shadow-inner relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                          <p className="whitespace-pre-wrap">{aiReport}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                               <TrendingUp size={24} />
                            </div>
                            <div>
                              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">النمو الفني</p>
                              <p className="text-xs font-black text-white">تطور تكتيكي ملحوظ</p>
                            </div>
                          </div>
                          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all">
                            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                               <Award size={24} />
                            </div>
                            <div>
                              <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">الروح المعنوية</p>
                              <p className="text-xs font-black text-white">منضبط ومثالي</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border-4 border-dashed border-white/5 rounded-[3.5rem] bg-white/5">
                        <div className="w-24 h-24 bg-white/5 text-gray-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-all">
                          <Sparkles size={48} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-400 font-black text-xl tracking-tight">جاهز للتحليل الذكي</p>
                          <p className="text-xs text-gray-500 font-bold max-w-[200px] mx-auto leading-relaxed uppercase tracking-widest">اضغط على زر النجمة لإنشاء تقرير فني مدعوم بـ AI</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest relative z-10">
                    <span className="flex items-center gap-2">
                      <Clock size={12} />
                      آخر مزامنة: الآن
                    </span>
                    <span className="flex items-center gap-2">
                      <Shield size={12} className="text-emerald-500" />
                      بوابة المدرب المعتمدة
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-40 rounded-[4rem] border border-gray-100 text-center space-y-8 animate-in fade-in duration-1000">
               <div className="w-32 h-32 bg-gray-50 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-inner border border-gray-100">
                 <Users size={64} className="text-gray-200" />
               </div>
               <div className="space-y-2">
                 <p className="text-2xl font-black text-gray-800 tracking-tighter">ابدأ رحلة التقييم الفني</p>
                 <p className="text-sm text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">يرجى اختيار لاعب من القائمة الجانبية لعرض مهاراته، تحديث بياناته، والحصول على تقرير ذكي من Gemini AI.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformancePanel;
