/* ============================================================
   CHATBOT
   ============================================================ */
import "./chatbot.js";

/* ============================================================
   HERO SPACESHIP — float bob + scroll fly-up (single RAF loop)
   CSS animation removed — JS owns all transforms to prevent conflict
   ============================================================ */
const heroShip = document.getElementById("hero-ship");
const heroGlow = document.querySelector(".hero-ship-glow");

if (heroShip) {
  let scrollTgt = 0, scrollCur = 0;

  window.addEventListener("scroll", () => {
    scrollTgt = window.scrollY;
  }, { passive: true });

  const shipLoop = () => {
    // Lerp scroll position
    scrollCur += (scrollTgt - scrollCur) * 0.07;

    const t = Date.now() / 1000;

    // ── Float bob (runs always, sine wave)
    const floatY = Math.sin(t * 1.5) * 22;       // ±22px vertical bob
    const floatR = Math.sin(t * 1.5) * 1.5;      // ±1.5° rock

    // ── Scroll: fly upward, tilt nose forward
    const scrollY   = scrollCur * 0.75;           // strong upward movement
    const scrollRot = scrollCur * 0.022;          // nose forward tilt
    const scale     = 1 + scrollCur * 0.0005;     // subtle grow

    // Combine: float + scroll (scroll progressively overrides float)
    heroShip.style.transform =
      `translateY(${floatY - scrollY}px) rotate(${floatR - scrollRot}deg) scale(${scale})`;

    // ── Glow reacts to scroll
    if (heroGlow) {
      const glowOp = Math.max(0, 1 - scrollCur * 0.006);
      const glowSc = 1 + scrollCur * 0.005;
      heroGlow.style.opacity   = glowOp.toFixed(3);
      heroGlow.style.transform = `translateX(-50%) scaleX(${glowSc})`;
    }

    requestAnimationFrame(shipLoop);
  };

  shipLoop();
}

/* ============================================================
   READING PROGRESS BAR
   ============================================================ */
const progressBar = document.querySelector(".reading-progress");
const articleMain = document.querySelector(".article-main");

if (progressBar && articleMain) {
  const updateProgress = () => {
    const rect  = articleMain.getBoundingClientRect();
    const total = articleMain.offsetHeight - window.innerHeight;
    const pct   = Math.max(0, Math.min(100, (-rect.top / total) * 100));
    progressBar.style.width = pct + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

/* ============================================================
   TABLE OF CONTENTS (auto-generated from H2s)
   ============================================================ */
const tocNav = document.querySelector("[data-toc]");

if (tocNav && articleMain) {
  const headings = articleMain.querySelectorAll("h2");

  headings.forEach((h, i) => {
    if (!h.id) h.id = "s" + i;
    const a = document.createElement("a");
    a.href      = "#" + h.id;
    a.className = "toc-link";
    a.textContent = h.textContent;
    tocNav.appendChild(a);
  });

  // Highlight active section while scrolling
  const tocLinks = tocNav.querySelectorAll(".toc-link");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocLinks.forEach((l) => l.classList.remove("toc-active"));
          const active = tocNav.querySelector(`[href="#${entry.target.id}"]`);
          if (active) active.classList.add("toc-active");
        }
      });
    },
    { rootMargin: "-15% 0% -70% 0%" }
  );

  headings.forEach((h) => sectionObserver.observe(h));

  // Hide TOC widget if no headings found
  const tocWidget = document.getElementById("toc-widget");
  if (tocWidget && headings.length === 0) tocWidget.style.display = "none";
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open");
  });

  // Close nav when clicking a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

