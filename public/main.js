// public/main.js  –  Mini-Cytosim 2D frontend
const cvs = document.getElementById('c');
const ctx = cvs.getContext('2d');
cvs.width = cvs.height = 500;

// Simple UI elements (optional)
const nFibInp = document.getElementById('nFib') || { value: 20 };
const dtInp   = document.getElementById('dt')   || { value: 0.02 };

function start() {
  if (typeof Module !== 'function') {
    console.error('WASM glue not loaded');
    return;
  }

  Module().then(mod => {
    const segs = 20;
    let nFib = +nFibInp.value;
    let dt   = +dtInp.value;

    function init() {
      mod._init_sim(nFib, segs, dt);
    }
    init();

    nFibInp.oninput = () => { nFib = +nFibInp.value; init(); };
    dtInp.oninput   = () => { dt   = +dtInp.value; };

    function draw() {
      mod._step_sim(dt);
      const ptr = mod._get_coords();
      const len = mod._get_coords_len();
      const a   = new Float32Array(mod.HEAPF32.buffer, ptr, len);

      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.save();
      ctx.translate(cvs.width / 2, cvs.height / 2);
      ctx.scale(25, -25);

      let i = 0;
      for (let f = 0; f < nFib; ++f) {
        ctx.beginPath();
        ctx.moveTo(a[i], a[i + 1]);
        for (let s = 0; s < segs; ++s) {
          i += 2;
          ctx.lineTo(a[i], a[i + 1]);
        }
        i += 2;   // advance to first point of next fibre
        ctx.strokeStyle = '#0084ff';
        ctx.lineWidth = 0.07;
        ctx.stroke();
      }
      ctx.restore();
      requestAnimationFrame(draw);
    }
    draw();
  });
}

window.addEventListener('DOMContentLoaded', start);
