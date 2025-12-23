console.log("Script loaded!");document.addEventListener("DOMContentLoaded",function(){console.log("DOM loaded");const t=document.getElementById("searchInput"),r=document.getElementById("categoryFilter"),l=document.getElementById("dealsTableBody");console.log("Elements found:",{searchInput:!!t,categoryFilter:!!r,tableBody:!!l}),t&&t.addEventListener("input",function(){console.log("Input changed:",this.value),a()}),c()});let d=[];function c(){try{const t=document.getElementById("deals-data");t&&(d=JSON.parse(t.textContent),console.log("Data loaded:",d.length,"deals"))}catch(t){console.error("Error loading data:",t)}}function a(){console.log("Searching...");const t=document.getElementById("searchInput"),r=document.getElementById("dealsTableBody"),l=document.getElementById("searchResults");if(!t||!r||!l)return;const o=t.value.toLowerCase();console.log("Search term:",o);let n=d.filter(e=>!o||e.title&&e.title.toLowerCase().includes(o)||e.provider&&e.provider.toLowerCase().includes(o)||e.category&&e.category.toLowerCase().includes(o)||e.coupon&&e.coupon.toLowerCase().includes(o));console.log("Found:",n.length,"deals"),r.innerHTML="",n.slice(0,50).forEach(e=>{const i=document.createElement("tr");i.style.borderBottom="1px solid rgba(91, 140, 255, 0.1)",i.innerHTML=`
          <td style="padding: 1rem; color: #e2e8f0;">
            <div style="max-width: 300px;">
              <div style="font-weight: 600; margin-bottom: 0.25rem;">${e.title||"Untitled"}</div>
              <div style="font-size: 0.875rem; color: #a9b0c0;">ID: ${e.id||"Unknown"}</div>
            </div>
          </td>
          <td style="padding: 1rem; color: #e2e8f0;">${e.provider||"Unknown"}</td>
          <td style="padding: 1rem; color: #e2e8f0;">${e.category||"Uncategorized"}</td>
          <td style="padding: 1rem; color: #e2e8f0;">$${e.price||"0"}</td>
          <td style="padding: 1rem; color: #e2e8f0;">
            <div style="font-size: 0.875rem;">
              ${e.updatedAt?new Date(e.updatedAt).toLocaleDateString():e.createdAt?new Date(e.createdAt).toLocaleDateString():"Unknown"}
            </div>
          </td>
          <td style="padding: 1rem; color: #e2e8f0;">
            <div style="
              font-size: 0.875rem;
              font-family: monospace;
              background-color: rgba(91, 140, 255, 0.1);
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              display: inline-block;
            ">
              ${e.coupon||"N/A"}
            </div>
          </td>
          <td style="padding: 1rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <a href="/deal/${e.id||""}" target="_blank" style="
                padding: 0.5rem 1rem;
                background-color: #10b981;
                color: #fff;
                text-decoration: none;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 600;
                border: 1px solid #10b981;
              ">View</a>
              <a href="/admin/deals/edit/${e.id||""}" style="
                padding: 0.5rem 1rem;
                background-color: transparent;
                color: #3b82f6;
                border: 1px solid #3b82f6;
                text-decoration: none;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 600;
              ">Edit</a>
            </div>
          </td>
        `,r.appendChild(i)}),l.textContent=n.length===0?"No deals found":`Showing ${n.length} of ${d.length} deals`}function s(){console.log("Clearing filters");const t=document.getElementById("searchInput");t&&(t.value="",a())}function m(){console.log("Testing search function"),a()}function g(t){if(console.log("Deleting deal:",t),!confirm("Are you sure you want to delete this deal? This action cannot be undone."))return;const r={action:"DELETE",dealId:t,timestamp:new Date().toISOString()};if(localStorage.setItem("pendingDealDelete",JSON.stringify(r)),alert(`Delete action prepared!

Since this is hosted on GitHub Pages, you need to:
1. Copy the delete information below
2. Manually remove the deal from deals.json
3. Commit and push changes to GitHub

Check browser console for the delete information.`),console.log("Pending delete info:",r),console.log("To apply this delete, remove the deal with ID:",t,"from deals.json and commit to GitHub."),navigator.clipboard){const n=`DELETE DEAL: ${t}
Timestamp: ${new Date().toISOString()}

Remove this deal from src/data/deals.json and commit to GitHub.`;navigator.clipboard.writeText(n).then(()=>{alert("Delete information copied to clipboard! Remove the deal from deals.json and commit to GitHub.")})}const l=document.querySelector(`[data-deal-id="${t}"]`);l&&(l.style.opacity="0.5",l.style.textDecoration="line-through");const o=document.querySelector("p");if(o&&o.textContent?.includes("total deals")){const n=o.textContent.match(/\d+/);if(n){const e=parseInt(n[0]);o.textContent=`${e-1} total deals`}}}window.performSearch=a;window.clearFilters=s;window.testSearch=m;window.deleteDeal=g;console.log("Functions exposed");
