
export enum SchoolId {
  SHRI_HARI = 'SHRI_HARI',
  FAITH_ACADEMY = 'FAITH_ACADEMY'
}

export interface School {
  id: SchoolId;
  name: string;
  logoUrl: string;
  themeColor: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'staff' | 'student';
  schoolId: SchoolId;
  email?: string;
  phone?: string;
  department?: string;
  joinDate?: string;
  status?: 'Active' | 'Inactive' | 'On Leave';
  
  // Student Specific Fields
  grade?: string;
  section?: string;
  rollNumber?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  dob?: string;
  bloodGroup?: string;
}

export interface LoginCredentials {
  username: string;
  password: string; // In a real app, never store/log plain text passwords
  schoolId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string; // e.g., 'Tuition Fee', 'Salary', 'Maintenance', 'Transport'
  amount: number;
  date: string;
  description: string;
  status: TransactionStatus;
  paymentMethod?: string; // 'Cash', 'Bank Transfer', 'UPI', 'Cheque'
}

export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subject: string;
  grade: string;
  section: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Break' | 'Activity';
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Sick Leave' | 'Casual Leave' | 'Emergency Leave' | 'Unpaid Leave';

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export type EventType = 'Academic' | 'Holiday' | 'Sports' | 'Cultural' | 'Meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  startTime?: string;
  endTime?: string;
}
