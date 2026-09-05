import "./styles/admin.css";
import { bundledStore, enrichProduct, normalizeStore } from "./data/store.js";

const LOCAL_KEY = "priyanka-store-local";
const SPLASH_KEY = "priyanka-admin-open-v1";
const app = document.querySelector("#admin-app");

let csrf = "";
let store = bundledStore();
let view = "home";
let editingId = "";
let toast = "";
let toastType = "";
let phpReady = false;
let listQuery = "";
let splashTimer = 0;

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slug(value) {
  return String(value || "product")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42) || `p-${Date.now()}`;
}

function note(message, type = "ok") {
  toast = message;
  toastType = type;
  render();
}

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (csrf) headers["X-CSRF"] = csrf;
  const res = await fetch(url, { credentials: "same-origin", ...options, headers });
  const type = res.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    throw new Error("تعذّر الاتصال بالسيرفر");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "تعذّر الاتصال بالسيرفر");
  return data;
}

async function loadRemote() {
  try {
    const auth = await api("/api/auth.php");
    if (typeof auth.setup !== "boolean") throw new Error("no-php");
    phpReady = true;
    csrf = auth.csrf || "";
    return auth;
  } catch {
    phpReady = false;
    return { setup: false, authed: true, local: true };
  }
}

function persistLocal() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
}

async function saveStore() {
  store.updatedAt = new Date().toISOString();
  persistLocal();
  if (!phpReady) {
    note("حُفظت النسخة على هذا الجهاز. ارفعوا الموقع على الاستضافة لتفعيل الحفظ على السيرفر.", "ok");
    return;
  }
  try {
    await api("/api/store.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ store }),
    });
    note("تم حفظ التعديلات على الموقع.");
  } catch (err) {
    note(err.message, "err");
  }
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `priyanka-store-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function restoreFile(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      store = normalizeStore(JSON.parse(String(reader.result)));
      await saveStore();
      note("تمت استعادة النسخة الاحتياطية.");
    } catch {
      note("ملف النسخة غير صالح.", "err");
    }
  };
  reader.readAsText(file);
}

function productById(id) {
  return store.products.find((item) => item.id === id);
}

function field(label, inner) {
  return `<label class="field"><span>${label}</span>${inner}</label>`;
}

function icon(name) {
  const paths = {
    home: "M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1z",
    products: "M4 7h16v12H4zm3-3h10l1 3H6z",
    categories: "M4 6h7v7H4zm9 0h7v7h-7zM4 15h7v5H4zm9 0h7v5h-7z",
    faqs: "M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm.8 13h-1.6v-1.7h1.6zm1.7-4.8c-.3.5-.7.8-1.2 1.1-.4.3-.5.5-.5 1h-1.6c0-1 .4-1.6 1-2 .5-.4.8-.7 1-1.1a1.6 1.6 0 0 0-1.5-2.4 1.8 1.8 0 0 0-1.8 1.5l-1.5-.4A3.4 3.4 0 0 1 12 6.8a3.2 3.2 0 0 1 3.3 3.3c0 .7-.3 1.3-.8 2.1z",
    copy: "M6 5h9v14H6zm3-2h9v14h-2V5H9z",
    contact: "M6.5 4h11A1.5 1.5 0 0 1 19 5.5v13l-7-3.2-7 3.2v-13A1.5 1.5 0 0 1 6.5 4z",
    settings: "M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5zM4 13l2 .6a6.6 6.6 0 0 0 .5 1.3L5.3 17 7 18.7l1.9-1.2a6.6 6.6 0 0 0 1.3.5L11 20h2l.6-2a6.6 6.6 0 0 0 1.3-.5L17 18.7 18.7 17l-1.2-1.9a6.6 6.6 0 0 0 .5-1.3L20 13v-2l-2-.6a6.6 6.6 0 0 0-.5-1.3L18.7 7 17 5.3l-1.9 1.2a6.6 6.6 0 0 0-1.3-.5L13 4h-2l-.6 2a6.6 6.6 0 0 0-1.3.5L7 5.3 5.3 7l1.2 1.9a6.6 6.6 0 0 0-.5 1.3L4 11z",
    logout: "M10 5H6v14h4m3-4 4-4-4-4m4 4H9",
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]}"/></svg>`;
}

