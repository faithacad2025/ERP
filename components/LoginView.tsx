import React, { useState } from 'react';
import { User, LoginCredentials } from '../types';
import { SCHOOLS, TEST_CREDENTIALS } from '../constants';
import { login } from '../services/authService';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Building2, Lock, User as UserIcon, GraduationCap, ArrowRight, Info, ShieldCheck, Users } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

type LoginRole = 'admin' | 'staff';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [loginRole, setLoginRole] = useState<LoginRole>('admin');
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
    schoolId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const fillTestCredentials = () => {
    const creds = loginRole === 'admin' ? TEST_CREDENTIALS.ADMIN : TEST_CREDENTIALS.STAFF;
    setFormData({
      username: creds.username,
      password: creds.password,
      schoolId: SCHOOLS[0].id,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(formData);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSchool = SCHOOLS.find(s => s.id === formData.schoolId);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-white p-12 max-w-xl">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <GraduationCap className="w-10 h-10 text-indigo-300" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Faith Academy ERP</h1>
            </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Excellence in <span className="text-indigo-300">School Management</span>
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
            Streamline administration, enhance learning, and connect your educational community with our comprehensive enterprise solution.
          </p>
          
          {/* Dynamic School Preview if selected */}
          {selectedSchool && (
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4">
              <p className="text-sm text-indigo-200 uppercase tracking-wider font-semibold mb-2">Logging in to</p>
              <h3 className="text-2xl font-bold text-white">{selectedSchool.name}</h3>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
          
          <div className="text-center space-y-2">
            <div className="inline-flex lg:hidden items-center justify-center p-3 bg-indigo-100 rounded-xl mb-4">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">Select your role to login.</p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => { setLoginRole('admin'); setFormData(prev => ({...prev, username: '', password: ''})); setError(null); }}
              className={`flex items-center justify-center py-2.5 text-sm font-medium rounded-md transition-all ${
                loginRole === 'admin' 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setLoginRole('staff'); setFormData(prev => ({...prev, username: '', password: ''})); setError(null); }}
              className={`flex items-center justify-center py-2.5 text-sm font-medium rounded-md transition-all ${
                loginRole === 'staff' 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Staff
            </button>
          </div>

          {/* Dev Mode Helper - Dynamic based on role */}
          <div className={`border rounded-lg p-4 text-sm flex flex-col gap-2 transition-colors ${loginRole === 'admin' ? 'bg-purple-50 border-purple-100 text-purple-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
            <div className="flex items-center gap-2 font-semibold">
              <Info className="w-4 h-4" />
              <span>Development Mode ({loginRole === 'admin' ? 'Admin' : 'Staff'})</span>
            </div>
            <p className="opacity-80">Use these credentials to test:</p>
            <ul className="list-disc list-inside opacity-90 pl-1">
              <li>User: <strong>{loginRole === 'admin' ? TEST_CREDENTIALS.ADMIN.username : TEST_CREDENTIALS.STAFF.username}</strong></li>
              <li>Pass: <strong>{loginRole === 'admin' ? TEST_CREDENTIALS.ADMIN.password : TEST_CREDENTIALS.STAFF.password}</strong></li>
            </ul>
            <button
              type="button"
              onClick={fillTestCredentials}
              className={`mt-2 text-xs font-medium py-1.5 px-3 rounded-md transition-colors self-start ${loginRole === 'admin' ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
            >
              Auto-fill {loginRole === 'admin' ? 'Admin' : 'Staff'} Credentials
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start animate-in fade-in slide-in-from-top-2">
              <span className="font-medium mr-1">Error:</span> {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Select
              label="Select School"
              name="schoolId"
              value={formData.schoolId}
              onChange={handleInputChange}
              icon={Building2}
              placeholder="Choose your institution..."
              options={SCHOOLS.map(s => ({ value: s.id, label: s.name }))}
              required
            />

            <Input
              label="Username or Email"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              icon={UserIcon}
              placeholder="Enter your ID"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              icon={Lock}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors" />
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full text-base py-3" isLoading={isLoading}>
               {isLoading ? 'Authenticating...' : (
                   <span className="flex items-center">
                       Sign in as {loginRole === 'admin' ? 'Admin' : 'Staff'} <ArrowRight className="ml-2 w-4 h-4" />
                   </span>
               )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};