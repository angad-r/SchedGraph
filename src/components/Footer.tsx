import React from 'react';
import { playClickSound } from '../utils/audio';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#09090b] text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 no-print">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-800/60">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono text-xs flex items-center justify-center">
                χ
              </span>
              <span>Exam Timetable Scheduling Platform</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Dayananda Sagar University (DSU) • Department of Computer Science & Engineering
              <br />
              Discrete Mathematics & Graph Theory (DMGT) Experiential Learning Project
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <button
              onClick={() => {
                playClickSound();
                onNavigate('problem');
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Problem
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => {
                playClickSound();
                onNavigate('graph');
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Conflict Graph
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => {
                playClickSound();
                onNavigate('simulator');
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Algorithm
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => {
                playClickSound();
                onNavigate('timetable');
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Timetable
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => {
                playClickSound();
                onNavigate('proof');
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Math Proof
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            Welsh–Powell Vertex Coloring Algorithm • Guaranteed χ(G) = 3 Minimal Coloring
          </div>
          <div className="flex items-center gap-1.5">
            <span>Designed for University Academic Demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
