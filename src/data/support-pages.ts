export type SupportPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  updated: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
};

export const supportPages: SupportPage[] = [
  {
    slug: "about",
    title: "About MulebuyHub",
    description: "Learn how MulebuyHub helps shoppers browse curated finds, QC references, category pages, and product source links.",
    eyebrow: "About",
    updated: "2026-08-09",
    sections: [
      {
        heading: "What MulebuyHub does",
        body: [
          "MulebuyHub is an independent product discovery and shopping guide site. We organize spreadsheet-style product finds, category pages, QC references, and source links so visitors can compare items before opening an external shopping page.",
          "We do not claim to manufacture, own, or represent the brands shown in product titles, images, or source listings. Product names and references are used to help users identify and compare listings."
        ]
      },
      {
        heading: "How product links work",
        body: [
          "Many product pages include outbound links to third-party marketplaces, agents, or seller pages. When you leave MulebuyHub, the external site is responsible for checkout, payment, shipping, returns, product availability, and customer service.",
          "Visitors should review the external seller page, QC information, sizing, total cost, and shipping terms before making any purchase decision."
        ]
      }
    ]
  },
  {
    slug: "contact",
    title: "Contact MulebuyHub",
    description: "Contact MulebuyHub for site questions, product link updates, removal requests, and general feedback.",
    eyebrow: "Contact",
    updated: "2026-08-09",
    sections: [
      {
        heading: "Site support",
        body: [
          "For website questions, broken links, product update requests, or content removal requests, contact us at contact@mulebuyhub.net.",
          "Please include the page URL, the product title if relevant, and a short description of the issue so we can review it efficiently."
        ]
      },
      {
        heading: "Order questions",
        body: [
          "MulebuyHub does not process payments, ship orders, or manage third-party seller accounts. If your question is about an order, tracking number, return, refund, or payment, contact the marketplace, agent, or seller where the order was placed.",
          "We can update or remove inaccurate source links on MulebuyHub, but we cannot access or modify external orders."
        ]
      }
    ]
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    description: "Read how shipping works when using MulebuyHub product discovery pages and third-party source links.",
    eyebrow: "Shipping",
    updated: "2026-08-09",
    sections: [
      {
        heading: "Shipping is handled by third parties",
        body: [
          "MulebuyHub is a product discovery and shopping guide site. We do not warehouse products, process shipments, provide carrier labels, or control delivery timelines.",
          "Shipping costs, available countries, processing time, customs handling, and carrier options are set by the external marketplace, agent, seller, or fulfillment provider used at checkout."
        ]
      },
      {
        heading: "Before placing an order",
        body: [
          "Review the external seller or agent page for shipping fees, delivery estimates, parcel restrictions, warehouse inspection options, and customs or import charges.",
          "If a listing requires an agent or forwarding service, check that service's shipping calculator and policy before buying."
        ]
      }
    ]
  },
  {
    slug: "return-refund-policy",
    title: "Return and Refund Policy",
    description: "Understand returns and refunds for products found through MulebuyHub and purchased on third-party sites.",
    eyebrow: "Returns",
    updated: "2026-08-09",
    sections: [
      {
        heading: "Returns and refunds are not processed by MulebuyHub",
        body: [
          "MulebuyHub does not sell products directly, collect payments, ship parcels, or issue refunds. Return eligibility, refund timing, exchange rules, cancellation windows, and dispute handling are controlled by the external seller, marketplace, or shopping agent used for the order.",
          "If you have already placed an order, contact the platform where you paid for the order."
        ]
      },
      {
        heading: "Use QC checks before shipping",
        body: [
          "When a shopping agent provides QC photos or warehouse inspection, review size tags, colors, logos, measurements, packaging, and visible flaws before approving international shipping.",
          "Keep screenshots, order numbers, chat records, and payment receipts in case you need to open a dispute with the external seller or platform."
        ]
      }
    ]
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "Read the MulebuyHub privacy policy covering analytics, cookies, external links, and contact information.",
    eyebrow: "Privacy",
    updated: "2026-08-09",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "MulebuyHub may collect basic technical information such as pages visited, browser type, referring pages, approximate location, device type, and interaction data through analytics or hosting logs.",
          "If you contact us by email, we may receive your email address and any information you include in your message."
        ]
      },
      {
        heading: "Cookies and external services",
        body: [
          "The site may use cookies or local storage for preferences such as theme and translation settings. Third-party services, analytics tools, embedded tools, or external links may use their own cookies and privacy practices.",
          "MulebuyHub links to external websites. Their privacy policies apply once you leave this site."
        ]
      },
      {
        heading: "How information is used",
        body: [
          "We use site data to monitor performance, improve pages, fix broken links, understand content demand, and respond to support requests.",
          "We do not use this site to collect payment details because purchases are completed on external platforms."
        ]
      }
    ]
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "Read the MulebuyHub terms of use for product discovery pages, external links, content accuracy, and visitor responsibility.",
    eyebrow: "Terms",
    updated: "2026-08-09",
    sections: [
      {
        heading: "Use of the site",
        body: [
          "By using MulebuyHub, you agree to use the site as a product discovery and shopping research resource. The content is provided for browsing, comparison, and informational purposes.",
          "Product information, prices, availability, images, and source links may change on external websites. We try to keep pages useful, but we cannot guarantee that every external listing remains available or unchanged."
        ]
      },
      {
        heading: "External links and purchases",
        body: [
          "MulebuyHub may link to third-party sellers, marketplaces, agents, or other websites. We are not responsible for external checkout, payment processing, shipping, returns, refunds, customs, product quality, seller communication, or account issues.",
          "Visitors are responsible for reviewing external seller terms, local laws, import rules, product details, and platform policies before purchasing."
        ]
      },
      {
        heading: "Content and trademarks",
        body: [
          "Brand names, product names, images, and references may belong to their respective owners. Their appearance on MulebuyHub does not imply endorsement, sponsorship, authorization, or affiliation.",
          "If you believe content should be updated or removed, contact contact@mulebuyhub.net with the relevant page URL and details."
        ]
      }
    ]
  }
];
