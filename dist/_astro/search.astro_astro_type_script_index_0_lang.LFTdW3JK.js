var e=1,t=12,n=[];function r(e){let t=e.price??0,n=e.originalPrice??0,r=n>0&&t<n,i=r?Math.round(100-t/n*100):0,a=t===0,o=e.rating??0,s=e.students??0,c=e.updatedAt?new Date(e.updatedAt).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):`Recently updated`,l=e.image?`<img src="${e.image}" alt="${e.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:0.75rem 0.75rem 0 0;">`:`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;opacity:0.3;">📚</div>`,u=a?`<div class="rc-badge rc-badge-free">🎁 FREE</div>`:r?`<div class="rc-badge rc-badge-hot">🔥 ${i}% OFF</div>`:``,d=e.subcategory?`<a href="/topics/${e.subcategory.toLowerCase().replace(/[^a-z0-9\s-]/g,``).replace(/\s+/g,`-`)}"
           class="rc-subcat">${e.subcategory}</a>`:``;return`
      <article class="rc-card">
        <div class="rc-img-wrap">
          ${l}
          ${u}
          <span class="rc-date">${c}</span>
        </div>
        <div class="rc-body">
          <h2 class="rc-title">
            <a href="/deal/${e.id}" class="rc-title-link">${e.title}</a>
          </h2>
          ${e.instructor?`<p class="rc-instructor">By <strong>${e.instructor}</strong></p>`:``}
          <p class="rc-desc">${e.description??`Master this in-demand skill with comprehensive training from industry experts.`}</p>
          <div class="rc-meta">
            <span class="rc-rating">★ ${o.toFixed(1)} · ${s.toLocaleString()} students</span>
            ${d}
          </div>
          <div class="rc-actions">
            <a href="/deal/${e.id}" class="rc-btn-primary">🎯 Get Coupon</a>
            ${e.instructor?`<a href="/search?q=${encodeURIComponent(e.instructor+` free`)}" class="rc-btn-secondary">Free Only</a>`:``}
          </div>
        </div>
      </article>`}function i(e){return`<div style="grid-column:1/-1;display:flex;justify-content:center;padding:2rem 0;">
      <div style="text-align:center;max-width:420px;background:#151921;border:1px solid rgba(255,255,255,0.07);border-radius:1.25rem;padding:2.5rem 2rem;">
        <div style="font-size:2.5rem;margin-bottom:1rem;">🔍</div>
        <h3 style="color:#f8fafc;margin:0 0 0.5rem;font-size:1.3rem;">Enter a Search Term</h3>
        <p style="color:#94a3b8;font-size:0.95rem;line-height:1.6;margin:0;">
          Search for courses, instructors, or topics to find verified coupons and exclusive deals.
        </p>
      </div>
    </div>`}function a(){let i=document.getElementById(`search-results`),a=document.getElementById(`no-results`),o=document.getElementById(`search-navigation`);if(!i)return;if(n.length===0){i.innerHTML=``,a&&(a.style.display=`flex`),o&&(o.style.display=`none`);return}let s=(e-1)*t;i.innerHTML=n.slice(s,s+t).map(r).join(``),a&&(a.style.display=`none`),o&&(o.style.display=n.length>t?`flex`:`none`)}function o(){let r=document.getElementById(`prev-page`),i=document.getElementById(`next-page`),a=document.getElementById(`page-info`),o=Math.ceil(n.length/t);r&&(r.disabled=e===1),i&&(i.disabled=e>=o),a&&(a.textContent=`Page ${e} of ${o} · ${n.length} results`)}function s(r){let i=Math.ceil(n.length/t);r<1||r>i||(e=r,a(),o(),window.scrollTo({top:0,behavior:`smooth`}))}async function c(){let t=new URLSearchParams(window.location.search).get(`q`)??``,r=document.getElementById(`search-results`),s=document.getElementById(`no-results`),c=document.getElementById(`search-navigation`),l=document.getElementById(`search-loading`),u=document.getElementById(`search-title`),d=document.getElementById(`search-description`);if(!t){r&&(r.innerHTML=i(``)),s&&(s.style.display=`none`),c&&(c.style.display=`none`),l&&(l.style.display=`none`);return}l&&(l.style.display=`block`),r&&(r.innerHTML=``),s&&(s.style.display=`none`),c&&(c.style.display=`none`);try{let r=await(await fetch(`/api/deals`)).json(),i=t.toLowerCase();n=r.filter(e=>e.title.toLowerCase().includes(i)||(e.description?.toLowerCase().includes(i)??!1)||(e.category?.toLowerCase().includes(i)??!1)||(e.instructor?.toLowerCase().includes(i)??!1)||(e.subcategory?.toLowerCase().includes(i)??!1)),e=1,u&&(u.textContent=`"${t}" — Udemy Courses with Verified Coupons`),document.title=`${t} Udemy Coupons — ${n.length} Results | CourseSpeak`,d&&(d.style.display=`block`,d.textContent=`Found ${n.length} verified ${t} courses with exclusive coupons. Browse deals taught by expert instructors — up to 100% off. Limited-time offers!`),a(),o()}catch(e){console.error(`Search error:`,e),r&&(r.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem 0;">
          <div style="background:#151921;border:1px solid rgba(239,68,68,0.3);border-radius:1.25rem;padding:2rem;max-width:400px;margin:0 auto;">
            <p style="color:#ef4444;font-size:1.1rem;font-weight:600;margin:0 0 0.5rem;">⚠️ Search Error</p>
            <p style="color:#94a3b8;margin:0;">Unable to load results. Please try again later.</p>
          </div>
        </div>`)}finally{l&&(l.style.display=`none`)}}document.addEventListener(`DOMContentLoaded`,()=>{let t=document.getElementById(`prev-page`),n=document.getElementById(`next-page`);t?.addEventListener(`click`,()=>s(e-1)),n?.addEventListener(`click`,()=>s(e+1)),c()});