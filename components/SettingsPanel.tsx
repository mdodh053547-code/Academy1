
import React, { useState } from 'react';
import { 
  Save, 
  UserCog, 
  Globe, 
  Smartphone, 
  Instagram, 
  CheckCircle2,
  Users,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Video,
  PlayCircle,
  Image as ImageIcon
} from 'lucide-react';

interface TourSlide {
  title: string;
  desc: string;
  img: string;
  videoUrl: string;
}

interface SettingsPanelProps {
  coaches: any[];
  onCoachesUpdate: (coaches: any[]) => void;
  adminProfile: { name: string; password: string };
  onAdminUpdate: (profile: { name: string; password: string }) => void;
  academyLinks: {
    whatsapp: string;
    instagram: string;
    twitter: string;
    maps: string;
    website: string;
  };
  onAcademyLinksUpdate: (links: any) => void;
  tourData: TourSlide[];
  onTourDataUpdate: (data: TourSlide[]) => void;
  players?: any[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  coaches,
  onCoachesUpdate,
  adminProfile, 
  onAdminUpdate,
  academyLinks,
  onAcademyLinksUpdate,
  tourData,
  onTourDataUpdate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'account' | 'coaches' | 'tour' | 'links'>('account');
  const [localAdmin, setLocalAdmin] = useState(adminProfile);
  const [localCoaches, setLocalCoaches] = useState(coaches);
  const [localSocialLinks, setLocalSocialLinks] = useState(academyLinks);
  const [localTourData, setLocalTourData] = useState<TourSlide[]>(tourData);
  
  const [showToast, setShowToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const triggerToast = (msg: string) => {
    setShowToast({ show: true, msg });
    setTimeout(() => setShowToast({ show: false, msg: '' }), 3000);
  };

  const handleAdminSave = () => {
    onAdminUpdate(localAdmin);
    triggerToast("تم تحديث بيانات المدير بنجاح");
  };

  const handleLinksSave = () => {
    onAcademyLinksUpdate(localSocialLinks);
    triggerToast("تم تحديث الروابط العامة بنجاح");
  };

  const handleTourSave = () => {
    onTourDataUpdate(localTourData);
    triggerToast("تم حفظ إعدادات الجولة التعريفية بنجاح");
  };

  const updateTourSlide = (index: number, field: keyof TourSlide, value: string) => {
    const updated = [...localTourData];
    updated[index] = { ...updated[index], [field]: value };
    setLocalTourData(updated);
  };

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-right" dir="rtl">
      {showToast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[250] animate-in fade-in slide-in-from-top-4">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 font-bold border border-emerald-400">
            <CheckCircle2 size={24} className="text-emerald-200" />
            {showToast.msg}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm w-fit mx-auto lg:mx-0">
        {[
          { id: 'account', label: 'حساب المدير', icon: UserCog },
          { id: 'coaches', label: 'الكادر التدريبي', icon: Users },
          { id: 'tour', label: 'الجولة التعريفية', icon: Video },
          { id: 'links', label: 'الروابط العامة', icon: Globe },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all ${activeSubTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'account' && (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden border-r-8 border-r-blue-600 animate-in fade-in zoom-in-95">
          <div className="p-8 border-b border-gray-100 bg-blue-50/30 flex items-center gap-3 text-blue-700">
            <UserCog size={24} />
            <h3 className="text-xl font-black">إدارة حساب المدير</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2">اسم المدير</label>
                <input 
                  type="text" 
                  value={localAdmin.name} 
                  onChange={(e) => setLocalAdmin({...localAdmin, name: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-black text-gray-800 focus:bg-white focus:border-blue-300 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 mr-2 text-right">كلمة المرور</label>
                <input 
                  type="text"
                  value={localAdmin.password} 
                  onChange={(e) => setLocalAdmin({...localAdmin, password: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-mono font-bold text-gray-800 focus:bg-white focus:border-blue-300 transition-all" 
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleAdminSave} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">حفظ الإعدادات</button>
            </div>
          </div>
        </section>
      )}

      {activeSubTab === 'coaches' && (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden border-r-8 border-r-purple-600 animate-in fade-in zoom-in-95">
          <div className="p-8 border-b border-gray-100 bg-purple-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3 text-purple-700">
              <Users size={24} />
              <h3 className="text-xl font-black">إدارة الكادر التدريبي</h3>
            </div>
            <button onClick={() => onCoachesUpdate(localCoaches)} className="px-6 py-2 bg-purple-600 text-white rounded-xl text-xs font-black hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-100">
              <Save size={16} /> اعتماد بيانات المدربين
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 text-[10px] text-gray-400 font-black uppercase tracking-widest border-b border-gray-100">
                  <th className="px-8 py-4">المدرب / الفريق</th>
                  <th className="px-8 py-4">اسم المستخدم</th>
                  <th className="px-8 py-4">كلمة المرور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {localCoaches.map((coach) => (
                  <tr key={coach.id} className="hover:bg-purple-50/10 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xs">
                          {coach.name.charAt(7)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-800">{coach.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{coach.team}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <input 
                        type="text"
                        value={coach.username}
                        onChange={(e) => {
                          const updated = localCoaches.map(c => c.id === coach.id ? { ...c, username: e.target.value } : c);
                          setLocalCoaches(updated);
                        }}
                        className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:bg-white focus:border-purple-300"
                      />
                    </td>
                    <td className="px-8 py-4">
                      <div className="relative flex items-center gap-2">
                        <input 
                          type={visiblePasswords[coach.id] ? "text" : "password"}
                          value={coach.password}
                          onChange={(e) => {
                             const updated = localCoaches.map(c => c.id === coach.id ? { ...c, password: e.target.value } : c);
                             setLocalCoaches(updated);
                          }}
                          placeholder="لا توجد كلمة مرور"
                          className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-mono font-bold outline-none focus:bg-white focus:border-purple-300 pr-10"
                        />
                        <button 
                          onClick={() => togglePassword(coach.id)}
                          className="absolute right-2 text-gray-300 hover:text-purple-600 transition-colors"
                        >
                          {visiblePasswords[coach.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeSubTab === 'tour' && (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden border-r-8 border-r-emerald-600 animate-in fade-in zoom-in-95">
          <div className="p-8 border-b border-gray-100 bg-emerald-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-700">
              <Video size={24} />
              <h3 className="text-xl font-black">إدارة الجولة التعريفية</h3>
            </div>
            <button onClick={handleTourSave} className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2">
              <Save size={18} /> حفظ الجولة
            </button>
          </div>
          
          <div className="p-8 space-y-12">
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
               <ShieldCheck size={20} className="text-amber-600 mt-1" />
               <p className="text-xs text-amber-800 font-bold leading-relaxed">بما أن خدمة التخزين السحابي غير مفعلة، يرجى وضع روابط الصور والفيديوهات مباشرة (رابط خارجي أو YouTube).</p>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {localTourData.map((slide, idx) => (
                <div key={idx} className="bg-gray-50/50 p-8 rounded-[3rem] border border-gray-100 space-y-8 relative group">
                  <div className="absolute -top-4 right-8 bg-emerald-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">المشهد {idx + 1}</div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">عنوان المشهد</label>
                        <input 
                          type="text" 
                          value={slide.title} 
                          onChange={(e) => updateTourSlide(idx, 'title', e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl outline-none font-black text-gray-800 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">وصف مختصر</label>
                        <textarea 
                          rows={3}
                          value={slide.desc} 
                          onChange={(e) => updateTourSlide(idx, 'desc', e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-sm text-gray-600 resize-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">رابط صورة الغلاف</label>
                        <div className="relative">
                           <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                           <input 
                             type="text" 
                             value={slide.img} 
                             onChange={(e) => updateTourSlide(idx, 'img', e.target.value)}
                             placeholder="https://images.unsplash.com/..."
                             className="w-full pr-12 pl-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none font-mono text-xs font-bold text-emerald-600 ltr" 
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-4">رابط الفيديو (YouTube)</label>
                        <div className="relative">
                           <PlayCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                           <input 
                             type="text" 
                             value={slide.videoUrl} 
                             onChange={(e) => updateTourSlide(idx, 'videoUrl', e.target.value)}
                             placeholder="https://www.youtube.com/embed/..."
                             className="w-full pr-12 pl-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none font-mono text-xs font-bold text-blue-600 ltr" 
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSubTab === 'links' && (
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden border-r-8 border-r-emerald-600 animate-in fade-in zoom-in-95">
          <div className="p-8 border-b border-gray-100 bg-emerald-50/30 flex items-center gap-3 text-emerald-700">
            <Globe size={24} />
            <h3 className="text-xl font-black">البيانات العامة والروابط</h3>
          </div>
          <div className="p-8 space-y-8 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 mr-2 flex items-center gap-2 justify-end"><Smartphone size={14} className="text-emerald-500" /> رابط واتساب</label>
                  <input 
                    type="text" 
                    value={localSocialLinks.whatsapp} 
                    onChange={(e) => setLocalSocialLinks({...localSocialLinks, whatsapp: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-xs font-bold text-right focus:bg-white" 
                  />
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 mr-2 flex items-center gap-2 justify-end"><Instagram size={14} className="text-pink-500" /> رابط إنستقرام</label>
                  <input 
                    type="text" 
                    value={localSocialLinks.instagram} 
                    onChange={(e) => setLocalSocialLinks({...localSocialLinks, instagram: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-xs font-bold text-right focus:bg-white" 
                  />
              </div>
            </div>
            <div className="flex justify-end pt-4">
               <button onClick={handleLinksSave} className="px-10 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-3">
                 <Save size={18} /> حفظ كافة الروابط
               </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SettingsPanel;
