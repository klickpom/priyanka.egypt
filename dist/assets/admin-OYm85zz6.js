import{b as O,n as L,e as C}from"./store-BBiuxmud.js";const E="priyanka-store-local",c=document.querySelector("#admin-app");let k="",n=O(),d="home",w="",x="",z="",f=!1,q="";function o(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function B(t){return String(t||"product").toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"").slice(0,42)||`p-${Date.now()}`}function v(t,e="ok"){x=t,z=e,p()}async function y(t,e={}){const r={...e.headers||{}};k&&(r["X-CSRF"]=k);const u=await fetch(t,{credentials:"same-origin",...e,headers:r});if(!(u.headers.get("content-type")||"").includes("application/json"))throw new Error("تعذّر الاتصال بالسيرفر");const S=await u.json().catch(()=>({}));if(!u.ok)throw new Error(S.error||"تعذّر الاتصال بالسيرفر");return S}async function F(){try{const t=await y("/api/auth.php");if(typeof t.setup!="boolean")throw new Error("no-php");return f=!0,k=t.csrf||"",t}catch{return f=!1,{setup:!1,authed:!0,local:!0}}}function U(){localStorage.setItem(E,JSON.stringify(n))}async function b(){if(n.updatedAt=new Date().toISOString(),U(),!f){v("حُفظت النسخة على هذا الجهاز. ارفعوا الموقع على الاستضافة لتفعيل الحفظ على السيرفر.","ok");return}try{await y("/api/store.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({store:n})}),v("تم حفظ التعديلات على الموقع.")}catch(t){v(t.message,"err")}}function G(){const t=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),e=URL.createObjectURL(t),r=document.createElement("a");r.href=e,r.download=`priyanka-store-${new Date().toISOString().slice(0,10)}.json`,r.click(),URL.revokeObjectURL(e)}function Q(t){const e=new FileReader;e.onload=async()=>{try{n=L(JSON.parse(String(e.result))),await b(),v("تمت استعادة النسخة الاحتياطية.")}catch{v("ملف النسخة غير صالح.","err")}},e.readAsText(t)}function P(t){return n.products.find(e=>e.id===t)}function l(t,e){return`<label class="field"><span>${t}</span>${e}</label>`}function V(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${{home:"M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1z",products:"M4 7h16v12H4zm3-3h10l1 3H6z",categories:"M4 6h7v7H4zm9 0h7v7h-7zM4 15h7v5H4zm9 0h7v5h-7z",faqs:"M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm.8 13h-1.6v-1.7h1.6zm1.7-4.8c-.3.5-.7.8-1.2 1.1-.4.3-.5.5-.5 1h-1.6c0-1 .4-1.6 1-2 .5-.4.8-.7 1-1.1a1.6 1.6 0 0 0-1.5-2.4 1.8 1.8 0 0 0-1.8 1.5l-1.5-.4A3.4 3.4 0 0 1 12 6.8a3.2 3.2 0 0 1 3.3 3.3c0 .7-.3 1.3-.8 2.1z",copy:"M6 5h9v14H6zm3-2h9v14h-2V5H9z",contact:"M6.5 4h11A1.5 1.5 0 0 1 19 5.5v13l-7-3.2-7 3.2v-13A1.5 1.5 0 0 1 6.5 4z",settings:"M12 8.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5zM4 13l2 .6a6.6 6.6 0 0 0 .5 1.3L5.3 17 7 18.7l1.9-1.2a6.6 6.6 0 0 0 1.3.5L11 20h2l.6-2a6.6 6.6 0 0 0 1.3-.5L17 18.7 18.7 17l-1.2-1.9a6.6 6.6 0 0 0 .5-1.3L20 13v-2l-2-.6a6.6 6.6 0 0 0-.5-1.3L18.7 7 17 5.3l-1.9 1.2a6.6 6.6 0 0 0-1.3-.5L13 4h-2l-.6 2a6.6 6.6 0 0 0-1.3.5L7 5.3 5.3 7l1.2 1.9a6.6 6.6 0 0 0-.5 1.3L4 11z",logout:"M10 5H6v14h4m3-4 4-4-4-4m4 4H9"}[t]}"/></svg>`}function K(t){c.innerHTML=`
    <div class="gate">
      <form class="gate-card" data-gate="${t}">
        <img src="/images/logo.webp?v=3d3" alt="">
        <h1>${t==="setup"?"إنشاء لوحة التحكم":"دخول المشرف"}</h1>
        <p>${t==="setup"?"اختاروا كلمة مرور قوية مرة واحدة. لن تظهر في الموقع.":"عدّلوا المنتجات والنصوص ثم احفظوا."}</p>
        ${l("كلمة المرور",'<input type="password" name="password" minlength="8" required>')}
        ${t==="setup"?l("تأكيد كلمة المرور",'<input type="password" name="confirm" minlength="8" required>'):""}
        <div class="form-actions" style="margin-top:18px">
          <button class="btn btn-gold btn-wide" type="submit">${t==="setup"?"حفظ ودخول":"دخول"}</button>
        </div>
        <p class="toast ${z}" style="margin-top:12px;text-align:center">${o(x)}</p>
      </form>
    </div>`,c.querySelector("form").addEventListener("submit",async e=>{e.preventDefault();const r=e.currentTarget,u=r.password.value;if(t==="setup"&&u!==r.confirm.value){v("كلمتا المرور غير متطابقتين.","err");return}try{k=(await y("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:t==="setup"?"setup":"login",password:u})})).csrf||k,await R()}catch(h){v(h.message,"err")}})}function g(t,e,r){return`<button type="button" data-view="${t}" class="side-link${d===t||d==="edit"&&t==="products"?" is-on":""}">${V(r)}<span>${e}</span></button>`}function W(t){return`
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
          ${g("home","نظرة عامة","home")}
          ${g("products","المنتجات","products")}
          ${g("categories","الأقسام","categories")}
          ${g("faqs","الأسئلة","faqs")}
          ${g("copy","نصوص الموقع","copy")}
          ${g("contact","التواصل","contact")}
          ${g("settings","الإعدادات","settings")}
          <button type="button" class="side-link logout" data-logout>${V("logout")}<span>خروج</span></button>
        </nav>
      </aside>
      <main class="main">
        <div class="topbar">
          <div>
            <h1>${X()}</h1>
            <p class="kicker toast ${z}">${o(x||(f?"الحفظ يصل إلى الموقع مباشرة بعد «حفظ على الموقع».":"وضع محلي: احفظوا نسخة احتياطية JSON."))}</p>
          </div>
          <div class="top-actions">
            <label class="btn btn-ghost">استعادة JSON<input type="file" data-restore accept="application/json" hidden></label>
            <button class="btn btn-ghost" type="button" data-backup>نسخة احتياطية</button>
            <button class="btn btn-purple" type="button" data-save>حفظ على الموقع</button>
          </div>
        </div>
        ${t}
      </main>
    </div>`}function X(){return{home:"نظرة عامة",products:"المنتجات",edit:"تفاصيل المنتج",categories:"الأقسام",faqs:"الأسئلة الشائعة",copy:"نصوص الموقع",contact:"بيانات التواصل",settings:"الإعدادات"}[d]||"لوحة التحكم"}function Y(){const t=n.products.filter(e=>e.active!==!1).length;return`
    <div class="grid-cards">
      <div class="stat"><b>${n.products.length}</b><span>منتج في الكتالوج</span></div>
      <div class="stat"><b>${t}</b><span>ظاهر للزوار</span></div>
      <div class="stat"><b>${n.faqs.length}</b><span>سؤال شائع</span></div>
    </div>
    <div class="home-steps">
      <article class="panel step">
        <b>1. عدّلوا المنتج</b>
        <p class="help">الاسم، الصورة، المكونات، طريقة الاستخدام، وكلمات البحث. البحث في الموقع يقرأ نفس هذه البيانات.</p>
      </article>
      <article class="panel step">
        <b>2. احفظوا على الموقع</b>
        <p class="help">بعد التعديل اضغطوا «حفظ على الموقع»، ثم خذوا نسخة JSON احتياطية. اللوحة لا تظهر في قائمة الزوار.</p>
      </article>
    </div>
    ${localStorage.getItem(E)?'<p style="margin-top:16px"><button class="btn btn-ghost" type="button" data-restore-local>استعادة آخر تعديل من هذا الجهاز</button></p>':""}`}function _(){const t=q.trim().toLowerCase(),e=n.products.filter(r=>{const u=`${r.name} ${r.en} ${r.desc}`.toLowerCase();return!t||u.includes(t)});return`
    <div class="toolbar">
      <input data-plist-q placeholder="بحث بالاسم أو الوصف..." value="${o(q)}">
      <button class="btn btn-gold" type="button" data-add>منتج جديد</button>
    </div>
    <div class="list">
      ${e.map(r=>`
        <article class="row" data-open="${o(r.id)}">
          <img src="${o(r.img)}" alt="">
          <div>
            <strong>${o(r.name)} ${r.featured?'<span class="pill">مميز</span>':""} ${r.active===!1?'<span class="pill off">مخفي</span>':""}</strong>
            <small>${o(r.en)} · ${o(r.size||"بدون حجم")}</small>
          </div>
          <button class="btn btn-ghost" type="button">تعديل</button>
        </article>`).join("")}
    </div>`}function Z(){const t=C(P(w)||{});return`
    <div class="editor">
      <form class="editor-form" data-editor>
        <section class="panel">
          <div class="panel-head"><div><h2>بيانات المنتج</h2><p>كما تظهر للزائر في البطاقة والبحث</p></div></div>
          <div class="fields-grid two">
            ${l("الاسم بالعربية",`<input name="name" value="${o(t.name)}" required>`)}
            ${l("الاسم بالإنجليزية",`<input name="en" value="${o(t.en)}">`)}
            ${l("القسم",`<select name="cat">${n.categories.filter(e=>e.id!=="all").map(e=>`<option value="${o(e.id)}" ${e.id===t.cat?"selected":""}>${o(e.name)}</option>`).join("")}</select>`)}
            ${l("الحجم / العبوة",`<input name="size" value="${o(t.size)}">`)}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h2>الصورة</h2><p>JPG أو PNG أو WebP حتى 4 ميجا</p></div></div>
          <div class="fields-grid two">
            ${l("رابط الصورة",`<input name="img" value="${o(t.img)}">`)}
            ${l("رفع صورة جديدة",'<input type="file" name="file" accept="image/jpeg,image/png,image/webp">')}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div><h2>التفاصيل</h2><p>تظهر في نافذة المنتج على الموقع</p></div></div>
          <div class="fields-grid">
            ${l("وصف المنتج للزائر",`<textarea name="desc" rows="4">${o(t.desc)}</textarea>`)}
            ${l("المكونات",`<textarea name="ingredients" rows="3">${o(t.ingredients)}</textarea>`)}
            ${l("طريقة الاستخدام",`<textarea name="usage" rows="3">${o(t.usage)}</textarea>`)}
            ${l("ملاحظات",`<textarea name="notes" rows="2">${o(t.notes)}</textarea>`)}
            ${l("كلمات بحث (افصلوا بفاصلة)",`<input name="tags" value="${o((t.tags||[]).join("، "))}">`)}
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
        <img src="${o(t.img)}" alt="">
        <p class="en">${o(t.en)}</p>
        <h2>${o(t.name)}</h2>
        <p>${o(t.size)}</p>
        <p>${o(t.desc)}</p>
      </aside>
    </div>`}function tt(){return`
    <div class="toolbar">
      <p class="help" style="flex:1;margin:0">المعرّف بالإنجليزية للروابط، والاسم بالعربية كما يظهر للزائر.</p>
      <button class="btn btn-gold" type="button" data-add-cat>قسم جديد</button>
    </div>
    <div class="stack">
      ${n.categories.map((t,e)=>`
        <article class="panel cat-item" data-cat-i="${e}">
          <div class="fields-grid two">
            ${l("المعرّف",`<input name="id" value="${o(t.id)}" ${t.id==="all"?"readonly":""}>`)}
            ${l("الاسم الظاهر",`<input name="name" value="${o(t.name)}">`)}
          </div>
          ${t.id==="all"?"":`<div class="item-actions"><button class="btn btn-danger" type="button" data-del-cat="${e}">حذف القسم</button></div>`}
        </article>`).join("")}
    </div>`}function et(){return`
    <div class="toolbar">
      <p class="help" style="flex:1;margin:0">كل بطاقة سؤال واحد. احفظوا بعد التعديل من الزر أعلى الصفحة.</p>
      <button class="btn btn-gold" type="button" data-add-faq>سؤال جديد</button>
    </div>
    <div class="stack">
      ${n.faqs.map((t,e)=>`
        <article class="panel faq-item" data-faq-i="${e}">
          <div class="fields-grid">
            ${l("السؤال",`<input name="q" value="${o(t.q)}">`)}
            ${l("الجواب",`<textarea name="a" rows="4">${o(t.a)}</textarea>`)}
          </div>
          <div class="item-actions"><button class="btn btn-danger" type="button" data-del-faq="${e}">حذف السؤال</button></div>
        </article>`).join("")}
    </div>`}function at(){return`
    <form class="copy-form" data-copy>
      ${[{title:"الصفحة الرئيسية · الهيرو",hint:"العنوان الكبير أعلى الموقع",fields:[["heroEyebrow","السطر الصغير",2],["heroTitle","العنوان",2],["heroAccent","السطر الملوّن",2],["heroLead","الوصف",4]]},{title:"المجموعات والمختارات",hint:"أقسام خطوط العناية والمنتجات المميزة",fields:[["collectionsEyebrow","سطر المجموعات",2],["collectionsTitle","عنوان المجموعات",2],["collectionsLead","وصف المجموعات",3],["featuredEyebrow","سطر المختارات",2],["featuredTitle","عنوان المختارات",2]]},{title:"الكتالوج",hint:"صفحة المنتجات",fields:[["catalogEyebrow","السطر الصغير",2],["catalogTitle","العنوان",2],["catalogLead","الوصف",3]]},{title:"عن العلامة والتذييل",hint:"صفحة القصة ونص أسفل الموقع",fields:[["aboutEyebrow","سطر صفحة عن العلامة",2],["aboutTitle","عنوان الصفحة",2],["aboutQuote","الاقتباس",2],["aboutBody","نص عن العلامة",5],["aboutLines","سطور الخطوط",4],["footerBlurb","نص التذييل",3]]}].map(e=>`
        <section class="panel">
          <div class="panel-head"><div><h2>${e.title}</h2><p>${e.hint}</p></div></div>
          <div class="fields-grid">${e.fields.map(([r,u,h])=>l(u,`<textarea name="${r}" rows="${h}">${o(n.copy[r]||"")}</textarea>`)).join("")}</div>
        </section>`).join("")}
      <div class="form-actions">
        <button class="btn btn-purple" type="submit">حفظ النصوص</button>
      </div>
    </form>`}function st(){const t=n.contact;return`
    <form class="contact-form" data-contact>
      <section class="panel">
        <div class="panel-head"><div><h2>أرقام وروابط التواصل</h2><p>تظهر في الهيدر، التذييل، وصفحة الطلب</p></div></div>
        <div class="fields-grid two">
          ${l("رقم العرض للزائر",`<input name="phoneDisplay" value="${o(t.phoneDisplay)}">`)}
          ${l("رقم الاتصال الدولي",`<input name="phoneTel" value="${o(t.phoneTel)}" dir="ltr">`)}
          ${l("واتساب بدون +",`<input name="whatsapp" value="${o(t.whatsapp)}" dir="ltr">`)}
          ${l("رابط فيسبوك",`<input name="facebook" value="${o(t.facebook)}" dir="ltr">`)}
        </div>
        <div class="form-actions" style="margin-top:16px">
          <button class="btn btn-purple" type="submit">حفظ بيانات التواصل</button>
        </div>
      </section>
    </form>`}function nt(){return`
    <div class="settings-card">
      <section class="panel">
        <div class="panel-head"><div><h2>كلمة المرور</h2><p>تُحفظ على السيرفر فقط ولن تظهر في صفحات الزوار.</p></div></div>
        ${f?`<form data-password class="fields-grid" style="max-width:420px">
                ${l("كلمة مرور جديدة (8 أحرف على الأقل)",'<input type="password" name="password" minlength="8" required>')}
                <div class="form-actions"><button class="btn btn-purple" type="submit">تغيير كلمة المرور</button></div>
              </form>`:'<p class="help">تغيير كلمة المرور يعمل بعد رفع الموقع على الاستضافة مع PHP.</p>'}
      </section>
      <section class="panel">
        <div class="panel-head"><div><h2>النسخ الاحتياطي</h2><p>احفظوا JSON بعد كل تعديل مهم.</p></div></div>
        <p class="help">إذا اختفت التعديلات بعد نشر جديد، ارفعوا الملف من «استعادة JSON» أعلى الصفحة ثم احفظوا على الموقع.</p>
        <p class="help">رابط اللوحة: <strong>/admin.html</strong></p>
      </section>
    </div>`}function p(){if(d==="gate-setup"||d==="gate-login"){K(d==="gate-setup"?"setup":"login");return}const t=d==="home"?Y():d==="products"?_():d==="edit"?Z():d==="categories"?tt():d==="faqs"?et():d==="copy"?at():d==="settings"?nt():st();c.innerHTML=W(t),it()}function it(){var e,r,u,h,S,N,j,A,D,J,H,M,I;c.querySelectorAll("[data-view]").forEach(a=>{a.addEventListener("click",()=>{d=a.dataset.view,w="",p()})}),(e=c.querySelector("[data-save]"))==null||e.addEventListener("click",b),(r=c.querySelector("[data-backup]"))==null||r.addEventListener("click",G),(u=c.querySelector("[data-restore]"))==null||u.addEventListener("change",a=>{var i;const s=(i=a.currentTarget.files)==null?void 0:i[0];s&&Q(s)}),(h=c.querySelector("[data-restore-local]"))==null||h.addEventListener("click",async()=>{const a=localStorage.getItem(E);a&&(n=L(JSON.parse(a)),await b(),v("تمت الاستعادة من هذا الجهاز."))}),(S=c.querySelector("[data-password]"))==null||S.addEventListener("submit",async a=>{a.preventDefault();try{await y("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"password",password:a.currentTarget.password.value})}),v("تم تغيير كلمة المرور.")}catch(s){v(s.message,"err")}}),(N=c.querySelector("[data-logout]"))==null||N.addEventListener("click",async()=>{try{await y("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout"})})}catch{}d=f?"gate-login":"home",p()}),(j=c.querySelector("[data-plist-q]"))==null||j.addEventListener("input",a=>{q=a.currentTarget.value,p();const s=c.querySelector("[data-plist-q]");s&&(s.focus(),s.setSelectionRange(q.length,q.length))}),(A=c.querySelector("[data-add]"))==null||A.addEventListener("click",()=>{var s;const a=C({id:`p-${Date.now()}`,cat:((s=n.categories.find(i=>i.id!=="all"))==null?void 0:s.id)||"body",name:"منتج جديد",en:"New product",size:"",img:"/images/logo.jpg",desc:""});n.products.unshift(a),w=a.id,d="edit",p()}),c.querySelectorAll("[data-open]").forEach(a=>{a.addEventListener("click",()=>{w=a.dataset.open,d="edit",p()})});const t=c.querySelector("[data-editor]");t&&(t.addEventListener("submit",async a=>{a.preventDefault();const s=a.currentTarget,i=P(w);if(!i)return;i.name=s.name.value.trim(),i.en=s.en.value.trim(),i.cat=s.cat.value,i.size=s.size.value.trim(),i.img=s.img.value.trim(),i.desc=s.desc.value.trim(),i.ingredients=s.ingredients.value.trim(),i.usage=s.usage.value.trim(),i.notes=s.notes.value.trim(),i.tags=s.tags.value.split(/[،,]/).map(m=>m.trim()).filter(Boolean),i.featured=s.featured.checked,i.active=s.active.checked,i.id||(i.id=B(i.en||i.name));const $=s.file.files[0];if($&&f){const m=new FormData;m.append("file",$);try{const T=await y("/api/upload.php",{method:"POST",body:m});T.url&&(i.img=T.url)}catch(T){v(T.message,"err");return}}else $&&!f&&v("رفع الصور يعمل على الاستضافة. الصقوا رابط الصورة حالياً.","err");await b(),d="edit",p()}),(D=c.querySelector("[data-delete]"))==null||D.addEventListener("click",async()=>{confirm("حذف هذا المنتج من الكتالوج؟")&&(n.products=n.products.filter(a=>a.id!==w),d="products",await b(),p())})),(J=c.querySelector("[data-add-cat]"))==null||J.addEventListener("click",()=>{n.categories.push({id:`cat-${Date.now()}`,name:"قسم جديد"}),p()}),c.querySelectorAll("[data-cat-i]").forEach(a=>{const s=Number(a.dataset.catI);a.querySelectorAll("input").forEach(i=>{i.addEventListener("change",()=>{n.categories[s][i.name]=i.value.trim()})})}),c.querySelectorAll("[data-del-cat]").forEach(a=>{a.addEventListener("click",()=>{n.categories.splice(Number(a.dataset.delCat),1),p()})}),(H=c.querySelector("[data-add-faq]"))==null||H.addEventListener("click",()=>{n.faqs.push({q:"سؤال جديد؟",a:""}),p()}),c.querySelectorAll("[data-faq-i]").forEach(a=>{var i,$;const s=Number(a.dataset.faqI);(i=a.querySelector("input"))==null||i.addEventListener("change",m=>{n.faqs[s].q=m.currentTarget.value}),($=a.querySelector("textarea"))==null||$.addEventListener("change",m=>{n.faqs[s].a=m.currentTarget.value})}),c.querySelectorAll("[data-del-faq]").forEach(a=>{a.addEventListener("click",()=>{n.faqs.splice(Number(a.dataset.delFaq),1),p()})}),(M=c.querySelector("[data-copy]"))==null||M.addEventListener("submit",async a=>{a.preventDefault(),[...a.currentTarget.elements].forEach(i=>{i.name&&(n.copy[i.name]=i.value)}),await b()}),(I=c.querySelector("[data-contact]"))==null||I.addEventListener("submit",async a=>{a.preventDefault();const s=a.currentTarget;n.contact.phoneDisplay=s.phoneDisplay.value.trim(),n.contact.phoneTel=s.phoneTel.value.trim(),n.contact.whatsapp=s.whatsapp.value.replace(/\D/g,""),n.contact.facebook=s.facebook.value.trim(),await b()})}async function R(){try{const t=await y("/api/store.php");t.store&&(n=L(t.store))}catch{const t=localStorage.getItem(E);n=L(t?JSON.parse(t):O())}d="home",p()}async function ot(){const t=await F();if(!f){n=L(JSON.parse(localStorage.getItem(E)||"null")||O()),d="home",p();return}if(t.setup){d="gate-setup",p();return}if(!t.authed){d="gate-login",p();return}await R()}ot();
