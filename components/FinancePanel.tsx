
import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  RefreshCw, 
  Eye,
  Settings2,
  X,
  Plus,
  Link,
  ShieldCheck,
  Activity,
  ChevronLeft,
  Key,
  Smartphone
} from 'lucide-react';

const FinancePanel: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const transactions = [
    { id: '1', player: 'خالد محمد', amount: 500, date: '2024/05/15', method: 'mada', status: 'completed' },
    { id: '2', player: 'أحمد العتيبي', amount: 1200, date: '2024/05/14', method: 'stcpay', status: 'pending' },
    { id: '3', player: 'سلمان الفرج', amount: 500, date: '2024/05/12', method: 'visa', status: 'completed' },
  ];

  const paymentGateways = [
    { id: 'stripe', name: 'Stripe Global', icon: '💳', status: 'active', type: 'international' },
    { id: 'paytabs', name: 'PayTabs Saudi', icon: '🇸🇦', status: 'inactive', type: 'regional' },
    { id: 'stcpay', name: 'STC Pay Business', icon: '📱', status: 'active', type: 'local' },
    { id: 'moyasar', name: 'Moyasar (ميسر)', icon: '⚡', status: 'inactive', type: 'local' },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("جاري بدء تحميل كشف الحساب لشهر مايو (PDF)...");
    }, 1500);
  };

  const handleSaveGateways = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowGatewayModal(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 text-right relative" dir="rtl">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] animate-in fade-in slide-in-from-top-4">
          <div className="bg-emerald-600 text-white px-10 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 font-black border border-emerald-400">
            <CheckCircle2 size={24} />
            تم تحديث إعدادات بوابات الدفع بنجاح!
          </div>
        </div>
      )}

      {/* Gateway Setup Modal */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-lg">
                  <Settings2 size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tighter">إعداد بوابات الدفع</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">إدارة الربط البرمجي للمدفوعات</p>
                </div>
              </div>
              <button onClick={() => setShowGatewayModal(false)} className="p-3 text-gray-300 hover:bg-gray-100 rounded-full transition-all">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentGateways.map(gateway => (
                  <div key={gateway.id} className={`p-6 rounded-[2.5rem] border transition-all group hover:scale-[1.02] cursor-pointer ${gateway.status === 'active' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-3xl">{gateway.icon}</div>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${gateway.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {gateway.status === 'active' ? 'متصل' : 'غير نشط'}
                      </div>
                    </div>
                    <h4 className="font-black text-gray-800 mb-1">{gateway.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mb-4">{gateway.type === 'international' ? 'دولي' : 'محلي'} • عمولة منخفضة</p>
                    {gateway.status === 'active' ? (
                      <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black uppercase">
                        <Activity size={12} />
                        يعمل بشكل طبيعي
                      </div>
                    ) : (
                      <button className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1">
                        <Link size={12} /> تفعيل الربط الآن
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-8 bg-blue-900 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="flex items-center gap-3 mb-2">
                  <Key className="text-blue-300" size={24} />
                  <h4 className="text-lg font-black">مفاتيح الربط الحالية</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest mr-2">Secret API Key (Stripe)</label>
                    <input 
                      type="password" 
                      readOnly 
                      value="sk_test_51Mz...X920" 
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono tracking-widest text-blue-100 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest mr-2">STC Pay Merchant ID</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="M-8829102931" 
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-blue-100 outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex items-start gap-3">
                   <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
                   <p className="text-[10px] text-blue-200 font-bold leading-relaxed">جميع البيانات مشفرة بالكامل بمعيار AES-256 ومتوافقة مع متطلبات البنك المركزي السعودي.</p>
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex gap-4">
              <button onClick={() => setShowGatewayModal(false)} className="flex-1 py-5 text-gray-400 font-black hover:text-red-500 transition-colors">إلغاء</button>
              <button 
                onClick={handleSaveGateways}
                disabled={isSyncing}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isSyncing ? <RefreshCw className="animate-spin" size={24} /> : <><ShieldCheck size={24} /> حفظ ومزامنة البوابات</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <div className="p-3 bg-emerald-500/30 rounded-2xl backdrop-blur-md">
                <DollarSign size={24} />
              </div>
              <span className="text-[10px] bg-emerald-500/30 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-white/10">+15% هذا الشهر</span>
            </div>
            <p className="text-emerald-100 text-sm font-bold mb-1 opacity-70 tracking-widest uppercase">إجمالي الدخل الشهري</p>
            <h2 className="text-4xl font-black mt-1 tracking-tighter">45,200 <span className="text-xl font-normal opacity-50">ر.س</span></h2>
          </div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:border-emerald-500 transition-all hover:-translate-y-1">
          <div className="flex justify-between items-center mb-10">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <span className="text-[10px] text-amber-600 font-black">يتطلب متابعة</span>
          </div>
          <p className="text-gray-400 text-sm font-bold mb-1 tracking-widest uppercase">مستحقات معلقة</p>
          <h2 className="text-4xl font-black mt-1 text-gray-800 tracking-tighter">8,400 <span className="text-xl font-normal opacity-30">ر.س</span></h2>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:border-blue-500 transition-all hover:-translate-y-1">
          <div className="flex justify-between items-center mb-10">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CreditCard size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-bold mb-1 tracking-widest uppercase">متوسط سعر الاشتراك</p>
          <h2 className="text-4xl font-black mt-1 text-gray-800 tracking-tighter">450 <span className="text-xl font-normal opacity-30">ر.س</span></h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-3">
               <Activity className="text-emerald-600" size={24} />
               <h3 className="text-xl font-black text-gray-800">آخر الحركات المالية</h3>
            </div>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="text-xs font-black text-emerald-600 flex items-center gap-2 hover:bg-emerald-50 px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 border border-emerald-100"
            >
              {isDownloading ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
              تحميل الكشف (PDF)
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl shadow-sm ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {tx.status === 'completed' ? <ArrowDownLeft size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-lg leading-none mb-2">{tx.player}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tx.date} • عبر {tx.method}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-800 text-xl tracking-tighter mb-1">{tx.amount} ر.س</p>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {tx.status === 'completed' ? 'عملية ناجحة' : 'قيد المراجعة'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Side */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">بوابات الدفع النشطة</h4>
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:rotate-12 transition-transform">
                  <ShieldCheck size={18} className="text-emerald-500" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src="https://picsum.photos/id/1/32/32" className="w-10 h-10 rounded-xl bg-white p-1 shadow-inner grayscale group-hover:grayscale-0 transition-all" alt="mada" />
                    <span className="font-black text-sm">شبكة مدى Mada</span>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg">STC</div>
                    <span className="font-black text-sm">STC Pay Business</span>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
              </div>
              <button 
                onClick={() => setShowGatewayModal(true)}
                className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-3 active:scale-95"
              >
                <Plus size={20} />
                إعداد بوابات جديدة
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] pointer-events-none"></div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-8 rounded-[3rem] space-y-4 relative overflow-hidden group">
            <div className="flex items-center gap-3 text-amber-800">
              <div className="p-2 bg-amber-100 rounded-xl">
                <AlertCircle size={20} />
              </div>
              <h4 className="font-black">تنبيهات السداد</h4>
            </div>
            <p className="text-xs text-amber-700 font-bold leading-relaxed">هناك <span className="text-lg text-amber-900 mx-1">12</span> لاعباً لم يتم سداد اشتراكاتهم لشهر مايو. تم إرسال إشعارات تذكير تلقائية لأولياء أمورهم.</p>
            <button 
              onClick={() => setShowOverdueModal(true)}
              className="mt-6 w-full py-3.5 bg-white border border-amber-200 rounded-2xl text-xs font-black text-amber-900 hover:bg-amber-100 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Eye size={16} />
              عرض قائمة المتأخرين
            </button>
          </div>
        </div>
      </div>

      {/* Overdue Modal Simulation */}
      {showOverdueModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-gray-100 bg-amber-50/50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-800 tracking-tighter">المتأخرون عن السداد</h3>
              <button onClick={() => setShowOverdueModal(false)} className="p-2 text-gray-400 hover:text-red-500 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {['ياسر الشهراني', 'سعود عبدالحميد', 'علي البليهي', 'فهد المحمد', 'سلطان العيسى'].map((name, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 group hover:bg-white hover:border-amber-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-all">
                      {name.charAt(0)}
                    </div>
                    <span className="font-black text-gray-800">{name}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-red-600 font-black text-lg tracking-tighter">600 ر.س</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">باقة شهر مايو</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-gray-50 flex gap-4">
              <button onClick={() => setShowOverdueModal(false)} className="flex-1 py-4 text-gray-400 font-bold">إغلاق</button>
              <button 
                onClick={() => { setShowOverdueModal(false); setSuccessToast(true); setTimeout(() => setSuccessToast(false), 3000); }}
                className="flex-[2] py-4 bg-amber-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone size={18} />
                إرسال تذكير جماعي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePanel;