function renderGate(mode) {
  app.innerHTML = `
    <div class="gate">
      <div class="gate-aura" aria-hidden="true"></div>
      <form class="gate-card" data-gate="${mode}">
        <p class="gate-kicker">PRIYANKA · EGYPT</p>
        <img src="/images/logo.webp?v=3d3" alt="">
        <h1>${mode === "setup" ? "إنشاء لوحة التحكم" : "دخول المشرف"}</h1>
        <span class="gold-rule" aria-hidden="true"></span>
        <p>${mode === "setup" ? "اختاروا كلمة مرور قوية مرة واحدة. لن تظهر في الموقع." : "من الطبيعة للبشرة — إدارة الكتالوج والنصوص."}</p>
        ${field("كلمة المرور", `<input type="password" name="password" minlength="8" required>`)}
        ${mode === "setup" ? field("تأكيد كلمة المرور", `<input type="password" name="confirm" minlength="8" required>`) : ""}
        <div class="form-actions" style="margin-top:18px">
          <button class="btn btn-gold btn-wide" type="submit">${mode === "setup" ? "حفظ ودخول" : "دخول اللوحة"}</button>
        </div>
        <p class="toast ${toastType}" style="margin-top:12px;text-align:center">${esc(toast)}</p>
      </form>
    </div>`;
  app.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.password.value;
    if (mode === "setup" && password !== form.confirm.value) {
      note("كلمتا المرور غير متطابقتين.", "err");
      return;
    }
    try {
      const data = await api("/api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode === "setup" ? "setup" : "login", password }),
      });
      csrf = data.csrf || csrf;
      await hydrate();
    } catch (err) {
      note(err.message, "err");
    }
  });
}

function nav(id, label, iconName) {
  const on = view === id || (view === "edit" && id === "products");
  return `<button type="button" data-view="${id}" class="side-link${on ? " is-on" : ""}">${icon(iconName)}<span>${label}</span></button>`;
}

function splashMarkup() {
  return `
    <div class="admin-splash" data-admin-splash>
      <div class="admin-splash-lift" aria-hidden="true">
        <div class="admin-splash-aurora"></div>
        <div class="admin-splash-vignette"></div>
        <div class="admin-splash-grain"></div>
        <div class="admin-splash-frame"><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="admin-splash-stage">
        <p class="admin-splash-kicker">PRIYANKA · EGYPT</p>
        <div class="admin-splash-mark">
          <div class="admin-splash-ring"></div>
          <div class="admin-splash-orbit"></div>
          <img src="/images/logo.webp?v=3d3" alt="شعار بريانكا للتجميل">
        </div>
        <span class="gold-rule" aria-hidden="true"></span>
        <h2>لوحة التحكم</h2>
        <p class="admin-splash-tag">FROM NATURE FOR SKIN</p>
        <p class="admin-splash-seal">الأصلي · Original · مصر</p>
      </div>
      <div class="admin-splash-progress" aria-hidden="true"></div>
      <button class="admin-splash-skip" type="button" data-splash-skip>تخطي الافتتاحية</button>
    </div>`;
}

function mountSplash() {
  if (sessionStorage.getItem(SPLASH_KEY) === "1") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    sessionStorage.setItem(SPLASH_KEY, "1");
    return;
  }
  if (document.querySelector("[data-admin-splash]")) return;
  document.body.insertAdjacentHTML("beforeend", splashMarkup());
  bindSplash();
}

