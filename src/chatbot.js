import "./chatbot.css";

/* ============================================================
   CONFIGURATION
   ============================================================ */
const CFG = {
  // Netlify Function endpoint (proxied via /api/ redirect in netlify.toml)
  emailEndpoint: "/api/send-lead",
  adminEmail:    "hello@oviatech.com",
  botName:       "Aria",
  autoOpenDelay: 8000,   // ms before unread badge appears — 0 to disable
};

/* ============================================================
   KNOWLEDGE BASE
   ============================================================ */
const KB = [
  {
    keys: ["hello","hi","hey","good morning","good afternoon","good evening","start","help"],
    reply: "Hi there! 👋 I'm Aria, Ovia Tech's virtual assistant. I can answer questions about our services, pricing, or process — or connect you with our team directly. What can I help with?",
    chips: ["Services","Pricing","Our process","Get a quote"],
  },
  {
    keys: ["service","what do you","what you do","offer","build","create","develop"],
    reply: "We offer:\n\n🌐 Website & eCommerce Development\n📱 Mobile Apps (iOS & Android)\n⚙️ SaaS & Custom Software\n🤖 AI Automation Systems\n📈 SEO & Digital Marketing\n\nWhich area interests you most?",
    chips: ["Websites","Mobile Apps","SaaS / Software","AI Automation","SEO"],
  },
  {
    keys: ["website","web design","landing page","ecommerce","shopify","wordpress","online store"],
    reply: "Our websites start from **$1,200** and include:\n\n✅ Premium responsive design\n✅ SEO-optimised structure\n✅ Contact forms & CTA setup\n✅ Google Analytics integration\n✅ Mobile-first build\n\nWe've delivered a 5-page professional site in just 7 days! Want a custom quote?",
    chips: ["Get a quote","See examples","Learn about pricing"],
  },
  {
    keys: ["app","mobile","ios","android","flutter","react native","smartphone"],
    reply: "We build high-performance mobile apps using Flutter — one codebase for both iOS and Android.\n\n📱 Apps from **$8,000**\n⏱️ Typical timeline: 4–12 weeks\n\nWe handle everything: UX design, backend APIs, App Store submission, and post-launch support.",
    chips: ["Get a quote","How long does it take?","Flutter vs React Native"],
  },
  {
    keys: ["saas","software","platform","dashboard","portal","crm","custom system","internal tool"],
    reply: "We design and develop scalable SaaS products, admin dashboards, client portals, CRM systems, and custom business software.\n\n⚙️ Starting from **$15,000**\n🔐 Secure & scalable architecture\n🚀 From discovery to launch\n\nEvery project starts with a free discovery call.",
    chips: ["Get a quote","Tell me about the process"],
  },
  {
    keys: ["ai","automation","chatbot","machine learning","workflow","automate"],
    reply: "We implement practical AI automation that reduces manual work:\n\n🤖 AI chat & assistants\n📊 Data processing & reporting\n🔄 Workflow automation\n📧 Email & CRM automation\n\nReal results — not just buzzwords. Want to explore what's possible for your business?",
    chips: ["Get a quote","What's the cost?"],
  },
  {
    keys: ["seo","search","google","ranking","traffic","marketing","digital marketing","visibility"],
    reply: "Our SEO & digital marketing services help US businesses rank on Google and attract qualified leads:\n\n🔍 Technical SEO setup\n📍 Local SEO for US markets\n✍️ Content strategy\n📊 Analytics & monthly reporting\n\nSEO retainers start from **$500/month**.",
    chips: ["Get a quote","How long to see results?"],
  },
  {
    keys: ["price","pricing","cost","how much","rate","budget","affordable","cheap","expensive"],
    reply: "Our pricing is flexible and tailored to each project based on scope, features, and timelines.\n\n💻 Business Websites: starting from **$250**\n📱 Mobile Apps: starting from **$2,000**\n⚙️ SaaS Platforms & Custom Software: starting from **$3,000**\n📈 SEO & Growth Marketing: starting from **$300/month**\n\nEvery project includes a free consultation and customised proposal.\n\nTell us a little about your project and we'll recommend the best solution for your budget.",
    chips: ["Get a free quote","Tell me more"],
  },
  {
    keys: ["how long","timeline","time","deadline","delivery","fast","quick","rush","days","weeks","months"],
    reply: "Typical delivery timelines:\n\n🌐 Website: 1–4 weeks\n📱 Mobile App: 4–12 weeks\n⚙️ SaaS Product: 2–6 months\n📈 SEO: results in 3–6 months\n\nWe've delivered a full 5-page professional website in **7 days** when needed! Share your deadline and we'll work with it.",
    chips: ["Get a quote","Tell me about your process"],
  },
  {
    keys: ["process","how","steps","work","workflow","discovery","design","develop"],
    reply: "Our 4-step process:\n\n1️⃣ **Discover** — Clarify goals, users & requirements\n2️⃣ **Design** — Premium UI/UX aligned to your brand\n3️⃣ **Develop** — Clean, fast, scalable code\n4️⃣ **Launch & Support** — Deploy + ongoing maintenance\n\nWe keep you informed at every stage. No surprises.",
    chips: ["Sounds good — get started","What's the cost?"],
  },
  {
    keys: ["location","where","based","usa","new york","united states","country","remote"],
    reply: "Ovia Tech is headquartered in **East Meadow, New York, USA** 🇺🇸\n\nWe work with clients across the USA, Canada, UK, Australia, and worldwide via remote delivery — with USA-standard quality guaranteed.",
    chips: ["Get a quote","Learn about us"],
  },
  {
    keys: ["team","who","founder","allen","staff","about","experience","years"],
    reply: "Ovia Tech was founded by **Allen** — a full-stack developer, graphic designer, and digital growth strategist with **10+ years** of experience.\n\nWe've delivered 50+ projects across healthcare, real estate, SaaS, eCommerce, and more.",
    chips: ["About the team","Get a quote"],
  },
  {
    keys: ["contact","email","phone","talk","speak","call","reach","whatsapp","message"],
    reply: "You can reach us at:\n\n📧 hello@oviatech.com\n💬 WhatsApp available\n\nOr let me collect your details and our team will reach out within **24 hours**!",
    chips: ["Collect my details","Send an email"],
  },
  {
    keys: ["quote","get started","start","project","interested","hire","work together","consultation"],
    reply: "Great! Let me connect you with our team. I'll just need a few quick details — it takes less than a minute. 🙌",
    action: "START_LEAD",
  },
];

