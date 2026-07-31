import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const TODAY = "2026-07-31";
const ROOT = process.cwd();
const PRODUCT_DIR = path.join(ROOT, "public", "products");
const API_BASE = "https://api.maisonlooks.com/products?limit=500";
const FALLBACK_SELLER_URL = "https://weidian.com/item.html?itemID=7632057834";
const WEIDIAN_SHOP_ITEMS_CACHE = path.join(ROOT, ".tmp", "weidian-shop-items.json");
const CNY_PER_USD = 6.7713;
let allowedWeidianIds = null;
let weidianShopItems = [];

const sourceCategoryIds = {
  sneakers: "c022185e-db9a-4d42-8143-d0a2df35f7b5",
  boots: "cd2c73b4-5808-4f47-a94e-69939cadafe0",
  sandals: "f3c8a7f4-bc93-48ea-a3c9-17d59987e7f7",
  loafers: "8d8143c1-bf9f-45ee-8a34-f3dcb7a496fe",
  heels: "0689c81c-7e0e-4998-ac13-d57c125d476a",
  blazers: "1d13de8d-eb57-4796-b61f-df821454484e",
  parkas: "b9d9b217-a356-4884-9399-bdc265f52f01",
  coats: "51043275-bfe9-4e33-af94-610fb5007fe7",
  jackets: "cf585fc9-d144-4808-b227-b03388ab917e",
  shirts: "381a2658-25f0-48c5-9b69-16ae9fec833c",
  tshirts: "72cd0d02-e6fb-4ee0-ae00-d6f8974c6238",
  hoodies: "98623df7-801b-4bcc-b54d-2d4195b438ae",
  sweaters: "2a4b4967-ae8a-42e9-a4d5-d687982ab212",
  pants: "b2739d9c-e354-4378-bc46-d46473f89360",
  shorts: "3eebd8c2-cdfe-48b1-9270-2fc4cf2c1e59",
  jeans: "2b74606f-4013-4dd5-b1dc-e0110150ada3",
  skirts: "ae5b15dc-5a93-42bf-8fb4-fcfd8052d1bc",
  headwear: "b4f73cce-862e-4530-ae8f-dfc889010970",
  eyewear: "5a00c721-5815-435e-8547-fa13635f0e21",
  belts: "97cf032e-e1a3-4047-bb26-402dcdc10fa6",
  socks: "ca37f1cc-19d4-4446-aa1d-fa7dd33fece5",
  jewelry: "6449e4ce-e66b-48af-a0b4-1a920bfd3ee1",
  scarves: "1e84cb36-9d4e-48f8-a04a-d6403b5fd6e6",
  accessoryOthers: "9dc39fb8-87c2-412a-92b3-fcd027810c8e",
  bags: "d616e61f-1f3b-4680-98b8-74d73af050b3",
  perfume: "eeceae98-2563-4d65-afbd-375a9546fbe3",
  skincare: "e23a3255-43f8-444b-8e7a-96547aadea54",
  makeup: "887f955f-331b-4302-9958-cef01b8605f8",
  electronics: "46482042-51d7-4424-9aa6-130c862d12af",
  audio: "da5ed9bc-65fe-4e4d-83bc-b65cc255ef55",
  phone: "9e62fcf0-c736-43d5-aed7-e1981e403791",
  wearables: "83bb4c73-194d-48f5-af94-8c876bafddf0",
  personalCare: "d5551d09-2d38-4075-b43b-6d9e9ba4eeb9",
  underwear: "428ed6bb-6495-4d67-9caf-0c5b0f2c8671"
};

