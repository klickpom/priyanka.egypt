import{b as R,v as I,n as w,f as B,m as O,p as F}from"./store-BBiuxmud.js";document.documentElement.classList.remove("no-js");var z;const x=((z=document.body)==null?void 0:z.dataset.page)||"home",k="priyanka-open-v7",D=6400,P=1680,K="priyanka-store-local";let m=R(),p=I(m),E=m.categories,T=m.faqs;function S(){return m.contact}function g(e){return O(S().whatsapp,e)}function u(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function U(e){m=w(e),p=I(m),E=m.categories,T=m.faqs}async function A(e){const t=await fetch(e,{cache:"no-store"});if(!t.ok)throw new Error("fail");return t.json()}async function Y(){try{const e=await A("/api/store.php");if(e!=null&&e.store)return w(e.store)}catch{}try{return w(await A("/data/store.live.json"))}catch{}try{const e=localStorage.getItem(K);if(e)return w(JSON.parse(e))}catch{}try{return w(await A("/data/store.json"))}catch{return R()}}function J(){const e=m.copy||{};document.querySelectorAll("[data-copy]").forEach(t=>{const a=e[t.dataset.copy];a&&(t.textContent=a)})}function W(){const e=S();document.querySelectorAll("[data-phone]").forEach(t=>{t.tagName==="A"&&t.setAttribute("href",`tel:${e.phoneTel}`);const a=t.dataset.phonePrefix;a?t.textContent=`${a} ${e.phoneDisplay}`:t.hasAttribute("data-keep-label")||(t.textContent=e.phoneDisplay)}),document.querySelectorAll("[data-wa]").forEach(t=>{t.tagName==="A"&&t.setAttribute("href",g())}),document.querySelectorAll("[data-facebook]").forEach(t=>{t.tagName==="A"&&t.setAttribute("href",e.facebook)})}function X(e="",t=148,a=86){return`<picture>
            <source type="image/webp" srcset="/images/logo.webp?v=3d3">
            <img${e?` class="${e}"`:""} src="/images/logo.png?v=3d3" alt="شعار بريانكا للتجميل" width="${t}" height="${a}">
          </picture>`}function G(){const e=S().phoneDisplay,t=S().phoneTel,a=S().facebook,n=document.querySelector("[data-chrome='header']");n&&(n.outerHTML=`
      <header class="header">
        <div class="scroll-progress" aria-hidden="true"></div>
        <div class="header-inner">
          <a class="brand" href="/index.html">
            ${X()}
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
              <a class="btn btn-gold" href="${g()}" target="_blank" rel="noopener">واتساب</a>
              <a class="btn btn-ghost" href="tel:${t}">${e}</a>
            </div>
          </nav>
          <div class="actions">
            <button class="search-open search-icon-btn" type="button" aria-label="بحث في الموقع">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <a class="btn btn-ghost" href="tel:${t}">${e}</a>
            <a class="btn btn-gold" href="${g()}" target="_blank" rel="noopener">واتساب</a>
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
      </div>`);const r=document.querySelector("[data-chrome='footer']");r&&(r.outerHTML=`
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <strong>بريانكا للتجميل</strong>
            <p data-copy="footerBlurb">${u(m.copy.footerBlurb)}</p>
            <p id="cite-footer">${u(m.copy.aboutBody)}</p>
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
            <p><a href="tel:${t}">${e}</a></p>
            <p><a href="${g()}" target="_blank" rel="noopener">واتساب</a></p>
            <p><a href="${u(a)}" target="_blank" rel="noopener">فيسبوك priyanka.egypt</a></p>
          </div>
        </div>
        <div class="container copy">© بريانكا للتجميل — مصر. جميع الحقوق محفوظة.</div>
      </footer>`);const i=document.querySelector("[data-chrome='float']");i&&(i.outerHTML=`
      <a class="wa-float" href="${g()}" target="_blank" rel="noopener" aria-label="راسلونا على واتساب">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 3.5A10 10 0 0 0 3.2 17.4L2 22l4.7-1.2A10 10 0 0 0 20 3.5zm-8 16.2a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-2.8.7.7-2.7-.2-.3A8.3 8.3 0 1 1 12 19.7zm4.6-6.2c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.8 6.8 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5.2-.3a.4.4 0 0 0 0-.4c0-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9 15 15 0 0 0 1.5.5 3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.2-.1-.4-.2z"/></svg>
      </a>`);const o=document.querySelector("[data-chrome='modal']");o&&(o.outerHTML=`
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
              <a class="btn btn-ghost" href="tel:${t}">اتصال</a>
            </div>
          </div>
        </div>
      </div>`),document.querySelectorAll("[data-nav-link]").forEach(s=>{s.dataset.navLink===x&&s.classList.add("is-active")})}function Q(){const e=document.querySelector(".nav-toggle"),t=document.querySelector("[data-nav]");if(!e||!t)return;const a=n=>{t.classList.toggle("is-open",n),e.setAttribute("aria-expanded",String(n)),e.setAttribute("aria-label",n?"إغلاق القائمة":"فتح القائمة"),document.body.classList.toggle("nav-open",n)};e.addEventListener("click",()=>a(!t.classList.contains("is-open"))),t.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>a(!1))})}function y(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}let H=!1;function V(){H||(H=!0,ce(),le(),document.querySelectorAll("[data-products]").forEach(_))}function N(){document.documentElement.classList.remove("splash-lock")}function L(){const e=document.querySelector(".site");e==null||e.classList.remove("is-landing"),e==null||e.classList.add("is-landed"),N()}function q(){var e;(e=document.querySelector(".site"))==null||e.classList.add("is-ready"),V()}function Z(e){const t=e.querySelector(".splash-logo-frame")||e.querySelector(".splash-logo, .splash-mark img"),a=document.querySelector(".brand img"),n=document.querySelector(".site"),r=document.documentElement.classList.contains("splash-force");if(!t||!a||y()&&!r){q(),L(),e.classList.add("is-done"),e.setAttribute("aria-hidden","true");return}q(),n==null||n.classList.add("is-landing");const i=()=>{const o=t.getBoundingClientRect(),s=a.getBoundingClientRect(),d=s.left+s.width/2-(o.left+o.width/2),l=s.top+s.height/2-(o.top+o.height/2),c=Math.max(.14,s.width/Math.max(o.width,1));e.style.setProperty("--land-x",`${s.left+s.width/2}px`),e.style.setProperty("--land-y",`${s.top+s.height/2}px`),e.classList.add("is-exiting"),e.setAttribute("aria-hidden","true");const h=Math.min(84,window.innerHeight*.08),f=Math.min(1.12,Math.max(c*1.42,.52));typeof t.animate=="function"?t.animate([{transform:"translate(0, 0) scale(1) rotate(0deg)",filter:"drop-shadow(0 28px 50px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 32px rgba(209, 45, 140, 0.42))",offset:0},{transform:`translate(${d*.22}px, ${l*.1-h}px) scale(${f}) rotate(-7deg)`,filter:"drop-shadow(0 24px 44px rgba(201, 162, 39, 0.42)) drop-shadow(0 0 56px rgba(209, 45, 140, 0.55))",offset:.34},{transform:`translate(${d}px, ${l}px) scale(${c}) rotate(0deg)`,filter:"drop-shadow(0 10px 18px rgba(91, 26, 140, 0.28))",offset:1}],{duration:P,easing:"cubic-bezier(0.22, 1, 0.36, 1)",fill:"forwards"}):(t.style.setProperty("--to-x",`${d}px`),t.style.setProperty("--to-y",`${l}px`),t.style.setProperty("--to-s",String(c)),e.classList.add("is-css-fly")),window.setTimeout(()=>{L(),e.classList.add("is-done")},P+60)};requestAnimationFrame(()=>requestAnimationFrame(i))}function ee(){const e=document.querySelector(".header");if(!e)return;const t=()=>{const a=window.scrollY;e.classList.toggle("is-scrolled",a>8);const n=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);e.style.setProperty("--scroll-p",String(Math.min(1,a/n)))};t(),window.addEventListener("scroll",t,{passive:!0})}function te(e){if(!e)return()=>{};const t=e.getContext("2d");if(!t)return()=>{};const a=Array.from({length:56},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.55+.22,vx:(Math.random()-.5)*22e-5,vy:-(Math.random()*32e-5+5e-5),a:Math.random()*.42+.08,gold:Math.random()>.32}));let n=!0;const r=()=>{e.width=window.innerWidth,e.height=window.innerHeight};r(),window.addEventListener("resize",r);const i=()=>{n&&(t.clearRect(0,0,e.width,e.height),a.forEach(o=>{o.x+=o.vx,o.y+=o.vy,o.y<-.03&&(o.y=1.03,o.x=Math.random()),t.beginPath(),t.fillStyle=o.gold?`rgba(232, 212, 138, ${o.a})`:`rgba(209, 45, 140, ${o.a*.85})`,t.arc(o.x*e.width,o.y*e.height,o.r,0,Math.PI*2),t.fill()}),requestAnimationFrame(i))};return requestAnimationFrame(i),()=>{n=!1,window.removeEventListener("resize",r)}}let $=0;function ae(){var o;const e=document.querySelector(".splash"),t=y();if(window.clearTimeout($),x!=="home"||!e){e==null||e.classList.add("is-done"),e==null||e.setAttribute("aria-hidden","true"),q(),L();return}const a=new URLSearchParams(location.search).has("splash");if(a&&document.documentElement.classList.add("splash-force"),t&&!a){document.documentElement.classList.add("splash-lock"),e.classList.add("is-lite"),q(),$=window.setTimeout(()=>{sessionStorage.setItem(k,"1"),L(),e.classList.add("is-done"),e.setAttribute("aria-hidden","true"),N()},1600);return}if(!a&&sessionStorage.getItem(k)){e.classList.add("is-done"),e.setAttribute("aria-hidden","true"),q(),L();return}document.documentElement.classList.add("splash-lock");const n=te(e.querySelector("canvas"));let r=!1;const i=()=>{r||(r=!0,window.clearTimeout($),sessionStorage.setItem(k,"1"),Z(e),window.setTimeout(n,P))};(o=e.querySelector(".splash-skip"))==null||o.addEventListener("click",i,{once:!0}),$=window.setTimeout(i,D)}function ne(e,t){var i;const a=t<2,n=/\.png$/i.test(e.img),r=((i=E.find(o=>o.id===e.cat))==null?void 0:i.name)||"";return`
    <article class="card will-in${n?" is-png":""}" data-id="${u(e.id)}" data-cat="${u(e.cat)}" style="--i:${t%8}" tabindex="0" role="button" aria-label="عرض ${u(e.name)}">
      <div class="thumb">
        <img src="${u(e.img)}" alt="${u(e.name)}" width="480" height="600" ${a?'fetchpriority="high"':'loading="lazy"'}>
        <span class="card-shine" aria-hidden="true"></span>
        <span class="card-chip">${u(r)}</span>
        <span class="card-cta">عرض التفاصيل</span>
      </div>
      <div class="card-body">
        <div class="en">${u(e.en)}</div>
        <h3>${u(e.name)}</h3>
        <div class="meta"><span>${u(e.size)}</span><span>بدون سعر ثابت</span></div>
      </div>
    </article>`}function re(e){const t=!y()&&window.matchMedia("(hover: hover) and (pointer: fine)").matches;e.querySelectorAll(".card").forEach(a=>{const n=()=>C(p.find(r=>r.id===a.dataset.id));a.addEventListener("click",n),a.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),n())}),t&&(a.addEventListener("pointermove",r=>{const i=a.getBoundingClientRect(),o=(r.clientX-i.left)/i.width,s=(r.clientY-i.top)/i.height;a.style.setProperty("--rx",`${((.5-s)*7).toFixed(2)}deg`),a.style.setProperty("--ry",`${((o-.5)*9).toFixed(2)}deg`),a.style.setProperty("--mx",`${(o*100).toFixed(1)}%`),a.style.setProperty("--my",`${(s*100).toFixed(1)}%`)}),a.addEventListener("pointerleave",()=>{a.style.setProperty("--rx","0deg"),a.style.setProperty("--ry","0deg"),a.style.setProperty("--mx","50%"),a.style.setProperty("--my","28%")}))})}function _(e){const t=[...e.querySelectorAll(".card")];if(!t.length)return;if(y()||!("IntersectionObserver"in window)){t.forEach(r=>r.classList.add("is-in"));return}const a=new IntersectionObserver(r=>{r.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-in"),a.unobserve(i.target))})},{threshold:.12,rootMargin:"0px 0px -4% 0px"}),n=window.innerHeight||800;t.forEach((r,i)=>{r.style.setProperty("--i",String(i%8));const o=r.getBoundingClientRect();o.top<n*.94&&o.bottom>24?requestAnimationFrame(()=>r.classList.add("is-in")):a.observe(r)})}function C(e){var i;const t=document.querySelector("#product-modal");if(!t||!e)return;const a=t.querySelector("img");a.classList.remove("is-ready"),a.onload=()=>a.classList.add("is-ready"),a.src=e.img,a.alt=e.name,a.complete&&a.classList.add("is-ready"),t.querySelector("[data-modal-en]").textContent=e.en||"",t.querySelector("#modal-title").textContent=e.name,t.querySelector("[data-modal-size]").textContent=e.size||"",t.querySelector("[data-modal-desc]").textContent=e.desc||"";const n=(o,s)=>{const d=t.querySelector(`[data-modal-block="${o}"]`),l=t.querySelector(`[data-modal-${o}]`);if(!d||!l)return;const c=String(s||"").trim();d.hidden=!c,l.textContent=c};n("ingredients",e.ingredients),n("usage",e.usage),n("notes",e.notes);const r=t.querySelector("[data-modal-wa]");r.href=g(`مرحباً، أود الاستفسار عن ${e.name}`),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),(i=t.querySelector(".modal-close"))==null||i.focus()}function M(){const e=document.querySelector("#product-modal");e&&(e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"))}function oe(){var t;const e=document.querySelector("#product-modal");e&&((t=e.querySelector(".modal-close"))==null||t.addEventListener("click",M),e.addEventListener("click",a=>{a.target===e&&M()}),document.addEventListener("keydown",a=>{a.key==="Escape"&&M()}))}function se(){const e=document.querySelector("[data-products]");if(!e)return;const t=e.dataset.products==="featured",a=new URLSearchParams(window.location.search);let n=t?"all":a.get("cat")||"all";E.some(c=>c.id===n)||(n="all");const r=document.querySelector("[data-catalog-search]");let i=t?"":a.get("q")||"";r&&i&&(r.value=i);const o=t?p.filter(c=>c.featured):p,s=(c,h=i,{reveal:f=H||x!=="home"}={})=>{const v=(c==="all"?o:o.filter(b=>b.cat===c)).filter(b=>F(b,h));if(!v.length){e.innerHTML='<p class="search-empty">لا توجد منتجات مطابقة. جرّبوا كلمة أخرى أو مجموعة مختلفة.</p>';return}e.innerHTML=v.map((b,j)=>ne(b,j)).join(""),re(e),f&&_(e)},d=document.querySelector("[data-filters]");d&&!t&&(d.innerHTML=E.map(c=>`<button class="filter-btn${c.id===n?" is-on":""}" type="button" data-cat="${c.id}">${u(c.name)}</button>`).join(""),d.addEventListener("click",c=>{const h=c.target.closest("[data-cat]");if(!h)return;n=h.dataset.cat,d.querySelectorAll(".filter-btn").forEach(v=>v.classList.toggle("is-on",v===h));const f=new URL(window.location.href);n==="all"?f.searchParams.delete("cat"):f.searchParams.set("cat",n),history.replaceState({},"",f),s(n,i)})),r&&!t&&r.addEventListener("input",()=>{i=r.value;const c=new URL(window.location.href);B(i)?c.searchParams.set("q",i.trim()):c.searchParams.delete("q"),history.replaceState({},"",c),s(n,i)}),s(n,i);const l=a.get("id");if(l&&!t){const c=p.find(h=>h.id===l);c&&C(c)}}function ie(){const e=document.querySelector("[data-faq]");if(!e)return;const a=e.dataset.faq==="preview"?T.slice(0,3):T;e.innerHTML=a.map((n,r)=>`
      <details${r===0?" open":""}>
        <summary>${u(n.q)}</summary>
        <p class="answer">${u(n.a)}</p>
      </details>`).join("")}function ce(){const e=document.querySelectorAll("[data-reveal]");if(!e.length)return;if(y()||!("IntersectionObserver"in window)){e.forEach(n=>n.classList.add("in"));return}const a=new IntersectionObserver(n=>{n.forEach(r=>{r.isIntersecting&&(r.target.classList.add("in"),a.unobserve(r.target))})},{threshold:.08,rootMargin:"0px 0px -8% 0px"});e.forEach(n=>a.observe(n))}function le(){if(y())return;const e=document.querySelector(".hero-visual"),t=document.querySelector(".hero");if(!e||!t)return;const a=t.querySelectorAll(".hero-chip"),n=e.querySelectorAll(".mosaic-cell");let r=!1;const i=()=>{r=!1;const o=window.scrollY,s=Math.max(1,t.offsetHeight),d=Math.min(1,o/s);e.style.transform=`translate3d(0, ${Math.min(o,s)*.14}px, 0)`,t.style.setProperty("--hero-fade",String(Math.max(.18,1-d*.7))),a.forEach((l,c)=>{if(o<10){l.style.transform="",l.style.opacity="";return}l.style.transform=`translate3d(0, ${o*(.08+c*.04)}px, 0)`,l.style.opacity=String(Math.max(0,1-d*1.4))}),n.forEach((l,c)=>{l.style.translate=o<10?"":`0 ${o*(.04+c*.02)}px`})};i(),window.addEventListener("scroll",()=>{r||(r=!0,requestAnimationFrame(i))},{passive:!0})}function de(){var o;const e=document.querySelector("#site-search"),t=e==null?void 0:e.querySelector(".search-input"),a=e==null?void 0:e.querySelector("[data-search-results]");if(!e||!t||!a)return;const n=()=>{const s=t.value.trim();if(!B(s)){a.innerHTML='<p class="search-hint">ابحثوا بالعربية أو الإنجليزية: بطيخ، صابون، African، خميرة...</p>';return}const d=p.filter(l=>F(l,s)).slice(0,8);if(!d.length){a.innerHTML=`<p class="search-empty">لا توجد نتائج لـ «${u(s)}».</p>`;return}a.innerHTML=d.map(l=>`
        <a class="search-hit" href="/products.html?id=${u(l.id)}&q=${encodeURIComponent(s)}">
          <img src="${u(l.img)}" alt="" width="56" height="56">
          <span>
            <strong>${u(l.name)}</strong>
            <small>${u(l.en||"")} · ${u(l.size||"")}</small>
          </span>
        </a>`).join("")},r=()=>{e.hidden=!1,document.body.classList.add("search-open-page"),t.focus(),n()},i=()=>{e.hidden=!0,document.body.classList.remove("search-open-page")};document.querySelectorAll(".search-open").forEach(s=>s.addEventListener("click",r)),(o=e.querySelector(".search-close"))==null||o.addEventListener("click",i),e.addEventListener("click",s=>{s.target===e&&i()}),t.addEventListener("input",n),a.addEventListener("click",s=>{const d=s.target.closest(".search-hit");if(!d)return;const l=new URL(d.href,window.location.origin).searchParams.get("id"),c=p.find(h=>h.id===l);!c||!document.querySelector("#product-modal")||x!=="home"&&x!=="products"||(s.preventDefault(),i(),C(c))}),document.addEventListener("keydown",s=>{var d,l;(s.ctrlKey||s.metaKey)&&s.key.toLowerCase()==="k"&&(s.preventDefault(),r()),s.key==="/"&&!s.ctrlKey&&!s.metaKey&&((d=document.activeElement)==null?void 0:d.tagName)!=="INPUT"&&((l=document.activeElement)==null?void 0:l.tagName)!=="TEXTAREA"&&(s.preventDefault(),r()),s.key==="Escape"&&!e.hidden&&i()})}async function ue(){U(await Y()),G(),J(),W(),Q(),ee(),oe(),de(),se(),ie(),ae()}ue();
