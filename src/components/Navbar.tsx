import React, { useState } from 'react';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { isAudioEnabled, toggleAudio, playClickSound } from '../utils/audio';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(() => isAudioEnabled());

  const handleToggleSound = () => {
    const newState = toggleAudio();
    setAudioActive(newState);
    if (newState) playClickSound();
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem' },
    { id: 'students', label: 'Student Data' },
    { id: 'graph', label: 'Conflict Graph' },
    { id: 'simulator', label: 'Welsh–Powell' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'proof', label: 'Math Proof' },
    { id: 'applications', label: 'Applications' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => {
            playClickSound();
            onNavigate('overview');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-purple-400 text-sm">
                χ
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                SchedGraph
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                DSU
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono -mt-0.5">Welsh–Powell Algorithm</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  onNavigate(item.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Audio toggle button */}
          <button
            onClick={handleToggleSound}
            aria-label={audioActive ? 'Mute UI sounds' : 'Enable tactile audio feedback'}
            className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
              audioActive
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title={audioActive ? 'Mute UI sounds' : 'Enable tactile audio feedback'}
          >
            {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] font-mono hidden sm:inline">
              {audioActive ? 'Audio ON' : 'Audio OFF'}
            </span>
          </button>

          {/* Quick CTA to Simulator */}
          <button
            onClick={() => {
              playClickSound();
              onNavigate('simulator');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run Algorithm</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-5 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playClickSound();
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/50'
                  : 'text-zinc-400 hover:bg-zinc-900 text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
