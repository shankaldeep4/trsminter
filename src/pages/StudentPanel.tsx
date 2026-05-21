import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Label } from '../components/UI';
import type { Student } from '../types';

export function StudentPanel() {
  const { currentUser, homeworks, marks, feeRecords, addIssue } = useStore();
  const [activeTab, setActiveTab] = useState<'homework' | 'results' | 'fees' | 'support'>('homework');
  const [issueText, setIssueText] = useState('');

  if (!currentUser || currentUser.role !== 'STUDENT') return null;
  const student = currentUser as Student;

  const myHomeworks = homeworks.filter(h => h.grade === student.grade);
  const myMarks = marks.filter(m => m.studentId === student.id);
  const myFees = feeRecords.filter(f => f.studentId === student.id);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;
    addIssue(issueText);
    setIssueText('');
    alert("Support ticket submitted to Admin.");
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
        {(['homework', 'results', 'fees', 'support'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 font-medium rounded text-xs capitalize whitespace-nowrap transition-colors border ${activeTab === tab ? 'bg-indigo-600 text-white shadow border-transparent' : 'text-slate-600 hover:bg-slate-100 border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'homework' && (
        <Card className="p-4 flex flex-col h-full min-h-[400px]">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            My Homework
          </h2>
          {myHomeworks.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">No homework assigned currently.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myHomeworks.map(hw => (
                <div key={hw.id} className="border border-slate-200 rounded p-3 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">{hw.subject}</span>
                    <span className="text-[10px] text-slate-400">{new Date(hw.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-xs mb-1">{hw.title}</h3>
                  <p className="text-[11px] text-slate-600 whitespace-pre-wrap">{hw.description}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'results' && (
        <Card className="p-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            My Examination Results
          </h2>
          {myMarks.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">No results published yet.</div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-[12px] text-slate-600 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
                  <tr><th className="px-4 py-2">Exam Type</th><th className="px-4 py-2">Subject</th><th className="px-4 py-2 text-indigo-600">Marks Obtained</th><th className="px-4 py-2">Maximum Marks</th><th className="px-4 py-2">Percentage</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myMarks.map(m => {
                    const percent = ((m.marksObtained / m.maxMarks) * 100).toFixed(1);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-semibold text-slate-800">{m.examType}</td>
                        <td className="px-4 py-2">{m.subject}</td>
                        <td className="px-4 py-2 font-mono font-bold text-indigo-600">{m.marksObtained}</td>
                        <td className="px-4 py-2 font-mono">{m.maxMarks}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${Number(percent) >= 33 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {percent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 bg-slate-900 border-slate-900 text-white col-span-1 flex flex-col justify-center items-center h-40">
             <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Current Balance</p>
             <h2 className="text-3xl font-bold">₹{student.feeBalance.toLocaleString()}</h2>
             {student.feeBalance === 0 ? (
               <span className="mt-3 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full font-bold">All cleared</span>
             ) : (
               <span className="mt-3 px-2 py-0.5 bg-slate-700 text-slate-200 text-[10px] rounded-full font-bold">Pending Dues</span>
             )}
          </Card>
          <Card className="p-4 col-span-1 md:col-span-2">
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
              Payment History
            </h2>
            {myFees.length === 0 ? (
               <div className="text-center py-6 text-slate-500 text-xs">No transaction history.</div>
            ) : (
              <div className="space-y-2">
                {myFees.map(f => (
                  <div key={f.id} className="flex justify-between items-center p-2 border border-slate-100 bg-slate-50 rounded">
                    <div>
                      <p className="font-semibold text-xs text-slate-800">{f.remarks || 'Fee Payment'}</p>
                      <p className="text-[10px] text-slate-500">{new Date(f.date).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-emerald-600 text-xs">+ ₹{f.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'support' && (
        <Card className="p-4 max-w-2xl">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
            Need Help?
          </h2>
          <p className="text-xs text-slate-500 mb-4">If you have any issues with fees, homework, or results, you can raise a support ticket to the Administration.</p>
          <form onSubmit={handleSupportSubmit} className="space-y-4">
             <div>
               <Label>Describe your issue</Label>
               <textarea 
                 required
                 className="w-full rounded border border-slate-200 bg-slate-50 p-2 mt-1 text-xs text-slate-800 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px] placeholder:text-slate-400" 
                 value={issueText} 
                 onChange={e => setIssueText(e.target.value)} 
                 placeholder="I am not able to see my Math results..." 
               />
             </div>
             <Button type="submit">Submit to Admin</Button>
          </form>
        </Card>
      )}
    </div>
  );
}
