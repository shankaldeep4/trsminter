import React, { useState } from 'react';
import { useStore } from '../store';
import { LogOut, LayoutDashboard, Users, BookOpen, GraduationCap, Banknote, ShieldAlert, FileText, Menu, X } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: Props) {
  const { currentUser, logout } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return null;

  const roleNav = {
    ADMIN: [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'Manage Staff', icon: Users },
      { name: 'Manage Students', icon: GraduationCap },
      { name: 'Help/Issues', icon: ShieldAlert },
    ],
    TEACHER: [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'Homework', icon: BookOpen },
      { name: 'Examinations', icon: FileText },
      { name: 'Issues', icon: ShieldAlert },
    ],
    STUDENT: [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'My Homework', icon: BookOpen },
      { name: 'My Results', icon: FileText },
      { name: 'My Fees', icon: Banknote },
      { name: 'Support', icon: ShieldAlert },
    ],
    CLERK: [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'Fee Management', icon: Banknote },
      { name: 'Issues', icon: ShieldAlert },
    ]
  };

  const navItems = roleNav[currentUser.role] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-6 w-6" />
          T.R.S.M INTER COLLEGE
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-200 md:translate-x-0 fixed md:relative z-10 w-64 h-full bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 absolute inset-y-0 left-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 hidden md:flex">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <h1 className="text-white font-semibold text-lg tracking-tight">T.R.S.M INTER COLLEGE</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 px-2">System Modules</div>
          {navItems.map((item) => (
            <div key={item.name} className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${item.name === title ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 bg-slate-950 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">Role: {currentUser.role.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 rounded hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut className="h-3 w-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 h-screen overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 hidden md:flex">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-slate-700 uppercase text-xs tracking-widest">{title}</h2>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <span className="text-xs text-slate-400">Academic Session: 2024-25</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="md:hidden mb-4">
              <h1 className="text-xl font-semibold text-slate-800 uppercase tracking-wide text-xs">{title}</h1>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