function shell(inner) {
  return `
    <div class="shell">
      <aside class="side">
        <div class="brand-block">
          <img src="/images/logo.webp?v=3d3" alt="">
          <div>
            <strong>بريانكا</strong>
            <small>ADMIN</small>
          </div>
        </div>
        <nav class="side-nav" aria-label="أقسام اللوحة">
          ${nav("home", "نظرة عامة", "home")}
          ${nav("products", "المنتجات", "products")}
          ${nav("categories", "الأقسام", "categories")}
          ${nav("faqs", "الأسئلة", "faqs")}
          ${nav("copy", "نصوص الموقع", "copy")}
          ${nav("contact", "التواصل", "contact")}
          ${nav("settings", "الإعدادات", "settings")}
          <button type="button" class="side-link logout" data-logout>${icon("logout")}<span>خروج</span></button>
        </nav>
      </aside>
      <main class="main${view === "home" ? " is-overview" : ""}">
        <div class="topbar">
          <div>
            <h1>${viewTitle()}</h1>
            <p class="kicker toast ${toastType}">${esc(toast || (phpReady ? "الحفظ يصل إلى الموقع مباشرة بعد «حفظ على الموقع»." : "وضع محلي: احفظوا نسخة احتياطية JSON."))}</p>
          </div>
          <div class="top-actions">
            <label class="btn btn-ghost">استعادة JSON<input type="file" data-restore accept="application/json" hidden></label>
            <button class="btn btn-ghost" type="button" data-backup>نسخة احتياطية</button>
            <button class="btn btn-purple" type="button" data-save>حفظ على الموقع</button>
          </div>
        </div>
        ${inner}
      </main>
    </div>`;
}

function viewTitle() {
  return {
    home: "نظرة عامة",
    products: "المنتجات",
    edit: "تفاصيل المنتج",
    categories: "الأقسام",
    faqs: "الأسئلة الشائعة",
    copy: "نصوص الموقع",
    contact: "بيانات التواصل",
    settings: "الإعدادات",
  }[view] || "لوحة التحكم";
}

function homeView() {
  const active = store.products.filter((item) => item.active !== false).length;
  const featured = store.products.filter((item) => item.featured).slice(0, 6);
  const mosaic = (featured.length ? featured : store.products).slice(0, 3);
  const mosaicCards = mosaic.length
    ? mosaic
    : [{ img: "/images/logo.webp?v=3d3", name: "بريانكا للتجميل" }];
  const cats = store.categories.filter((cat) => cat.id !== "all").length;
  const q = listQuery.trim().toLowerCase();
  const hits = q
    ? store.products.filter((item) => `${item.name} ${item.en} ${item.desc}`.toLowerCase().includes(q)).slice(0, 6)
    : [];
  return `
    <section class="overview-hero">
      <div class="overview-hero-glow" aria-hidden="true"></div>
      <div class="overview-copy">
        <p class="eyebrow">PRIYANKA · CONTROL ROOM</p>
        <h2>من الطبيعة للبشرة</h2>
        <span class="gold-rule" aria-hidden="true"></span>
        <p class="lead">افتتاحية العلامة ثم غرفة التحكم: عدّلوا الاسم والصورة والمكونات، ثم احفظوا على الموقع. البحث يقرأ نفس البيانات التي يراها الزائر.</p>
        <div class="overview-search">
          <input data-home-q type="search" placeholder="ابحثوا عن منتج للتعديل: بطيخ، صابون، خميرة..." value="${esc(listQuery)}">
        </div>
        <div class="hero-actions">
          <button class="btn btn-gold" type="button" data-view="products">فتح الكتالوج</button>
          <button class="btn btn-ghost-light" type="button" data-add>منتج جديد</button>
          <button class="btn btn-ghost-light" type="button" data-replay-splash>إعادة الافتتاحية</button>
        </div>
        <p class="live-pill">${phpReady ? "متصل بالاستضافة" : "وضع محلي على هذا الجهاز"}</p>
      </div>
      <div class="overview-mosaic" aria-hidden="true">
        ${mosaicCards
          .map(
            (item, index) =>
              `<figure class="mosaic-cell${index === 0 ? " is-tall" : ""}"><img src="${esc(item.img)}" alt=""><figcaption>${esc(item.name)}</figcaption></figure>`
          )
          .join("")}
      </div>
    </section>
    ${
      q
        ? `<section class="panel search-panel">
            <div class="panel-head"><div><h2>نتائج البحث</h2><p>${hits.length} منتج مطابق</p></div></div>
            <div class="list">${
              hits.length
                ? hits
                    .map(
                      (item) => `
              <article class="row" data-open="${esc(item.id)}">
                <img src="${esc(item.img)}" alt="">
                <div><strong>${esc(item.name)}</strong><small>${esc(item.en)}</small></div>
                <button class="btn btn-ghost" type="button">تعديل</button>
              </article>`
                    )
                    .join("")
                : `<p class="help">لا توجد نتائج. جرّبوا اسماً أقصر.</p>`
            }</div>
          </section>`
        : ""
    }
    <div class="grid-cards four">
      <div class="stat"><span class="stat-label">الكتالوج</span><b>${store.products.length}</b><span>منتج مسجّل</span></div>
      <div class="stat"><span class="stat-label">ظاهر</span><b>${active}</b><span>يراه الزوار</span></div>
      <div class="stat"><span class="stat-label">الأقسام</span><b>${cats}</b><span>مجموعة عناية</span></div>
      <div class="stat"><span class="stat-label">الأسئلة</span><b>${store.faqs.length}</b><span>في صفحة FAQ</span></div>
    </div>
    <div class="quick-grid">
      <button class="quick" type="button" data-view="products"><strong>المنتجات</strong><span>الاسم، الصورة، المكونات والاستخدام</span></button>
      <button class="quick" type="button" data-view="copy"><strong>نصوص الموقع</strong><span>الهيرو، الكتالوج، عن العلامة</span></button>
      <button class="quick" type="button" data-view="faqs"><strong>الأسئلة</strong><span>عدّلوا الإجابات كما يراها الزائر</span></button>
      <button class="quick" type="button" data-view="contact"><strong>التواصل</strong><span>واتساب، الهاتف، فيسبوك</span></button>
    </div>
    ${
      featured.length
        ? `<section class="panel">
            <div class="panel-head"><div><h2>مختارات الرئيسية</h2><p>اضغطوا البطاقة لتعديل التفاصيل</p></div><button class="btn btn-ghost" type="button" data-view="products">كل المنتجات</button></div>
            <div class="featured-strip">
              ${featured
                .map(
                  (item) => `
                <button class="featured-card" type="button" data-open="${esc(item.id)}">
                  <img src="${esc(item.img)}" alt="">
                  <strong>${esc(item.name)}</strong>
                  <small>${esc(item.size || item.en)}</small>
                </button>`
                )
                .join("")}
            </div>
          </section>`
        : ""
    }
    ${localStorage.getItem(LOCAL_KEY) ? `<p style="margin-top:16px"><button class="btn btn-ghost" type="button" data-restore-local>استعادة آخر تعديل من هذا الجهاز</button></p>` : ""}`;
}

