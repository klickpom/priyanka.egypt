import { writeFileSync } from "node:fs";
import { products, categories, faqs } from "./src/data/products.js";

const WA =
  "https://wa.me/201272430202?text=" +
  encodeURIComponent("مرحباً، أود الاستفسار عن منتجات بريانكا للتجميل");
const PHONE_DISPLAY = "01272430202";
const PHONE_TEL = "+201272430202";
const FACEBOOK = "https://www.facebook.com/priyanka.egypt/";
const DATE = "2026-09-04";

const featured = products.filter((item) => item.featured);

function card(product, index = 99) {
  const eager = index < 2;
  const png = /\.png$/i.test(product.img);
  const catName = categories.find((cat) => cat.id === product.cat)?.name || "";
  return `<article class="card will-in${png ? " is-png" : ""}" data-id="${product.id}" data-cat="${product.cat}" style="--i:${index % 8}" tabindex="0" role="button" aria-label="عرض ${product.name}">
  <div class="thumb">
    <img src="${product.img}" alt="${product.name}" width="480" height="600"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>
    <span class="card-shine" aria-hidden="true"></span>
    <span class="card-chip">${catName}</span>
    <span class="card-cta">عرض التفاصيل</span>
  </div>
  <div class="card-body">
    <div class="en">${product.en}</div>
    <h3>${product.name}</h3>
    <div class="meta"><span>${product.size}</span><span>بدون سعر ثابت</span></div>
  </div>
</article>`;
}

function faqBlock(list) {
  return list
    .map(
      (item, index) => `<details${index === 0 ? " open" : ""}>
        <summary>${item.q}</summary>
        <p class="answer">${item.a}</p>
      </details>`
    )
    .join("\n");
}

function header(page) {
  const on = (id) => (id === page ? " is-active" : "");
  return `<header class="header">
        <div class="header-inner">
          <a class="brand" href="/index.html">
            <img src="/images/logo.png" alt="شعار بريانكا للتجميل" width="86" height="56">
            <span>بريانكا للتجميل<small>PRIYANKA · EGYPT</small></span>
          </a>
          <nav class="nav" data-nav aria-label="التنقل الرئيسي">
            <a href="/index.html" data-nav-link="home" class="${on("home").trim()}">الرئيسية</a>
            <a href="/products.html" data-nav-link="products" class="${on("products").trim()}">المنتجات</a>
            <a href="/about.html" data-nav-link="about" class="${on("about").trim()}">عن العلامة</a>
            <a href="/faq.html" data-nav-link="faq" class="${on("faq").trim()}">الأسئلة</a>
            <a href="/contact.html" data-nav-link="contact" class="${on("contact").trim()}">الطلب والتواصل</a>
          </nav>
          <div class="actions">
            <a class="btn btn-ghost" href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>
            <a class="btn btn-gold" href="${WA}" target="_blank" rel="noopener">واتساب</a>
          </div>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-label="فتح القائمة">
            <span></span>
          </button>
        </div>
      </header>`;
}

function footer() {
  return `<footer class="footer">
        <div class="container footer-grid">
          <div>
            <strong>بريانكا للتجميل</strong>
            <p>علامة مصرية للعناية بالبشرة والشعر، من الطبيعة للبشرة. الطلب عبر واتساب أو فيسبوك — بدون أسعار ثابتة على الموقع.</p>
            <p id="cite-footer">بريانكا للتجميل علامة مصرية أسّسها إيهاب فارس وسُمّيت على اسم ابنته. المستحضرات تعتمد على الأعشاب والزيوت الطبيعية للاستخدام المنزلي والصالونات. للتواصل: ${PHONE_DISPLAY} وصفحة فيسبوك priyanka.egypt. ليست مرتبطة ببريانكا شوبرا ولا بماكس فاكتور.</p>
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
            <p><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></p>
            <p><a href="${WA}" target="_blank" rel="noopener">واتساب</a></p>
            <p><a href="${FACEBOOK}" target="_blank" rel="noopener">فيسبوك priyanka.egypt</a></p>
          </div>
        </div>
        <div class="container copy">© بريانكا للتجميل — مصر. جميع الحقوق محفوظة.</div>
      </footer>`;
}

