import React, { useState, useEffect } from 'react';
import {
  DEFAULT_EXAMS,
  DEFAULT_STUDENTS,
  DEFAULT_EDGES,
} from './data/defaultData';
import type { ExamNode, Edge, Student, AlgorithmStep } from './types';
import { deriveEdgesFromStudents, generateWelshPowellSteps } from './utils/graphAlgorithms';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { StudentDataTable } from './components/StudentDataTable';
import { ConflictGraph } from './components/ConflictGraph';
import { AdjacencyMatrix } from './components/AdjacencyMatrix';
import { WelshPowellSimulator } from './components/WelshPowellSimulator';
import { TimetableSection } from './components/TimetableSection';
import { MathProofSection } from './components/MathProofSection';
import { ApplicationsSection } from './components/ApplicationsSection';
import { Footer } from './components/Footer';

export function App() {
  const [nodes, setNodes] = useState<ExamNode[]>(DEFAULT_EXAMS);
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);
  const [edges, setEdges] = useState<Edge[]>(DEFAULT_EDGES);

  // Active section tracking for navbar
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Selected student for graph edge highlighting
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Selected node / hover node
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // Algorithm state synced from simulator
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState<AlgorithmStep | null>(null);

  // Derive initial final coloring for timetable
  const defaultFinalColoring = React.useMemo(() => {
    const { finalColoring } = generateWelshPowellSteps(nodes, edges, ['A', 'B', 'C', 'E', 'D', 'F']);
    return finalColoring;
  }, [nodes, edges]);

  // The Final Examination Timetable always displays the completed optimal schedule
  const timetableColoring = defaultFinalColoring;

  // Handle student updates (e.g. adding or removing students)
  const handleUpdateStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    const updatedEdges = deriveEdgesFromStudents(updatedStudents);
    setEdges(updatedEdges);
  };

  const handleResetToDefault = () => {
    setNodes(DEFAULT_EXAMS);
    setStudents(DEFAULT_STUDENTS);
    setEdges(DEFAULT_EDGES);
    setSelectedStudentId(null);
    setSelectedNodeId(null);
    setCurrentAlgorithmStep(null);
  };

  const handleNodePositionChange = (nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, x, y } : node))
    );
  };

  // Derive highlighted edges from selected student
  const studentHighlightedEdges = React.useMemo(() => {
    if (!selectedStudentId) return [];
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return [];
    const list: string[] = [];
    for (let i = 0; i < student.exams.length; i++) {
      for (let j = i + 1; j < student.exams.length; j++) {
        const u = student.exams[i] < student.exams[j] ? student.exams[i] : student.exams[j];
        const v = student.exams[i] < student.exams[j] ? student.exams[j] : student.exams[i];
        list.push(`${u}-${v}`);
      }
    }
    return list;
  }, [selectedStudentId, students]);

  // Combine edge highlights
  const effectiveHighlightedEdges = React.useMemo(() => {
    const set = new Set<string>(studentHighlightedEdges);
    if (hoveredEdgeId) set.add(hoveredEdgeId);
    return Array.from(set);
  }, [studentHighlightedEdges, hoveredEdgeId]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -70; // offset for fixed navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Observer to update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'problem', 'students', 'graph', 'simulator', 'timetable', 'proof', 'applications'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-24">
        {/* Page 1: Hero Section */}
        <section id="overview" className="scroll-mt-20">
          <HeroSection
            onExplore={() => scrollToSection('problem')}
            onRunAlgorithm={() => scrollToSection('simulator')}
          />
        </section>

        {/* Page 2: Understanding the Problem */}
        <section id="problem" className="scroll-mt-20 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Section 01 • The Problem Definition
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Understanding Examination Conflicts
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              How collegiate timetable clashes can be formulated rigorously using vertices, edges, and graph coloring.
            </p>
          </div>
          <ProblemSection nodes={nodes} />
        </section>

        {/* Page 3: Student-Exam Conflict Data */}
        <section id="students" className="scroll-mt-20 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
              Section 02 • Project Dataset
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Student Enrollment & Conflict Relations
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Exact Dayananda Sagar University project dataset showing how shared courses induce mutual conflict edges.
            </p>
          </div>
          <StudentDataTable
            students={students}
            nodes={nodes}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
            onUpdateStudents={handleUpdateStudents}
            onResetToDefault={handleResetToDefault}
          />
        </section>

        {/* Page 4: Interactive Conflict Graph */}
        <section id="graph" className="scroll-mt-20 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Section 03 • Graph Visualization
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Interactive Examination Conflict Graph
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Six examination nodes with 8 verified conflict edges. Drag nodes, inspect incident edges, and explore the adjacency matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <ConflictGraph
                nodes={nodes}
                edges={edges}
                nodeColors={currentAlgorithmStep?.coloredNodes || defaultFinalColoring}
                activeNodeId={currentAlgorithmStep?.currentVertexId}
                conflictingNodeId={currentAlgorithmStep?.conflictingVertexId}
                highlightedEdges={effectiveHighlightedEdges}
                highlightedNodeId={selectedNodeId}
                onNodeClick={(id) => setSelectedNodeId(id === selectedNodeId ? null : id)}
                onNodePositionChange={handleNodePositionChange}
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between">
              <AdjacencyMatrix
                nodes={nodes}
                edges={edges}
                onHoverEdge={setHoveredEdgeId}
                onSelectNode={setSelectedNodeId}
                nodeColors={currentAlgorithmStep?.coloredNodes || defaultFinalColoring}
              />
            </div>
          </div>
        </section>

        {/* Page 5: Welsh–Powell Algorithm Simulator */}
        <section id="simulator" className="scroll-mt-20 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
              Section 04 • Algorithm Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welsh–Powell Algorithm Simulator
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Step-by-step interactive greedy vertex coloring. Follow how each course is assigned to an examination slot.
            </p>
          </div>
          <WelshPowellSimulator
            nodes={nodes}
            edges={edges}
            onStepChange={setCurrentAlgorithmStep}
          />
        </section>

        {/* Page 6: Final Examination Timetable */}
        <section id="timetable" className="scroll-mt-20 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Section 05 • Output Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Final Examination Timetable
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Generated clash-free schedule. Verified with zero student collisions across all 3 examination days.
            </p>
          </div>
          <TimetableSection
            nodes={nodes}
            edges={edges}
            students={students}
            coloring={timetableColoring}
          />
        </section>

        {/* Page 7: Mathematical Verification */}
        <section id="proof" className="scroll-mt-20 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Section 06 • Formal Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Mathematical Optimality Proof
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Proof that χ(G) = 3 via triangle clique K₃ lower bound and Handshaking Lemma invariant verification.
            </p>
          </div>
          <MathProofSection nodes={nodes} edges={edges} />
        </section>

        {/* Page 8: Applications and Conclusion */}
        <section id="applications" className="scroll-mt-20 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
              Section 07 • Computing Impact & Conclusion
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Real-World Applications & Experiential Learnings
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              From compiler register allocation to cellular radio channels, and the DSU DMGT experiential learning outcome.
            </p>
          </div>
          <ApplicationsSection />
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}

export default App;