function productsView() {
  const q = listQuery.trim().toLowerCase();
  const list = store.products.filter((item) => {
    const hay = `${item.name} ${item.en} ${item.desc}`.toLowerCase();
    return !q || hay.includes(q);
  });
  return `
    <div class="toolbar">
      <input data-plist-q placeholder="بحث بالاسم أو الوصف..." value="${esc(listQuery)}">
      <button class="btn btn-gold" type="button" data-add>منتج جديد</button>
    </div>
    <div class="list">
      ${list
        .map(
          (item) => `
        <article class="row" data-open="${esc(item.id)}">
          <img src="${esc(item.img)}" alt="">
          <div>
            <strong>${esc(item.name)} ${item.featured ? `<span class="pill">مميز</span>` : ""} ${item.active === false ? `<span class="pill off">مخفي</span>` : ""}</strong>
            <small>${esc(item.en)} · ${esc(item.size || "بدون حجم")}</small>
          </div>
          <button class="btn btn-ghost" type="button">تعديل</button>
        </article>`
        )
        .join("")}
    </div>`;
}

function editorView() {
  const item = enrichProduct(productById(editingId) || {});
  return `
    <div class="editor">
      <form class="editor-form" data-editor>
        <section class="panel">
          <div class="panel-head"><div><h2>بيانات المنتج</h2><p>كما تظهر للزائر في البطاقة والبحث</p></div></div>
          <div class="fields-grid two">
            ${field("الاسم بالعربية", `<input name="name" value="${esc(item.name)}" required>`)}
            ${field("الاسم بالإنجليزية", `<input name="en" value="${esc(item.en)}">`)}
            ${field(
              "القسم",
              `<select name="cat">${store.categories
                .filter((cat) => cat.id !== "all")
                .map((cat) => `<option value="${esc(cat.id)}" ${cat.id === item.cat ? "selected" : ""}>${esc(cat.name)}</option>`)
                .join("")}</select>`
            )}
            ${field("الحجم / العبوة", `<input name="size" value="${esc(item.size)}">`)}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h2>الصورة</h2><p>JPG أو PNG أو WebP حتى 4 ميجا</p></div></div>
          <div class="fields-grid two">
            ${field("رابط الصورة", `<input name="img" value="${esc(item.img)}">`)}
            ${field("رفع صورة جديدة", `<input type="file" name="file" accept="image/jpeg,image/png,image/webp">`)}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h2>التفاصيل</h2><p>تظهر في نافذة المنتج على الموقع</p></div></div>
          <div class="fields-grid">
            ${field("وصف المنتج للزائر", `<textarea name="desc" rows="4">${esc(item.desc)}</textarea>`)}
            ${field("المكونات", `<textarea name="ingredients" rows="3">${esc(item.ingredients)}</textarea>`)}
            ${field("طريقة الاستخدام", `<textarea name="usage" rows="3">${esc(item.usage)}</textarea>`)}
            ${field("ملاحظات", `<textarea name="notes" rows="2">${esc(item.notes)}</textarea>`)}
            ${field("كلمات بحث (افصلوا بفاصلة)", `<input name="tags" value="${esc((item.tags || []).join("، "))}">`)}
          </div>
        </section>
        <section class="panel">
          <div class="checks">
            <label class="check"><input type="checkbox" name="featured" ${item.featured ? "checked" : ""}> منتج مميز في الرئيسية</label>
            <label class="check"><input type="checkbox" name="active" ${item.active !== false ? "checked" : ""}> ظاهر في الموقع</label>
          </div>
          <div class="form-actions" style="margin-top:14px">
            <button class="btn btn-purple" type="submit">حفظ المنتج</button>
            <button class="btn btn-ghost" type="button" data-view="products">رجوع للكتالوج</button>
            <button class="btn btn-danger" type="button" data-delete>حذف المنتج</button>
          </div>
        </section>
      </form>
      <aside class="preview">
        <img src="${esc(item.img)}" alt="">
        <p class="en">${esc(item.en)}</p>
        <h2>${esc(item.name)}</h2>
        <p>${esc(item.size)}</p>
        <p>${esc(item.desc)}</p>
      </aside>
    </div>`;
}

