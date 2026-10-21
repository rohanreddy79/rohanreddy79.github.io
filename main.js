/* Rohan Reddy Jakkam — portfolio. Small, dependency-free progressive enhancement. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme: dark by default, remembered per visitor.
  const stored = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
  if (stored === "light") root.setAttribute("data-theme", "light");
  const toggle = document.getElementById("theme");
  toggle?.addEventListener("click", () => {
    const light = root.getAttribute("data-theme") === "light";
    if (light) root.removeAttribute("data-theme"); else root.setAttribute("data-theme", "light");
    try { localStorage.setItem("theme", light ? "dark" : "light"); } catch {}
  });

  // Nav: frosted background after the hero, active link per section.
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  // Reveal on scroll with per-element stagger (data-d in ms).
  // Above-the-fold hero content reveals on load; everything else reveals on scroll.
  document.querySelectorAll(".hero .reveal").forEach((el) => {
    el.style.setProperty("--d", (el.dataset.d || 0) + "ms");
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));
  });
  const reveals = [...document.querySelectorAll(".reveal")].filter((el) => !el.closest(".hero"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.06, rootMargin: "0px 0px -3% 0px" });
    reveals.forEach((el) => { el.style.setProperty("--d", (el.dataset.d || 0) + "ms"); io.observe(el); });
  }

  // Counters: count up once when visible. data-to is the final value, data-dec the decimals.
  const counters = document.querySelectorAll("[data-to]");
  const runCounter = (el) => {
    const to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || "0", 10);
    const suffix = el.dataset.suffix || "", t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reduce || !("IntersectionObserver" in window)) {
    counters.forEach((el) => { el.textContent = parseFloat(el.dataset.to).toFixed(parseInt(el.dataset.dec || "0", 10)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (el.dataset.suffix || ""); });
  } else {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  // Pointer-aware glow: hero backdrop and card spotlights.
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    let raf = 0, mx = 0, my = 0;
    hero?.addEventListener("pointermove", (ev) => {
      const r = hero.getBoundingClientRect(); mx = ev.clientX - r.left; my = ev.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(() => { hero.style.setProperty("--mx", mx + "px"); hero.style.setProperty("--my", my + "px"); raf = 0; });
    });
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (ev) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", ev.clientX - r.left + "px"); card.style.setProperty("--y", ev.clientY - r.top + "px");
      });
    });
  }

  // Copy email.
  const copy = document.getElementById("copy-email"), toast = document.getElementById("toast");
  copy?.addEventListener("click", async () => {
    const email = copy.dataset.email;
    try { await navigator.clipboard.writeText(email); toast.textContent = "Email copied: " + email; }
    catch { toast.textContent = email; }
    toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
