// Brandy Melville style clone — catalog driven storefront
let CATALOG = [];

async function loadCatalog(){
  if(CATALOG.length) return CATALOG;
  const res = await fetch('data/products.json');
  CATALOG = await res.json();
  return CATALOG;
}

const money = p => p ? '$' + Number(p).toFixed(2).replace(/\.00$/,'.00') : '';
const firstImg = p => (p.images && p.images[0]) || '';
const altImg   = p => (p.images && p.images[1]) || firstImg(p);

function productCard(p){
  const url = `product.html?handle=${encodeURIComponent(p.handle)}`;
  return `<a class="card" href="${url}">
    <div class="imgwrap">
      <img loading="lazy" src="${firstImg(p)}" alt="${escapeHtml(p.title)}">
      <img loading="lazy" class="alt" src="${altImg(p)}" alt="">
      <div class="quickadd">+ Quick Add</div>
    </div>
    <div class="title">${escapeHtml(p.title)}</div>
    <div class="price">${money(p.price)}</div>
  </a>`;
}

function escapeHtml(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function renderGrid(el, products){
  el.innerHTML = products.map(productCard).join('') || '<div class="loading">No products found</div>';
}

// match nav category -> product types/tags
const CATEGORY_MAP = {
  'new-in':       p => p.tags.some(t=>/new/i.test(t)),
  'clothing':     p => /Top|Tank|Pant|Short|Skirt|Dress|Sweater|Hoodie|Sweatshirt|Sweatpant|Shirt|Jean|Halter|Long Sleeve|T-Shirt/i.test(p.type),
  'tops':         p => /Top|Tank|Shirt|Halter|Long Sleeve|Sweater|Hoodie|Sweatshirt|T-Shirt|Noa Top/i.test(p.type),
  'bottoms':      p => /Pant|Short|Skirt|Jean|Sweatpant/i.test(p.type),
  'dresses':      p => /Dress/i.test(p.type),
  'graphics':     p => /Graphic/i.test(p.type) || p.tags.some(t=>/graphic/i.test(t)),
  'accessories':  p => /Accessor|Bag|Hat|Belt|Sock|Scrunchie|Headband|Scarf|Makeup Bag|Tote|Purse|Coin Purse|Duffle|Pouch/i.test(p.type),
  'jewelry':      p => /Earring|Necklace|Bracelet|Ring/i.test(p.type),
};

function filterCategory(products, cat){
  const fn = CATEGORY_MAP[cat];
  if(!fn) return products;
  return products.filter(fn);
}

const qs = new URLSearchParams(location.search);

// ---------- PAGE: HOME ----------
async function initHome(){
  const cat = await loadCatalog();
  const pick = (fn,n)=>cat.filter(fn).slice(0,n);
  const grids = {
    'grid-new':  pick(CATEGORY_MAP['new-in'], 8).length ? pick(CATEGORY_MAP['new-in'],8) : cat.slice(0,8),
    'grid-tops': pick(CATEGORY_MAP['tops'], 8),
    'grid-acc':  pick(CATEGORY_MAP['accessories'], 8),
  };
  for(const [id,prods] of Object.entries(grids)){
    const el = document.getElementById(id);
    if(el) renderGrid(el, prods);
  }
  // category tiles use a representative product image
  document.querySelectorAll('[data-cat-tile]').forEach(t=>{
    const c = t.getAttribute('data-cat-tile');
    const sample = cat.find(CATEGORY_MAP[c] || (()=>false));
    if(sample){ const img=t.querySelector('img'); if(img) img.src=firstImg(sample); }
  });
  // hero image — newest product, large
  const hero = document.getElementById('hero-img');
  if(hero){ const h = cat.find(CATEGORY_MAP['new-in']) || cat[0]; if(h) hero.src = firstImg(h); }
}

// ---------- PAGE: COLLECTION ----------
async function initCollection(){
  const cat = await loadCatalog();
  const c = qs.get('c') || 'clothing';
  let products = filterCategory(cat, c);
  const titleEl = document.getElementById('coll-title');
  const countEl = document.getElementById('coll-count');
  const grid = document.getElementById('coll-grid');
  const sort = document.getElementById('sort');
  const niceName = (qs.get('name') || c).replace(/-/g,' ');
  titleEl.textContent = niceName.toUpperCase();
  function draw(){
    let list = products.slice();
    const s = sort.value;
    if(s==='price-asc') list.sort((a,b)=>parseFloat(a.price)-parseFloat(b.price));
    if(s==='price-desc') list.sort((a,b)=>parseFloat(b.price)-parseFloat(a.price));
    if(s==='az') list.sort((a,b)=>a.title.localeCompare(b.title));
    countEl.textContent = list.length + ' items';
    renderGrid(grid, list);
  }
  sort.addEventListener('change', draw);
  draw();
}

// ---------- PAGE: PRODUCT ----------
async function initProduct(){
  const cat = await loadCatalog();
  const handle = qs.get('handle');
  const p = cat.find(x=>x.handle===handle) || cat[0];
  document.title = p.title + ' — Brandy';
  document.getElementById('pdp-title').textContent = p.title;
  document.getElementById('pdp-price').textContent = money(p.price);
  document.getElementById('pdp-desc').innerHTML = p.body || '';
  document.getElementById('crumb-type').textContent = p.type || 'Shop';

  const gal = document.getElementById('pdp-gallery');
  gal.innerHTML = (p.images.length?p.images:['']).map(src=>`<img loading="lazy" src="${src}" alt="${escapeHtml(p.title)}">`).join('');

  // colors + sizes parsed from variant titles "Color / Size"
  const colors = new Set(), sizes = [];
  p.variants.forEach(v=>{
    const parts = (v.title||'').split('/').map(s=>s.trim());
    if(parts.length===2){ colors.add(parts[0]); sizes.push({size:parts[1],available:v.available}); }
    else { sizes.push({size:v.title,available:v.available}); }
  });
  const colorWrap = document.getElementById('pdp-colors');
  const sizeWrap = document.getElementById('pdp-sizes');
  if(colors.size>1){
    document.getElementById('pdp-colors-label').style.display='';
    colorWrap.innerHTML=[...colors].map((c,i)=>`<button class="swatch${i===0?' sel':''}">${escapeHtml(c)}</button>`).join('');
    bindGroup(colorWrap,'.swatch');
  }
  const uniqSizes=[...new Map(sizes.map(s=>[s.size,s])).values()];
  if(uniqSizes.length){
    document.getElementById('pdp-sizes-label').style.display='';
    sizeWrap.innerHTML=uniqSizes.map((s,i)=>`<button class="size${s.available===false?' oos':''}${i===0?' sel':''}">${escapeHtml(s.size||'One Size')}</button>`).join('');
    bindGroup(sizeWrap,'.size');
  }

  document.getElementById('pdp-add').addEventListener('click',()=>toast('Added to bag'));

  // you may also like
  const rec = cat.filter(x=>x.type===p.type && x.handle!==p.handle).slice(0,4);
  const recGrid=document.getElementById('pdp-rec');
  if(recGrid) renderGrid(recGrid, rec.length?rec:cat.slice(0,4));
}

function bindGroup(wrap,sel){
  wrap.addEventListener('click',e=>{
    const b=e.target.closest(sel); if(!b) return;
    wrap.querySelectorAll(sel).forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
  });
}

function toast(msg){
  let t=document.querySelector('.cart-toast');
  if(!t){t=document.createElement('div');t.className='cart-toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1800);
}

// router
document.addEventListener('DOMContentLoaded',()=>{
  const page=document.body.getAttribute('data-page');
  if(page==='home') initHome();
  if(page==='collection') initCollection();
  if(page==='product') initProduct();
});
