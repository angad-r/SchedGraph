import React, { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move, CheckCircle2 } from 'lucide-react';
import type { ExamNode, Edge } from '../types';
import { COLOR_SCHEMES } from '../data/defaultData';

interface ConflictGraphProps {
  nodes: ExamNode[];
  edges: Edge[];
  nodeColors?: Record<string, number>;
  activeNodeId?: string | null;
  conflictingNodeId?: string | null;
  highlightedEdges?: string[]; // Edge IDs or 'u-v'
  highlightedNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  onNodePositionChange?: (nodeId: string, x: number, y: number) => void;
  onEdgeClick?: (edge: Edge) => void;
  interactive?: boolean;
}

export const ConflictGraph: React.FC<ConflictGraphProps> = ({
  nodes,
  edges,
  nodeColors = {},
  activeNodeId = null,
  conflictingNodeId = null,
  highlightedEdges = [],
  highlightedNodeId = null,
  onNodeClick,
  onNodePositionChange,
  onEdgeClick,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Focus node is either prop highlighted, internal selected, or internal hovered
  const effectiveFocusNode = highlightedNodeId || selectedNodeId || hoveredNodeId;

  // Compute degrees
  const degrees: Record<string, number> = {};
  const neighbors: Record<string, Set<string>> = {};
  nodes.forEach((n) => {
    degrees[n.id] = 0;
    neighbors[n.id] = new Set();
  });
  edges.forEach((e) => {
    if (degrees[e.source] !== undefined) degrees[e.source]++;
    if (degrees[e.target] !== undefined) degrees[e.target]++;
    if (neighbors[e.source]) neighbors[e.source].add(e.target);
    if (neighbors[e.target]) neighbors[e.target].add(e.source);
  });

  // Handle Dragging
  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (!interactive) return;
    setDraggingNodeId(nodeId);
    setSelectedNodeId(nodeId);
    if (onNodeClick) onNodeClick(nodeId);
  };

  const handleTouchStartNode = (e: React.TouchEvent, nodeId: string) => {
    e.stopPropagation();
    if (!interactive) return;
    setDraggingNodeId(nodeId);
    setSelectedNodeId(nodeId);
    if (onNodeClick) onNodeClick(nodeId);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingNodeId && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left - pan.x;
        const clientY = e.clientY - rect.top - pan.y;
        const newX = Math.round(clientX / zoom);
        const newY = Math.round(clientY / zoom);

        if (onNodePositionChange) {
          onNodePositionChange(draggingNodeId, Math.max(40, Math.min(680, newX)), Math.max(40, Math.min(460, newY)));
        }
      } else if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [draggingNodeId, isPanning, pan.x, pan.y, panStart.x, panStart.y, zoom, onNodePositionChange]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (draggingNodeId && containerRef.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = touch.clientX - rect.left - pan.x;
        const clientY = touch.clientY - rect.top - pan.y;
        const newX = Math.round(clientX / zoom);
        const newY = Math.round(clientY / zoom);

        if (onNodePositionChange) {
          onNodePositionChange(draggingNodeId, Math.max(40, Math.min(680, newX)), Math.max(40, Math.min(460, newY)));
        }
      }
    },
    [draggingNodeId, pan.x, pan.y, zoom, onNodePositionChange]
  );

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedNodeId(null);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
  };

  // Node position lookup
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Selected Node Details
  const focusedNode = effectiveFocusNode ? nodeMap.get(effectiveFocusNode) : null;
  const focusedNeighbors = effectiveFocusNode && neighbors[effectiveFocusNode]
    ? Array.from(neighbors[effectiveFocusNode])
    : [];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleContainerMouseDown}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
      style={{ touchAction: draggingNodeId ? 'none' : 'auto' }}
      className="relative w-full h-[480px] md:h-[540px] bg-[#0c0d12] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl select-none"
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #71717a 1px, transparent 0)`,
          backgroundSize: '24px 24px',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      />

      {/* Floating Header Info */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 text-xs font-mono bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Graph G = (V, E) | |V| = {nodes.length}, |E| = {edges.length}</span>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800 shadow-lg">
        <button
          onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-zinc-400 px-1">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-zinc-800 mx-0.5" />
        <button
          onClick={resetView}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Node Inspector Floating HUD */}
      {focusedNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-zinc-950/90 backdrop-blur-md p-3.5 rounded-xl border border-zinc-800 shadow-xl max-w-xs transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-sm font-mono">
                {focusedNode.id}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white leading-tight">{focusedNode.name}</h4>
                <p className="text-[11px] text-zinc-400 font-mono">{focusedNode.code}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              deg = {degrees[focusedNode.id] || 0}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-300 pt-1 border-t border-zinc-800/80">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500">Department:</span>
              <span className="text-zinc-300 truncate max-w-[170px]">{focusedNode.department}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500">Conflicts With:</span>
              <span className="font-mono text-cyan-300">
                {focusedNeighbors.length > 0 ? focusedNeighbors.join(', ') : 'None'}
              </span>
            </div>
            {nodeColors[focusedNode.id] ? (
              <div className="flex justify-between items-center text-[11px] pt-1">
                <span className="text-zinc-500">Scheduled:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Day {nodeColors[focusedNode.id]} (Slot {nodeColors[focusedNode.id]})
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center text-[11px] pt-1 text-zinc-400">
                <span className="text-zinc-500">Status:</span>
                <span>Unscheduled</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drag Helper Tip */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono pointer-events-none bg-zinc-900/60 px-2.5 py-1 rounded-md border border-zinc-800/60">
        <Move className="w-3 h-3" />
        <span>Drag vertices to reposition • Click to inspect</span>
      </div>

      {/* Main SVG Visualization */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox="0 0 740 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Glow Filter */}
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense Accent Glow */}
          <filter id="accent-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ transformOrigin: '370px 250px', transition: isPanning ? 'none' : 'transform 0.15s ease-out' }}
        >
          {/* Edges */}
          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const isHighlightedByEdgeProp =
              highlightedEdges.includes(edge.id) ||
              highlightedEdges.includes(`${edge.source}-${edge.target}`) ||
              highlightedEdges.includes(`${edge.target}-${edge.source}`);

            const isIncidentToFocus =
              effectiveFocusNode &&
              (edge.source === effectiveFocusNode || edge.target === effectiveFocusNode);

            const isConflictPulsing =
              (activeNodeId === edge.source && conflictingNodeId === edge.target) ||
              (activeNodeId === edge.target && conflictingNodeId === edge.source);

            // Calculate midpoint for edge label
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            let strokeColor = '#27272a'; // zinc-800
            let strokeWidth = 2;
            let opacity = 0.6;
            let strokeDasharray = 'none';

            if (isConflictPulsing) {
              strokeColor = '#f43f5e'; // rose-500
              strokeWidth = 3.5;
              opacity = 1;
              strokeDasharray = '6,4';
            } else if (isHighlightedByEdgeProp) {
              strokeColor = '#38bdf8'; // cyan-400
              strokeWidth = 3;
              opacity = 1;
            } else if (isIncidentToFocus) {
              strokeColor = '#a855f7'; // purple-500
              strokeWidth = 2.5;
              opacity = 0.95;
            } else if (effectiveFocusNode && !isIncidentToFocus) {
              opacity = 0.15;
            }

            return (
              <g key={edge.id} className="transition-all duration-300">
                {/* Background thicker hit-area / glow */}
                {(isIncidentToFocus || isHighlightedByEdgeProp || isConflictPulsing) && (
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth + 4}
                    strokeOpacity={0.3}
                    filter="url(#glow-filter)"
                  />
                )}

                {/* Primary Edge Line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                />

                {/* Transparent hit area for easy touch / click interaction */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="transparent"
                  strokeWidth={16}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEdgeClick) onEdgeClick(edge);
                  }}
                />

                {/* Conflict Badge on Edge if Highlighted */}
                {(isHighlightedByEdgeProp || isIncidentToFocus || isConflictPulsing) && edge.students.length > 0 && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-14"
                      y="-8"
                      width="28"
                      height="16"
                      rx="4"
                      fill="#18181b"
                      stroke={isConflictPulsing ? '#f43f5e' : strokeColor}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isConflictPulsing ? '#f43f5e' : '#e4e4e7'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {edge.students.join(',')}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const colorId = nodeColors[node.id];
            const colorScheme = colorId ? COLOR_SCHEMES.find((c) => c.id === colorId) : null;
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNodeId === node.id || highlightedNodeId === node.id;
            const isActiveCandidate = activeNodeId === node.id;
            const isConflicting = conflictingNodeId === node.id;

            // Determine Node Styling
            let fillColor = '#18181b';
            let strokeColor = '#3f3f46';
            let strokeWidth = 2;
            let filter: string | undefined = undefined;

            if (colorScheme) {
              fillColor = colorScheme.colorHex;
              strokeColor = '#ffffff';
              strokeWidth = 2.5;
            }

            if (isActiveCandidate) {
              strokeColor = '#38bdf8'; // active cyan ring
              strokeWidth = 3.5;
              filter = 'url(#accent-glow)';
            } else if (isConflicting) {
              strokeColor = '#f43f5e'; // red conflict ring
              strokeWidth = 3.5;
              filter = 'url(#accent-glow)';
            } else if (isSelected || isHovered) {
              strokeWidth = 3;
              filter = 'url(#glow-filter)';
            }

            // Opacity dimming if another node is focused and this node is not adjacent
            let nodeOpacity = 1;
            if (effectiveFocusNode && effectiveFocusNode !== node.id && !neighbors[effectiveFocusNode]?.has(node.id)) {
              nodeOpacity = 0.35;
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                onTouchStart={(e) => handleTouchStartNode(e, node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: nodeOpacity }}
              >
                {/* Active Candidate Pulsing Outer Ring */}
                {isActiveCandidate && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {/* Conflicting Pulsing Outer Ring */}
                {isConflicting && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeDasharray="3,3"
                    className="animate-pulse"
                  />
                )}

                {/* Outer Glow Halo for Colored Node */}
                {colorScheme && (
                  <circle
                    r="28"
                    fill={colorScheme.colorHex}
                    fillOpacity="0.25"
                    filter="url(#glow-filter)"
                  />
                )}

                {/* Base Node Circle */}
                <circle
                  r="24"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter={filter}
                  className="transition-all duration-200"
                />

                {/* Node ID Label */}
                <text
                  x="0"
                  y="6"
                  textAnchor="middle"
                  fill={colorScheme ? '#09090b' : '#ffffff'}
                  fontSize="17"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="bold"
                >
                  {node.id}
                </text>

                {/* Subject Name Tag Below Node */}
                <g transform="translate(0, 38)">
                  <rect
                    x="-42"
                    y="-9"
                    width="84"
                    height="18"
                    rx="5"
                    fill="#09090b"
                    fillOpacity="0.85"
                    stroke="#27272a"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#d4d4d8"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {node.name}
                  </text>
                </g>

                {/* Degree Badge (top right pill) */}
                <g transform="translate(18, -18)">
                  <circle
                    r="9"
                    fill="#27272a"
                    stroke="#3f3f46"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#a1a1aa"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {degrees[node.id] || 0}
                  </text>
                </g>

                {/* Color/Slot Day Badge if colored (top left) */}
                {colorScheme && (
                  <g transform="translate(-18, -18)">
                    <circle
                      r="9"
                      fill="#09090b"
                      stroke={colorScheme.colorHex}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={colorScheme.colorHex}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      D{colorScheme.id}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