function chromeTail() {
  return `<div data-chrome="float"></div>
    <div data-chrome="modal"></div>
    <script type="module" src="/src/main.js"></script>`;
}

function jsonLd(graph) {
  return `<script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}
</script>`;
}

function orgGraph() {
  return [
    {
      "@type": "Organization",
      "@id": "/#org",
      name: "بريانكا للتجميل",
      alternateName: ["Priyanka Cosmetics", "Priyanka Egypt", "بريانكا مصر"],
      telephone: PHONE_TEL,
      sameAs: [FACEBOOK],
      founder: { "@type": "Person", name: "إيهاب فارس" },
      areaServed: { "@type": "Country", name: "Egypt" },
      brand: { "@id": "/#brand" },
      logo: { "@id": "/#logo" },
    },
    {
      "@type": "Brand",
      "@id": "/#brand",
      name: "بريانكا للتجميل",
      slogan: "FROM NATURE FOR SKIN",
      logo: { "@id": "/#logo" },
    },
    {
      "@type": "ImageObject",
      "@id": "/#logo",
      contentUrl: "/images/logo.jpg",
      caption: "شعار بريانكا للتجميل",
    },
    {
      "@type": "OnlineBusiness",
      "@id": "/#business",
      name: "بريانكا للتجميل",
      parentOrganization: { "@id": "/#org" },
      telephone: PHONE_TEL,
      address: { "@type": "PostalAddress", addressCountry: "EG" },
      areaServed: { "@type": "Country", name: "Egypt" },
    },
    {
      "@type": "WebSite",
      "@id": "/#website",
      name: "بريانكا للتجميل",
      inLanguage: "ar-EG",
      publisher: { "@id": "/#org" },
      dateModified: DATE,
    },
  ];
}

function productNode(item) {
  return {
    "@type": "Product",
    name: item.name,
    alternateName: item.en,
    image: item.img,
    description: item.desc,
    brand: { "@id": "/#brand" },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "size",
      value: item.size,
    },
  };
}

function itemList(id, name, list) {
  return {
    "@type": "ItemList",
    "@id": id,
    name,
    numberOfItems: list.length,
    itemListElement: list.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: productNode(item),
    })),
  };
}

function crumbs(items) {
  const html = items
    .map((item, index) => {
      const last = index === items.length - 1;
      const sep = last ? "" : '<span aria-hidden="true">/</span>';
      return last
        ? `<span>${item.name}</span>`
        : `<a href="${item.href}">${item.name}</a>${sep}`;
    })
    .join("\n            ");
  return `<nav class="crumbs" aria-label="مسار الصفحة">
            ${html}
          </nav>`;
}

function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };
}

function head({ title, description, page, extra = "", graph, preload = false }) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#5B1A8C">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_EG">
  <meta property="og:image" content="/images/logo.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/images/logo.png">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
  <link rel="alternate" type="text/plain" href="/ai.txt" title="ai.txt">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet">
  ${preload ? '<link rel="preload" as="image" href="/images/logo.png">' : ""}
  ${extra}
  ${jsonLd(graph)}
</head>
<body data-page="${page}">`;
}

const splash = `<div class="splash" aria-hidden="false">
  <div class="splash-lift">
    <canvas></canvas>
    <div class="splash-vignette"></div>
    <div class="splash-rays"></div>
    <div class="splash-bloom" aria-hidden="true"></div>
  </div>
  <div class="splash-stage">
    <div class="splash-mark">
      <div class="splash-ring"></div>
      <div class="splash-orbit two"></div>
      <img class="splash-logo" src="/images/logo.png" alt="شعار بريانكا للتجميل">
      <div class="splash-glint" aria-hidden="true"></div>
    </div>
    <div class="splash-copy">
      <p class="splash-title">بريانكا للتجميل</p>
      <p>FROM NATURE FOR SKIN</p>
    </div>
  </div>
  <button class="splash-skip" type="button">تخطي</button>
