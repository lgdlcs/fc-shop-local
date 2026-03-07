import * as THREE from 'three';

// ─── Scene ───────────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// ─── Particles (floating dots) ──────────────────────
const N = 800;
const positions = new Float32Array(N * 3);
const speeds = new Float32Array(N);
const colors = new Float32Array(N * 3);

for (let i = 0; i < N; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 80;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
  speeds[i] = 0.005 + Math.random() * 0.015;

  // Green-ish tints
  const green = 0.5 + Math.random() * 0.5;
  colors[i * 3] = 0.1 + Math.random() * 0.15;
  colors[i * 3 + 1] = green;
  colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
}

const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMat = new THREE.PointsMaterial({
  size: 0.15,
  vertexColors: true,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ─── Connecting lines (network effect) ─────────────
const lineGeo = new THREE.BufferGeometry();
const maxLines = 300;
const linePositions = new Float32Array(maxLines * 6);
lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
lineGeo.setDrawRange(0, 0);

const lineMat = new THREE.LineBasicMaterial({
  color: 0x22c55e,
  transparent: true,
  opacity: 0.08,
  blending: THREE.AdditiveBlending,
});
const lines = new THREE.LineSegments(lineGeo, lineMat);
scene.add(lines);

// ─── Mouse interaction ──────────────────────────────
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / innerWidth - 0.5) * 2;
  mouseY = (e.clientY / innerHeight - 0.5) * 2;
});

// ─── Scroll-based parallax ──────────────────────────
let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.pageYOffset;
});

// ─── Animate ────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Move particles
  const pa = particles.geometry.attributes.position.array;
  for (let i = 0; i < N; i++) {
    pa[i * 3 + 1] += speeds[i];
    if (pa[i * 3 + 1] > 40) pa[i * 3 + 1] = -40;
    // Gentle sway
    pa[i * 3] += Math.sin(t * 0.3 + i) * 0.002;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // Update connecting lines
  let lineCount = 0;
  const lp = lines.geometry.attributes.position.array;
  const threshold = 8;
  const thresholdSq = threshold * threshold;

  for (let i = 0; i < N && lineCount < maxLines; i++) {
    for (let j = i + 1; j < N && lineCount < maxLines; j++) {
      const dx = pa[i * 3] - pa[j * 3];
      const dy = pa[i * 3 + 1] - pa[j * 3 + 1];
      const dz = pa[i * 3 + 2] - pa[j * 3 + 2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < thresholdSq) {
        const idx = lineCount * 6;
        lp[idx] = pa[i * 3]; lp[idx + 1] = pa[i * 3 + 1]; lp[idx + 2] = pa[i * 3 + 2];
        lp[idx + 3] = pa[j * 3]; lp[idx + 4] = pa[j * 3 + 1]; lp[idx + 5] = pa[j * 3 + 2];
        lineCount++;
      }
    }
  }
  lines.geometry.attributes.position.needsUpdate = true;
  lines.geometry.setDrawRange(0, lineCount * 2);

  // Camera follows mouse + scroll
  camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 3 - scrollY * 0.005 - camera.position.y) * 0.02;
  camera.lookAt(0, -scrollY * 0.005, 0);

  renderer.render(scene, camera);
}

animate();

// ─── Resize ─────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
