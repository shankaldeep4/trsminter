import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Label, Input } from '../components/UI';
import { type ExamType } from '../types';

export function TeacherPanel() {
  const { currentUser, students, homeworks, marks, addHomework, addMark } = useStore();
  const [activeTab, setActiveTab] = useState<'homework' | 'marks'>('homework');

  // Homework form state
  const [hwClass, setHwClass] = useState('');
  const [hwSubject, setHwSubject] = useState('');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');

  // Marks form state
  const [markStudentId, setMarkStudentId] = useState('');
  const [markExamType, setMarkExamType] = useState<ExamType>('Half-Yearly Test');
  const [markSubject, setMarkSubject] = useState('');
  const [markObtained, setMarkObtained] = useState('');
  const [markMax, setMarkMax] = useState('100');

  const handleGiveHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !hwClass || !hwSubject || !hwTitle) return;
    addHomework({
      teacherId: currentUser.id,
      grade: hwClass,
      subject: hwSubject,
      title: hwTitle,
      description: hwDesc
    });
    setHwTitle(''); setHwDesc('');
  };

  const handleUploadMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !markStudentId || !markSubject || !markObtained || !markMax) return;
    addMark({
      studentId: markStudentId,
      teacherId: currentUser.id,
      examType: markExamType,
      subject: markSubject,
      marksObtained: Number(markObtained),
      maxMarks: Number(markMax)
    });
    setMarkStudentId('');
    setMarkSubject('');
    setMarkObtained('');
  };

  const myHomeworks = homeworks.filter(h => h.teacherId === currentUser?.id);
  const myUploadedMarks = marks.filter(m => m.teacherId === currentUser?.id);

  return (
    <div className="space-y-6">
      <div className="flex gap-3 border-b border-slate-200 pb-3">
        {(['homework', 'marks'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 font-medium rounded text-xs capitalize transition-colors border ${activeTab === tab ? 'bg-indigo-600 text-white shadow border-transparent' : 'text-slate-600 hover:bg-slate-100 border-transparent'}`}
          >
            {tab === 'homework' ? 'Assign Homework' : 'Upload Marks'}
          </button>
        ))}
      </div>

      {activeTab === 'homework' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-4">
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
              Assign New Homework
            </h2>
            <form onSubmit={handleGiveHomework} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Class/Grade</Label>
                  <Input as="select" value={hwClass} onChange={e => setHwClass(e.target.value)}>
                    <option value="">Select...</option>
                    {['Nursery', 'L.K.G', 'U.K.G', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => <option key={c} value={c}>{c}</option>)}
                  </Input>
                </div>
                <div><Label>Subject</Label><Input value={hwSubject} onChange={e => setHwSubject(e.target.value)} placeholder="e.g. Math" /></div>
              </div>
              <div><Label>Title</Label><Input value={hwTitle} onChange={e => setHwTitle(e.target.value)} placeholder="Homework Title" /></div>
              <div>
                <Label>Description</Label>
                <textarea 
                  className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[80px] placeholder:text-slate-400" 
                  value={hwDesc} 
                  onChange={e => setHwDesc(e.target.value)} 
                  placeholder="Describe the task..." 
                />
              </div>
              <Button type="submit" className="w-full">Assign Homework</Button>
            </form>
          </Card>

          <Card className="p-4">
             <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
               <span className="w-1.5 h-4 bg-slate-400 rounded-full"></span>
               Recent Assignments
             </h2>
             <div className="space-y-2">
               {myHomeworks.length === 0 ? <p className="text-center py-4 text-slate-500 text-xs">No homework assigned yet.</p> : null}
               {myHomeworks.map(hw => (
                 <div key={hw.id} className="p-2 border border-slate-200 bg-slate-50 rounded">
                   <div className="flex justify-between items-start mb-1">
                     <span className="font-bold text-indigo-700 text-[10px] uppercase tracking-wider">{hw.subject} • {hw.grade}</span>
                     <span className="text-[10px] text-slate-400">{new Date(hw.date).toLocaleDateString()}</span>
                   </div>
                   <h3 className="font-semibold text-slate-800 text-xs">{hw.title}</h3>
                 </div>
               ))}
             </div>
          </Card>
        </div>
      )}

      {activeTab === 'marks' && (
        <Card className="p-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            Upload Examination Results
          </h2>
          <form onSubmit={handleUploadMarks} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 items-end bg-slate-50 p-3 rounded border border-slate-200 text-xs">
             <div className="lg:col-span-2">
               <Label>Student</Label>
               <Input as="select" value={markStudentId} onChange={e => setMarkStudentId(e.target.value)}>
                 <option value="">Select Student...</option>
                 {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)}
               </Input>
             </div>
             <div className="lg:col-span-2">
               <Label>Exam Type</Label>
               <Input as="select" value={markExamType} onChange={e => setMarkExamType(e.target.value as ExamType)}>
                 <option value="Half-Yearly Test">Half-Yearly Test</option>
                 <option value="Half-Yearly Exam">Half-Yearly Exam</option>
                 <option value="Yearly Test">Yearly Test</option>
                 <option value="Yearly Exam">Yearly Exam</option>
               </Input>
             </div>
             <div className="lg:col-span-2">
               <Label>Subject</Label>
               <Input value={markSubject} onChange={e => setMarkSubject(e.target.value)} placeholder="Type Subject..." />
             </div>
             <div className="lg:col-span-2 lg:col-start-1">
               <Label>Marks Obtained</Label>
               <Input type="number" min="0" value={markObtained} onChange={e => setMarkObtained(e.target.value)} />
             </div>
             <div className="lg:col-span-2">
               <Label>Max Marks</Label>
               <Input type="number" min="1" value={markMax} onChange={e => setMarkMax(e.target.value)} />
             </div>
             <div className="lg:col-span-2 flex justify-end">
                <Button type="submit" className="w-full">Upload Marks</Button>
             </div>
          </form>

          <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-2">Recently Uploaded Marks</h3>
           <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-[12px] text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
                <tr><th className="px-4 py-2">Student</th><th className="px-4 py-2">Exam</th><th className="px-4 py-2">Subject</th><th className="px-4 py-2 text-indigo-600">Score</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myUploadedMarks.map(m => {
                  const s = students.find(x => x.id === m.studentId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-semibold text-slate-800">{s?.name || 'Unknown'}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] border border-slate-200">{m.examType}</span>
                      </td>
                      <td className="px-4 py-2 font-medium">{m.subject}</td>
                      <td className="px-4 py-2 font-mono text-indigo-700 font-bold bg-indigo-50/50">{m.marksObtained} / {m.maxMarks}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
