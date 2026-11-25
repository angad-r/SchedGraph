import React, { useState } from 'react';
import type { ExamNode, Edge } from '../types';
import { generateAdjacencyMatrix } from '../utils/graphAlgorithms';
import { COLOR_SCHEMES } from '../data/defaultData';

interface AdjacencyMatrixProps {
  nodes: ExamNode[];
  edges: Edge[];
  onHoverEdge?: (edgeId: string | null) => void;
  onSelectNode?: (nodeId: string | null) => void;
  nodeColors?: Record<string, number>;
}

export const AdjacencyMatrix: React.FC<AdjacencyMatrixProps> = ({
  nodes,
  edges,
  onHoverEdge,
  onSelectNode,
  nodeColors = {},
}) => {
  const { matrix, headers } = generateAdjacencyMatrix(nodes, edges);
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string } | null>(null);

  // Compute row degrees
  const rowDegrees = matrix.map((row) => row.reduce((sum, val) => sum + val, 0));
  const totalDegreeSum = rowDegrees.reduce((sum, val) => sum + val, 0);

  const handleCellMouseEnter = (u: string, v: string) => {
    setHoveredCell({ row: u, col: v });
    if (u !== v && matrix[headers.indexOf(u)][headers.indexOf(v)] === 1) {
      if (onHoverEdge) onHoverEdge(`${u}-${v}`);
    }
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
    if (onHoverEdge) onHoverEdge(null);
  };

  return (
    <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Adjacency Matrix</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              A(G) ∈ {'{0, 1}'}^{headers.length}×{headers.length}
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Binary symmetric matrix where <code className="text-cyan-400">A[i][j] = 1</code> denotes an exam conflict.
          </p>
        </div>

        {hoveredCell && hoveredCell.row !== hoveredCell.col && (
          <div className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-cyan-300 border border-zinc-700 animate-in fade-in">
            {hoveredCell.row} ↔ {hoveredCell.col}:{' '}
            {matrix[headers.indexOf(hoveredCell.row)][headers.indexOf(hoveredCell.col)] === 1
              ? 'Conflict (Edge = 1)'
              : 'Clash-Free (Edge = 0)'}
          </div>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="w-full text-center border-collapse text-xs font-mono">
          <thead>
            <tr>
              <th className="p-2 text-zinc-500 font-medium border-b border-zinc-800 text-left">Vertex</th>
              {headers.map((h) => {
                const isHoverCol = hoveredCell?.col === h;
                return (
                  <th
                    key={h}
                    onMouseEnter={() => onSelectNode && onSelectNode(h)}
                    onMouseLeave={() => onSelectNode && onSelectNode(null)}
                    className={`p-2 font-bold transition-colors cursor-pointer border-b border-zinc-800 ${
                      isHoverCol ? 'text-cyan-400 bg-cyan-950/20' : 'text-zinc-300'
                    }`}
                  >
                    {h}
                  </th>
                );
              })}
              <th className="p-2 text-zinc-400 font-semibold border-b border-zinc-800 text-right">
                deg(v)
              </th>
            </tr>
          </thead>
          <tbody>
            {headers.map((u, i) => {
              const isHoverRow = hoveredCell?.row === u;
              const nodeObj = nodes.find((n) => n.id === u);
              return (
                <tr
                  key={u}
                  className={`transition-colors ${
                    isHoverRow ? 'bg-zinc-800/40' : 'hover:bg-zinc-800/20'
                  }`}
                >
                  <td
                    onMouseEnter={() => onSelectNode && onSelectNode(u)}
                    onMouseLeave={() => onSelectNode && onSelectNode(null)}
                    className="p-2 text-left font-bold text-zinc-300 border-r border-zinc-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5">
                      {nodeColors[u] && (
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: COLOR_SCHEMES.find((c) => c.id === nodeColors[u])?.colorHex }}
                          title={`Assigned Day ${nodeColors[u]}`}
                        />
                      )}
                      <span className="text-cyan-400">{u}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-sans font-normal truncate max-w-[80px]">
                      {nodeObj?.name}
                    </span>
                  </td>
                  {headers.map((v, j) => {
                    const isDiagonal = i === j;
                    const val = matrix[i][j];
                    const isHoverCell = hoveredCell?.row === u && hoveredCell?.col === v;

                    let cellBg = '';
                    let textClass = 'text-zinc-500';

                    if (isDiagonal) {
                      cellBg = 'bg-zinc-950/40 text-zinc-600';
                    } else if (val === 1) {
                      cellBg = isHoverCell ? 'bg-cyan-500 text-black font-bold' : 'bg-cyan-500/10 text-cyan-300';
                    } else {
                      cellBg = isHoverCell ? 'bg-zinc-700/50 text-zinc-200' : '';
                    }

                    return (
                      <td
                        key={`${u}-${v}`}
                        onMouseEnter={() => handleCellMouseEnter(u, v)}
                        onMouseLeave={handleCellMouseLeave}
                        className={`p-2 transition-all cursor-pointer border border-zinc-800/40 ${cellBg} ${textClass}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                  <td className="p-2 text-right font-bold text-purple-400 border-l border-zinc-800">
                    {rowDegrees[i]}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-zinc-800 text-zinc-400 text-[11px]">
              <td colSpan={headers.length + 1} className="p-2 text-left text-zinc-500">
                Sum of row degrees Σ deg(v) = 2 × |E|
              </td>
              <td className="p-2 text-right font-bold text-purple-300 font-mono">
                {totalDegreeSum}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400 pt-3 border-t border-zinc-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500/20 border border-cyan-500/40"></span>
            <span>1 = Conflict Edge</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-zinc-800 border border-zinc-700"></span>
            <span>0 = Compatible</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-zinc-950 border border-zinc-900"></span>
            <span>Diagonal = 0</span>
          </span>
        </div>
        <div className="text-zinc-500">
          Handshaking Lemma: <span className="font-mono text-zinc-300">{totalDegreeSum} = 2 × {edges.length}</span>
        </div>
      </div>
    </div>
  );
};
