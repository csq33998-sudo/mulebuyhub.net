export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
  sections: {
    heading: string;
    body: string;
  }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "mulebuy-spreadsheet-update-july-2026",
    title: "Mulebuy Spreadsheet Update: Cleaner Rows and Product Links",
    description: "A short update on how MulebuyHub organizes spreadsheet rows, category pages, source references, and MaisonLooks searches.",
    category: "Spreadsheet Updates",
    date: "2026-07-30",
    readingTime: "3 min read",
    sections: [
      {
        heading: "What changed",
        body: "MulebuyHub now separates the product spreadsheet, category browsing, QC review, FAQ, and blog sections into dedicated routes. That makes each workflow easier to scan and keeps navigation predictable."
      },
      {
        heading: "How product rows are organized",
        body: "Spreadsheet rows focus on the details shoppers compare first: product image, title, category, price, QC note, rating, MaisonLooks source reference, and marketplace link."
      },
      {
        heading: "Why it matters",
        body: "A cleaner spreadsheet page helps users compare items quickly while still giving every product a stable detail page for images, tags, sizing notes, and related products."
      }
    ]
  },
  {
    slug: "how-to-read-qc-notes-before-shipping",
    title: "How to Read QC Notes Before Shipping a Haul",
    description: "A practical blog post about using QC notes, preview images, product pages, and source links before approving a shipment.",
    category: "QC Tips",
    date: "2026-07-30",
    readingTime: "4 min read",
    sections: [
      {
        heading: "Start with the product page",
        body: "Open the product page first and compare the title, image, price, brand, category, size options, and material notes. This confirms that the spreadsheet row matches the item you intended to inspect."
      },
      {
        heading: "Use QC notes as a marker",
        body: "The visible QC field tells you what reference type is available in the catalog. It should guide your review, but the final decision should still be based on warehouse photos and live seller information."
      },
      {
        heading: "Approve only after checking details",
        body: "Before international shipping, check color, shape, logos, tags, packaging, measurements, and obvious defects. If something looks wrong, request more photos or resolve the issue before shipping."
      }
    ]
  },
  {
    slug: "best-category-paths-for-finding-products",
    title: "Best Category Paths for Finding Mulebuy Products",
    description: "How to use category pages, spreadsheet rows, and product detail pages together when browsing MulebuyHub.",
    category: "Browsing Tips",
    date: "2026-07-30",
    readingTime: "3 min read",
    sections: [
      {
        heading: "Use categories for broad discovery",
        body: "Start with category pages when you know the product type but not the exact item. Shoes, jackets, accessories, bags, perfume, electronics, and other categories have different comparison signals."
      },
      {
        heading: "Use the spreadsheet for fast scanning",
        body: "The spreadsheet route works best when you want a dense table with product names, prices, ratings, QC notes, source labels, and outgoing links in one place."
      },
      {
        heading: "Use product pages for final review",
        body: "Product pages are better for final inspection because they show a larger image, full metadata, size notes, related products, and source references in a focused layout."
      }
    ]
  }
];
