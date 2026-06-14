#!/usr/bin/env python3
"""Create the 11 landing-page products in the Shopify store via Admin REST API.
Usage:  SHOPIFY_ADMIN_TOKEN=shpat_xxx python3 create_products.py
Requires a custom app token with write_products scope.
"""
import json, os, sys, urllib.request, urllib.error, time

STORE = os.environ.get("SHOPIFY_STORE", "ywspab-eh.myshopify.com")
TOKEN = os.environ.get("SHOPIFY_ADMIN_TOKEN")
API   = os.environ.get("SHOPIFY_API_VERSION", "2024-10")

if not TOKEN:
    sys.exit("ERROR: set SHOPIFY_ADMIN_TOKEN (custom app token with write_products).")

defs = json.load(open(os.path.join(os.path.dirname(__file__), "landing-products.json")))

def api(method, path, payload=None):
    url = f"https://{STORE}/admin/api/{API}/{path}"
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        return e.code, json.load(e)

created, skipped = [], []
for d in defs:
    # skip if a product with this handle already exists
    st, body = api("GET", f"products.json?handle={d['handle']}")
    if st == 200 and body.get("products"):
        skipped.append(d['handle']); print(f"skip (exists): {d['handle']}"); continue

    product = {
        "title": d["title"],
        "body_html": d["body_html"],
        "vendor": "BM Reference",
        "product_type": d["product_type"],
        "handle": d["handle"],
        "status": "active",
        "options": [{"name": d["options_name"]}],
        "variants": [
            {"option1": v["option1"], "price": v["price"], "inventory_management": None}
            for v in d["variants"]
        ],
        "images": [{"src": im["src"]} for im in d["images"]],
    }
    st, body = api("POST", "products.json", {"product": product})
    if st in (200, 201):
        pid = body["product"]["id"]
        created.append(d['handle'])
        print(f"created: {d['handle']}  (id {pid}, {len(body['product'].get('variants',[]))} variants)")
    else:
        print(f"FAILED: {d['handle']} -> HTTP {st}: {json.dumps(body)[:300]}")
    time.sleep(0.6)  # stay under rate limit

print(f"\nDone. created={len(created)} skipped={len(skipped)}")
print("Live at: https://%s/products/<handle>" % STORE)
