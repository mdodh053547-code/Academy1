
import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Star, 
  DollarSign, 
  BrainCircuit, 
  MessageCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  User, 
  LogOut, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  RefreshCw,
  Trophy,
  Activity,
  Download,
  CalendarDays,
  Timer,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { markAsPaid } from '../services/playerService';

interface MemberPortalProps {
  academyName: string;
  onBack: () => void;
  player: any;
}

const MemberPortal: React.FC<MemberPortalProps> = ({ academyName, onBack, player }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'finance'>('profile');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'stcpay'>('mada');

  if (!player) return null;

  const trainingSchedule = [
    { day: 'السبت', time: '05:00 م', field: 'ملعب (أ)', type: 'تدريب مهارات وتكتيك' },
    { day: 'الاثنين', time: '05:00 م', field: 'ملعب (ب)', type: 'لياقة بدنية مكثفة' },
    { day: 'الأربعاء', time: '05:00 م', field: 'ملعب (أ)', type: 'تقسيمة ومناورة' },
  ];

  const paymentHistory = [
    { id: 'TX-9921', date: '2024/05/01', amount: '1,200', status: 'paid', period: 'باقة الـ 3 أشهر (مايو - يوليو)' },
    { id: 'TX-4410', date: '2024/02/01', amount: '1,200', status: 'paid', period: 'باقة الـ 3 أشهر (فبراير - أبريل)' },
  ];

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      await markAsPaid(player.id);
      player.paymentStatus = 'paid';
      alert(`تمت عملية الدفع بنجاح! أهلاً بك في ${academyName}.`);
    } catch (e) {
      alert("حدث خطأ أثناء معالجة الدفع.");
    } finally {
      setIsPaying(false);
    }
  };

  if (player.paymentStatus === 'unpaid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-['Cairo']" dir="rtl">
        <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="text-center space-y-4">
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={48} />
             </div>
             <h1 className="text-4xl font-black text-gray-800">مبارك القبول في {academyName}!</h1>
             <p className="text-gray-500 font-bold text-lg">تم قبول طلب انضمامك يا بطل. تتبقى خطوة واحدة أخيرة لتفعيل عضويتك وهي سداد الرسوم.</p>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                  <CreditCard size={28} className="text-emerald-600" />
                  تفاصيل الرسوم
                </h3>
                <span className="bg-blue-50 text-blue-700 px-6 py-2 rounded-full font-black text-xs">باقة 3 أشهر</span>
             </div>

             <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">المبلغ المطلوب سداده</p>
                   <h4 className="text-5xl font-black tracking-tighter">1,200 <span className="text-xl opacity-50 font-bold">ر.س</span></h4>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
             </div>

             <div className="space-y-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mr-4">اختر وسيلة الدفع</p>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => setPaymentMethod('mada')} className={`p-6 rounded-[1.8rem] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'mada' ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-gray-50 hover:bg-gray-50'}`}>
                      <div className={`p-3 rounded-xl ${paymentMethod === 'mada' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}><CreditCard size={24} /></div>
                      <span className="font-black text-gray-700">مدى</span>
                   </button>
                   <button onClick={() => setPaymentMethod('stcpay')} className={`p-6 rounded-[1.8rem] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'stcpay' ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-gray-50 hover:bg-gray-50'}`}>
                      <div className={`p-3 rounded-xl ${paymentMethod === 'stcpay' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}><Wallet size={24} /></div>
                      <span className="font-black text-gray-700">STC Pay</span>
                   </button>
                </div>
             </div>

             <button 
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
             >
                {isPaying ? <RefreshCw className="animate-spin" size={28} /> : <><ShieldCheck size={28} /> تأكيد الدفع والتفعيل</>}
             </button>

             <button onClick={onBack} className="w-full py-4 text-gray-400 font-bold hover:text-red-500 transition-colors">تسجيل الخروج والعودة لاحقاً</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] text-right pb-10" dir="rtl">
      <div className="bg-emerald-900 text-white p-6 md:p-12 rounded-b-[4rem] shadow-2xl relative overflow-hidden border-b-8 border-emerald-500">
        <div className="relative z-10 container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <button 
              onClick={onBack} 
              className="group p-4 bg-white/10 hover:bg-red-500/20 rounded-3xl transition-all flex items-center gap-2"
              title="تسجيل خروج"
            >
              <LogOut size={24} />
              <span className="text-xs font-black hidden group-hover:inline transition-all">خروج</span>
            </button>
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-emerald-900 text-4xl font-black shadow-inner border-4 border-white/20">
              {player.fullName?.charAt(0) || <User size={48} />}
            </div>
            <div>
              <p className="text-emerald-300 text-sm font-black uppercase tracking-widest mb-1 opacity-80">بوابة لاعب {academyName}</p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{player.fullName}</h1>
              <p className="text-emerald-200 text-sm mt-2 font-bold bg-white/5 w-fit px-4 py-1 rounded-full border border-white/10">{player.team} • {player.ageGroup}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/10 px-8 py-4 rounded-[2rem] border border-white/10 text-center backdrop-blur-xl shadow-lg">
                <p className="text-[10px] text-emerald-200 uppercase font-black mb-1 tracking-widest opacity-60">حالة العضوية</p>
                <p className="text-2xl font-black text-white tracking-tight">مشترك نشط</p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none"></div>
      </div>

      <main className="container mx-auto px-6 -mt-10 relative z-20 space-y-8">
        <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 flex gap-3 max-w-3xl mx-auto">
          {[
            { id: 'profile', label: 'ملفي الرياضي', icon: Activity },
            { id: 'schedule', label: 'جدول التمارين', icon: CalendarDays },
            { id: 'finance', label: 'الاشتراكات', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-5 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={22} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600"></div>
                <div className="flex items-center gap-3 text-emerald-600">
                  <div className="p-3 bg-emerald-50 rounded-2xl">
                    <BrainCircuit size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">التحليل الفني (AI)</h3>
                </div>
                <div className="p-8 bg-gray-50 border border-gray-100 border-dashed rounded-[2.5rem] text-emerald-900 leading-relaxed text-lg font-bold shadow-inner">
                  يا بطل {player.fullName?.split(' ')[0]}، مستواك في تطور مستمر! لاحظ المدربون تحسناً كبيراً في دقة التمريرات. استمر في التركيز على تدريبات السرعة والارتداد الدفاعي لتصبح لاعباً متكاملاً.
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <p className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">الحضور</p>
                    <p className="text-3xl font-black text-blue-900">{player.attendanceRate || 85}%</p>
                  </div>
                  <div className="text-center p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                    <p className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">المستوى</p>
                    <p className="text-2xl font-black text-emerald-700">{player.level}</p>
                  </div>
                  <div className="text-center p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
                    <p className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">التقييم</p>
                    <p className="text-2xl font-black text-amber-700">متميز</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                  <h3 className="font-black text-gray-800 flex items-center gap-2">
                    <Trophy size={20} className="text-amber-500" />
                    الإنجازات الأخيرة
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                       <Star size={18} className="text-amber-600 fill-amber-600" />
                       <span className="text-xs font-bold text-amber-900">أفضل ممرر في تمرين الأسبوع</span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                       <CheckCircle2 size={18} className="text-blue-600" />
                       <span className="text-xs font-bold text-blue-900">إتمام 10 حصص تدريبية متتالية</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-left-8 duration-700">
             <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem] shadow-inner">
                        <Calendar size={32} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tighter">جدولك التدريبي</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">مواعيد فريق {player.team}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   {trainingSchedule.map((session, idx) => (
                     <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:bg-white hover:border-emerald-200 transition-all gap-6">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex flex-col items-center justify-center font-black shadow-lg border-2 border-emerald-500">
                              <span className="text-[10px] opacity-60 leading-none">{session.day.charAt(0)}</span>
                              <span className="text-xl leading-none">{session.day}</span>
                           </div>
                           <div>
                              <p className="text-xl font-black text-gray-800">{session.type}</p>
                              <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-1">
                                <MapPin size={14} className="text-emerald-500" />
                                {session.field}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="px-6 py-3 bg-white border border-gray-200 rounded-2xl flex items-center gap-3 shadow-sm">
                              <Timer size={18} className="text-emerald-600" />
                              <span className="text-sm font-black text-gray-700">{session.time}</span>
                           </div>
                           <span className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                              <ChevronLeft size={20} />
                           </span>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                   <AlertCircle size={24} className="text-blue-600 shrink-0" />
                   <p className="text-sm text-blue-900 font-bold leading-relaxed">
                      يرجى التواجد في الملعب قبل موعد التدريب بـ 15 دقيقة على الأقل مرتدياً طقم الأكاديمية الرسمي. في حال الاعتذار عن الحضور، يرجى التواصل مع المدرب مسبقاً.
                   </p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-700">
             <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] shadow-inner">
                        <CreditCard size={32} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tighter">الاشتراكات والمالية</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">إدارة دفعاتك وفواتيرك</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full border border-emerald-100">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-black">اشتراك نشط</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group">
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest opacity-60">تاريخ انتهاء الاشتراك القادم</p>
                      <h4 className="text-3xl font-black">2024 / 08 / 01</h4>
                      <div className="pt-4 flex items-center gap-2 text-xs font-bold opacity-80">
                         <Timer size={16} />
                         متبقي 45 يوماً على التجديد
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                   </div>
                   <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group">
                      <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-60">الباقة الحالية</p>
                      <h4 className="text-3xl font-black">باقة النخبة (3 أشهر)</h4>
                      <p className="text-xs font-bold opacity-80">تشمل التدريب، التحليل، والمشاركة في البطولات</p>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-black text-gray-800 mr-4">سجل المدفوعات</h3>
                   <div className="divide-y divide-gray-50 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] overflow-hidden">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="p-6 flex items-center justify-between hover:bg-white transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                 <CheckCircle2 size={24} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-gray-800">{payment.period}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{payment.date} • رقم العملية {payment.id}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-left">
                                 <p className="text-xl font-black text-gray-800 tracking-tighter">{payment.amount} ر.س</p>
                                 <span className="text-[9px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-black uppercase">مكتملة</span>
                              </div>
                              <button className="p-3 bg-white text-gray-400 hover:text-blue-600 rounded-xl transition-all shadow-sm border border-gray-100">
                                 <Download size={18} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemberPortal;