const categories = [
  {
    slug: "shoes",
    name: "Shoes",
    description: "Sneakers, boots, sandals, loafers, flats, heels, and daily streetwear pairs.",
    count: 4120,
    accent: "#0f766e",
    targetCount: 21,
    sourceKeys: ["sneakers", "boots", "sandals", "loafers", "heels"],
    sourceQuotas: [
      { key: "sneakers", count: 9, filter: /sneaker|shoe|jordan|air force|air max|shox|trainer|runner/i },
      { key: "boots", count: 3, filter: /boot/i },
      { key: "sandals", count: 3, filter: /sandal|slipper|slide|clog/i },
      { key: "loafers", count: 3, filter: /loafer|flat|mule/i },
      { key: "heels", count: 3, filter: /heel|pump|sandal/i }
    ]
  },
  {
    slug: "jackets",
    name: "Jackets",
    description: "Zip-up jackets, monogram windbreakers, outerwear, coats, parkas, blazers, and seasonal layers.",
    count: 1320,
    accent: "#2563eb",
    targetCount: 21,
    sourceKeys: ["parkas", "coats", "jackets", "blazers"],
    sourceQuotas: [
      { key: "parkas", count: 6, filter: /parka|down|puffer|jacket|coat/i },
      { key: "coats", count: 5, filter: /coat|trench|jacket|outerwear/i },
      { key: "jackets", count: 5, filter: /jacket|zip|windbreaker|shell/i },
      { key: "blazers", count: 5, filter: /blazer|jacket|suit/i }
    ]
  },
  {
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Graphic tees, long sleeves, polos, shirts, embroidered tops, and oversized streetwear staples.",
    count: 2135,
    accent: "#dc2626",
    targetCount: 21,
    sourceKeys: ["tshirts", "shirts"],
    sourceQuotas: [
      { key: "tshirts", count: 13, filter: /t-shirt|tee|long sleeve|polo|top/i, exclude: /jersey|football|soccer/i },
      { key: "shirts", count: 8, filter: /shirt|blouse|polo|top/i, exclude: /jersey|football|soccer/i }
    ]
  },
  {
    slug: "hoodies-sweaters",
    name: "Hoodies/Sweaters",
    description: "Logo hoodies, zip-ups, sweatshirts, sweaters, knits, and fleece finds.",
    count: 1760,
    accent: "#7c3aed",
    targetCount: 21,
    sourceKeys: ["hoodies", "sweaters"],
    sourceQuotas: [
      { key: "hoodies", count: 13, filter: /hoodie|sweatshirt|zip-up|fleece/i },
      { key: "sweaters", count: 8, filter: /sweater|knit|cardigan|crewneck/i }
    ]
  },
  {
    slug: "pants-shorts",
    name: "Pants/Shorts",
    description: "Cargo pants, trousers, jeans, sweatpants, drawstring shorts, skirts, and relaxed bottoms.",
    count: 1185,
    accent: "#ca8a04",
    targetCount: 21,
    sourceKeys: ["shorts", "pants", "jeans", "skirts"],
    sourceQuotas: [
      { key: "shorts", count: 6, filter: /short/i },
      { key: "pants", count: 7, filter: /pant|trouser|cargo|sweatpant|jogger/i },
      { key: "jeans", count: 4, filter: /jean|denim/i },
      { key: "skirts", count: 4, filter: /skirt/i }
    ]
  },
  {
    slug: "headwear",
    name: "Headwear",
    description: "Caps, beanies, balaclavas, hats, and small streetwear headwear pieces.",
    count: 520,
    accent: "#be123c",
    targetCount: 21,
    sourceKeys: ["headwear"],
    sourceQuotas: [
      { key: "headwear", count: 21, filter: /cap|beanie|hat|headwear|balaclava/i }
    ]
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Eyewear, belts, jewelry, socks, scarves, ties, headwear, and compact haul add-ons.",
    count: 905,
    accent: "#0891b2",
    targetCount: 21,
    sourceKeys: ["eyewear", "belts", "jewelry", "socks", "scarves", "accessoryOthers", "headwear"],
    sourceQuotas: [
      { key: "eyewear", count: 3, filter: /eyewear|sunglasses|glasses|frame/i },
      { key: "belts", count: 3, filter: /belt|buckle/i },
      { key: "jewelry", count: 3, filter: /bracelet|necklace|ring|pendant|earring|jewelry|chain|watch/i, exclude: /rolex|datejust|oyster|perpetual/i },
      { key: "socks", count: 3, filter: /sock|hosiery/i },
      { key: "scarves", count: 3, filter: /scarf|tie|blanket/i },
      { key: "accessoryOthers", count: 3, filter: /accessory|keychain|blanket|gloves|mask|holder|case|wallet/i },
      { key: "headwear", count: 3, filter: /cap|beanie|hat|headwear|balaclava/i }
    ]
  },
  {
    slug: "jersey",
    name: "Jersey",
    description: "Football jerseys, collab jerseys, athletic tops, and fan-style statement pieces.",
    count: 640,
    accent: "#16a34a",
    targetCount: 21,
    sourceKeys: ["shirts", "tshirts"],
    filter: /jersey|football|soccer|team|club|brazil|germany|italy|portugal|flamengo|milan|paris|psg/i,
    sourceQuotas: [
      { key: "shirts", count: 15, filter: /jersey|football|soccer|team|club|brazil|germany|italy|portugal|flamengo|milan|paris|psg/i },
      { key: "tshirts", count: 6, filter: /jersey|football|soccer|team|club|brazil|germany|italy|portugal|flamengo|milan|paris|psg/i }
    ]
  },
  {
    slug: "bags",
    name: "Bags",
    description: "Backpacks, wallets, card holders, crossbody bags, belt bags, totes, and travel-ready small goods.",
    count: 780,
    accent: "#9333ea",
    targetCount: 21,
    sourceKeys: ["bags"],
    sourceQuotas: [
      { key: "bags", count: 21, filter: /bag|backpack|wallet|card holder|tote|crossbody|pouch|messenger|handbag/i }
    ]
  },
  {
    slug: "perfume",
    name: "Perfume",
    description: "Eau de parfum, fragrance bottles, skincare, makeup, designer scents, and grooming add-ons.",
    count: 260,
    accent: "#db2777",
    targetCount: 21,
    sourceKeys: ["perfume", "skincare", "makeup"],
    sourceQuotas: [
      { key: "perfume", count: 15, filter: /perfume|fragrance|parfum|eau de|cologne|scent/i },
      { key: "skincare", count: 3, filter: /cream|serum|lotion|skincare|cleanser|mask/i },
      { key: "makeup", count: 3, filter: /makeup|lipstick|foundation|powder|blush|palette/i }
    ]
  },
  {
    slug: "electronics",
    name: "Electronics",
    description: "Earbuds, headphones, smart watches, charging cases, phone accessories, and useful haul electronics.",
    count: 340,
    accent: "#475569",
    targetCount: 21,
    sourceKeys: ["audio", "phone", "wearables", "personalCare", "electronics"],
    sourceQuotas: [
      { key: "audio", count: 7, filter: /airpods|earbud|headphone|speaker|audio|headset/i },
      { key: "phone", count: 5, filter: /phone|case|magsafe|pencil|airtag|charger|stylus/i },
      { key: "wearables", count: 5, filter: /watch|wearable|band|smartwatch/i },
      { key: "personalCare", count: 2, filter: /shaver|dryer|trimmer|brush|personal care/i },
      { key: "electronics", count: 2, filter: /airpods|earbud|headphone|watch|phone|case|charger|electronic/i }
    ]
  },
  {
    slug: "other-stuff",
    name: "Other stuff",
    description: "Mixed finds from underwear, swim, cases, scarves, blankets, and small accessories that do not fit neatly into one lane.",
    count: 590,
    accent: "#525252",
    targetCount: 21,
    sourceKeys: ["underwear", "phone", "scarves", "accessoryOthers", "jewelry"],
    exclude: /rolex|datejust|oyster|perpetual|dial/i,
    sourceQuotas: [
      { key: "underwear", count: 5, filter: /underwear|boxer|brief|swim|trunk/i },
      { key: "phone", count: 5, filter: /case|holder|airtag|pencil|phone|magsafe/i },
      { key: "scarves", count: 4, filter: /scarf|blanket|tie/i },
      { key: "accessoryOthers", count: 4, filter: /blanket|case|holder|wallet|accessory|keychain|gloves|mask/i },
      { key: "jewelry", count: 3, filter: /bracelet|necklace|ring|pendant|chain|jewelry/i, exclude: /watch|rolex|datejust|oyster|perpetual|dial/i }
    ]
  }
];

