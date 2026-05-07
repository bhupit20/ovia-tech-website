/* ============================================================
   HERO SPACESHIP — Three.js scene in .hero-visual
   Scroll down → ship flies upward with forward tilt
   ============================================================ */
import * as THREE from "three";

(() => {

const canvas = document.getElementById("spaceship-canvas");
if (!canvas) return;

// ─ RENDERER ────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
camera.position.set(0, 0.6, 7);
camera.lookAt(0, 0, 0);

// ─ MATERIALS ───────────────────────────────────────────────
const hullMat = new THREE.MeshStandardMaterial({
  color: 0x0a0e18,
  roughness: 0.18,
  metalness: 0.92,
  envMapIntensity: 1,
});

const panelMat = new THREE.MeshStandardMaterial({
  color: 0x141c2e,
  roughness: 0.3,
  metalness: 0.85,
});

const accentMat = new THREE.MeshStandardMaterial({
  color: 0xeb4604,
  roughness: 0.08,
  metalness: 0.7,
  emissive: 0xeb4604,
  emissiveIntensity: 0.9,
});

const glowMat = new THREE.MeshStandardMaterial({
  color: 0xff7733,
  emissive: 0xff5500,
  emissiveIntensity: 2,
  roughness: 0,
  metalness: 0,
});

const glassMat = new THREE.MeshStandardMaterial({
  color: 0x0033aa,
  roughness: 0.02,
  metalness: 0.05,
  transparent: true,
  opacity: 0.72,
  emissive: 0x001166,
  emissiveIntensity: 1.2,
});

const rimMat = new THREE.MeshStandardMaterial({
  color: 0x3366ff,
  roughness: 0.1,
  metalness: 0.8,
  emissive: 0x2255ee,
  emissiveIntensity: 0.5,
});

// ─ SPACESHIP GROUP ─────────────────────────────────────────
const ship = new THREE.Group();
ship.rotation.x = 0.1;    // slight nose-down tilt at rest
scene.add(ship);

// Helper to clone material
const m = (mat) => mat.clone();

/* ── FUSELAGE ── */
const fuselage = new THREE.Mesh(
  new THREE.CylinderGeometry(0.28, 0.46, 2.8, 10, 1),
  hullMat
);
ship.add(fuselage);

/* ── NOSE CONE ── */
const nose = new THREE.Mesh(
  new THREE.ConeGeometry(0.28, 1.2, 10),
  hullMat
);
nose.position.y = 2.0;
ship.add(nose);

/* ── NOSE TIP accent ── */
const noseTip = new THREE.Mesh(
  new THREE.ConeGeometry(0.055, 0.28, 8),
  accentMat
);
noseTip.position.y = 2.73;
ship.add(noseTip);

/* ── COCKPIT DOME ── */
const cockpit = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
  glassMat
);
cockpit.position.y = 1.12;
ship.add(cockpit);

// Cockpit rim ring
const cockpitRim = new THREE.Mesh(
  new THREE.TorusGeometry(0.22, 0.025, 8, 24),
  rimMat
);
cockpitRim.rotation.x = Math.PI / 2;
cockpitRim.position.y = 1.1;
ship.add(cockpitRim);

/* ── WINGS (swept back, left & right) ── */
function makeWing(side) {
  const g = new THREE.Group();

  // Main wing slab
  const wingMain = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.07, 1.15),
    panelMat
  );
  g.add(wingMain);

  // Wing leading edge (thicker front strip)
  const leading = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.14, 0.18),
    hullMat
  );
  leading.position.z = 0.5;
  g.add(leading);

  // Wingtip accent bar
  const tip = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.18, 1.15),
    accentMat
  );
  tip.position.x = side * 1.0;
  g.add(tip);

  // Position & orient the whole wing
  g.position.set(side * 1.18, -0.32, -0.08);
  g.rotation.z = side * -0.08;   // dihedral
  g.rotation.y = side * -0.18;   // swept back

  return g;
}

ship.add(makeWing(-1));
ship.add(makeWing(1));

/* ── TAIL FINS ── */
function makeFin(side) {
  const fin = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.55, 0.72),
    hullMat
  );
  fin.position.set(side * 0.34, -1.1, -0.28);
  fin.rotation.z = side * 0.22;
  return fin;
}
ship.add(makeFin(-1));
ship.add(makeFin(1));

/* ── ENGINE PODS ── */
function makeEngine(side) {
  const pod = new THREE.Group();

  // Pod body
  pod.add(new THREE.Mesh(
    new THREE.CylinderGeometry(0.155, 0.19, 1.3, 10),
    hullMat
  ));

  // Intake ring (front)
  const intake = new THREE.Mesh(
    new THREE.TorusGeometry(0.155, 0.03, 8, 20),
    rimMat
  );
  intake.rotation.x = Math.PI / 2;
  intake.position.y = 0.65;
  pod.add(intake);

  // Nozzle (back)
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.22, 0.18, 10),
    panelMat
  );
  nozzle.position.y = -0.73;
  pod.add(nozzle);

  pod.position.set(side * 0.62, -0.82, 0);
  return pod;
}

const engineL = makeEngine(-1);
const engineR = makeEngine(1);
ship.add(engineL);
ship.add(engineR);