function categoriesView() {
  return `
    <div class="toolbar">
      <p class="help" style="flex:1;margin:0">المعرّف بالإنجليزية للروابط، والاسم بالعربية كما يظهر للزائر.</p>
      <button class="btn btn-gold" type="button" data-add-cat>قسم جديد</button>
    </div>
    <div class="stack">
      ${store.categories
        .map(
          (cat, index) => `
        <article class="panel cat-item" data-cat-i="${index}">
          <div class="fields-grid two">
            ${field("المعرّف", `<input name="id" value="${esc(cat.id)}" ${cat.id === "all" ? "readonly" : ""}>`)}
            ${field("الاسم الظاهر", `<input name="name" value="${esc(cat.name)}">`)}
          </div>
          ${cat.id === "all" ? "" : `<div class="item-actions"><button class="btn btn-danger" type="button" data-del-cat="${index}">حذف القسم</button></div>`}
        </article>`
        )
        .join("")}
    </div>`;
}

function faqsView() {
  return `
    <div class="toolbar">
      <p class="help" style="flex:1;margin:0">كل بطاقة سؤال واحد. احفظوا بعد التعديل من الزر أعلى الصفحة.</p>
      <button class="btn btn-gold" type="button" data-add-faq>سؤال جديد</button>
    </div>
    <div class="stack">
      ${store.faqs
        .map(
          (item, index) => `
        <article class="panel faq-item" data-faq-i="${index}">
          <div class="fields-grid">
            ${field("السؤال", `<input name="q" value="${esc(item.q)}">`)}
            ${field("الجواب", `<textarea name="a" rows="4">${esc(item.a)}</textarea>`)}
          </div>
          <div class="item-actions"><button class="btn btn-danger" type="button" data-del-faq="${index}">حذف السؤال</button></div>
        </article>`
        )
        .join("")}
    </div>`;
}

