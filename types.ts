
export enum UserRole {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  PLAYER = 'PLAYER',
  PARENT = 'PARENT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface Player {
  id: string;
  fullName: string;
  parentId: string;
  ageGroup: string;
  level: string;
  team: string;
  birthDate: string;
  status: 'active' | 'inactive' | 'pending';
  paymentStatus: 'paid' | 'unpaid';
  attendanceRate: number;
  idPhotoUrl?: string;
  personalPhotoUrl?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface Team {
  id: string;
  name: string;
  coachId: string;
  ageGroup: string;
  playerCount: number;
  trainingDays: string[];
}
