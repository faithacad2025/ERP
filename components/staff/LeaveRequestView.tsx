
import React, { useState } from 'react';
import { User, LeaveRequest, LeaveType } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  ArrowLeft, Calendar, Clock, CheckCircle, XCircle, 
  AlertCircle, FileText, Plus, History
} from 'lucide-react';

interface LeaveRequestViewProps {
  onBack: () => void;
  currentUser: User;
  leaves: LeaveRequest[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
}

export const LeaveRequestView: React.FC<LeaveRequestViewProps> = ({ onBack, currentUser, leaves, setLeaves }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
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

  // Filter leaves for current user
  const myLeaves = leaves.filter(l => l.userId === currentUser.id).sort((a, b) => 
    new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime()
  );

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return diffDays;
  };

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Portal</h1>
          <p className="text-slate-500 text-sm">Apply for leave and track status</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white rounded-xl border border-slate-200 w-full sm:w-fit">
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'new' 
              ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'history' 
              ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          Leave History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {activeTab === 'new' ? (
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
                   />
                   
                   <Input 
                     label="End Date"
                     type="date"
                     required
                     value={formData.endDate}
                     onChange={e => setFormData({...formData, endDate: e.target.value})}
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
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {myLeaves.length > 0 ? myLeaves.map((leave) => (
                       <tr key={leave.id} className="hover:bg-slate-50">
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
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                             leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                             leave.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                             'bg-amber-50 text-amber-700 border-amber-200'
                           }`}>
                             {leave.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                             {leave.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                             {leave.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                             {leave.status}
                           </span>
                         </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                           No leave history found.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>

        {/* Right Side Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
             <h3 className="text-lg font-semibold mb-4">Leave Balance</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                   <span>Casual Leave</span>
                   <span className="font-bold text-xl">8/12</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                   <span>Sick Leave</span>
                   <span className="font-bold text-xl">5/10</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                   <span>Unpaid Leave</span>
                   <span className="font-bold text-xl">--</span>
                </div>
             </div>
             <p className="text-xs text-indigo-200 mt-4">* Balances reset at the end of the academic year.</p>
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
