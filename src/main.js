/* ============================================================
   CHATBOT
   ============================================================ */
import "./chatbot.js";
import { saveLeadToSupabase } from "./supabase-leads.js";

/* ============================================================
   CURSOR FOLLOWING DOT
   ============================================================ */
const supportsCursorFollower = window.matchMedia("(min-width: 993px) and (pointer: fine)").matches;

if (supportsCursorFollower) {
  const cursorFollowerDot = document.createElement("span");

  cursorFollowerDot.id = "cursorFollowerDot";
  cursorFollowerDot.className = "cursorFollowerDot is-hidden";
  document.body.append(cursorFollowerDot);
  document.body.classList.add("has-cursor-follower");

  let mouseX = -100;
  let mouseY = -100;
  let xpDot = -100;
  let ypDot = -100;
  let hasMoved = false;

  const interactiveSelector = "a, button, [role='button'], input[type='submit'], .button, .nav-toggle, .cb-toggle, .cb-send, .cb-chip, .cb-close";

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!hasMoved) {
      hasMoved = true;
      cursorFollowerDot.classList.remove("is-hidden");
    }

    const isHovering = Boolean(event.target.closest(interactiveSelector));
    cursorFollowerDot.classList.toggle("is-hovering", isHovering);
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    cursorFollowerDot.classList.add("is-hidden");
  });

  document.addEventListener("mouseenter", () => {
    if (!hasMoved) return;
    cursorFollowerDot.classList.remove("is-hidden");
  });

  const animateCursorFollower = () => {
    xpDot += (mouseX - xpDot) / 12;
    ypDot += (mouseY - ypDot) / 12;

    cursorFollowerDot.style.left = `${xpDot}px`;
    cursorFollowerDot.style.top = `${ypDot}px`;

    requestAnimationFrame(animateCursorFollower);
  };

  animateCursorFollower();
}

/* ============================================================
   HERO DASHBOARD — gentle float
   ============================================================ */
const heroShip = document.getElementById("hero-ship");

if (heroShip) {
  const shipLoop = () => {
    const t = Date.now() / 1000;
    const floatY = Math.sin(t * 1.5) * 18;
    const floatR = Math.sin(t * 1.5) * 1.2;
    heroShip.style.transform =
      `translateY(${floatY}px) rotate(${floatR}deg)`;
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
   BLOG HUB FILTERS
   ============================================================ */
document.querySelectorAll("[data-blog-hub]").forEach((blogHub) => {
  const searchInput = blogHub.querySelector("[data-blog-search]");
  const resultsGrid = blogHub.querySelector("[data-blog-results]");
  const emptyState = blogHub.querySelector("[data-blog-empty]");
  const cards = [...blogHub.querySelectorAll(".blog-card")];
  const filterGroups = [...blogHub.querySelectorAll("[data-blog-filter-group]")];
  const viewButtons = [...blogHub.querySelectorAll("[data-blog-view]")];
  const filters = { topic: "all", tag: "" };

  const getCardDate = (card) => {
    const meta = card.querySelector(".blog-card-meta")?.textContent || "";
    const dateText = meta.split("·")[0]?.trim();
    const timestamp = Date.parse(dateText);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  cards
    .map((card, index) => ({ card, index, date: getCardDate(card) }))
    .sort((a, b) => (b.date - a.date) || (a.index - b.index))
    .forEach(({ card }) => resultsGrid?.append(card));

  const getCardText = (card) => {
    if (!card.dataset.searchText) {
      card.dataset.searchText = card.textContent.toLowerCase().replace(/\s+/g, " ");
    }
    return card.dataset.searchText;
  };

  const cardMatchesFilter = (card, filterValue) => {
    if (!filterValue || filterValue === "all") return true;
    const text = getCardText(card);

    if (filterValue === "ai") {
      return text.includes(" ai ") || text.includes("automation") || text.includes("chatgpt") || text.includes("claude") || text.includes("gemini");
    }

    if (filterValue === "development") {
      return text.includes("development") || text.includes("software") || text.includes("website") || text.includes("mobile") || text.includes("flutter") || text.includes("react native");
    }

    if (filterValue === "web design") {
      return text.includes("web design") || text.includes("website design") || text.includes("redesign") || text.includes("agency");
    }

    if (filterValue === "buyer") {
      return text.includes("buyer") || text.includes("choose") || text.includes("guide") || text.includes("questions");
    }

    return text.includes(filterValue);
  };

  const updateBlogResults = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = getCardText(card);
      const matchesSearch = !query || text.includes(query);
      const matchesTopic = cardMatchesFilter(card, filters.topic);
      const matchesTag = cardMatchesFilter(card, filters.tag);
      const isVisible = matchesSearch && matchesTopic && matchesTag;

      card.classList.toggle("is-hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount > 0;
  };

  filterGroups.forEach((group) => {
    const groupName = group.dataset.blogFilterGroup;

    group.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;

      const isActive = button.classList.contains("active");
      group.querySelectorAll("[data-filter]").forEach((filterButton) => filterButton.classList.remove("active"));

      if (groupName === "tag" && isActive) {
        filters.tag = "";
      } else {
        button.classList.add("active");
        filters[groupName] = button.dataset.filter || "";
      }

      if (groupName === "topic" && !filters.topic) {
        filters.topic = "all";
      }

      updateBlogResults();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", updateBlogResults);
  }

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      viewButtons.forEach((viewButton) => viewButton.classList.remove("active"));
      button.classList.add("active");
      resultsGrid?.classList.toggle("is-list-view", button.dataset.blogView === "list");
    });
  });

  updateBlogResults();
});

