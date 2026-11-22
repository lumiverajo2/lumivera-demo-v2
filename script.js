'use strict';
const root = document.documentElement;
const experience = document.querySelector('.unboxing');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scheduled = false;
function draw() {
  const rect = experience.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, -rect.top / (experience.offsetHeight - innerHeight)));
  const o = Math.max(0, Math.min(1, (p - .09) / .46));
  const l = Math.max(0, Math.min(1, (p - .35) / .5));
  root.style.setProperty('--p', p.toFixed(4));
  root.style.setProperty('--open', o.toFixed(4));
  root.style.setProperty('--lift', l.toFixed(4));
  const renderJar = document.querySelector('.realistic-jar');
  const frame = reduced ? 0 : Math.round(Math.max(0, Math.min(1, (p-.32)/.66))*35);
  if(renderJar) renderJar.style.backgroundPosition = ((frame%6)*20)+'% '+(Math.floor(frame/6)*20)+'%';
  document.querySelector('#chapter-number').textContent = p < .35 ? '01' : p < .75 ? '02' : '03';
  document.querySelector('#chapter-name').textContent = p < .35 ? 'البداية' : p < .75 ? 'الاكتشاف' : 'العناية';
  document.querySelector('.mobile-order').classList.toggle('show', rect.bottom < innerHeight * .4);
  scheduled = false;
}
addEventListener('scroll', () => { if(!scheduled) { scheduled = true; requestAnimationFrame(draw); } }, {passive:true});
addEventListener('resize', draw, {passive:true});
draw();
if ('IntersectionObserver' in window && !reduced) {
  document.body.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const ar = n => n.toLocaleString('ar-JO');
let quantity = 1, cartCount = 0;
const cart = document.querySelector('#cart');
const renderQuantity = () => {document.querySelector('#qty').textContent=ar(quantity); document.querySelector('#minus').disabled=quantity===1; document.querySelector('#plus').disabled=quantity===9;};
document.querySelector('#minus').onclick=()=>{quantity=Math.max(1,quantity-1);renderQuantity();};
document.querySelector('#plus').onclick=()=>{quantity=Math.min(9,quantity+1);renderQuantity();};
function renderCart(){
  document.querySelectorAll('.bag-count').forEach(el=>el.textContent=ar(cartCount));
  document.querySelector('#cart-quantity').textContent=cartCount ? 'الكمية: '+ar(cartCount)+' · ٢٠ دينار للعبوة' : 'السلة فارغة';
  document.querySelector('#cart-total').textContent=ar(cartCount*20)+' دينار';
}
document.querySelectorAll('.add-cart').forEach(button=>button.onclick=()=>{cartCount=Math.min(99,cartCount+quantity);renderCart();cart.showModal();});
document.querySelectorAll('.bag').forEach(button=>button.onclick=()=>cart.showModal());
document.querySelector('#remove-cart').onclick=()=>{cartCount=0;renderCart();};
document.querySelector('#close-cart').onclick=()=>cart.close();
document.querySelector('#continue-shopping').onclick=()=>cart.close();
cart.addEventListener('click',event=>{if(event.target===cart){const r=cart.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)cart.close();}});
renderQuantity();renderCart();
// Small, scroll-linked interface details, independent of the packaging animation.
const interfaceTick = () => root.style.setProperty('--page-progress', (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100).toFixed(2) + '%');
addEventListener('scroll', interfaceTick, {passive:true});
document.querySelectorAll('.benefit').forEach((row,index)=>{row.style.transitionDelay=(index%4)*35+'ms';row.tabIndex=0;row.addEventListener('click',()=>{document.querySelectorAll('.benefit').forEach(x=>x.classList.remove('active'));row.classList.add('active');});row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();row.click();}});});
interfaceTick();
// Motion details retain a complete reduced-motion route and pause outside the view.
const benefitNotes = ['إحساس بالنضارة، ضمن روتين عناية أبسط.','عناية بمظهر البقع الداكنة وتجانس البشرة.','للعناية بمظهر الكلف، بحسب وصف العلامة.','عناية بالعلامات التي تتركها الحبوب.','لمظهر بشرة أكثر تجانساً مع العناية المنتظمة.','لحظة من النعومة والترطيب كل يوم.','اختبري المنتج على مساحة صغيرة قبل الاستخدام.'];
document.querySelectorAll('.benefit').forEach((row,index)=>{const note=document.createElement('div');note.className='benefit-description';const inner=document.createElement('span');inner.textContent=benefitNotes[index];note.append(inner);row.append(note);row.setAttribute('role','button');row.setAttribute('aria-expanded','false');row.addEventListener('click',()=>{document.querySelectorAll('.benefit').forEach(x=>x.setAttribute('aria-expanded',String(x.classList.contains('active'))));});});
if(!reduced){
 document.querySelectorAll('.hero-copy h1,.intro h2,.benefits-content h2,.product-info h2,.trust-heading h2').forEach(heading=>{let number=0;const walk=node=>{[...node.childNodes].forEach(child=>{if(child.nodeType===Node.TEXT_NODE&&child.textContent.trim()){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){fragment.append(document.createTextNode(word));return;}const wrap=document.createElement('span');wrap.className='word-reveal';const ink=document.createElement('span');ink.textContent=word;ink.style.setProperty('--word-delay',(number++*65)+'ms');wrap.append(ink);fragment.append(wrap);});child.replaceWith(fragment);}else if(child.nodeType===Node.ELEMENT_NODE)walk(child);});};walk(heading);});
 const ritual=document.querySelector('.intro');const label=document.createElement('span');label.className='motion-label';label.innerHTML='<i></i> لحظتكِ اليومية، بإيقاعكِ';ritual.append(label);
 const photos=document.querySelectorAll('.benefits-image');
 const motionUpdate=()=>{photos.forEach(photo=>{const rect=photo.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const t=(rect.top+rect.height/2-innerHeight/2)/innerHeight;photo.style.setProperty('--photo-drift',Math.max(-15,Math.min(15,t*24))+'px');}});};addEventListener('scroll',motionUpdate,{passive:true});motionUpdate();
 const pauseObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{entry.target.style.animationPlayState=entry.isIntersecting?'running':'paused';}),{rootMargin:'100px'});document.querySelectorAll('.story-icon,.product-tag,.closing>span,.marquee>div').forEach(el=>pauseObserver.observe(el));
 document.querySelectorAll('.primary').forEach(button=>button.addEventListener('pointerdown',event=>{const r=button.getBoundingClientRect();const ripple=document.createElement('span');ripple.className='ripple';ripple.style.left=(event.clientX-r.left)+'px';ripple.style.top=(event.clientY-r.top)+'px';button.append(ripple);setTimeout(()=>ripple.remove(),750);}));
 document.querySelectorAll('.quantity button').forEach(button=>button.addEventListener('click',()=>{const n=document.querySelector('#qty');n.classList.remove('changed');requestAnimationFrame(()=>n.classList.add('changed'));}));
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){const dot=document.createElement('div');dot.className='motion-dot';document.body.append(dot);addEventListener('pointermove',event=>{dot.classList.add('on');dot.style.transform=`translate(${event.clientX-6}px,${event.clientY-6}px)`;dot.classList.toggle('over',!!event.target.closest('button,a,summary,.benefit'));},{passive:true});document.addEventListener('pointerleave',()=>dot.classList.remove('on'));document.querySelectorAll('.product-visual').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--tilt-y',((e.clientX-r.left)/r.width-.5)*5+'deg');card.style.setProperty('--tilt-x',-((e.clientY-r.top)/r.height-.5)*5+'deg');});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});});}
}

