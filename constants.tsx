
import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Calendar, 
  UserSquare2, 
  CreditCard, 
  LineChart, 
  Settings, 
  MessageSquare,
  Trophy,
  UserCheck,
  UserPlus
} from 'lucide-react';

export const COLORS = {
  primary: '#10b981', // Emerald 500
  secondary: '#064e3b', // Emerald 900
  accent: '#f59e0b', // Amber 500
  background: '#f8fafc',
  white: '#ffffff',
  text: '#1e293b'
};

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'COACH'] },
  { id: 'requests', label: 'طلبات الانضمام', icon: <UserPlus size={20} />, roles: ['ADMIN'] },
  { id: 'coach-group', label: 'مجموعتي التدريبية', icon: <UserCheck size={20} />, roles: ['COACH'] },
  { id: 'players', label: 'إدارة اللاعبين', icon: <Users size={20} />, roles: ['ADMIN', 'COACH'] },
  { id: 'teams', label: 'الفرق والتدريبات', icon: <Trophy size={20} />, roles: ['ADMIN', 'COACH'] },
  { id: 'attendance', label: 'الحضور والانضباط', icon: <Calendar size={20} />, roles: ['ADMIN', 'COACH'] },
  { id: 'performance', label: 'التقييم الفني', icon: <LineChart size={20} />, roles: ['ADMIN', 'COACH'] },
  { id: 'finance', label: 'الاشتراكات والمالية', icon: <CreditCard size={20} />, roles: ['ADMIN'] },
  { id: 'communication', label: 'التواصل', icon: <MessageSquare size={20} />, roles: ['ADMIN', 'COACH'] },
  { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} />, roles: ['ADMIN'] },
];

export const MOCK_SUMMARY = [
  { label: 'إجمالي اللاعبين', value: '154', change: '+12%', color: 'bg-blue-500' },
  { label: 'نسبة الحضور', value: '92%', change: '+3%', color: 'bg-emerald-500' },
  { label: 'إيرادات الشهر', value: '45,200 ر.س', change: '+8%', color: 'bg-amber-500' },
  { label: 'الفرق النشطة', value: '10', change: '+2', color: 'bg-purple-500' },
];

export const AGE_GROUPS = [
  'فئة البراعم (U11)',
  'فئة الناشئين (U14)',
  'فئة الشباب (U17)'
];

export const MOCK_COACHES = [
  { id: 'c1', username: 'saleh', password: '', name: 'كابتن صالح المحمدي', team: 'فريق الصقور', players: 24, specialty: 'تكتيك وهجوم', phone: '0501112223', attendance: '96%', category: AGE_GROUPS[0] },
  { id: 'c2', username: 'fahd', password: '', name: 'كابتن فهد العيسى', team: 'فريق النمور', players: 22, specialty: 'لياقة بدنية', phone: '0503334445', attendance: '92%', category: AGE_GROUPS[0] },
  { id: 'c3', username: 'yasser', password: '', name: 'كابتن ياسر القحطاني', team: 'فريق المستقبل', players: 18, specialty: 'أساسيات المهارة', phone: '0505556667', attendance: '89%', category: AGE_GROUPS[1] },
  { id: 'c4', username: 'otayf', password: '', name: 'كابتن عبدالله عطيف', team: 'فريق الأبطال', players: 20, specialty: 'وسط ومناورة', phone: '0507778889', attendance: '94%', category: AGE_GROUPS[1] },
  { id: 'c5', username: 'mansour', password: '', name: 'كابتن منصور الحربي', team: 'فريق النجوم', players: 21, specialty: 'دفاع وتغطية', phone: '0509990001', attendance: '91%', category: AGE_GROUPS[2] },
];

export const LEVELS = [
  'مبتدئ',
  'متوسط',
  'متقدم'
];

export const TEAMS = [
  'فريق الصقور',
  'فريق النمور',
  'فريق الأبطال',
  'فريق المستقبل',
  'فريق النجوم'
];