/* ============================================================
   NAVIGATION
   ============================================================ */
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNavQuery = window.matchMedia("(max-width: 980px)");

if (navToggle && nav) {
  const currentPath = window.location.pathname.replace(/\/$/, "");
  nav.querySelectorAll(".nav-submenu a[href]").forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });

  nav.querySelectorAll(".nav-drop-trigger").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", (event) => {
      if (!mobileNavQuery.matches) return;

      event.preventDefault();
      const dropdown = trigger.closest(".nav-dropdown");
      if (!dropdown) return;

      const isOpen = dropdown.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));

      nav.querySelectorAll(".nav-dropdown.is-open").forEach((otherDropdown) => {
        if (otherDropdown === dropdown) return;
        otherDropdown.classList.remove("is-open");
        otherDropdown.querySelector(".nav-drop-trigger")?.setAttribute("aria-expanded", "false");
      });
    });
  });

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open");
  });

  // Close nav when clicking a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNavQuery.matches && link.classList.contains("nav-drop-trigger")) return;

      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      nav.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-drop-trigger")?.setAttribute("aria-expanded", "false");
      });
    });
  });

  mobileNavQuery.addEventListener("change", () => {
    nav.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown.querySelector(".nav-drop-trigger")?.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============================================================
   FAQ LAYOUT ENHANCEMENT
   ============================================================ */
document.querySelectorAll(".faq-grid").forEach((grid) => {
  const section = grid.closest(".section");
  if (!section || grid.closest(".faq-layout")) return;

  section.classList.add("faq-section");

  const layout = document.createElement("div");
  layout.className = "container faq-layout reveal";

  const supportCard = document.createElement("aside");
  supportCard.className = "faq-support-card";
  supportCard.innerHTML = `
    <span class="faq-support-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2h9A3.5 3.5 0 0 1 20 5.5v6A3.5 3.5 0 0 1 16.5 15H12l-5 4v-4A3.5 3.5 0 0 1 4 11.5v-6Z"/></svg>
    </span>
    <h3>Do you have more questions?</h3>
    <p>Tell us what you are planning. We will help you understand the right service, scope, timeline, and next step.</p>
    <a class="button primary" href="/pages/contact.html">Ask Ovia Tech</a>
  `;

  grid.classList.remove("container");
  grid.before(layout);
  layout.append(grid, supportCard);

  const items = [...grid.querySelectorAll(".faq-item")];
  if (items.length && !items.some((item) => item.open)) {
    items[0].open = true;
  }

  const getClosedFaqHeight = (item) => {
    const summary = item.querySelector("summary");
    const styles = window.getComputedStyle(item);
    return summary.offsetHeight + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  };

  const clearFaqAnimationStyles = (item) => {
    item.style.height = "";
    item.style.overflow = "";
    item.dataset.animating = "";
  };

  const closeFaqItem = (item) => {
    if (!item.open || item.dataset.animating === "true") return;

    item.dataset.animating = "true";
    item.style.overflow = "hidden";

    const startHeight = item.offsetHeight;
    const endHeight = getClosedFaqHeight(item);
    const animation = item.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );

    item.style.height = `${startHeight}px`;

    animation.onfinish = () => {
      item.open = false;
      clearFaqAnimationStyles(item);
    };

    animation.oncancel = () => clearFaqAnimationStyles(item);
  };

  const openFaqItem = (item) => {
    if (item.open || item.dataset.animating === "true") return;

    item.dataset.animating = "true";
    item.style.overflow = "hidden";

    const startHeight = getClosedFaqHeight(item);
    item.open = true;
    const endHeight = item.offsetHeight;
    item.style.height = `${startHeight}px`;

    const animation = item.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );

    animation.onfinish = () => clearFaqAnimationStyles(item);
    animation.oncancel = () => clearFaqAnimationStyles(item);
  };

  items.forEach((item) => {
    const summary = item.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (item.open) {
        closeFaqItem(item);
        return;
      }

      items.forEach((otherItem) => {
        if (otherItem !== item) closeFaqItem(otherItem);
      });
      openFaqItem(item);
    });
  });
});

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
   CONTACT FORM — saves to Supabase first, then falls back to hosting endpoint
   ============================================================ */
