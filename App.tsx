
import React, { useState } from 'react';
import { User, Role } from './types';
import { DataService } from './services/storage';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './views/AdminDashboard';
import { RadiologistPortal } from './views/RadiologistPortal';
import { DoctorPortal } from './views/DoctorPortal';
import { PatientPublic } from './views/PatientPublic';
import { AttendancePortal } from './views/AttendancePortal';
import { Home } from './views/Home';
import { ArrowRight, LogOut } from './components/Icons';
import { useNotification } from './NotificationContext';

type ViewState = 'HOME' | 'LOGIN' | 'APP' | 'PATIENT_PUBLIC';

function App() {
  const [viewState, setViewState] = useState<ViewState>('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { showToast } = useNotification();
  
  // Login State
  const [loginCode, setLoginCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.ADMIN);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser = DataService.login(loginCode, selectedRole);
    if (loggedUser) {
      setUser(loggedUser);
      setViewState('APP');
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      
      // Set default initial view based on role
      if (loggedUser.role === Role.ADMIN || loggedUser.role === Role.RECEPTIONIST) setActiveView('admin_dashboard');
      if (loggedUser.role === Role.DOCTOR) setActiveView('doctor_dashboard');
      if (loggedUser.role === Role.RADIOLOGIST) setActiveView('radio_worklist');
    } else {
      let hint = "";
      if (selectedRole === Role.ADMIN) hint = " (Try 'admin', '1234', or '5678')";
      if (selectedRole === Role.DOCTOR) hint = " (Try '1001')";
      if (selectedRole === Role.RADIOLOGIST) hint = " (Try '2001')";
      showToast("Invalid credentials." + hint, 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginCode('');
    setViewState('HOME');
  };

  const navigateToLogin = (role: Role) => {
    setSelectedRole(role);
    setViewState('LOGIN');
  };

  // 1. Landing Page
  if (viewState === 'HOME') {
    return (
      <Home 
        onNavigateLogin={navigateToLogin} 
        onNavigatePatient={() => setViewState('PATIENT_PUBLIC')} 
      />
    );
  }

  // 2. Public Patient Result Portal
  if (viewState === 'PATIENT_PUBLIC') {
    return <PatientPublic onBack={() => setViewState('HOME')} />;
  }

  // 3. Login Screen
  if (viewState === 'LOGIN' && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-white/20">
          <button 
            onClick={() => setViewState('HOME')} 
            className="text-gray-400 hover:text-gray-600 mb-4 flex items-center text-sm"
          >
            ← Back to Home
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedRole === Role.ADMIN ? 'Staff Portal' : 
               selectedRole === Role.DOCTOR ? 'Doctor Portal' : 
               'Radiology Portal'}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {selectedRole === Role.ADMIN ? 'Secure access for Admins & Receptionists' : 'Please enter your credentials'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedRole === Role.DOCTOR ? 'Doctor ID' : 
                 selectedRole === Role.RADIOLOGIST ? 'License ID' : 'Username'}
              </label>
              <input
                type="password"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="Enter access code..."
                autoFocus
              />
            </div>
            
            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl flex justify-center items-center group">
              Login to Dashboard
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </form>

          {selectedRole === Role.ADMIN && (
             <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 text-center">
               <strong>Default:</strong> 'admin', '1234', '5678'.
             </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Main Application
  if (viewState === 'APP' && user) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          activeView={activeView} 
          onNavigate={setActiveView} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {(user.role === Role.ADMIN || user.role === Role.RECEPTIONIST) && (
          <>
            {activeView === 'admin_dashboard' && <AdminDashboard user={user} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
            {activeView === 'attendance_portal' && (
              <div className="lg:ml-64 p-4 sm:p-8 min-h-screen bg-gray-50">
                <AttendancePortal />
              </div>
            )}
          </>
        )}
        
        {user.role === Role.DOCTOR && (
          <DoctorPortal user={user as any} />
        )}
        
        {user.role === Role.RADIOLOGIST && (
          <RadiologistPortal user={user as any} />
        )}
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;
