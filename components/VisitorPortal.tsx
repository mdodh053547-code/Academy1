
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Trophy, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Zap, 
  Target, 
  Dribbble, 
  Award, 
  ChevronLeft,
  Calendar,
  Smartphone,
  Mail,
  Play,
  X,
  Volume2,
  Maximize,
  ArrowRightCircle,
  ArrowLeftCircle,
  Pause
} from 'lucide-react';

interface VisitorPortalProps {
  onBack: () => void;
  onRegister: () => void;
  tourData?: { title: string; desc: string; img: string; videoUrl: string }[];
}

const VisitorPortal: React.FC<VisitorPortalProps> = ({ onBack, onRegister, tourData = [] }) => {
  const [showTour, setShowTour] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // إعادة ضبط حالة التشغيل عند تغيير الشريحة
  useEffect(() => {
    setIsPlaying(false);
  }, [activeSlide]);

  const academyPrograms = [
    {
      title: 'برنامج التأسيس (براعم)',
      age: '6 - 10 سنوات',
      desc: 'يركز على حب اللعبة، التوافق العضلي العصبي، والمهارات الأساسية للمراوغة والتحكم.',
      sessions: '3 حصص أسبوعياً',
      icon: <Star className="text-amber-500" size={32} />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      title: 'برنامج التطوير (ناشئين)',
      age: '11 - 14 سنة',
      desc: 'تعزيز الفهم التكتيكي، التمركز الصحيح في الملعب، وبناء القوة البدنية المتوازنة.',
      sessions: '4 حصص أسبوعياً',
      icon: <Zap className="text-blue-500" size={32} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      title: 'برنامج النخبة (شباب)',
      age: '15 - 17 سنة',
      desc: 'تدريبات مكثفة تحاكي الأندية المحترفة، تحليل بالفيديو، وتحضير للمشاركة في دوريات المناطق.',
      sessions: '5 حصص أسبوعياً',
      icon: <Trophy className="text-emerald-500" size={32} />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      title: 'مدرسة حراس المرمى',
      age: 'جميع الأعمار',
      desc: 'تدريب تخصصي لحراس المرمى يركز على رد الفعل، القفز، وبناء الهجمات من الخلف.',
      sessions: 'حصتان تخصصيتان',
      icon: <ShieldCheck className="text-purple-500" size={32} />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    }
  ];

  const slides = tourData.length > 0 ? tourData : [
    {
      title: "ملاعبنا الاحترافية",
      desc: "نمتلك ملاعب بمواصفات دولية معتمدة من الفيفا.",
      img: "https://images.unsplash.com/photo-1551958219-acbc608c6377",
      videoUrl: ""
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Cairo'] text-right pb-20" dir="rtl">
      {/* Tour Modal Overlay */}
      {showTour && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8 bg-emerald-950/90 backdrop-blur-2xl animate-in fade-in">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col lg:flex-row max-h-[90vh]">
            {/* Left/Content Side */}
            <div className="lg:w-1/3 p-12 space-y-8 bg-gray-50/50 border-l border-gray-100 flex flex-col justify-center">
               <button onClick={() => setShowTour(false)} className="lg:hidden absolute top-6 left-6 p-2 text-gray-400"><X size={32}/></button>
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Zap className="text-emerald-600" /></div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{slides[activeSlide].title}</h3>
               </div>
               <p className="text-lg text-gray-500 font-medium leading-relaxed">
                 {slides[activeSlide].desc}
               </p>
               <div className="flex gap-3">
                 {slides.map((_, i) => (
                   <button 
                    key={i} 
                    onClick={() => setActiveSlide(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${activeSlide === i ? 'w-12 bg-emerald-600' : 'w-4 bg-gray-200'}`}
                   ></button>
                 ))}
               </div>
               <div className="pt-8 flex flex-col gap-4">
                  <button onClick={onRegister} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                    احجز مقعدك الآن
                    <ArrowLeftCircle size={20} />
                  </button>
                  <button onClick={() => {setShowTour(false); setIsPlaying(false);}} className="w-full py-4 text-gray-400 font-bold hover:text-red-500">إغلاق الجولة</button>
               </div>
            </div>

            {/* Right/Media Side - Video Player Implementation */}
            <div className="flex-1 relative group bg-black flex items-center justify-center">
              {isPlaying && slides[activeSlide].videoUrl ? (
                <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
                  <iframe 
                    src={slides[activeSlide].videoUrl.includes('youtube.com/embed') ? slides[activeSlide].videoUrl : `${slides[activeSlide].videoUrl}?autoplay=1`} 
                    className="w-full h-full"
                    title={slides[activeSlide].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <>
                  <img 
                    key={activeSlide}
                    src={slides[activeSlide].img} 
                    className="w-full h-full object-cover animate-in fade-in slide-in-from-right-4 duration-700 opacity-80 group-hover:opacity-100 transition-opacity" 
                    alt="Academy Tour" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent"></div>
                  
                  {/* Functional Play Button */}
                  {slides[activeSlide].videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <button 
                          onClick={() => setIsPlaying(true)}
                          className="w-24 h-24 bg-emerald-600/90 backdrop-blur-md rounded-full border-4 border-white/40 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform shadow-2xl group-hover:bg-emerald-500 group-hover:border-white"
                       >
                          <Play size={40} className="fill-current ml-1" />
                       </button>
                    </div>
                  )}

                  <div className="absolute top-1/2 left-6 -translate-y-1/2 z-10 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                        className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                  </div>
                </>
              )}

              {/* Top Controls */}
              <div className="absolute top-10 left-10 right-10 flex justify-between items-start">
                  <button 
                    onClick={() => {setShowTour(false); setIsPlaying(false);}} 
                    className="p-4 bg-black/20 hover:bg-red-500/40 rounded-full text-white backdrop-blur-md transition-all shadow-lg"
                  >
                    <X size={28}/>
                  </button>
                  {isPlaying && (
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="p-4 bg-black/20 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-2 font-bold text-xs"
                    >
                      <Pause size={20} />
                      إيقاف الفيديو
                    </button>
                  )}
              </div>

              {!isPlaying && (
                <div className="absolute bottom-10 right-10 left-10 flex items-center justify-between text-white/80 pointer-events-none">
                   <div className="flex items-center gap-4">
                      <div className="bg-emerald-600 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">فيديو تعريفي</div>
                      <p className="text-sm font-bold shadow-sm">{slides[activeSlide].title}</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-emerald-600 rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-emerald-100">
                <Trophy size={24} className="text-white" />
             </div>
             <div>
                <h1 className="text-xl font-black text-gray-800 leading-none">أكاديمية النخبة</h1>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">بجدة - حي المرجان</p>
             </div>
          </div>
          <button onClick={onBack} className="group flex items-center gap-2 text-gray-500 font-black hover:text-emerald-600 transition-all">
            الرجوع للرئيسية
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
           <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-full text-xs font-black shadow-sm border border-emerald-100">
              <Star size={16} className="fill-emerald-600 animate-pulse" />
              أكاديمية مرخصة ومعتمدة من وزارة الرياضة
           </div>
           <h2 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter text-gray-900">
              اصنع مسارك نحو <br/>
              <span className="text-emerald-600">الاحتراف الحقيقي</span>
           </h2>
           <p className="text-gray-500 text-xl leading-relaxed font-medium max-w-xl">
              نحن لا نعلم كرة القدم فحسب، بل نبني شخصية اللاعب الرياضية باستخدام أحدث المناهج العالمية المدعومة بالتحليل الذكي.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                 <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-sm"><CheckCircle2 size={24}/></div>
                 <div>
                    <h4 className="font-black text-gray-800">طاقم تدريب دولي</h4>
                    <p className="text-xs text-gray-400 font-bold mt-1">خبرات معتمدة من الـ AFC والـ UEFA.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                 <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm"><Zap size={24}/></div>
                 <div>
                    <h4 className="font-black text-gray-800">تقنيات Gemini AI</h4>
                    <p className="text-xs text-gray-400 font-bold mt-1">تقارير أداء ذكية لكل لاعب شهرياً.</p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onRegister}
                className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                انضم إلينا الآن
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setShowTour(true)}
                className="px-10 py-6 bg-gray-100 text-gray-600 rounded-[2rem] font-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Play size={18} className="fill-current" />
                مشاهدة الجولة التعريفية
              </button>
           </div>
        </div>
        <div className="relative animate-in zoom-in-95 duration-700">
           <div className="relative z-10 overflow-hidden rounded-[4rem] shadow-2xl border-[12px] border-white">
              <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Football training" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent"></div>
           </div>
           {/* Floating stats badge */}
           <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[3rem] shadow-2xl z-20 border border-gray-50 animate-bounce duration-1000">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Users size={28} />
                 </div>
                 <div>
                    <p className="text-3xl font-black text-gray-800 leading-none">+150</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">لاعب موهوب</p>
                 </div>
              </div>
           </div>
           <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">مناهجنا التدريبية</h3>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">برامج الأكاديمية المتخصصة</h2>
            <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {academyPrograms.map((program, idx) => (
              <div 
                key={idx} 
                className={`group p-10 rounded-[3.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col`}
              >
                <div className={`w-20 h-20 ${program.bgColor} ${program.borderColor} border rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {program.icon}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{program.age}</p>
                  </div>
                  <h4 className="text-2xl font-black text-gray-800 leading-tight">{program.title}</h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    {program.desc}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-xs font-black text-gray-500">
                    <Calendar size={14} className="text-emerald-500" />
                    {program.sessions}
                  </div>
                </div>
                <button 
                  onClick={onRegister}
                  className="mt-8 w-full py-4 bg-gray-50 text-gray-800 rounded-2xl font-black text-sm group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner"
                >
                  انضم للبرنامج
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-emerald-950 relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-8 relative z-10">
            <h3 className="text-emerald-400 font-black text-sm uppercase tracking-widest">لماذا أكاديمية النخبة؟</h3>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">فلسفة تدريبية تركز على <br/>صناعة "القائد" قبل "اللاعب"</h2>
            <div className="space-y-6">
              {[
                { t: 'تطوير ذهني', d: 'جلسات أسبوعية لتعزيز الثقة بالنفس والروح الرياضية.' },
                { t: 'قياسات رقمية', d: 'أجهزة تتبع متطورة لقياس السرعة والمسافة والجهد البدني.' },
                { t: 'مشاركات خارجية', d: 'تنظيم بطولات ودية مع أكبر أندية المنطقة الغربية.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-500 shrink-0">
                    <Target size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-white text-lg">{item.t}</h5>
                    <p className="text-gray-400 text-sm font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative z-10">
            <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/10 shadow-2xl">
               <div className="space-y-10">
                 <div className="flex items-center gap-6">
                   <div className="text-6xl font-black text-emerald-500">98%</div>
                   <p className="text-white font-black text-xl leading-snug">نسبة رضا أولياء <br/> الأمور عن التطور الفني</p>
                 </div>
                 <div className="h-[1px] bg-white/10"></div>
                 <div className="grid grid-cols-2 gap-8">
                   <div>
                     <p className="text-4xl font-black text-emerald-500">24/7</p>
                     <p className="text-gray-400 text-xs font-bold mt-1 tracking-widest uppercase">دعم إداري متواصل</p>
                   </div>
                   <div>
                     <p className="text-4xl font-black text-emerald-500">+10</p>
                     <p className="text-gray-400 text-xs font-bold mt-1 tracking-widest uppercase">مدربين نخبويين</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </section>

      {/* Pricing Section */}
      <section className="py-32">
         <div className="container mx-auto px-6 text-center space-y-4 mb-20">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">الاستثمار الرياضي</h3>
            <h2 className="text-4xl font-black tracking-tighter text-gray-900">خطط الاشتراك والرسوم</h2>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">اختر المسار المناسب لميزانيتك واحتياجات طفلك وابدأ الرحلة اليوم.</p>
         </div>
         
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'باقة الأساس', price: '450', features: ['3 تمارين أسبوعياً', 'تحليل فني شهري', 'مشاركة في المباريات الودية', 'وصول لتطبيق اللاعب'] },
              { title: 'باقة النخبة (الأكثر طلباً)', price: '1200', features: ['4 تمارين أسبوعياً', 'تحليل AI مكثف ومفصل', 'أدوات تدريب خاصة', 'اشتراك ربع سنوي مخفض', 'طقم تدريب مجاني'], popular: true },
              { title: 'الباقة الذهبية (السنوية)', price: '4000', features: ['جميع المزايا السابقة', 'طقمين تدريب كاملين', 'أولوية في المشاركة بالبطولات', 'استشارات فنية خاصة مجانية', 'وفر 15% سنوياً'] },
            ].map((plan, i) => (
              <div key={i} className={`relative bg-white p-12 rounded-[4rem] border transition-all duration-500 hover:shadow-2xl ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-100 ring-8 ring-emerald-50' : 'border-gray-100 shadow-sm'}`}>
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    الخيار المفضل
                  </div>
                )}
                <h4 className="text-2xl font-black mb-2 text-gray-800">{plan.title}</h4>
                <div className="flex items-baseline gap-2 justify-center mb-10">
                   <span className="text-5xl font-black tracking-tighter text-emerald-600">{plan.price}</span>
                   <span className="text-gray-400 text-sm font-bold">ر.س / باقة</span>
                </div>
                <ul className="space-y-6 mb-12 text-right">
                   {plan.features.map((f, j) => (
                     <li key={j} className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                        </div>
                        {f}
                     </li>
                   ))}
                </ul>
                <button 
                  onClick={onRegister}
                  className={`w-full py-5 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                   اطلب الانضمام الآن
                </button>
              </div>
            ))}
         </div>
      </section>

      {/* Footer Info */}
      <footer className="container mx-auto px-6 py-20 border-t border-gray-100">
         <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                <MapPin size={28} />
               </div>
               <div>
                  <h5 className="font-black text-lg text-gray-800">موقعنا الرئيسي</h5>
                  <p className="text-sm font-bold text-gray-400">جدة - حي المرجان - ملاعب أكاديمية النخبة</p>
               </div>
            </div>
            <div className="flex gap-6">
               <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                <Smartphone size={20} />
               </button>
               <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                <Dribbble size={20} />
               </button>
               <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-emerald-400 hover:text-white transition-all shadow-sm">
                <Mail size={20} />
               </button>
            </div>
         </div>
         <div className="mt-20 text-center">
            <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">© 2024 جميع الحقوق محفوظة لأكاديمية النخبة الرقمية</p>
         </div>
      </footer>
    </div>
  );
};

export default VisitorPortal;
