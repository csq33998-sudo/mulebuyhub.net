import { blogPosts } from "../data/blog";
import { faq } from "../data/faq";
import { categories, guides, products } from "../data/catalog";

const baseUrl = "https://mulebuyhub.net";
const latestProductUpdate = products
  .map((product) => product.updated)
  .sort()
  .at(-1) ?? "2026-07-30";

const staticRoutes = [
  { route: "/", lastmod: latestProductUpdate },
  { route: "/spreadsheet/", lastmod: latestProductUpdate },
  { route: "/finds/", lastmod: latestProductUpdate },
  { route: "/qc/", lastmod: latestProductUpdate },
  { route: "/shipping-checklist/", lastmod: "2026-07-30" },
  { route: "/source-links/", lastmod: "2026-07-30" },
  { route: "/new/", lastmod: latestProductUpdate },
  { route: "/blog/", lastmod: "2026-07-30" },
  { route: "/faq/", lastmod: "2026-07-30" }
];
const categoryRoutes = categories.map((category) => ({ route: `/category/${category.slug}/`, lastmod: latestProductUpdate }));
const productRoutes = products.map((product) => ({ route: `/product/${product.slug}/`, lastmod: product.updated }));
const guideRoutes = guides.map((guide) => ({ route: `/guides/${guide.slug}/`, lastmod: "2026-07-30" }));
const blogRoutes = blogPosts.map((post) => ({ route: `/blog/${post.slug}/`, lastmod: post.date }));
const faqRoutes = faq.map((item) => ({ route: `/faq/${item.slug}/`, lastmod: "2026-07-30" }));

export function GET() {
  const routes = [...staticRoutes, ...categoryRoutes, ...productRoutes, ...guideRoutes, ...blogRoutes, ...faqRoutes];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ route, lastmod }) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
