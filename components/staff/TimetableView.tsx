
import React, { useState } from 'react';
import { TimeSlot } from '../../types';
import { ArrowLeft, Clock, MapPin, Calendar, BookOpen, Beaker, Coffee, Users } from 'lucide-react';

interface TimetableViewProps {
  onBack: () => void;
  timetable: TimeSlot[];
}

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const TimetableView: React.FC<TimetableViewProps> = ({ onBack, timetable }) => {
  const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Default to current day, or Monday if Sunday
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as string;
  const defaultDay = days.includes(today as Day) ? (today as Day) : 'Monday';
  
  const [selectedDay, setSelectedDay] = useState<Day>(defaultDay);

  const daySchedule = timetable
    .filter(slot => slot.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getIconForType = (type: TimeSlot['type']) => {
    switch (type) {
      case 'Lab': return <Beaker className="w-5 h-5 text-purple-600" />;
      case 'Break': return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'Activity': return <Users className="w-5 h-5 text-emerald-600" />;
      default: return <BookOpen className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColorsForType = (type: TimeSlot['type']) => {
    switch (type) {
      case 'Lab': return 'bg-purple-50 border-purple-100 hover:border-purple-200';
      case 'Break': return 'bg-amber-50 border-amber-100 hover:border-amber-200 opacity-80';
      case 'Activity': return 'bg-emerald-50 border-emerald-100 hover:border-emerald-200';
      default: return 'bg-blue-50 border-blue-100 hover:border-blue-200';
    }
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
          <h1 className="text-2xl font-bold text-slate-900">My Timetable</h1>
          <p className="text-slate-500 text-sm">Weekly class schedule and room allocation</p>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto no-scrollbar gap-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[100px] py-3 px-4 rounded-lg text-sm font-medium transition-all text-center whitespace-nowrap
              ${selectedDay === day 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
        <h3 className="font-semibold text-lg text-slate-800 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Schedule for {selectedDay}
        </h3>

        <div className="relative pl-4 space-y-6">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

            {daySchedule.length > 0 ? daySchedule.map((slot) => (
                <div key={slot.id} className="relative flex gap-6 group">
                    {/* Time Column */}
                    <div className="w-24 flex-shrink-0 pt-1">
                        <div className="flex items-center gap-1.5 text-slate-900 font-semibold bg-white relative z-10">
                            <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ${
                                slot.type === 'Break' ? 'bg-amber-400' : 'bg-indigo-500'
                            }`}></div>
                            {slot.startTime}
                        </div>
                        <div className="pl-4 text-xs text-slate-400 mt-1">{slot.endTime}</div>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 p-4 rounded-xl border transition-all ${getColorsForType(slot.type)}`}>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    {getIconForType(slot.type)}
                                    {slot.subject}
                                </h4>
                                {slot.type !== 'Break' && (
                                    <p className="text-slate-600 font-medium">
                                        Class {slot.grade} - {slot.section}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center text-xs font-medium px-2.5 py-1 bg-white/60 rounded-md text-slate-600 border border-slate-200/50">
                                <MapPin className="w-3 h-3 mr-1" />
                                {slot.room}
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Coffee className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-lg font-medium">No classes scheduled</p>
                    <p className="text-sm">Enjoy your free day!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
