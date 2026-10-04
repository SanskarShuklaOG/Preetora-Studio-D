(() => {
  'use strict';
  const timeline = document.querySelector('#timeline');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const projects = [
    ['Project 01 · Completed','UGC Campaign','A direct-response edit focused on fast hooks, clean pacing and native social rhythm.','https://res.cloudinary.com/mwmsgdyn/video/upload/q_auto,f_auto/v1791131341/ro2IRUFXlqygDdzAartWqQyBQ4.mp4'],
    ['Project 02 · Completed','Social Cut','Short-form editing built around retention, readable typography and a strong final beat.','https://res.cloudinary.com/mwmsgdyn/video/upload/q_auto,f_auto/v1791131474/KOEIkZ23mur6zdaBbcrVjQjt20.mp4'],
    ['Project 03 · Completed','Creator Edit','A creator-led edit where pacing, captions and visual emphasis do the heavy lifting.','https://res.cloudinary.com/mwmsgdyn/video/upload/q_auto,f_auto/v1791131474/n7XUSJpKj9TOCXbTjC1H6Nbck8.mp4'],
    ['Project 04 · Completed','Brand Story','A more cinematic piece combining editorial pacing with motion-led transitions.','https://res.cloudinary.com/mwmsgdyn/video/upload/q_auto,f_auto/v1791131501/jOlHchcSezxVuG2DGrAb9Kr6w.mp4'],
    ['Project 05 · Completed','Ad Creative','A conversion-focused creative designed to make the value proposition land quickly.','https://res.cloudinary.com/mwmsgdyn/video/upload/q_auto,f_auto/v1791131762/gMXI40XstN2jhfeTcbENlRtN8M.mp4'],
    ['Project 06 · Completed','Motion Piece','Typography and motion used as a visual language rather than decoration.','https://res.cloudinary.com/mwmsgdyn/video/upload/q_auto,f_auto/v1791131790/ZoGN56DqnXMJqGVd2b5JkOejc2M.mp4']
  ];
  if (!timeline) return;
  timeline.innerHTML = projects.map((p,i) => `<article class="journey-item reveal"><span class="journey-dot"></span><div class="journey-meta">${p[0]}</div><button class="journey-button" type="button" aria-expanded="false" aria-controls="journey-panel-${i}">${p[1]} <span aria-hidden="true">+</span></button><div class="journey-content" id="journey-panel-${i}"><div class="journey-content-inner"><p>${p[2]}</p><video class="journey-video" muted playsinline loop preload="none" data-src="${p[3].replace("/upload/q_auto,f_auto/","/upload/c_limit,w_960,q_auto,f_auto/")}" data-poster="${p[3].replace("/upload/q_auto,f_auto/","/upload/so_0,w_800,q_auto,f_auto/").replace(".mp4",".jpg")}" aria-label="${p[1]} preview"></video></div></div></article>`).join('') + `<article class="journey-item current reveal"><span class="journey-dot"></span><div class="journey-meta">Now · In progress</div><button class="journey-button" type="button" aria-expanded="false" aria-controls="journey-current">What Preetora is building next <span aria-hidden="true">+</span></button><div class="journey-content" id="journey-current"><div class="journey-content-inner current-card"><h3>More content. More motion. More brands.</h3><p>Preetora is continuing to build a sharper studio system around video editing, UGC ads, motion design and repeatable creative workflows.</p></div></div></article>`;

  const items = [...timeline.querySelectorAll('.journey-item')];
  const closeItem = item => { item.classList.remove('open'); const b=item.querySelector('.journey-button'); b?.setAttribute('aria-expanded','false'); const s=b?.querySelector('span'); if(s)s.textContent='+'; item.querySelector('video')?.pause(); };
  const openItem = item => { items.forEach(other => { if(other!==item) closeItem(other); }); item.classList.add('open'); const b=item.querySelector('.journey-button'); b?.setAttribute('aria-expanded','true'); const s=b?.querySelector('span'); if(s)s.textContent='−'; const video=item.querySelector('video'); if(video){ if(!video.src) { video.poster=video.dataset.poster||''; video.src=video.dataset.src; video.load(); } if(!reduceMotion) video.play().catch(()=>{}); } };
  items.forEach(item => item.querySelector('.journey-button')?.addEventListener('click', () => item.classList.contains('open') ? closeItem(item) : openItem(item)));

  const fill=document.createElement('div'); fill.className='timeline-fill'; fill.setAttribute('aria-hidden','true'); timeline.prepend(fill);
  const mark=()=>{const r=timeline.getBoundingClientRect(); const p=Math.min(1,Math.max(0,(innerHeight*.62-r.top)/r.height)); fill.style.transform=`scaleY(${reduceMotion?1:p})`; items.forEach(it=>{const d=it.querySelector('.journey-dot').getBoundingClientRect(); it.classList.toggle('reached',reduceMotion||d.top<innerHeight*.66);});};
  let t=false; addEventListener('scroll',()=>{if(!t){t=true;requestAnimationFrame(()=>{mark();t=false;});}},{passive:true}); addEventListener('resize',mark); mark();
})();
