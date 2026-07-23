const features = {
  frames: {
    label: "LIVE CONTEXT",
    title: "Frames, where you need them.",
    description:
      "Activate and group Frames without leaving the conversation. See exactly what shaped every answer.",
    items: [
      "Dynamic context injection",
      "Groups, permissions & ACLs",
      "Complete change history",
    ],
    aside: ["New chat", "Product launch", "Research notes", "A3 planning"],
    chatTitle: "Launch strategy",
    prompt: "Build a launch brief from our latest context.",
    responseTitle: "Working from 2 active Frames",
    response: "I’ll shape the launch around private, connected intelligence…",
    panelTitle: "Frames",
    panelMeta: "2 active",
    panelItems: ["A3 release", "Brand voice", "Research"],
  },
  connectors: {
    label: "CONNECTED CONTEXT",
    title: "Your tools, in the conversation.",
    description:
      "Search and read the work that matters across Drive, Slack, Gmail, and Calendar—with built-in voice input.",
    items: [
      "Per-user, read-only Google auth",
      "Slack, Gmail & Calendar",
      "Built-in voice to text",
    ],
    aside: ["New chat", "Daily digest", "Team updates", "Weekly planning"],
    chatTitle: "Daily digest",
    prompt: "What changed across my projects since yesterday?",
    responseTitle: "Searching 4 connected sources",
    response: "I found 7 updates, 3 decisions, and 2 items that need your attention…",
    panelTitle: "Connections",
    panelMeta: "4 connected",
    panelItems: ["Google Drive", "Slack", "Gmail"],
  },
  agents: {
    label: "PURPOSE-BUILT AI",
    title: "A team, built around your work.",
    description:
      "Configure Agents with the Frames, tools, skills, and model they need. Run work in parallel or hand off a longer task.",
    items: [
      "Parallel agent execution",
      "Per-agent skills & models",
      "CoWork-style Tasks",
    ],
    aside: ["New task", "Launch team", "Research agent", "Content agent"],
    chatTitle: "Launch team",
    prompt: "Create a launch plan and assign the supporting work.",
    responseTitle: "3 Agents working in parallel",
    response: "Research, messaging, and performance briefs are now underway…",
    panelTitle: "Agents",
    panelMeta: "3 working",
    panelItems: ["Research Agent", "Writing Agent", "Data Agent"],
  },
};

const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const brandReveal = document.querySelector("[data-brand-reveal]");
const revealSkip = document.querySelector("[data-reveal-skip]");
const logoTriggers = document.querySelectorAll("[data-logo-replay]");
const brandRevealKey = "openteams:a3:intro-seen:v1";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealTimer;
let revealTrigger;

function updateScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percentage}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.transform = `translate(${event.clientX - 180}px, ${event.clientY - 180}px)`;
  });
}

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  mobileMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

function rememberBrandReveal() {
  try {
    localStorage.setItem(brandRevealKey, "seen");
  } catch (_) {
    // Storage can be unavailable in privacy modes; the reveal still works.
  }
}

function finishBrandReveal() {
  window.clearTimeout(revealTimer);
  brandReveal.classList.remove("is-playing");
  brandReveal.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("brand-first-visit");
  document.body.classList.remove("brand-reveal-active");

  if (revealTrigger) {
    revealTrigger.focus({ preventScroll: true });
    revealTrigger = null;
  }
}

function playBrandReveal(trigger = null) {
  window.clearTimeout(revealTimer);
  setMenu(false);
  revealTrigger = trigger;
  rememberBrandReveal();
  document.documentElement.classList.remove("brand-first-visit");
  document.body.classList.add("brand-reveal-active");
  brandReveal.setAttribute("aria-hidden", "false");
  brandReveal.classList.remove("is-playing");
  void brandReveal.offsetWidth;
  brandReveal.classList.add("is-playing");

  revealTimer = window.setTimeout(
    finishBrandReveal,
    reducedMotion.matches ? 250 : 4550,
  );
}

logoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => playBrandReveal(trigger));
});

revealSkip.addEventListener("click", finishBrandReveal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && brandReveal.classList.contains("is-playing")) {
    finishBrandReveal();
  }
});

if (document.documentElement.classList.contains("brand-first-visit")) {
  window.requestAnimationFrame(() => playBrandReveal());
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (element.closest(".hero")) {
    element.style.transitionDelay = `${Math.min(index * 75, 380)}ms`;
  }
  observer.observe(element);
});

const tabs = document.querySelectorAll(".feature-tab");
const canvas = document.querySelector("[data-feature-canvas]");
const mock = document.querySelector(".product-mock");

function updateFeature(key) {
  const feature = features[key];
  if (!feature) return;

  tabs.forEach((tab) => {
    const active = tab.dataset.feature === key;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  mock.classList.add("is-swapping");

  window.setTimeout(() => {
    canvas.querySelector("[data-feature-label]").textContent = feature.label;
    canvas.querySelector("[data-feature-title]").textContent = feature.title;
    canvas.querySelector("[data-feature-description]").textContent = feature.description;
    canvas.querySelector("[data-feature-list]").innerHTML = feature.items
      .map((item) => `<li>${item}</li>`)
      .join("");

    const aside = mock.querySelector("aside");
    aside.innerHTML = feature.aside
      .map((item, index) => (index === 0 ? `<b>${item}</b>` : `<span>${item}</span>`))
      .join("");

    mock.querySelector(".chat-title b").textContent = feature.chatTitle;
    mock.querySelector(".chat-bubble.user").textContent = feature.prompt;
    mock.querySelector(".chat-bubble.ai b").textContent = feature.responseTitle;
    mock.querySelector(".chat-bubble.ai span").lastChild.textContent = feature.response;
    mock.querySelector(".panel-head b").textContent = feature.panelTitle;
    mock.querySelector(".panel-head span").textContent = feature.panelMeta;

    const panel = mock.querySelector(".frames-panel");
    panel.querySelectorAll("label").forEach((label, index) => {
      label.querySelector("span").lastChild.textContent = feature.panelItems[index];
      label.querySelector("input").checked = index < 2;
    });

    mock.dataset.mock = key;
    mock.classList.remove("is-swapping");
  }, 260);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => updateFeature(tab.dataset.feature));
});

const platformData = {
  mac: {
    label: "Download for macOS",
    href: "https://openteams-collab.s3.us-west-2.amazonaws.com/collab-desktop-macos.dmg",
  },
  windows: {
    label: "Download for Windows",
    href: "https://openteams-collab.s3.us-west-2.amazonaws.com/collab-desktop-windows-amd64-installer.exe",
  },
  linux: {
    label: "Download for Linux",
    href: "https://openteams-collab.s3.us-west-2.amazonaws.com/collab-desktop-linux-amd64.tar.gz",
  },
};

const userPlatform = navigator.userAgent.includes("Win")
  ? "windows"
  : navigator.userAgent.includes("Linux")
    ? "linux"
    : "mac";

const primaryDownload = document.querySelector("[data-primary-download]");
const primaryDownloadLabel = document.querySelector("[data-download-label]");
const selectedPlatform = platformData[userPlatform];

primaryDownload.href = selectedPlatform.href;
primaryDownloadLabel.textContent = selectedPlatform.label;
document.querySelector(`[data-platform="${userPlatform}"]`)?.classList.add("is-detected");

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const bounds = element.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    element.style.transform = `translate(${x * 0.07}px, ${y * 0.12}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
});
