import React, { useState } from 'react';
import { Transaction, TransactionType } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  ArrowLeft, Plus, Search, TrendingUp, TrendingDown, 
  Filter, Download, Wallet, CreditCard, 
  Calendar
} from 'lucide-react';

interface FinanceManagementProps {
  onBack: () => void;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const FinanceManagement: React.FC<FinanceManagementProps> = ({ onBack, transactions, setTransactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState<{
    type: TransactionType;
    amount: string;
    category: string;
    description: string;
    paymentMethod: string;
    date: string;
  }>({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    paymentMethod: 'Bank Transfer',
    date: new Date().toISOString().split('T')[0]
  });

  // Calculations for KPI Cards
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      status: 'Completed',
      paymentMethod: formData.paymentMethod
    };

    setTransactions([newTransaction, ...transactions]);
    setShowForm(false);
    setFormData({
      type: 'income',
      amount: '',
      category: '',
      description: '',
      paymentMethod: 'Bank Transfer',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

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
            <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
            <p className="text-slate-500 text-sm">Track fees, expenses, and revenue</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="hidden sm:flex">
            <Download className="w-4 h-4 mr-2" /> Report
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" /> New Transaction
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalIncome)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalExpense)}</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Net Balance</p>
              <h3 className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                {formatCurrency(netBalance)}
              </h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <span className="text-emerald-600 font-medium">+12%</span> from last month
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md animate-in fade-in zoom-in-95">
          <h3 className="font-semibold text-lg mb-4">Record New Transaction</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="col-span-1 md:col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
               <div className="flex gap-4">
                 <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-colors ${formData.type === 'income' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'hover:bg-slate-50'}`}>
                   <input 
                     type="radio" 
                     name="type" 
                     className="hidden"
                     checked={formData.type === 'income'} 
                     onChange={() => setFormData({...formData, type: 'income'})} 
                   />
                   <TrendingUp className="w-4 h-4" /> Income
                 </label>
                 <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-colors ${formData.type === 'expense' ? 'bg-red-50 border-red-200 text-red-700' : 'hover:bg-slate-50'}`}>
                   <input 
                     type="radio" 
                     name="type" 
                     className="hidden"
                     checked={formData.type === 'expense'} 
                     onChange={() => setFormData({...formData, type: 'expense'})} 
                   />
                   <TrendingDown className="w-4 h-4" /> Expense
                 </label>
               </div>
             </div>

             <Input 
               label="Amount (₹)" 
               type="number" 
               required 
               value={formData.amount} 
               onChange={e => setFormData({...formData, amount: e.target.value})}
               placeholder="0.00"
             />

             <Input 
               label="Date" 
               type="date" 
               required 
               value={formData.date} 
               onChange={e => setFormData({...formData, date: e.target.value})}
               icon={Calendar}
             />

             <Input 
               label="Category" 
               required 
               value={formData.category} 
               onChange={e => setFormData({...formData, category: e.target.value})}
               placeholder={formData.type === 'income' ? "e.g. Tuition Fees" : "e.g. Maintenance"}
             />

             <Input 
               label="Description" 
               required 
               value={formData.description} 
               onChange={e => setFormData({...formData, description: e.target.value})}
               placeholder="Enter details..."
             />

             <Select 
               label="Payment Method"
               value={formData.paymentMethod}
               onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
               icon={CreditCard}
               options={[
                 { value: 'Cash', label: 'Cash' },
                 { value: 'Bank Transfer', label: 'Bank Transfer' },
                 { value: 'UPI', label: 'UPI' },
                 { value: 'Cheque', label: 'Cheque' }
               ]}
             />

             <div className="md:col-span-2 flex justify-end gap-2 mt-2">
               <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
               <Button type="submit">Save Transaction</Button>
             </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Filter Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterType('income')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'income' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Income
              </button>
              <button 
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'expense' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Expenses
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-48"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{t.description}</p>
                        <p className="text-xs text-slate-500">{t.paymentMethod}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      {t.date}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`px-6 py-3 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};