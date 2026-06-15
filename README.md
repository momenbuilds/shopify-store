# StreetWear Dreams — Shopify Theme

A custom, lightweight Shopify storefront theme for **StreetWear Dreams**, a Y2K-inspired
streetwear shop. Built from scratch in Liquid with no theme framework — fast, minimal, and
fully responsive.

🛍️ **Live store:** [streetweardreams.store](https://streetweardreams.store)

---

## What's inside

```
shopify-theme/
├── layout/
│   └── theme.liquid          # Base HTML shell (header, content, footer, chat widget)
├── sections/
│   ├── header.liquid         # Logo, nav, mobile hamburger dropdown, cart count
│   ├── footer.liquid         # Brand blurb, shop/help columns, perks
│   ├── hero-slider.liquid    # Auto-rotating homepage hero
│   ├── shop-the-look.liquid  # "Shop This Look" tiles + product pop-up modals
│   ├── main-product.liquid   # Product page (gallery, buy box, Shop Pay, carousel)
│   └── main-collection.liquid# Collection grid
├── snippets/
│   ├── icon.liquid           # Inline SVG icon set (no emoji, no icon fonts)
│   └── chat-widget.liquid    # Floating contact-chat widget (Shopify contact form)
├── templates/                # JSON + Liquid templates per page type
└── assets/
    └── theme.css             # Single stylesheet for the whole theme
```

## Key features

- **Responsive header** — centered wordmark on desktop; on mobile the logo shrinks and the
  nav collapses into a hamburger dropdown.
- **Shop This Look** — homepage lookbook tiles open a pop-up showing the exact products in
  each outfit, each linking straight to its product page.
- **Streamlined product page** — square product imagery with a thumbnail carousel, a minimal
  buy box (variant buttons, quantity, Add to Cart + Shop Pay dynamic checkout), a short
  product summary, and a 6-product "You may also like" carousel.
- **Per-category copy** — product descriptions adapt automatically based on the product
  title (denim, tops, shorts, bottoms, jewelry, accessories…).
- **Floating chat widget** — a contact form styled as a chat bubble, wired to Shopify's
  native `contact` form (submissions email the store).
- **SVG icon system** — all icons are inline SVG via `snippets/icon.liquid`; no emoji and no
  external icon fonts.

## Local development

This theme is managed with the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli).

```bash
# Preview locally against the store
shopify theme dev --store <your-store>.myshopify.com

# Validate the theme
shopify theme check

# Push to an UNPUBLISHED draft theme (never publishes live)
shopify theme push --theme <draft-theme-id> --store <your-store>.myshopify.com
```

> **Note:** Pushes target an unpublished **draft** theme. Preview a draft with
> `https://streetweardreams.store/?preview_theme_id=<draft-theme-id>`.

## Data

- `products_export.csv` — Shopify product export used as the catalog source.
- `clone.md` — design/reference notes captured while building the theme.

## License

Private project. All rights reserved.
