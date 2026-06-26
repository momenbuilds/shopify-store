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
│   └── theme.liquid              # Base HTML shell (header, content, footer, chat widget)
├── sections/
│   ├── header.liquid             # Logo, nav, mobile hamburger dropdown, cart count
│   ├── footer.liquid             # Brand blurb, shop/help columns, perks
│   ├── hero-slider.liquid        # Auto-rotating homepage hero
│   ├── featured-collections.liquid # "Shop by category" tiles
│   ├── shop-the-look.liquid      # "Shop This Look" tiles + product pop-up modals
│   ├── main-product.liquid       # Product page (gallery, buy box, Shop Pay, upsells)
│   └── main-collection.liquid    # Collection grid
├── snippets/
│   ├── icon.liquid               # Inline SVG icon set (no emoji, no icon fonts)
│   └── chat-widget.liquid        # Floating contact-chat widget (Shopify contact form)
├── templates/                    # JSON + Liquid templates per page type
└── assets/
    └── theme.css                 # Single stylesheet for the whole theme
```

## Key features

- **Responsive header** — centered wordmark on desktop; on mobile the logo shrinks and the
  nav collapses into a hamburger dropdown.
- **Homepage pulls real product images** — the hero slider, category tiles, and Shop This
  Look outfit photos automatically use the **featured image of the linked product/collection**
  set in Shopify. A manual `image_url` can still be set per block to override. No more
  hardcoded image URLs drifting out of sync with the catalog. See
  [Homepage images](#homepage-images) below.
- **Shop This Look** — homepage lookbook tiles open a pop-up showing the exact products in
  each outfit, each linking straight to its product page.
- **Streamlined product page** — square product imagery with a thumbnail carousel, a minimal
  buy box (variant buttons, quantity, Add to Cart + Shop Pay dynamic checkout), a short
  product summary, and a "You may also like" carousel.
- **Per-category copy** — product descriptions adapt automatically based on the product
  title (denim, tops, shorts, bottoms, jewelry, accessories…).
- **Floating chat widget** — a contact form styled as a chat bubble, wired to Shopify's
  native `contact` form (submissions email the store).
- **SVG icon system** — all icons are inline SVG via `snippets/icon.liquid`; no emoji and no
  external icon fonts.

## Homepage images

The homepage sections resolve their imagery dynamically, so the storefront always reflects
what's uploaded to products/collections in the Shopify admin:

| Section | Image source (in priority order) |
|---|---|
| `hero-slider` | block `image_url` → linked product's `featured_image` (from `product_handle` or a `/products/…` link) |
| `featured-collections` | block `image_url` → collection's `featured_image` → first product's `featured_image` → placeholder |
| `shop-the-look` | block `image_url` → first listed product's `featured_image` |

To feature a different photo in a slot, either change which product/collection it points at,
or set that block's **Image URL** in the theme editor to override.

## Local development

This theme is managed with the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli).

```bash
# Preview locally against the store
shopify theme dev --store 348f9a-c7.myshopify.com

# Validate the theme
shopify theme check

# Push to an UNPUBLISHED draft theme (never publishes live)
shopify theme push --store 348f9a-c7.myshopify.com --unpublished --theme "Draft name"

# Preview a draft
# https://streetweardreams.store/?preview_theme_id=<draft-theme-id>
```

> ⚠️ **Publishing safety:** only publish a theme you've previewed end-to-end. A storefront
> that 404s on every route (`/`, `/cart`, `/collections/all`) usually means an
> **incomplete/empty theme got published** — Shopify has no template to render. Restore by
> publishing a known-good theme from **Online Store → Themes**, then investigate.

## Data

- `products_export.csv` — Shopify product export used as the catalog source.
- `clone.md` — design/reference notes captured while building the theme.

## License

Private project. All rights reserved.