const categoryImages = {
  shoes: "",
  jackets: "",
  "t-shirts": "",
  "hoodies-sweaters": "",
  "pants-shorts": "",
  headwear: "",
  accessories: "",
  jersey: "",
  bags: "",
  perfume: "",
  electronics: "",
  "other-stuff": ""
};

const guides = [
  {
    slug: "how-to-use-mulebuy-spreadsheet",
    title: "How to Use a Mulebuy Spreadsheet",
    description: "A practical guide to opening links, checking QC photos, and building a safer haul.",
    sections: [
      {
        heading: "Start with categories",
        body: "Use category pages when you want to browse by product type before opening a dense spreadsheet view."
      },
      {
        heading: "Check source links",
        body: "Open the product source before ordering so the live seller title, image, price, and stock match your intended item."
      },
      {
        heading: "Review before shipping",
        body: "Use QC photos and product metadata together before approving a parcel for international shipping."
      }
    ]
  },
  {
    slug: "mulebuy-qc-photos-guide",
    title: "Mulebuy QC Photos Guide",
    description: "What to inspect before shipping: stitching, tags, shape, measurements, and packaging.",
    sections: [
      {
        heading: "Compare the visible details",
        body: "Check color, shape, logos, trims, and product proportions against the source listing before approving the item."
      },
      {
        heading: "Ask for measurements",
        body: "For clothing, bags, and shoes, measurements are often more useful than a single warehouse photo."
      },
      {
        heading: "Inspect packaging last",
        body: "Packaging can matter for gifts or resale, but the product condition and sizing should be reviewed first."
      }
    ]
  },
  {
    slug: "best-mulebuy-finds-2026",
    title: "Best Mulebuy Finds 2026",
    description: "A category-by-category way to browse updated Mulebuy links without losing track.",
    sections: [
      {
        heading: "Browse broad categories",
        body: "Start with the category that matches your target item, then use product pages to compare images and source links."
      },
      {
        heading: "Use the spreadsheet for scanning",
        body: "The spreadsheet is best for quickly comparing titles, prices, categories, QC notes, and outgoing purchase links."
      },
      {
        heading: "Open product pages for detail",
        body: "Product pages collect larger images, tags, fit notes, size options, source links, and related items in one place."
      }
    ]
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 82);
}