/* Header scroll — transparent on hero, white pill on scroll */
const setHeaderState = () => {
  if (!header) return;
  const scrolled = window.scrollY > 40;
  header.classList.toggle("is-scrolled", scrolled);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ============================================================
   COUNTER ANIMATION (metrics bar)
   ============================================================ */
const animateCounter = (el, target, suffix) => {
  const duration = 1800;
  const start = performance.now();
  const isDecimal = String(target).includes(".");

  const tick = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const value = Math.round(eased * target);
    el.textContent = isDecimal ? value.toFixed(1) + suffix : value + suffix;
    if (elapsed < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.count;
      if (!raw) return;

      const target = parseFloat(raw);
      const original = el.textContent;
      const suffix = original.replace(/[\d.]+/, "");

      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

/* ============================================================
   THREE.JS HERO SCENE
   ============================================================ */
const sceneCanvas = document.querySelector("[data-ovia-scene]");

if (sceneCanvas) {
  const THREE = await import("three");
  const renderer = new THREE.WebGLRenderer({
    canvas: sceneCanvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  const group = new THREE.Group();
  scene.add(group);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xeb4604,
    roughness: 0.2,
    metalness: 0.3,
    transmission: 0.38,
    thickness: 1.3,
    transparent: true,
    opacity: 0.84
  });

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xeb4604,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.52, 2), coreMaterial);
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.82, 2), wireMaterial);
  group.add(core, wire);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x8c6dff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });

  [0, 1, 2].forEach((i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.4 + i * 0.44, 0.007, 12, 180),
      ringMaterial
    );
    ring.rotation.x = Math.PI / 2.8 + i * 0.48;
    ring.rotation.y = i * 0.76;
    group.add(ring);
  });

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 160;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 2.8 + Math.random() * 2.4;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 4.6;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.03,
      transparent: true,
      opacity: 0.58
    })
  );
  group.add(particles);

  scene.add(new THREE.PointLight(0xeb4604, 38, 14)).position.set(3.5, 2.4, 4.2);
  scene.add(new THREE.PointLight(0x8c6dff, 26, 12)).position.set(-4, -1.8, 3.6);
  scene.add(new THREE.AmbientLight(0xffffff, 0.78));

  const pointer = { x: 0, y: 0 };

  const resizeScene = () => {
    const rect = sceneCanvas.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
    group.position.x = rect.width < 900 ? 0.8 : 2.2;
    group.position.y = rect.width < 900 ? -0.2 : 0.1;
    group.scale.setScalar(rect.width < 700 ? 0.66 : 1);
  };

  window.addEventListener("resize", resizeScene);
  resizeScene();

  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();
    core.rotation.x = t * 0.17;
    core.rotation.y = t * 0.31;
    wire.rotation.x = t * -0.13;
    wire.rotation.y = t * 0.21;
    particles.rotation.y = t * 0.034;
    group.rotation.y += (pointer.x * 0.17 - group.rotation.y) * 0.034;
    group.rotation.x += (-pointer.y * 0.1 - group.rotation.x) * 0.034;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}

/* ============================================================
   TILT EFFECT
   ============================================================ */
document.querySelectorAll(".tilt-card, .service-card, .work-card, .industry-card, .price-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* ============================================================
   PRICING TOGGLE
   ============================================================ */
const pricingToggle = document.querySelector("[data-pricing-toggle]");
const prices = document.querySelectorAll("[data-monthly][data-project]");

if (pricingToggle) {
  pricingToggle.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    pricingToggle.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const mode = button.dataset.mode;
    prices.forEach((price) => {
      price.textContent = mode === "monthly" ? price.dataset.monthly : price.dataset.project;
    });
  });
}

/* ============================================================
   PROJECT ESTIMATOR
   ============================================================ */
const estimator = document.querySelector("[data-estimator]");
if (estimator) {
  const output = estimator.querySelector("[data-estimate-output]");
  const inputs = estimator.querySelectorAll("input, select");
  const calculate = () => {
    const project = Number(estimator.project.value);
    const speed = Number(estimator.speed.value);
    const growth = estimator.growth.checked ? 1750 : 0;
    const low = project + speed + growth;
    const high = Math.round((low * 1.45) / 100) * 100;
    output.textContent = `$${low.toLocaleString()} – $${high.toLocaleString()}`;
  };
  inputs.forEach((input) => input.addEventListener("input", calculate));
  calculate();
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData(contactForm);
    const name = form.get("name") || "New lead";
    const email = form.get("email") || "Email not provided";
    const company = form.get("company") || "Company not provided";
    const budget = form.get("budget") || "Project type / budget not selected";
    const timeline = form.get("timeline") || "Timeline not provided";
    const message = form.get("message") || "No details provided";
    const subject = encodeURIComponent(`Ovia Tech project inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nBudget: ${budget}\nTimeline: ${timeline}\n\nProject details:\n${message}`
    );
    window.location.href = `mailto:hello@oviatech.com?subject=${subject}&body=${body}`;
  });
}