// Photo selection stays local and keeps every original available in the gallery.
const photoCaptions={texture:'صورة مقرّبة لقوام كريم لوميفيرا داخل العبوة',lifestyle:'صورة تحمل فيها عارضة علبة لوميفيرا',closed:'عبوة لوميفيرا على قاعدة دائرية بيضاء',open:'عبوة لوميفيرا المفتوحة على قاعدة بيضاء',hand:'يد تحمل عبوة لوميفيرا'};
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{const photo=document.querySelector('#product-photo');photo.src='assets/studio-'+button.dataset.photo+'.webp';photo.alt=photoCaptions[button.dataset.photo];document.querySelectorAll('[data-photo]').forEach(x=>{x.classList.toggle('selected',x===button);x.setAttribute('aria-pressed',String(x===button));});}));

/* v8: React Bits-style components, vanilla and reduced-motion aware. */
if(!reduced){
 const field=document.querySelector('.particles');
 if(field){const count=matchMedia('(max-width:760px)').matches?8:14;for(let i=0;i<count;i++){const dot=document.createElement('i');dot.style.left=(Math.random()*96)+'%';dot.style.top=(6+Math.random()*86)+'%';const size=(2+Math.random()*2.5)+'px';dot.style.width=size;dot.style.height=size;dot.style.setProperty('--dur',(7+Math.random()*7)+'s');dot.style.setProperty('--delay',(-Math.random()*9)+'s');field.append(dot);}}
}
const counters=document.querySelectorAll('[data-count]');
if(counters.length&&'IntersectionObserver' in window){
 const fmtCount=(value,dec)=>dec?value.toLocaleString('ar-JO',{minimumFractionDigits:dec,maximumFractionDigits:dec}):Math.round(value).toLocaleString('ar-JO');
 const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;countObserver.unobserve(entry.target);
  const el=entry.target,target=parseFloat(el.dataset.count),dec=parseInt(el.dataset.decimals||'0',10);
  if(reduced){el.textContent=fmtCount(target,dec);return;}
  const start=performance.now(),dur=1500;
  const tick=now=>{const k=Math.min(1,(now-start)/dur);const e=1-Math.pow(1-k,3);el.textContent=fmtCount(target*e,dec);if(k<1)requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
 }),{threshold:.4});
 counters.forEach(el=>countObserver.observe(el));
}
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 document.querySelectorAll('.benefit').forEach(card=>card.addEventListener('pointermove',event=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',(event.clientX-r.left)+'px');card.style.setProperty('--my',(event.clientY-r.top)+'px');}));
 document.querySelectorAll('.magnet').forEach(btn=>{let raf=null;
  btn.addEventListener('pointermove',event=>{const r=btn.getBoundingClientRect();const x=(event.clientX-r.left-r.width/2)*.22;const y=(event.clientY-r.top-r.height/2)*.32;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{btn.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';});});
  btn.addEventListener('pointerleave',()=>{cancelAnimationFrame(raf);btn.style.transition='transform .45s cubic-bezier(.2,.8,.2,1)';btn.style.transform='';setTimeout(()=>{btn.style.transition='';},460);});
 });
}
document.querySelectorAll('.add-cart').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.bag-count').forEach(el=>{el.classList.remove('bump');requestAnimationFrame(()=>el.classList.add('bump'));});}));