/* ============================================================
   STATE
   ============================================================ */
const S = {
  CHAT: "chat",
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  PROJECT: "project",
  DONE: "done",
};

let state      = S.CHAT;
let msgCount   = 0;
let lead       = { name: "", email: "", phone: "", project: "" };
let isOpen     = false;
let autoOpened = false;

/* ============================================================
   BUILD HTML
   ============================================================ */
function buildWidget() {
  const html = `
<button class="cb-toggle" id="cb-toggle" aria-label="Chat with Ovia Tech" aria-expanded="false">
  <svg class="cb-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
  <svg class="cb-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
  <span class="cb-badge" id="cb-badge">1</span>
</button>

<div class="cb-window" id="cb-window" role="dialog" aria-label="Chat with Ovia Tech" aria-hidden="true">
  <div class="cb-header">
    <div class="cb-avatar" aria-hidden="true">A</div>
    <div class="cb-header-info">
      <span class="cb-name">${CFG.botName} · Ovia Tech</span>
      <span class="cb-status">
        <span class="cb-status-dot"></span>
        Online — replies instantly
      </span>
    </div>
    <button class="cb-close-btn" id="cb-close" aria-label="Close chat">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>

  <div class="cb-messages" id="cb-messages"></div>
  <div class="cb-quick-replies" id="cb-chips"></div>

  <div class="cb-input-area">
    <input class="cb-input" id="cb-input" type="text" placeholder="Type a message…" autocomplete="off" />
    <button class="cb-send" id="cb-send" aria-label="Send">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    </button>
  </div>
  <p class="cb-footer">Powered by Ovia Tech · hello@oviatech.com</p>
</div>`;

  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
}

/* ============================================================
   CORE FUNCTIONS
   ============================================================ */
