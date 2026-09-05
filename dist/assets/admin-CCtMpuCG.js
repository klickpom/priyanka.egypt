import{b as k,n as q,e as z}from"./store-BBiuxmud.js";const E="priyanka-store-local",i=document.querySelector("#admin-app");let L="",r=k(),c="home",w="",O="",x="",b=!1,S="";function l(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function B(e){return String(e||"product").toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"").slice(0,42)||`p-${Date.now()}`}function u(e,t="ok"){O=e,x=t,d()}async function y(e,t={}){const s={...t.headers||{}};L&&(s["X-CSRF"]=L);const p=await fetch(e,{credentials:"same-origin",...t,headers:s});if(!(p.headers.get("content-type")||"").includes("application/json"))throw new Error("تعذّر الاتصال بالسيرفر");const $=await p.json().catch(()=>({}));if(!p.ok)throw new Error($.error||"تعذّر الاتصال بالسيرفر");return $}async function F(){try{const e=await y("/api/auth.php");if(typeof e.setup!="boolean")throw new Error("no-php");return b=!0,L=e.csrf||"",e}catch{return b=!1,{setup:!1,authed:!0,local:!0}}}function U(){localStorage.setItem(E,JSON.stringify(r))}async function g(){if(r.updatedAt=new Date().toISOString(),U(),!b){u("حُفظت النسخة على هذا الجهاز. ارفعوا الموقع على الاستضافة لتفعيل الحفظ على السيرفر.","ok");return}try{await y("/api/store.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({store:r})}),u("تم حفظ التعديلات على الموقع.")}catch(e){u(e.message,"err")}}function H(){const e=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),t=URL.createObjectURL(e),s=document.createElement("a");s.href=t,s.download=`priyanka-store-${new Date().toISOString().slice(0,10)}.json`,s.click(),URL.revokeObjectURL(t)}function M(e){const t=new FileReader;t.onload=async()=>{try{r=q(JSON.parse(String(t.result))),await g(),u("تمت استعادة النسخة الاحتياطية.")}catch{u("ملف النسخة غير صالح.","err")}},t.readAsText(e)}function P(e){return r.products.find(t=>t.id===e)}function Q(e){i.innerHTML=`
    <div class="gate">
      <form class="gate-card" data-gate="${e}">
        <img src="/images/logo.webp?v=3d3" alt="">
        <h1>${e==="setup"?"إنشاء لوحة التحكم":"دخول المشرف"}</h1>
        <p>${e==="setup"?"اختاروا كلمة مرور قوية مرة واحدة. لن تظهر في الموقع.":"عدّلوا المنتجات والنصوص ثم احفظوا."}</p>
        <label>كلمة المرور<input type="password" name="password" minlength="8" required></label>
        ${e==="setup"?'<label>تأكيد كلمة المرور<input type="password" name="confirm" minlength="8" required></label>':""}
        <button class="btn btn-gold" type="submit" style="width:100%">${e==="setup"?"حفظ ودخول":"دخول"}</button>
        <p class="toast ${x}">${l(O)}</p>
      </form>
    </div>`,i.querySelector("form").addEventListener("submit",async t=>{t.preventDefault();const s=t.currentTarget,p=s.password.value;if(e==="setup"&&p!==s.confirm.value){u("كلمتا المرور غير متطابقتين.","err");return}try{L=(await y("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:e==="setup"?"setup":"login",password:p})})).csrf||L,await V()}catch(h){u(h.message,"err")}})}function m(e,t){return`<button type="button" data-view="${e}" class="${c===e||c==="edit"&&e==="products"?"is-on":""}">${t}</button>`}function G(e){return`
    <div class="shell">
      <aside class="side">
        <strong>بريانكا · لوحة التحكم</strong>
        ${m("home","نظرة عامة")}
        ${m("products","المنتجات")}
        ${m("categories","الأقسام")}
        ${m("faqs","الأسئلة")}
        ${m("copy","نصوص الموقع")}
        ${m("contact","التواصل")}
        ${m("settings","الإعدادات")}
        <button type="button" data-logout>خروج</button>
      </aside>
      <main class="main">
        <div class="topbar">
          <div>
            <h1 style="margin:0">${K()}</h1>
            <p class="toast ${x}">${l(O||(b?"الحفظ يصل إلى الموقع مباشرة.":"وضع محلي: احفظوا نسخة احتياطية JSON."))}</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <label class="btn btn-ghost" style="cursor:pointer">استعادة JSON<input type="file" data-restore accept="application/json" hidden></label>
            <button class="btn btn-ghost" type="button" data-backup>نسخة احتياطية</button>
            <button class="btn btn-purple" type="button" data-save>حفظ على الموقع</button>
          </div>
        </div>
        ${e}
      </main>
    </div>`}function K(){return{home:"نظرة عامة",products:"المنتجات",edit:"تفاصيل المنتج",categories:"الأقسام",faqs:"الأسئلة الشائعة",copy:"نصوص الموقع",contact:"بيانات التواصل",settings:"الإعدادات"}[c]||"لوحة التحكم"}function X(){const e=r.products.filter(t=>t.active!==!1).length;return`
    <div class="grid-cards">
      <div class="stat"><b>${r.products.length}</b><span>منتج في الكتالوج</span></div>
      <div class="stat"><b>${e}</b><span>ظاهر للزوار</span></div>
      <div class="stat"><b>${r.faqs.length}</b><span>سؤال شائع</span></div>
    </div>
    <p>من هنا تعدّلون الاسم، الوصف، المكونات، طريقة الاستخدام، الصورة، والأقسام. البحث في الموقع يقرأ نفس هذه البيانات.</p>
    <p>رابط اللوحة: <strong>/admin.html</strong> — لا يظهر في قائمة الزوار. بعد كل حفظ اضغطوا «حفظ على الموقع» ثم راجعوا الصفحة الرئيسية.</p>
    ${localStorage.getItem(E)?'<p><button class="btn btn-ghost" type="button" data-restore-local>استعادة آخر تعديل من هذا الجهاز</button></p>':""}`}function Y(){const e=S.trim().toLowerCase(),t=r.products.filter(s=>{const p=`${s.name} ${s.en} ${s.desc}`.toLowerCase();return!e||p.includes(e)});return`
    <div class="toolbar">
      <input data-plist-q placeholder="بحث داخل المنتجات" value="${l(S)}">
      <button class="btn btn-gold" type="button" data-add>منتج جديد</button>
    </div>
    <div class="list">
      ${t.map(s=>`
        <article class="row" data-open="${l(s.id)}">
          <img src="${l(s.img)}" alt="">
          <div>
            <strong>${l(s.name)}</strong>
            <small>${l(s.en)} · ${l(s.size)} · ${s.active===!1?"مخفي":"ظاهر"}</small>
          </div>
          <button class="btn btn-ghost" type="button">تعديل</button>
        </article>`).join("")}
    </div>`}function _(){const e=z(P(w)||{});return`
    <div class="editor">
      <form data-editor>
        <label>الاسم بالعربية<input name="name" value="${l(e.name)}" required></label>
        <label>الاسم بالإنجليزية<input name="en" value="${l(e.en)}"></label>
        <label>القسم
          <select name="cat">
            ${r.categories.filter(t=>t.id!=="all").map(t=>`<option value="${l(t.id)}" ${t.id===e.cat?"selected":""}>${l(t.name)}</option>`).join("")}
          </select>
        </label>
        <label>الحجم / العبوة<input name="size" value="${l(e.size)}"></label>
        <label>رابط الصورة<input name="img" value="${l(e.img)}"></label>
        <label>رفع صورة جديدة<input type="file" name="file" accept="image/jpeg,image/png,image/webp"></label>
        <label>وصف المنتج للزائر<textarea name="desc" rows="4">${l(e.desc)}</textarea></label>
        <label>المكونات<textarea name="ingredients" rows="3">${l(e.ingredients)}</textarea></label>
        <label>طريقة الاستخدام<textarea name="usage" rows="3">${l(e.usage)}</textarea></label>
        <label>ملاحظات<textarea name="notes" rows="2">${l(e.notes)}</textarea></label>
        <label>كلمات بحث (افصلوا بفاصلة)<input name="tags" value="${l((e.tags||[]).join("، "))}"></label>
        <label class="check"><input type="checkbox" name="featured" ${e.featured?"checked":""}> منتج مميز في الرئيسية</label>
        <label class="check"><input type="checkbox" name="active" ${e.active!==!1?"checked":""}> ظاهر في الموقع</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <button class="btn btn-purple" type="submit">حفظ المنتج</button>
          <button class="btn btn-ghost" type="button" data-view="products">رجوع</button>
          <button class="btn btn-danger" type="button" data-delete>حذف</button>
        </div>
      </form>
      <aside class="preview">
        <img src="${l(e.img)}" alt="">
        <p class="en">${l(e.en)}</p>
        <h2>${l(e.name)}</h2>
        <p>${l(e.size)}</p>
        <p>${l(e.desc)}</p>
      </aside>
    </div>`}function W(){return`
    <button class="btn btn-gold" type="button" data-add-cat>قسم جديد</button>
    <div style="margin-top:16px">
      ${r.categories.map((e,t)=>`
        <div class="cat-item" data-cat-i="${t}">
          <label>المعرّف<input name="id" value="${l(e.id)}" ${e.id==="all"?"readonly":""}></label>
          <label>الاسم<input name="name" value="${l(e.name)}"></label>
          ${e.id==="all"?"":`<button class="btn btn-danger" type="button" data-del-cat="${t}">حذف</button>`}
        </div>`).join("")}
    </div>`}function Z(){return`
    <button class="btn btn-gold" type="button" data-add-faq>سؤال جديد</button>
    <div style="margin-top:16px">
      ${r.faqs.map((e,t)=>`
        <div class="faq-item" data-faq-i="${t}">
          <label>السؤال<input name="q" value="${l(e.q)}"></label>
          <label>الجواب<textarea name="a" rows="3">${l(e.a)}</textarea></label>
          <button class="btn btn-danger" type="button" data-del-faq="${t}">حذف</button>
        </div>`).join("")}
    </div>`}function ee(){return`
    <form data-copy>
      ${[["heroEyebrow","سطر الهيرو الصغير"],["heroTitle","عنوان الهيرو"],["heroAccent","السطر الملوّن"],["heroLead","وصف الهيرو"],["collectionsEyebrow","سطر المجموعات"],["collectionsTitle","عنوان المجموعات"],["collectionsLead","وصف المجموعات"],["featuredEyebrow","سطر المختارات"],["featuredTitle","عنوان المختارات"],["catalogEyebrow","سطر الكتالوج"],["catalogTitle","عنوان الكتالوج"],["catalogLead","وصف الكتالوج"],["aboutEyebrow","سطر صفحة عن العلامة"],["aboutTitle","عنوان صفحة عن العلامة"],["aboutQuote","اقتباس عن العلامة"],["aboutBody","نص عن العلامة"],["aboutLines","سطور الخطوط"],["footerBlurb","نص التذييل"]].map(([t,s])=>`<label>${s}<textarea name="${t}" rows="${t.includes("Lead")||t.includes("Body")||t.includes("Lines")?4:2}">${l(r.copy[t]||"")}</textarea></label>`).join("")}
      <button class="btn btn-purple" type="submit">حفظ النصوص</button>
    </form>`}function te(){const e=r.contact;return`
    <form data-contact>
      <label>رقم العرض<input name="phoneDisplay" value="${l(e.phoneDisplay)}"></label>
      <label>رقم الاتصال الدولي<input name="phoneTel" value="${l(e.phoneTel)}"></label>
      <label>واتساب بدون +<input name="whatsapp" value="${l(e.whatsapp)}"></label>
      <label>رابط فيسبوك<input name="facebook" value="${l(e.facebook)}"></label>
      <button class="btn btn-purple" type="submit">حفظ التواصل</button>
    </form>`}function ae(){return`
    <p>كلمة المرور تُحفظ على السيرفر فقط ولن تظهر في صفحات الزوار.</p>
    ${b?`<form data-password>
            <label>كلمة مرور جديدة (8 أحرف على الأقل)<input type="password" name="password" minlength="8" required></label>
            <button class="btn btn-purple" type="submit">تغيير كلمة المرور</button>
          </form>`:"<p>تغيير كلمة المرور يعمل بعد رفع الموقع على الاستضافة مع PHP.</p>"}
    <p>احفظوا نسخة JSON بعد كل تعديل مهم، ثم ارفعوها من «استعادة JSON» إذا اختفت التعديلات بعد نشر جديد.</p>
    <p>رابط اللوحة للموبايل والكمبيوتر: <code>/admin.html</code></p>`}function d(){if(c==="gate-setup"||c==="gate-login"){Q(c==="gate-setup"?"setup":"login");return}const e=c==="home"?X():c==="products"?Y():c==="edit"?_():c==="categories"?W():c==="faqs"?Z():c==="copy"?ee():c==="settings"?ae():te();i.innerHTML=G(e),ne()}function ne(){var t,s,p,h,$,N,j,D,A,J,I,C,R;i.querySelectorAll("[data-view]").forEach(a=>{a.addEventListener("click",()=>{c=a.dataset.view,w="",d()})}),(t=i.querySelector("[data-save]"))==null||t.addEventListener("click",g),(s=i.querySelector("[data-backup]"))==null||s.addEventListener("click",H),(p=i.querySelector("[data-restore]"))==null||p.addEventListener("change",a=>{var o;const n=(o=a.currentTarget.files)==null?void 0:o[0];n&&M(n)}),(h=i.querySelector("[data-restore-local]"))==null||h.addEventListener("click",async()=>{const a=localStorage.getItem(E);a&&(r=q(JSON.parse(a)),await g(),u("تمت الاستعادة من هذا الجهاز."))}),($=i.querySelector("[data-password]"))==null||$.addEventListener("submit",async a=>{a.preventDefault();try{await y("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"password",password:a.currentTarget.password.value})}),u("تم تغيير كلمة المرور.")}catch(n){u(n.message,"err")}}),(N=i.querySelector("[data-logout]"))==null||N.addEventListener("click",async()=>{try{await y("/api/auth.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"logout"})})}catch{}c=b?"gate-login":"home",d()}),(j=i.querySelector("[data-plist-q]"))==null||j.addEventListener("input",a=>{S=a.currentTarget.value,d();const n=i.querySelector("[data-plist-q]");n&&(n.focus(),n.setSelectionRange(S.length,S.length))}),(D=i.querySelector("[data-add]"))==null||D.addEventListener("click",()=>{var n;const a=z({id:`p-${Date.now()}`,cat:((n=r.categories.find(o=>o.id!=="all"))==null?void 0:n.id)||"body",name:"منتج جديد",en:"New product",size:"",img:"/images/logo.jpg",desc:""});r.products.unshift(a),w=a.id,c="edit",d()}),i.querySelectorAll("[data-open]").forEach(a=>{a.addEventListener("click",()=>{w=a.dataset.open,c="edit",d()})});const e=i.querySelector("[data-editor]");e&&(e.addEventListener("submit",async a=>{a.preventDefault();const n=a.currentTarget,o=P(w);if(!o)return;o.name=n.name.value.trim(),o.en=n.en.value.trim(),o.cat=n.cat.value,o.size=n.size.value.trim(),o.img=n.img.value.trim(),o.desc=n.desc.value.trim(),o.ingredients=n.ingredients.value.trim(),o.usage=n.usage.value.trim(),o.notes=n.notes.value.trim(),o.tags=n.tags.value.split(/[،,]/).map(f=>f.trim()).filter(Boolean),o.featured=n.featured.checked,o.active=n.active.checked,o.id||(o.id=B(o.en||o.name));const v=n.file.files[0];if(v&&b){const f=new FormData;f.append("file",v);try{const T=await y("/api/upload.php",{method:"POST",body:f});T.url&&(o.img=T.url)}catch(T){u(T.message,"err");return}}else v&&!b&&u("رفع الصور يعمل على الاستضافة. الصقوا رابط الصورة حالياً.","err");await g(),c="edit",d()}),(A=i.querySelector("[data-delete]"))==null||A.addEventListener("click",async()=>{confirm("حذف هذا المنتج من الكتالوج؟")&&(r.products=r.products.filter(a=>a.id!==w),c="products",await g(),d())})),(J=i.querySelector("[data-add-cat]"))==null||J.addEventListener("click",()=>{r.categories.push({id:`cat-${Date.now()}`,name:"قسم جديد"}),d()}),i.querySelectorAll("[data-cat-i]").forEach(a=>{const n=Number(a.dataset.catI);a.querySelectorAll("input").forEach(o=>{o.addEventListener("change",()=>{r.categories[n][o.name]=o.value.trim()})})}),i.querySelectorAll("[data-del-cat]").forEach(a=>{a.addEventListener("click",()=>{r.categories.splice(Number(a.dataset.delCat),1),d()})}),(I=i.querySelector("[data-add-faq]"))==null||I.addEventListener("click",()=>{r.faqs.push({q:"سؤال جديد؟",a:""}),d()}),i.querySelectorAll("[data-faq-i]").forEach(a=>{var o,v;const n=Number(a.dataset.faqI);(o=a.querySelector("input"))==null||o.addEventListener("change",f=>{r.faqs[n].q=f.currentTarget.value}),(v=a.querySelector("textarea"))==null||v.addEventListener("change",f=>{r.faqs[n].a=f.currentTarget.value})}),i.querySelectorAll("[data-del-faq]").forEach(a=>{a.addEventListener("click",()=>{r.faqs.splice(Number(a.dataset.delFaq),1),d()})}),(C=i.querySelector("[data-copy]"))==null||C.addEventListener("submit",async a=>{a.preventDefault(),[...a.currentTarget.elements].forEach(o=>{o.name&&(r.copy[o.name]=o.value)}),await g()}),(R=i.querySelector("[data-contact]"))==null||R.addEventListener("submit",async a=>{a.preventDefault();const n=a.currentTarget;r.contact.phoneDisplay=n.phoneDisplay.value.trim(),r.contact.phoneTel=n.phoneTel.value.trim(),r.contact.whatsapp=n.whatsapp.value.replace(/\D/g,""),r.contact.facebook=n.facebook.value.trim(),await g()})}async function V(){try{const e=await y("/api/store.php");e.store&&(r=q(e.store))}catch{const e=localStorage.getItem(E);r=q(e?JSON.parse(e):k())}c="home",d()}async function re(){const e=await F();if(!b){r=q(JSON.parse(localStorage.getItem(E)||"null")||k()),c="home",d();return}if(e.setup){c="gate-setup",d();return}if(!e.authed){c="gate-login",d();return}await V()}re();