function copyView() {
  const groups = [
    {
      title: "الصفحة الرئيسية · الهيرو",
      hint: "العنوان الكبير أعلى الموقع",
      fields: [
        ["heroEyebrow", "السطر الصغير", 2],
        ["heroTitle", "العنوان", 2],
        ["heroAccent", "السطر الملوّن", 2],
        ["heroLead", "الوصف", 4],
      ],
    },
    {
      title: "المجموعات والمختارات",
      hint: "أقسام خطوط العناية والمنتجات المميزة",
      fields: [
        ["collectionsEyebrow", "سطر المجموعات", 2],
        ["collectionsTitle", "عنوان المجموعات", 2],
        ["collectionsLead", "وصف المجموعات", 3],
        ["featuredEyebrow", "سطر المختارات", 2],
        ["featuredTitle", "عنوان المختارات", 2],
      ],
    },
    {
      title: "الكتالوج",
      hint: "صفحة المنتجات",
      fields: [
        ["catalogEyebrow", "السطر الصغير", 2],
        ["catalogTitle", "العنوان", 2],
        ["catalogLead", "الوصف", 3],
      ],
    },
    {
      title: "عن العلامة والتذييل",
      hint: "صفحة القصة ونص أسفل الموقع",
      fields: [
        ["aboutEyebrow", "سطر صفحة عن العلامة", 2],
        ["aboutTitle", "عنوان الصفحة", 2],
        ["aboutQuote", "الاقتباس", 2],
        ["aboutBody", "نص عن العلامة", 5],
        ["aboutLines", "سطور الخطوط", 4],
        ["footerBlurb", "نص التذييل", 3],
      ],
    },
  ];
  return `
    <form class="copy-form" data-copy>
      ${groups
        .map(
          (group) => `
        <section class="panel">
          <div class="panel-head"><div><h2>${group.title}</h2><p>${group.hint}</p></div></div>
          <div class="fields-grid">${group.fields
            .map(([key, label, rows]) => field(label, `<textarea name="${key}" rows="${rows}">${esc(store.copy[key] || "")}</textarea>`))
            .join("")}</div>
        </section>`
        )
        .join("")}
      <div class="form-actions">
        <button class="btn btn-purple" type="submit">حفظ النصوص</button>
      </div>
    </form>`;
}

function contactView() {
  const c = store.contact;
  return `
    <form class="contact-form" data-contact>
      <section class="panel">
        <div class="panel-head"><div><h2>أرقام وروابط التواصل</h2><p>تظهر في الهيدر، التذييل، وصفحة الطلب</p></div></div>
        <div class="fields-grid two">
          ${field("رقم العرض للزائر", `<input name="phoneDisplay" value="${esc(c.phoneDisplay)}">`)}
          ${field("رقم الاتصال الدولي", `<input name="phoneTel" value="${esc(c.phoneTel)}" dir="ltr">`)}
          ${field("واتساب بدون +", `<input name="whatsapp" value="${esc(c.whatsapp)}" dir="ltr">`)}
          ${field("رابط فيسبوك", `<input name="facebook" value="${esc(c.facebook)}" dir="ltr">`)}
        </div>
        <div class="form-actions" style="margin-top:16px">
          <button class="btn btn-purple" type="submit">حفظ بيانات التواصل</button>
        </div>
      </section>
    </form>`;
}

function settingsView() {
  return `
    <div class="settings-card">
      <section class="panel">
        <div class="panel-head"><div><h2>كلمة المرور</h2><p>تُحفظ على السيرفر فقط ولن تظهر في صفحات الزوار.</p></div></div>
        ${
          phpReady
            ? `<form data-password class="fields-grid" style="max-width:420px">
                ${field("كلمة مرور جديدة (8 أحرف على الأقل)", `<input type="password" name="password" minlength="8" required>`)}
                <div class="form-actions"><button class="btn btn-purple" type="submit">تغيير كلمة المرور</button></div>
              </form>`
            : `<p class="help">تغيير كلمة المرور يعمل بعد رفع الموقع على الاستضافة مع PHP.</p>`
        }
      </section>
      <section class="panel">
        <div class="panel-head"><div><h2>النسخ الاحتياطي</h2><p>احفظوا JSON بعد كل تعديل مهم.</p></div></div>
        <p class="help">إذا اختفت التعديلات بعد نشر جديد، ارفعوا الملف من «استعادة JSON» أعلى الصفحة ثم احفظوا على الموقع.</p>
        <p class="help">رابط اللوحة: <strong>/admin.html</strong></p>
      </section>
    </div>`;
}

