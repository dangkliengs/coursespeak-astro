import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BiepDlrb.mjs';
import { manifest } from './manifest_BNzTbERe.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/analytics.astro.mjs');
const _page3 = () => import('./pages/admin/deals/create.astro.mjs');
const _page4 = () => import('./pages/admin/deals/edit/_id_.astro.mjs');
const _page5 = () => import('./pages/admin/deals.astro.mjs');
const _page6 = () => import('./pages/admin/newsletter.astro.mjs');
const _page7 = () => import('./pages/admin.astro.mjs');
const _page8 = () => import('./pages/api/admin/session.astro.mjs');
const _page9 = () => import('./pages/api/deals.astro.mjs');
const _page10 = () => import('./pages/api/delete-deal.astro.mjs');
const _page11 = () => import('./pages/api/newsletter.astro.mjs');
const _page12 = () => import('./pages/api/save-deal.astro.mjs');
const _page13 = () => import('./pages/api/update.astro.mjs');
const _page14 = () => import('./pages/categories/_category_.astro.mjs');
const _page15 = () => import('./pages/categories.astro.mjs');
const _page16 = () => import('./pages/contact.astro.mjs');
const _page17 = () => import('./pages/deal/_id_.astro.mjs');
const _page18 = () => import('./pages/deals/_page_.astro.mjs');
const _page19 = () => import('./pages/deals.astro.mjs');
const _page20 = () => import('./pages/how-to-redeem-coupon.astro.mjs');
const _page21 = () => import('./pages/popular.astro.mjs');
const _page22 = () => import('./pages/privacy.astro.mjs');
const _page23 = () => import('./pages/search.astro.mjs');
const _page24 = () => import('./pages/sitemap.xml.astro.mjs');
const _page25 = () => import('./pages/success-stories.astro.mjs');
const _page26 = () => import('./pages/terms.astro.mjs');
const _page27 = () => import('./pages/udemy-coupons-guide.astro.mjs');
const _page28 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/analytics.astro", _page2],
    ["src/pages/admin/deals/create.astro", _page3],
    ["src/pages/admin/deals/edit/[id].astro", _page4],
    ["src/pages/admin/deals.astro", _page5],
    ["src/pages/admin/newsletter.astro", _page6],
    ["src/pages/admin.astro", _page7],
    ["src/pages/api/admin/session.js", _page8],
    ["src/pages/api/deals.js", _page9],
    ["src/pages/api/delete-deal.js", _page10],
    ["src/pages/api/newsletter.js", _page11],
    ["src/pages/api/save-deal.js", _page12],
    ["src/pages/api/update.js", _page13],
    ["src/pages/categories/[category].astro", _page14],
    ["src/pages/categories.astro", _page15],
    ["src/pages/contact.astro", _page16],
    ["src/pages/deal/[id].astro", _page17],
    ["src/pages/deals/[page].astro", _page18],
    ["src/pages/deals.astro", _page19],
    ["src/pages/how-to-redeem-coupon.astro", _page20],
    ["src/pages/popular.astro", _page21],
    ["src/pages/privacy.astro", _page22],
    ["src/pages/search.astro", _page23],
    ["src/pages/sitemap.xml.ts", _page24],
    ["src/pages/success-stories.astro", _page25],
    ["src/pages/terms.astro", _page26],
    ["src/pages/udemy-coupons-guide.astro", _page27],
    ["src/pages/index.astro", _page28]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a7d9ebb0-b3b9-4399-b133-39f396f039bd",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
