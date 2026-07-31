export type FaqItem = {
  slug: string;
  question: string;
  answer: string;
  detailTitle: string;
  detailIntro: string;
  sections: {
    heading: string;
    body: string;
  }[];
  sourceLinks: {
    label: string;
    url: string;
  }[];
};

export const faq: FaqItem[] = [
  {
    slug: "what-is-a-mulebuy-spreadsheet",
    question: "What is a Mulebuy spreadsheet?",
    answer: "A Mulebuy spreadsheet is a curated product directory that turns scattered Taobao, Weidian, 1688, and MaisonLooks-style finds into searchable rows with names, categories, prices, images, QC notes, and source links.",
    detailTitle: "What Is a Mulebuy Spreadsheet?",
    detailIntro: "A Mulebuy spreadsheet is not a checkout platform by itself. It is a research layer that helps shoppers compare products before opening the original seller or agent link.",
    sections: [
      {
        heading: "What it organizes",
        body: "A useful spreadsheet groups product names, category labels, prices, preview images, seller/source labels, QC status, ratings, and outbound links into one scannable table. This makes it faster to compare similar items without opening dozens of marketplace pages first."
      },
      {
        heading: "How it connects to Mulebuy",
        body: "Mulebuy's shopping-agent workflow is based on finding an item, pasting a product link or searching by product details, choosing options, paying for the item and domestic shipping, then waiting for warehouse inspection before international shipping."
      },
      {
        heading: "How to use it safely",
        body: "Treat each row as a starting point. Check the product title, price, image, category, available sizes, QC notes, and current seller page before ordering. Marketplace availability and seller details can change, so the final confirmation should happen on the linked platform."
      }
    ],
    sourceLinks: [
      {
        label: "Mulebuy shopping assistant guidance",
        url: "https://2024.mulebuy.com/help-center/shopping-assistant-guidance/"
      },
      {
        label: "Mulebuy spreadsheet reference example",
        url: "/spreadsheet/"
      }
    ]
  },
  {
    slug: "how-often-is-mulebuyhub-updated",
    question: "How often is MulebuyHub updated?",
    answer: "MulebuyHub is built for regular catalog refreshes: outdated rows can be replaced, product pages can keep source references consistent, and spreadsheet rows can show the latest QC, price, category, and source context available in the site data.",
    detailTitle: "How Often Is MulebuyHub Updated?",
    detailIntro: "MulebuyHub is structured like a static spreadsheet directory, so updates happen by refreshing product data, rebuilding pages, and keeping outgoing links consistent.",
    sections: [
      {
        heading: "What gets refreshed",
        body: "The main update targets are product titles, category assignment, product images, price labels, QC notes, ratings, source labels, and outbound references. When a row changes, its category page, product page, spreadsheet row, and sitemap can all be regenerated together."
      },
      {
        heading: "Why updates matter",
        body: "Shopping-agent links and marketplace listings are not permanent. Sellers can remove products, change options, adjust prices, or replace images. A spreadsheet-style site needs periodic cleanup so users do not rely on stale rows."
      },
      {
        heading: "How users should verify",
        body: "Use MulebuyHub for discovery and comparison, then verify live availability on the linked source page before purchase. For warehouse-stage decisions, rely on the agent's QC photos and order status rather than the preview image alone."
      }
    ],
    sourceLinks: [
      {
        label: "Mulebuy quality check guide",
        url: "https://mulebuy.com/help/quality-check/"
      },
      {
        label: "Mulebuy help center",
        url: "https://2024.mulebuy.com/help-center/"
      }
    ]
  },
  {
    slug: "why-use-category-pages",
    question: "Why use category pages instead of one giant list?",
    answer: "Category pages make the spreadsheet easier to scan because shoes, jackets, accessories, electronics, bags, perfume, and other finds have different comparison needs, size checks, QC signals, and search intent.",
    detailTitle: "Why Use Category Pages Instead of One Giant List?",
    detailIntro: "A single long list is hard to compare. Category pages create smaller decision surfaces for users and cleaner topic groups for search engines.",
    sections: [
      {
        heading: "Better product comparison",
        body: "Users compare sneakers differently from watches, bags, perfume, or electronics. Category pages let each group show more relevant titles, images, tags, materials, sizes, QC notes, and related products."
      },
      {
        heading: "Cleaner browsing paths",
        body: "Spreadsheet users often start with a product type rather than a specific title. A dedicated category page lets them move from broad browsing to a product detail page without scanning hundreds of unrelated rows."
      },
      {
        heading: "Stronger page relevance",
        body: "Search engines can understand dedicated pages for shoes, accessories, jackets, and other categories more clearly than one mixed page. This helps each page match more precise search intent."
      }
    ],
    sourceLinks: [
      {
        label: "MaisonLooks category/search reference",
        url: "https://streetstyle.maisonlooks.com/en/search"
      },
      {
        label: "Mulebuy category spreadsheet example",
        url: "/finds/"
      }
    ]
  }
];