function render() {
  if (view === "gate-setup" || view === "gate-login") {
    renderGate(view === "gate-setup" ? "setup" : "login");
    return;
  }
  const inner =
    view === "home"
      ? homeView()
      : view === "products"
        ? productsView()
        : view === "edit"
          ? editorView()
          : view === "categories"
            ? categoriesView()
            : view === "faqs"
              ? faqsView()
              : view === "copy"
                ? copyView()
                : view === "settings"
                  ? settingsView()
                  : contactView();
  app.innerHTML = shell(inner);
  bindShell();
  mountSplash();
}

function bindShell() {
  app.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      view = btn.dataset.view;
      editingId = "";
      render();
    });
  });
  app.querySelector("[data-save]")?.addEventListener("click", saveStore);
  app.querySelector("[data-backup]")?.addEventListener("click", downloadBackup);
  app.querySelector("[data-restore]")?.addEventListener("change", (event) => {
    const file = event.currentTarget.files?.[0];
    if (file) restoreFile(file);
  });
  app.querySelector("[data-restore-local]")?.addEventListener("click", async () => {
    const local = localStorage.getItem(LOCAL_KEY);
    if (!local) return;
    store = normalizeStore(JSON.parse(local));
    await saveStore();
    note("تمت الاستعادة من هذا الجهاز.");
  });
  app.querySelector("[data-password]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "password", password: event.currentTarget.password.value }),
      });
      note("تم تغيير كلمة المرور.");
    } catch (err) {
      note(err.message, "err");
    }
  });
  app.querySelector("[data-logout]")?.addEventListener("click", async () => {
    try {
      await api("/api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {
      /* local */
    }
    view = phpReady ? "gate-login" : "home";
    render();
  });
  app.querySelector("[data-home-q]")?.addEventListener("input", (event) => {
    listQuery = event.currentTarget.value;
    render();
    const input = app.querySelector("[data-home-q]");
    if (input) {
      input.focus();
      input.setSelectionRange(listQuery.length, listQuery.length);
    }
  });
  app.querySelector("[data-plist-q]")?.addEventListener("input", (event) => {
    listQuery = event.currentTarget.value;
    render();
    const input = app.querySelector("[data-plist-q]");
    if (input) {
      input.focus();
      input.setSelectionRange(listQuery.length, listQuery.length);
    }
  });
  app.querySelector("[data-replay-splash]")?.addEventListener("click", () => {
    window.clearTimeout(splashTimer);
    sessionStorage.removeItem(SPLASH_KEY);
    document.documentElement.classList.remove("admin-splash-lock");
    document.querySelector("[data-admin-splash]")?.remove();
    mountSplash();
  });
  app.querySelector("[data-add]")?.addEventListener("click", () => {
    const item = enrichProduct({
      id: `p-${Date.now()}`,
      cat: store.categories.find((cat) => cat.id !== "all")?.id || "body",
      name: "منتج جديد",
      en: "New product",
      size: "",
      img: "/images/logo.jpg",
      desc: "",
    });
    store.products.unshift(item);
    editingId = item.id;
    view = "edit";
    render();
  });
  app.querySelectorAll("[data-open]").forEach((row) => {
    row.addEventListener("click", () => {
      editingId = row.dataset.open;
      view = "edit";
      render();
    });
  });
  const editor = app.querySelector("[data-editor]");
  if (editor) {
    editor.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const current = productById(editingId);
      if (!current) return;
      current.name = form.name.value.trim();
      current.en = form.en.value.trim();
      current.cat = form.cat.value;
      current.size = form.size.value.trim();
      current.img = form.img.value.trim();
      current.desc = form.desc.value.trim();
      current.ingredients = form.ingredients.value.trim();
      current.usage = form.usage.value.trim();
      current.notes = form.notes.value.trim();
      current.tags = form.tags.value.split(/[،,]/).map((part) => part.trim()).filter(Boolean);
      current.featured = form.featured.checked;
      current.active = form.active.checked;
      if (!current.id) current.id = slug(current.en || current.name);
      const file = form.file.files[0];
      if (file && phpReady) {
        const body = new FormData();
        body.append("file", file);
        try {
          const up = await api("/api/upload.php", { method: "POST", body });
          if (up.url) current.img = up.url;
        } catch (err) {
          note(err.message, "err");
          return;
        }
      } else if (file && !phpReady) {
        note("رفع الصور يعمل على الاستضافة. الصقوا رابط الصورة حالياً.", "err");
      }
      await saveStore();
      view = "edit";
      render();
    });
    app.querySelector("[data-delete]")?.addEventListener("click", async () => {
      if (!confirm("حذف هذا المنتج من الكتالوج؟")) return;
      store.products = store.products.filter((item) => item.id !== editingId);
      view = "products";
      await saveStore();
      render();
    });
  }
  app.querySelector("[data-add-cat]")?.addEventListener("click", () => {
    store.categories.push({ id: `cat-${Date.now()}`, name: "قسم جديد" });
    render();
  });
  app.querySelectorAll("[data-cat-i]").forEach((box) => {
    const index = Number(box.dataset.catI);
    box.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", () => {
        store.categories[index][input.name] = input.value.trim();
      });
    });
  });
  app.querySelectorAll("[data-del-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.categories.splice(Number(btn.dataset.delCat), 1);
      render();
    });
  });
  app.querySelector("[data-add-faq]")?.addEventListener("click", () => {
    store.faqs.push({ q: "سؤال جديد؟", a: "" });
    render();
  });
  app.querySelectorAll("[data-faq-i]").forEach((box) => {
    const index = Number(box.dataset.faqI);
    box.querySelector("input")?.addEventListener("change", (event) => {
      store.faqs[index].q = event.currentTarget.value;
    });
    box.querySelector("textarea")?.addEventListener("change", (event) => {
      store.faqs[index].a = event.currentTarget.value;
    });
  });
  app.querySelectorAll("[data-del-faq]").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.faqs.splice(Number(btn.dataset.delFaq), 1);
      render();
    });
  });
  app.querySelector("[data-copy]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    [...form.elements].forEach((el) => {
      if (el.name) store.copy[el.name] = el.value;
    });
    await saveStore();
  });
  app.querySelector("[data-contact]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    store.contact.phoneDisplay = form.phoneDisplay.value.trim();
    store.contact.phoneTel = form.phoneTel.value.trim();
    store.contact.whatsapp = form.whatsapp.value.replace(/\D/g, "");
    store.contact.facebook = form.facebook.value.trim();
    await saveStore();
  });
}