</div>`;

const filterButtons = categories
  .map(
    (cat, index) =>
      `<button class="filter-btn${index === 0 ? " is-on" : ""}" type="button" data-cat="${cat.id}">${cat.name}</button>`
  )
  .join("\n            ");

const home = `${head({
  title: "بريانكا للتجميل | منتجات عناية طبيعية من مصر",
  description:
    "بريانكا للتجميل علامة مصرية أسّسها إيهاب فارس. مقشرات الجسم، الحمام المغربي، وعناية الشعر من الطبيعة للبشرة. اطلبوا عبر واتساب 01272430202.",
  page: "home",
  preload: true,
  graph: [
    ...orgGraph(),
    {
      "@type": "WebPage",
      "@id": "/index.html#webpage",
      name: "بريانكا للتجميل | منتجات عناية طبيعية من مصر",
      inLanguage: "ar-EG",
      isPartOf: { "@id": "/#website" },
      about: { "@id": "/#org" },
      dateModified: DATE,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#cite-home", ".faq .answer"],
      },
    },
    itemList("/#featured", "منتجات مميزة من بريانكا للتجميل", featured),
  ],
})}
  ${splash}
  <a class="skip-link" href="#main">تخطي إلى المحتوى</a>
  <noscript class="noscript">الموقع يعمل بدون جافاسكربت. تصفحوا <a href="/products.html">الكتالوج</a> أو راسلونا واتساب على ${PHONE_DISPLAY}.</noscript>
  <div class="site">
    <div data-chrome="header">${header("home")}</div>
    <main id="main">
      <section class="hero">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="float-badge one">FROM NATURE FOR SKIN</div>
        <div class="float-badge two">احذروا التقليد</div>
        <div class="container hero-grid">
          <div>
            <p class="eyebrow">PRIYANKA EGYPT</p>
            <h1>بريانكا للتجميل <span>من الطبيعة للبشرة</span></h1>
            <div class="gold-line"></div>
            <p class="lead">مستحضرات عناية مصرية بالأعشاب والزيوت الطبيعية للصالونات والاستخدام المنزلي. عبوات الكيلو للحمام المغربي، وخطوط الشعر والجسم بشعار بريانكا البارز.</p>
            <div class="actions">
              <a class="btn btn-gold" href="${WA}" target="_blank" rel="noopener">اطلب عبر واتساب</a>
              <a class="btn btn-purple" href="/products.html">تصفّح الكتالوج</a>
              <a class="btn btn-ghost" href="tel:${PHONE_TEL}">اتصل ${PHONE_DISPLAY}</a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-mosaic">
              <div class="mosaic-cell mosaic-tall">
                <img src="/images/0cd14f51.jpg" alt="مقشر بودي ديزرتس بالبطيخ من بريانكا" width="640" height="800" fetchpriority="high">
              </div>
              <div class="mosaic-cell">
                <img src="/images/e43b3cea.jpg" alt="الصابون البلدي المغربي من بريانكا" width="480" height="360" loading="lazy">
              </div>
              <div class="mosaic-cell">
                <img src="/images/01417384.png" alt="شامبو خميرة البيرة لتكثيف الشعر" width="480" height="360" loading="lazy">
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section container" data-reveal>
        <p class="eyebrow">المجموعات</p>
        <h2>خطوط العناية</h2>
        <p class="lead">اختاروا المجموعة ثم اطلبوا الكمية عبر واتساب. الأسعار تُحدَّد حسب القطاعي أو الجملة.</p>
        <div class="cats">
          <a class="cat-card" href="/products.html?cat=scrubs">
            <img src="/images/0cd14f51.jpg" alt="مقشرات الجسم" width="640" height="420" loading="lazy">
            <div class="overlay"><h3>مقشرات الجسم</h3><p>Body Desserts وملح البحر</p></div>
          </a>
          <a class="cat-card" href="/products.html?cat=hammam">
            <img src="/images/e43b3cea.jpg" alt="الحمام المغربي" width="640" height="420" loading="lazy">
            <div class="overlay"><h3>الحمام المغربي</h3><p>صابون بلدي ودلكة</p></div>
          </a>
          <a class="cat-card" href="/products.html?cat=hair">
            <img src="/images/01417384.png" alt="العناية بالشعر" width="640" height="420" loading="lazy">
            <div class="overlay"><h3>العناية بالشعر</h3><p>خميرة البيرة والخلطة الأفريقية</p></div>
          </a>
        </div>
      </section>

      <section class="section container">
        <div data-reveal>
          <p class="eyebrow">مختارات</p>
          <h2>منتجات يسأل عنها الزبائن</h2>
        </div>
        <div class="grid" data-products="featured">
          ${featured.map((item, index) => card(item, index)).join("\n          ")}
        </div>
      </section>

      <section class="section container" data-reveal>
        <div class="story">
          <img class="brand-still" src="/images/logo.png" alt="شعار بريانكا للتجميل" width="520" height="520">
          <div>
            <p class="eyebrow">القصة</p>
            <h2>علامة مصرية باسم ابنة المؤسس</h2>
            <p class="quote">من الطبيعة… للبشرة.</p>
            <p id="cite-home">بريانكا للتجميل علامة مصرية أسّسها إيهاب فارس وسُمّيت على اسم ابنته. التصنيع يعتمد على خلاصات الأعشاب والزيوت الطبيعية، وتُقدَّم المنتجات للصالونات والمنازل في المحافظات، مع طموح تصدير. ليست مرتبطة ببريانكا شوبرا ولا بماكس فاكتور.</p>
            <a class="btn btn-purple" href="/about.html">اقرأوا عن العلامة</a>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><strong>مصر</strong><span>تصنيع وتوريد محلي</span></div>
          <div class="stat"><strong>1 كجم</strong><span>عبوات صالونات شائعة</span></div>
          <div class="stat"><strong>واتساب</strong><span>للطلب وعرض السعر</span></div>
        </div>
      </section>

      <section class="section container" data-reveal>
        <p class="eyebrow">لماذا بريانكا</p>
        <h2>عناية واضحة بلا وعود مبالغ فيها</h2>
        <div class="why">
          <article><div class="icon">🌿</div><h3>أعشاب وزيوت</h3><p>تركيبات معلنة على العبوة: أركان، كركم، خميرة بيرة، صابون بلدي.</p></article>
          <article><div class="icon">🛁</div><h3>للمنزل والصالون</h3><p>عبوات الكيلو للحمام المغربي، وعبوات أصغر للاستخدام الشخصي.</p></article>
          <article><div class="icon">★</div><h3>احذروا التقليد</h3><p>ابحثوا عن الشعار البارز وشارة الأصلي / Original على العبوة.</p></article>
        </div>
      </section>

      <section class="section container faq" data-reveal>
        <p class="eyebrow">أسئلة</p>
        <h2>يجيب الموقع بصراحة</h2>
        <div data-faq="preview">
          ${faqBlock(faqs.slice(0, 3))}
        </div>
        <p><a class="btn btn-ghost" href="/faq.html">كل الأسئلة</a></p>
      </section>

      <section class="section container" data-reveal>
        <div class="contact-grid">
          <div class="contact-card">
            <h2>اطلبوا عرض السعر</h2>
            <p>حدّدوا اسم المنتج والكمية (قطاعي أو جملة). لا نعرض أسعاراً ثابتة هنا لأنها تختلف حسب الكمية.</p>
            <a class="big" href="${WA}" target="_blank" rel="noopener">واتساب ${PHONE_DISPLAY}</a>
            <p><a href="tel:${PHONE_TEL}">اتصال</a> · <a href="${FACEBOOK}" target="_blank" rel="noopener">فيسبوك priyanka.egypt</a></p>
          </div>
        </div>
      </section>
    </main>
    <div data-chrome="footer">${footer()}</div>
  </div>
  ${chromeTail()}
