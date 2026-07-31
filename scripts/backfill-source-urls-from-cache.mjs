import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { categories, guides, products } from "../src/data/catalog.ts";

const cacheDir = path.join(process.cwd(), ".tmp");

function sourceFromUrl(url = "") {
  if (url.includes("1688.com")) return "1688";
  if (url.includes("taobao.com") || url.includes("tmall.com")) return "Taobao";
  return "Weidian";
}

function safeMarketplaceUrl(url, fallback) {
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

function readCachedItems() {
  const items = [];

  for (const file of readdirSync(cacheDir)) {
    if (!file.endsWith(".json")) continue;

    try {
      const data = JSON.parse(readFileSync(path.join(cacheDir, file), "utf8"));
      if (Array.isArray(data)) items.push(...data);
    } catch {
      // Ignore empty or malformed cache files.
    }
  }

  return items;
}

const cachedItems = readCachedItems();
const bySlug = new Map();
const byTitle = new Map();

for (const item of cachedItems) {
  if (item?.slug && item?.sourceUrl) bySlug.set(item.slug, item);
  if (item?.title && item?.sourceUrl) byTitle.set(item.title.toLowerCase(), item);
}

let changed = 0;
const nextProducts = products.map((product) => {
  const maisonSlug = product.maisonUrl?.split("/").pop();
  const item = bySlug.get(maisonSlug) || bySlug.get(product.slug) || byTitle.get(product.title.toLowerCase());

  const sourceUrl = safeMarketplaceUrl(item?.sourceUrl, product.sourceUrl);

  if (!sourceUrl || sourceUrl === product.sourceUrl) {
    return product;
  }

  changed += 1;
  return {
    ...product,
    source: sourceFromUrl(sourceUrl),
    sourceUrl,
    shopName: cleanListingText(item.weidianShopName || item.shopName, product.shopName)
  };
});

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

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export const products: Product[] = ${JSON.stringify(nextProducts, null, 2)};

export const guides = ${JSON.stringify(guides, null, 2)};

export const totalFinds = categories.reduce((sum, category) => sum + category.count, 0);

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}
`;

writeFileSync(path.join(process.cwd(), "src", "data", "catalog.ts"), content);

console.log({
  cachedItems: cachedItems.length,
  products: products.length,
  changed,
  uniqueSourceUrls: new Set(nextProducts.map((product) => product.sourceUrl)).size
});
