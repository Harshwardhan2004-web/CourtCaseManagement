import React, { useState, useEffect } from 'react';
import { User, Bell, LogIn, UserPlus, Scale, FileText, Calendar, Users } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CaseForm from './components/CaseForm';
import AuthModal from './components/AuthModal';

export interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: string;
  section: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: Date;
  nextDate: Date;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'lawyer';
}

function App() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'submit-case'>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [cases, setCases] = useState<CaseData[]>([]);

  useEffect(() => {
    // Restore user and cases from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setCurrentPage('dashboard');
      fetchCases(user.id);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const fetchCases = async (userId: string) => {
    const res = await fetch(`http://localhost:5000/api/cases/${userId}`);
    const data = await res.json();
    // Convert ISO date strings to Date objects
    const casesWithDates = data.map((caseItem: any) => ({
      ...caseItem,
      submittedAt: new Date(caseItem.submittedAt),
      nextDate: caseItem.nextDate ? new Date(caseItem.nextDate) : null
    }));
    setCases(casesWithDates);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setCurrentUser({ id: data.id, name: data.name, email: data.email, role: data.role });
      setShowAuthModal(false);
      setCurrentPage('dashboard');
      await fetchCases(data.id);
      localStorage.setItem('currentUser', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setCurrentUser({ id: data.id, name: data.name, email: data.email, role: data.role });
      setShowAuthModal(false);
      setCurrentPage('dashboard');
      await fetchCases(data.id);
      localStorage.setItem('currentUser', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
    localStorage.removeItem('currentUser');
  };

  const handleCaseSubmit = async (caseData: Omit<CaseData, 'id' | 'status' | 'submittedAt'>) => {
    if (!currentUser) return;
    // Ensure nextDate is properly formatted as an ISO string
    const dataToSend = {
      ...caseData,
      clientId: currentUser.id,
      nextDate: caseData.nextDate ? new Date(caseData.nextDate).toISOString() : null
    };
    const res = await fetch('http://localhost:5000/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });
    if (res.ok) {
      await fetchCases(currentUser.id);
      setCurrentPage('dashboard');
    } else {
      alert('Failed to submit case');
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage
          onLogin={() => openAuthModal('login')}
          onSignup={() => openAuthModal('signup')}
        />
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onSwitchMode={(mode) => setAuthMode(mode)}
          />
        )}
      </>
    );
  }

  if (currentPage === 'submit-case') {
    return (
      <CaseForm
        currentUser={currentUser!}
        onSubmit={handleCaseSubmit}
        onBack={() => setCurrentPage('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Dashboard
      currentUser={currentUser!}
      cases={cases}
      onSubmitCase={() => setCurrentPage('submit-case')}
      onLogout={handleLogout}
    />
  );
}

export default App;