</body>
</html>
`;

const productsPage = `${head({
  title: "كتالوج بريانكا للتجميل | مقشرات وحمام مغربي وعناية بالشعر",
  description:
    "كتالوج بريانكا للتجميل: مقشرات Body Desserts، مقشر الملح، الصابون البلدي المغربي، شامبو خميرة البيرة، زيوت المساج والصابون الطبيعي. اطلبوا عبر واتساب.",
  page: "products",
  graph: [
    ...orgGraph(),
    {
      "@type": "CollectionPage",
      "@id": "/products.html#webpage",
      name: "كتالوج بريانكا للتجميل",
      inLanguage: "ar-EG",
      isPartOf: { "@id": "/#website" },
      dateModified: DATE,
    },
    breadcrumbSchema([
      { name: "الرئيسية", href: "/index.html" },
      { name: "المنتجات", href: "/products.html" },
    ]),
    itemList("/#catalog", "كتالوج بريانكا للتجميل", products),
  ],
})}
  <a class="skip-link" href="#main">تخطي إلى المحتوى</a>
  <noscript class="noscript">الكتالوج ظاهر أدناه. للطلب: واتساب ${PHONE_DISPLAY}.</noscript>
  <div class="site is-ready">
    <div data-chrome="header">${header("products")}</div>
    <main id="main">
      <section class="page-hero container">
        ${crumbs([
          { name: "الرئيسية", href: "/index.html" },
          { name: "المنتجات" },
        ])}
        <p class="eyebrow">الكتالوج</p>
        <h1>منتجات بريانكا للتجميل</h1>
        <p class="lead">صور العبوات الحقيقية. اضغطوا البطاقة للتفاصيل ثم اطلبوا عبر واتساب باسم المنتج. بدون أسعار ثابتة على الموقع.</p>
      </section>
      <section class="container">
        <div class="filters" data-filters>
            ${filterButtons}
        </div>
        <div class="grid" data-products="all">
          ${products.map((item, index) => card(item, index)).join("\n          ")}
        </div>
        <table class="compare">
          <thead><tr><th>الخط</th><th>متى تختارونه</th><th>أمثلة</th></tr></thead>
          <tbody>
            <tr><td>Body Desserts</td><td>مقشر جسم برائحة الفاكهة وعبوة 1 كجم</td><td><a href="/products.html?cat=scrubs">البطيخ، الفراولة، المشمش</a></td></tr>
            <tr><td>مقشر الملح</td><td>تقشير بملح البحر مع زيوت عطرية</td><td>خزامى، أركان وكركم، تشيز كيك</td></tr>
            <tr><td>حمام مغربي</td><td>صابون بلدي ودلكة قبل الكيس والزيوت</td><td><a href="/products.html?cat=hammam">الصابون البلدي والدلكة</a></td></tr>
            <tr><td>الشعر</td><td>تكثيف وترطيب بتركيبات عشبية</td><td><a href="/products.html?cat=hair">خميرة البيرة والخلطة الأفريقية</a></td></tr>
          </tbody>
        </table>
      </section>
    </main>
    <div data-chrome="footer">${footer()}</div>
  </div>
  ${chromeTail()}
