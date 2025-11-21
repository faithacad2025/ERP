import React, { useState } from 'react';
import { User, SchoolId, Transaction, LeaveRequest } from '../types';
import { SCHOOLS, MOCK_STAFF_LIST, MOCK_TRANSACTIONS, MOCK_STUDENTS, MOCK_TIMETABLE, MOCK_LEAVES } from '../constants';
import { StaffManagement } from './admin/StaffManagement';
import { FinanceManagement } from './admin/FinanceManagement';
import { StudentManagement } from './admin/StudentManagement';
import { TimetableView } from './staff/TimetableView';
import { AttendanceView } from './staff/AttendanceView';
import { LeaveRequestView } from './staff/LeaveRequestView';
import { 
  LogOut, Bell, Search, LayoutGrid, Users, BookOpen, Calendar, 
  TrendingUp, DollarSign, UserCheck, FileText, Clock, ShieldCheck,
  ChevronRight, UserPlus
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  onLogout: () => void;
}

type DashboardViewType = 'dashboard' | 'staff_management' | 'students' | 'finance' | 'admissions' | 'timetable' | 'attendance' | 'leave_request';

export const DashboardView: React.FC<DashboardViewProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<DashboardViewType>('dashboard');
  // Hoisted state to persist changes across views
  const [staffList, setStaffList] = useState<User[]>(MOCK_STAFF_LIST);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [students, setStudents] = useState<User[]>(MOCK_STUDENTS);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  
  const school = SCHOOLS.find(s => s.id === user.schoolId);
  const isAdmin = user.role === 'admin';

  const renderContent = () => {
    switch (currentView) {
      case 'staff_management':
        return (
          <StaffManagement 
            onBack={() => setCurrentView('dashboard')} 
            staffList={staffList}
            setStaffList={setStaffList}
          />
        );
      case 'students':
        return (
          <StudentManagement 
            onBack={() => setCurrentView('dashboard')}
            students={students}
            setStudents={setStudents}
            canModify={isAdmin}
          />
        );
      case 'admissions':
        return (
          <StudentManagement 
            onBack={() => setCurrentView('dashboard')}
            students={students}
            setStudents={setStudents}
            defaultView="form"
            canModify={isAdmin}
          />
        );
      case 'finance':
        return (
          <FinanceManagement 
            onBack={() => setCurrentView('dashboard')}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        );
      case 'timetable':
        return (
          <TimetableView 
            onBack={() => setCurrentView('dashboard')}
            timetable={MOCK_TIMETABLE}
          />
        );
      case 'attendance':
        return (
          <AttendanceView 
            onBack={() => setCurrentView('dashboard')}
            students={students}
          />
        );
      case 'leave_request':
        return (
          <LeaveRequestView 
            onBack={() => setCurrentView('dashboard')}
            currentUser={user}
            leaves={leaves}
            setLeaves={setLeaves}
          />
        );
      case 'dashboard':
      default:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Welcome Card */}
                <div className={`md:col-span-3 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden ${isAdmin ? 'bg-gradient-to-r from-purple-700 to-indigo-700' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
                        <p className="text-indigo-100 max-w-2xl">
                            {isAdmin 
                                ? `You are managing ${school?.name}. Here is your daily overview and administrative controls.`
                                : `Ready for today's classes at ${school?.name}? Check your schedule and student updates below.`
                            }
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <LayoutGrid className="w-64 h-64 -mr-12 -mb-12" />
                    </div>
                </div>
            </div>

            {/* Conditional Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* ADMIN DASHBOARD CARDS */}
                {isAdmin && (
                    <>
                        <DashboardCard 
                            title="New Admission" 
                            description="Enroll a new student"
                            icon={UserPlus}
                            color="text-indigo-600"
                            bgColor="bg-indigo-50"
                            onClick={() => setCurrentView('admissions')}
                        />
                        <DashboardCard 
                            title="Total Students" 
                            description="View enrollment stats & profiles"
                            icon={Users}
                            color="text-blue-600"
                            bgColor="bg-blue-50"
                            onClick={() => setCurrentView('students')}
                        />
                        <DashboardCard 
                            title="Staff Management" 
                            description="Manage teachers & payroll"
                            icon={UserCheck}
                            color="text-emerald-600"
                            bgColor="bg-emerald-50"
                            onClick={() => setCurrentView('staff_management')}
                        />
                        <DashboardCard 
                            title="Financial Overview" 
                            description="Fee collection & expenses"
                            icon={DollarSign}
                            color="text-green-600"
                            bgColor="bg-green-50"
                            onClick={() => setCurrentView('finance')}
                        />
                        <DashboardCard 
                            title="School Settings" 
                            description="Configure terms & sessions"
                            icon={ShieldCheck}
                            color="text-purple-600"
                            bgColor="bg-purple-50"
                        />
                        <DashboardCard 
                            title="Reports & Analytics" 
                            description="Generate academic reports"
                            icon={TrendingUp}
                            color="text-orange-600"
                            bgColor="bg-orange-50"
                        />
                    </>
                )}

                {/* STAFF DASHBOARD CARDS */}
                {!isAdmin && (
                    <>
                        <DashboardCard 
                            title="My Timetable" 
                            description="View daily class schedule"
                            icon={Clock}
                            color="text-blue-600"
                            bgColor="bg-blue-50"
                            onClick={() => setCurrentView('timetable')}
                        />
                        <DashboardCard 
                            title="Take Attendance" 
                            description="Mark student presence"
                            icon={UserCheck}
                            color="text-emerald-600"
                            bgColor="bg-emerald-50"
                            onClick={() => setCurrentView('attendance')}
                        />
                        <DashboardCard 
                            title="Gradebook" 
                            description="Enter marks & assignments"
                            icon={BookOpen}
                            color="text-amber-600"
                            bgColor="bg-amber-50"
                        />
                        <DashboardCard 
                            title="Student Directory" 
                            description="View student profiles"
                            icon={Users}
                            color="text-cyan-600"
                            bgColor="bg-cyan-50"
                            onClick={() => setCurrentView('students')}
                        />
                        <DashboardCard 
                            title="Leave Request" 
                            description="Apply for leave"
                            icon={FileText}
                            color="text-rose-600"
                            bgColor="bg-rose-50"
                            onClick={() => setCurrentView('leave_request')}
                        />
                    </>
                )}
                
                <DashboardCard 
                    title="Events Calendar" 
                    description="Upcoming holidays & events"
                    icon={Calendar}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                />
            </div>

            <div className="mt-12 text-center">
                <p className="text-slate-400 text-sm">
                    Faith Academy ERP v1.0 • {isAdmin ? 'Administrative Access' : 'Staff Access'}
                </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              {/* Logo Area */}
              <div className="flex-shrink-0 flex items-center">
                <div className={`w-8 h-8 rounded-lg bg-${school?.themeColor || 'indigo-600'} flex items-center justify-center text-white font-bold`}>
                  {school?.name.charAt(0)}
                </div>
                <span className="ml-2 text-xl font-bold text-slate-900 hidden md:block">
                    {school?.name}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${isAdmin ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {isAdmin ? 'Admin Portal' : 'Staff Portal'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64"
                />
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                 </div>
                 <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'}`}>
                    {user.username.charAt(0).toUpperCase()}
                 </div>
                 <button 
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                 >
                    <LogOut className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb for sub-pages */}
          {currentView !== 'dashboard' && (
             <div className="py-2 flex items-center text-sm text-slate-500">
                <span onClick={() => setCurrentView('dashboard')} className="hover:text-indigo-600 cursor-pointer">Dashboard</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="font-medium text-slate-900 capitalize">{currentView.replace('_', ' ')}</span>
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

interface DashboardCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon: Icon, color, bgColor, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group ${onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
    >
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
                <p className="text-slate-500 text-sm">{description}</p>
            </div>
            {onClick && <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />}
        </div>
    </div>
);