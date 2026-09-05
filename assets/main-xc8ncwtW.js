import{b as F,v as j,n as $,f as L,m as U,p as _}from"./store-BBiuxmud.js";document.documentElement.classList.remove("no-js");var D;const M=((D=document.body)==null?void 0:D.dataset.page)||"home",C="priyanka-open-v7",Y=6400,R=1680,G="priyanka-store-local";let g=F(),w=j(g),P=g.categories,I=g.faqs;function A(){return g.contact}function x(e){return U(A().whatsapp,e)}function h(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function J(e){g=$(e),w=j(g),P=g.categories,I=g.faqs}async function H(e){const t=await fetch(e,{cache:"no-store"});if(!t.ok)throw new Error("fail");return t.json()}async function W(){try{const e=await H("/api/store.php");if(e!=null&&e.store)return $(e.store)}catch{}try{return $(await H("/data/store.live.json"))}catch{}try{const e=localStorage.getItem(G);if(e)return $(JSON.parse(e))}catch{}try{return $(await H("/data/store.json"))}catch{return F()}}function X(){const e=g.copy||{};document.querySelectorAll("[data-copy]").forEach(t=>{const a=e[t.dataset.copy];a&&(t.textContent=a)})}function V(){const e=A();document.querySelectorAll("[data-phone]").forEach(t=>{t.tagName==="A"&&t.setAttribute("href",`tel:${e.phoneTel}`);const a=t.dataset.phonePrefix;a?t.textContent=`${a} ${e.phoneDisplay}`:t.hasAttribute("data-keep-label")||(t.textContent=e.phoneDisplay)}),document.querySelectorAll("[data-wa]").forEach(t=>{t.tagName==="A"&&t.setAttribute("href",x())}),document.querySelectorAll("[data-facebook]").forEach(t=>{t.tagName==="A"&&t.setAttribute("href",e.facebook)})}function Q(e="",t=148,a=86){return`<picture>
            <source type="image/webp" srcset="/images/logo.webp?v=3d3">
            <img${e?` class="${e}"`:""} src="/images/logo.png?v=3d3" alt="شعار بريانكا للتجميل" width="${t}" height="${a}">
          </picture>`}function Z(){const e=A().phoneDisplay,t=A().phoneTel,a=A().facebook,s=document.querySelector("[data-chrome='header']");s&&(s.outerHTML=`
      <header class="header">
        <div class="scroll-progress" aria-hidden="true"></div>
        <div class="header-inner">
          <a class="brand" href="/index.html">
            ${Q()}
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
              <a class="btn btn-gold" href="${x()}" target="_blank" rel="noopener">واتساب</a>
              <a class="btn btn-ghost" href="tel:${t}">${e}</a>
            </div>
          </nav>
          <div class="actions">
            <button class="search-open search-icon-btn" type="button" aria-label="بحث في الموقع">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <a class="btn btn-ghost" href="tel:${t}">${e}</a>
            <a class="btn btn-gold" href="${x()}" target="_blank" rel="noopener">واتساب</a>
          </div>
          <button class="search-open search-icon-btn mobile-search" type="button" aria-label="بحث في الموقع">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </button>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-label="فتح القائمة">
            <span></span>
          </button>
        </div>
      </header>
      <div class="search-overlay" id="site-search" hidden aria-hidden="true">
        <div class="search-atmos" aria-hidden="true">
          <div class="search-aurora"></div>
          <div class="search-vignette"></div>
          <div class="search-grain"></div>
          <div class="search-frame"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="search-stage" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <div class="search-head">
            <div>
              <p class="search-kicker">PRIYANKA · CATALOG</p>
              <h2 id="search-title">ابحثوا في بريانكا</h2>
            </div>
            <button class="search-close" type="button" aria-label="إغلاق البحث">
              <span>إغلاق</span>
              <kbd>Esc</kbd>
            </button>
          </div>
          <label class="search-field-lux">
            <svg class="search-lens" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 20.49 21.49 19l-5.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input class="search-input" type="search" placeholder="بطيخ، صابون بلدي، خميرة، African..." autocomplete="off" enterkeyhint="search">
          </label>
          <div class="search-chips" data-search-chips>
            <button type="button" data-q="بطيخ">بطيخ</button>
            <button type="button" data-q="فراولة">فراولة</button>
            <button type="button" data-q="صابون">صابون</button>
            <button type="button" data-q="خميرة">خميرة</button>
            <button type="button" data-q="African">African</button>
            <button type="button" data-q="حمام">حمام</button>
            <button type="button" data-q="زيت">زيت</button>
          </div>
          <div class="search-results" data-search-results></div>
        </div>
      </div>`);const r=document.querySelector("[data-chrome='footer']");r&&(r.outerHTML=`
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <strong>بريانكا للتجميل</strong>
            <p data-copy="footerBlurb">${h(g.copy.footerBlurb)}</p>
            <p id="cite-footer">${h(g.copy.aboutBody)}</p>
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
            <p><a href="${x()}" target="_blank" rel="noopener">واتساب</a></p>
            <p><a href="${h(a)}" target="_blank" rel="noopener">فيسبوك priyanka.egypt</a></p>
          </div>
        </div>
        <div class="container copy">© بريانكا للتجميل — مصر. جميع الحقوق محفوظة.</div>
      </footer>`);const i=document.querySelector("[data-chrome='float']");i&&(i.outerHTML=`
      <a class="wa-float" href="${x()}" target="_blank" rel="noopener" aria-label="راسلونا على واتساب">
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
      </div>`),document.querySelectorAll("[data-nav-link]").forEach(u=>{u.dataset.navLink===M&&u.classList.add("is-active")})}function ee(){const e=document.querySelector(".nav-toggle"),t=document.querySelector("[data-nav]");if(!e||!t)return;const a=s=>{t.classList.toggle("is-open",s),e.setAttribute("aria-expanded",String(s)),e.setAttribute("aria-label",s?"إغلاق القائمة":"فتح القائمة"),document.body.classList.toggle("nav-open",s)};e.addEventListener("click",()=>a(!t.classList.contains("is-open"))),t.querySelectorAll("a").forEach(s=>{s.addEventListener("click",()=>a(!1))})}function q(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}let B=!1;function te(){B||(B=!0,ue(),he(),document.querySelectorAll("[data-products]").forEach(K))}function O(){document.documentElement.classList.remove("splash-lock")}function k(){const e=document.querySelector(".site");e==null||e.classList.remove("is-landing"),e==null||e.classList.add("is-landed"),O()}function E(){var e;(e=document.querySelector(".site"))==null||e.classList.add("is-ready"),te()}function ae(e){const t=e.querySelector(".splash-logo-frame")||e.querySelector(".splash-logo, .splash-mark img"),a=document.querySelector(".brand img"),s=document.querySelector(".site"),r=document.documentElement.classList.contains("splash-force");if(!t||!a||q()&&!r){E(),k(),e.classList.add("is-done"),e.setAttribute("aria-hidden","true");return}E(),s==null||s.classList.add("is-landing");const i=()=>{const o=t.getBoundingClientRect(),u=a.getBoundingClientRect(),m=u.left+u.width/2-(o.left+o.width/2),p=u.top+u.height/2-(o.top+o.height/2),l=Math.max(.14,u.width/Math.max(o.width,1));e.style.setProperty("--land-x",`${u.left+u.width/2}px`),e.style.setProperty("--land-y",`${u.top+u.height/2}px`),e.classList.add("is-exiting"),e.setAttribute("aria-hidden","true");const y=Math.min(84,window.innerHeight*.08),v=Math.min(1.12,Math.max(l*1.42,.52));typeof t.animate=="function"?t.animate([{transform:"translate(0, 0) scale(1) rotate(0deg)",filter:"drop-shadow(0 28px 50px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 32px rgba(209, 45, 140, 0.42))",offset:0},{transform:`translate(${m*.22}px, ${p*.1-y}px) scale(${v}) rotate(-7deg)`,filter:"drop-shadow(0 24px 44px rgba(201, 162, 39, 0.42)) drop-shadow(0 0 56px rgba(209, 45, 140, 0.55))",offset:.34},{transform:`translate(${m}px, ${p}px) scale(${l}) rotate(0deg)`,filter:"drop-shadow(0 10px 18px rgba(91, 26, 140, 0.28))",offset:1}],{duration:R,easing:"cubic-bezier(0.22, 1, 0.36, 1)",fill:"forwards"}):(t.style.setProperty("--to-x",`${m}px`),t.style.setProperty("--to-y",`${p}px`),t.style.setProperty("--to-s",String(l)),e.classList.add("is-css-fly")),window.setTimeout(()=>{k(),e.classList.add("is-done")},R+60)};requestAnimationFrame(()=>requestAnimationFrame(i))}function se(){const e=document.querySelector(".header");if(!e)return;const t=()=>{const a=window.scrollY;e.classList.toggle("is-scrolled",a>8);const s=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);e.style.setProperty("--scroll-p",String(Math.min(1,a/s)))};t(),window.addEventListener("scroll",t,{passive:!0})}function ne(e){if(!e)return()=>{};const t=e.getContext("2d");if(!t)return()=>{};const a=Array.from({length:56},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.55+.22,vx:(Math.random()-.5)*22e-5,vy:-(Math.random()*32e-5+5e-5),a:Math.random()*.42+.08,gold:Math.random()>.32}));let s=!0;const r=()=>{e.width=window.innerWidth,e.height=window.innerHeight};r(),window.addEventListener("resize",r);const i=()=>{s&&(t.clearRect(0,0,e.width,e.height),a.forEach(o=>{o.x+=o.vx,o.y+=o.vy,o.y<-.03&&(o.y=1.03,o.x=Math.random()),t.beginPath(),t.fillStyle=o.gold?`rgba(232, 212, 138, ${o.a})`:`rgba(209, 45, 140, ${o.a*.85})`,t.arc(o.x*e.width,o.y*e.height,o.r,0,Math.PI*2),t.fill()}),requestAnimationFrame(i))};return requestAnimationFrame(i),()=>{s=!1,window.removeEventListener("resize",r)}}let T=0;function re(){var o;const e=document.querySelector(".splash"),t=q();if(window.clearTimeout(T),M!=="home"||!e){e==null||e.classList.add("is-done"),e==null||e.setAttribute("aria-hidden","true"),E(),k();return}const a=new URLSearchParams(location.search).has("splash");if(a&&document.documentElement.classList.add("splash-force"),t&&!a){document.documentElement.classList.add("splash-lock"),e.classList.add("is-lite"),E(),T=window.setTimeout(()=>{sessionStorage.setItem(C,"1"),k(),e.classList.add("is-done"),e.setAttribute("aria-hidden","true"),O()},1600);return}if(!a&&sessionStorage.getItem(C)){e.classList.add("is-done"),e.setAttribute("aria-hidden","true"),E(),k();return}document.documentElement.classList.add("splash-lock");const s=ne(e.querySelector("canvas"));let r=!1;const i=()=>{r||(r=!0,window.clearTimeout(T),sessionStorage.setItem(C,"1"),ae(e),window.setTimeout(s,R))};(o=e.querySelector(".splash-skip"))==null||o.addEventListener("click",i,{once:!0}),T=window.setTimeout(i,Y)}function oe(e,t){var i;const a=t<2,s=/\.png$/i.test(e.img),r=((i=P.find(o=>o.id===e.cat))==null?void 0:i.name)||"";return`
    <article class="card will-in${s?" is-png":""}" data-id="${h(e.id)}" data-cat="${h(e.cat)}" style="--i:${t%8}" tabindex="0" role="button" aria-label="عرض ${h(e.name)}">
      <div class="thumb">
        <img src="${h(e.img)}" alt="${h(e.name)}" width="480" height="600" ${a?'fetchpriority="high"':'loading="lazy"'}>
        <span class="card-shine" aria-hidden="true"></span>
        <span class="card-chip">${h(r)}</span>
        <span class="card-cta">عرض التفاصيل</span>
      </div>
      <div class="card-body">
        <div class="en">${h(e.en)}</div>
        <h3>${h(e.name)}</h3>
        <div class="meta"><span>${h(e.size)}</span><span>بدون سعر ثابت</span></div>
      </div>
    </article>`}function ie(e){const t=!q()&&window.matchMedia("(hover: hover) and (pointer: fine)").matches;e.querySelectorAll(".card").forEach(a=>{const s=()=>N(w.find(r=>r.id===a.dataset.id));a.addEventListener("click",s),a.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),s())}),t&&(a.addEventListener("pointermove",r=>{const i=a.getBoundingClientRect(),o=(r.clientX-i.left)/i.width,u=(r.clientY-i.top)/i.height;a.style.setProperty("--rx",`${((.5-u)*7).toFixed(2)}deg`),a.style.setProperty("--ry",`${((o-.5)*9).toFixed(2)}deg`),a.style.setProperty("--mx",`${(o*100).toFixed(1)}%`),a.style.setProperty("--my",`${(u*100).toFixed(1)}%`)}),a.addEventListener("pointerleave",()=>{a.style.setProperty("--rx","0deg"),a.style.setProperty("--ry","0deg"),a.style.setProperty("--mx","50%"),a.style.setProperty("--my","28%")}))})}function K(e){const t=[...e.querySelectorAll(".card")];if(!t.length)return;if(q()||!("IntersectionObserver"in window)){t.forEach(r=>r.classList.add("is-in"));return}const a=new IntersectionObserver(r=>{r.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-in"),a.unobserve(i.target))})},{threshold:.12,rootMargin:"0px 0px -4% 0px"}),s=window.innerHeight||800;t.forEach((r,i)=>{r.style.setProperty("--i",String(i%8));const o=r.getBoundingClientRect();o.top<s*.94&&o.bottom>24?requestAnimationFrame(()=>r.classList.add("is-in")):a.observe(r)})}function N(e){var i;const t=document.querySelector("#product-modal");if(!t||!e)return;const a=t.querySelector("img");a.classList.remove("is-ready"),a.onload=()=>a.classList.add("is-ready"),a.src=e.img,a.alt=e.name,a.complete&&a.classList.add("is-ready"),t.querySelector("[data-modal-en]").textContent=e.en||"",t.querySelector("#modal-title").textContent=e.name,t.querySelector("[data-modal-size]").textContent=e.size||"",t.querySelector("[data-modal-desc]").textContent=e.desc||"";const s=(o,u)=>{const m=t.querySelector(`[data-modal-block="${o}"]`),p=t.querySelector(`[data-modal-${o}]`);if(!m||!p)return;const l=String(u||"").trim();m.hidden=!l,p.textContent=l};s("ingredients",e.ingredients),s("usage",e.usage),s("notes",e.notes);const r=t.querySelector("[data-modal-wa]");r.href=x(`مرحباً، أود الاستفسار عن ${e.name}`),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),(i=t.querySelector(".modal-close"))==null||i.focus()}function z(){const e=document.querySelector("#product-modal");e&&(e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"))}function ce(){var t;const e=document.querySelector("#product-modal");e&&((t=e.querySelector(".modal-close"))==null||t.addEventListener("click",z),e.addEventListener("click",a=>{a.target===e&&z()}),document.addEventListener("keydown",a=>{a.key==="Escape"&&z()}))}function le(){const e=document.querySelector("[data-products]");if(!e)return;const t=e.dataset.products==="featured",a=new URLSearchParams(window.location.search);let s=t?"all":a.get("cat")||"all";P.some(l=>l.id===s)||(s="all");const r=document.querySelector("[data-catalog-search]");let i=t?"":a.get("q")||"";r&&i&&(r.value=i);const o=t?w.filter(l=>l.featured):w,u=(l,y=i,{reveal:v=B||M!=="home"}={})=>{const S=(l==="all"?o:o.filter(n=>n.cat===l)).filter(n=>_(n,y));if(!S.length){e.innerHTML='<p class="search-empty">لا توجد منتجات مطابقة. جرّبوا كلمة أخرى أو مجموعة مختلفة.</p>';return}e.innerHTML=S.map((n,c)=>oe(n,c)).join(""),ie(e),v&&K(e)},m=document.querySelector("[data-filters]");m&&!t&&(m.innerHTML=P.map(l=>`<button class="filter-btn${l.id===s?" is-on":""}" type="button" data-cat="${l.id}">${h(l.name)}</button>`).join(""),m.addEventListener("click",l=>{const y=l.target.closest("[data-cat]");if(!y)return;s=y.dataset.cat,m.querySelectorAll(".filter-btn").forEach(S=>S.classList.toggle("is-on",S===y));const v=new URL(window.location.href);s==="all"?v.searchParams.delete("cat"):v.searchParams.set("cat",s),history.replaceState({},"",v),u(s,i)})),r&&!t&&r.addEventListener("input",()=>{i=r.value;const l=new URL(window.location.href);L(i)?l.searchParams.set("q",i.trim()):l.searchParams.delete("q"),history.replaceState({},"",l),u(s,i)}),u(s,i);const p=a.get("id");if(p&&!t){const l=w.find(y=>y.id===p);l&&N(l)}}function de(){const e=document.querySelector("[data-faq]");if(!e)return;const a=e.dataset.faq==="preview"?I.slice(0,3):I;e.innerHTML=a.map((s,r)=>`
      <details${r===0?" open":""}>
        <summary>${h(s.q)}</summary>
        <p class="answer">${h(s.a)}</p>
      </details>`).join("")}function ue(){const e=document.querySelectorAll("[data-reveal]");if(!e.length)return;if(q()||!("IntersectionObserver"in window)){e.forEach(s=>s.classList.add("in"));return}const a=new IntersectionObserver(s=>{s.forEach(r=>{r.isIntersecting&&(r.target.classList.add("in"),a.unobserve(r.target))})},{threshold:.08,rootMargin:"0px 0px -8% 0px"});e.forEach(s=>a.observe(s))}function he(){if(q())return;const e=document.querySelector(".hero-visual"),t=document.querySelector(".hero");if(!e||!t)return;const a=t.querySelectorAll(".hero-chip"),s=e.querySelectorAll(".mosaic-cell");let r=!1;const i=()=>{r=!1;const o=window.scrollY,u=Math.max(1,t.offsetHeight),m=Math.min(1,o/u);e.style.transform=`translate3d(0, ${Math.min(o,u)*.14}px, 0)`,t.style.setProperty("--hero-fade",String(Math.max(.18,1-m*.7))),a.forEach((p,l)=>{if(o<10){p.style.transform="",p.style.opacity="";return}p.style.transform=`translate3d(0, ${o*(.08+l*.04)}px, 0)`,p.style.opacity=String(Math.max(0,1-m*1.4))}),s.forEach((p,l)=>{p.style.translate=o<10?"":`0 ${o*(.04+l*.02)}px`})};i(),window.addEventListener("scroll",()=>{r||(r=!0,requestAnimationFrame(i))},{passive:!0})}function pe(){var v,S;const e=document.querySelector("#site-search"),t=e==null?void 0:e.querySelector(".search-input"),a=e==null?void 0:e.querySelector("[data-search-results]");if(!e||!t||!a)return;let s=-1,r=0;const i=n=>{var c;return((c=P.find(d=>d.id===n))==null?void 0:c.name)||""},o=()=>[...a.querySelectorAll(".search-hit")],u=(n,c="")=>{const d=t.value.trim(),f=[n.en,n.size].filter(Boolean).join(" · "),b=i(n.cat);return`
      <a class="search-hit ${c}" href="/products.html?id=${h(n.id)}&q=${encodeURIComponent(d)}">
        <img src="${h(n.img)}" alt="" width="88" height="88">
        <span class="search-hit-copy">
          ${b?`<small class="search-hit-cat">${h(b)}</small>`:""}
          <strong>${h(n.name)}</strong>
          ${f?`<em>${h(f)}</em>`:""}
        </span>
        <span class="search-hit-go">عرض</span>
      </a>`},m=n=>{var d;const c=o();if(!c.length){s=-1;return}s=(n+c.length)%c.length,c.forEach((f,b)=>f.classList.toggle("is-on",b===s)),(d=c[s])==null||d.scrollIntoView({block:"nearest"})},p=()=>{const n=t.value.trim();if(e.querySelectorAll("[data-search-chips] [data-q]").forEach(d=>{d.classList.toggle("is-on",L(d.dataset.q)&&L(n).includes(L(d.dataset.q)))}),!L(n)){const d=w.filter(b=>b.featured).slice(0,4),f=d.length?d:w.slice(0,4);a.innerHTML=`
        <p class="search-hint">اكتبوا بالعربية أو الإنجليزية — النتائج تظهر فورًا.</p>
        ${f.length?`<p class="search-idle-kicker">مختارات من الكتالوج</p>
               <div class="search-mosaic">${f.map(b=>u(b,"is-tile")).join("")}</div>`:""}`,s=-1;return}const c=w.filter(d=>_(d,n)).slice(0,8);if(!c.length){a.innerHTML=`<p class="search-empty">لا توجد نتائج لـ «${h(n)}». جرّبوا اسمًا أقصر أو مكوّنًا واحدًا.</p>`,s=-1;return}a.innerHTML=`<p class="search-count">${c.length} منتج مطابق</p>${c.map(d=>u(d)).join("")}`,s=-1},l=n=>{var c,d;if(window.clearTimeout(r),n!=null&&n.getBoundingClientRect){const f=n.getBoundingClientRect();e.style.setProperty("--sx",`${f.left+f.width/2}px`),e.style.setProperty("--sy",`${f.top+f.height/2}px`)}else e.style.setProperty("--sx","50%"),e.style.setProperty("--sy","10%");e.hidden=!1,e.setAttribute("aria-hidden","false"),document.body.classList.add("search-open-page"),document.body.classList.remove("nav-open"),(c=document.querySelector("[data-nav]"))==null||c.classList.remove("is-open"),(d=document.querySelector(".nav-toggle"))==null||d.setAttribute("aria-expanded","false"),document.querySelectorAll(".search-open").forEach(f=>f.setAttribute("aria-expanded","true")),requestAnimationFrame(()=>e.classList.add("is-open")),p(),window.setTimeout(()=>t.focus(),q()?0:180)},y=(n=!1)=>{e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"),document.querySelectorAll(".search-open").forEach(d=>d.setAttribute("aria-expanded","false"));const c=()=>{e.hidden=!0,document.body.classList.remove("search-open-page")};if(n||q()){window.clearTimeout(r),c();return}r=window.setTimeout(c,560)};document.querySelectorAll(".search-open").forEach(n=>{n.setAttribute("aria-expanded","false"),n.addEventListener("click",()=>l(n))}),(v=e.querySelector(".search-close"))==null||v.addEventListener("click",y),e.addEventListener("click",n=>{(n.target===e||n.target.closest(".search-atmos"))&&y()}),(S=e.querySelector("[data-search-chips]"))==null||S.addEventListener("click",n=>{const c=n.target.closest("[data-q]");c&&(t.value=c.dataset.q,t.focus(),p())}),t.addEventListener("input",p),a.addEventListener("click",n=>{const c=n.target.closest(".search-hit");if(!c)return;const d=new URL(c.href,window.location.origin).searchParams.get("id"),f=w.find(b=>b.id===d);!f||!document.querySelector("#product-modal")||M!=="home"&&M!=="products"||(n.preventDefault(),y(!0),N(f))}),e.addEventListener("keydown",n=>{if(e.hidden)return;const c=o();if(n.key==="ArrowDown"&&c.length)n.preventDefault(),m(s+1);else if(n.key==="ArrowUp"&&c.length)n.preventDefault(),m(s<0?c.length-1:s-1);else if(n.key==="Enter"&&c.length){const d=c[s]||(L(t.value)?c[0]:null);if(!d)return;n.preventDefault(),d.click()}}),document.addEventListener("keydown",n=>{var c,d;(n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="k"&&(n.preventDefault(),e.hidden?l():y()),n.key==="/"&&!n.ctrlKey&&!n.metaKey&&((c=document.activeElement)==null?void 0:c.tagName)!=="INPUT"&&((d=document.activeElement)==null?void 0:d.tagName)!=="TEXTAREA"&&(n.preventDefault(),l()),n.key==="Escape"&&!e.hidden&&y()})}async function me(){J(await W()),Z(),X(),V(),ee(),se(),ce(),pe(),le(),de(),re()}me();
