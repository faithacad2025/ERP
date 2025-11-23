
import React, { useState, useEffect } from 'react';
import { User, Notification, Transaction, LeaveRequest, CalendarEvent, AttendanceRecord } from './types';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { dataService } from './services/dataService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // -- PERSISTENT APP STATE (The "Database" loaded into Memory) --
  // We initialize from LocalStorage to ensure data survives refresh
  const [staffList, setStaffList] = useState<User[]>(dataService.getStaff());
  const [students, setStudents] = useState<User[]>(dataService.getStudents());
  const [transactions, setTransactions] = useState<Transaction[]>(dataService.getTransactions());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(dataService.getLeaves());
  const [events, setEvents] = useState<CalendarEvent[]>(dataService.getEvents());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(dataService.getAttendance());

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // -- REAL-TIME DATABASE SYNC --
  // 1. When State Changes -> Save to LocalStorage
  useEffect(() => dataService.saveStaff(staffList), [staffList]);
  useEffect(() => dataService.saveStudents(students), [students]);
  useEffect(() => dataService.saveTransactions(transactions), [transactions]);
  useEffect(() => dataService.saveLeaves(leaves), [leaves]);
  useEffect(() => dataService.saveEvents(events), [events]);
  useEffect(() => dataService.saveAttendance(attendance), [attendance]);

  // 2. Cross-Tab Sync (The "Real-Time" Simulation)
  // Listen for changes made in other tabs to the same LocalStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // If another tab updates these keys, update our state instantly
      if (e.key === 'ERP_STAFF' && e.newValue) setStaffList(JSON.parse(e.newValue));
      if (e.key === 'ERP_STUDENTS' && e.newValue) setStudents(JSON.parse(e.newValue));
      if (e.key === 'ERP_TRANSACTIONS' && e.newValue) setTransactions(JSON.parse(e.newValue));
      if (e.key === 'ERP_LEAVES' && e.newValue) setLeaves(JSON.parse(e.newValue));
      if (e.key === 'ERP_EVENTS' && e.newValue) setEvents(JSON.parse(e.newValue));
      if (e.key === 'ERP_ATTENDANCE' && e.newValue) setAttendance(JSON.parse(e.newValue));
      
      // Trigger a "Real-time" notification toast
      if (user) {
         handleSendNotification({
            id: Date.now().toString(),
            title: 'System Update',
            message: 'Data was updated from another session.',
            type: 'info',
            timestamp: new Date().toISOString(),
            read: false
         });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // -- SIMULATED NOTIFICATIONS --
  const handleSendNotification = (note: Notification) => {
    setNotifications(prev => [note, ...prev]);
    // Auto remove toast after 3s
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== note.id));
    }, 4000);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    handleSendNotification({
        id: 'welcome',
        title: 'Welcome back',
        message: `Logged in as ${loggedInUser.name}`,
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="antialiased text-slate-900 bg-slate-50 min-h-screen font-sans">
      {user ? (
        <DashboardView 
          user={user} 
          onLogout={handleLogout}
          // Shared State Props
          staffList={staffList}
          setStaffList={setStaffList}
          students={students}
          setStudents={setStudents}
          transactions={transactions}
          setTransactions={setTransactions}
          leaves={leaves}
          setLeaves={setLeaves}
          events={events}
          setEvents={setEvents}
          attendance={attendance}
          setAttendance={setAttendance}
          // Notifications
          notifications={notifications}
          sendNotification={handleSendNotification}
        />
      ) : (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
