import{b as z,n as E,e as F}from"./store-BBiuxmud.js";const O="priyanka-store-local",j="priyanka-admin-open-v1",r=document.querySelector("#admin-app");let T="",i=z(),d="home",L="",I="",M="",b=!1,g="",x=0;function s(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function U(t){return String(t||"product").toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"").slice(0,42)||`p-${Date.now()}`}function h(t,e="ok"){I=t,M=e,u()}async function S(t,e={}){const o={...e.headers||{}};T&&(o["X-CSRF"]=T);const v=await fetch(t,{credentials:"same-origin",...e,headers:o});if(!(v.headers.get("content-type")||"").includes("application/json"))throw new Error("تعذّر الاتصال بالسيرفر");const f=await v.json().catch(()=>({}));if(!v.ok)throw new Error(f.error||"تعذّر الاتصال بالسيرفر");return f}async function Q(){try{const t=await S("/api/auth.php");if(typeof t.setup!="boolean")throw new Error("no-php");return b=!0,T=t.csrf||"",t}catch{return b=!1,{setup:!1,authed:!0,local:!0}}}function _(){localStorage.setItem(O,JSON.stringify(i))}async function w(){if(i.updatedAt=new Date().toISOString(),_(),!b){h("حُفظت النسخة على هذا الجهاز. ارفعوا الموقع على الاستضافة لتفعيل الحفظ على السيرفر.","ok");return}try{await S("/api/store.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({store:i})}),h("تم حفظ التعديلات على الموقع.")}catch(t){h(t.message,"err")}}function W(){const t=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),e=URL.createObjectURL(t),o=document.createElement("a");o.href=e,o.download=`priyanka-store-${new Date().toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(e)}function X(t){const e=new FileReader;e.onload=async()=>{try{i=E(JSON.parse(String(e.result))),await w(),h("تمت استعادة النسخة الاحتياطية.")}catch{h("ملف النسخة غير صالح.","err")}},e.readAsText(t)}function B(t){return i.products.find(e=>e.id===t)}function p(t,e){return`<label class="field"><span>${t}</span>${e}</label>`}function Y(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${{home:"M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1z",products:"M4 7h16v12H4zm3-3h10l1 3H6z",categories:"M4 6h7v7H4zm9 0h7v7h-7zM4 15h7v5H4zm9 0h7v5h-7z",faqs:"M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm.8 13h-1.6v-1.7h1.6zm1.7-4.8c-.3.5-.7.8-1.2 1.1-.4.3-.5.5-.5 1h-1.6c0-1 .4-1.6 1-2 .5-.4.8-.7 1-1.1a1.6 1.6 0 0 0-1.5-2.4 1.8 1.8 0 0 0-1.8 1.5l-1.5-.4A3.4 3.4 0 0 1 12 6.8a3.2 3.2 0 0 1 3.3 3.3c0 .7-.3 1.3-.8 2.1z",copy:"M6 5h9v14H6zm3-2h9v14h-2V5H9z",contact:"M6.5 4h11A1.5 1.5 0 0 1 19 5.5v13l-7-3.2-7 3.2v-13A1.5 1.5 0 0 1 6.5 4z",settings:"M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5zM4 13l2 .6a6.6 6.6 0 0 0 .5 1.3L5.3 17 7 18.7l1.9-1.2a6.6 6.6 0 0 0 1.3.5L11 20h2l.6-2a6.6 6.6 0 0 0 1.3-.5L17 18.7 18.7 17l-1.2-1.9a6.6 6.6 0 0 0 .5-1.3L20 13v-2l-2-.6a6.6 6.6 0 0 0-.5-1.3L18.7 7 17 5.3l-1.9 1.2a6.6 6.6 0 0 0-1.3-.5L13 4h-2l-.6 2a6.6 6.6 0 0 0-1.3.5L7 5.3 5.3 7l1.2 1.9a6.6 6.6 0 0 0-.5 1.3L4 11z",logout:"M10 5H6v14h4m3-4 4-4-4-4m4 4H9"}[t]}"/></svg>`}function Z(t){r.innerHTML=`
    <div class="gate">
      <div class="gate-aura" aria-hidden="true"></div>
      <form class="gate-card" data-gate="${t}">
        <p class="gate-kicker">PRIYANKA · EGYPT</p>
        <img src="/images/logo.webp?v=3d3" alt="">
        <h1>${t==="setup"?"إنشاء لوحة التحكم":"دخول المشرف"}</h1>
        <span class="gold-rule" aria-hidden="true"></span>
        <p>${t==="setup"?"اختاروا كلمة مرور قوية مرة واحدة. لن تظهر في الموقع.":"من الطبيعة للبشرة — إدارة الكتالوج والنصوص."}</p>
        ${p("كلمة المرور",'<input type="password" name="password" minlength="8" required>')}
        ${t==="setup"?p("تأكيد كلمة المرور",'<input type="password" name="confirm" minlength="8" required>'):""}
        <div class="form-actions" style="margin-top:18px">
          <button class="btn btn-gold btn-wide" type="submit">${t==="setup"?"حفظ ودخول":"دخول اللوحة"}</button>
        </div>
        <p class="toast ${M}" style="margin-top:12px;text-align:center">${s(I)}</p>
      </form>
    </div>`,r.querySelector("form").addEventListener("submit",async e=>{e.preventDefault();const o=e.currentTarget,v=o.password.value;if(t==="setup"&&v!==o.confirm.value){h("كلمتا المرور غير متطابقتين.","err");return}try{T=(await S("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:t==="setup"?"setup":"login",password:v})})).csrf||T,await G()}catch(m){h(m.message,"err")}})}function $(t,e,o){return`<button type="button" data-view="${t}" class="side-link${d===t||d==="edit"&&t==="products"?" is-on":""}">${Y(o)}<span>${e}</span></button>`}function tt(){return`
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
    </div>`}function K(){if(sessionStorage.getItem(j)!=="1"){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem(j,"1");return}document.querySelector("[data-admin-splash]")||(document.body.insertAdjacentHTML("beforeend",tt()),ut())}}function et(t){return`
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
          ${$("home","نظرة عامة","home")}
          ${$("products","المنتجات","products")}
          ${$("categories","الأقسام","categories")}
          ${$("faqs","الأسئلة","faqs")}
          ${$("copy","نصوص الموقع","copy")}
          ${$("contact","التواصل","contact")}
          ${$("settings","الإعدادات","settings")}
          <button type="button" class="side-link logout" data-logout>${Y("logout")}<span>خروج</span></button>
        </nav>
      </aside>
      <main class="main${d==="home"?" is-overview":""}">
        <div class="topbar">
          <div>
            <h1>${at()}</h1>
            <p class="kicker toast ${M}">${s(I||(b?"الحفظ يصل إلى الموقع مباشرة بعد «حفظ على الموقع».":"وضع محلي: احفظوا نسخة احتياطية JSON."))}</p>
          </div>
          <div class="top-actions">
            <label class="btn btn-ghost">استعادة JSON<input type="file" data-restore accept="application/json" hidden></label>
            <button class="btn btn-ghost" type="button" data-backup>نسخة احتياطية</button>
            <button class="btn btn-purple" type="button" data-save>حفظ على الموقع</button>
          </div>
        </div>
        ${t}
      </main>
    </div>`}function at(){return{home:"نظرة عامة",products:"المنتجات",edit:"تفاصيل المنتج",categories:"الأقسام",faqs:"الأسئلة الشائعة",copy:"نصوص الموقع",contact:"بيانات التواصل",settings:"الإعدادات"}[d]||"لوحة التحكم"}function st(){const t=i.products.filter(c=>c.active!==!1).length,e=i.products.filter(c=>c.featured).slice(0,6),o=(e.length?e:i.products).slice(0,3),v=o.length?o:[{img:"/images/logo.webp?v=3d3",name:"بريانكا للتجميل"}],m=i.categories.filter(c=>c.id!=="all").length,f=g.trim().toLowerCase(),q=f?i.products.filter(c=>`${c.name} ${c.en} ${c.desc}`.toLowerCase().includes(f)).slice(0,6):[];return`
    <section class="overview-hero">
      <div class="overview-hero-glow" aria-hidden="true"></div>
      <div class="overview-copy">
        <p class="eyebrow">PRIYANKA · CONTROL ROOM</p>
        <h2>من الطبيعة للبشرة</h2>
        <span class="gold-rule" aria-hidden="true"></span>
        <p class="lead">افتتاحية العلامة ثم غرفة التحكم: عدّلوا الاسم والصورة والمكونات، ثم احفظوا على الموقع. البحث يقرأ نفس البيانات التي يراها الزائر.</p>
        <div class="overview-search">
          <input data-home-q type="search" placeholder="ابحثوا عن منتج للتعديل: بطيخ، صابون، خميرة..." value="${s(g)}">
        </div>
        <div class="hero-actions">
          <button class="btn btn-gold" type="button" data-view="products">فتح الكتالوج</button>
          <button class="btn btn-ghost-light" type="button" data-add>منتج جديد</button>
          <button class="btn btn-ghost-light" type="button" data-replay-splash>إعادة الافتتاحية</button>
        </div>
        <p class="live-pill">${b?"متصل بالاستضافة":"وضع محلي على هذا الجهاز"}</p>
      </div>
      <div class="overview-mosaic" aria-hidden="true">
        ${v.map((c,A)=>`<figure class="mosaic-cell${A===0?" is-tall":""}"><img src="${s(c.img)}" alt=""><figcaption>${s(c.name)}</figcaption></figure>`).join("")}
      </div>
    </section>
    ${f?`<section class="panel search-panel">
            <div class="panel-head"><div><h2>نتائج البحث</h2><p>${q.length} منتج مطابق</p></div></div>
            <div class="list">${q.length?q.map(c=>`
              <article class="row" data-open="${s(c.id)}">
                <img src="${s(c.img)}" alt="">
                <div><strong>${s(c.name)}</strong><small>${s(c.en)}</small></div>
                <button class="btn btn-ghost" type="button">تعديل</button>
              </article>`).join(""):'<p class="help">لا توجد نتائج. جرّبوا اسماً أقصر.</p>'}</div>
          </section>`:""}
    <div class="grid-cards four">
      <div class="stat"><span class="stat-label">الكتالوج</span><b>${i.products.length}</b><span>منتج مسجّل</span></div>
      <div class="stat"><span class="stat-label">ظاهر</span><b>${t}</b><span>يراه الزوار</span></div>
      <div class="stat"><span class="stat-label">الأقسام</span><b>${m}</b><span>مجموعة عناية</span></div>
      <div class="stat"><span class="stat-label">الأسئلة</span><b>${i.faqs.length}</b><span>في صفحة FAQ</span></div>
    </div>
    <div class="quick-grid">
      <button class="quick" type="button" data-view="products"><strong>المنتجات</strong><span>الاسم، الصورة، المكونات والاستخدام</span></button>
      <button class="quick" type="button" data-view="copy"><strong>نصوص الموقع</strong><span>الهيرو، الكتالوج، عن العلامة</span></button>
      <button class="quick" type="button" data-view="faqs"><strong>الأسئلة</strong><span>عدّلوا الإجابات كما يراها الزائر</span></button>
      <button class="quick" type="button" data-view="contact"><strong>التواصل</strong><span>واتساب، الهاتف، فيسبوك</span></button>
    </div>
    ${e.length?`<section class="panel">
            <div class="panel-head"><div><h2>مختارات الرئيسية</h2><p>اضغطوا البطاقة لتعديل التفاصيل</p></div><button class="btn btn-ghost" type="button" data-view="products">كل المنتجات</button></div>
            <div class="featured-strip">
              ${e.map(c=>`
                <button class="featured-card" type="button" data-open="${s(c.id)}">
                  <img src="${s(c.img)}" alt="">
                  <strong>${s(c.name)}</strong>
                  <small>${s(c.size||c.en)}</small>
                </button>`).join("")}
            </div>
          </section>`:""}
    ${localStorage.getItem(O)?'<p style="margin-top:16px"><button class="btn btn-ghost" type="button" data-restore-local>استعادة آخر تعديل من هذا الجهاز</button></p>':""}`}function nt(){const t=g.trim().toLowerCase(),e=i.products.filter(o=>{const v=`${o.name} ${o.en} ${o.desc}`.toLowerCase();return!t||v.includes(t)});return`
    <div class="toolbar">
      <input data-plist-q placeholder="بحث بالاسم أو الوصف..." value="${s(g)}">
      <button class="btn btn-gold" type="button" data-add>منتج جديد</button>
    </div>
    <div class="list">
      ${e.map(o=>`
        <article class="row" data-open="${s(o.id)}">
          <img src="${s(o.img)}" alt="">
          <div>
            <strong>${s(o.name)} ${o.featured?'<span class="pill">مميز</span>':""} ${o.active===!1?'<span class="pill off">مخفي</span>':""}</strong>
            <small>${s(o.en)} · ${s(o.size||"بدون حجم")}</small>
          </div>
          <button class="btn btn-ghost" type="button">تعديل</button>
        </article>`).join("")}
    </div>`}function it(){const t=F(B(L)||{});return`
    <div class="editor">
      <form class="editor-form" data-editor>
        <section class="panel">
          <div class="panel-head"><div><h2>بيانات المنتج</h2><p>كما تظهر للزائر في البطاقة والبحث</p></div></div>
          <div class="fields-grid two">
            ${p("الاسم بالعربية",`<input name="name" value="${s(t.name)}" required>`)}
            ${p("الاسم بالإنجليزية",`<input name="en" value="${s(t.en)}">`)}
            ${p("القسم",`<select name="cat">${i.categories.filter(e=>e.id!=="all").map(e=>`<option value="${s(e.id)}" ${e.id===t.cat?"selected":""}>${s(e.name)}</option>`).join("")}</select>`)}
            ${p("الحجم / العبوة",`<input name="size" value="${s(t.size)}">`)}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h2>الصورة</h2><p>JPG أو PNG أو WebP حتى 4 ميجا</p></div></div>
          <div class="fields-grid two">
            ${p("رابط الصورة",`<input name="img" value="${s(t.img)}">`)}
            ${p("رفع صورة جديدة",'<input type="file" name="file" accept="image/jpeg,image/png,image/webp">')}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h2>التفاصيل</h2><p>تظهر في نافذة المنتج على الموقع</p></div></div>
          <div class="fields-grid">
            ${p("وصف المنتج للزائر",`<textarea name="desc" rows="4">${s(t.desc)}</textarea>`)}
            ${p("المكونات",`<textarea name="ingredients" rows="3">${s(t.ingredients)}</textarea>`)}
            ${p("طريقة الاستخدام",`<textarea name="usage" rows="3">${s(t.usage)}</textarea>`)}
            ${p("ملاحظات",`<textarea name="notes" rows="2">${s(t.notes)}</textarea>`)}
            ${p("كلمات بحث (افصلوا بفاصلة)",`<input name="tags" value="${s((t.tags||[]).join("، "))}">`)}
          </div>
        </section>
        <section class="panel">
          <div class="checks">
            <label class="check"><input type="checkbox" name="featured" ${t.featured?"checked":""}> منتج مميز في الرئيسية</label>
            <label class="check"><input type="checkbox" name="active" ${t.active!==!1?"checked":""}> ظاهر في الموقع</label>
          </div>
          <div class="form-actions" style="margin-top:14px">
            <button class="btn btn-purple" type="submit">حفظ المنتج</button>
            <button class="btn btn-ghost" type="button" data-view="products">رجوع للكتالوج</button>
            <button class="btn btn-danger" type="button" data-delete>حذف المنتج</button>
          </div>
        </section>
      </form>
      <aside class="preview">
        <img src="${s(t.img)}" alt="">
        <p class="en">${s(t.en)}</p>
        <h2>${s(t.name)}</h2>
        <p>${s(t.size)}</p>
        <p>${s(t.desc)}</p>
      </aside>
    </div>`}function ot(){return`
    <div class="toolbar">
      <p class="help" style="flex:1;margin:0">المعرّف بالإنجليزية للروابط، والاسم بالعربية كما يظهر للزائر.</p>
      <button class="btn btn-gold" type="button" data-add-cat>قسم جديد</button>
    </div>
    <div class="stack">
      ${i.categories.map((t,e)=>`
        <article class="panel cat-item" data-cat-i="${e}">
          <div class="fields-grid two">
            ${p("المعرّف",`<input name="id" value="${s(t.id)}" ${t.id==="all"?"readonly":""}>`)}
            ${p("الاسم الظاهر",`<input name="name" value="${s(t.name)}">`)}
          </div>
          ${t.id==="all"?"":`<div class="item-actions"><button class="btn btn-danger" type="button" data-del-cat="${e}">حذف القسم</button></div>`}
        </article>`).join("")}
    </div>`}function lt(){return`
    <div class="toolbar">
      <p class="help" style="flex:1;margin:0">كل بطاقة سؤال واحد. احفظوا بعد التعديل من الزر أعلى الصفحة.</p>
      <button class="btn btn-gold" type="button" data-add-faq>سؤال جديد</button>
    </div>
    <div class="stack">
      ${i.faqs.map((t,e)=>`
        <article class="panel faq-item" data-faq-i="${e}">
          <div class="fields-grid">
            ${p("السؤال",`<input name="q" value="${s(t.q)}">`)}
            ${p("الجواب",`<textarea name="a" rows="4">${s(t.a)}</textarea>`)}
          </div>
          <div class="item-actions"><button class="btn btn-danger" type="button" data-del-faq="${e}">حذف السؤال</button></div>
        </article>`).join("")}
    </div>`}function rt(){return`
    <form class="copy-form" data-copy>
      ${[{title:"الصفحة الرئيسية · الهيرو",hint:"العنوان الكبير أعلى الموقع",fields:[["heroEyebrow","السطر الصغير",2],["heroTitle","العنوان",2],["heroAccent","السطر الملوّن",2],["heroLead","الوصف",4]]},{title:"المجموعات والمختارات",hint:"أقسام خطوط العناية والمنتجات المميزة",fields:[["collectionsEyebrow","سطر المجموعات",2],["collectionsTitle","عنوان المجموعات",2],["collectionsLead","وصف المجموعات",3],["featuredEyebrow","سطر المختارات",2],["featuredTitle","عنوان المختارات",2]]},{title:"الكتالوج",hint:"صفحة المنتجات",fields:[["catalogEyebrow","السطر الصغير",2],["catalogTitle","العنوان",2],["catalogLead","الوصف",3]]},{title:"عن العلامة والتذييل",hint:"صفحة القصة ونص أسفل الموقع",fields:[["aboutEyebrow","سطر صفحة عن العلامة",2],["aboutTitle","عنوان الصفحة",2],["aboutQuote","الاقتباس",2],["aboutBody","نص عن العلامة",5],["aboutLines","سطور الخطوط",4],["footerBlurb","نص التذييل",3]]}].map(e=>`
        <section class="panel">
          <div class="panel-head"><div><h2>${e.title}</h2><p>${e.hint}</p></div></div>
          <div class="fields-grid">${e.fields.map(([o,v,m])=>p(v,`<textarea name="${o}" rows="${m}">${s(i.copy[o]||"")}</textarea>`)).join("")}</div>
        </section>`).join("")}
      <div class="form-actions">
        <button class="btn btn-purple" type="submit">حفظ النصوص</button>
      </div>
    </form>`}function ct(){const t=i.contact;return`
    <form class="contact-form" data-contact>
      <section class="panel">
        <div class="panel-head"><div><h2>أرقام وروابط التواصل</h2><p>تظهر في الهيدر، التذييل، وصفحة الطلب</p></div></div>
        <div class="fields-grid two">
          ${p("رقم العرض للزائر",`<input name="phoneDisplay" value="${s(t.phoneDisplay)}">`)}
          ${p("رقم الاتصال الدولي",`<input name="phoneTel" value="${s(t.phoneTel)}" dir="ltr">`)}
          ${p("واتساب بدون +",`<input name="whatsapp" value="${s(t.whatsapp)}" dir="ltr">`)}
          ${p("رابط فيسبوك",`<input name="facebook" value="${s(t.facebook)}" dir="ltr">`)}
        </div>
        <div class="form-actions" style="margin-top:16px">
          <button class="btn btn-purple" type="submit">حفظ بيانات التواصل</button>
        </div>
      </section>
    </form>`}function dt(){return`
    <div class="settings-card">
      <section class="panel">
        <div class="panel-head"><div><h2>كلمة المرور</h2><p>تُحفظ على السيرفر فقط ولن تظهر في صفحات الزوار.</p></div></div>
        ${b?`<form data-password class="fields-grid" style="max-width:420px">
                ${p("كلمة مرور جديدة (8 أحرف على الأقل)",'<input type="password" name="password" minlength="8" required>')}
                <div class="form-actions"><button class="btn btn-purple" type="submit">تغيير كلمة المرور</button></div>
              </form>`:'<p class="help">تغيير كلمة المرور يعمل بعد رفع الموقع على الاستضافة مع PHP.</p>'}
      </section>
      <section class="panel">
        <div class="panel-head"><div><h2>النسخ الاحتياطي</h2><p>احفظوا JSON بعد كل تعديل مهم.</p></div></div>
        <p class="help">إذا اختفت التعديلات بعد نشر جديد، ارفعوا الملف من «استعادة JSON» أعلى الصفحة ثم احفظوا على الموقع.</p>
        <p class="help">رابط اللوحة: <strong>/admin.html</strong></p>
      </section>
    </div>`}function u(){if(d==="gate-setup"||d==="gate-login"){Z(d==="gate-setup"?"setup":"login");return}const t=d==="home"?st():d==="products"?nt():d==="edit"?it():d==="categories"?ot():d==="faqs"?lt():d==="copy"?rt():d==="settings"?dt():ct();r.innerHTML=et(t),pt(),K()}function pt(){var e,o,v,m,f,q,c,A,R,D,P,C,H,J,V;r.querySelectorAll("[data-view]").forEach(a=>{a.addEventListener("click",()=>{d=a.dataset.view,L="",u()})}),(e=r.querySelector("[data-save]"))==null||e.addEventListener("click",w),(o=r.querySelector("[data-backup]"))==null||o.addEventListener("click",W),(v=r.querySelector("[data-restore]"))==null||v.addEventListener("change",a=>{var l;const n=(l=a.currentTarget.files)==null?void 0:l[0];n&&X(n)}),(m=r.querySelector("[data-restore-local]"))==null||m.addEventListener("click",async()=>{const a=localStorage.getItem(O);a&&(i=E(JSON.parse(a)),await w(),h("تمت الاستعادة من هذا الجهاز."))}),(f=r.querySelector("[data-password]"))==null||f.addEventListener("submit",async a=>{a.preventDefault();try{await S("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"password",password:a.currentTarget.password.value})}),h("تم تغيير كلمة المرور.")}catch(n){h(n.message,"err")}}),(q=r.querySelector("[data-logout]"))==null||q.addEventListener("click",async()=>{try{await S("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout"})})}catch{}d=b?"gate-login":"home",u()}),(c=r.querySelector("[data-home-q]"))==null||c.addEventListener("input",a=>{g=a.currentTarget.value,u();const n=r.querySelector("[data-home-q]");n&&(n.focus(),n.setSelectionRange(g.length,g.length))}),(A=r.querySelector("[data-plist-q]"))==null||A.addEventListener("input",a=>{g=a.currentTarget.value,u();const n=r.querySelector("[data-plist-q]");n&&(n.focus(),n.setSelectionRange(g.length,g.length))}),(R=r.querySelector("[data-replay-splash]"))==null||R.addEventListener("click",()=>{var a;window.clearTimeout(x),sessionStorage.removeItem(j),document.documentElement.classList.remove("admin-splash-lock"),(a=document.querySelector("[data-admin-splash]"))==null||a.remove(),K()}),(D=r.querySelector("[data-add]"))==null||D.addEventListener("click",()=>{var n;const a=F({id:`p-${Date.now()}`,cat:((n=i.categories.find(l=>l.id!=="all"))==null?void 0:n.id)||"body",name:"منتج جديد",en:"New product",size:"",img:"/images/logo.jpg",desc:""});i.products.unshift(a),L=a.id,d="edit",u()}),r.querySelectorAll("[data-open]").forEach(a=>{a.addEventListener("click",()=>{L=a.dataset.open,d="edit",u()})});const t=r.querySelector("[data-editor]");t&&(t.addEventListener("submit",async a=>{a.preventDefault();const n=a.currentTarget,l=B(L);if(!l)return;l.name=n.name.value.trim(),l.en=n.en.value.trim(),l.cat=n.cat.value,l.size=n.size.value.trim(),l.img=n.img.value.trim(),l.desc=n.desc.value.trim(),l.ingredients=n.ingredients.value.trim(),l.usage=n.usage.value.trim(),l.notes=n.notes.value.trim(),l.tags=n.tags.value.split(/[،,]/).map(y=>y.trim()).filter(Boolean),l.featured=n.featured.checked,l.active=n.active.checked,l.id||(l.id=U(l.en||l.name));const k=n.file.files[0];if(k&&b){const y=new FormData;y.append("file",k);try{const N=await S("/api/upload.php",{method:"POST",body:y});N.url&&(l.img=N.url)}catch(N){h(N.message,"err");return}}else k&&!b&&h("رفع الصور يعمل على الاستضافة. الصقوا رابط الصورة حالياً.","err");await w(),d="edit",u()}),(P=r.querySelector("[data-delete]"))==null||P.addEventListener("click",async()=>{confirm("حذف هذا المنتج من الكتالوج؟")&&(i.products=i.products.filter(a=>a.id!==L),d="products",await w(),u())})),(C=r.querySelector("[data-add-cat]"))==null||C.addEventListener("click",()=>{i.categories.push({id:`cat-${Date.now()}`,name:"قسم جديد"}),u()}),r.querySelectorAll("[data-cat-i]").forEach(a=>{const n=Number(a.dataset.catI);a.querySelectorAll("input").forEach(l=>{l.addEventListener("change",()=>{i.categories[n][l.name]=l.value.trim()})})}),r.querySelectorAll("[data-del-cat]").forEach(a=>{a.addEventListener("click",()=>{i.categories.splice(Number(a.dataset.delCat),1),u()})}),(H=r.querySelector("[data-add-faq]"))==null||H.addEventListener("click",()=>{i.faqs.push({q:"سؤال جديد؟",a:""}),u()}),r.querySelectorAll("[data-faq-i]").forEach(a=>{var l,k;const n=Number(a.dataset.faqI);(l=a.querySelector("input"))==null||l.addEventListener("change",y=>{i.faqs[n].q=y.currentTarget.value}),(k=a.querySelector("textarea"))==null||k.addEventListener("change",y=>{i.faqs[n].a=y.currentTarget.value})}),r.querySelectorAll("[data-del-faq]").forEach(a=>{a.addEventListener("click",()=>{i.faqs.splice(Number(a.dataset.delFaq),1),u()})}),(J=r.querySelector("[data-copy]"))==null||J.addEventListener("submit",async a=>{a.preventDefault(),[...a.currentTarget.elements].forEach(l=>{l.name&&(i.copy[l.name]=l.value)}),await w()}),(V=r.querySelector("[data-contact]"))==null||V.addEventListener("submit",async a=>{a.preventDefault();const n=a.currentTarget;i.contact.phoneDisplay=n.phoneDisplay.value.trim(),i.contact.phoneTel=n.phoneTel.value.trim(),i.contact.whatsapp=n.whatsapp.value.replace(/\D/g,""),i.contact.facebook=n.facebook.value.trim(),await w()})}function ut(){var o;const t=document.querySelector("[data-admin-splash]");if(!t)return;document.documentElement.classList.add("admin-splash-lock");const e=()=>{t.classList.contains("is-out")||(t.classList.add("is-out"),sessionStorage.setItem(j,"1"),document.documentElement.classList.remove("admin-splash-lock"),window.setTimeout(()=>t.remove(),780))};(o=t.querySelector("[data-splash-skip]"))==null||o.addEventListener("click",e,{once:!0}),window.clearTimeout(x),x=window.setTimeout(e,3200)}async function G(){try{const t=await S("/api/store.php");t.store&&(i=E(t.store))}catch{const t=localStorage.getItem(O);i=E(t?JSON.parse(t):z())}d="home",u()}async function vt(){const t=await Q();if(!b){i=E(JSON.parse(localStorage.getItem(O)||"null")||z()),d="home",u();return}if(t.setup){d="gate-setup",u();return}if(!t.authed){d="gate-login",u();return}await G()}vt();
