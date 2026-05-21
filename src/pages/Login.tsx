import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Label, Input } from '../components/UI';
import { GraduationCap } from 'lucide-react';

export function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
            <GraduationCap className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">T.R.S.M INTER COLLEGE</h1>
          <p className="mt-3 text-slate-500 font-medium">Please enter your credentials to login.</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@school.edu" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full mt-2">Sign In</Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
            <p className="font-semibold mb-2">Demo Accounts:</p>
            <ul className="space-y-1">
              <li>Admin: admin@school.edu / Admin@1234</li>
              <li>Teacher: minerva@school.edu / password123</li>
              <li>Student: harry@school.edu / password123</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
