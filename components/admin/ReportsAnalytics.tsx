
import React, { useState } from 'react';
import { User, Transaction } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { 
  ArrowLeft, Download, TrendingUp, TrendingDown, 
  Users, BookOpen, DollarSign, PieChart, BarChart3, Calendar
} from 'lucide-react';

interface ReportsAnalyticsProps {
  onBack: () => void;
  students: User[];
  transactions: Transaction[];
  staffList: User[];
}

type ReportType = 'academic' | 'financial' | 'attendance';

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ 
  onBack, 
  students, 
  transactions,
  staffList 
}) => {
  const [activeTab, setActiveTab] = useState<ReportType>('academic');
  const [timeRange, setTimeRange] = useState('This Month');

  // --- Helpers for Mock Calculations ---

  // Financial Calcs
  const totalRevenue = transactions
    .filter(t => t.type === 'income' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Academic Calcs (Mocked based on student count)
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  
  // --- Custom CSS Charts ---

  const SimpleBarChart = ({ data, color, maxVal }: { data: { label: string; value: number }[], color: string, maxVal: number }) => (
    <div className="flex items-end justify-between h-48 gap-2 mt-4">
      {data.map((item, idx) => {
        const heightPercentage = (item.value / maxVal) * 100;
        return (
          <div key={idx} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
            <div className="relative w-full flex justify-center items-end h-full">
              <div 
                className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${color} opacity-80 group-hover:opacity-100`}
                style={{ height: `${heightPercentage}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity z-10">
                  {item.value}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium truncate w-full text-center">{item.label}</span>
          </div>
        );
      })}
    </div>
  );

  const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
      <p className="text-xs text-slate-400 mt-2">{subtext}</p>
    </div>
  );

  // --- Content Renders ---

  const renderAcademicReport = () => {
    // Mock Data
    const gradeDistribution = [
      { label: 'A Grade', value: 45 },
      { label: 'B Grade', value: 30 },
      { label: 'C Grade', value: 15 },
      { label: 'D Grade', value: 8 },
      { label: 'Fail', value: 2 },
    ];

    const classPerformance = [
      { label: 'Class X', value: 88 },
      { label: 'Class IX', value: 76 },
      { label: 'Class VIII', value: 82 },
      { label: 'Class VII', value: 79 },
      { label: 'Class VI', value: 85 },
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Avg. GPA" 
            value="3.4" 
            subtext="Across all grades"
            icon={BookOpen}
            trend={2.5}
          />
          <StatCard 
            title="Pass Percentage" 
            value="96%" 
            subtext="Last term exams"
            icon={TrendingUp}
            trend={1.2}
          />
          <StatCard 
            title="Total Enrollment" 
            value={totalStudents} 
            subtext={`${activeStudents} Active Students`}
            icon={Users}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Overall Grade Distribution</h3>
            <p className="text-sm text-slate-500 mb-6">Based on recent term examinations</p>
            <SimpleBarChart data={gradeDistribution} color="bg-indigo-500" maxVal={50} />
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Average Performance by Class</h3>
            <p className="text-sm text-slate-500 mb-6">Average marks percentage</p>
            <SimpleBarChart data={classPerformance} color="bg-emerald-500" maxVal={100} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-200">
             <h3 className="font-semibold text-slate-900">Top Performers (Class X)</h3>
           </div>
           <table className="w-full text-left">
             <thead className="bg-slate-50 text-xs uppercase text-slate-500">
               <tr>
                 <th className="px-6 py-3">Rank</th>
                 <th className="px-6 py-3">Student Name</th>
                 <th className="px-6 py-3">Percentage</th>
                 <th className="px-6 py-3">Remarks</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 text-sm">
               <tr>
                 <td className="px-6 py-3 font-bold text-indigo-600">#1</td>
                 <td className="px-6 py-3">Rohan Das</td>
                 <td className="px-6 py-3">98.5%</td>
                 <td className="px-6 py-3 text-emerald-600">Excellent</td>
               </tr>
               <tr>
                 <td className="px-6 py-3 font-bold text-indigo-600">#2</td>
                 <td className="px-6 py-3">Priya Kumari</td>
                 <td className="px-6 py-3">97.2%</td>
                 <td className="px-6 py-3 text-emerald-600">Outstanding</td>
               </tr>
             </tbody>
           </table>
        </div>
      </div>
    );
  };

  const renderFinancialReport = () => {
    const monthlyRevenue = [
      { label: 'Jan', value: 450000 },
      { label: 'Feb', value: 380000 },
      { label: 'Mar', value: totalRevenue }, // Use real mock data for current
      { label: 'Apr', value: 410000 },
    ];

    const pendingFees = totalStudents * 20000 - totalRevenue; // Simple mock logic

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`₹${(totalRevenue/100000).toFixed(1)}L`} 
            subtext="This academic year"
            icon={DollarSign}
            trend={12}
          />
          <StatCard 
            title="Total Expenses" 
            value={`₹${(totalExpenses/100000).toFixed(1)}L`} 
            subtext="Salaries & Maintenance"
            icon={TrendingDown}
          />
          <StatCard 
            title="Fee Collection" 
            value="78%" 
            subtext="Completion rate"
            icon={PieChart}
            trend={-4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Revenue Trends</h3>
            <p className="text-sm text-slate-500 mb-6">Monthly fee collection breakdown</p>
            <SimpleBarChart data={monthlyRevenue} color="bg-indigo-600" maxVal={500000} />
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
             <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke="#4f46e5" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="100" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-3xl font-bold text-slate-900">78%</span>
                   <span className="text-xs text-slate-500 uppercase">Collected</span>
                </div>
             </div>
             <h3 className="font-semibold text-slate-900">Fee Status</h3>
             <p className="text-sm text-slate-500 mt-1">Total Outstanding: <span className="text-red-500 font-semibold">₹{(pendingFees/100000).toFixed(2)}L</span></p>
             <Button variant="outline" className="mt-6 w-full text-xs">Send Reminders</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendanceReport = () => {
    const staffAttendance = [
      { label: 'Mon', value: 98 },
      { label: 'Tue', value: 96 },
      { label: 'Wed', value: 95 },
      { label: 'Thu', value: 92 },
      { label: 'Fri', value: 88 },
    ];

    const studentAttendance = [
      { label: 'Mon', value: 92 },
      { label: 'Tue', value: 94 },
      { label: 'Wed', value: 91 },
      { label: 'Thu', value: 89 },
      { label: 'Fri', value: 85 },
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-semibold text-slate-900 mb-2">Staff Attendance (Weekly)</h3>
               <p className="text-sm text-slate-500 mb-6">Average: 94%</p>
               <SimpleBarChart data={staffAttendance} color="bg-purple-500" maxVal={100} />
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-semibold text-slate-900 mb-2">Student Attendance (Weekly)</h3>
               <p className="text-sm text-slate-500 mb-6">Average: 90.2%</p>
               <SimpleBarChart data={studentAttendance} color="bg-blue-500" maxVal={100} />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
            <p className="text-slate-500 text-sm">Deep dive into school performance metrics</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Select
             label=""
             value={timeRange}
             onChange={(e) => setTimeRange(e.target.value)}
             options={[
                { value: 'This Month', label: 'This Month' },
                { value: 'Last Month', label: 'Last Month' },
                { value: 'This Year', label: 'This Academic Year' }
             ]}
             className="w-40 mt-0"
             icon={Calendar}
           />
           <Button variant="secondary" onClick={() => alert("Exporting report as PDF...")}>
             <Download className="w-4 h-4 mr-2" /> Export
           </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
         <div className="flex gap-6">
            <button 
               onClick={() => setActiveTab('academic')}
               className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'academic' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
               }`}
            >
               <BarChart3 className="w-4 h-4 inline-block mr-2" />
               Academic
               {activeTab === 'academic' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
            <button 
               onClick={() => setActiveTab('financial')}
               className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'financial' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
               }`}
            >
               <DollarSign className="w-4 h-4 inline-block mr-2" />
               Financial
               {activeTab === 'financial' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
            <button 
               onClick={() => setActiveTab('attendance')}
               className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'attendance' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
               }`}
            >
               <Users className="w-4 h-4 inline-block mr-2" />
               Attendance
               {activeTab === 'attendance' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="py-2">
         {activeTab === 'academic' && renderAcademicReport()}
         {activeTab === 'financial' && renderFinancialReport()}
         {activeTab === 'attendance' && renderAttendanceReport()}
      </div>

    </div>
  );
};
