import type { ExamNode, Edge, Student, AlgorithmStep, ConflictAuditResult } from '../types';

/**
 * Validates a graph's consistency and detects invalid edges or self-loops
 */
export function validateGraph(nodes: ExamNode[], edges: Edge[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const nodeSet = new Set(nodes.map((n) => n.id));

  for (const edge of edges) {
    if (edge.source === edge.target) {
      errors.push(`Self-loop detected on vertex ${edge.source}. Self-loops are not permitted in conflict graphs.`);
    }
    if (!nodeSet.has(edge.source)) {
      errors.push(`Edge ${edge.id} references non-existent source vertex '${edge.source}'.`);
    }
    if (!nodeSet.has(edge.target)) {
      errors.push(`Edge ${edge.id} references non-existent target vertex '${edge.target}'.`);
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Builds an adjacency map from a list of edges, ignoring self-loops and dangling edges defensively
 */
export function buildAdjacencyList(nodes: ExamNode[], edges: Edge[]): Record<string, Set<string>> {
  const adj: Record<string, Set<string>> = {};
  for (const node of nodes) {
    adj[node.id] = new Set<string>();
  }
  for (const edge of edges) {
    if (edge.source === edge.target) continue; // Ignore self-loops
    if (adj[edge.source] && adj[edge.target]) {
      adj[edge.source].add(edge.target);
      adj[edge.target].add(edge.source);
    }
  }
  return adj;
}

/**
 * Derives edges from student exam enrolments
 */
export function deriveEdgesFromStudents(students: Student[]): Edge[] {
  const edgeMap = new Map<string, Set<string>>();

  for (const student of students) {
    const exams = student.exams;
    for (let i = 0; i < exams.length; i++) {
      for (let j = i + 1; j < exams.length; j++) {
        const u = exams[i] < exams[j] ? exams[i] : exams[j];
        const v = exams[i] < exams[j] ? exams[j] : exams[i];
        const key = `${u}-${v}`;
        if (!edgeMap.has(key)) {
          edgeMap.set(key, new Set());
        }
        edgeMap.get(key)!.add(student.id);
      }
    }
  }

  const result: Edge[] = [];
  edgeMap.forEach((studentSet, key) => {
    const [source, target] = key.split('-');
    result.push({
      id: key,
      source,
      target,
      students: Array.from(studentSet),
    });
  });

  return result;
}

/**
 * Computes degrees for each node
 */
export function computeDegrees(nodes: ExamNode[], edges: Edge[]): Record<string, number> {
  const adj = buildAdjacencyList(nodes, edges);
  const degrees: Record<string, number> = {};
  for (const node of nodes) {
    degrees[node.id] = adj[node.id]?.size || 0;
  }
  return degrees;
}

/**
 * Generates an Adjacency Matrix
 */
export function generateAdjacencyMatrix(nodes: ExamNode[], edges: Edge[]): {
  matrix: number[][];
  headers: string[];
} {
  const headers = nodes.map((n) => n.id);
  const adj = buildAdjacencyList(nodes, edges);
  const matrix: number[][] = [];

  for (let i = 0; i < headers.length; i++) {
    const row: number[] = [];
    const u = headers[i];
    for (let j = 0; j < headers.length; j++) {
      const v = headers[j];
      row.push(adj[u]?.has(v) ? 1 : 0);
    }
    matrix.push(row);
  }

  return { matrix, headers };
}

/**
 * Simulates Welsh-Powell step by step with rich educational explanations
 */
export function generateWelshPowellSteps(
  nodes: ExamNode[],
  edges: Edge[],
  preferredOrder?: string[]
): {
  steps: AlgorithmStep[];
  finalColoring: Record<string, number>;
  sortedVertices: string[];
  degrees: Record<string, number>;
} {
  const degrees = computeDegrees(nodes, edges);
  const adj = buildAdjacencyList(nodes, edges);

  // Sorting: Descending degree.
  // If preferredOrder is provided, break ties according to it (e.g. A, B, C, E, D, F)
  const sortedVertices = [...nodes].sort((a, b) => {
    const degDiff = (degrees[b.id] || 0) - (degrees[a.id] || 0);
    if (degDiff !== 0) return degDiff;
    if (preferredOrder) {
      const indexA = preferredOrder.indexOf(a.id);
      const indexB = preferredOrder.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    }
    return a.id.localeCompare(b.id);
  }).map((n) => n.id);

  const steps: AlgorithmStep[] = [];
  const coloredNodes: Record<string, number> = {};
  let stepIndex = 0;

  // Step 0: Initial State
  steps.push({
    stepIndex: stepIndex++,
    type: 'init',
    title: 'Initialize Algorithm',
    description: `Graph consists of ${nodes.length} vertices and ${edges.length} conflict edges. Ready to compute vertex degrees.`,
    colorId: null,
    currentVertexId: null,
    coloredNodes: { ...coloredNodes },
    currentPassVertices: [],
    sortedOrder: sortedVertices,
    degreeMap: degrees,
    log: `Initialized graph with vertices: [${nodes.map((n) => n.id).join(', ')}].`,
  });

  // Step 1: Sorting Step
  steps.push({
    stepIndex: stepIndex++,
    type: 'sort',
    title: 'Sort Vertices by Descending Degree',
    description: `Vertices arranged in non-increasing degree order: ${sortedVertices.map((id) => `${id} (deg ${degrees[id]})`).join(', ')}.`,
    colorId: null,
    currentVertexId: null,
    coloredNodes: { ...coloredNodes },
    currentPassVertices: [],
    sortedOrder: sortedVertices,
    degreeMap: degrees,
    log: `Sorting completed: [${sortedVertices.join(', ')}].`,
  });

  let currentColor = 1;
  const uncolored = new Set<string>(sortedVertices);

  while (uncolored.size > 0) {
    const currentPassVertices: string[] = [];

    // Step: Start new color
    steps.push({
      stepIndex: stepIndex++,
      type: 'color_start',
      title: `Begin Day ${currentColor} (Color ${currentColor})`,
      description: `Opening time slot Day ${currentColor}. Finding the highest-degree uncolored vertex to seed this time slot.`,
      colorId: currentColor,
      currentVertexId: null,
      coloredNodes: { ...coloredNodes },
      currentPassVertices: [...currentPassVertices],
      sortedOrder: sortedVertices,
      degreeMap: degrees,
      log: `Beginning assignment for Day ${currentColor} (Color ${currentColor}).`,
    });

    // Iterate through all vertices in sorted order
    for (let i = 0; i < sortedVertices.length; i++) {
      const v = sortedVertices[i];
      if (!uncolored.has(v)) continue;

      const nodeObj = nodes.find((n) => n.id === v);
      const examName = nodeObj ? `${v} (${nodeObj.name})` : v;

      // Check if v is adjacent to any vertex already colored with currentColor in this pass
      let conflictingNeighbor: string | null = null;
      for (const coloredV of currentPassVertices) {
        if (adj[v]?.has(coloredV)) {
          conflictingNeighbor = coloredV;
          break;
        }
      }

      // Step: Evaluation of candidate
      steps.push({
        stepIndex: stepIndex++,
        type: 'evaluate_candidate',
        title: `Evaluating ${examName}`,
        description: `Checking if ${examName} can be scheduled on Day ${currentColor} alongside already assigned: [${currentPassVertices.length > 0 ? currentPassVertices.join(', ') : 'None'}].`,
        colorId: currentColor,
        currentVertexId: v,
        candidateIndex: i,
        coloredNodes: { ...coloredNodes },
        currentPassVertices: [...currentPassVertices],
        sortedOrder: sortedVertices,
        degreeMap: degrees,
        log: `Checking vertex ${v} for Day ${currentColor}.`,
      });

      if (!conflictingNeighbor) {
        // Can be colored!
        coloredNodes[v] = currentColor;
        currentPassVertices.push(v);
        uncolored.delete(v);

        steps.push({
          stepIndex: stepIndex++,
          type: 'assign_color',
          title: `Assigned Day ${currentColor} to ${examName}`,
          description: `No conflict detected with vertices currently in Day ${currentColor}. ${examName} is assigned Color ${currentColor} (Day ${currentColor}).`,
          colorId: currentColor,
          currentVertexId: v,
          coloredNodes: { ...coloredNodes },
          currentPassVertices: [...currentPassVertices],
          sortedOrder: sortedVertices,
          degreeMap: degrees,
          log: `Vertex ${v} assigned to Day ${currentColor}.`,
        });
      } else {
        const conflictNode = nodes.find((n) => n.id === conflictingNeighbor);
        const conflictName = conflictNode ? `${conflictingNeighbor} (${conflictNode.name})` : conflictingNeighbor;

        steps.push({
          stepIndex: stepIndex++,
          type: 'skip_conflict',
          title: `Skipping ${examName} for Day ${currentColor}`,
          description: `Conflict! ${examName} is connected by an edge to ${conflictName}, which is already scheduled on Day ${currentColor}. Must wait for a subsequent time slot.`,
          colorId: currentColor,
          currentVertexId: v,
          conflictingVertexId: conflictingNeighbor,
          coloredNodes: { ...coloredNodes },
          currentPassVertices: [...currentPassVertices],
          sortedOrder: sortedVertices,
          degreeMap: degrees,
          log: `Conflict detected: ${v} is adjacent to ${conflictingNeighbor}. Skipped for Day ${currentColor}.`,
        });
      }
    }

    // Step: Finish color pass
    steps.push({
      stepIndex: stepIndex++,
      type: 'color_finish',
      title: `Completed Day ${currentColor}`,
      description: `Day ${currentColor} finalized with examinations: [${currentPassVertices.join(', ')}]. Remaining uncolored: ${uncolored.size} vertices.`,
      colorId: currentColor,
      currentVertexId: null,
      coloredNodes: { ...coloredNodes },
      currentPassVertices: [...currentPassVertices],
      sortedOrder: sortedVertices,
      degreeMap: degrees,
      log: `Day ${currentColor} completed: {${currentPassVertices.join(', ')}}.`,
    });

    currentColor++;
  }

  // Step Final: Completed
  steps.push({
    stepIndex: stepIndex++,
    type: 'completed',
    title: 'Scheduling Complete!',
    description: `All ${nodes.length} examinations successfully scheduled into ${currentColor - 1} clash-free time slots using the Welsh-Powell Algorithm.`,
    colorId: null,
    currentVertexId: null,
    coloredNodes: { ...coloredNodes },
    currentPassVertices: [],
    sortedOrder: sortedVertices,
    degreeMap: degrees,
    log: `Algorithm finished. Total chromatic number used: ${currentColor - 1}.`,
  });

  return {
    steps,
    finalColoring: coloredNodes,
    sortedVertices,
    degrees,
  };
}

/**
 * Audits a timetable for any edge conflicts or student clashes
 */
export function auditTimetable(
  nodes: ExamNode[],
  edges: Edge[],
  students: Student[],
  coloring: Record<string, number>
): ConflictAuditResult {
  const violations: ConflictAuditResult['violations'] = [];
  const edgeSet = new Set(edges.map((e) => `${e.source}-${e.target}`));
  let totalConflictsChecked = 0;

  // Group exams by assigned day
  const dayGroups: Record<number, string[]> = {};
  for (const [nodeId, day] of Object.entries(coloring)) {
    if (!dayGroups[day]) dayGroups[day] = [];
    dayGroups[day].push(nodeId);
  }

  // Check each day's pair
  for (const [dayStr, examIds] of Object.entries(dayGroups)) {
    const day = parseInt(dayStr, 10);
    for (let i = 0; i < examIds.length; i++) {
      for (let j = i + 1; j < examIds.length; j++) {
        totalConflictsChecked++;
        const u = examIds[i];
        const v = examIds[j];
        const hasEdge = edgeSet.has(`${u}-${v}`) || edgeSet.has(`${v}-${u}`);
        if (hasEdge) {
          // Find student responsible
          const edge = edges.find(
            (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
          );
          violations.push({
            day,
            exam1: u,
            exam2: v,
            studentResponsible: edge?.students.join(', '),
          });
        }
      }
    }
  }

  // Audit student safety
  const studentSafety = students.map((s) => {
    const slots = s.exams.map((ex) => ({
      exam: ex,
      day: coloring[ex] || -1,
    }));
    const days = slots.map((s) => s.day);
    const hasDuplicate = new Set(days).size !== days.length;
    return {
      studentId: s.id,
      isSafe: !hasDuplicate,
      examSlots: slots,
    };
  });

  const totalDays = Math.max(...Object.values(coloring), 0);

  return {
    isConflictFree: violations.length === 0,
    totalExams: nodes.length,
    totalDays,
    totalConflictsChecked,
    violations,
    studentSafety,
  };
}

/**
 * Calculates the theoretical Welsh-Powell upper bound:
 * χ(G) ≤ max_{1≤i≤n} min(d_i + 1, i)
 */
export function calculateWelshPowellUpperBound(degrees: Record<string, number>): number {
  const sortedDegs = Object.values(degrees).sort((a, b) => b - a);
  if (sortedDegs.length === 0) return 0;
  let maxMin = 0;
  for (let i = 0; i < sortedDegs.length; i++) {
    const rank = i + 1;
    const val = Math.min(sortedDegs[i] + 1, rank);
    if (val > maxMin) maxMin = val;
  }
  return maxMin;
}

/**
 * Computes maximum clique size ω(G) to establish the theoretical lower bound:
 * χ(G) ≥ ω(G)
 */
export function findMaximumCliqueSize(nodes: ExamNode[], edges: Edge[]): number {
  if (nodes.length === 0) return 0;
  const adj = buildAdjacencyList(nodes, edges);
  const n = nodes.length;
  let maxClique = 1;

  // Search for K2, K3, K4 cliques
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const u = nodes[i].id;
      const v = nodes[j].id;
      if (adj[u]?.has(v)) {
        if (maxClique < 2) maxClique = 2;
        for (let k = j + 1; k < n; k++) {
          const w = nodes[k].id;
          if (adj[u]?.has(w) && adj[v]?.has(w)) {
            if (maxClique < 3) maxClique = 3;
            for (let l = k + 1; l < n; l++) {
              const x = nodes[l].id;
              if (adj[u]?.has(x) && adj[v]?.has(x) && adj[w]?.has(x)) {
                if (maxClique < 4) maxClique = 4;
              }
            }
          }
        }
      }
    }
  }

  return maxClique;
}

