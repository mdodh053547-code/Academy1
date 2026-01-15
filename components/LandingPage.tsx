
import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Info, 
  ArrowLeft, 
  Trophy, 
  Zap, 
  MapPin, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Navigation,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onStaffClick: () => void;
  onMemberClick: () => void;
  onVisitorClick: () => void;
  socialLinks: {
    whatsapp: string;
    instagram: string;
    twitter: string;
    maps: string;
    website: string;
  };
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onStaffClick, 
  onMemberClick, 
  onVisitorClick,
  socialLinks 
}) => {
  return (
    <div className="min-h-screen bg-emerald-950 text-white flex flex-col relative overflow-hidden font-['Cairo']" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <Trophy size={28} className="text-emerald-950" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">أكاديمية النخبة</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">إدارة المواهب الرياضية</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onVisitorClick} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">عن الأكاديمية</button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 container mx-auto px-6 flex flex-col justify-center items-center text-center relative z-10 py-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-400 text-xs font-bold mb-8 animate-bounce">
          <Zap size={14} />
          المنصة الرقمية الأكثر تطوراً في جدة
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-4xl">
          مستقبل <span className="text-emerald-500">كرة القدم</span> يبدأ من هنا
        </h2>
        <h3 className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          نظام متكامل لإدارة اللاعبين، المدربين، والعمليات الفنية بأحدث تقنيات الذكاء الاصطناعي.
        </h3>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
          {/* Card 1: Staff */}
          <button 
            onClick={onStaffClick}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] hover:bg-emerald-600 transition-all duration-500 text-right relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all">
                <ShieldCheck size={32} className="text-emerald-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">بوابة الكادر</h3>
              <p className="text-gray-400 text-sm group-hover:text-emerald-100 transition-colors">دخول الإدارة والمدربين لمتابعة الحضور، التقييمات والعمليات.</p>
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-[3] transition-transform duration-700"></div>
          </button>

          {/* Card 2: Members */}
          <button 
            onClick={onMemberClick}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] hover:bg-blue-600 transition-all duration-500 text-right relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all">
                <Users size={32} className="text-blue-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">بوابة الأعضاء</h3>
              <p className="text-gray-400 text-sm group-hover:text-blue-100 transition-colors">خاص للاعبين وأولياء الأمور لمتابعة الجدول، الرسوم والتقارير.</p>
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-[3] transition-transform duration-700"></div>
          </button>

          {/* Card 3: Visitors */}
          <button 
            onClick={onVisitorClick}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] hover:bg-amber-600 transition-all duration-500 text-right relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-all">
                <Info size={32} className="text-amber-500 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">بوابة الزوار</h3>
              <p className="text-gray-400 text-sm group-hover:text-amber-100 transition-colors">تعرف على برامجنا التدريبية، الأسعار، والمقر الرئيسي.</p>
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-[3] transition-transform duration-700"></div>
          </button>
        </div>

        {/* Social Media Section - Dynamic */}
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-right">
                <h4 className="text-lg font-black text-emerald-400 flex items-center gap-2 mb-1">
                  <Globe size={18} />
                  تواصل معنا مباشرة
                </h4>
                <p className="text-xs text-gray-400 font-bold">تابع آخر الأخبار والمواعيد عبر منصاتنا الرسمية</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href={socialLinks.whatsapp} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-emerald-500 text-emerald-950 rounded-2xl font-black hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle size={20} />
                  <span>واتساب</span>
                </a>
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-pink-600 text-white rounded-2xl font-black hover:bg-pink-500 transition-all active:scale-95 shadow-lg shadow-pink-600/20"
                >
                  <Instagram size={20} />
                  <span>إنستغرام</span>
                </a>
                <a 
                  href={socialLinks.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-gray-100 text-gray-950 rounded-2xl font-black hover:bg-white transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                  <Twitter size={20} />
                  <span>منصة X</span>
                </a>
                <a 
                  href={socialLinks.maps} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  <Navigation size={20} />
                  <span>موقعنا</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest relative z-10 gap-4">
        <div className="flex items-center gap-2">
          <MapPin size={12} />
          حي المرجان، جدة، المملكة العربية السعودية
        </div>
        <div className="flex items-center gap-2">
           <span>© 2024 أكاديمية النخبة</span>
           <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
           <span>جميع الحقوق محفوظة</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