</body>
</html>
`;

const aboutPage = `${head({
  title: "عن بريانكا للتجميل | إيهاب فارس وعلامة مصرية من الطبيعة للبشرة",
  description:
    "بريانكا للتجميل علامة مصرية أسّسها إيهاب فارس باسم ابنته. عناية بالأعشاب والزيوت الطبيعية للصالونات والمنازل. ليست مرتبطة ببريانكا شوبرا.",
  page: "about",
  graph: [
    ...orgGraph(),
    {
      "@type": "AboutPage",
      "@id": "/about.html#webpage",
      name: "عن بريانكا للتجميل",
      inLanguage: "ar-EG",
      isPartOf: { "@id": "/#website" },
      dateModified: DATE,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#about-brand"],
      },
    },
    breadcrumbSchema([
      { name: "الرئيسية", href: "/index.html" },
      { name: "عن العلامة", href: "/about.html" },
    ]),
  ],
})}
  <a class="skip-link" href="#main">تخطي إلى المحتوى</a>
  <div class="site is-ready">
    <div data-chrome="header">${header("about")}</div>
    <main id="main">
      <section class="page-hero container">
        ${crumbs([
          { name: "الرئيسية", href: "/index.html" },
          { name: "عن العلامة" },
        ])}
        <p class="eyebrow">العلامة</p>
        <h1>عن بريانكا للتجميل</h1>
      </section>
      <section class="section container">
        <div class="story">
          <img class="brand-still" src="/images/logo.png" alt="شعار بريانكا للتجميل ثلاثي الأبعاد" width="520" height="520">
          <div>
            <p class="quote">FROM NATURE FOR SKIN</p>
            <p id="about-brand">بريانكا للتجميل علامة مصرية أسّسها إيهاب فارس وسُمّيت على اسم ابنته. المستحضرات تعتمد على الأعشاب والزيوت الطبيعية للاستخدام المنزلي والصالونات. للتواصل: ${PHONE_DISPLAY} وصفحة فيسبوك priyanka.egypt. ليست مرتبطة ببريانكا شوبرا ولا بماكس فاكتور.</p>
            <p>الخطوط تشمل مقشرات الجسم (Body Desserts ومقشر الملح)، الحمام المغربي (الصابون البلدي والدلكة السودانية)، عناية الشعر (خميرة البيرة والخلطة الأفريقية والمشاط)، زيوت المساج، والصابون الطبيعي.</p>
            <div class="actions">
              <a class="btn btn-gold" href="${WA}" target="_blank" rel="noopener">واتساب</a>
              <a class="btn btn-ghost" href="/products.html">الكتالوج</a>
            </div>
          </div>
        </div>
      </section>
    </main>
    <div data-chrome="footer">${footer()}</div>
  </div>
  ${chromeTail()}
