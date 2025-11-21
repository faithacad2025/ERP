import React, { useState } from 'react';
import { User } from './types';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="antialiased text-slate-900 bg-slate-50 min-h-screen font-sans">
      {user ? (
        <DashboardView user={user} onLogout={handleLogout} />
      ) : (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;