function addMessage(text, type, opts = {}) {
  const msgs  = document.getElementById("cb-messages");
  const chips = document.getElementById("cb-chips");
  const row   = document.createElement("div");
  row.className = `cb-msg ${type}`;

  if (type === "bot") {
    row.innerHTML = `<div class="cb-msg-avatar" aria-hidden="true">A</div><div class="cb-bubble">${formatText(text)}</div>`;
  } else {
    row.innerHTML = `<div class="cb-bubble">${escHtml(text)}</div>`;
  }

  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;

  // Clear old chips, set new ones
  chips.innerHTML = "";
  if (opts.chips && opts.chips.length) {
    opts.chips.forEach((label) => {
      const btn = document.createElement("button");
      btn.className  = "cb-chip";
      btn.textContent = label;
      btn.addEventListener("click", () => handleInput(label));
      chips.appendChild(btn);
    });
  }
}

function showTyping() {
  const msgs = document.getElementById("cb-messages");
  const row  = document.createElement("div");
  row.className = "cb-msg bot cb-typing";
  row.id = "cb-typing";
  row.innerHTML = `<div class="cb-msg-avatar" aria-hidden="true">A</div>
    <div class="cb-bubble"><span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span></div>`;
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById("cb-typing");
  if (t) t.remove();
}

function botReply(text, opts = {}, delay = 900) {
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(text, "bot", opts);
  }, delay);
}

