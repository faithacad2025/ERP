
import { School, SchoolId, User, Transaction, TimeSlot, LeaveRequest } from './types';

export const SCHOOLS: School[] = [
  {
    id: SchoolId.SHRI_HARI,
    name: 'Shri Hari Public School',
    logoUrl: 'https://picsum.photos/id/10/200/200', // Placeholder for school logo
    themeColor: 'orange-600'
  },
  {
    id: SchoolId.FAITH_ACADEMY,
    name: 'Faith Academy',
    logoUrl: 'https://picsum.photos/id/20/200/200', // Placeholder for school logo
    themeColor: 'blue-600'
  }
];

export const TEST_CREDENTIALS = {
  ADMIN: {
    username: 'admin',
    password: 'adminpassword'
  },
  STAFF: {
    username: 'staff',
    password: 'staffpassword'
  }
};

export const MOCK_ADMIN: User = {
  id: 'u1',
  username: 'admin',
  name: 'System Administrator',
  role: 'admin',
  schoolId: SchoolId.SHRI_HARI, // Default
  email: 'admin@shriharischool.edu',
  department: 'IT & Administration',
  status: 'Active'
};

export const MOCK_STAFF: User = {
  id: 'u2',
  username: 'staff',
  name: 'Sarah Jenkins',
  role: 'staff',
  schoolId: SchoolId.SHRI_HARI, // Default
  email: 'sarah.j@shriharischool.edu',
  phone: '+1 (555) 123-4567',
  department: 'Science',
  joinDate: '2021-08-15',
  status: 'Active'
};

export const MOCK_STAFF_LIST: User[] = [
  {
    id: 's1',
    username: 'r.sharma',
    name: 'Rohit Sharma',
    role: 'staff',
    schoolId: SchoolId.SHRI_HARI,
    email: 'r.sharma@school.edu',
    phone: '9876543210',
    department: 'Mathematics',
    joinDate: '2020-03-10',
    status: 'Active'
  },
  {
    id: 's2',
    username: 'p.gupta',
    name: 'Priya Gupta',
    role: 'staff',
    schoolId: SchoolId.SHRI_HARI,
    email: 'p.gupta@school.edu',
    phone: '9876543211',
    department: 'English',
    joinDate: '2019-07-01',
    status: 'On Leave'
  },
  {
    id: 's3',
    username: 'a.singh',
    name: 'Amit Singh',
    role: 'staff',
    schoolId: SchoolId.SHRI_HARI,
    email: 'a.singh@school.edu',
    phone: '9876543212',
    department: 'Sports',
    joinDate: '2022-01-15',
    status: 'Active'
  },
  {
    id: 's4',
    username: 'k.verma',
    name: 'Kavita Verma',
    role: 'staff',
    schoolId: SchoolId.SHRI_HARI,
    email: 'k.verma@school.edu',
    phone: '9876543213',
    department: 'Science',
    joinDate: '2018-11-20',
    status: 'Inactive'
  }
];

export const MOCK_STUDENTS: User[] = [
  {
    id: 'st1',
    username: 'rohan.das',
    name: 'Rohan Das',
    role: 'student',
    schoolId: SchoolId.SHRI_HARI,
    grade: 'X',
    section: 'A',
    rollNumber: '101',
    guardianName: 'Suresh Das',
    guardianPhone: '9988776655',
    email: 'rohan.d@student.edu',
    address: '123, MG Road, New Delhi',
    dob: '2008-05-12',
    bloodGroup: 'B+',
    joinDate: '2018-04-01',
    status: 'Active'
  },
  {
    id: 'st2',
    username: 'priya.k',
    name: 'Priya Kumari',
    role: 'student',
    schoolId: SchoolId.SHRI_HARI,
    grade: 'X',
    section: 'A',
    rollNumber: '102',
    guardianName: 'Rajesh Kumar',
    guardianPhone: '9988776644',
    email: 'priya.k@student.edu',
    address: '45, Civil Lines, New Delhi',
    dob: '2008-08-22',
    bloodGroup: 'A+',
    joinDate: '2018-04-01',
    status: 'Active'
  },
  {
    id: 'st3',
    username: 'amit.y',
    name: 'Amit Yadav',
    role: 'student',
    schoolId: SchoolId.SHRI_HARI,
    grade: 'IX',
    section: 'B',
    rollNumber: '205',
    guardianName: 'Sunil Yadav',
    guardianPhone: '9988776633',
    email: 'amit.y@student.edu',
    address: '78, Karol Bagh, New Delhi',
    dob: '2009-02-15',
    bloodGroup: 'O+',
    joinDate: '2019-04-01',
    status: 'Active'
  },
  {
    id: 'st4',
    username: 'sneha.r',
    name: 'Sneha Reddy',
    role: 'student',
    schoolId: SchoolId.SHRI_HARI,
    grade: 'XI',
    section: 'Science',
    rollNumber: '301',
    guardianName: 'Prakash Reddy',
    guardianPhone: '9988776622',
    email: 'sneha.r@student.edu',
    address: '12, Vasant Vihar, New Delhi',
    dob: '2007-11-30',
    bloodGroup: 'AB+',
    joinDate: '2017-04-01',
    status: 'On Leave'
  },
  {
    id: 'st5',
    username: 'vikram.s',
    name: 'Vikram Singh',
    role: 'student',
    schoolId: SchoolId.SHRI_HARI,
    grade: 'XII',
    section: 'Commerce',
    rollNumber: '412',
    guardianName: 'Mahendra Singh',
    guardianPhone: '9988776611',
    email: 'vikram.s@student.edu',
    address: '56, Lajpat Nagar, New Delhi',
    dob: '2006-06-10',
    bloodGroup: 'O-',
    joinDate: '2016-04-01',
    status: 'Active'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'income',
    category: 'Tuition Fee',
    amount: 25000,
    date: '2024-03-10',
    description: 'Tuition Fee - Class X - Rohan Das',
    status: 'Completed',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 't2',
    type: 'expense',
    category: 'Maintenance',
    amount: 5600,
    date: '2024-03-09',
    description: 'AC Repair - Computer Lab 1',
    status: 'Completed',
    paymentMethod: 'Cash'
  },
  {
    id: 't3',
    type: 'income',
    category: 'Transport Fee',
    amount: 12000,
    date: '2024-03-09',
    description: 'Bus Fee Q4 - Route 5 Students',
    status: 'Completed',
    paymentMethod: 'UPI'
  },
  {
    id: 't4',
    type: 'expense',
    category: 'Salary',
    amount: 450000,
    date: '2024-03-01',
    description: 'Staff Salaries - February 2024',
    status: 'Completed',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 't5',
    type: 'expense',
    category: 'Utilities',
    amount: 12500,
    date: '2024-03-05',
    description: 'Electricity Bill - Feb 2024',
    status: 'Pending',
    paymentMethod: 'Cheque'
  },
  {
    id: 't6',
    type: 'income',
    category: 'Admission Fee',
    amount: 45000,
    date: '2024-03-11',
    description: 'New Admission - Class I (3 Students)',
    status: 'Completed',
    paymentMethod: 'Cash'
  }
];

