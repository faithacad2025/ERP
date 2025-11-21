import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  icon?: LucideIcon;
  placeholder?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, icon: Icon, placeholder, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <select
          className={`
            block w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 
            ${Icon ? 'pl-10' : 'pl-3'} pr-10 
            text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:text-sm transition-all
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${props.value === '' ? 'text-slate-400' : 'text-slate-900'}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>{placeholder || 'Select an option'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};