</body>
</html>
`;

const faqPage = `${head({
  title: "أسئلة شائعة | بريانكا للتجميل",
  description:
    "من هي بريانكا للتجميل؟ هل توجد أسعار على الموقع؟ كيف تتأكدون من المنتج الأصلي؟ أين تطلبون؟ إجابات مباشرة من العلامة المصرية.",
  page: "faq",
  graph: [
    ...orgGraph(),
    {
      "@type": "FAQPage",
      "@id": "/faq.html#webpage",
      name: "أسئلة شائعة | بريانكا للتجميل",
      inLanguage: "ar-EG",
      isPartOf: { "@id": "/#website" },
      dateModified: DATE,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".faq .answer"],
      },
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    breadcrumbSchema([
      { name: "الرئيسية", href: "/index.html" },
      { name: "الأسئلة الشائعة", href: "/faq.html" },
    ]),
  ],
})}
  <a class="skip-link" href="#main">تخطي إلى المحتوى</a>
  <div class="site is-ready">
    <div data-chrome="header">${header("faq")}</div>
    <main id="main">
      <section class="page-hero container">
        ${crumbs([
          { name: "الرئيسية", href: "/index.html" },
          { name: "الأسئلة الشائعة" },
        ])}
        <p class="eyebrow">FAQ</p>
        <h1>أسئلة شائعة</h1>
        <p class="lead">إجابات قصيرة يمكن الاستشهاد بها. الأسعار تُطلب واتساب لأنها تختلف بين الجملة والقطاعي.</p>
      </section>
      <section class="section container faq">
        <div data-faq>
          ${faqBlock(faqs)}
        </div>
      </section>
    </main>
    <div data-chrome="footer">${footer()}</div>
  </div>
  ${chromeTail()}