function bindSplash() {
  const splash = document.querySelector("[data-admin-splash]");
  if (!splash) return;
  document.documentElement.classList.add("admin-splash-lock");
  const finish = () => {
    if (splash.classList.contains("is-out")) return;
    splash.classList.add("is-out");
    sessionStorage.setItem(SPLASH_KEY, "1");
    document.documentElement.classList.remove("admin-splash-lock");
    window.setTimeout(() => splash.remove(), 780);
  };
  splash.querySelector("[data-splash-skip]")?.addEventListener("click", finish, { once: true });
  window.clearTimeout(splashTimer);
  splashTimer = window.setTimeout(finish, 3200);
}

async function hydrate() {
  try {
    const data = await api("/api/store.php");
    if (data.store) store = normalizeStore(data.store);
  } catch {
    const local = localStorage.getItem(LOCAL_KEY);
    store = normalizeStore(local ? JSON.parse(local) : bundledStore());
  }
  view = "home";
  render();
}

async function start() {
  const auth = await loadRemote();
  if (!phpReady) {
    store = normalizeStore(JSON.parse(localStorage.getItem(LOCAL_KEY) || "null") || bundledStore());
    view = "home";
    render();
    return;
  }
  if (auth.setup) {
    view = "gate-setup";
    render();
    return;
  }
  if (!auth.authed) {
    view = "gate-login";
    render();
    return;
  }
  await hydrate();
}

start();
