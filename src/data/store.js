import {
  products as seedProducts,
  categories as seedCategories,
  faqs as seedFaqs,
  WHATSAPP,
  PHONE_DISPLAY,
  PHONE_TEL,
  FACEBOOK,
} from "./products.js";

export const DEFAULT_COPY = {
  heroEyebrow: "PRIYANKA EGYPT",
  heroTitle: "بريانكا للتجميل",
  heroAccent: "من الطبيعة للبشرة",
  heroLead:
    "مستحضرات عناية مصرية بالأعشاب والزيوت الطبيعية للصالونات والاستخدام المنزلي. عبوات الكيلو للحمام المغربي، وخطوط الشعر والجسم بشعار بريانكا البارز.",
  collectionsEyebrow: "المجموعات",
  collectionsTitle: "خطوط العناية",
  collectionsLead: "اختاروا المجموعة ثم اطلبوا الكمية عبر واتساب. الأسعار تُحدَّد حسب القطاعي أو الجملة.",
  featuredEyebrow: "مختارات",
  featuredTitle: "منتجات يسأل عنها الزبائن",
  catalogEyebrow: "الكتالوج",
  catalogTitle: "منتجات بريانكا للتجميل",
  catalogLead:
    "صور العبوات الحقيقية. اضغطوا البطاقة للتفاصيل ثم اطلبوا عبر واتساب باسم المنتج. بدون أسعار ثابتة على الموقع.",
  aboutEyebrow: "العلامة",
  aboutTitle: "عن بريانكا للتجميل",
  aboutQuote: "FROM NATURE FOR SKIN",
  aboutBody:
    "بريانكا للتجميل علامة مصرية أسّسها إيهاب فارس وسُمّيت على اسم ابنته. المستحضرات تعتمد على الأعشاب والزيوت الطبيعية للاستخدام المنزلي والصالونات. للتواصل: 01272430202 وصفحة فيسبوك priyanka.egypt. ليست مرتبطة ببريانكا شوبرا ولا بماكس فاكتور.",
  aboutLines:
    "الخطوط تشمل مقشرات الجسم (Body Desserts ومقشر الملح)، الحمام المغربي (الصابون البلدي والدلكة السودانية)، عناية الشعر (خميرة البيرة والخلطة الأفريقية والمشاط)، زيوت المساج، والصابون الطبيعي.",
  footerBlurb: "علامة مصرية للعناية بالبشرة والشعر، من الطبيعة للبشرة. الطلب عبر واتساب أو فيسبوك — بدون أسعار ثابتة على الموقع.",
};

export function makeWaLink(whatsapp, text) {
  const number = String(whatsapp || WHATSAPP).replace(/\D/g, "");
  const msg = text || "مرحباً، أود الاستفسار عن منتجات بريانكا للتجميل";
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

const DEFAULT_USAGE = {
  scrubs: "يُوزَّع على بشرة رطبة بحركات دائرية ثم يُشطف جيداً. للاستخدام الخارجي.",
  hammam: "يُستخدم في الحمام المغربي أو البخاري حسب نوع المنتج. للاستخدام الخارجي.",
  hair: "يُوزَّع على الشعر، يُدلّك بلطف ثم يُشطف. تجنّبوا ملامسة العين.",
  body: "يُستخدم على البشرة النظيفة حسب نوع المنتج. للاستخدام الخارجي.",
  massage: "يُدفأ قليلاً ويُوزَّع أثناء المساج. للاستخدام الخارجي.",
  soap: "يُستخدم مع الماء ثم يُشطف. تجنّبوا ملامسة العين.",
};

export function enrichProduct(product) {
  const item = product || {};
  return {
    active: true,
    featured: false,
    ingredients: "",
    notes: "",
    tags: [],
    ...item,
    usage: Object.prototype.hasOwnProperty.call(item, "usage")
      ? String(item.usage || "")
      : DEFAULT_USAGE[item.cat] || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

export function bundledStore() {
  return {
    version: 1,
    contact: {
      phoneDisplay: PHONE_DISPLAY,
      phoneTel: PHONE_TEL,
      whatsapp: WHATSAPP,
      facebook: FACEBOOK,
    },
    copy: { ...DEFAULT_COPY },
    categories: seedCategories.map((cat) => ({ ...cat })),
    products: seedProducts.map((item) => enrichProduct(item)),
    faqs: seedFaqs.map((item) => ({ ...item })),
  };
}

export function normalizeStore(raw) {
  const seed = bundledStore();
  const data = raw && typeof raw === "object" ? raw : {};
  const contact = { ...seed.contact, ...(data.contact || {}) };
  const copy = { ...seed.copy, ...(data.copy || {}) };
  const categories = Array.isArray(data.categories) && data.categories.length
    ? data.categories
    : seed.categories;
  const products = Array.isArray(data.products) && data.products.length
    ? data.products.map((item) => enrichProduct(item))
    : seed.products;
  const faqs = Array.isArray(data.faqs) && data.faqs.length ? data.faqs : seed.faqs;
  return { version: 1, contact, copy, categories, products, faqs };
}

export function visibleProducts(store) {
  return (store?.products || []).filter((item) => item && item.active !== false);
}

export function foldSearch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function productMatches(product, query) {
  const q = foldSearch(query);
  if (!q) return true;
  const hay = foldSearch(
    [
      product.name,
      product.en,
      product.desc,
      product.size,
      product.ingredients,
      product.usage,
      product.notes,
      ...(product.tags || []),
    ].join(" ")
  );
  return q.split(" ").every((part) => hay.includes(part));
}
