import "./styles/admin.css";
import { bundledStore, enrichProduct, normalizeStore } from "./data/store.js";

const LOCAL_KEY = "priyanka-store-local";
const app = document.querySelector("#admin-app");

let csrf = "";
let store = bundledStore();
let view = "home";
let editingId = "";
let toast = "";
let toastType = "";
let phpReady = false;
let listQuery = "";

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

function renderGate(mode) {
  app.innerHTML = `
    <div class="gate">
      <form class="gate-card" data-gate="${mode}">
        <img src="/images/logo.webp?v=3d3" alt="">
        <h1>${mode === "setup" ? "إنشاء لوحة التحكم" : "دخول المشرف"}</h1>
        <p>${mode === "setup" ? "اختاروا كلمة مرور قوية مرة واحدة. لن تظهر في الموقع." : "عدّلوا المنتجات والنصوص ثم احفظوا."}</p>
        <label>كلمة المرور<input type="password" name="password" minlength="8" required></label>
        ${mode === "setup" ? `<label>تأكيد كلمة المرور<input type="password" name="confirm" minlength="8" required></label>` : ""}
        <button class="btn btn-gold" type="submit" style="width:100%">${mode === "setup" ? "حفظ ودخول" : "دخول"}</button>
        <p class="toast ${toastType}">${esc(toast)}</p>
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

function nav(id, label) {
  return `<button type="button" data-view="${id}" class="${view === id || (view === "edit" && id === "products") ? "is-on" : ""}">${label}</button>`;
}

function shell(inner) {
  return `
    <div class="shell">
      <aside class="side">
        <strong>بريانكا · لوحة التحكم</strong>
        ${nav("home", "نظرة عامة")}
        ${nav("products", "المنتجات")}
        ${nav("categories", "الأقسام")}
        ${nav("faqs", "الأسئلة")}
        ${nav("copy", "نصوص الموقع")}
        ${nav("contact", "التواصل")}
        ${nav("settings", "الإعدادات")}
        <button type="button" data-logout>خروج</button>
      </aside>
      <main class="main">
        <div class="topbar">
          <div>
            <h1 style="margin:0">${viewTitle()}</h1>
            <p class="toast ${toastType}">${esc(toast || (phpReady ? "الحفظ يصل إلى الموقع مباشرة." : "وضع محلي: احفظوا نسخة احتياطية JSON."))}</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <label class="btn btn-ghost" style="cursor:pointer">استعادة JSON<input type="file" data-restore accept="application/json" hidden></label>
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
  return `
    <div class="grid-cards">
      <div class="stat"><b>${store.products.length}</b><span>منتج في الكتالوج</span></div>
      <div class="stat"><b>${active}</b><span>ظاهر للزوار</span></div>
      <div class="stat"><b>${store.faqs.length}</b><span>سؤال شائع</span></div>
    </div>
    <p>من هنا تعدّلون الاسم، الوصف، المكونات، طريقة الاستخدام، الصورة، والأقسام. البحث في الموقع يقرأ نفس هذه البيانات.</p>
    <p>رابط اللوحة: <strong>/admin.html</strong> — لا يظهر في قائمة الزوار. بعد كل حفظ اضغطوا «حفظ على الموقع» ثم راجعوا الصفحة الرئيسية.</p>
    ${localStorage.getItem(LOCAL_KEY) ? `<p><button class="btn btn-ghost" type="button" data-restore-local>استعادة آخر تعديل من هذا الجهاز</button></p>` : ""}`;
}

