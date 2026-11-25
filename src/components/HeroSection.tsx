import React from 'react';
import { ArrowRight, Play, GraduationCap, Network, ShieldCheck, Clock } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeroSectionProps {
  onExplore: () => void;
  onRunAlgorithm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onRunAlgorithm }) => {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Floating Geometric Nodes in Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="20%" x2="35%" y2="40%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="35%" y1="40%" x2="65%" y2="25%" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="65%" y1="25%" x2="85%" y2="55%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="35%" y1="40%" x2="50%" y2="75%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="15%" cy="20%" r="5" fill="#38bdf8" />
          <circle cx="35%" cy="40%" r="7" fill="#a855f7" />
          <circle cx="65%" cy="25%" r="6" fill="#10b981" />
          <circle cx="85%" cy="55%" r="5" fill="#38bdf8" />
          <circle cx="50%" cy="75%" r="6" fill="#a855f7" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Academic Project Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm animate-in fade-in slide-in-from-top-4">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span className="text-zinc-400">Dayananda Sagar University</span>
          <span className="text-zinc-600">•</span>
          <span className="text-cyan-400 font-semibold">DMGT Experiential Learning</span>
        </div>

        {/* Main Headings */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Exam Timetable{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Scheduling
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Solving Examination Conflicts Through Graph Coloring & the Welsh–Powell Algorithm
          </p>
        </div>

        {/* Feature Tags Pill List */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {[
            { label: 'Graph Theory', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20' },
            { label: 'Welsh–Powell Algorithm', color: 'border-purple-500/30 text-purple-400 bg-purple-950/20' },
            { label: 'DMGT Experiential Learning', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20' },
            { label: 'Interactive Demonstration', color: 'border-sky-500/30 text-sky-400 bg-sky-950/20' },
          ].map((tag) => (
            <span
              key={tag.label}
              className={`text-xs font-mono px-3 py-1 rounded-full border ${tag.color} backdrop-blur-sm`}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              playClickSound();
              onExplore();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 text-sm font-semibold transition-all shadow-md hover:border-zinc-600"
          >
            <span>Explore the Project</span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            onClick={() => {
              playClickSound();
              onRunAlgorithm();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-sm font-bold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/35 hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>Run Algorithm</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700 transition-colors text-left">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Examinations</span>
              <Network className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">6</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Maths, Physics, CS...</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700 transition-colors text-left">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Conflicts</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">8</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Shared Student Edges</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700 transition-colors text-left">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Time Slots</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">3</div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Minimal Chromatic Days</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700 transition-colors text-left">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Clashes</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">0</div>
            <p className="text-[11px] text-emerald-400/80 font-medium mt-0.5">Guaranteed Clash-Free</p>
          </div>
        </div>
      </div>
    </div>
  );
};