function sourceFromUrl(url = "") {
  if (url.includes("1688.com")) return "1688";
  if (url.includes("taobao.com") || url.includes("tmall.com")) return "Taobao";
  return "Weidian";
}

function safeMarketplaceUrl(url, fallback = FALLBACK_SELLER_URL) {
  const allowedHosts = new Set([
    "streetstyle.maisonlooks.com",
    "weidian.com",
    "www.weidian.com",
    "1688.com",
    "www.1688.com",
    "taobao.com",
    "www.taobao.com",
    "tmall.com",
    "www.tmall.com"
  ]);

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !allowedHosts.has(parsed.hostname)) {
      return fallback;
    }
    return parsed.toString();
  } catch {
    return fallback;
  }
}

function cleanListingText(value, fallback = "") {
  const text = String(value ?? fallback)
    .replace(/\(?\s*(?:pls\s*)?contact.*$/i, "")
    .replace(/\bwhats\s*app\b\s*[:+]?\s*[\d\s()+-]*/gi, "")
    .replace(/\bwhatsapp\b\s*[:+]?\s*[\d\s()+-]*/gi, "")
    .replace(/\bif\s*u\s*need\s*size\s*recommendation\b/gi, "")
    .replace(/private\s*agent/gi, "")
    .replace(/\+?\d[\d\s()+-]{7,}\d/g, "")
    .replace(/\s+/g, " ")
    .replace(/[()]+$/g, "")
    .replace(/[-+:]\s*$/g, "")
    .trim();

  return text || fallback;
}

function tagsFor(item) {
  const tags = [
    item.brand?.canonicalName,
    item.colorMain,
    item.primaryCategory?.name,
    ...(item.styleTags ?? [])
  ].filter(Boolean);
  return [...new Set(tags)].slice(0, 4);
}

function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function cleanSizeLabel(size) {
  const value = String(size ?? "").trim();
  const ascii = value.match(/^[\x20-\x7e]+/)?.[0]?.trim();
  if (!ascii) return "";
  const compact = ascii.replace(/\s+/g, " ");
  const lengthMatch = compact.match(/^\d{2,3}cm(?:\(Length\))?/i);
  if (lengthMatch) return lengthMatch[0];
  if (compact.length <= 24) return compact;
  return "";
}

function formatUsdFromCny(value) {
  const cny = Number(value || 0);
  if (!Number.isFinite(cny)) return "$0.00";
  return `$${(cny / CNY_PER_USD).toFixed(2)}`;
}

function assertHttpsUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error(`Refusing non-HTTPS URL: ${value}`);
  }
  return url;
}