function productsView() {
  const q = listQuery.trim().toLowerCase();
  const list = store.products.filter((item) => {
    const hay = `${item.name} ${item.en} ${item.desc}`.toLowerCase();
    return !q || hay.includes(q);
  });
  return `
    <div class="toolbar">
      <input data-plist-q placeholder="بحث داخل المنتجات" value="${esc(listQuery)}">
      <button class="btn btn-gold" type="button" data-add>منتج جديد</button>
    </div>
    <div class="list">
      ${list
        .map(
          (item) => `
        <article class="row" data-open="${esc(item.id)}">
          <img src="${esc(item.img)}" alt="">
          <div>
            <strong>${esc(item.name)}</strong>
            <small>${esc(item.en)} · ${esc(item.size)} · ${item.active === false ? "مخفي" : "ظاهر"}</small>
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
      <form data-editor>
        <label>الاسم بالعربية<input name="name" value="${esc(item.name)}" required></label>
        <label>الاسم بالإنجليزية<input name="en" value="${esc(item.en)}"></label>
        <label>القسم
          <select name="cat">
            ${store.categories
              .filter((cat) => cat.id !== "all")
              .map((cat) => `<option value="${esc(cat.id)}" ${cat.id === item.cat ? "selected" : ""}>${esc(cat.name)}</option>`)
              .join("")}
          </select>
        </label>
        <label>الحجم / العبوة<input name="size" value="${esc(item.size)}"></label>
        <label>رابط الصورة<input name="img" value="${esc(item.img)}"></label>
        <label>رفع صورة جديدة<input type="file" name="file" accept="image/jpeg,image/png,image/webp"></label>
        <label>وصف المنتج للزائر<textarea name="desc" rows="4">${esc(item.desc)}</textarea></label>
        <label>المكونات<textarea name="ingredients" rows="3">${esc(item.ingredients)}</textarea></label>
        <label>طريقة الاستخدام<textarea name="usage" rows="3">${esc(item.usage)}</textarea></label>
        <label>ملاحظات<textarea name="notes" rows="2">${esc(item.notes)}</textarea></label>
        <label>كلمات بحث (افصلوا بفاصلة)<input name="tags" value="${esc((item.tags || []).join("، "))}"></label>
        <label class="check"><input type="checkbox" name="featured" ${item.featured ? "checked" : ""}> منتج مميز في الرئيسية</label>
        <label class="check"><input type="checkbox" name="active" ${item.active !== false ? "checked" : ""}> ظاهر في الموقع</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <button class="btn btn-purple" type="submit">حفظ المنتج</button>
          <button class="btn btn-ghost" type="button" data-view="products">رجوع</button>
          <button class="btn btn-danger" type="button" data-delete>حذف</button>
        </div>
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
    <button class="btn btn-gold" type="button" data-add-cat>قسم جديد</button>
    <div style="margin-top:16px">
      ${store.categories
        .map(
          (cat, index) => `
        <div class="cat-item" data-cat-i="${index}">
          <label>المعرّف<input name="id" value="${esc(cat.id)}" ${cat.id === "all" ? "readonly" : ""}></label>
          <label>الاسم<input name="name" value="${esc(cat.name)}"></label>
          ${cat.id === "all" ? "" : `<button class="btn btn-danger" type="button" data-del-cat="${index}">حذف</button>`}
        </div>`
        )
        .join("")}
    </div>`;
}

function faqsView() {
  return `
    <button class="btn btn-gold" type="button" data-add-faq>سؤال جديد</button>
    <div style="margin-top:16px">
      ${store.faqs
        .map(
          (item, index) => `
        <div class="faq-item" data-faq-i="${index}">
          <label>السؤال<input name="q" value="${esc(item.q)}"></label>
          <label>الجواب<textarea name="a" rows="3">${esc(item.a)}</textarea></label>
          <button class="btn btn-danger" type="button" data-del-faq="${index}">حذف</button>
        </div>`
        )
        .join("")}
    </div>`;
}

function copyView() {
  const fields = [
    ["heroEyebrow", "سطر الهيرو الصغير"],
    ["heroTitle", "عنوان الهيرو"],
    ["heroAccent", "السطر الملوّن"],
    ["heroLead", "وصف الهيرو"],
    ["collectionsEyebrow", "سطر المجموعات"],
    ["collectionsTitle", "عنوان المجموعات"],
    ["collectionsLead", "وصف المجموعات"],
    ["featuredEyebrow", "سطر المختارات"],
    ["featuredTitle", "عنوان المختارات"],
    ["catalogEyebrow", "سطر الكتالوج"],
    ["catalogTitle", "عنوان الكتالوج"],
    ["catalogLead", "وصف الكتالوج"],
    ["aboutEyebrow", "سطر صفحة عن العلامة"],
    ["aboutTitle", "عنوان صفحة عن العلامة"],
    ["aboutQuote", "اقتباس عن العلامة"],
    ["aboutBody", "نص عن العلامة"],
    ["aboutLines", "سطور الخطوط"],
    ["footerBlurb", "نص التذييل"],
  ];
  return `
    <form data-copy>
      ${fields
        .map(
          ([key, label]) =>
            `<label>${label}<textarea name="${key}" rows="${key.includes("Lead") || key.includes("Body") || key.includes("Lines") ? 4 : 2}">${esc(store.copy[key] || "")}</textarea></label>`
        )
        .join("")}
      <button class="btn btn-purple" type="submit">حفظ النصوص</button>
    </form>`;
}

function contactView() {
  const c = store.contact;
  return `
    <form data-contact>
      <label>رقم العرض<input name="phoneDisplay" value="${esc(c.phoneDisplay)}"></label>
      <label>رقم الاتصال الدولي<input name="phoneTel" value="${esc(c.phoneTel)}"></label>
      <label>واتساب بدون +<input name="whatsapp" value="${esc(c.whatsapp)}"></label>
      <label>رابط فيسبوك<input name="facebook" value="${esc(c.facebook)}"></label>
      <button class="btn btn-purple" type="submit">حفظ التواصل</button>
    </form>`;
}

function settingsView() {
  return `
    <p>كلمة المرور تُحفظ على السيرفر فقط ولن تظهر في صفحات الزوار.</p>
    ${
      phpReady
        ? `<form data-password>
            <label>كلمة مرور جديدة (8 أحرف على الأقل)<input type="password" name="password" minlength="8" required></label>
            <button class="btn btn-purple" type="submit">تغيير كلمة المرور</button>
          </form>`
        : `<p>تغيير كلمة المرور يعمل بعد رفع الموقع على الاستضافة مع PHP.</p>`
    }
    <p>احفظوا نسخة JSON بعد كل تعديل مهم، ثم ارفعوها من «استعادة JSON» إذا اختفت التعديلات بعد نشر جديد.</p>
    <p>رابط اللوحة للموبايل والكمبيوتر: <code>/admin.html</code></p>`;
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
  app.querySelector("[data-plist-q]")?.addEventListener("input", (event) => {
    listQuery = event.currentTarget.value;
    render();
    const input = app.querySelector("[data-plist-q]");
    if (input) {
      input.focus();
      input.setSelectionRange(listQuery.length, listQuery.length);
    }
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