</body>
</html>
`;

const howtoSteps = [
  "اختاروا المنتج من الكتالوج واحفظوا اسمه كما يظهر على البطاقة.",
  "راسلونا واتساب باسم المنتج والكمية المطلوبة.",
  "أكّدوا إن الطلب قطاعي أو جملة لتحصلوا على عرض السعر المناسب.",
];

const contactPage = `${head({
  title: "الطلب والتواصل | واتساب 01272430202",
  description:
    "اطلبوا منتجات بريانكا للتجميل عبر واتساب 01272430202 أو صفحة فيسبوك priyanka.egypt. حدّدوا اسم المنتج والكمية قطاعي أو جملة.",
  page: "contact",
  graph: [
    ...orgGraph(),
    {
      "@type": "ContactPage",
      "@id": "/contact.html#webpage",
      name: "الطلب والتواصل | بريانكا للتجميل",
      inLanguage: "ar-EG",
      isPartOf: { "@id": "/#website" },
      dateModified: DATE,
    },
    breadcrumbSchema([
      { name: "الرئيسية", href: "/index.html" },
      { name: "الطلب والتواصل", href: "/contact.html" },
    ]),
    {
      "@type": "HowTo",
      "@id": "/contact.html#howto-order",
      name: "طريقة طلب منتجات بريانكا للتجميل",
      inLanguage: "ar-EG",
      step: howtoSteps.map((text, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: ["اختاروا المنتج", "راسلونا واتساب", "أكّدوا قطاعي أو جملة"][index],
        text,
      })),
    },
  ],
})}
  <a class="skip-link" href="#main">تخطي إلى المحتوى</a>
  <div class="site is-ready">
    <div data-chrome="header">${header("contact")}</div>
    <main id="main">
      <section class="page-hero container">
        ${crumbs([
          { name: "الرئيسية", href: "/index.html" },
          { name: "الطلب والتواصل" },
        ])}
        <p class="eyebrow">تواصل</p>
        <h1>الطلب والتواصل</h1>
        <p class="lead">رقم واتساب والاتصال: ${PHONE_DISPLAY}. الصفحة الرسمية على فيسبوك: priyanka.egypt.</p>
      </section>
      <section class="section container">
        <div class="contact-grid">
          <article class="contact-card">
            <h2>واتساب</h2>
            <a class="big" href="${WA}" target="_blank" rel="noopener">${PHONE_DISPLAY}</a>
            <p>أرسلوا اسم المنتج والكمية. نرد بعرض السعر حسب القطاعي أو الجملة.</p>
          </article>
          <article class="contact-card">
            <h2>اتصال</h2>
            <a class="big" href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>
            <p>نفس الرقم للاتصال من داخل مصر.</p>
          </article>
          <article class="contact-card">
            <h2>فيسبوك</h2>
            <a class="big" href="${FACEBOOK}" target="_blank" rel="noopener">priyanka.egypt</a>
            <p>تابعوا العروض والمنتجات الجديدة من الصفحة الرسمية.</p>
          </article>
        </div>
        <div class="howto" id="howto-order">
          <h2>طريقة الطلب</h2>
          <ol>
            <li>${howtoSteps[0]}</li>
            <li>${howtoSteps[1]}</li>
            <li>${howtoSteps[2]}</li>
          </ol>
        </div>
      </section>
    </main>
    <div data-chrome="footer">${footer()}</div>
  </div>
  ${chromeTail()}
</body>
</html>
`;

writeFileSync("index.html", home);
writeFileSync("products.html", productsPage);
writeFileSync("about.html", aboutPage);
writeFileSync("faq.html", faqPage);
writeFileSync("contact.html", contactPage);

const catalogLines = products
  .map((p) => `- ${p.name} (${p.en}) — ${p.size} — مجموعة: ${p.cat}`)
  .join("\n");

writeFileSync(
  "public/robots.txt",
  `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

# أضيفوا سطر Sitemap بعد نشر الموقع على نطاق حي:
# Sitemap: https://YOUR-DOMAIN/sitemap.xml

# GEO
# /llms.txt
# /llms-full.txt
# /ai.txt
`
);

writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<!-- حدّثوا <loc> بالنطاق الحي بعد النشر. المسارات الحالية نسبية عمداً. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/index.html</loc><lastmod>${DATE}</lastmod></url>
  <url><loc>/products.html</loc><lastmod>${DATE}</lastmod></url>
  <url><loc>/about.html</loc><lastmod>${DATE}</lastmod></url>
  <url><loc>/faq.html</loc><lastmod>${DATE}</lastmod></url>
  <url><loc>/contact.html</loc><lastmod>${DATE}</lastmod></url>
  <url><loc>/llms.txt</loc><lastmod>${DATE}</lastmod></url>
  <url><loc>/ai.txt</loc><lastmod>${DATE}</lastmod></url>
</urlset>
`
);

