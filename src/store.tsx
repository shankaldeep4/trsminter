import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Student, Teacher, Homework, ExamMark, FeeRecord, Issue, Role } from './types';

// Initial Mock Data
const mockUsers: User[] = [
  { id: 'a1', name: 'Albus Dumbledore', role: 'ADMIN', email: 'admin@school.edu', password: 'Admin@1234' },
  { id: 'c1', name: 'Arthur Weasley', role: 'CLERK', email: 'clerk@school.edu', password: 'password123' },
];

const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Minerva McGonagall', role: 'TEACHER', email: 'minerva@school.edu', password: 'password123', subjects: ['Math', 'Science'] },
  { id: 't2', name: 'Severus Snape', role: 'TEACHER', email: 'severus@school.edu', password: 'password123', subjects: ['Chemistry', 'History'] },
];

const mockStudents: Student[] = [
  { id: 's1', name: 'Harry Potter', role: 'STUDENT', email: 'harry@school.edu', password: 'password123', grade: 'Class 10', rollNo: '101', feeBalance: 5000 },
  { id: 's2', name: 'Hermione Granger', role: 'STUDENT', email: 'hermione@school.edu', password: 'password123', grade: 'Class 10', rollNo: '102', feeBalance: 0 },
  { id: 's3', name: 'Ron Weasley', role: 'STUDENT', email: 'ron@school.edu', password: 'password123', grade: 'Class 9', rollNo: '901', feeBalance: 12000 },
];

const mockHomeworks: Homework[] = [
  { id: 'hw1', teacherId: 't1', grade: 'Class 10', subject: 'Math', title: 'Algebra Equations', description: 'Solve exercise 4.1 completely.', date: new Date().toISOString() }
];

const mockMarks: ExamMark[] = [];
const mockFees: FeeRecord[] = [];
const mockIssues: Issue[] = [];

interface StoreState {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  homeworks: Homework[];
  marks: ExamMark[];
  feeRecords: FeeRecord[];
  issues: Issue[];
  currentUser: User | null;
}

interface StoreContextType extends StoreState {
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  addHomework: (hw: Omit<Homework, 'id' | 'date'>) => void;
  addMark: (mark: Omit<ExamMark, 'id' | 'date'>) => void;
  addFeePayment: (studentId: string, amount: number, remarks: string) => void;
  addIssue: (description: string) => void;
  resolveIssue: (issueId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [homeworks, setHomeworks] = useState<Homework[]>(mockHomeworks);
  const [marks, setMarks] = useState<ExamMark[]>(mockMarks);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(mockFees);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const allUsers = [...users, ...students, ...teachers];

  const login = (email: string, pass: string) => {
    const user = allUsers.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addStudent = (student: Student) => setStudents(prev => [...prev, student]);
  const deleteStudent = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));
  const addTeacher = (teacher: Teacher) => setTeachers(prev => [...prev, teacher]);
  const deleteTeacher = (id: string) => setTeachers(prev => prev.filter(t => t.id !== id));

  const addHomework = (hw: Omit<Homework, 'id' | 'date'>) => {
    setHomeworks(prev => [{ ...hw, id: `hw${Date.now()}`, date: new Date().toISOString() }, ...prev]);
  };

  const addMark = (mark: Omit<ExamMark, 'id' | 'date'>) => {
    setMarks(prev => [{ ...mark, id: `m${Date.now()}`, date: new Date().toISOString() }, ...prev]);
  };

  const addFeePayment = (studentId: string, amount: number, remarks: string) => {
    const record: FeeRecord = {
      id: `fee${Date.now()}`,
      studentId,
      amount,
      date: new Date().toISOString(),
      type: 'Payment',
      remarks
    };
    setFeeRecords(prev => [record, ...prev]);
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, feeBalance: Math.max(0, s.feeBalance - amount) } : s));
  };

  const addIssue = (description: string) => {
    if (!currentUser) return;
    const issue: Issue = {
      id: `iss${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserRole: currentUser.role,
      description,
      status: 'Open',
      date: new Date().toISOString()
    };
    setIssues(prev => [issue, ...prev]);
  };

  const resolveIssue = (issueId: string) => {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: 'Resolved' } : i));
  };

  return (
    <StoreContext.Provider value={{
      users: allUsers, students, teachers, homeworks, marks, feeRecords, issues, currentUser,
      login, logout, addStudent, deleteStudent, addTeacher, deleteTeacher, addHomework, addMark, addFeePayment, addIssue, resolveIssue
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
