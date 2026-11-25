import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  UserX,
  Palette,
  CircleDot,
} from 'lucide-react';
import type { ExamNode } from '../types';

interface ProblemSectionProps {
  nodes: ExamNode[];
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ nodes }) => {
  const [activeTab, setActiveTab] = useState<'naive' | 'graph'>('graph');
  const [selectedDemoExams, setSelectedDemoExams] = useState<string[]>(['A', 'B']);

  const handleToggleDemoExam = (id: string) => {
    if (selectedDemoExams.includes(id)) {
      if (selectedDemoExams.length > 1) {
        setSelectedDemoExams(selectedDemoExams.filter((item) => item !== id));
      }
    } else {
      if (selectedDemoExams.length < 3) {
        setSelectedDemoExams([...selectedDemoExams, id]);
      } else {
        setSelectedDemoExams([selectedDemoExams[1], selectedDemoExams[2], id]);
      }
    }
  };

  // Check if selected pair has conflict in default dataset
  const hasConflict =
    (selectedDemoExams.includes('A') && selectedDemoExams.includes('B')) ||
    (selectedDemoExams.includes('A') && selectedDemoExams.includes('C')) ||
    (selectedDemoExams.includes('A') && selectedDemoExams.includes('E')) ||
    (selectedDemoExams.includes('B') && selectedDemoExams.includes('C')) ||
    (selectedDemoExams.includes('B') && selectedDemoExams.includes('D')) ||
    (selectedDemoExams.includes('C') && selectedDemoExams.includes('F')) ||
    (selectedDemoExams.includes('D') && selectedDemoExams.includes('E')) ||
    (selectedDemoExams.includes('E') && selectedDemoExams.includes('F'));

  return (
    <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-5 md:p-6 backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white">Understanding the Examination Scheduling Dilemma</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Why traditional heuristic trial-and-error fails, and how graph theory models the conflict structure.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'graph'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Graph Theory Mapping
          </button>
          <button
            onClick={() => setActiveTab('naive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'naive'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Interactive Conflict Test
          </button>
        </div>
      </div>

      {/* Tab 1: Graph Theory Mapping */}
      {activeTab === 'graph' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 3 Core Mappings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <CircleDot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Concept 1</span>
                <h4 className="text-base font-semibold text-white">Exam = Vertex (Node)</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Each scheduled course subject (Maths, Physics, Chemistry, English, Computer Science, Economics) is mapped as a discrete vertex in graph <span className="font-mono text-zinc-200">V(G)</span>.
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                |V| = 6 Vertices
              </div>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-rose-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">Concept 2</span>
                <h4 className="text-base font-semibold text-white">Common Student = Edge</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If even one student is enrolled in both Exam A and Exam B, an undirected conflict edge <span className="font-mono text-zinc-200">(A, B) ∈ E(G)</span> is established.
              </p>
              <div className="text-[11px] font-mono text-rose-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                |E| = 8 Conflict Edges
              </div>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Concept 3</span>
                <h4 className="text-base font-semibold text-white">Time Slot = Color</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Assigning an exam to an examination day/slot corresponds to assigning a color <span className="font-mono text-zinc-200">c(v)</span> such that <span className="font-mono text-zinc-200">c(u) ≠ c(v)</span> for all adjacent vertices.
              </p>
              <div className="text-[11px] font-mono text-purple-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                Min Colors = Chromatic Number χ(G)
              </div>
            </div>
          </div>

          {/* Six Subject Cards */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              The 6 Scheduled College Examinations:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5"
                >
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {node.id}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">{node.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{node.code}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Conflict Tester */}
      {activeTab === 'naive' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 space-y-2">
            <h4 className="font-semibold text-white">Simulate Concurrent Scheduling:</h4>
            <p className="text-zinc-400">
              Pick 2 or 3 examinations below. The engine immediately evaluates if they can safely be scheduled together in the same time slot without causing an exam clash.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {nodes.map((node) => {
              const isSelected = selectedDemoExams.includes(node.id);
              return (
                <button
                  key={node.id}
                  onClick={() => handleToggleDemoExam(node.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-mono font-bold text-sm">{node.id}</div>
                  <div className="text-xs font-semibold truncate text-white">{node.name}</div>
                </button>
              );
            })}
          </div>

          {/* Test Verdict Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              hasConflict
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {hasConflict ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-sm">
                {hasConflict ? 'CONFLICT DETECTED!' : 'COMPATIBLE FOR SAME TIME SLOT!'}
              </div>
              <div className="text-zinc-300">
                {hasConflict
                  ? `Exams [${selectedDemoExams.join(', ')}] share common student enrollments. They CANNOT be scheduled at the same time.`
                  : `Exams [${selectedDemoExams.join(', ')}] share no mutual students. They CAN safely run concurrently!`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
