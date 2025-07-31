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
  createdAt?: string;
  lastLogin?: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'submit-case'>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [cases, setCases] = useState<CaseData[]>(() => {
    // Initialize cases from localStorage
    const savedCases = localStorage.getItem('cases');
    return savedCases ? JSON.parse(savedCases) : [];
  });
  const [users, setUsers] = useState<UserData[]>(() => {
    // Initialize users from localStorage
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    // Check URL path first
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      setCurrentPage('landing');
      // Only restore user if not on landing page
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      }
    } else {
      // For other pages, restore user and redirect to dashboard
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setCurrentPage('dashboard');
        fetchCases(user.id);
      }
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
    const res = await fetch(`/.netlify/functions/get-cases?userId=${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: UserData) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Update user with login time
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };

      // Update users in localStorage
      const updatedUsers = users.map((u: UserData) => 
        u.email.toLowerCase() === email.toLowerCase() ? updatedUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Set current user
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update UI state
      setShowAuthModal(false);
      setCurrentPage('dashboard');

      // Load user's cases
      const allCases = JSON.parse(localStorage.getItem('cases') || '[]');
      const userCases = allCases.filter((c: CaseData) => 
        c.clientEmail.toLowerCase() === email.toLowerCase()
      );
      setCases(userCases);

    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSignup = (name: string, email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((u: UserData) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
      }

      const newUser: UserData = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        role: 'client',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update app state
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setShowAuthModal(false);
      setCurrentPage('dashboard');
      setCases([]);

      // Initialize empty cases array for new user
      const allCases = JSON.parse(localStorage.getItem('cases') || '[]');
      localStorage.setItem('cases', JSON.stringify(allCases));

    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
    setCases([]);
    localStorage.removeItem('currentUser');
    // Force the URL to be the root
    window.history.pushState({}, '', '/');
  };

  const handleCaseSubmit = (caseData: Omit<CaseData, 'id' | 'status' | 'submittedAt'>) => {
    if (!currentUser) return;
    
    const newCase: CaseData = {
      id: Date.now().toString(),
      ...caseData,
      status: 'pending',
      submittedAt: new Date(),
      nextDate: new Date(caseData.nextDate),
    };

    const allCases = JSON.parse(localStorage.getItem('cases') || '[]');
    allCases.push(newCase);
    localStorage.setItem('cases', JSON.stringify(allCases));
    
    setCases(prevCases => [...prevCases, newCase]);
    setCurrentPage('dashboard');
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