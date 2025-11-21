
import React, { useState } from 'react';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  ArrowLeft, Plus, Search, Edit2, Trash2, 
  User as UserIcon, MapPin, Phone, Mail, Calendar,
  GraduationCap, Users, Droplet
} from 'lucide-react';

interface StudentManagementProps {
  onBack: () => void;
  students: User[];
  setStudents: React.Dispatch<React.SetStateAction<User[]>>;
  defaultView?: 'list' | 'form';
  canModify?: boolean;
}

type ViewMode = 'list' | 'profile' | 'form';

export const StudentManagement: React.FC<StudentManagementProps> = ({ 
  onBack, 
  students, 
  setStudents,
  defaultView = 'list',
  canModify = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView === 'form' ? 'form' : 'list');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const initialFormState: Partial<User> = {
    name: '',
    grade: '',
    section: '',
    rollNumber: '',
    email: '',
    guardianName: '',
    guardianPhone: '',
    address: '',
    status: 'Active',
    dob: '',
    bloodGroup: '',
    joinDate: new Date().toISOString().split('T')[0]
  };

  // Form State initialized based on defaultView
  const [formData, setFormData] = useState<Partial<User>>(
    defaultView === 'form' ? initialFormState : {}
  );

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.includes(searchTerm) ||
      student.guardianName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = gradeFilter ? student.grade === gradeFilter : true;
    
    return matchesSearch && matchesGrade;
  });

  const grades = Array.from(new Set(students.map(s => s.grade).filter(Boolean))) as string[];

  const handleAddNew = () => {
    setFormData(initialFormState);
    setSelectedStudent(null);
    setViewMode('form');
  };

  const handleEdit = (e: React.MouseEvent | null, student: User) => {
    if (e) e.stopPropagation();
    setFormData(student);
    setSelectedStudent(student);
    setViewMode('form');
  };

  const handleViewProfile = (student: User) => {
    setSelectedStudent(student);
    setViewMode('profile');
  };

  const handleDelete = (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this student record?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      if (viewMode !== 'list') setViewMode('list');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStudent) {
      // Update
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...formData } as User : s));
    } else {
      // Create
      const newStudent: User = {
        ...formData as User,
        id: `st_${Date.now()}`,
        role: 'student',
        schoolId: students[0]?.schoolId,
        username: formData.email?.split('@')[0] || `st_${Date.now()}`,
        joinDate: formData.joinDate || new Date().toISOString().split('T')[0]
      };
      setStudents([newStudent, ...students]);
    }
    setViewMode('list');
  };

  // --- SUB-VIEWS ---

  const renderProfile = () => {
    if (!selectedStudent) return null;
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 h-32 relative">
            <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white">
                {selectedStudent.name.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-slate-500 flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-sm font-medium">
                    Class {selectedStudent.grade}-{selectedStudent.section}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>Roll No: {selectedStudent.rollNumber}</span>
                </p>
              </div>
              {canModify && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={(e) => handleEdit(e, selectedStudent)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="secondary" className="text-red-600 border-red-100 hover:bg-red-50" onClick={(e) => handleDelete(e, selectedStudent.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Personal Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Date of Birth</p>
                      <p className="text-slate-500">{selectedStudent.dob || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Droplet className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Blood Group</p>
                      <p className="text-slate-500">{selectedStudent.bloodGroup || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Address</p>
                      <p className="text-slate-500">{selectedStudent.address || 'Not set'}</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Admission Date</p>
                      <p className="text-slate-500">{selectedStudent.joinDate || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Guardian Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <UserIcon className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Guardian Name</p>
                      <p className="text-slate-500">{selectedStudent.guardianName || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Contact Number</p>
                      <p className="text-slate-500">{selectedStudent.guardianPhone || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-medium">Email Address</p>
                      <p className="text-slate-500">{selectedStudent.email || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>

               {/* Academic Stats (Mock) */}
               <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Academic Status</h3>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-xs text-slate-500">Attendance</p>
                      <p className="text-lg font-bold text-emerald-600">92%</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-xs text-slate-500">GPA</p>
                      <p className="text-lg font-bold text-indigo-600">3.8</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-lg text-center col-span-2 flex justify-between items-center px-4">
                      <span className="text-xs text-slate-500">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedStudent.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {selectedStudent.status}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6 pb-4 border-b border-slate-100">
         <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedStudent ? 'Edit Student Profile' : 'Student Admission Form'}
            </h2>
         </div>
         <p className="text-slate-500 text-sm ml-11">
             {selectedStudent ? 'Update the student\'s academic and personal details.' : 'Complete the form below to enroll a new student into the system.'}
         </p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Academic Info */}
           <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-indigo-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
                Academic Information
              </h3>
           </div>
           <Input 
             label="Full Name" 
             required 
             value={formData.name} 
             onChange={e => setFormData({...formData, name: e.target.value})}
             placeholder="First Last"
           />
           <div className="grid grid-cols-2 gap-4">
             <Input 
               label="Grade/Class" 
               required 
               value={formData.grade} 
               onChange={e => setFormData({...formData, grade: e.target.value})}
               placeholder="e.g. X"
             />
             <Input 
               label="Section" 
               required 
               value={formData.section} 
               onChange={e => setFormData({...formData, section: e.target.value})}
               placeholder="e.g. A"
             />
           </div>
           <Input 
             label="Roll Number" 
             required 
             value={formData.rollNumber} 
             onChange={e => setFormData({...formData, rollNumber: e.target.value})}
             placeholder="e.g. 101"
           />
           <Select
             label="Admission Status"
             value={formData.status}
             onChange={e => setFormData({...formData, status: e.target.value as any})}
             options={[
               { value: 'Active', label: 'Active (Enrolled)' },
               { value: 'Inactive', label: 'Inactive' },
               { value: 'On Leave', label: 'On Leave' }
             ]}
           />

           {/* Guardian Info */}
           <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-indigo-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
                Guardian Information
              </h3>
           </div>
           <Input 
             label="Guardian Name" 
             value={formData.guardianName} 
             onChange={e => setFormData({...formData, guardianName: e.target.value})}
             placeholder="Parent/Guardian Name"
           />
           <Input 
             label="Guardian Phone" 
             value={formData.guardianPhone} 
             onChange={e => setFormData({...formData, guardianPhone: e.target.value})}
             placeholder="+91..."
           />
           <Input 
             label="Contact Email" 
             type="email"
             value={formData.email} 
             onChange={e => setFormData({...formData, email: e.target.value})}
             placeholder="parent@email.com"
           />

           {/* Personal Info */}
           <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-indigo-600 mb-3 flex items-center gap-2 uppercase tracking-wider">
                Personal Details
              </h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <Input 
               label="Date of Birth" 
               type="date"
               value={formData.dob} 
               onChange={e => setFormData({...formData, dob: e.target.value})}
               icon={Calendar}
             />
             <Input 
               label="Blood Group" 
               value={formData.bloodGroup} 
               onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
               placeholder="e.g. O+"
             />
           </div>
           <Input 
             label="Admission Date" 
             type="date"
             value={formData.joinDate} 
             onChange={e => setFormData({...formData, joinDate: e.target.value})}
             icon={Calendar}
           />
           <div className="md:col-span-2">
             <Input 
               label="Residential Address" 
               value={formData.address} 
               onChange={e => setFormData({...formData, address: e.target.value})}
               placeholder="Full address..."
             />
           </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={() => setViewMode('list')}>
            Cancel
          </Button>
          <Button type="submit">
            {selectedStudent ? 'Save Changes' : 'Complete Admission'}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => viewMode === 'list' ? onBack() : setViewMode('list')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {viewMode === 'list' ? 'Student Directory' : viewMode === 'profile' ? 'Student Profile' : 'Admissions'}
            </h1>
            {viewMode === 'list' && (
              <p className="text-slate-500 text-sm">
                {canModify ? 'Manage enrollment and student records' : 'View student details and academic records'}
              </p>
            )}
          </div>
        </div>
        {viewMode === 'list' && canModify && (
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" /> Add New Student
          </Button>
        )}
      </div>

      {/* Main Content Switcher */}
      {viewMode === 'list' ? (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, roll number or parent..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="w-full sm:w-48">
               <Select
                 label=""
                 value={gradeFilter}
                 onChange={(e) => setGradeFilter(e.target.value)}
                 options={grades.map(g => ({ value: g, label: `Class ${g}` }))}
                 placeholder="All Classes"
                 className="mt-0"
               />
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Class Info</th>
                    <th className="px-6 py-4">Guardian</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => handleViewProfile(student)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">Roll: {student.rollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-sm text-slate-900 font-medium">{student.grade} - {student.section}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                           <span className="text-slate-900">{student.guardianName}</span>
                           <span className="text-slate-500 text-xs flex items-center mt-0.5">
                             <Phone className="w-3 h-3 mr-1" /> {student.guardianPhone}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          student.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" className="px-2 py-1 h-8 text-xs cursor-pointer" onClick={() => handleViewProfile(student)}>
                             View
                          </Button>
                          {canModify && (
                            <button 
                              onClick={(e) => handleDelete(e, student.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No students found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 text-sm text-slate-500">
               Showing {filteredStudents.length} students
            </div>
          </div>
        </>
      ) : viewMode === 'profile' ? (
        renderProfile()
      ) : (
        renderForm()
      )}
    </div>
  );
};