function productOutputPath(filename) {
  const output = path.resolve(PRODUCT_DIR, filename);
  const relative = path.relative(PRODUCT_DIR, output);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing product image path outside ${PRODUCT_DIR}: ${filename}`);
  }
  return output;
}

async function fetchWithHeaders(url, headers = {}) {
  assertHttpsUrl(url);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      ...headers
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response;
}

async function fetchText(url) {
  await mkdir(path.join(ROOT, ".tmp"), { recursive: true });
  const output = path.join(ROOT, ".tmp", `${slugify(url)}.json`);
  const response = await fetchWithHeaders(url, {
    Origin: "https://streetstyle.maisonlooks.com",
    Referer: "https://streetstyle.maisonlooks.com/en/s/streetstyle"
  });
  const text = await response.text();
  await writeFile(output, text);
  return text;
}

async function fetchProductsFor(key) {
  const categoryId = sourceCategoryIds[key];
  const url = categoryId ? `${API_BASE}&categoryId=${categoryId}` : API_BASE;
  const text = await fetchText(url);
  return JSON.parse(text);
}

async function downloadImage(url, filename) {
  const output = productOutputPath(filename);
  try {
    await access(output);
    return true;
  } catch {
    // Missing locally; download below.
  }

  try {
    const response = await fetchWithHeaders(url);
    await writeFile(output, Buffer.from(await response.arrayBuffer()));
    return true;
  } catch (error) {
    const fallbackUrl = url.replace(/_\d+_\d+(\.(?:gif|jpe?g|png|webp))(?:[?#].*)?$/i, "$1");
    if (fallbackUrl === url) {
      console.warn(`Image download failed for ${filename}: ${error.message}`);
      return false;
    }

    try {
      const response = await fetchWithHeaders(fallbackUrl);
      await writeFile(output, Buffer.from(await response.arrayBuffer()));
      return true;
    } catch (fallbackError) {
      console.warn(`Image download failed for ${filename}: ${fallbackError.message}`);
      return false;
    }
  }
}

async function runLimited(items, limit, worker) {
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const item = items[index];
      index += 1;
      await worker(item);
    }
  });
  await Promise.all(workers);
}

function itemMatchesRules(item, rules = {}) {
  if (!item?.title || !item?.imageUrl || !item?.slug) return false;
  if (allowedWeidianIds?.size) {
    const id = String(
      item.splitSourceWeidianId ||
        item.weidianId ||
        item.sourceUrl?.match(/itemID=(\d+)/)?.[1] ||
        ""
    );
    if (!allowedWeidianIds.has(id)) return false;
  }
  if (rules.filter && !rules.filter.test(item.title)) return false;
  if (rules.exclude && rules.exclude.test(item.title)) return false;
  return true;
}

function shopFallbackMatches(categorySlug, item) {
  const text = `${item.itemName ?? ""} ${item.itemComment ?? ""}`;
  const rules = {
    shoes: /鞋|靴|拖|凉鞋|sneaker|shoe|boot|slide|slipper|sandal/i,
    jackets: /羽绒|夹克|外套|棉服|冲锋|jacket|coat|parka|down/i,
    "t-shirts": /短袖|T恤|T-shirt|tee|polo|衬衫/i,
    "hoodies-sweaters": /卫衣|帽衫|毛衣|针织|hoodie|sweater|knit/i,
    "pants-shorts": /裤|短裤|牛仔|休闲裤|pants|shorts|jeans|trousers/i,
    headwear: /帽|cap|beanie|hat/i,
    accessories: /眼镜|腰带|皮带|项链|手链|戒指|袜|围巾|glasses|belt|necklace|bracelet|ring|sock|scarf/i,
    jersey: /球衣|足球|篮球|jersey|soccer|football|nba/i,
    bags: /包|背包|钱包|bag|backpack|wallet|tote/i,
    perfume: /香水|香氛|perfume|fragrance|parfum/i,
    electronics: /耳机|手机|手表|充电|音箱|吹风机|airpods|phone|watch|speaker|dyson/i,
    "other-stuff": /内裤|泳裤|套装|自营|underwear|boxer|brief|set/i
  };
  return rules[categorySlug]?.test(text) ?? false;
}

function familyKeyFor(item) {
  return [
    item.parentGroupId,
    item.splitSourceWeidianId,
    item.weidianId,
    item.sourceUrl,
    normalizeTitle(item.title).split(" ").slice(0, 5).join(" ")
  ].find(Boolean);
}

function pushUniqueSelection(selected, item, usedImages, usedTitles, localState, options = {}) {
  const normalized = normalizeTitle(item.title);
  if (usedImages.has(item.imageUrl) || usedTitles.has(normalized)) return false;
  const familyKey = familyKeyFor(item);
  const brandKey = item.brand?.canonicalName ?? "MaisonLooks";
  const brandCount = localState.brandCounts.get(brandKey) ?? 0;
  if (!options.relaxed) {
    if (familyKey && localState.familyKeys.has(familyKey)) return false;
    if (brandCount >= (options.brandLimit ?? 3)) return false;
  } else if (brandCount >= (options.relaxedBrandLimit ?? 6)) {
    return false;
  }
  selected.push(item);
  usedImages.add(item.imageUrl);
  usedTitles.add(normalized);
  if (familyKey) localState.familyKeys.add(familyKey);
  localState.brandCounts.set(brandKey, brandCount + 1);
  return true;
}

function toProduct(item, categorySlug, usedSlugs) {
  const title = cleanListingText(item.title, "MaisonLooks product");
  const sourceUrl = safeMarketplaceUrl(item.sourceUrl);
  let baseSlug = slugify(item.slug || title);
  let slug = baseSlug;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(slug);
  const filename = `${slug}.webp`;
  const rating = (4.55 + ((title.length + categorySlug.length) % 35) / 100).toFixed(1);
  return {
    slug,
    title,
    category: categorySlug,
    price: formatUsdFromCny(item.price || item.priceRange),
    source: sourceFromUrl(sourceUrl),
    tags: tagsFor(item),
    qc: item.hasQcPhotos ? "QC photos available" : "MaisonLooks image",
    updated: TODAY,
    rating,
    image: `/products/${filename}`,
    imageAlt: title,
    sourceUrl,
    maisonUrl: `https://streetstyle.maisonlooks.com/en/p/${item.slug}`,
    brand: item.brand?.canonicalName ?? "MaisonLooks",
    shopName: cleanListingText(item.weidianShopName || item.shopName, "MaisonLooks seller"),
    description: cleanListingText(item.description || item.seoDescription, `${title} from MaisonLooks streetstyle catalog.`),
    color: item.colorMain || "Mixed",
    material: item.material || "See source listing",
    fit: item.fitType || item.genderFit || "Regular",
    sizes: [...new Set((item.availableSizes ?? []).map(cleanSizeLabel).filter(Boolean))].slice(0, 6),
    localImageFile: filename,
    originalImageUrl: item.imageUrl
  };
}