export const MOCK_PLAYERS = [
  { id: '1', name: 'أحمد العتيبي', ageGroup: 'فئة البراعم (U11)', level: 'متقدم', status: 'active', attendanceRate: 95, team: 'فريق الصقور' },
  { id: '2', name: 'خالد محمد', ageGroup: 'فئة البراعم (U11)', level: 'متوسط', status: 'active', attendanceRate: 88, team: 'فريق النمور' },
  { id: '3', name: 'سلمان الفرج', ageGroup: 'فئة البراعم (U11)', level: 'مبتدئ', status: 'inactive', attendanceRate: 40, team: 'فريق الصقور' },
  { id: '4', name: 'فيصل الغامدي', ageGroup: 'فئة الناشئين (U14)', level: 'متقدم', status: 'active', attendanceRate: 98, team: 'فريق المستقبل' },
  { id: '5', name: 'محمد كانو', ageGroup: 'فئة الناشئين (U14)', level: 'متقدم', status: 'active', attendanceRate: 92, team: 'فريق الأبطال' },
  { id: '7', name: 'عبدالرحمن غريب', ageGroup: 'فئة الناشئين (U14)', level: 'متوسط', status: 'active', attendanceRate: 85, team: 'فريق المستقبل' },
  { id: '6', name: 'سالم الدوسري', ageGroup: 'فئة الشباب (U17)', level: 'متقدم', status: 'active', attendanceRate: 99, team: 'فريق النجوم' },
  { id: '8', name: 'فراس البريكان', ageGroup: 'فئة الشباب (U17)', level: 'متقدم', status: 'active', attendanceRate: 94, team: 'فريق النجوم' },
  { id: '9', name: 'ياسر الشهراني', ageGroup: 'فئة الشباب (U17)', level: 'متقدم', status: 'active', attendanceRate: 96, team: 'فريق النجوم' },
  { id: '10', name: 'سعود عبدالحميد', ageGroup: 'فئة الشباب (U17)', level: 'متقدم', status: 'active', attendanceRate: 97, team: 'فريق النجوم' },
  { id: '11', name: 'علي البليهي', ageGroup: 'فئة الشباب (U17)', level: 'متوسط', status: 'active', attendanceRate: 89, team: 'فريق النجوم' },
  { id: '12', name: 'سلطان الغنام', ageGroup: 'فئة الناشئين (U14)', level: 'متقدم', status: 'active', attendanceRate: 93, team: 'فريق الأبطال' },
  { id: '13', name: 'عبدالله العمار', ageGroup: 'فئة الناشئين (U14)', level: 'متوسط', status: 'active', attendanceRate: 87, team: 'فريق المستقبل' },
  { id: '14', name: 'سامي النجعي', ageGroup: 'فئة الناشئين (U14)', level: 'متقدم', status: 'active', attendanceRate: 91, team: 'فريق المستقبل' },
  { id: '15', name: 'عبدالإله العمري', ageGroup: 'فئة الناشئين (U14)', level: 'متوسط', status: 'active', attendanceRate: 85, team: 'فريق الأبطال' },
  { id: '16', name: 'هتان باهبري', ageGroup: 'فئة البراعم (U11)', level: 'متقدم', status: 'active', attendanceRate: 90, team: 'فريق الصقور' },
  { id: '17', name: 'صالح الشهري', ageGroup: 'فئة البراعم (U11)', level: 'متوسط', status: 'active', attendanceRate: 88, team: 'فريق النمور' },
  { id: '18', name: 'نواف العقيدي', ageGroup: 'فئة البراعم (U11)', level: 'متقدم', status: 'active', attendanceRate: 94, team: 'فريق النمور' },
  { id: '19', name: 'عماد خالد', ageGroup: 'فئة البراعم (U11)', level: 'مبتدئ', status: 'active', attendanceRate: 90, team: 'فريق الصقور' },
];
