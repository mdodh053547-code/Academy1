
import React, { useState, useRef, useEffect } from 'react';
import { MENU_ITEMS, COLORS } from '../constants';
import { LogOut, Bell, Menu, X, User, CheckCircle2, AlertCircle, BrainCircuit, Wallet, Trash2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  userName: string;
  roleSwitcher?: React.ReactNode;
  onLogout: () => void;
}

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'warning' | 'ai' | 'finance';
  isRead: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, userName, roleSwitcher, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'لاعب جديد', desc: 'تم تسجيل "سويلم المطيري" في فئة البراعم بنجاح.', time: 'منذ دقيقتين', type: 'success', isRead: false },
    { id: '2', title: 'تقرير ذكي جاهز', desc: 'قام Gemini بتحليل أداء اللاعب فيصل الغامدي.', time: 'منذ ساعة', type: 'ai', isRead: false },
    { id: '3', title: 'سداد اشتراك', desc: 'تم استلام 500 ر.س من ولي أمر أحمد العتيبي.', time: 'منذ ساعتين', type: 'finance', isRead: true },
    { id: '4', title: 'تنبيه غياب', desc: 'اللاعب خالد محمد غائب للمرة الثالثة هذا الأسبوع.', time: 'منذ 5 ساعات', type: 'warning', isRead: true },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={16} />;
      case 'ai': return <BrainCircuit className="text-purple-500" size={16} />;
      case 'finance': return <Wallet className="text-blue-500" size={16} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden font-['Cairo']" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-emerald-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-emerald-500 p-2 rounded-xl">
              <img src="https://picsum.photos/id/1058/40/40" className="w-8 h-8 rounded-full" alt="logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">أكاديمية النخبة</h1>
              <p className="text-xs text-emerald-400">بوابة الكادر الإداري</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {MENU_ITEMS.filter(item => item.roles.includes(userRole)).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${activeTab === item.id 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50' 
                    : 'text-emerald-300 hover:bg-emerald-800 hover:text-white'}
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-emerald-800">
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 text-emerald-300 hover:text-red-400 w-full transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 shrink-0 shadow-sm z-[100]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden md:block text-right">
              {MENU_ITEMS.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex-1 flex justify-center px-4">
            {roleSwitcher}
          </div>

          <div className="flex items-center gap-4 relative" ref={notificationRef}>
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2.5 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all relative ${unreadCount > 0 ? 'animate-wiggle' : ''}`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-3 z-[200]">
                  <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-black text-gray-800">التنبيهات</h3>
                    <div className="flex gap-2">
                      <button onClick={markAllAsRead} className="text-[10px] font-bold text-emerald-600 hover:underline">تحديد الكل كمقروء</button>
                      <button onClick={clearNotifications} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                          onClick={() => setNotifications(notifications.map(notif => notif.id === n.id ? {...notif, isRead: true} : notif))}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                            n.type === 'success' ? 'bg-emerald-50' : 
                            n.type === 'warning' ? 'bg-amber-50' : 
                            n.type === 'ai' ? 'bg-purple-50' : 'bg-blue-50'
                          }`}>
                            {getIcon(n.type)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-start">
                              <p className={`text-sm font-bold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                              <span className="text-[10px] text-gray-400">{n.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{n.desc}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-gray-400 space-y-3">
                        <Bell size={40} className="mx-auto opacity-20" />
                        <p className="text-xs font-bold">لا توجد تنبيهات جديدة حالياً</p>
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="w-full py-4 text-xs font-bold text-gray-500 hover:bg-gray-50 border-t border-gray-50 transition-colors"
                    >
                      إغلاق القائمة
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="h-10 w-[1px] bg-gray-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-left hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-800 leading-none">{userName}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">
                  {userRole === 'ADMIN' ? 'المدير العام' : 'طاقم التدريب'}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
};

export default Layout;
