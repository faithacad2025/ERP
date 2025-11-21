import React, { useState } from 'react';
import { User, LeaveRequest, LeaveType, LeaveStatus } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  ArrowLeft, Calendar, Clock, CheckCircle, XCircle, 
  AlertCircle, FileText, Plus, History, User as UserIcon, Check, X
} from 'lucide-react';

interface LeaveRequestViewProps {
  onBack: () => void;
  currentUser: User;
  leaves: LeaveRequest[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  users: User[];
}

export const LeaveRequestView: React.FC<LeaveRequestViewProps> = ({ onBack, currentUser, leaves, setLeaves, users }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'pending'>('new');
  
  const [formData, setFormData] = useState<{
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }>({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [error, setError] = useState<string | null>(null);
  const isAdmin = currentUser.role === 'admin';

  // --- Helper Functions ---
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return diffDays;
  };

  // --- Filters ---
  // Staff: Own leaves
  const myLeaves = leaves.filter(l => l.userId === currentUser.id).sort((a, b) => 
    new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
  );

  // Admin: Pending requests from everyone
  const pendingRequests = leaves.filter(l => l.status === 'Pending').sort((a, b) => 
    new Date(a.appliedOn).getTime() - new Date(b.appliedOn).getTime()
  );

  // Admin: All history
  const allHistory = leaves.filter(l => l.status !== 'Pending').sort((a, b) => 
    new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
  );

  // --- Notifications for Staff ---
  const recentUpdates = myLeaves.filter(l => l.status !== 'Pending').slice(0, 1); // Just show the latest one

  // --- Handlers ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('Please fill in all required fields.');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    const newLeave: LeaveRequest = {
      id: `lr_${Date.now()}`,
      userId: currentUser.id,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setLeaves([newLeave, ...leaves]);
    setActiveTab('history');
    setFormData({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const handleAction = (id: string, status: LeaveStatus) => {
    if (!window.confirm(`Are you sure you want to ${status === 'Approved' ? 'Approve' : 'Reject'} this request?`)) return;
    
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  // --- Renders ---

  const renderStatusBadge = (status: string) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
      status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
      'bg-amber-50 text-amber-700 border-amber-200'
    }`}>
      {status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1" />}
      {status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
      {status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
      {status}
    </span>
  );

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
            <h1 className="text-2xl font-bold text-slate-900">{isAdmin ? 'Leave Management' : 'Leave Portal'}</h1>
            <p className="text-slate-500 text-sm">{isAdmin ? 'Review and act on staff leave requests' : 'Apply for leave and track status'}</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-white rounded-xl border border-slate-200 w-full sm:w-fit overflow-x-auto">
          {!isAdmin && (
            <button 
              onClick={() => setActiveTab('new')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'new' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Plus className="w-4 h-4" />
              Apply
            </button>
          )}
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'pending' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Pending ({pendingRequests.length})
            </button>
          )}
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'history' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            {isAdmin ? 'All History' : 'My History'}
          </button>
        </div>
      </div>

      {/* Staff Notification Banner */}
      {!isAdmin && recentUpdates.length > 0 && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
          recentUpdates[0].status === 'Approved' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-red-50 border-red-100 text-red-800'
        }`}>
          {recentUpdates[0].status === 'Approved' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          <div>
            <p className="font-semibold">Update on your Leave Request</p>
            <p className="text-sm opacity-90 mt-1">
              Your {recentUpdates[0].type} for {recentUpdates[0].startDate} has been <strong>{recentUpdates[0].status}</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          
          {/* ADMIN: Pending Requests */}
          {isAdmin && activeTab === 'pending' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-900">Requests requiring action</h3>
                 <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">{pendingRequests.length} Pending</span>
               </div>
               <div className="divide-y divide-slate-100">
                 {pendingRequests.length > 0 ? pendingRequests.map((leave) => (
                   <div key={leave.id} className="p-6 hover:bg-slate-50 transition-colors">
                     <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                             <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="font-medium text-slate-900">{getUserName(leave.userId)}</p>
                             <p className="text-xs text-slate-500">{leave.type} • Applied: {leave.appliedOn}</p>
                          </div>
                       </div>
                       <div className="bg-slate-100 px-3 py-1 rounded text-sm font-medium text-slate-600">
                          {calculateDuration(leave.startDate, leave.endDate)} Days
                       </div>
                     </div>
                     <div className="ml-13 pl-13 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700 mb-2 bg-slate-50 p-2 rounded border border-slate-100 w-fit">
                           <Calendar className="w-4 h-4 text-slate-400" />
                           <span>{leave.startDate}</span>
                           <span className="text-slate-300">→</span>
                           <span>{leave.endDate}</span>
                        </div>
                        <p className="text-slate-600 text-sm italic">"{leave.reason}"</p>
                     </div>
                     <div className="flex gap-3 justify-end">
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(leave.id, 'Rejected')}>
                           <X className="w-4 h-4 mr-2" /> Reject
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleAction(leave.id, 'Approved')}>
                           <Check className="w-4 h-4 mr-2" /> Approve
                        </Button>
                     </div>
                   </div>
                 )) : (
                   <div className="p-12 text-center text-slate-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-200" />
                      <p className="font-medium text-slate-900">All caught up!</p>
                      <p className="text-sm">No pending leave requests.</p>
                   </div>
                 )}
               </div>
            </div>
          )}

          {/* ADMIN & STAFF: History */}
          {((isAdmin && activeTab === 'history') || (!isAdmin && activeTab === 'history')) && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50">
                 <h3 className="font-semibold text-slate-900">Leave History</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       {isAdmin && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Staff Name</th>}
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type & Reason</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {(isAdmin ? allHistory : myLeaves).length > 0 ? (isAdmin ? allHistory : myLeaves).map((leave) => (
                       <tr key={leave.id} className="hover:bg-slate-50">
                         {isAdmin && (
                           <td className="px-6 py-4 font-medium text-slate-900">
                             {getUserName(leave.userId)}
                           </td>
                         )}
                         <td className="px-6 py-4">
                           <span className="font-medium text-slate-900">{leave.type}</span>
                           <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{leave.reason}</p>
                         </td>
                         <td className="px-6 py-4 text-sm text-slate-600">
                           {calculateDuration(leave.startDate, leave.endDate)} Days
                         </td>
                         <td className="px-6 py-4 text-sm text-slate-600">
                           <div className="flex flex-col">
                             <span>From: {leave.startDate}</span>
                             <span>To: &nbsp;&nbsp;&nbsp;&nbsp;{leave.endDate}</span>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           {renderStatusBadge(leave.status)}
                         </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-slate-500">
                           No leave records found.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* STAFF: New Request Form */}
          {!isAdmin && activeTab === 'new' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">New Leave Request</h2>
                <p className="text-slate-500 text-sm">Submit your request for approval.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <Select
                     label="Leave Type"
                     value={formData.type}
                     onChange={e => setFormData({...formData, type: e.target.value as LeaveType})}
                     options={[
                       { value: 'Casual Leave', label: 'Casual Leave' },
                       { value: 'Sick Leave', label: 'Sick Leave' },
                       { value: 'Emergency Leave', label: 'Emergency Leave' },
                       { value: 'Unpaid Leave', label: 'Unpaid Leave' },
                     ]}
                   />
                   <div className="hidden md:block"></div> {/* Spacer */}
                   
                   <Input 
                     label="Start Date"
                     type="date"
                     required
                     value={formData.startDate}
                     onChange={e => setFormData({...formData, startDate: e.target.value})}
                     icon={Calendar}
                   />
                   
                   <Input 
                     label="End Date"
                     type="date"
                     required
                     value={formData.endDate}
                     onChange={e => setFormData({...formData, endDate: e.target.value})}
                     icon={Calendar}
                   />
                </div>

                {formData.startDate && formData.endDate && (
                   <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Total Duration: {calculateDuration(formData.startDate, formData.endDate)} Days
                   </div>
                )}

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Reason for Leave</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:text-sm transition-all h-32 resize-none"
                    placeholder="Please provide a valid reason..."
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="px-8">
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
             <h3 className="text-lg font-semibold mb-4">{isAdmin ? 'Today\'s Overview' : 'Leave Balance'}</h3>
             <div className="space-y-4">
                {isAdmin ? (
                  <>
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <span>Staff on Leave</span>
                      <span className="font-bold text-xl">3</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <span>Pending Requests</span>
                      <span className="font-bold text-xl">{pendingRequests.length}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <span>Casual Leave</span>
                      <span className="font-bold text-xl">8/12</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <span>Sick Leave</span>
                      <span className="font-bold text-xl">5/10</span>
                    </div>
                  </>
                )}
             </div>
             {!isAdmin && <p className="text-xs text-indigo-200 mt-4">* Balances reset at the end of the academic year.</p>}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
               <AlertCircle className="w-4 h-4 mr-2 text-indigo-600" />
               Leave Policy
             </h3>
             <ul className="space-y-3 text-sm text-slate-600 list-disc pl-4">
                <li>Leaves must be applied at least 2 days in advance for Casual Leaves.</li>
                <li>Medical Certificate is mandatory for Sick Leaves exceeding 2 days.</li>
                <li>Approvals are subject to availability of substitute staff.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};