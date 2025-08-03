// main.js
//
// Browser entry point for the Mini‑Cytosim 2D demo.  This script
// dynamically loads the WebAssembly backend compiled from C++ via
// Emscripten and drives the simulation based on user input.  It
// preserves the existing UI but replaces the JavaScript physics with
// calls into the WASM engine.

import WasmBackend from './wasm_backend.js';

// Constants for the simulation.  These mirror choices made in
// cytosim/src/sim/Meca.cpp.  If you change the segment count in the
// C++ code you should update SEG_COUNT here to match.
const SEG_COUNT = 200;

// DOM elements
const startBtn = document.getElementById('startBtn');
const fibInput = document.getElementById('numFib');
const clInput = document.getElementById('numCL');
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const clChartCtx = document.getElementById('clChart').getContext('2d');
let clChart;

// WebAssembly module instance
let mod = null;
// Simulation state
let animReq = null;
let nFib = 0;
let nCl = 0;

// Wait for the WASM module to load before enabling the start button
WasmBackend().then(m => {
  mod = m;
  startBtn.disabled = false;
}).catch(err => {
  console.error('Failed to load WASM module:', err);
});

// Initialise Chart.js for visualising crosslinker lengths.  We set
// empty data here; the real labels and data are set once the
// simulation starts.
function initChart(clCount) {
  if (clChart) {
    clChart.destroy();
  }
  const labels = new Array(clCount).fill(0).map((_, i) => i);
  const data = new Array(clCount).fill(0);
  clChart = new Chart(clChartCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Crosslinker lengths',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.1,
        fill: false
      }]
    },
    options: {
      responsive: false,
      animation: false,
      scales: {
        x: {
          display: false
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function startSimulation() {
  if (!mod) {
    return;
  }
  // Cancel any existing animation loop
  if (animReq) {
    cancelAnimationFrame(animReq);
    animReq = null;
  }
  // Read parameters from the UI
  nFib = parseInt(fibInput.value, 10);
  nCl = parseInt(clInput.value, 10);
  const nMot = 0; // motors are not implemented in this simplified model
  const segLen = 0.02; // nominal segment length in simulation units
  const rigidity = 1.0; // controls Brownian amplitude
  const restLen = segLen; // rest length of crosslinkers
  const kspring = 1.0; // spring constant (unused in minimal model)
  const radius = 1.0; // radius of the confining circle
  const dt = 0.02; // time step per frame
  // Initialise simulation in WASM
  mod._init_sim(nFib, nMot, nCl, segLen, rigidity, restLen, kspring, radius, dt);
  // Setup chart with correct number of crosslinkers
  initChart(nCl);
  // Kick off animation loop
  requestAnimationFrame(stepFrame);
}

function stepFrame() {
  // Advance simulation in WASM
  mod._step_sim();
  // Compute number of points: each fibre has SEG_COUNT+1 points
  const totalPoints = nFib * (SEG_COUNT + 1);
  // Retrieve coordinates pointer and cast into Float32Array view
  const ptr = mod._get_coords();
  const coords = new Float32Array(mod.HEAPF32.buffer, ptr, totalPoints * 2);
  // Render fibres onto the canvas
  renderFibres(coords);
  // Update crosslinker lengths chart
  updateCrosslinkerChart();
  // Schedule next frame
  animReq = requestAnimationFrame(stepFrame);
}

function renderFibres(coords) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Transform simulation coordinates (unit circle) into canvas coordinates
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const scale = Math.min(canvas.width, canvas.height) / (2 * 1.05); // 1.05 for margin
  // Draw circle boundary
  ctx.strokeStyle = '#bbb';
  ctx.beginPath();
  ctx.arc(cx, cy, scale, 0, Math.PI * 2);
  ctx.stroke();
  // Iterate over fibres
  for (let f = 0; f < nFib; ++f) {
    const offset = f * (SEG_COUNT + 1) * 2;
    ctx.beginPath();
    // Move to first point
    const x0 = coords[offset + 0] * scale + cx;
    const y0 = coords[offset + 1] * scale + cy;
    ctx.moveTo(x0, y0);
    // Draw segments
    for (let i = 1; i <= SEG_COUNT; ++i) {
      const xi = coords[offset + i * 2 + 0] * scale + cx;
      const yi = coords[offset + i * 2 + 1] * scale + cy;
      ctx.lineTo(xi, yi);
    }
    ctx.strokeStyle = '#007acc';
    ctx.stroke();
  }
}

function updateCrosslinkerChart() {
  const clPtr = mod._get_cl_lengths();
  const clCount = mod._get_num_cl();
  const clArr = new Float32Array(mod.HEAPF32.buffer, clPtr, clCount);
  // Update chart data
  clChart.data.labels = Array.from({ length: clCount }, (_, i) => i);
  clChart.data.datasets[0].data = Array.from(clArr);
  clChart.update();
}

// Hook up UI event
startBtn.addEventListener('click', startSimulation);