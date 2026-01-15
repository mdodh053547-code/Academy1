
import React, { useState } from 'react';
import { ArrowRight, Upload, User, Users, Phone, Mail, Calendar, Info, ShieldCheck, Check, CreditCard, Apple, Wallet, FileText, Sparkles, RefreshCw, ChevronLeft } from 'lucide-react';
import { AGE_GROUPS, LEVELS, TEAMS } from '../constants';
import { registerNewPlayer } from '../services/playerService';

interface PlayerRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ملفات اللاعب
  const [idFile, setIdFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    idNumber: '',
    nationality: 'سعودي',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    ageGroup: AGE_GROUPS[0],
    level: LEVELS[0],
    team: TEAMS[0],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'photo') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'id') setIdFile(e.target.files[0]);
      else setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitting(true);
      try {
        await registerNewPlayer(formData, idFile || undefined, photoFile || undefined);
        onSuccess();
      } catch (error) {
        alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const InputGroup = ({ label, icon: Icon, type = "text", placeholder, name, required = true }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mr-4">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
        <Icon className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type={type}
          name={name}
          required={required}
          className="w-full pr-14 pl-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.8rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-bold shadow-inner"
          placeholder={placeholder}
          value={(formData as any)[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-[1.5rem] transition-all">
            <ArrowRight size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">طلب الانضمام</h2>
            <p className="text-xs text-emerald-600 font-bold mt-1">سجل بياناتك وسيتم مراجعتها من قبل الإدارة</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-3">
           <div className="flex items-center gap-2">
              <div className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-gray-100'}`}></div>
              <div className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-gray-100'}`}></div>
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المرحلة {step} من 2</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {step === 1 ? (
          <div className="space-y-10 animate-in slide-in-from-left-6 duration-500">
            <section className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 mb-10 text-emerald-600">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <User size={28} />
                </div>
                <h3 className="text-2xl font-black tracking-tight">البيانات الشخصية</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="اسم اللاعب الكامل" icon={User} name="fullName" placeholder="الاسم الرباعي" />
                <InputGroup label="تاريخ الميلاد" icon={Calendar} name="birthDate" type="date" />
                <InputGroup label="اسم ولي الأمر" icon={Users} name="parentName" placeholder="الأب أو الوكيل" />
                <InputGroup label="رقم الجوال" icon={Phone} name="parentPhone" placeholder="05XXXXXXXX" />
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-left-6 duration-500">
            <section className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-10 text-purple-600">
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <Upload size={28} />
                </div>
                <h3 className="text-2xl font-black tracking-tight">المستندات المطلوبة</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative border-4 border-dashed border-gray-100 rounded-[3rem] p-12 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center group">
                  <input type="file" onChange={(e) => handleFileChange(e, 'id')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-all ${idFile ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"}`}>
                    <FileText size={32} />
                  </div>
                  <p className="text-lg font-black text-gray-800">{idFile ? idFile.name : "صورة الهوية / الإقامة"}</p>
                </div>

                <div className="relative border-4 border-dashed border-gray-100 rounded-[3rem] p-12 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center group">
                  <input type="file" onChange={(e) => handleFileChange(e, 'photo')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-all ${photoFile ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"}`}>
                    <User size={32} />
                  </div>
                  <p className="text-lg font-black text-gray-800">{photoFile ? photoFile.name : "الصورة الشخصية"}</p>
                </div>
              </div>
              
              <div className="mt-12 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                <ShieldCheck size={28} className="text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-black text-blue-900 mb-1 text-lg">خطوتك القادمة</h4>
                  <p className="text-sm text-blue-800 font-bold leading-relaxed">بمجرد إرسال الطلب، سيتم مراجعته من قبل إدارة الأكاديمية. عند الموافقة، ستصلك رسالة لإتمام عملية السداد وتفعيل عضويتك رسمياً.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-6">
          <button type="button" onClick={step === 1 ? onBack : () => setStep(1)} className="text-sm font-black text-gray-400 hover:text-red-500 transition-all uppercase tracking-widest px-8">
            {step === 1 ? 'إلغاء' : 'السابق'}
          </button>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full md:w-auto flex items-center justify-center gap-4 px-20 py-6 rounded-[2.5rem] font-black text-lg shadow-2xl transition-all active:scale-95 disabled:opacity-50
              ${step === 2 ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' : 'bg-gray-800 text-white hover:bg-gray-900'}
            `}
          >
            {isSubmitting ? (
              <RefreshCw className="animate-spin" size={24} />
            ) : (
              <>
                {step === 2 ? <><Check size={24} /> إرسال طلب الانضمام</> : <>المرحلة التالية <ChevronLeft size={24} /></>}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerRegistration;
