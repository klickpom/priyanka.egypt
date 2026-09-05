import "./styles/main.css";
import { bundledStore, foldSearch, makeWaLink, normalizeStore, productMatches, visibleProducts } from "./data/store.js";

document.documentElement.classList.remove("no-js");

const page = document.body?.dataset.page || "home";
const SPLASH_KEY = "priyanka-open-v7";
const SPLASH_MS = 6400;
const LAND_MS = 1680;
const STORE_LOCAL_KEY = "priyanka-store-local";

let store = bundledStore();
let products = visibleProducts(store);
let categories = store.categories;
let faqs = store.faqs;

function contact() {
  return store.contact;
}

function waLink(text) {
  return makeWaLink(contact().whatsapp, text);
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function applyStore(next) {
  store = normalizeStore(next);
  products = visibleProducts(store);
  categories = store.categories;
  faqs = store.faqs;
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("fail");
  return res.json();
}

async function loadStore() {
  try {
    const api = await fetchJson("/api/store.php");
    if (api?.store) return normalizeStore(api.store);
  } catch {
    /* static host without PHP */
  }
  try {
    return normalizeStore(await fetchJson("/data/store.live.json"));
  } catch {
    /* no live overlay */
  }
  try {
    const local = localStorage.getItem(STORE_LOCAL_KEY);
    if (local) return normalizeStore(JSON.parse(local));
  } catch {
    /* ignore */
  }
  try {
    return normalizeStore(await fetchJson("/data/store.json"));
  } catch {
    return bundledStore();
  }
}

function applyCopy() {
  const copy = store.copy || {};
  document.querySelectorAll("[data-copy]").forEach((el) => {
    const value = copy[el.dataset.copy];
    if (value) el.textContent = value;
  });
}

function applyContact() {
  const c = contact();
  document.querySelectorAll("[data-phone]").forEach((el) => {
    if (el.tagName === "A") el.setAttribute("href", `tel:${c.phoneTel}`);
    const prefix = el.dataset.phonePrefix;
    if (prefix) el.textContent = `${prefix} ${c.phoneDisplay}`;
    else if (!el.hasAttribute("data-keep-label")) el.textContent = c.phoneDisplay;
  });
  document.querySelectorAll("[data-wa]").forEach((el) => {
    if (el.tagName === "A") el.setAttribute("href", waLink());
  });
  document.querySelectorAll("[data-facebook]").forEach((el) => {
    if (el.tagName === "A") el.setAttribute("href", c.facebook);
  });
}

function logoPicture(extraClass = "", width = 148, height = 86) {
  const cls = extraClass ? ` class="${extraClass}"` : "";
  return `<picture>
            <source type="image/webp" srcset="/images/logo.webp?v=3d3">
            <img${cls} src="/images/logo.png?v=3d3" alt="شعار بريانكا للتجميل" width="${width}" height="${height}">
          </picture>`;
}

function injectChrome() {
  const phone = contact().phoneDisplay;
  const tel = contact().phoneTel;
  const facebook = contact().facebook;
  const headerHost = document.querySelector("[data-chrome='header']");
  if (headerHost) {
    headerHost.outerHTML = `
      <header class="header">
        <div class="scroll-progress" aria-hidden="true"></div>
        <div class="header-inner">
          <a class="brand" href="/index.html">
            ${logoPicture()}
            <span>بريانكا للتجميل<small>PRIYANKA · EGYPT</small></span>
          </a>
          <nav class="nav" data-nav aria-label="التنقل الرئيسي">
            <a href="/index.html" data-nav-link="home">الرئيسية</a>
            <a href="/products.html" data-nav-link="products">المنتجات</a>
            <a href="/about.html" data-nav-link="about">عن العلامة</a>
            <a href="/faq.html" data-nav-link="faq">الأسئلة</a>
            <a href="/contact.html" data-nav-link="contact">الطلب والتواصل</a>
            <div class="nav-cta">
              <button class="btn btn-ghost search-open" type="button">بحث</button>
              <a class="btn btn-gold" href="${waLink()}" target="_blank" rel="noopener">واتساب</a>
              <a class="btn btn-ghost" href="tel:${tel}">${phone}</a>
            </div>
          </nav>
          <div class="actions">
            <button class="search-open search-icon-btn" type="button" aria-label="بحث في الموقع">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <a class="btn btn-ghost" href="tel:${tel}">${phone}</a>
            <a class="btn btn-gold" href="${waLink()}" target="_blank" rel="noopener">واتساب</a>
          </div>
          <button class="search-open search-icon-btn mobile-search" type="button" aria-label="بحث في الموقع">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </button>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-label="فتح القائمة">
            <span></span>
          </button>
        </div>
      </header>
      <div class="search-overlay" id="site-search" hidden>
        <div class="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <div class="search-bar">
            <p id="search-title">بحث في منتجات بريانكا</p>
            <input class="search-input" type="search" placeholder="اسم المنتج، المكونات، أو الإنجليزية..." autocomplete="off">
            <button class="search-close" type="button" aria-label="إغلاق البحث">إغلاق</button>
          </div>
          <div class="search-results" data-search-results></div>
        </div>
      </div>`;
  }

  const footerHost = document.querySelector("[data-chrome='footer']");
  if (footerHost) {
    footerHost.outerHTML = `
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <strong>بريانكا للتجميل</strong>
            <p data-copy="footerBlurb">${esc(store.copy.footerBlurb)}</p>
            <p id="cite-footer">${esc(store.copy.aboutBody)}</p>
          </div>
          <div>
            <strong>تصفحوا</strong>
            <p><a href="/products.html">الكتالوج</a></p>
            <p><a href="/about.html">عن العلامة</a></p>
            <p><a href="/faq.html">الأسئلة الشائعة</a></p>
            <p><a href="/contact.html">طريقة الطلب</a></p>
            <p><a href="/llms.txt">llms.txt</a> · <a href="/ai.txt">ai.txt</a></p>
          </div>
          <div>
            <strong>تواصل</strong>
            <p><a href="tel:${tel}">${phone}</a></p>
            <p><a href="${waLink()}" target="_blank" rel="noopener">واتساب</a></p>
            <p><a href="${esc(facebook)}" target="_blank" rel="noopener">فيسبوك priyanka.egypt</a></p>
          </div>
        </div>
        <div class="container copy">© بريانكا للتجميل — مصر. جميع الحقوق محفوظة.</div>
      </footer>`;
  }

  const floatHost = document.querySelector("[data-chrome='float']");
  if (floatHost) {
    floatHost.outerHTML = `
      <a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="راسلونا على واتساب">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 3.5A10 10 0 0 0 3.2 17.4L2 22l4.7-1.2A10 10 0 0 0 20 3.5zm-8 16.2a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-2.8.7.7-2.7-.2-.3A8.3 8.3 0 1 1 12 19.7zm4.6-6.2c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.8 6.8 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5.2-.3a.4.4 0 0 0 0-.4c0-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9 15 15 0 0 0 1.5.5 3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.2-.1-.4-.2z"/></svg>
      </a>`;
  }

  const modalHost = document.querySelector("[data-chrome='modal']");
  if (modalHost) {
    modalHost.outerHTML = `
      <div class="modal" id="product-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="modal-title">
        <div class="modal-card">
          <div class="modal-visual">
            <img alt="" width="460" height="460">
          </div>
          <div class="modal-body">
            <button class="modal-close" type="button" aria-label="إغلاق">×</button>
            <p class="en" data-modal-en></p>
            <h2 id="modal-title"></h2>
            <p data-modal-size></p>
            <p data-modal-desc></p>
            <dl class="modal-facts">
              <div data-modal-block="ingredients" hidden>
                <dt>المكونات</dt>
                <dd data-modal-ingredients></dd>
              </div>
              <div data-modal-block="usage" hidden>
                <dt>طريقة الاستخدام</dt>
                <dd data-modal-usage></dd>
              </div>
              <div data-modal-block="notes" hidden>
                <dt>ملاحظات</dt>
                <dd data-modal-notes></dd>
              </div>
            </dl>
            <div class="actions">
              <a class="btn btn-gold" data-modal-wa target="_blank" rel="noopener">اطلب عبر واتساب</a>
              <a class="btn btn-ghost" href="tel:${tel}">اتصال</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.dataset.navLink === page) link.classList.add("is-active");
  });
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    document.body.classList.toggle("nav-open", open);
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let motionStarted = false;

function startMotion() {
  if (motionStarted) return;
  motionStarted = true;
  setupReveal();
  setupParallax();
  document.querySelectorAll("[data-products]").forEach(revealCards);
}

function unlockSplash() {
  document.documentElement.classList.remove("splash-lock");
}

function landBrand() {
  const site = document.querySelector(".site");
  site?.classList.remove("is-landing");
  site?.classList.add("is-landed");
  unlockSplash();
}

function revealSite() {
  document.querySelector(".site")?.classList.add("is-ready");
  startMotion();
}

function flyLogoToHeader(splash) {
  const fromEl =
    splash.querySelector(".splash-logo-frame") ||
    splash.querySelector(".splash-logo, .splash-mark img");
  const toEl = document.querySelector(".brand img");
  const site = document.querySelector(".site");
  const forceSplash = document.documentElement.classList.contains("splash-force");
  if (!fromEl || !toEl || (prefersReducedMotion() && !forceSplash)) {
    revealSite();
    landBrand();
    splash.classList.add("is-done");
    splash.setAttribute("aria-hidden", "true");
    return;
  }

  revealSite();
  site?.classList.add("is-landing");
  const play = () => {
    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = Math.max(0.14, to.width / Math.max(from.width, 1));
    splash.style.setProperty("--land-x", `${to.left + to.width / 2}px`);
    splash.style.setProperty("--land-y", `${to.top + to.height / 2}px`);
    splash.classList.add("is-exiting");
    splash.setAttribute("aria-hidden", "true");

    const lift = Math.min(84, window.innerHeight * 0.08);
    const midScale = Math.min(1.12, Math.max(scale * 1.42, 0.52));
    if (typeof fromEl.animate === "function") {
      fromEl.animate(
        [
          {
            transform: "translate(0, 0) scale(1) rotate(0deg)",
            filter:
              "drop-shadow(0 28px 50px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 32px rgba(209, 45, 140, 0.42))",
            offset: 0,
          },
          {
            transform: `translate(${dx * 0.22}px, ${dy * 0.1 - lift}px) scale(${midScale}) rotate(-7deg)`,
            filter:
              "drop-shadow(0 24px 44px rgba(201, 162, 39, 0.42)) drop-shadow(0 0 56px rgba(209, 45, 140, 0.55))",
            offset: 0.34,
          },
          {
            transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(0deg)`,
            filter: "drop-shadow(0 10px 18px rgba(91, 26, 140, 0.28))",
            offset: 1,
          },
        ],
        {
          duration: LAND_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );
    } else {
      fromEl.style.setProperty("--to-x", `${dx}px`);
      fromEl.style.setProperty("--to-y", `${dy}px`);
      fromEl.style.setProperty("--to-s", String(scale));
      splash.classList.add("is-css-fly");
    }

    window.setTimeout(() => {
      landBrand();
      splash.classList.add("is-done");
    }, LAND_MS + 60);
  };
  requestAnimationFrame(() => requestAnimationFrame(play));
}

function setupHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;
  const sync = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    header.style.setProperty("--scroll-p", String(Math.min(1, y / max)));
  };
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function drawSplashParticles(canvas) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const dots = Array.from({ length: 56 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.55 + 0.22,
    vx: (Math.random() - 0.5) * 0.00022,
    vy: -(Math.random() * 0.00032 + 0.00005),
    a: Math.random() * 0.42 + 0.08,
    gold: Math.random() > 0.32,
  }));
  let running = true;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const tick = () => {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((dot) => {
      dot.x += dot.vx;
      dot.y += dot.vy;
      if (dot.y < -0.03) {
        dot.y = 1.03;
        dot.x = Math.random();
      }
      ctx.beginPath();
      ctx.fillStyle = dot.gold
        ? `rgba(232, 212, 138, ${dot.a})`
        : `rgba(209, 45, 140, ${dot.a * 0.85})`;
      ctx.arc(dot.x * canvas.width, dot.y * canvas.height, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return () => {
    running = false;
    window.removeEventListener("resize", resize);
  };
}

let splashTimer = 0;

function runSplash() {
  const splash = document.querySelector(".splash");
  const reduced = prefersReducedMotion();
  window.clearTimeout(splashTimer);

  if (page !== "home" || !splash) {
    splash?.classList.add("is-done");
    splash?.setAttribute("aria-hidden", "true");
    revealSite();
    landBrand();
    return;
  }

  const forceSplash = new URLSearchParams(location.search).has("splash");
  if (forceSplash) document.documentElement.classList.add("splash-force");

  if (reduced && !forceSplash) {
    document.documentElement.classList.add("splash-lock");
    splash.classList.add("is-lite");
    revealSite();
    splashTimer = window.setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      landBrand();
      splash.classList.add("is-done");
      splash.setAttribute("aria-hidden", "true");
      unlockSplash();
    }, 1600);
    return;
  }

  if (!forceSplash && sessionStorage.getItem(SPLASH_KEY)) {
    splash.classList.add("is-done");
    splash.setAttribute("aria-hidden", "true");
    revealSite();
    landBrand();
    return;
  }

  document.documentElement.classList.add("splash-lock");
  const stopParticles = drawSplashParticles(splash.querySelector("canvas"));
  let closed = false;
  const finish = () => {
    if (closed) return;
    closed = true;
    window.clearTimeout(splashTimer);
    sessionStorage.setItem(SPLASH_KEY, "1");
    flyLogoToHeader(splash);
    window.setTimeout(stopParticles, LAND_MS);
  };

  splash.querySelector(".splash-skip")?.addEventListener("click", finish, { once: true });
  splashTimer = window.setTimeout(finish, SPLASH_MS);
}

function cardHTML(product, index) {
  const eager = index < 2;
  const png = /\.png$/i.test(product.img);
  const catName = categories.find((cat) => cat.id === product.cat)?.name || "";
  return `
    <article class="card will-in${png ? " is-png" : ""}" data-id="${esc(product.id)}" data-cat="${esc(product.cat)}" style="--i:${index % 8}" tabindex="0" role="button" aria-label="عرض ${esc(product.name)}">
      <div class="thumb">
        <img src="${esc(product.img)}" alt="${esc(product.name)}" width="480" height="600" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>
        <span class="card-shine" aria-hidden="true"></span>
        <span class="card-chip">${esc(catName)}</span>
        <span class="card-cta">عرض التفاصيل</span>
      </div>
      <div class="card-body">
        <div class="en">${esc(product.en)}</div>
        <h3>${esc(product.name)}</h3>
        <div class="meta"><span>${esc(product.size)}</span><span>بدون سعر ثابت</span></div>
      </div>
    </article>`;
}

function bindProductCards(grid) {
  const canTilt =
    !prefersReducedMotion() && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  grid.querySelectorAll(".card").forEach((card) => {
    const open = () => openModal(products.find((item) => item.id === card.dataset.id));
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
    if (!canTilt) return;
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((x - 0.5) * 9).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "28%");
    });
  });
}

