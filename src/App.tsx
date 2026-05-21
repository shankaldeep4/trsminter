import React from 'react';
import { StoreProvider, useStore } from './store';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { AdminPanel } from './pages/AdminPanel';
import { TeacherPanel } from './pages/TeacherPanel';
import { StudentPanel } from './pages/StudentPanel';
import { ClerkPanel } from './pages/ClerkPanel';

function AppContent() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Login />;
  }

  const getDashboardTitle = () => {
    switch (currentUser.role) {
      case 'ADMIN': return 'Admin Dashboard';
      case 'TEACHER': return 'Teacher Dashboard';
      case 'STUDENT': return 'Student Portal';
      case 'CLERK': return 'Fee Management (Clerk)';
      default: return 'Dashboard';
    }
  };

  return (
    <DashboardLayout title={getDashboardTitle()}>
      {currentUser.role === 'ADMIN' && <AdminPanel />}
      {currentUser.role === 'TEACHER' && <TeacherPanel />}
      {currentUser.role === 'STUDENT' && <StudentPanel />}
      {currentUser.role === 'CLERK' && <ClerkPanel />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
