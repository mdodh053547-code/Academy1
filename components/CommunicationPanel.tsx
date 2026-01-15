
import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  Smartphone, 
  Plus, 
  CheckCircle2, 
  RefreshCw,
  UserSearch,
  Check,
  X,
  Users,
  User,
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  UserCheck,
  Bell,
  GraduationCap,
  Contact2
} from 'lucide-react';
import { subscribeToPlayers } from '../services/playerService';
import { MOCK_COACHES } from '../constants';

type TargetAudience = 'PARENTS' | 'COACHES' | 'PLAYERS';

interface CommunicationPanelProps {
  params?: { playerId?: string };
}

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ params }) => {
  const [activeChannel, setActiveChannel] = useState<'الكل' | 'واتساب' | 'رسائل نصية' | 'إشعارات'>('الكل');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('PARENTS');
  const [sendMode, setSendMode] = useState<'group' | 'individual'>('group');
  const [messageText, setMessageText] = useState('');
  
  const [selectedIndividual, setSelectedIndividual] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [players, setPlayers] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'whatsapp' | 'sms'>('whatsapp');

  const [messages, setMessages] = useState([
    { id: 1, recipient: 'كل أولياء الأمور', type: 'whatsapp', content: 'نود تذكيركم بموعد التدريب القادم يوم السبت في تمام الـ 5 مساءً.', date: 'منذ ساعتين', status: 'sent' },
    { id: 2, recipient: 'كابتن صالح المحمدي', type: 'app', content: 'تم تحديث قائمة اللاعبين لفريق الصقور، يرجى مراجعة التقرير.', date: 'منذ 5 ساعات', status: 'read' },
    { id: 3, recipient: 'ولي أمر خالد محمد', type: 'sms', content: 'تنبيه: نلاحظ غياب خالد عن آخر تمرينين. نأمل التواصل للاطمئنان.', date: 'أمس', status: 'failed' },
  ]);

  useEffect(() => {
    const unsubscribe = subscribeToPlayers((data) => {
      const activePlayers = data.filter(p => p.status === 'active');
      setPlayers(activePlayers);
      
      // إذا تم تمرير ID لاعب من لوحة التحكم، قم بتحديده تلقائياً
      if (params?.playerId) {
        const target = activePlayers.find(p => p.id === params.playerId);
        if (target) {
          setSendMode('individual');
          setTargetAudience('PARENTS');
          setSelectedIndividual(target);
          setMessageText(`نود إبلاغكم بأننا لاحظنا تراجعاً في نسبة حضور اللاعب ${target.fullName}، نرجو التكرم بالتعاون معنا لرفع مستوى الالتزام.`);
        }
      }
    });
    return () => unsubscribe();
  }, [params]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    let recipientLabel = '';
    if (sendMode === 'group') {
      recipientLabel = targetAudience === 'PARENTS' ? 'كل أولياء الأمور' : 
                       targetAudience === 'COACHES' ? 'كل المدربين' : 'كل اللاعبين';
    } else {
      recipientLabel = selectedIndividual.name || selectedIndividual.fullName;
      if (targetAudience === 'PARENTS') recipientLabel = `ولي أمر: ${recipientLabel}`;
    }

    setIsSending(true);
    
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        recipient: recipientLabel,
        type: selectedMethod,
        content: messageText,
        date: 'الآن',
        status: 'sent'
      };
      setMessages([newMessage, ...messages]);
      setIsSending(false);
      setMessageText('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const getSuggestions = () => {
    const query = searchQuery.toLowerCase();
    if (targetAudience === 'COACHES') {
      return MOCK_COACHES.filter(c => c.name.toLowerCase().includes(query)).slice(0, 5);
    }
    return players.filter(p => 
      p.fullName?.toLowerCase().includes(query) || 
      p.parentName?.toLowerCase().includes(query)
    ).slice(0, 5);
  };

  const filteredSuggestions = getSuggestions();

  const filteredMessages = activeChannel === 'الكل' 
    ? messages 
    : messages.filter(m => {
        if (activeChannel === 'واتساب') return m.type === 'whatsapp';
        if (activeChannel === 'رسائل نصية') return m.type === 'sms';
        if (activeChannel === 'إشعارات') return m.type === 'app';
        return true;
      });

  const getThemeColor = () => {
    if (targetAudience === 'PARENTS') return 'emerald';
    if (targetAudience === 'COACHES') return 'purple';
    return 'blue';
  };

  const themeColor = getThemeColor();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative text-right" dir="rtl">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4">
          <div className="bg-emerald-600 text-white px-10 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 font-black border border-emerald-400">
            <CheckCircle2 size={24} />
            تم إرسال الرسالة بنجاح!
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm h-fit space-y-8 lg:sticky lg:top-8">
          <div className="flex items-center gap-3 text-gray-800 mb-2">
            <div className={`p-2 bg-${themeColor}-50 text-${themeColor}-600 rounded-xl transition-colors duration-500`}><MessageSquare size={24} /></div>
            <h3 className="text-xl font-black tracking-tighter">إرسال رسالة جديدة</h3>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">من المستهدف؟</label>
             <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => { setTargetAudience('PARENTS'); setSelectedIndividual(null); }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${targetAudience === 'PARENTS' ? 'bg-white text-emerald-600 shadow-md ring-1 ring-emerald-100' : 'text-gray-400 hover:text-emerald-500'}`}
                >
                  <Users size={18} />
                  <span className="text-[10px] font-black">أولياء الأمور</span>
                </button>
                <button 
                  onClick={() => { setTargetAudience('COACHES'); setSelectedIndividual(null); }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${targetAudience === 'COACHES' ? 'bg-white text-purple-600 shadow-md ring-1 ring-purple-100' : 'text-gray-400 hover:text-purple-500'}`}
                >
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black">المدربون</span>
                </button>
                <button 
                  onClick={() => { setTargetAudience('PLAYERS'); setSelectedIndividual(null); }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${targetAudience === 'PLAYERS' ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-100' : 'text-gray-400 hover:text-blue-500'}`}
                >
                  <GraduationCap size={18} />
                  <span className="text-[10px] font-black">اللاعبون</span>
                </button>
             </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => { setSendMode('group'); setSelectedIndividual(null); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${sendMode === 'group' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
            >
              إرسال جماعي
            </button>
            <button 
              onClick={() => setSendMode('individual')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${sendMode === 'individual' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
            >
              إرسال فردي
            </button>
          </div>
          
          <div className="space-y-6">
            {sendMode === 'group' ? (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                   <Bell className={`text-${themeColor}-600`} size={20} />
                   <p className="text-sm font-black text-gray-700">
                    سيتم إرسال الرسالة إلى {targetAudience === 'PARENTS' ? 'كافة أولياء أمور اللاعبين النشطين' : targetAudience === 'COACHES' ? 'كافة أعضاء الكادر التدريبي' : 'كافة اللاعبين المسجلين'}
                   </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                {!selectedIndividual ? (
                  <div className="relative">
                    <UserSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder={targetAudience === 'COACHES' ? "ابحث عن مدرب..." : "ابحث عن لاعب/ولي أمر..."}
                      className={`w-full pr-12 pl-4 py-4 bg-${themeColor}-50/30 border border-${themeColor}-100 rounded-2xl outline-none text-sm font-black focus:ring-4 focus:ring-${themeColor}-500/10 transition-all`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                    />

                    {showSuggestions && searchQuery.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-[100] bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
                        {filteredSuggestions.length > 0 ? filteredSuggestions.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => {
                              setSelectedIndividual(item);
                              setShowSuggestions(false);
                            }}
                            className={`w-full p-4 flex items-center justify-between hover:bg-${themeColor}-50 transition-colors border-b border-gray-50 last:border-0`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-${themeColor}-100 text-${themeColor}-600 flex items-center justify-center font-black text-xs`}>
                                {(item.name || item.fullName).charAt(0)}
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-gray-800">{item.name || item.fullName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{item.team}</p>
                              </div>
                            </div>
                            <Check size={16} className={`text-${themeColor}-200`} />
                          </button>
                        )) : (
                          <div className="p-10 text-center text-xs text-gray-400 font-bold italic">لا توجد نتائج مطابقة</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`p-6 rounded-[2rem] text-white shadow-2xl relative animate-in zoom-in-95 bg-${themeColor}-600 shadow-${themeColor}-100`}>
                    <button 
                      onClick={() => setSelectedIndividual(null)}
                      className="absolute top-4 left-4 p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-all"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                        <User size={28} />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">المستلم المختار</p>
                        <h4 className="text-xl font-black leading-none">{selectedIndividual.name || selectedIndividual.fullName}</h4>
                        <p className="text-xs mt-2 opacity-80 font-bold">{selectedIndividual.team}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">قناة التواصل</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedMethod('whatsapp')}
                  className={`flex-1 p-5 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    selectedMethod === 'whatsapp' 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-100' 
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <Smartphone size={24} />
                  <span className="text-[10px] font-black uppercase">WhatsApp</span>
                </button>
                <button 
                  onClick={() => setSelectedMethod('sms')}
                  className={`flex-1 p-5 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    selectedMethod === 'sms' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' 
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <MessageSquare size={24} />
                  <span className="text-[10px] font-black uppercase">SMS</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">نص الرسالة</label>
              <textarea 
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-5 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm resize-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium shadow-inner"
                placeholder="اكتب رسالتك هنا..."
              ></textarea>
            </div>

            <button 
              onClick={handleSendMessage}
              disabled={isSending || !messageText.trim() || (sendMode === 'individual' && !selectedIndividual)}
              className={`w-full py-5 rounded-[2rem] font-black shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-white bg-${themeColor}-600 shadow-${themeColor}-100`}
            >
              {isSending ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} />}
              إرسال الرسالة الآن
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
              {['الكل', 'واتساب', 'رسائل نصية', 'إشعارات'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveChannel(tab as any)}
                  className={`px-8 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeChannel === tab ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
              <div key={msg.id} className="p-8 hover:bg-gray-50 transition-colors group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      msg.type === 'whatsapp' ? 'bg-emerald-50 text-emerald-600' :
                      msg.type === 'sms' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {msg.type === 'whatsapp' ? <Smartphone size={24} /> :
                       msg.type === 'sms' ? <MessageSquare size={24} /> : <Bell size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-lg leading-none mb-2">{msg.recipient}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{msg.date}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${
                    msg.status === 'sent' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    msg.status === 'read' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {msg.status === 'sent' ? 'تم الإرسال' : msg.status === 'read' ? 'تمت القراءة' : 'فشل الإرسال'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 border-dashed font-bold shadow-inner group-hover:bg-white transition-colors">
                  {msg.content}
                </div>
              </div>
            )) : (
              <div className="p-32 text-center flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 border border-gray-100">
                  <MessageSquare size={48} />
                </div>
                <p className="text-gray-400 font-black text-xl tracking-tighter">سجل المراسلات فارغ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;
