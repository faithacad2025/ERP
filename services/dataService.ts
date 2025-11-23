
import { User, Transaction, LeaveRequest, CalendarEvent, AttendanceRecord, SchoolId } from '../types';
import { MOCK_ADMIN, MOCK_STAFF, MOCK_STAFF_LIST, MOCK_STUDENTS, MOCK_TRANSACTIONS, MOCK_LEAVES, MOCK_EVENTS, TEST_CREDENTIALS } from '../constants';

// Keys for Local Storage
const KEYS = {
  STAFF: 'ERP_STAFF',
  STUDENTS: 'ERP_STUDENTS',
  TRANSACTIONS: 'ERP_TRANSACTIONS',
  LEAVES: 'ERP_LEAVES',
  EVENTS: 'ERP_EVENTS',
  ATTENDANCE: 'ERP_ATTENDANCE',
  ADMIN_USER: 'ERP_ADMIN_USER',
  CURRENT_USER_STAFF: 'ERP_CURRENT_USER_STAFF' // For the mock logged in staff
};

// Helper to load or seed data
const loadOrSeed = <T>(key: string, seedData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // If not found, seed it
    localStorage.setItem(key, JSON.stringify(seedData));
    return seedData;
  } catch (e) {
    console.error(`Error loading key ${key}`, e);
    return seedData;
  }
};

export const dataService = {
  // Loaders
  getStaff: (): User[] => loadOrSeed(KEYS.STAFF, MOCK_STAFF_LIST),
  getStudents: (): User[] => loadOrSeed(KEYS.STUDENTS, MOCK_STUDENTS),
  getTransactions: (): Transaction[] => loadOrSeed(KEYS.TRANSACTIONS, MOCK_TRANSACTIONS),
  getLeaves: (): LeaveRequest[] => loadOrSeed(KEYS.LEAVES, MOCK_LEAVES),
  getEvents: (): CalendarEvent[] => loadOrSeed(KEYS.EVENTS, MOCK_EVENTS),
  getAttendance: (): AttendanceRecord[] => loadOrSeed(KEYS.ATTENDANCE, []),
  
  // Special handling for the main Admin/Staff accounts to ensure they persist too
  getAdmin: (): User => {
    const admin = loadOrSeed(KEYS.ADMIN_USER, MOCK_ADMIN);
    // Ensure mock password exists for logic
    if (!admin.password) admin.password = TEST_CREDENTIALS.ADMIN.password;
    return admin;
  },
  
  // Savers
  saveStaff: (data: User[]) => localStorage.setItem(KEYS.STAFF, JSON.stringify(data)),
  saveStudents: (data: User[]) => localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data)),
  saveTransactions: (data: Transaction[]) => localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(data)),
  saveLeaves: (data: LeaveRequest[]) => localStorage.setItem(KEYS.LEAVES, JSON.stringify(data)),
  saveEvents: (data: CalendarEvent[]) => localStorage.setItem(KEYS.EVENTS, JSON.stringify(data)),
  saveAttendance: (data: AttendanceRecord[]) => localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(data)),
  
  // User Lookup for Auth
  findUser: (username: string): User | undefined => {
    const admin = dataService.getAdmin();
    if (admin.username === username) return admin;

    const staff = dataService.getStaff();
    const staffUser = staff.find(u => u.username === username);
    if (staffUser) return staffUser;

    const students = dataService.getStudents();
    const studentUser = students.find(u => u.username === username);
    if (studentUser) return studentUser;
    
    // Check the 'mock' standalone staff if not in list
    if (MOCK_STAFF.username === username) return MOCK_STAFF;

    return undefined;
  }
};
