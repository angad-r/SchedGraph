# Exam Timetable Scheduling Using Graph Coloring – Welsh–Powell Algorithm
**Dayananda Sagar University (DSU) • DMGT Experiential Learning Project**

> A full-stack, interactive computer science visualization platform demonstrating how Vertex Graph Coloring and the **Welsh–Powell Algorithm** solve collegiate examination conflict scheduling.

---

## 🌟 Project Overview

Colleges face the complex challenge of scheduling multiple course examinations into the minimum number of time slots without causing collisions for students enrolled in concurrent courses.

By translating this problem into **Graph Theory**:
- **Exam = Vertex ($V$)**
- **Common Student Enrollment = Conflict Edge ($E$)**
- **Examination Day / Time Slot = Vertex Color ($C$)**

The problem transforms into finding a **proper vertex coloring** of graph $G = (V, E)$ using the **chromatic number $\chi(G)$** of the graph.

---

## 🎯 Key Capabilities & Features

### 1. Interactive Conflict Graph
- Real-time SVG-based conflict graph with draggable vertices, glowing edges, and incident edge highlights.
- Visual degree counters and neighbor inspectors.
- Zoom in/out, pan, and view reset controls.
- Dynamic adjacency matrix $A(G)$ with synchronized edge hover highlights.

### 2. Welsh–Powell Algorithm Simulator
- Step-by-step algorithmic playback with **Play, Pause, Next Step, Prev Step, and Reset**.
- Speed controls: `0.5x`, `1.0x`, and `2.0x`.
- Live priority queue tracking vertices sorted in non-increasing degree order:
  $$\text{Degree Order: } A(3) \rightarrow B(3) \rightarrow C(3) \rightarrow E(3) \rightarrow D(2) \rightarrow F(2)$$
- Real-time color assignments, conflict clash skipping notifications, and celebration effects on completion.

### 3. Student Enrollment & Conflict Data Table
- Exact Dayananda Sagar University dataset:
  - **S1:** Maths ($A$), Physics ($B$), Chemistry ($C$) $\rightarrow$ Edges: $A\text{--}B, A\text{--}C, B\text{--}C$
  - **S2:** Maths ($A$), Computer Science ($E$) $\rightarrow$ Edge: $A\text{--}E$
  - **S3:** Physics ($B$), English ($D$) $\rightarrow$ Edge: $B\text{--}D$
  - **S4:** Chemistry ($C$), Economics ($F$) $\rightarrow$ Edge: $C\text{--}F$
  - **S5:** English ($D$), Computer Science ($E$) $\rightarrow$ Edge: $D\text{--}E$
  - **S6:** Computer Science ($E$), Economics ($F$) $\rightarrow$ Edge: $E\text{--}F$
- Selecting a student isolates and highlights their conflict edges in the graph.
- Interactive custom student addition to test dynamic graph re-calculation.

### 4. Generated Clash-Free Timetable
- Day-by-day exam schedules:
  - **Day 1 (Color 1 - Cyan):** Maths ($A$), English ($D$), Economics ($F$)
  - **Day 2 (Color 2 - Violet):** Physics ($B$), Computer Science ($E$)
  - **Day 3 (Color 3 - Emerald):** Chemistry ($C$)
- Conflict-Free Verification Engine certifying 0 clashes across all pairwise exams and student schedules.
- **Export to CSV** and **Print / PDF Download** with formatted examination headers.

### 5. Mathematical Proof of Optimality
- **Clique Lower Bound:** Subgraph induced by $\{A, B, C\}$ forms a 3-clique ($K_3$), proving $\chi(G) \ge \omega(G) = 3$.
- **Constructive Upper Bound:** Welsh–Powell outputs a valid coloring with $k = 3$, proving $\chi(G) \le 3$.
- **Conclusion:** By the Squeeze Principle, $\chi(G) = 3$ is strictly minimal and optimal.
- **Euler's Handshaking Lemma Verification:**
  $$\sum_{v \in V} \deg(v) = 3 + 3 + 3 + 3 + 2 + 2 = 16 = 2 \times |E| = 2 \times 8$$

### 6. Real-World Applications Gallery
- University examination scheduling
- Cellular & 5G radio frequency band allocation
- Optimizing compiler register allocation (Chaitin's Algorithm)
- Cloud & Kubernetes server resource contention

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Dark aesthetic inspired by Linear, Raycast, and Vercel)
- **Icons:** Lucide React
- **Animations & Effects:** Web Audio API (tactile clicks & chimes), Canvas Confetti

---

## 🚀 Running the Project Locally

```bash
# Clone the repository
cd SchedGraph

# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build production bundle
npm run build
```

Open `http://localhost:5173` in your browser.

---

## 🏛️ Academic Attribution

- **Institution:** Dayananda Sagar University (DSU), Bangalore, Karnataka
- **Department:** Department of Computer Science & Engineering
- **Course:** Discrete Mathematical Structures & Graph Theory (DMGT)
- **Topic:** Graph Coloring & Welsh–Powell Algorithm Experiential Learning
