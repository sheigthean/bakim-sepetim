/* Bakım Sepetim: client-side basket only. Pricing and stock verified server-side. */
(()=>{
  const KEY='bakim_sepetim_v5_github_demo_cart';
  const SITE_ROOT=new URL('../',document.currentScript.src);
  const siteUrl=(path)=>{
    if(!path) return new URL('static/img/placeholder.svg',SITE_ROOT).href;
    if(/^(?:https?:|data:|blob:)/i.test(path)) return path;
    return new URL(String(path).replace(/^\/+/,''),SITE_ROOT).href;
  };
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>[...root.querySelectorAll(s)];
  const icon=(name)=>`<svg class="icon" aria-hidden="true"><use href="${siteUrl('/static/img/icons.svg')}#${name}"></use></svg>`;
  const fmt=(v)=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY'}).format((Number(v)||0)/100);
  let cart={};let products=[];let shipping=null;
  try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw)){
    for(const [key,value] of Object.entries(raw))if(/^\d+$/.test(key)&&Number.isInteger(value)&&value>0&&value<=50)cart[key]=value;
  }}catch(e){cart={};}
  const save=()=>{localStorage.setItem(KEY,JSON.stringify(cart));renderAll();};
  const product=(id)=>products.find(x=>x.id===Number(id));
  const entries=()=>Object.entries(cart).map(([id,quantity])=>({p:product(id),quantity})).filter(x=>x.p);
  const subtotal=()=>entries().reduce((n,x)=>n+x.p.price_kurus*x.quantity,0);
  const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
  const toast=(message)=>{const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(window.__toastId);window.__toastId=setTimeout(()=>el.classList.remove('show'),2700);};
  function add(id,qty=1){const p=product(id);if(!p){toast('Ürün bilgisi bulunamadı. Sayfayı yenileyin.');return;}
    if(p.stock<1){toast('Bu ürün şu anda tükendi.');return;}
    const next=(cart[id]||0)+qty;if(next>Math.min(p.stock,50)){toast('Sepete stok miktarından fazla eklenemez.');return;}
    cart[id]=next;save();toast('Sepetine eklendi! ♡');
    if(window.matchMedia('(min-width: 900px)').matches)openDrawer();
  }
  function adjust(id,delta){const p=product(id);if(!p)return;const n=(cart[id]||0)+delta;
    if(n<=0){delete cart[id];}else if(n>p.stock||n>50){toast('Yeterli stok yok.');return;}else cart[id]=n;
    save();
  }
  function photo(src){const img=document.createElement('img');img.src=siteUrl(src);img.alt='Ürün görseli';img.loading='lazy';return img;}
  function makeLine(p,q){const row=document.createElement('div');row.className='drawer-item';row.append(photo(p.photo));
    const body=document.createElement('div');body.className='drawer-item-body';
    const title=document.createElement('strong');title.textContent=p.name;body.append(title);
    const price=document.createElement('span');price.textContent=fmt(p.price_kurus*q);body.append(price);
    const actions=document.createElement('div');actions.className='drawer-item-actions';
    const btn=(txt,val)=>{const b=document.createElement('button');b.type='button';b.textContent=txt;b.setAttribute('aria-label',val>0?'Adedi artır':'Adedi azalt');b.onclick=()=>adjust(p.id,val);return b;};
    actions.append(btn('−',-1));const output=document.createElement('b');output.textContent=q;actions.append(output);actions.append(btn('+',1));
    const remove=document.createElement('a');remove.href='#';remove.textContent='Kaldır';remove.onclick=(event)=>{event.preventDefault();delete cart[p.id];save();};actions.append(remove);
    body.append(actions);row.append(body);return row;
  }
  function empty(target){target.innerHTML=`<div class="drawer-empty">${icon('bag')}<h3>Sepetin henüz boş</h3><p>Kendine güzel bir şeyler seçmeye ne dersin?</p><a href="${siteUrl('/#urunler')}" class="btn btn-pink">Ürünleri keşfet</a></div>`;}
  function renderAll(){
    const n=count();if($('#headerCartCount'))$('#headerCartCount').textContent=n;
    if($('#drawerCount'))$('#drawerCount').textContent=`(${n})`;
    const drawer=$('#drawerItems');if(drawer){drawer.replaceChildren();if(!n)empty(drawer);else entries().forEach(({p,quantity})=>drawer.append(makeLine(p,quantity)));}
    if($('#drawerSubtotal'))$('#drawerSubtotal').textContent=fmt(subtotal());
    const cartItems=$('#cartPageItems');if(cartItems){cartItems.replaceChildren();if(!n)empty(cartItems);else entries().forEach(({p,quantity})=>cartItems.append(makeLine(p,quantity)));}
    if($('#cartPageSubtotal'))$('#cartPageSubtotal').textContent=fmt(subtotal());
    renderCheckout();
  }
  function openDrawer(){const drawer=$('#cartDrawer'),overlay=$('#overlay');if(!drawer||!overlay)return;
    drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');overlay.hidden=false;document.body.style.overflow='hidden';}
  function closeDrawer(){const drawer=$('#cartDrawer'),overlay=$('#overlay');if(!drawer||!overlay)return;
    drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');overlay.hidden=true;document.body.style.overflow='';}
  function selectedShipping(){if(!shipping)return 0;const district=$('#districtSelect')?.value;
    if(!district||!Object.hasOwn(shipping.districts,district))return null;
    return shipping.free_shipping_above>0&&subtotal()>=shipping.free_shipping_above?0:shipping.districts[district];}
  function renderCheckout(){const holder=$('#checkoutItems');if(!holder)return;holder.replaceChildren();
    entries().forEach(({p,quantity})=>{const line=document.createElement('div');line.className='checkout-item';line.append(photo(p.photo));
      const name=document.createElement('div');const nameStrong=document.createElement('strong');nameStrong.textContent=p.name;const qty=document.createElement('span');qty.textContent=`${quantity} adet`;name.append(nameStrong,qty);
      const total=document.createElement('b');total.textContent=fmt(p.price_kurus*quantity);line.append(name,total);holder.append(line);});
    if(!entries().length){const p=document.createElement('p');p.textContent='Sepetin boş, önce ürün ekle.';holder.append(p);}
    if($('#checkoutSubtotal'))$('#checkoutSubtotal').textContent=fmt(subtotal());
    const cost=selectedShipping();if($('#checkoutShipping'))$('#checkoutShipping').textContent=cost===null?'İlçe seçin':cost===0?'Ücretsiz':fmt(cost);
    if($('#checkoutTotal'))$('#checkoutTotal').textContent=fmt(subtotal()+(cost||0));
    if($('#submitOrder'))$('#submitOrder').disabled=!entries().length || $('#submitOrder').dataset.setupNeeded==='1';
  }
  async function submitOrder(event){event.preventDefault();
    const message='Bu sayfa yalnızca tanıtım önizlemesidir. Gerçek sipariş, stok değişikliği veya tahsilat oluşturulmaz. Canlı mağaza ayrıca yayımlanacaktır.';
    const error=document.querySelector('#checkoutError');if(error){error.hidden=false;error.textContent=message;error.scrollIntoView({behavior:'smooth',block:'center'});}else alert(message);
  }
  document.addEventListener('click',event=>{
    const addBtn=event.target.closest('[data-add]');if(addBtn){event.preventDefault();if(!addBtn.disabled)add(addBtn.dataset.add,Number(addBtn.dataset.quantity||1));return;}
    if(event.target.closest('[data-open-cart]')){openDrawer();return;}
    if(event.target.closest('[data-close-cart]')){closeDrawer();return;}
    if(event.target.closest('[data-menu-toggle]')){$('#siteNav')?.classList.toggle('open');return;}
    const thumb=event.target.closest('[data-thumb]');if(thumb&&$('#mainProductImage')){$('#mainProductImage').src=thumb.dataset.thumb;return;}
    if(event.target.closest('[data-qty-plus]')){const o=$('#detailQty');if(o)o.textContent=Math.min(50,Number(o.textContent)+1);if($('[data-quantity]'))$('[data-quantity]').dataset.quantity=o.textContent;}
    if(event.target.closest('[data-qty-minus]')){const o=$('#detailQty');if(o)o.textContent=Math.max(1,Number(o.textContent)-1);if($('[data-quantity]'))$('[data-quantity]').dataset.quantity=o.textContent;}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});
  $('#checkoutForm')?.addEventListener('submit',submitOrder);
  $('#districtSelect')?.addEventListener('change',renderCheckout);
  $('#copyTrackUrl')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('Takip bağlantısı kopyalandı!');}catch(e){toast('Adres çubuğundaki bağlantıyı kopyalayın.');}});
  Promise.all([
    fetch(siteUrl('/api/products.json')).then(r=>r.ok?r.json():[]),
    fetch(siteUrl('/api/shipping.json')).then(r=>r.ok?r.json():null)
  ]).then(([p,s])=>{products=p;shipping=s;
    let changed=false;for(const [id,qty] of Object.entries(cart)){const pr=product(id);if(!pr||pr.stock<1){delete cart[id];changed=true;}else if(qty>pr.stock){cart[id]=Math.min(pr.stock,50);changed=true;}}
    if(changed)localStorage.setItem(KEY,JSON.stringify(cart));renderAll();
  }).catch(()=>{renderAll();toast('Ürün bilgileri yüklenemedi. Sayfayı yenileyin.');});
})();
