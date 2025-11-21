import React, { useState } from 'react';
import { User, Transaction, LeaveRequest, CalendarEvent } from './types';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { 
  MOCK_STAFF_LIST, 
  MOCK_TRANSACTIONS, 
  MOCK_STUDENTS, 
  MOCK_LEAVES, 
  MOCK_EVENTS 
} from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // --- Centralized Application State (The "Database") ---
  // Hoisting state here ensures that data persists when users log out and log back in as a different role.
  const [staffList, setStaffList] = useState<User[]>(MOCK_STAFF_LIST);
  const [students, setStudents] = useState<User[]>(MOCK_STUDENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
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
          // Pass shared state down
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
        />
      ) : (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;