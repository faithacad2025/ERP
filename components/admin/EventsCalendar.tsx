
import React, { useState, useEffect } from 'react';
import { CalendarEvent, EventType } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Plus, 
  Calendar as CalendarIcon, Clock, MapPin, Trash2 
} from 'lucide-react';

interface EventsCalendarProps {
  onBack: () => void;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({ onBack, events, setEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    type: EventType;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  }>({
    title: '',
    type: 'Meeting',
    description: '',
    date: selectedDate,
    startTime: '',
    endTime: ''
  });

  // Update form date when selected date changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  // Adjust for Monday start (optional, keeping Sunday start for standard view)
  const paddingDays = Array(firstDayOfMonth).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowAddForm(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const newEvent: CalendarEvent = {
      id: `evt_${Date.now()}`,
      date: formData.date,
      title: formData.title,
      type: formData.type,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime
    };

    setEvents([...events, newEvent]);
    setFormData({
      title: '',
      type: 'Meeting',
      description: '',
      date: selectedDate,
      startTime: '',
      endTime: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  // Filter events for the grid and the selected day list
  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr);
  const selectedDayEvents = getEventsForDate(selectedDate);

  // Color coding
  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'Academic': return 'bg-blue-500';
      case 'Holiday': return 'bg-red-500';
      case 'Sports': return 'bg-orange-500';
      case 'Cultural': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const getEventBgColor = (type: EventType) => {
    switch (type) {
      case 'Academic': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'Holiday': return 'bg-red-50 border-red-100 text-red-700';
      case 'Sports': return 'bg-orange-50 border-orange-100 text-orange-700';
      case 'Cultural': return 'bg-purple-50 border-purple-100 text-purple-700';
      default: return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events Calendar</h1>
          <p className="text-slate-500 text-sm">Schedule academic and school events</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* CALENDAR GRID AREA */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          {/* Calendar Controls */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 hover:text-indigo-600 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="text-xs font-medium px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all">
                Today
              </button>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 hover:text-indigo-600 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
            {paddingDays.map((_, index) => (
              <div key={`pad-${index}`} className="h-full min-h-[80px] bg-slate-50/30 rounded-lg"></div>
            ))}
            
            {daysArray.map(day => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = getEventsForDate(dateStr);
              const isSelected = dateStr === selectedDate;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div 
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-[80px] rounded-lg border p-2 cursor-pointer transition-all relative group hover:shadow-md flex flex-col justify-between
                    ${isSelected 
                      ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                      : isToday
                        ? 'bg-white border-indigo-200'
                        : 'bg-white border-slate-100 hover:border-indigo-200'
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700'}`}>
                      {day}
                    </span>
                  </div>
                  
                  {/* Event Dots */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dayEvents.slice(0, 4).map((evt, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full ${getEventTypeColor(evt.type)}`}
                        title={evt.title}
                      ></div>
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-medium">+{dayEvents.length - 4}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR: Selected Day Info */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">
             <div className="flex justify-between items-center mb-4">
                <div>
                   <h3 className="font-bold text-lg text-slate-900">
                     {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                   </h3>
                   <p className="text-sm text-slate-500">Agenda</p>
                </div>
                <Button variant="secondary" className="h-8 w-8 p-0 rounded-full" onClick={() => setShowAddForm(!showAddForm)}>
                   <Plus className={`w-5 h-5 transition-transform ${showAddForm ? 'rotate-45' : ''}`} />
                </Button>
             </div>

             {showAddForm ? (
               <form onSubmit={handleAddEvent} className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                 <Input 
                   label="Event Title" 
                   required
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   placeholder="e.g. Sports Day"
                 />
                 <Input 
                   label="Date" 
                   type="date"
                   required
                   value={formData.date}
                   onChange={e => setFormData({...formData, date: e.target.value})}
                 />
                 <Select
                   label="Type"
                   value={formData.type}
                   onChange={e => setFormData({...formData, type: e.target.value as EventType})}
                   options={[
                     { value: 'Academic', label: 'Academic' },
                     { value: 'Holiday', label: 'Holiday' },
                     { value: 'Sports', label: 'Sports' },
                     { value: 'Cultural', label: 'Cultural' },
                     { value: 'Meeting', label: 'Meeting' },
                   ]}
                 />
                 <Input 
                   label="Description" 
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-2">
                   <Input label="Start Time" type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                   <Input label="End Time" type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                 </div>
                 <Button type="submit" className="w-full">Add Event</Button>
               </form>
             ) : (
               <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                 {selectedDayEvents.length > 0 ? selectedDayEvents.map(evt => (
                   <div key={evt.id} className={`p-3 rounded-lg border ${getEventBgColor(evt.type)}`}>
                     <div className="flex justify-between items-start">
                       <h4 className="font-semibold text-sm">{evt.title}</h4>
                       <button 
                         onClick={() => handleDeleteEvent(evt.id)}
                         className="text-slate-400 hover:text-red-600 transition-colors"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                     </div>
                     <p className="text-xs mt-1 opacity-90">{evt.description}</p>
                     {(evt.startTime || evt.endTime) && (
                       <div className="flex items-center gap-1 text-xs mt-2 opacity-80">
                         <Clock className="w-3 h-3" />
                         {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}
                       </div>
                     )}
                     <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-white/50 rounded">
                       {evt.type}
                     </span>
                   </div>
                 )) : (
                   <div className="text-center py-10 text-slate-400">
                     <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                       <CalendarIcon className="w-8 h-8 opacity-50" />
                     </div>
                     <p className="text-sm">No events scheduled for this day.</p>
                     <Button variant="outline" className="mt-4 text-xs" onClick={() => setShowAddForm(true)}>
                       Add First Event
                     </Button>
                   </div>
                 )}
               </div>
             )}
          </div>

          {/* Upcoming Events Preview (Next 3 from global list) */}
          <div className="bg-indigo-900 text-white rounded-xl shadow-sm p-6">
             <h3 className="font-bold mb-4 flex items-center gap-2">
               <Clock className="w-4 h-4 text-indigo-300" /> Upcoming
             </h3>
             <div className="space-y-4">
                {events
                  .filter(e => e.date > new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .slice(0, 2)
                  .map(evt => (
                    <div key={evt.id} className="flex gap-3 items-center">
                       <div className="bg-white/10 rounded-lg p-2 text-center min-w-[50px]">
                          <span className="block text-xs text-indigo-300 uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="block text-lg font-bold">{new Date(evt.date).getDate()}</span>
                       </div>
                       <div>
                          <p className="font-medium text-sm truncate">{evt.title}</p>
                          <p className="text-xs text-indigo-200">{evt.type}</p>
                       </div>
                    </div>
                  ))
                }
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