writeFileSync(
  "public/llms.txt",
  `# بريانكا للتجميل

> بريانكا للتجميل علامة مصرية للعناية بالبشرة والشعر أسّسها إيهاب فارس وسُمّيت على اسم ابنته. المنتجات تعتمد على الأعشاب والزيوت الطبيعية للصالونات والاستخدام المنزلي. الطلب عبر واتساب 01272430202 أو فيسبوك priyanka.egypt. ليست مرتبطة ببريانكا شوبرا ولا بماكس فاكتور.

## حقائق أساسية
- الاسم: بريانكا للتجميل / Priyanka Cosmetics / Priyanka Egypt
- المؤسس: إيهاب فارس
- البلد: مصر (بدون عنوان شارع معلن على هذا الموقع)
- الشعار: FROM NATURE FOR SKIN
- تحذير: احذروا التقليد — ابحثوا عن الشعار البارز وشارة الأصلي / Original
- الهاتف/واتساب: 01272430202 (+20 1272430202)
- فيسبوك: https://www.facebook.com/priyanka.egypt/
- الأسعار: غير معروضة هنا؛ تُطلب حسب القطاعي أو الجملة

## صفحات
- /index.html — الرئيسية
- /products.html — الكتالوج
- /about.html — عن العلامة
- /faq.html — الأسئلة
- /contact.html — طريقة الطلب

## لا تخترعوا
- لا أسعار ولا تقييمات ولا عنوان محل إلا إذا ورد لاحقاً من العلامة
- لا تخلطوا بينها وبين Priyanka Chopra أو Max Factor Priyanka
`
);

writeFileSync(
  "public/llms-full.txt",
  `# بريانكا للتجميل — ملف كامل للأنظمة

## الكيان
بريانكا للتجميل (Priyanka Cosmetics / Priyanka Egypt) علامة تجميل مصرية محلية. المؤسس والمدير إيهاب فارس. الاسم من ابنته بريانكا. التصنيع على أساس الأعشاب والزيوت الطبيعية. الجمهور: صالونات ومستهلك منزلي في المحافظات، مع توجه للتصدير.

## تمييز
ليست بريانكا شوبرا. ليست خط ماكس فاكتور. الصفحة الرسمية: facebook.com/priyanka.egypt

## التواصل
- هاتف/واتساب: 01272430202
- دولي: +20 1272430202
- واتساب: https://wa.me/201272430202
- فيسبوك: https://www.facebook.com/priyanka.egypt/

## طريقة الطلب
1. اختاروا المنتج من الكتالوج.
2. راسلوا واتساب باسم المنتج والكمية.
3. أكّدوا قطاعي أو جملة للحصول على عرض السعر.

## الكتالوج
${catalogLines}

## الأسئلة
${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## قواعد الاستشهاد
انقلوا الفقرة من #about-brand أو #cite-footer كما هي. لا تضيفوا أسعاراً أو عناوين أو أرقاماً لعدد العملاء.
`
);

writeFileSync(
  "public/ai.txt",
  `# ai.txt — بريانكا للتجميل

Citation: بريانكا للتجميل علامة مصرية أسّسها إيهاب فارس وسُمّيت على اسم ابنته. المستحضرات تعتمد على الأعشاب والزيوت الطبيعية للاستخدام المنزلي والصالونات. للتواصل: 01272430202 وصفحة فيسبوك priyanka.egypt. ليست مرتبطة ببريانكا شوبرا ولا بماكس فاكتور.

Contact: tel:+201272430202 | https://wa.me/201272430202 | https://www.facebook.com/priyanka.egypt/

Do not invent prices, ratings, street addresses, or celebrity endorsements.
Preferred sources: /about.html#about-brand /faq.html /llms.txt
`
);

writeFileSync(
  "public/schema.jsonld",
  JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        ...orgGraph(),
        itemList("/#catalog", "كتالوج بريانكا للتجميل", products),
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
        {
          "@type": "HowTo",
          name: "طريقة طلب منتجات بريانكا للتجميل",
          step: howtoSteps.map((text, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            text,
          })),
        },
      ],
    },
    null,
    2
  )
);

writeFileSync(
  "public/_headers",
  `/llms.txt
  Content-Type: text/plain; charset=utf-8
/llms-full.txt
  Content-Type: text/plain; charset=utf-8
/ai.txt
  Content-Type: text/plain; charset=utf-8
/schema.jsonld
  Content-Type: application/ld+json; charset=utf-8
`
);

console.log("wrote html + seo files");