/* ── THRUSTER GLOW DISCS ── */
function makeThruster(side) {
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.16, 24),
    glowMat
  );
  disc.rotation.x = Math.PI / 2;
  disc.position.set(side * 0.62, -1.58, 0);
  return disc;
}

const thrL = makeThruster(-1);
const thrR = makeThruster(1);
scene.add(thrL);
scene.add(thrR);

/* ── THRUSTER EXHAUST CONES ── */
function makeExhaust(side) {
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.55, 16),
    new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff3300,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    })
  );
  cone.rotation.x = Math.PI;   // point downward (backward)
  cone.position.set(side * 0.62, -1.9, 0);
  return cone;
}

const exhaustL = makeExhaust(-1);
const exhaustR = makeExhaust(1);
scene.add(exhaustL);
scene.add(exhaustR);

/* ── HULL STRIPE ACCENTS ── */
[-0.28, 0.28].forEach((x) => {
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.8, 0.52),
    rimMat
  );
  stripe.position.set(x, 0.4, 0.22);
  ship.add(stripe);
});

// ─ POINT LIGHTS ────────────────────────────────────────────
// Engine glow (orange)
const engLightL = new THREE.PointLight(0xff5500, 6, 3.5);
engLightL.position.set(-0.62, -1.7, 0.4);
scene.add(engLightL);

const engLightR = new THREE.PointLight(0xff5500, 6, 3.5);
engLightR.position.set(0.62, -1.7, 0.4);
scene.add(engLightR);

// Key light (blue-white, front)
const keyLight = new THREE.DirectionalLight(0x99bbff, 3.5);
keyLight.position.set(-2, 4, 6);
scene.add(keyLight);

// Fill light (warm, side)
const fillLight = new THREE.DirectionalLight(0xffaa66, 1.2);
fillLight.position.set(5, 0, 2);
scene.add(fillLight);

// Rim / back light (blue)
const rimLight = new THREE.DirectionalLight(0x2244cc, 1.8);
rimLight.position.set(0, -3, -6);
scene.add(rimLight);

// Ambient
scene.add(new THREE.AmbientLight(0x112233, 0.8));

// ─ STARS ───────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(600);
for (let i = 0; i < 600; i++) {
  starPos[i] = (Math.random() - 0.5) * 24;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xaabbdd, size: 0.045, transparent: true, opacity: 0.7 })
);
scene.add(stars);

// ─ RESIZE ──────────────────────────────────────────────────
function resize() {
  const w = canvas.clientWidth  || canvas.offsetWidth  || 600;
  const h = canvas.clientHeight || canvas.offsetHeight || 560;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);

// Defer first resize — DOM must finish layout before clientWidth is valid
requestAnimationFrame(() => requestAnimationFrame(resize));

// ─ SCROLL TRACKING ─────────────────────────────────────────
let targetScroll = 0;
let smoothScroll = 0;

window.addEventListener("scroll", () => {
  targetScroll = window.scrollY;
}, { passive: true });

// ─ MOUSE PARALLAX ──────────────────────────────────────────
let mx = 0, my = 0;
window.addEventListener("mousemove", (e) => {
  mx = (e.clientX / window.innerWidth  - 0.5) * 2;
  my = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

// ─ ANIMATION LOOP ──────────────────────────────────────────
const clock = new THREE.Clock();

(function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // Smooth scroll lerp
  smoothScroll += (targetScroll - smoothScroll) * 0.055;
  const sf = smoothScroll * 0.0025;   // scroll factor (gentle)

  // ── Ship base animation (idle bob + slow yaw)
  ship.rotation.y = Math.sin(t * 0.35) * 0.15 + mx * 0.12;
  ship.position.x = Math.sin(t * 0.22) * 0.08;

  // ── Scroll: fly upward + pitch nose forward
  ship.position.y = sf * 5.5 + Math.sin(t * 0.55) * 0.07;
  ship.rotation.x = 0.1 - sf * 0.55 - my * 0.06;

  // Sync thruster/exhaust to ship world position
  const worldPos = new THREE.Vector3();
  ship.getWorldPosition(worldPos);
  thrL.position.y  = worldPos.y - 1.58 + sf * 5.5;
  thrR.position.y  = thrL.position.y;
  exhaustL.position.y = thrL.position.y - 0.32;
  exhaustR.position.y = thrL.position.y - 0.32;

  // ── Engine glow pulse (fast throb)
  const pulse = (Math.sin(t * 9) * 0.25 + 0.75);
  const boostPulse = pulse + sf * 1.5;   // brighter on scroll
  engLightL.intensity = 5 * boostPulse;
  engLightR.intensity = 5 * boostPulse;
  thrL.material.emissiveIntensity = 1.8 * boostPulse;
  thrR.material.emissiveIntensity = 1.8 * boostPulse;
  exhaustL.material.opacity = 0.45 + sf * 0.35 + Math.sin(t * 7) * 0.12;
  exhaustR.material.opacity = exhaustL.material.opacity;
  exhaustL.scale.y = 1 + sf * 1.8;
  exhaustR.scale.y = exhaustL.scale.y;

  // ── Stars slow drift
  stars.rotation.y = t * 0.018;

  renderer.render(scene, camera);
}());

})();