export const MOCK_TIMETABLE: TimeSlot[] = [
  // Monday
  { id: 'm1', day: 'Monday', startTime: '08:30', endTime: '09:15', subject: 'Physics', grade: 'X', section: 'A', room: 'Rm 204', type: 'Lecture' },
  { id: 'm2', day: 'Monday', startTime: '09:15', endTime: '10:00', subject: 'Physics', grade: 'IX', section: 'B', room: 'Rm 202', type: 'Lecture' },
  { id: 'm3', day: 'Monday', startTime: '10:00', endTime: '10:45', subject: 'Break', grade: '-', section: '-', room: 'Staff Room', type: 'Break' },
  { id: 'm4', day: 'Monday', startTime: '10:45', endTime: '11:30', subject: 'Physics Lab', grade: 'XII', section: 'Science', room: 'Physics Lab', type: 'Lab' },
  
  // Tuesday
  { id: 'tu1', day: 'Tuesday', startTime: '08:30', endTime: '09:15', subject: 'Science', grade: 'VIII', section: 'C', room: 'Rm 105', type: 'Lecture' },
  { id: 'tu2', day: 'Tuesday', startTime: '09:15', endTime: '10:00', subject: 'Free Period', grade: '-', section: '-', room: 'Library', type: 'Break' },
  { id: 'tu3', day: 'Tuesday', startTime: '10:45', endTime: '11:30', subject: 'Physics', grade: 'X', section: 'A', room: 'Rm 204', type: 'Lecture' },

  // Wednesday
  { id: 'w1', day: 'Wednesday', startTime: '08:30', endTime: '09:15', subject: 'Physics', grade: 'X', section: 'A', room: 'Rm 204', type: 'Lecture' },
  { id: 'w2', day: 'Wednesday', startTime: '11:30', endTime: '12:15', subject: 'Physics', grade: 'IX', section: 'B', room: 'Rm 202', type: 'Lecture' },
  
  // Thursday
  { id: 'th1', day: 'Thursday', startTime: '09:15', endTime: '10:00', subject: 'Science Activity', grade: 'VII', section: 'A', room: 'Activity Hall', type: 'Activity' },
  { id: 'th2', day: 'Thursday', startTime: '10:45', endTime: '11:30', subject: 'Physics Lab', grade: 'XI', section: 'Science', room: 'Physics Lab', type: 'Lab' },

  // Friday
  { id: 'f1', day: 'Friday', startTime: '08:30', endTime: '09:15', subject: 'Physics', grade: 'X', section: 'A', room: 'Rm 204', type: 'Lecture' },
  { id: 'f2', day: 'Friday', startTime: '10:00', endTime: '10:45', subject: 'Student Counseling', grade: '-', section: '-', room: 'Office', type: 'Activity' },
];

export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'l1',
    userId: 'u2', // Linked to MOCK_STAFF
    type: 'Sick Leave',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    reason: 'Viral fever and high temperature',
    status: 'Approved',
    appliedOn: '2024-02-09'
  },
  {
    id: 'l2',
    userId: 'u2',
    type: 'Casual Leave',
    startDate: '2024-03-05',
    endDate: '2024-03-05',
    reason: 'Personal banking work',
    status: 'Pending',
    appliedOn: '2024-03-01'
  },
  {
    id: 'l3',
    userId: 'u2',
    type: 'Emergency Leave',
    startDate: '2023-11-15',
    endDate: '2023-11-15',
    reason: 'Family emergency',
    status: 'Approved',
    appliedOn: '2023-11-14'
  },
  {
    id: 'l4',
    userId: 'u2',
    type: 'Casual Leave',
    startDate: '2023-12-24',
    endDate: '2023-12-26',
    reason: 'Christmas Holidays',
    status: 'Rejected',
    appliedOn: '2023-12-10'
  }
];
