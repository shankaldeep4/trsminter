import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Label, Input } from '../components/UI';
import { IndianRupee } from 'lucide-react';

export function ClerkPanel() {
  const { students, addFeePayment } = useStore();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount || Number(amount) <= 0) return;
    
    addFeePayment(selectedStudent, Number(amount), remarks || 'Fee Payment');
    
    // Reset form
    setSelectedStudent('');
    setAmount('');
    setRemarks('');
    alert("Payment recorded successfully!");
  };

  const totalDues = students.reduce((acc, s) => acc + s.feeBalance, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-900 text-white flex items-center gap-4">
          <div className="bg-indigo-500/20 p-3 rounded text-indigo-400">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Total Pending Dues</p>
            <p className="text-2xl font-bold">₹{totalDues.toLocaleString()}</p>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
            Record Fee Payment
          </h2>
          <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2 items-end">
             <div className="md:col-span-3">
               <Label>Select Student</Label>
               <Input as="select" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
                 <option value="">Choose a student...</option>
                 {students.map(s => (
                   <option key={s.id} value={s.id}>
                     {s.name} ({s.rollNo} / {s.grade}) - Balance: ₹{s.feeBalance}
                   </option>
                 ))}
               </Input>
             </div>
             
             <div className="md:col-span-1">
               <Label>Amount (₹)</Label>
               <Input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="5000" />
             </div>
             
             <div className="md:col-span-1">
               <Label>Remarks</Label>
               <Input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="e.g. Q1 Tuition Fee" />
             </div>

             <div className="md:col-span-1">
               <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-700">Submit Payment</Button>
             </div>
          </form>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
          <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
          Student Fee Defaulters / Balances
        </h2>
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-[12px] text-slate-600 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3 text-right">Balance Due</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-mono">{s.rollNo}</td>
                  <td className="px-4 py-2 font-semibold text-slate-800">{s.name}</td>
                  <td className="px-4 py-2">{s.grade}</td>
                  <td className="px-4 py-2 text-right font-mono font-bold text-slate-800">₹{s.feeBalance.toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">
                    {s.feeBalance === 0 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider font-bold rounded-full">Cleared</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] uppercase tracking-wider font-bold rounded-full">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