function formatText(t) {
  // Bold **text**, newlines → <br>
  return escHtml(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function escHtml(t) {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ============================================================
   CONVERSATION LOGIC
   ============================================================ */
function handleInput(raw) {
  const text = raw.trim();
  if (!text) return;

  const input = document.getElementById("cb-input");
  input.value = "";

  // Don't echo chip labels that are internal actions
  if (text !== "START_LEAD") {
    addMessage(text, "user");
  }

  msgCount++;

  // Lead capture state machine
  if (state === S.NAME) {
    lead.name = text;
    state = S.EMAIL;
    botReply(
      `Nice to meet you, **${lead.name}**! What's your email address so we can send you information?`
    );
    return;
  }

  if (state === S.EMAIL) {
    if (!isValidEmail(text)) {
      botReply("That doesn't look like a valid email. Could you double-check it?");
      return;
    }
    lead.email = text;
    state = S.PHONE;
    botReply(
      "Got it! What's your phone number or WhatsApp? (You can type 'skip' if you prefer not to share.)"
    );
    return;
  }

  if (state === S.PHONE) {
    lead.phone = text.toLowerCase() === "skip" ? "Not provided" : text;
    state = S.PROJECT;
    botReply(
      `Almost done! Briefly — what kind of project are you planning or what problem are you trying to solve?`
    );
    return;
  }

  if (state === S.PROJECT) {
    lead.project = text;
    state = S.DONE;
    submitLead();
    return;
  }

  if (state === S.DONE) {
    botReply(
      "Our team already has your details and will reach out within 24 hours. Is there anything else I can help you with in the meantime?",
      { chips: ["Services", "Pricing", "Our process"] }
    );
    state = S.CHAT;
    return;
  }

  // Normal chat — find best match
  const lower   = text.toLowerCase();
  const matched = matchKB(lower);

  if (matched) {
    if (matched.action === "START_LEAD") {
      triggerLeadCapture();
      return;
    }
    botReply(matched.reply, { chips: matched.chips || [] });
  } else {
    // Soft nudge to lead capture after 3 messages
    if (msgCount >= 3 && state === S.CHAT) {
      botReply(
        `I want to make sure you get the best answer for your situation. Would you like me to connect you with our team directly? They'll respond within 24 hours.`,
        { chips: ["Yes, connect me", "Keep chatting", "Pricing", "Services"] }
      );
    } else {
      botReply(
        `I can help with questions about our services, pricing, timelines, and process. Or type "get a quote" and I'll connect you with the team!`,
        { chips: ["Services", "Pricing", "Get a quote"] }
      );
    }
  }

  // Natural lead prompt after 4 exchanges
  if (msgCount === 4 && state === S.CHAT) {
    setTimeout(() => {
      botReply(
        `By the way — if you'd like a personalised quote or to speak with our team, I can collect your details right now. Takes less than a minute! 🙌`,
        { chips: ["Yes, let's do it", "Not yet"] }
      );
    }, 2000);
  }
}

function matchKB(lower) {
  // "get a quote" / "yes, connect me" / "yes, let's do it" → lead capture
  if (/quote|get started|connect me|let's do it|let me|hire|interested/i.test(lower)) {
    return { action: "START_LEAD" };
  }

  let best = null;
  let bestScore = 0;

  KB.forEach((item) => {
    let score = 0;
    item.keys.forEach((k) => {
      if (lower.includes(k)) score += k.split(" ").length; // longer phrases score higher
    });
    if (score > bestScore) { bestScore = score; best = item; }
  });

  return bestScore > 0 ? best : null;
}

function triggerLeadCapture() {
  state = S.NAME;
  botReply("Sure! To connect you with our team, I just need a couple of quick details. 📋\n\nFirst — what's your name?");
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/* ============================================================
   SUBMIT LEAD — posts to Netlify Function → SMTP2GO → admin email
   ============================================================ */
async function submitLead() {
  const { name, email, phone, project } = lead;

  // Confirm message immediately — don't make user wait for network
  botReply(
    `Thank you, **${name}**! 🎉 Your details are on their way to the Ovia Tech team.\n\nWe'll reach out to **${email}** within 24 hours with a tailored recommendation.\n\nAnything else I can help with?`,
    { chips: ["Services", "Pricing", "Our process"] }
  );

  try {
    const res = await fetch(CFG.emailEndpoint, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, phone, project }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Lead email failed:", err);
      // Silent fallback — user already got confirmation message
      mailtoFallback(name, email, phone, project);
    }
  } catch (err) {
    console.error("Lead send error:", err);
    mailtoFallback(name, email, phone, project);
  }
}

function mailtoFallback(name, email, phone, project) {
  const subject = encodeURIComponent(`New Lead from Ovia Tech Chatbot — ${name}`);
  const body = encodeURIComponent(
    `New Lead from Ovia Tech Chatbot\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject: ${project}`
  );
  const a = document.createElement("a");
  a.href = `mailto:${CFG.adminEmail}?subject=${subject}&body=${body}`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ============================================================
   OPEN / CLOSE
   ============================================================ */
function openChat() {
  isOpen = true;
  const win    = document.getElementById("cb-window");
  const toggle = document.getElementById("cb-toggle");
  const badge  = document.getElementById("cb-badge");

  win.classList.add("is-open");
  win.setAttribute("aria-hidden", "false");
  toggle.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
  badge.classList.remove("show");

  // Greet on first open
  if (msgCount === 0) {
    setTimeout(() => {
      botReply(
        `Hi there! 👋 I'm **${CFG.botName}**, Ovia Tech's virtual assistant.\n\nI can answer questions about our services, pricing, or process — or connect you with our team directly. How can I help?`,
        { chips: ["Services", "Pricing", "Our process", "Get a quote"] },
        600
      );
    }, 200);
  }

  // Focus input
  setTimeout(() => document.getElementById("cb-input").focus(), 300);
}

function closeChat() {
  isOpen = false;
  const win    = document.getElementById("cb-window");
  const toggle = document.getElementById("cb-toggle");
  win.classList.remove("is-open");
  win.setAttribute("aria-hidden", "true");
  toggle.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  buildWidget();

  const toggle = document.getElementById("cb-toggle");
  const close  = document.getElementById("cb-close");
  const send   = document.getElementById("cb-send");
  const input  = document.getElementById("cb-input");

  toggle.addEventListener("click", () => isOpen ? closeChat() : openChat());
  close.addEventListener("click", closeChat);

  send.addEventListener("click", () => handleInput(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleInput(input.value);
  });

  // "Yes, let's do it" / "Not yet" special chips
  document.getElementById("cb-chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".cb-chip");
    if (!chip) return;
    const t = chip.textContent.toLowerCase();
    if (t === "not yet") {
      addMessage("Not yet", "user");
      botReply("No problem at all! Ask me anything — I'm here to help. 😊",
        { chips: ["Services","Pricing","Our process"] });
    }
  });

  // Auto-open with badge after delay (non-intrusive)
  if (CFG.autoOpenDelay > 0) {
    setTimeout(() => {
      if (!isOpen && !autoOpened) {
        autoOpened = true;
        document.getElementById("cb-badge").classList.add("show");
      }
    }, CFG.autoOpenDelay);
  }
}

// Boot
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