function revealCards(grid) {
  const cards = [...grid.querySelectorAll(".card")];
  if (!cards.length) return;
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
  );
  const vh = window.innerHeight || 800;
  cards.forEach((card, index) => {
    card.style.setProperty("--i", String(index % 8));
    const rect = card.getBoundingClientRect();
    if (rect.top < vh * 0.94 && rect.bottom > 24) {
      requestAnimationFrame(() => card.classList.add("is-in"));
    } else {
      observer.observe(card);
    }
  });
}

function openModal(product) {
  const modal = document.querySelector("#product-modal");
  if (!modal || !product) return;
  const img = modal.querySelector("img");
  img.classList.remove("is-ready");
  img.onload = () => img.classList.add("is-ready");
  img.src = product.img;
  img.alt = product.name;
  if (img.complete) img.classList.add("is-ready");
  modal.querySelector("[data-modal-en]").textContent = product.en || "";
  modal.querySelector("#modal-title").textContent = product.name;
  modal.querySelector("[data-modal-size]").textContent = product.size || "";
  modal.querySelector("[data-modal-desc]").textContent = product.desc || "";
  const fillBlock = (key, value) => {
    const block = modal.querySelector(`[data-modal-block="${key}"]`);
    const node = modal.querySelector(`[data-modal-${key}]`);
    if (!block || !node) return;
    const text = String(value || "").trim();
    block.hidden = !text;
    node.textContent = text;
  };
  fillBlock("ingredients", product.ingredients);
  fillBlock("usage", product.usage);
  fillBlock("notes", product.notes);
  const wa = modal.querySelector("[data-modal-wa]");
  wa.href = waLink(`مرحباً، أود الاستفسار عن ${product.name}`);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector(".modal-close")?.focus();
}

