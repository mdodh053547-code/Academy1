
import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  UserMinus, 
  ExternalLink, 
  Clock, 
  Phone, 
  Mail, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Search,
  Eye,
  FileText,
  Smartphone,
  AlertCircle,
  MessageSquareShare,
  Send,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { subscribeToPlayers, approvePlayerRequest, deletePlayer, sendApprovalNotification } from '../services/playerService';

const JoinRequestsPanel: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [showToast, setShowToast] = useState<{show: boolean, msg: string, type: 'success' | 'error' | 'info'}>({show: false, msg: '', type: 'success'});
  
  // حالات مودال الرفض
  const [requestToReject, setRequestToReject] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPlayers((data) => {
      const pendingOnes = data.filter(p => p.status === 'pending');
      setRequests(pendingOnes);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setShowToast({ show: true, msg, type });
    setTimeout(() => setShowToast({ show: false, msg: '', type: 'success' }), 4000);
  };

  const handleApprove = async (request: any) => {
    setProcessingId(request.id);
    try {
      await approvePlayerRequest(request.id);
      setIsSendingMsg(true);
      await sendApprovalNotification(request.parentPhone, request.fullName);
      setIsSendingMsg(false);
      triggerToast(`تم قبول ${request.fullName} وإرسال رسالة رابط السداد بنجاح!`);
    } catch (e) {
      triggerToast("حدث خطأ أثناء معالجة الطلب", "error");
    } finally {
      setProcessingId(null);
      setIsSendingMsg(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!requestToReject) return;
    const id = requestToReject.id;
    setProcessingId(id);
    try {
      await deletePlayer(id);
      triggerToast(`تم رفض طلب انضمام ${requestToReject.fullName} وحذف بياناته.`, "error");
      setRequestToReject(null);
    } catch (e) {
      triggerToast("حدث خطأ أثناء محاولة حذف الطلب", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.parentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right pb-10" dir="rtl">
      {/* Reject Confirmation Modal */}
      {requestToReject && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 text-center space-y-6">
               <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto border border-red-100 shadow-inner">
                  <AlertTriangle size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-800">تأكيد رفض الطلب</h3>
                  <p className="text-gray-500 font-bold leading-relaxed">
                    أنت على وشك رفض طلب <span className="text-red-600 font-black">{requestToReject.fullName}</span>. 
                    سيتم حذف كافة البيانات والمستندات المرفوعة نهائياً. هل أنت متأكد؟
                  </p>
               </div>
               <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setRequestToReject(null)}
                    className="flex-1 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all"
                  >
                    تراجع
                  </button>
                  <button 
                    onClick={handleConfirmReject}
                    disabled={processingId === requestToReject.id}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === requestToReject.id ? <RefreshCw className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    نعم، ارفض واحذف
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {showToast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[250] animate-in fade-in slide-in-from-top-4">
          <div className={`
            ${showToast.type === 'success' ? 'bg-emerald-600' : showToast.type === 'info' ? 'bg-blue-600' : 'bg-red-600'} 
            text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 font-black border border-white/20
          `}>
            {showToast.type === 'success' ? <CheckCircle2 size={24} /> : showToast.type === 'info' ? <MessageSquareShare size={24} /> : <XCircle size={24} />}
            <p>{showToast.msg}</p>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.8rem] flex items-center justify-center shadow-inner">
             <Clock size={32} />
           </div>
           <div>
             <h2 className="text-3xl font-black text-gray-800 tracking-tighter">طلبات الانضمام</h2>
             <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">مراجعة البيانات وإرسال روابط السداد آلياً</p>
           </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث في الطلبات..." 
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 font-bold transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-32 rounded-[3rem] border border-gray-100 text-center">
          <RefreshCw className="animate-spin text-blue-500 mx-auto mb-6" size={48} />
          <p className="text-xl font-black text-gray-400">جاري تحميل الطلبات الجديدة...</p>
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-6 duration-500">
          {filteredRequests.map(request => (
            <div key={request.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
              <div className="flex flex-col lg:flex-row">
                <div className="p-8 flex-1 border-l border-gray-50">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-[2rem] overflow-hidden flex items-center justify-center text-gray-300 font-black text-3xl shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {request.fullName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-800 mb-1">{request.fullName}</h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-600 px-3 py-0.5 rounded-full text-[10px] font-black">{request.ageGroup}</span>
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">بانتظار المراجعة</span>
                        </div>
                      </div>
                    </div>
                    {request.idPhotoUrl && (
                      <a href={request.idPhotoUrl} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all" title="عرض الهوية">
                        <FileText size={20} />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
                      <Smartphone size={20} className="text-emerald-600" />
                      <div>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">ولي الأمر: {request.parentName}</p>
                        <p className="text-sm font-black text-gray-700">{request.parentPhone}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-3 border border-blue-100">
                      <Send size={20} className="text-blue-600" />
                      <div>
                        <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest leading-none mb-1">الإجراء التلقائي</p>
                        <p className="text-xs font-bold text-blue-900">إرسال رابط السداد آلياً فور القبول</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-8 lg:w-72 flex flex-col justify-center gap-4 border-r border-gray-100">
                  <button 
                    onClick={() => handleApprove(request)}
                    disabled={processingId === request.id}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingId === request.id && !requestToReject ? (
                       <div className="flex items-center gap-2">
                         <RefreshCw className="animate-spin" size={18} />
                         {isSendingMsg ? 'جاري الإرسال...' : 'جاري الحفظ...'}
                       </div>
                    ) : (
                      <>
                        <UserCheck size={18} />
                        قبول وإرسال الرابط
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setRequestToReject(request)}
                    disabled={processingId === request.id}
                    className="w-full py-4 bg-white text-red-600 border border-red-100 rounded-2xl font-black hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <UserMinus size={18} />
                    رفض الطلب
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-40 rounded-[3rem] border border-gray-100 text-center space-y-4">
           <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto opacity-50 shadow-inner">
             <CheckCircle2 size={48} className="text-emerald-500" />
           </div>
           <p className="text-xl font-black text-gray-800 tracking-tight">لا توجد طلبات انضمام جديدة حالياً</p>
        </div>
      )}
    </div>
  );
};

export default JoinRequestsPanel;
