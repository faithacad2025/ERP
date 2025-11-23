
import React, { useState } from 'react';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  ArrowLeft, Plus, Search, Mail, Phone, Briefcase, 
  Edit2, Trash2, Filter, CheckCircle, X, ShieldOff, Briefcase as BriefcaseIcon,
  Calendar
} from 'lucide-react';

interface StaffManagementProps {
  onBack: () => void;
  staffList: User[];
  setStaffList: React.Dispatch<React.SetStateAction<User[]>>;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ onBack, staffList, setStaffList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    // For new users only
    password: ''
  });

  const filteredStaff = staffList.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      phone: '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      password: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing staff
      setStaffList(prev => prev.map(staff => {
        if (staff.id === editingId) {
          return {
            ...staff,
            name: formData.name,
            email: formData.email,
            department: formData.department,
            phone: formData.phone,
            status: formData.status as 'Active' | 'Inactive' | 'On Leave',
            joinDate: formData.joinDate
          };
        }
        return staff;
      }));
    } else {
      // Create new staff
      const username = formData.email.split('@')[0] || `user_${Date.now()}`;
      const staffMember: User = {
        id: `new_${Date.now()}`,
        username: username,
        password: formData.password || username, // Default password is username if not provided
        name: formData.name,
        role: 'staff',
        schoolId: staffList[0]?.schoolId, // Inherit from list context
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        joinDate: formData.joinDate,
        status: formData.status as 'Active' | 'Inactive' | 'On Leave'
      };
      setStaffList([staffMember, ...staffList]);
    }
    
    resetForm();
  };

  const handleEditClick = (staff: User) => {
    setFormData({
      name: staff.name,
      email: staff.email || '',
      department: staff.department || '',
      phone: staff.phone || '',
      status: staff.status || 'Active',
      joinDate: staff.joinDate || new Date().toISOString().split('T')[0],
      password: '' // Don't show password on edit
    });
    setEditingId(staff.id);
    setShowForm(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      setStaffList(prev => prev.filter(staff => staff.id !== id));
      // Also remove from selection if present
      if (selectedIds.has(id)) {
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
      }
    }
  };

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStaff.length && filteredStaff.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStaff.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Bulk Actions
  const handleBulkDeactivate = () => {
    if (window.confirm(`Are you sure you want to deactivate ${selectedIds.size} staff members?`)) {
      setStaffList(prev => prev.map(s => selectedIds.has(s.id) ? { ...s, status: 'Inactive' } : s));
      setSelectedIds(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to DELETE ${selectedIds.size} staff members? This cannot be undone.`)) {
      setStaffList(prev => prev.filter(s => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
    }
  };

  const handleBulkAssignDept = () => {
    const newDept = window.prompt('Enter the new department name for selected staff:');
    if (newDept && newDept.trim() !== '') {
      setStaffList(prev => prev.map(s => selectedIds.has(s.id) ? { ...s, department: newDept.trim() } : s));
      setSelectedIds(new Set());
    }
  };

  const isAllSelected = filteredStaff.length > 0 && filteredStaff.every(s => selectedIds.has(s.id));

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
            <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
            <p className="text-slate-500 text-sm">Manage teachers and administrative staff</p>
          </div>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add New Staff
        </Button>
      </div>

      {/* Bulk Actions or Search Bar */}
      {selectedIds.size > 0 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-50 p-3 px-4 rounded-xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 font-medium text-indigo-900">
             <span className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded text-sm">{selectedIds.size} Selected</span>
             <span className="text-sm hidden sm:inline">staff members</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <Button variant="secondary" className="text-xs h-9 whitespace-nowrap" onClick={handleBulkAssignDept}>
              <BriefcaseIcon className="w-3.5 h-3.5 mr-1.5" /> Assign Dept
            </Button>
            <Button variant="secondary" className="text-xs h-9 whitespace-nowrap text-amber-700 border-amber-200 hover:bg-amber-50" onClick={handleBulkDeactivate}>
              <ShieldOff className="w-3.5 h-3.5 mr-1.5" /> Deactivate
            </Button>
            <Button variant="secondary" className="text-xs h-9 whitespace-nowrap text-red-700 border-red-200 hover:bg-red-50" onClick={handleBulkDelete}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
            </Button>
            <div className="w-px h-6 bg-indigo-200 mx-1"></div>
            <button onClick={() => setSelectedIds(new Set())} className="p-2 text-indigo-400 hover:text-indigo-700 transition-colors">
               <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>
      )}

      {/* Add/Edit Staff Form (Collapsible) */}
      {showForm && (
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-in fade-in zoom-in-95 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
              {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <button onClick={resetForm} className="text-indigo-400 hover:text-indigo-700 text-sm">Cancel</button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Full Name" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Doe"
            />
            <Input 
              label="Email Address" 
              type="email"
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="john@school.edu"
            />
            <Input 
              label="Department" 
              required 
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
              placeholder="e.g. Mathematics"
            />
            <Input 
              label="Phone Number" 
              required 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 98765 43210"
            />
            <Input 
              label="Joining Date" 
              type="date"
              required 
              value={formData.joinDate}
              onChange={e => setFormData({...formData, joinDate: e.target.value})}
              icon={Calendar}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              icon={CheckCircle}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
            />
            {!editingId && (
               <div className="md:col-span-2 mt-2 bg-white/50 p-3 rounded-lg border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-medium mb-1">Login Credentials</p>
                  <p className="text-xs text-slate-500">The username will be the email prefix. The default password will be the same as the username.</p>
               </div>
            )}
            <div className="md:col-span-2 flex justify-end mt-2 pt-2 border-t border-indigo-100">
              <Button type="submit">
                {editingId ? 'Update Staff Member' : 'Create Account'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-4 py-4 w-10">
                   <input 
                     type="checkbox" 
                     className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                     checked={isAllSelected}
                     onChange={toggleSelectAll}
                   />
                </th>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length > 0 ? filteredStaff.map((staff) => (
                <tr key={staff.id} className={`transition-colors ${selectedIds.has(staff.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80'}`}>
                  <td className="px-4 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      checked={selectedIds.has(staff.id)}
                      onChange={() => toggleSelect(staff.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{staff.name}</p>
                        <p className="text-xs text-slate-500">Joined {staff.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        {staff.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        {staff.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-slate-100 text-slate-800">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {staff.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      staff.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : staff.status === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        staff.status === 'Active' ? 'bg-emerald-500' : staff.status === 'On Leave' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></span>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(staff)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer" 
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, staff.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p>No staff members found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {filteredStaff.length} staff members</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 text-sm border border-slate-300 rounded bg-white text-slate-400 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1 text-sm border border-slate-300 rounded bg-white text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