document.querySelectorAll("[data-contact-form]").forEach((contactForm) => {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form    = new FormData(contactForm);
    const btn     = contactForm.querySelector("button[type=submit]");
    const origTxt = btn ? btn.textContent : "";

    // Loading state
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

    // Remove any existing status message
    const old = contactForm.querySelector(".form-status");
    if (old) old.remove();

    const payload = {
      name:     form.get("name")     || "",
      email:    form.get("email")    || "",
      phone:    form.get("phone")    || "",
      company:  form.get("company")  || "",
      budget:   form.get("budget")   || "",
      timeline: form.get("timeline") || "",
      message:  form.get("message")  || "",
    };

    let ok = false;

    try {
      await saveLeadToSupabase({
        ...payload,
        source: "contact_form",
      });
      notifyContactByEmail(payload);
      ok = true;
    } catch (err) {
      console.error("Supabase contact save failed:", err);

      try {
        const res = await fetch("/api/send-contact", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
    }

    // Status message
    const status = document.createElement("p");
    status.className = "form-status";
    status.style.cssText = `
      margin: 16px 0 0;
      padding: 14px 18px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      font-family: "Plus Jakarta Sans", sans-serif;
      ${ok
        ? "background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;"
        : "background:#fef2f2;color:#991b1b;border:1px solid #fecaca;"}
    `;
    status.textContent = ok
      ? "✓ Message sent! We'll get back to you within 24 hours."
      : "✗ Something went wrong. Please email us directly at allen@oviatech.com";

    btn.insertAdjacentElement("afterend", status);

    // Reset button
    if (btn) { btn.disabled = false; btn.textContent = origTxt; }

    // Reset form on success
    if (ok) contactForm.reset();
  });
});

function notifyContactByEmail(payload) {
  fetch("/api/send-contact", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  }).catch((err) => {
    console.error("Contact email notification failed:", err);
  });
}

/* ============================================================
   CONSULTATION MODAL
   ============================================================ */
const consultationModal = document.querySelector("[data-consultation-modal]");

if (consultationModal) {
  const consultationPanel = consultationModal.querySelector(".consultation-modal-panel");
  const consultationForm = consultationModal.querySelector("[data-consultation-form]");
  const consultationStatus = consultationModal.querySelector("[data-consultation-status]");
  const consultationOpeners = document.querySelectorAll("[data-consultation-open]");
  const consultationClosers = consultationModal.querySelectorAll("[data-consultation-close]");
  let lastConsultationTrigger = null;

  const setConsultationStatus = (message, type = "") => {
    if (!consultationStatus) return;
    consultationStatus.textContent = message;
    consultationStatus.dataset.state = type;
  };

  const openConsultationModal = (trigger) => {
    lastConsultationTrigger = trigger || document.activeElement;
    consultationModal.classList.add("is-open");
    consultationModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("consultation-modal-open");
    setConsultationStatus("");

    window.setTimeout(() => {
      consultationForm?.querySelector("input, textarea, select")?.focus();
    }, 80);
  };

  const closeConsultationModal = () => {
    consultationModal.classList.remove("is-open");
    consultationModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("consultation-modal-open");
    setConsultationStatus("");
    lastConsultationTrigger?.focus?.();
  };

  consultationOpeners.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault();
      openConsultationModal(opener);
    });
  });

  consultationClosers.forEach((closer) => {
    closer.addEventListener("click", closeConsultationModal);
  });

  consultationModal.addEventListener("click", (event) => {
    if (!consultationPanel || consultationPanel.contains(event.target)) return;
    closeConsultationModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && consultationModal.classList.contains("is-open")) {
      closeConsultationModal();
    }
  });

  consultationForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = new FormData(consultationForm);
    const btn = consultationForm.querySelector("button[type=submit]");
    const originalText = btn ? btn.textContent : "";

    const email = String(form.get("email") || "").trim();
    const project = String(form.get("project") || "").trim();
    const budget = String(form.get("budget") || "").trim();
    const referral = String(form.get("referral") || "").trim();

    const payload = {
      name: "Consultation Lead",
      email,
      company: referral ? `Heard about us: ${referral}` : "",
      budget,
      timeline: "",
      message: [
        project,
        budget ? `Estimated budget: ${budget}` : "",
        referral ? `How they heard about us: ${referral}` : "",
      ].filter(Boolean).join("\n\n"),
      project,
    };

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending...";
    }

    setConsultationStatus("Sending your request...", "loading");

    let ok = false;

    try {
      await saveLeadToSupabase({
        ...payload,
        source: "consultation_modal",
      });
      notifyContactByEmail(payload);
      ok = true;
    } catch (err) {
      console.error("Consultation save failed:", err);

      try {
        const res = await fetch("/api/send-contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }

    if (ok) {
      consultationForm.reset();
      setConsultationStatus("Thank you. We received your request and will reply within 24 hours.", "success");
      window.setTimeout(closeConsultationModal, 1800);
      return;
    }

    setConsultationStatus("Something went wrong. Please email us directly at oviatech.ca@gmail.com", "error");
  });
}
