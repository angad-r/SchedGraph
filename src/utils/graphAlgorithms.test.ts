import { describe, it, expect } from 'vitest';
import {
  DEFAULT_EXAMS,
  DEFAULT_STUDENTS,
  DEFAULT_EDGES,
} from '../data/defaultData';
import {
  computeDegrees,
  buildAdjacencyList,
  generateAdjacencyMatrix,
  generateWelshPowellSteps,
  auditTimetable,
  deriveEdgesFromStudents,
} from './graphAlgorithms';

describe('Exam Timetable Scheduling — Mathematical Correctness Audit', () => {
  it('Requirement 1: Graph contains exactly 6 vertices with correct IDs and mappings', () => {
    expect(DEFAULT_EXAMS).toHaveLength(6);
    const ids = DEFAULT_EXAMS.map((e) => e.id);
    expect(ids).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);

    // Check subject mappings
    const mapping = Object.fromEntries(DEFAULT_EXAMS.map((e) => [e.id, e.name]));
    expect(mapping['A']).toBe('Maths');
    expect(mapping['B']).toBe('Physics');
    expect(mapping['C']).toBe('Chemistry');
    expect(mapping['D']).toBe('English');
    expect(mapping['E']).toBe('Computer Science');
    expect(mapping['F']).toBe('Economics');
  });

  it('Requirement 2: Graph contains exactly 8 conflict edges', () => {
    expect(DEFAULT_EDGES).toHaveLength(8);

    const edgePairs = DEFAULT_EDGES.map((e) => `${e.source}-${e.target}`).sort();
    const expectedEdges = [
      'A-B',
      'A-C',
      'A-E',
      'B-C',
      'B-D',
      'C-F',
      'D-E',
      'E-F',
    ].sort();

    expect(edgePairs).toEqual(expectedEdges);

    // Derived edges from student dataset should also match exactly
    const derivedEdges = deriveEdgesFromStudents(DEFAULT_STUDENTS);
    expect(derivedEdges).toHaveLength(8);
    const derivedEdgeKeys = derivedEdges.map((e) => `${e.source}-${e.target}`).sort();
    expect(derivedEdgeKeys).toEqual(expectedEdges);
  });

  it('Requirement 3: Degree sequence is A=3, B=3, C=3, E=3, D=2, F=2 with total sum = 16', () => {
    const degrees = computeDegrees(DEFAULT_EXAMS, DEFAULT_EDGES);

    expect(degrees['A']).toBe(3);
    expect(degrees['B']).toBe(3);
    expect(degrees['C']).toBe(3);
    expect(degrees['E']).toBe(3);
    expect(degrees['D']).toBe(2);
    expect(degrees['F']).toBe(2);

    // Handshaking Lemma verification
    const sumDegrees = Object.values(degrees).reduce((a, b) => a + b, 0);
    expect(sumDegrees).toBe(16);
    expect(sumDegrees).toBe(2 * DEFAULT_EDGES.length);
  });

  it('Requirement 4: Welsh–Powell sorting order is A, B, C, E, D, F and produces exact expected coloring', () => {
    const { sortedVertices, finalColoring } = generateWelshPowellSteps(
      DEFAULT_EXAMS,
      DEFAULT_EDGES,
      ['A', 'B', 'C', 'E', 'D', 'F']
    );

    // Verify sorting order
    expect(sortedVertices).toEqual(['A', 'B', 'C', 'E', 'D', 'F']);

    // Group exams by assigned day
    const day1Exams = Object.keys(finalColoring).filter((id) => finalColoring[id] === 1).sort();
    const day2Exams = Object.keys(finalColoring).filter((id) => finalColoring[id] === 2).sort();
    const day3Exams = Object.keys(finalColoring).filter((id) => finalColoring[id] === 3).sort();

    // Day 1: A, D, F
    expect(day1Exams).toEqual(['A', 'D', 'F']);

    // Day 2: B, E
    expect(day2Exams).toEqual(['B', 'E']);

    // Day 3: C
    expect(day3Exams).toEqual(['C']);
  });

  it('Requirement 5: Chromatic number χ(G) = 3 and is proven optimal via K₃ triangle clique', () => {
    const { finalColoring } = generateWelshPowellSteps(
      DEFAULT_EXAMS,
      DEFAULT_EDGES,
      ['A', 'B', 'C', 'E', 'D', 'F']
    );

    const colorsUsed = new Set(Object.values(finalColoring));
    expect(colorsUsed.size).toBe(3);

    // Verify triangle clique {A, B, C}
    const adj = buildAdjacencyList(DEFAULT_EXAMS, DEFAULT_EDGES);
    expect(adj['A'].has('B')).toBe(true);
    expect(adj['B'].has('C')).toBe(true);
    expect(adj['C'].has('A')).toBe(true);
    // Since A, B, C form K₃, chromatic number MUST be >= 3.
    // Since 3-coloring was found, chromatic number is strictly 3.
  });

  it('Requirement 6: No adjacent vertices share the same color (Strict Zero Conflict Proper Coloring)', () => {
    const { finalColoring } = generateWelshPowellSteps(
      DEFAULT_EXAMS,
      DEFAULT_EDGES,
      ['A', 'B', 'C', 'E', 'D', 'F']
    );

    for (const edge of DEFAULT_EDGES) {
      const colorSource = finalColoring[edge.source];
      const colorTarget = finalColoring[edge.target];
      expect(colorSource).not.toBe(colorTarget);
    }

    // Run complete audit engine
    const audit = auditTimetable(DEFAULT_EXAMS, DEFAULT_EDGES, DEFAULT_STUDENTS, finalColoring);
    expect(audit.isConflictFree).toBe(true);
    expect(audit.violations).toHaveLength(0);
    expect(audit.totalDays).toBe(3);
    expect(audit.totalExams).toBe(6);

    // Ensure all 6 students have conflict-free schedules
    for (const studentCheck of audit.studentSafety) {
      expect(studentCheck.isSafe).toBe(true);
    }
  });

  it('Requirement 7: Adjacency matrix is binary, symmetric, and trace is zero', () => {
    const { matrix, headers } = generateAdjacencyMatrix(DEFAULT_EXAMS, DEFAULT_EDGES);

    expect(matrix).toHaveLength(6);
    expect(headers).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);

    for (let i = 0; i < 6; i++) {
      // Trace: A[i][i] = 0
      expect(matrix[i][i]).toBe(0);
      for (let j = 0; j < 6; j++) {
        // Binary
        expect([0, 1]).toContain(matrix[i][j]);
        // Symmetry: A[i][j] === A[j][i]
        expect(matrix[i][j]).toBe(matrix[j][i]);
      }
    }
  });
});
