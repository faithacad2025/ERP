import React, { useState, useEffect } from 'react';
import { User, AttendanceStatus } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { 
  ArrowLeft, Calendar, CheckCircle, XCircle, Clock, 
  Users, Save 
} from 'lucide-react';

interface AttendanceViewProps {
  onBack: () => void;
  students: User[]; // Pass full list, we will filter locally
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onBack, students }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Map of studentId -> Status
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Extract unique grades and sections for dropdowns
  const availableGrades = Array.from(new Set(students.map(s => s.grade).filter(Boolean))) as string[];
  const availableSections = Array.from(new Set(students.map(s => s.section).filter(Boolean))) as string[];

  // Filter students based on selection
  const classStudents = students.filter(s => 
    (!selectedGrade || s.grade === selectedGrade) && 
    (!selectedSection || s.section === selectedSection) &&
    s.role === 'student' &&
    s.status === 'Active'
  );

  // Reset attendance when class changes
  useEffect(() => {
    const initialMap: Record<string, AttendanceStatus> = {};
    classStudents.forEach(s => {
      initialMap[s.id] = 'Present'; // Default to Present
    });
    setAttendanceMap(initialMap);
    setIsSubmitted(false);
  }, [selectedGrade, selectedSection]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
    setIsSubmitted(false);
  };

  const markAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    classStudents.forEach(s => {
      newMap[s.id] = status;
    });
    setAttendanceMap(newMap);
  };

  const handleSubmit = () => {
    // In a real app, this would send data to backend
    setIsSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Attendance saved for ${classStudents.length} students on ${date}`);
    }, 100);
  };

  // Stats
  const presentCount = Object.values(attendanceMap).filter(s => s === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter(s => s === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter(s => s === 'Late').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-500 text-sm">Mark daily attendance for your classes</p>
        </div>
      </div>

      {/* Controls / Filters */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input 
          label="Select Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={Calendar}
        />

        <Select 
          label="Grade"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          options={availableGrades.map(g => ({ value: g, label: `Class ${g}` }))}
          placeholder="Select Class"
        />

        <Select 
          label="Section"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          options={availableSections.map(s => ({ value: s, label: `Section ${s}` }))}
          placeholder="Select Section"
        />

        <div className="flex items-end">
           <div className="w-full bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-lg border border-indigo-100 flex justify-between items-center h-[46px]">
              <span className="text-sm font-medium">Total Students</span>
              <span className="text-xl font-bold">{classStudents.length}</span>
           </div>
        </div>
      </div>

      {classStudents.length > 0 ? (
        <>
          {/* Quick Actions & Stats */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex gap-2">
                <Button variant="secondary" className="text-xs h-8" onClick={() => markAll('Present')}>Mark All Present</Button>
                <Button variant="secondary" className="text-xs h-8" onClick={() => markAll('Absent')}>Mark All Absent</Button>
             </div>
             <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Present: {presentCount}</span>
                <span className="flex items-center text-red-600"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div> Absent: {absentCount}</span>
                <span className="flex items-center text-amber-600"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div> Late: {lateCount}</span>
             </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">Roll No: {student.rollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleStatusChange(student.id, 'Present')}
                            className={`flex flex-col items-center justify-center w-16 py-1.5 rounded-lg border transition-all ${
                              attendanceMap[student.id] === 'Present'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-1 ring-emerald-500'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] font-medium">Present</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                            className={`flex flex-col items-center justify-center w-16 py-1.5 rounded-lg border transition-all ${
                              attendanceMap[student.id] === 'Absent'
                                ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-600'
                            }`}
                          >
                            <XCircle className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] font-medium">Absent</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(student.id, 'Late')}
                            className={`flex flex-col items-center justify-center w-16 py-1.5 rounded-lg border transition-all ${
                              attendanceMap[student.id] === 'Late'
                                ? 'bg-amber-50 border-amber-200 text-amber-700 ring-1 ring-amber-500'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-amber-200 hover:text-amber-600'
                            }`}
                          >
                            <Clock className="w-5 h-5 mb-0.5" />
                            <span className="text-[10px] font-medium">Late</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                         <input 
                           type="text" 
                           placeholder="Add remark..."
                           className="w-full text-sm border-b border-slate-200 focus:border-indigo-500 focus:outline-none py-1 bg-transparent"
                         />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-100 rounded-xl border border-slate-200 border-dashed text-slate-400">
           <Users className="w-12 h-12 mb-3 opacity-50" />
           <p className="font-medium">Select a Class and Section</p>
           <p className="text-sm">Choose from the dropdowns above to view student list</p>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg transform transition-transform z-20">
         <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-slate-500 hidden sm:block">
               {isSubmitted ? (
                  <span className="text-emerald-600 font-medium flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Saved Successfully</span>
               ) : (
                  <span>Unsaved changes</span>
               )}
            </div>
            <div className="flex gap-3 ml-auto">
               <Button variant="secondary" onClick={onBack}>Cancel</Button>
               <Button onClick={handleSubmit} disabled={classStudents.length === 0}>
                  <Save className="w-4 h-4 mr-2" /> Save Attendance
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
};