function closeModal() {
  const modal = document.querySelector("#product-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function setupModal() {
  const modal = document.querySelector("#product-modal");
  if (!modal) return;
  modal.querySelector(".modal-close")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function renderProducts() {
  const grid = document.querySelector("[data-products]");
  if (!grid) return;

  const featuredOnly = grid.dataset.products === "featured";
  const params = new URLSearchParams(window.location.search);
  let current = featuredOnly ? "all" : params.get("cat") || "all";
  if (!categories.some((cat) => cat.id === current)) current = "all";
  const catalogSearch = document.querySelector("[data-catalog-search]");
  let query = featuredOnly ? "" : params.get("q") || "";
  if (catalogSearch && query) catalogSearch.value = query;

  const source = featuredOnly ? products.filter((item) => item.featured) : products;
  const paint = (cat, text = query, { reveal = motionStarted || page !== "home" } = {}) => {
    const list = (cat === "all" ? source : source.filter((item) => item.cat === cat)).filter((item) =>
      productMatches(item, text)
    );
    if (!list.length) {
      grid.innerHTML = `<p class="search-empty">لا توجد منتجات مطابقة. جرّبوا كلمة أخرى أو مجموعة مختلفة.</p>`;
      return;
    }
    grid.innerHTML = list.map((item, index) => cardHTML(item, index)).join("");
    bindProductCards(grid);
    if (reveal) revealCards(grid);
  };

  const filters = document.querySelector("[data-filters]");
  if (filters && !featuredOnly) {
    filters.innerHTML = categories
      .map(
        (cat) =>
          `<button class="filter-btn${cat.id === current ? " is-on" : ""}" type="button" data-cat="${cat.id}">${esc(cat.name)}</button>`
      )
      .join("");
    filters.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-cat]");
      if (!btn) return;
      current = btn.dataset.cat;
      filters.querySelectorAll(".filter-btn").forEach((el) => el.classList.toggle("is-on", el === btn));
      const url = new URL(window.location.href);
      if (current === "all") url.searchParams.delete("cat");
      else url.searchParams.set("cat", current);
      history.replaceState({}, "", url);
      paint(current, query);
    });
  }

  if (catalogSearch && !featuredOnly) {
    catalogSearch.addEventListener("input", () => {
      query = catalogSearch.value;
      const url = new URL(window.location.href);
      if (foldSearch(query)) url.searchParams.set("q", query.trim());
      else url.searchParams.delete("q");
      history.replaceState({}, "", url);
      paint(current, query);
    });
  }

  paint(current, query);
  const openId = params.get("id");
  if (openId && !featuredOnly) {
    const match = products.find((item) => item.id === openId);
    if (match) openModal(match);
  }
}

