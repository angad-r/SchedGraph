import { describe, it, expect } from 'vitest';
import {
  DEFAULT_EXAMS,
  DEFAULT_STUDENTS,
  DEFAULT_EDGES,
} from '../data/defaultData';
import type { ExamNode, Edge } from '../types';
import {
  computeDegrees,
  buildAdjacencyList,
  generateAdjacencyMatrix,
  generateWelshPowellSteps,
  auditTimetable,
  deriveEdgesFromStudents,
  validateGraph,
  calculateWelshPowellUpperBound,
  findMaximumCliqueSize,
} from './graphAlgorithms';

describe('Phase 12: Automated Mathematical & Algorithmic Test Suite', () => {
  // Test 1: Graph creation
  describe('1. Graph Creation', () => {
    it('creates graph nodes and maps properties accurately', () => {
      const nodes: ExamNode[] = [
        { id: 'X', name: 'Exam X', code: 'X101', department: 'CS', credits: 4, duration: '3h', x: 0, y: 0 },
        { id: 'Y', name: 'Exam Y', code: 'Y102', department: 'CS', credits: 3, duration: '2h', x: 10, y: 10 },
      ];
      expect(nodes).toHaveLength(2);
      expect(nodes[0].id).toBe('X');
      expect(nodes[1].name).toBe('Exam Y');
    });
  });

  // Test 2: Edge validation
  describe('2. Edge Validation', () => {
    it('validates valid edges correctly', () => {
      const { isValid, errors } = validateGraph(DEFAULT_EXAMS, DEFAULT_EDGES);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });
  });

  // Test 3: Degree calculation
  describe('3. Degree Calculation', () => {
    it('calculates vertex degrees accurately for arbitrary graphs', () => {
      const customNodes: ExamNode[] = [
        { id: '1', name: 'N1', code: '', department: '', credits: 1, duration: '', x: 0, y: 0 },
        { id: '2', name: 'N2', code: '', department: '', credits: 1, duration: '', x: 0, y: 0 },
        { id: '3', name: 'N3', code: '', department: '', credits: 1, duration: '', x: 0, y: 0 },
      ];
      const customEdges: Edge[] = [
        { id: 'e1', source: '1', target: '2', students: [] },
        { id: 'e2', source: '1', target: '3', students: [] },
      ];
      const degrees = computeDegrees(customNodes, customEdges);
      expect(degrees['1']).toBe(2);
      expect(degrees['2']).toBe(1);
      expect(degrees['3']).toBe(1);
    });
  });

  // Test 4: Adjacency matrix
  describe('4. Adjacency Matrix', () => {
    it('produces symmetric, binary adjacency matrix with zero diagonal', () => {
      const { matrix, headers } = generateAdjacencyMatrix(DEFAULT_EXAMS, DEFAULT_EDGES);
      expect(headers).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
      for (let i = 0; i < 6; i++) {
        expect(matrix[i][i]).toBe(0); // Zero trace
        for (let j = 0; j < 6; j++) {
          expect(matrix[i][j]).toBe(matrix[j][i]); // Symmetry
          expect([0, 1]).toContain(matrix[i][j]); // Binary
        }
      }
    });
  });

  // Test 5: Welsh–Powell ordering
  describe('5. Welsh–Powell Ordering', () => {
    it('sorts vertices in non-increasing degree order', () => {
      const { sortedVertices, degrees } = generateWelshPowellSteps(DEFAULT_EXAMS, DEFAULT_EDGES, ['A', 'B', 'C', 'E', 'D', 'F']);
      expect(sortedVertices).toEqual(['A', 'B', 'C', 'E', 'D', 'F']);
      for (let i = 0; i < sortedVertices.length - 1; i++) {
        expect(degrees[sortedVertices[i]]).toBeGreaterThanOrEqual(degrees[sortedVertices[i + 1]]);
      }
    });
  });

  // Test 6: Color assignment
  describe('6. Color Assignment', () => {
    it('assigns identical color to subsequent non-adjacent vertices', () => {
      const { steps } = generateWelshPowellSteps(DEFAULT_EXAMS, DEFAULT_EDGES, ['A', 'B', 'C', 'E', 'D', 'F']);
      const day1AssignSteps = steps.filter((s) => s.type === 'assign_color' && s.colorId === 1);
      const day1Vertices = day1AssignSteps.map((s) => s.currentVertexId);
      expect(day1Vertices).toEqual(['A', 'D', 'F']);
    });
  });

  // Test 7: Conflict detection
  describe('7. Conflict Detection', () => {
    it('identifies adjacent vertices and marks them as skipped for current color', () => {
      const { steps } = generateWelshPowellSteps(DEFAULT_EXAMS, DEFAULT_EDGES, ['A', 'B', 'C', 'E', 'D', 'F']);
      const skipStepsDay1 = steps.filter((s) => s.type === 'skip_conflict' && s.colorId === 1);
      const skippedVertices = skipStepsDay1.map((s) => s.currentVertexId);
      // B, C, E are adjacent to A, so they must be skipped in Day 1 pass
      expect(skippedVertices).toEqual(['B', 'C', 'E']);
    });
  });

  // Test 8: Timetable generation
  describe('8. Timetable Generation', () => {
    it('generates clash-free timetable groups across days', () => {
      const { finalColoring } = generateWelshPowellSteps(DEFAULT_EXAMS, DEFAULT_EDGES, ['A', 'B', 'C', 'E', 'D', 'F']);
      const audit = auditTimetable(DEFAULT_EXAMS, DEFAULT_EDGES, DEFAULT_STUDENTS, finalColoring);
      expect(audit.isConflictFree).toBe(true);
      expect(audit.totalDays).toBe(3);
      expect(audit.totalExams).toBe(6);
    });
  });

  // Test 9: Invalid graph input
  describe('9. Invalid Graph Input', () => {
    it('catches invalid edge references to non-existent vertices', () => {
      const invalidEdges: Edge[] = [
        { id: 'inv1', source: 'A', target: 'Z', students: [] },
      ];
      const { isValid, errors } = validateGraph(DEFAULT_EXAMS, invalidEdges);
      expect(isValid).toBe(false);
      expect(errors.some((e) => e.includes('non-existent target vertex'))).toBe(true);
    });
  });

  // Test 10: Empty graph
  describe('10. Empty Graph', () => {
    it('handles empty vertices and edges without runtime exceptions', () => {
      const { steps, finalColoring, sortedVertices } = generateWelshPowellSteps([], []);
      expect(sortedVertices).toEqual([]);
      expect(finalColoring).toEqual({});
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[steps.length - 1].type).toBe('completed');
    });
  });

  // Test 11: Disconnected graph
  describe('11. Disconnected Graph', () => {
    it('schedules isolated vertices concurrently in Color 1', () => {
      const isolatedNodes: ExamNode[] = [
        { id: 'I1', name: 'Isolated 1', code: '101', department: '', credits: 1, duration: '', x: 0, y: 0 },
        { id: 'I2', name: 'Isolated 2', code: '102', department: '', credits: 1, duration: '', x: 0, y: 0 },
        { id: 'I3', name: 'Isolated 3', code: '103', department: '', credits: 1, duration: '', x: 0, y: 0 },
      ];
      const { finalColoring } = generateWelshPowellSteps(isolatedNodes, []);
      // All 3 have no conflicts, so all can be scheduled on Day 1
      expect(finalColoring['I1']).toBe(1);
      expect(finalColoring['I2']).toBe(1);
      expect(finalColoring['I3']).toBe(1);
    });
  });

  // Test 12: Complete graph (K_n)
  describe('12. Complete Graph (K_n)', () => {
    it('assigns n distinct colors to a complete graph K_4', () => {
      const k4Nodes: ExamNode[] = ['1', '2', '3', '4'].map((id) => ({
        id,
        name: `Node ${id}`,
        code: id,
        department: '',
        credits: 1,
        duration: '',
        x: 0,
        y: 0,
      }));
      const k4Edges: Edge[] = [
        { id: '1-2', source: '1', target: '2', students: [] },
        { id: '1-3', source: '1', target: '3', students: [] },
        { id: '1-4', source: '1', target: '4', students: [] },
        { id: '2-3', source: '2', target: '3', students: [] },
        { id: '2-4', source: '2', target: '4', students: [] },
        { id: '3-4', source: '3', target: '4', students: [] },
      ];
      const { finalColoring } = generateWelshPowellSteps(k4Nodes, k4Edges);
      const colors = new Set(Object.values(finalColoring));
      expect(colors.size).toBe(4); // Chromatic number of K_4 is 4
    });
  });

  // Test 13: Duplicate edges
  describe('13. Duplicate Edges', () => {
    it('defensively deduplicates identical edges without inflating degree', () => {
      const customNodes: ExamNode[] = [
        { id: 'A', name: 'A', code: '', department: '', credits: 1, duration: '', x: 0, y: 0 },
        { id: 'B', name: 'B', code: '', department: '', credits: 1, duration: '', x: 0, y: 0 },
      ];
      const duplicateEdges: Edge[] = [
        { id: 'e1', source: 'A', target: 'B', students: [] },
        { id: 'e2', source: 'A', target: 'B', students: [] }, // duplicate
      ];
      const degrees = computeDegrees(customNodes, duplicateEdges);
      expect(degrees['A']).toBe(1);
      expect(degrees['B']).toBe(1);
    });
  });

  // Test 14: Self-loops
  describe('14. Self-Loops', () => {
    it('detects and ignores self-loops so vertices do not conflict with themselves', () => {
      const customNodes: ExamNode[] = [
        { id: 'A', name: 'A', code: '', department: '', credits: 1, duration: '', x: 0, y: 0 },
      ];
      const selfLoopEdges: Edge[] = [
        { id: 'self', source: 'A', target: 'A', students: [] },
      ];
      const { isValid, errors } = validateGraph(customNodes, selfLoopEdges);
      expect(isValid).toBe(false);
      expect(errors[0]).toContain('Self-loop detected');

      // Ensure buildAdjacencyList ignores self loop
      const adj = buildAdjacencyList(customNodes, selfLoopEdges);
      expect(adj['A'].has('A')).toBe(false);
    });
  });

  // Test 15: Simulator state transitions
  describe('15. Simulator State Transitions', () => {
    it('transitions through complete step lifecycle in proper order', () => {
      const { steps } = generateWelshPowellSteps(DEFAULT_EXAMS, DEFAULT_EDGES, ['A', 'B', 'C', 'E', 'D', 'F']);
      expect(steps[0].type).toBe('init');
      expect(steps[1].type).toBe('sort');
      expect(steps[2].type).toBe('color_start');
      expect(steps[steps.length - 1].type).toBe('completed');

      // Verify monotonically non-decreasing stepIndex
      for (let i = 0; i < steps.length; i++) {
        expect(steps[i].stepIndex).toBe(i);
      }
    });
  });

  // Separate deep audit of authoritative 6-vertex DSU dataset
  describe('Authoritative Dayananda Sagar University DMGT Dataset Audit', () => {
    it('verifies exact vertices, edges, degrees, and Welsh–Powell output', () => {
      // 1. Vertices = 6
      expect(DEFAULT_EXAMS).toHaveLength(6);
      expect(DEFAULT_EXAMS.map((e) => e.id)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);

      // 2. Edges = 8
      expect(DEFAULT_EDGES).toHaveLength(8);
      const expectedEdgeSet = new Set(['A-B', 'A-C', 'A-E', 'B-C', 'B-D', 'C-F', 'D-E', 'E-F']);
      for (const e of DEFAULT_EDGES) {
        expect(expectedEdgeSet.has(`${e.source}-${e.target}`)).toBe(true);
      }

      // 2b. Derive Edges from Student Enrollments exactly yields the 8 conflict edges
      const derivedEdges = deriveEdgesFromStudents(DEFAULT_STUDENTS);
      expect(derivedEdges).toHaveLength(8);
      const derivedSet = new Set(derivedEdges.map((e) => `${e.source}-${e.target}`));
      expect(derivedSet).toEqual(expectedEdgeSet);

      // 3. Degree Sequence: A=3, B=3, C=3, E=3, D=2, F=2
      const degrees = computeDegrees(DEFAULT_EXAMS, DEFAULT_EDGES);
      expect(degrees).toEqual({
        A: 3,
        B: 3,
        C: 3,
        E: 3,
        D: 2,
        F: 2,
      });

      // 4. Handshaking Lemma: Sum = 16 = 2 * 8
      const sumDegrees = Object.values(degrees).reduce((a, b) => a + b, 0);
      expect(sumDegrees).toBe(16);
      expect(sumDegrees).toBe(2 * DEFAULT_EDGES.length);

      // 5. Lower bound: K3 triangle clique {A, B, C}
      const maxClique = findMaximumCliqueSize(DEFAULT_EXAMS, DEFAULT_EDGES);
      expect(maxClique).toBe(3); // omega(G) = 3 => chi(G) >= 3

      // 6. Upper bound: Welsh-Powell formula gives chi(G) <= max_i min(d_i + 1, i) = 4
      const upperBound = calculateWelshPowellUpperBound(degrees);
      expect(upperBound).toBe(4);

      // 7. Welsh–Powell exact coloring
      const { sortedVertices, finalColoring } = generateWelshPowellSteps(
        DEFAULT_EXAMS,
        DEFAULT_EDGES,
        ['A', 'B', 'C', 'E', 'D', 'F']
      );
      expect(sortedVertices).toEqual(['A', 'B', 'C', 'E', 'D', 'F']);

      // Day 1: A, D, F
      expect(finalColoring['A']).toBe(1);
      expect(finalColoring['D']).toBe(1);
      expect(finalColoring['F']).toBe(1);

      // Day 2: B, E
      expect(finalColoring['B']).toBe(2);
      expect(finalColoring['E']).toBe(2);

      // Day 3: C
      expect(finalColoring['C']).toBe(3);

      // 8. Proper coloring: No adjacent vertices share same color
      for (const edge of DEFAULT_EDGES) {
        expect(finalColoring[edge.source]).not.toBe(finalColoring[edge.target]);
      }

      // 9. Student safety check: 0 collisions
      const audit = auditTimetable(DEFAULT_EXAMS, DEFAULT_EDGES, DEFAULT_STUDENTS, finalColoring);
      expect(audit.isConflictFree).toBe(true);
      expect(audit.violations).toHaveLength(0);
      expect(audit.totalDays).toBe(3);
      expect(audit.studentSafety.every((s) => s.isSafe)).toBe(true);
    });
  });
});
