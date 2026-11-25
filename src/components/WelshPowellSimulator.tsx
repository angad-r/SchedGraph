import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Layers,
  Sliders,
} from 'lucide-react';
import type { ExamNode, Edge, AlgorithmStep } from '../types';
import { COLOR_SCHEMES } from '../data/defaultData';
import { generateWelshPowellSteps } from '../utils/graphAlgorithms';
import { playAssignSound, playConflictSound, playCompleteSound, playClickSound } from '../utils/audio';

interface WelshPowellSimulatorProps {
  nodes: ExamNode[];
  edges: Edge[];
  onStepChange?: (step: AlgorithmStep) => void;
  onColoringChange?: (coloring: Record<string, number>) => void;
}

export const WelshPowellSimulator: React.FC<WelshPowellSimulatorProps> = ({
  nodes,
  edges,
  onStepChange,
  onColoringChange,
}) => {
  // Pre-generate steps
  const { steps, sortedVertices, degrees } = React.useMemo(() => {
    return generateWelshPowellSteps(nodes, edges, ['A', 'B', 'C', 'E', 'D', 'F']);
  }, [nodes, edges]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prevDatasetVersion, setPrevDatasetVersion] = useState({ nodes, edges });

  if (prevDatasetVersion.nodes !== nodes || prevDatasetVersion.edges !== edges) {
    setPrevDatasetVersion({ nodes, edges });
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200); // ms per step
  const timerRef = useRef<number | null>(null);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Notify parent of step change
  useEffect(() => {
    if (onStepChange) onStepChange(currentStep);
    if (onColoringChange) onColoringChange(currentStep.coloredNodes);

    // Audio effects
    if (currentStep.type === 'assign_color') {
      playAssignSound(currentStep.colorId || 1);
    } else if (currentStep.type === 'skip_conflict') {
      playConflictSound();
    } else if (currentStep.type === 'completed') {
      playCompleteSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#a855f7', '#10b981'],
        });
      } catch {
        // ignore
      }
    }
  }, [currentStepIndex, currentStep, onStepChange, onColoringChange]);

  // Autoplay loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const handleNext = () => {
    playClickSound();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    playClickSound();
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStart = () => {
    playClickSound();
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(1);
    }
    setIsPlaying(true);
  };

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Progress percentage
  const progressPercent = Math.round((currentStepIndex / Math.max(1, steps.length - 1)) * 100);

  return (
    <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-5 md:p-6 backdrop-blur-sm space-y-6">
      {/* Header and Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-semibold text-white">Welsh–Powell Algorithm Execution Engine</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Interactive step-by-step simulator following greedy vertex coloring heuristic.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
            title="Reset to Step 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={() => setIsPlaying(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold transition-colors"
            >
              <Pause className="w-4 h-4 fill-amber-300" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-zinc-950 hover:bg-cyan-400 text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-colors"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>{currentStepIndex === 0 ? 'Start Algorithm' : 'Auto Play'}</span>
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentStepIndex >= steps.length - 1}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium transition-colors"
            title="Next Step"
          >
            <span>Next Step</span>
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1.5 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400">
            <Sliders className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer text-xs"
            >
              <option value={2000} className="bg-zinc-900 text-zinc-300">0.5x (Slow)</option>
              <option value={1200} className="bg-zinc-900 text-zinc-300">1.0x (Normal)</option>
              <option value={600} className="bg-zinc-900 text-zinc-300">2.0x (Fast)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span className="text-cyan-400 font-semibold">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/80">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Step Banner */}
      <div
        className={`p-4 md:p-5 rounded-xl border transition-all ${
          currentStep.type === 'assign_color'
            ? 'bg-cyan-950/20 border-cyan-500/40'
            : currentStep.type === 'skip_conflict'
            ? 'bg-rose-950/20 border-rose-500/40'
            : currentStep.type === 'completed'
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-zinc-950/60 border-zinc-800'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                {currentStep.type.replace('_', ' ')}
              </span>
              {currentStep.colorId && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Day {currentStep.colorId}
                </span>
              )}
            </div>
            <h4 className="text-base font-semibold text-white">{currentStep.title}</h4>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
              {currentStep.description}
            </p>
          </div>

          {currentStep.currentVertexId && (
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">CURRENT CANDIDATE</span>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-cyan-300 font-mono font-bold text-sm">
                <span>{currentStep.currentVertexId}</span>
                <span className="text-xs text-zinc-400 font-sans font-normal">
                  ({nodeMap.get(currentStep.currentVertexId)?.name})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sorted Vertices Queue Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sorted Priority Queue (Descending Degrees):</span>
          </span>
          <span className="text-[11px] text-zinc-500">
            Order: A(3) → B(3) → C(3) → E(3) → D(2) → F(2)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {sortedVertices.map((vertexId) => {
            const node = nodeMap.get(vertexId);
            const deg = degrees[vertexId] || 0;
            const assignedColorId = currentStep.coloredNodes[vertexId];
            const colorScheme = assignedColorId
              ? COLOR_SCHEMES.find((c) => c.id === assignedColorId)
              : null;
            const isCurrentlyEvaluating = currentStep.currentVertexId === vertexId;
            const isConflicting = currentStep.conflictingVertexId === vertexId;

            let cardBorder = 'border-zinc-800/80';
            let cardBg = 'bg-zinc-950/60';

            if (colorScheme) {
              cardBorder = `border-[${colorScheme.colorHex}]/60`;
              cardBg = colorScheme.badgeClass;
            } else if (isCurrentlyEvaluating) {
              cardBorder = 'border-cyan-400 ring-2 ring-cyan-400/20';
              cardBg = 'bg-cyan-950/30';
            } else if (isConflicting) {
              cardBorder = 'border-rose-500 ring-2 ring-rose-500/20';
              cardBg = 'bg-rose-950/30';
            }

            return (
              <div
                key={vertexId}
                className={`p-3 rounded-xl border transition-all ${cardBorder} ${cardBg} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-700/80 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {vertexId}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900/80">
                    deg {deg}
                  </span>
                </div>

                <div className="text-xs font-semibold text-zinc-200 truncate mb-1">
                  {node?.name}
                </div>

                <div className="pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono">
                  {colorScheme ? (
                    <span
                      className="font-bold flex items-center gap-1"
                      style={{ color: colorScheme.colorHex }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {colorScheme.dayName}
                    </span>
                  ) : isCurrentlyEvaluating ? (
                    <span className="text-cyan-400 font-bold animate-pulse">Evaluating</span>
                  ) : isConflicting ? (
                    <span className="text-rose-400 font-bold">Conflict</span>
                  ) : (
                    <span className="text-zinc-500">Uncolored</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Pass Summary Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        {[1, 2, 3].map((dayId) => {
          const colorScheme = COLOR_SCHEMES.find((c) => c.id === dayId)!;
          const assignedInThisDay = Object.entries(currentStep.coloredNodes)
            .filter(([, color]) => color === dayId)
            .map(([id]) => id);

          const isCurrentActiveDay = currentStep.colorId === dayId;

          return (
            <div
              key={dayId}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrentActiveDay
                  ? 'bg-zinc-900/90 border-zinc-700 shadow-md ring-1 ring-cyan-500/20'
                  : 'bg-zinc-950/40 border-zinc-800/80 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: colorScheme.colorHex }}
                  />
                  <span className="font-semibold text-xs text-white">
                    {colorScheme.dayName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {assignedInThisDay.length} Scheduled
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
                {assignedInThisDay.length > 0 ? (
                  assignedInThisDay.map((id) => {
                    const node = nodeMap.get(id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium border"
                        style={{
                          backgroundColor: colorScheme.bgHex,
                          borderColor: colorScheme.borderHex,
                          color: colorScheme.colorHex,
                        }}
                      >
                        <strong>{id}</strong>
                        <span className="text-zinc-300 font-sans text-[11px]">
                          {node?.name}
                        </span>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[11px] text-zinc-600 italic">No exams assigned yet</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