function renderFaqs() {
  const host = document.querySelector("[data-faq]");
  if (!host) return;
  const preview = host.dataset.faq === "preview";
  const list = preview ? faqs.slice(0, 3) : faqs;
  host.innerHTML = list
    .map(
      (item, index) => `
      <details${index === 0 ? " open" : ""}>
        <summary>${esc(item.q)}</summary>
        <p class="answer">${esc(item.a)}</p>
      </details>`
    )
    .join("");
}

function setupReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;
  const reduced = prefersReducedMotion();
  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );
  nodes.forEach((node) => observer.observe(node));
}

function setupParallax() {
  if (prefersReducedMotion()) return;
  const visual = document.querySelector(".hero-visual");
  const hero = document.querySelector(".hero");
  if (!visual || !hero) return;
  const chips = hero.querySelectorAll(".hero-chip");
  const cells = visual.querySelectorAll(".mosaic-cell");

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const limit = Math.max(1, hero.offsetHeight);
    const p = Math.min(1, y / limit);
    visual.style.transform = `translate3d(0, ${Math.min(y, limit) * 0.14}px, 0)`;
    hero.style.setProperty("--hero-fade", String(Math.max(0.18, 1 - p * 0.7)));
    chips.forEach((chip, index) => {
      if (y < 10) {
        chip.style.transform = "";
        chip.style.opacity = "";
        return;
      }
      chip.style.transform = `translate3d(0, ${y * (0.08 + index * 0.04)}px, 0)`;
      chip.style.opacity = String(Math.max(0, 1 - p * 1.4));
    });
    cells.forEach((cell, index) => {
      cell.style.translate = y < 10 ? "" : `0 ${y * (0.04 + index * 0.02)}px`;
    });
  };

  update();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

