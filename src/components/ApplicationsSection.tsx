import React from 'react';
import {
  Cpu,
  Radio,
  CalendarCheck,
  Server,
  Layers,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';

export const ApplicationsSection: React.FC = () => {
  const applications = [
    {
      title: 'University Examination Scheduling',
      icon: CalendarCheck,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      mapping: 'Exams = Vertices, Shared Students = Edges, Time Slots = Colors',
      description:
        'Prevents timetable clashes for thousands of students enrolled in multi-disciplinary courses across large collegiate universities like Dayananda Sagar University.',
      benefit: 'Minimizes overall exam duration while guaranteeing zero student conflicts.',
    },
    {
      title: 'Wireless Frequency Assignment',
      icon: Radio,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      mapping: 'Cell Towers = Vertices, Geographic Proximity = Edges, Frequency Bands = Colors',
      description:
        'Cellular base stations and 5G transmitters located near each other cannot operate on identical carrier frequencies without generating severe signal interference.',
      benefit: 'Maximizes spectral efficiency and saves millions in radio spectrum licensing.',
    },
    {
      title: 'Compiler Register Allocation',
      icon: Cpu,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      mapping: 'Variables = Vertices, Overlapping Lifetimes = Edges, Physical Registers = Colors',
      description:
        "Modern optimizing compilers (LLVM, GCC) use Chaitin's graph coloring heuristic to allocate finite CPU hardware registers (e.g., RAX, RBX) to infinite program variables.",
      benefit: 'Massively accelerates binary execution speed by avoiding memory spill/load operations.',
    },
    {
      title: 'Cloud & Kubernetes Resource Allocation',
      icon: Server,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      mapping: 'Microservices = Vertices, Shared Resource Contention = Edges, Server Nodes = Colors',
      description:
        'Distributed systems distribute compute-intensive microservices across bare-metal nodes to prevent concurrent I/O bottlenecking on shared disks or networking interfaces.',
      benefit: 'Guarantees SLA uptime and maximizes hardware server utilization.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Real World Applications Section */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-5 md:p-6 backdrop-blur-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white">Real-World Industrial & Computing Applications</h3>
          </div>
          <p className="text-xs text-zinc-400">
            How vertex coloring transcends college scheduling to solve fundamental NP-complete optimization problems in computer science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.title}
                className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`p-2 rounded-lg ${app.bgColor} border ${app.borderColor} ${app.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <h4 className="text-sm font-semibold text-white">{app.title}</h4>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {app.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                    <span className="text-zinc-500 block mb-0.5">ISOMORPHIC GRAPH MAPPING:</span>
                    <span className="text-cyan-300">{app.mapping}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span className="text-emerald-400 font-medium">Core Advantage:</span>
                  <span className="text-zinc-300 text-right">{app.benefit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DSU Project Learning Outcomes & Conclusion */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/80 p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Experiential Learning Project
              </span>
              <span className="text-xs text-zinc-500 font-mono">DMGT Coursework</span>
            </div>
            <h3 className="text-xl font-bold text-white">Dayananda Sagar University (DSU)</h3>
            <p className="text-xs text-zinc-400">
              Department of Computer Science & Engineering • Discrete Mathematical Structures & Graph Theory
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-zinc-500 block">ALGORITHMIC COMPLEXITY</span>
            <span className="text-sm font-mono font-bold text-purple-400">O(V² + V log V)</span>
          </div>
        </div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Theory to Implementation</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bridged abstract discrete mathematics concepts (cliques, chromatic numbers, adjacency matrices) into a tangible, production-ready full-stack software application.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Heuristic Algorithmic Mastery</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Demonstrated how Welsh–Powell's greedy descending-degree heuristic solves an NP-complete chromatic problem in polynomial time for real-world timetables.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <span>Automated Verification</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Integrated an automated audit engine certifying zero student collisions, verified against the mathematical lower bound χ(G) ≥ ω(G) = 3.
            </p>
          </div>
        </div>

        {/* Conclusion summary quote */}
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>
              <strong>Project Conclusion:</strong> Graph coloring effectively transformed an intractable examination conflict dilemma into an elegant, provably optimal 3-day schedule.
            </span>
          </div>
          <span className="font-mono text-cyan-400 text-[11px]">Bangalore, Karnataka</span>
        </div>
      </div>
    </div>
  );
};
