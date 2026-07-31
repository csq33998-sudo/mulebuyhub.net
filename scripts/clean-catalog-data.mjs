import { writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { categories, guides, products } from "../src/data/catalog.ts";

const outputFile = path.resolve("src/data/catalog.ts");
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

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 82) || "product";
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

function safeMarketplaceUrl(value, fallback) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) {
      return fallback;
    }
    return url.toString();
  } catch {
    return fallback;
  }
}

const usedSlugs = new Set();
let changed = 0;

const nextProducts = products.map((product) => {
  const title = cleanListingText(product.title, product.title);
  let slug = product.slug;

  if (/whatsapp|contact|if-u-need|(?:\d[-]?){8,}/i.test(slug)) {
    slug = slugify(title);
  }

  const baseSlug = slug;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(slug);

  const next = {
    ...product,
    slug,
    title,
    tags: product.tags.map((tag) => cleanListingText(tag, "")).filter(Boolean).slice(0, 4),
    imageAlt: cleanListingText(product.imageAlt, title),
    sourceUrl: safeMarketplaceUrl(product.sourceUrl, "https://weidian.com/"),
    maisonUrl: safeMarketplaceUrl(product.maisonUrl, "https://streetstyle.maisonlooks.com/"),
    shopName: cleanListingText(product.shopName, "MaisonLooks seller"),
    description: cleanListingText(product.description, `${title} from the linked source listing.`)
  };

  if (JSON.stringify(next) !== JSON.stringify(product)) {
    changed += 1;
  }

  return next;
});

const nextCategories = categories.map((category) => ({
  ...category,
  imageAlt: cleanListingText(category.imageAlt, category.name)
}));

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

export const categories: Category[] = ${JSON.stringify(nextCategories, null, 2)};

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

writeFileSync(outputFile, content);

console.log({ changed, products: nextProducts.length, file: pathToFileURL(outputFile).href });