function setupSearch() {
  const overlay = document.querySelector("#site-search");
  const input = overlay?.querySelector(".search-input");
  const results = overlay?.querySelector("[data-search-results]");
  if (!overlay || !input || !results) return;

  const paint = () => {
    const q = input.value.trim();
    if (!foldSearch(q)) {
      results.innerHTML = `<p class="search-hint">ابحثوا بالعربية أو الإنجليزية: بطيخ، صابون، African، خميرة...</p>`;
      return;
    }
    const hits = products.filter((item) => productMatches(item, q)).slice(0, 8);
    if (!hits.length) {
      results.innerHTML = `<p class="search-empty">لا توجد نتائج لـ «${esc(q)}».</p>`;
      return;
    }
    results.innerHTML = hits
      .map(
        (item) => `
        <a class="search-hit" href="/products.html?id=${esc(item.id)}&q=${encodeURIComponent(q)}">
          <img src="${esc(item.img)}" alt="" width="56" height="56">
          <span>
            <strong>${esc(item.name)}</strong>
            <small>${esc(item.en || "")} · ${esc(item.size || "")}</small>
          </span>
        </a>`
      )
      .join("");
  };

  const open = () => {
    overlay.hidden = false;
    document.body.classList.add("search-open-page");
    input.focus();
    paint();
  };
  const close = () => {
    overlay.hidden = true;
    document.body.classList.remove("search-open-page");
  };

  document.querySelectorAll(".search-open").forEach((btn) => btn.addEventListener("click", open));
  overlay.querySelector(".search-close")?.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  input.addEventListener("input", paint);
  results.addEventListener("click", (event) => {
    const hit = event.target.closest(".search-hit");
    if (!hit) return;
    const id = new URL(hit.href, window.location.origin).searchParams.get("id");
    const product = products.find((item) => item.id === id);
    if (!product || !document.querySelector("#product-modal")) return;
    if (page !== "home" && page !== "products") return;
    event.preventDefault();
    close();
    openModal(product);
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
    if (event.key === "/" && !event.ctrlKey && !event.metaKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      event.preventDefault();
      open();
    }
    if (event.key === "Escape" && !overlay.hidden) close();
  });
}

async function boot() {
  applyStore(await loadStore());
  injectChrome();
  applyCopy();
  applyContact();
  setupNav();
  setupHeaderScroll();
  setupModal();
  setupSearch();
  renderProducts();
  renderFaqs();
  runSplash();
}

boot();
