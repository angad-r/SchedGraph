export interface ExamNode {
  id: string; // 'A', 'B', etc.
  name: string; // 'Maths', 'Physics', etc.
  code: string; // 'MAT101', etc.
  department: string;
  credits: number;
  duration: string;
  x: number;
  y: number;
  degree?: number;
  colorId?: number | null; // 1 = Day 1, 2 = Day 2, etc.
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  students: string[]; // ['S1', 'S2'] etc.
}

export interface Student {
  id: string; // 'S1'
  name: string;
  rollNo: string;
  department: string;
  exams: string[]; // ['A', 'B', 'C']
}

export interface ColorScheme {
  id: number;
  dayName: string;
  slotName: string;
  colorHex: string;
  bgHex: string;
  borderHex: string;
  glowHex: string;
  badgeClass: string;
}

export type StepType = 
  | 'init'
  | 'sort'
  | 'color_start'
  | 'evaluate_candidate'
  | 'assign_color'
  | 'skip_conflict'
  | 'color_finish'
  | 'completed';

export interface AlgorithmStep {
  stepIndex: number;
  type: StepType;
  title: string;
  description: string;
  colorId: number | null;
  currentVertexId: string | null;
  conflictingVertexId?: string | null;
  coloredNodes: Record<string, number>; // vertexId -> colorId
  currentPassVertices: string[]; // vertices colored with current color so far
  sortedOrder: string[];
  candidateIndex?: number;
  degreeMap: Record<string, number>;
  log: string;
}

export interface TimetableDay {
  dayNumber: number;
  dayName: string;
  dateStr: string;
  timeSlot: string;
  colorHex: string;
  exams: ExamNode[];
}

export interface ConflictAuditResult {
  isConflictFree: boolean;
  totalExams: number;
  totalDays: number;
  totalConflictsChecked: number;
  violations: Array<{
    day: number;
    exam1: string;
    exam2: string;
    studentResponsible?: string;
  }>;
  studentSafety: Array<{
    studentId: string;
    isSafe: boolean;
    examSlots: Array<{ exam: string; day: number }>;
  }>;
}
