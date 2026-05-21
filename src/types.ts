export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'CLERK';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  password?: string;
}

export interface Student extends User {
  role: 'STUDENT';
  grade: string;
  rollNo: string;
  feeBalance: number;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  hasPreviousClass?: boolean;
  previousClass?: string;
  gender?: 'Male' | 'Female' | 'Other' | '';
  mobile?: string;
  aadhar?: string;
  address?: string;
  photoUrl?: string;
  stream?: 'Arts' | 'Science' | 'Commerce' | 'None' | '';
  subjects?: string[];
}

export interface Teacher extends User {
  role: 'TEACHER';
  subjects: string[];
}

export interface Homework {
  id: string;
  teacherId: string;
  grade: string;
  subject: string;
  title: string;
  description: string;
  date: string;
}

export type ExamType = 'Half-Yearly Test' | 'Half-Yearly Exam' | 'Yearly Test' | 'Yearly Exam';

export interface ExamMark {
  id: string;
  studentId: string;
  teacherId: string;
  examType: ExamType;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  date: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  type: 'Payment' | 'Charge';
  remarks?: string;
}

export interface Issue {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: Role;
  description: string;
  status: 'Open' | 'Resolved';
  date: string;
}
