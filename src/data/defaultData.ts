import type { ExamNode, Edge, Student, ColorScheme } from '../types';

export const DEFAULT_EXAMS: ExamNode[] = [
  {
    id: 'A',
    name: 'Maths',
    code: '21MAT31',
    department: 'Mathematics',
    credits: 4,
    duration: '3 Hours',
    x: 230,
    y: 110,
  },
  {
    id: 'B',
    name: 'Physics',
    code: '21PHY12',
    department: 'Physics',
    credits: 4,
    duration: '3 Hours',
    x: 520,
    y: 110,
  },
  {
    id: 'C',
    name: 'Chemistry',
    code: '21CHE12',
    department: 'Chemistry',
    credits: 4,
    duration: '3 Hours',
    x: 620,
    y: 260,
  },
  {
    id: 'D',
    name: 'English',
    code: '21ENG15',
    department: 'Humanities',
    credits: 2,
    duration: '2 Hours',
    x: 130,
    y: 260,
  },
  {
    id: 'E',
    name: 'Computer Science',
    code: '21CS32',
    department: 'Computer Science & Engg',
    credits: 4,
    duration: '3 Hours',
    x: 250,
    y: 400,
  },
  {
    id: 'F',
    name: 'Economics',
    code: '21ECO24',
    department: 'Management Studies',
    credits: 3,
    duration: '3 Hours',
    x: 500,
    y: 400,
  },
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'S1',
    name: 'Aarav Sharma',
    rollNo: 'ENG21CS001',
    department: 'Computer Science & Engg',
    exams: ['A', 'B', 'C'], // Creates A-B, A-C, B-C
  },
  {
    id: 'S2',
    name: 'Bhavya Patel',
    rollNo: 'ENG21CS042',
    department: 'Computer Science & Engg',
    exams: ['A', 'E'], // Creates A-E
  },
  {
    id: 'S3',
    name: 'Chirag Rao',
    rollNo: 'ENG21EC018',
    department: 'Electronics & Comm Engg',
    exams: ['B', 'D'], // Creates B-D
  },
  {
    id: 'S4',
    name: 'Deepika Nair',
    rollNo: 'ENG21ME029',
    department: 'Mechanical Engg',
    exams: ['C', 'F'], // Creates C-F
  },
  {
    id: 'S5',
    name: 'Eshaan Gupta',
    rollNo: 'ENG21AI015',
    department: 'Artificial Intelligence',
    exams: ['D', 'E'], // Creates D-E
  },
  {
    id: 'S6',
    name: 'Farhan Khan',
    rollNo: 'ENG21CS089',
    department: 'Computer Science & Engg',
    exams: ['E', 'F'], // Creates E-F
  },
];

export const DEFAULT_EDGES: Edge[] = [
  { id: 'A-B', source: 'A', target: 'B', students: ['S1'] },
  { id: 'A-C', source: 'A', target: 'C', students: ['S1'] },
  { id: 'A-E', source: 'A', target: 'E', students: ['S2'] },
  { id: 'B-C', source: 'B', target: 'C', students: ['S1'] },
  { id: 'B-D', source: 'B', target: 'D', students: ['S3'] },
  { id: 'C-F', source: 'C', target: 'F', students: ['S4'] },
  { id: 'D-E', source: 'D', target: 'E', students: ['S5'] },
  { id: 'E-F', source: 'E', target: 'F', students: ['S6'] },
];

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 1,
    dayName: 'Day 1',
    slotName: 'Morning Session (09:30 AM - 12:30 PM)',
    colorHex: '#38BDF8', // Cyan-400
    bgHex: 'rgba(56, 189, 248, 0.12)',
    borderHex: 'rgba(56, 189, 248, 0.45)',
    glowHex: 'rgba(56, 189, 248, 0.35)',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  },
  {
    id: 2,
    dayName: 'Day 2',
    slotName: 'Morning Session (09:30 AM - 12:30 PM)',
    colorHex: '#A855F7', // Purple-500
    bgHex: 'rgba(168, 85, 247, 0.12)',
    borderHex: 'rgba(168, 85, 247, 0.45)',
    glowHex: 'rgba(168, 85, 247, 0.35)',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    id: 3,
    dayName: 'Day 3',
    slotName: 'Morning Session (09:30 AM - 12:30 PM)',
    colorHex: '#10B981', // Emerald-500
    bgHex: 'rgba(16, 185, 129, 0.12)',
    borderHex: 'rgba(16, 185, 129, 0.45)',
    glowHex: 'rgba(16, 185, 129, 0.35)',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 4,
    dayName: 'Day 4',
    slotName: 'Morning Session (09:30 AM - 12:30 PM)',
    colorHex: '#F59E0B', // Amber-500
    bgHex: 'rgba(245, 158, 11, 0.12)',
    borderHex: 'rgba(245, 158, 11, 0.45)',
    glowHex: 'rgba(245, 158, 11, 0.35)',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    id: 5,
    dayName: 'Day 5',
    slotName: 'Morning Session (09:30 AM - 12:30 PM)',
    colorHex: '#EC4899', // Pink-500
    bgHex: 'rgba(236, 72, 153, 0.12)',
    borderHex: 'rgba(236, 72, 153, 0.45)',
    glowHex: 'rgba(236, 72, 153, 0.35)',
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  },
  {
    id: 6,
    dayName: 'Day 6',
    slotName: 'Morning Session (09:30 AM - 12:30 PM)',
    colorHex: '#6366F1', // Indigo-500
    bgHex: 'rgba(99, 102, 241, 0.12)',
    borderHex: 'rgba(99, 102, 241, 0.45)',
    glowHex: 'rgba(99, 102, 241, 0.35)',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  },
];
