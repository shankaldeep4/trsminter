import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Label, Input } from '../components/UI';
import { Users, GraduationCap, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import type { Student, Teacher } from '../types';

const CLASSES = ['Nursery', 'L.K.G', 'U.K.G', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

export function AdminPanel() {
  const { students, teachers, issues, addStudent, deleteStudent, addTeacher, deleteTeacher, resolveIssue } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'issues'>('overview');

  const [newStudent, setNewStudent] = useState<Partial<Student>>({ role: 'STUDENT', feeBalance: 0, password: 'password123' });
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({ role: 'TEACHER', subjects: [], password: 'password123' });

  const [submittedStudent, setSubmittedStudent] = useState<Student | null>(null);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.grade || !newStudent.password) return;
    const studentWithId = { ...newStudent, id: `s${Date.now()}` } as Student;
    addStudent(studentWithId);
    setSubmittedStudent(studentWithId);
    setNewStudent({ role: 'STUDENT', feeBalance: 0, password: 'password123', subjects: [] });
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const currentSubjects = newStudent.subjects || [];
    if (checked) {
      setNewStudent({ ...newStudent, subjects: [...currentSubjects, subject] });
    } else {
      setNewStudent({ ...newStudent, subjects: currentSubjects.filter(s => s !== subject) });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
         setNewStudent(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const printForm = () => {
    window.print();
  };

  const showStreamSelection = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(newStudent.grade || '');
  
  const INDIAN_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'History', 'Geography', 'Political Science', 'Economics', 'Sociology', 'Hindi', 'English', 'Physical Education', 'Accountancy', 'Business Studies'];

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subjects?.length || !newTeacher.password) return;
    addTeacher({ ...newTeacher, id: `t${Date.now()}` } as Teacher);
    setNewTeacher({ role: 'TEACHER', subjects: [], password: 'password123' });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
        {(['overview', 'students', 'teachers', 'issues'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 font-medium rounded text-xs capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 flex items-center gap-4">
            <div className="bg-blue-50/50 p-3 rounded text-blue-600"><GraduationCap className="h-5 w-5"/></div>
            <div><p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Total Students</p><p className="text-xl font-bold text-slate-800">{students.length}</p></div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="bg-purple-50/50 p-3 rounded text-purple-600"><Users className="h-5 w-5"/></div>
            <div><p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Total Teachers</p><p className="text-xl font-bold text-slate-800">{teachers.length}</p></div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="bg-amber-50/50 p-3 rounded text-amber-600"><AlertCircle className="h-5 w-5"/></div>
            <div><p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Open Issues</p><p className="text-xl font-bold text-slate-800">{issues.filter(i => i.status === 'Open').length}</p></div>
          </Card>
        </div>
      )}

      {activeTab === 'students' && (
        <Card className="p-6">
          {submittedStudent ? (
            <div className="space-y-6">
              <div id="printable-area" className="bg-white p-8 border border-slate-200 rounded-lg">
                <div className="text-center border-b pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-slate-800">T.R.S.M INTER COLLEGE</h1>
                  <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Student Registration Form</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <p><span className="font-bold text-slate-600">Name:</span> {submittedStudent.name}</p>
                      <p><span className="font-bold text-slate-600">Gender:</span> {submittedStudent.gender}</p>
                      <p><span className="font-bold text-slate-600">Father's Name:</span> {submittedStudent.fatherName}</p>
                      <p><span className="font-bold text-slate-600">Mother's Name:</span> {submittedStudent.motherName}</p>
                      <p><span className="font-bold text-slate-600">Date of Birth:</span> {submittedStudent.dob}</p>
                      <p><span className="font-bold text-slate-600">Mobile:</span> {submittedStudent.mobile}</p>
                      <p><span className="font-bold text-slate-600">Aadhar:</span> {submittedStudent.aadhar}</p>
                      <p><span className="font-bold text-slate-600">Email:</span> {submittedStudent.email}</p>
                      <p><span className="font-bold text-slate-600">Address:</span> {submittedStudent.address}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <p><span className="font-bold text-slate-600">Class:</span> {submittedStudent.grade}</p>
                      <p><span className="font-bold text-slate-600">Roll No:</span> {submittedStudent.rollNo}</p>
                      <p><span className="font-bold text-slate-600">Previous Class:</span> {submittedStudent.hasPreviousClass ? submittedStudent.previousClass : 'N/A'}</p>
                      {['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(submittedStudent.grade || '') && (
                        <>
                          <p><span className="font-bold text-slate-600">Stream:</span> {submittedStudent.stream}</p>
                          <p><span className="font-bold text-slate-600">Subjects:</span> {submittedStudent.subjects?.join(', ')}</p>
                        </>
                      )}
                      <p className="mt-4"><span className="font-bold text-slate-600">Portal Password:</span> <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">{submittedStudent.password}</span></p>
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col items-end">
                    {submittedStudent.photoUrl ? (
                      <img src={submittedStudent.photoUrl} alt="Photo" className="w-32 h-40 object-cover border-2 border-slate-200 rounded" />
                    ) : (
                      <div className="w-32 h-40 bg-slate-100 border-2 border-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">No Photo</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={printForm} className="flex-1 bg-indigo-600">Print / Download PDF</Button>
                <Button onClick={() => setSubmittedStudent(null)} className="flex-1 bg-slate-200 text-slate-800 hover:bg-slate-300">Back to Registration</Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-sm font-bold mb-4 text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                Student Registration Form
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-6 mb-8">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-slate-100 rounded bg-slate-50/50">
                  <div className="md:col-span-4 font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 border-b pb-2">Personal Details</div>
                  
                  <div><Label>Full Name</Label><Input required value={newStudent.name || ''} onChange={e => setNewStudent({...newStudent, name: e.target.value})} /></div>
                  <div>
                    <Label>Gender</Label>
                    <Input as="select" required value={newStudent.gender || ''} onChange={e => setNewStudent({...newStudent, gender: e.target.value as Student['gender']})}>
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Input>
                  </div>
                  <div><Label>Date of Birth</Label><Input required type="date" value={newStudent.dob || ''} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} /></div>
                  <div><Label>Mobile Number</Label><Input required value={newStudent.mobile || ''} onChange={e => setNewStudent({...newStudent, mobile: e.target.value})} /></div>

                  <div><Label>Father's Name</Label><Input required value={newStudent.fatherName || ''} onChange={e => setNewStudent({...newStudent, fatherName: e.target.value})} /></div>
                  <div><Label>Mother's Name</Label><Input required value={newStudent.motherName || ''} onChange={e => setNewStudent({...newStudent, motherName: e.target.value})} /></div>
                  
                  <div><Label>Aadhar Number</Label><Input required value={newStudent.aadhar || ''} onChange={e => setNewStudent({...newStudent, aadhar: e.target.value})} /></div>
                  <div><Label>Email</Label><Input type="email" required value={newStudent.email || ''} onChange={e => setNewStudent({...newStudent, email: e.target.value})} /></div>
                  
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Input required value={newStudent.address || ''} onChange={e => setNewStudent({...newStudent, address: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Student Photo</Label>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                </div>

                {/* Academic Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-slate-100 rounded bg-slate-50/50">
                  <div className="md:col-span-4 font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 border-b pb-2">Academic Details</div>
                  
                  <div>
                    <Label>Admitting Class</Label>
                    <Input as="select" required value={newStudent.grade || ''} onChange={e => setNewStudent({...newStudent, grade: e.target.value})}>
                      <option value="">Select...</option>
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </Input>
                  </div>
                  <div><Label>Roll No</Label><Input required value={newStudent.rollNo || ''} onChange={e => setNewStudent({...newStudent, rollNo: e.target.value})} /></div>
                  
                  <div className="flex items-center space-x-2 mt-6">
                    <input type="checkbox" id="prevClassCb" checked={!!newStudent.hasPreviousClass} onChange={e => setNewStudent({...newStudent, hasPreviousClass: e.target.checked})} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <Label className="mb-0" htmlFor="prevClassCb">Has Previous Class?</Label>
                  </div>
                  {newStudent.hasPreviousClass && (
                    <div>
                      <Label>Previous Class</Label>
                      <Input as="select" value={newStudent.previousClass || ''} onChange={e => setNewStudent({...newStudent, previousClass: e.target.value})}>
                        <option value="">Select...</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </Input>
                    </div>
                  )}

                  {showStreamSelection && (
                    <>
                      <div className="md:col-span-4 mt-2">
                        <Label>Select Stream</Label>
                        <Input as="select" required value={newStudent.stream || ''} onChange={e => setNewStudent({...newStudent, stream: e.target.value as any, subjects: []})}>
                          <option value="">Select...</option>
                          <option value="Arts">Arts</option>
                          <option value="Science">Science</option>
                          <option value="Commerce">Commerce</option>
                        </Input>
                      </div>
                      
                      {newStudent.stream && (
                        <div className="md:col-span-4 mt-2">
                          <Label>Select Subjects</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                            {INDIAN_SUBJECTS.map(sub => (
                              <label key={sub} className="flex items-center space-x-2 text-sm text-slate-700 bg-white p-2 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={(newStudent.subjects || []).includes(sub)}
                                  onChange={e => handleSubjectChange(sub, e.target.checked)}
                                  className="rounded text-indigo-600"
                                />
                                <span>{sub}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Portal Access */}
                <div className="p-4 border border-slate-100 rounded bg-slate-50/50 flex space-x-4 items-end">
                   <div className="flex-1">
                     <Label>Login Password for Portal</Label>
                     <Input required value={newStudent.password || ''} onChange={e => setNewStudent({...newStudent, password: e.target.value})} />
                   </div>
                   <Button type="submit" className="w-1/3">Submit Application</Button>
                </div>
              </form>

              <div className="overflow-x-auto border-t pt-6 border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Registered Students Directory</h3>
                <table className="w-full text-left text-[12px] text-slate-600 border-collapse">
                  <thead className="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
                    <tr><th className="px-4 py-3">Photo</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Details</th><th className="px-4 py-3">Grade</th><th className="px-4 py-3">Password</th><th className="px-4 py-3 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 border-b border-slate-50">
                        <td className="px-4 py-2">
                          {s.photoUrl ? <img src={s.photoUrl} className="w-8 h-8 rounded object-cover" /> : <div className="w-8 h-8 rounded bg-slate-200" />}
                        </td>
                        <td className="px-4 py-2 font-semibold text-slate-800">{s.name}</td>
                        <td className="px-4 py-2"><div className="text-[10px] text-slate-500">Gender: {s.gender || '-'}<br/>Mob: {s.mobile || '-'}</div></td>
                        <td className="px-4 py-2">{s.grade} <span className="font-mono text-slate-400 text-[10px] block border border-slate-200 inline-block px-1 rounded">{s.rollNo}</span></td>
                        <td className="px-4 py-2 font-mono text-[10px]"><span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">{s.password}</span></td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => deleteStudent(s.id)} className="text-rose-500 hover:text-rose-600 p-1 bg-rose-50 rounded" title="Delete Student"><Trash2 className="h-4 w-4"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      )}

      {activeTab === 'teachers' && (
        <Card className="p-6">
          <h2 className="text-sm font-bold mb-4 text-slate-700 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            Add New Teacher
          </h2>
          <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-end">
            <div><Label>Name</Label><Input value={newTeacher.name || ''} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} /></div>
            <div><Label>Email</Label><Input type="email" value={newTeacher.email || ''} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} /></div>
            <div><Label>Password</Label><Input value={newTeacher.password || ''} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} /></div>
            <div><Label>Subjects</Label><Input value={newTeacher.subjects?.join(', ') || ''} onChange={e => setNewTeacher({...newTeacher, subjects: e.target.value.split(',').map(s=>s.trim())})} placeholder="e.g. Math, Physics" /></div>
            <div className="flex justify-end"><Button type="submit" className="w-full">Add</Button></div>
          </form>

          <div className="overflow-x-auto border-t border-slate-100">
            <table className="w-full text-left text-[12px] text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Password</th><th className="px-4 py-3">Subjects</th><th className="px-4 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 border-b border-slate-50">
                    <td className="px-4 py-2 font-semibold text-slate-800">{t.name}</td>
                    <td className="px-4 py-2">{t.email}</td>
                    <td className="px-4 py-2 font-mono text-[10px] bg-slate-100 text-slate-500 rounded">{t.password}</td>
                    <td className="px-4 py-2">{t.subjects.join(', ')}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => deleteTeacher(t.id)} className="text-rose-500 hover:text-rose-600 p-1" title="Delete Teacher"><Trash2 className="h-4 w-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'issues' && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Support Issues</h2>
          {issues.length === 0 ? (
             <div className="text-center py-10 text-slate-500">No issues reported.</div>
          ) : (
            <div className="space-y-4">
              {issues.map(issue => (
                <div key={issue.id} className={`p-4 rounded-lg border ${issue.status === 'Open' ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'} flex justify-between items-start`}>
                  <div>
                    <div className="flex gap-2 items-center mb-2">
                       <span className="font-bold text-sm text-slate-900">{issue.fromUserName}</span>
                       <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">{issue.fromUserRole}</span>
                       <span className="text-xs text-slate-500">{new Date(issue.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-800 text-sm">{issue.description}</p>
                  </div>
                  {issue.status === 'Open' ? (
                     <Button variant="outline" className="text-xs py-1" onClick={() => resolveIssue(issue.id)}>Mark Resolved</Button>
                  ) : (
                     <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle className="h-4 w-4"/> Resolved</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
