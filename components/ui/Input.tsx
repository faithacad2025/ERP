import React from 'react';
import { LucideIcon, Calendar } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', ...props }) => {
  
  // Automatically use Calendar icon for date inputs if no icon is provided
  const DisplayIcon = Icon || (props.type === 'date' ? Calendar : undefined);

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Automatically open the date picker on click for better UX
    if (props.type === 'date' && 'showPicker' in HTMLInputElement.prototype) {
      try {
        e.currentTarget.showPicker();
      } catch (error) {
        // Fallback or ignore if not supported/allowed in context
      }
    }
    
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <div className="w-full space-y-1">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {DisplayIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DisplayIcon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg border border-slate-300 bg-white py-2.5 
            ${DisplayIcon ? 'pl-10' : 'pl-3'} pr-3 
            text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:text-sm transition-all
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${props.type === 'date' ? 'cursor-pointer' : ''}
            ${className}
          `}
          onClick={handleClick}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};