function toFallbackProduct(item, categorySlug, usedSlugs) {
  let baseSlug = slugify(item.itemName || `weidian-${item.itemId}`);
  if (!baseSlug) baseSlug = `weidian-${item.itemId}`;
  let slug = baseSlug;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(slug);

  const title = cleanListingText(item.itemName, `Weidian item ${item.itemId}`);
  const imageUrl = item.itemImg || "";
  const extMatch = imageUrl.match(/\.(webp|png|jpe?g|gif)(?:[?#_]|$)/i);
  const ext = extMatch?.[1]?.toLowerCase().replace("jpeg", "jpg") || "jpg";
  const filename = `${slug}.${ext}`;

  return {
    slug,
    title,
    category: categorySlug,
    price: formatUsdFromCny(item.price),
    source: "Weidian",
    tags: ["Weidian", categorySlug, cleanListingText(item.itemComment, "")].filter(Boolean).slice(0, 4),
    qc: "Weidian shop image",
    updated: TODAY,
    rating: "4.6",
    image: `/products/${filename}`,
    imageAlt: title,
    sourceUrl: safeMarketplaceUrl(item.itemUrl || `https://weidian.com/item.html?itemID=${item.itemId}`),
    maisonUrl: `https://streetstyle.maisonlooks.com/en/search?q=${encodeURIComponent(title)}`,
    brand: "Weidian",
    shopName: "夕阳的刻痕",
    description: cleanListingText(item.itemComment, `${title} from the linked Weidian shop.`),
    color: "See source listing",
    material: "See source listing",
    fit: "Regular",
    sizes: [],
    localImageFile: filename,
    originalImageUrl: imageUrl
  };
}

async function main() {
  await mkdir(PRODUCT_DIR, { recursive: true });
  try {
    weidianShopItems = JSON.parse((await readFile(WEIDIAN_SHOP_ITEMS_CACHE, "utf8")).replace(/^\uFEFF/, ""));
    allowedWeidianIds = new Set(weidianShopItems.map((item) => String(item.itemId)).filter(Boolean));
    console.log(`Filtering MaisonLooks products against ${allowedWeidianIds.size} Weidian shop item IDs.`);
  } catch {
    console.log("No Weidian shop item cache found; importing from MaisonLooks without shop filtering.");
  }

  const cache = new Map();
  for (const key of new Set(categories.flatMap((category) => category.sourceKeys))) {
    cache.set(key, await fetchProductsFor(key));
  }

  const usedImages = new Set();
  const usedTitles = new Set();
  const usedSlugs = new Set();
  const products = [];

  for (const category of categories) {
    const targetCount = category.targetCount ?? 21;
    const selected = [];
    const localState = { familyKeys: new Set(), brandCounts: new Map() };

    for (const quota of category.sourceQuotas ?? []) {
      let pickedForQuota = 0;
      for (const item of cache.get(quota.key) ?? []) {
        if (!itemMatchesRules(item, quota)) continue;
        if (!pushUniqueSelection(selected, item, usedImages, usedTitles, localState, { brandLimit: quota.brandLimit ?? 3 })) continue;
        pickedForQuota += 1;
        if (pickedForQuota === quota.count) break;
      }
      for (const item of cache.get(quota.key) ?? []) {
        if (pickedForQuota === quota.count) break;
        if (!itemMatchesRules(item, quota)) continue;
        if (!pushUniqueSelection(selected, item, usedImages, usedTitles, localState, { relaxed: true, relaxedBrandLimit: quota.relaxedBrandLimit ?? 6 })) continue;
        pickedForQuota += 1;
      }
    }

    const candidates = category.sourceKeys.flatMap((key) => cache.get(key) ?? []);
    for (const item of candidates) {
      if (selected.length === targetCount) break;
      if (!itemMatchesRules(item, category)) continue;
      pushUniqueSelection(selected, item, usedImages, usedTitles, localState, { brandLimit: category.brandLimit ?? 3 });
    }
    for (const item of candidates) {
      if (selected.length === targetCount) break;
      if (!itemMatchesRules(item, category)) continue;
      pushUniqueSelection(selected, item, usedImages, usedTitles, localState, { relaxed: true, relaxedBrandLimit: category.relaxedBrandLimit ?? 7 });
    }
    for (const item of weidianShopItems) {
      if (selected.length === targetCount) break;
      if (!shopFallbackMatches(category.slug, item)) continue;
      const normalized = normalizeTitle(item.itemName || item.itemId);
      if (usedTitles.has(normalized)) continue;
      selected.push(item);
      usedTitles.add(normalized);
      if (item.itemImg) usedImages.add(item.itemImg);
    }
    if (selected.length < 18) {
      throw new Error(`${category.slug} only selected ${selected.length} products`);
    }
    for (const item of selected) {
      products.push(item.itemId ? toFallbackProduct(item, category.slug, usedSlugs) : toProduct(item, category.slug, usedSlugs));
    }
  }

  await runLimited(products, 8, async (product) => {
    const ok = await downloadImage(product.originalImageUrl, product.localImageFile);
    if (!ok) {
      product.image = "/og.png";
      product.qc = "Source image unavailable";
    }
  });

  for (const category of categories) {
    const first = products.find((product) => product.category === category.slug);
    categoryImages[category.slug] = first?.image ?? "/og.png";
  }

  const categoryObjects = categories.map(({ sourceKeys, sourceQuotas, filter, exclude, targetCount, ...category }) => ({
    ...category,
    image: categoryImages[category.slug],
    imageAlt: products.find((product) => product.category === category.slug)?.title ?? category.name
  }));

  const productObjects = products.map(({ localImageFile, originalImageUrl, ...product }) => product);
  const content = `export type Category = {
  slug: string;
  name: string;
  description: string;
  count: number;
  accent: string;
  image: string;
  imageAlt: string;
};

export type Product = {
  slug: string;
  title: string;
  category: string;
  price: string;
  source: "Taobao" | "Weidian" | "1688";
  tags: string[];
  qc: string;
  updated: string;
  rating: string;
  image: string;
  imageAlt: string;
  sourceUrl: string;
  maisonUrl: string;
  brand: string;
  shopName: string;
  description: string;
  color: string;
  material: string;
  fit: string;
  sizes: string[];
};

export const categories: Category[] = ${JSON.stringify(categoryObjects, null, 2)};

export const products: Product[] = ${JSON.stringify(productObjects, null, 2)};

export const guides = ${JSON.stringify(guides, null, 2)};

export const totalFinds = categories.reduce((sum, category) => sum + category.count, 0);

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}
`;

  await writeFile(path.join(ROOT, "src", "data", "catalog.ts"), content);
  console.log(`Imported ${products.length} products across ${categories.length} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
