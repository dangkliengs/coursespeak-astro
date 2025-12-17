
import type { APIRoute } from 'astro';
import { readDeals } from '../../lib/store';

export const GET: APIRoute = async ({ url }) => {
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12', 10);

    // Filter params
    const category = url.searchParams.get('category');
    const provider = url.searchParams.get('provider');
    const q = url.searchParams.get('q')?.toLowerCase();

    let allDeals = await readDeals();

    if (category) {
        allDeals = allDeals.filter(d =>
            d.category?.toLowerCase() === category.toLowerCase() ||
            d.subcategory?.toLowerCase() === category.toLowerCase()
        );
    }

    if (provider) {
        allDeals = allDeals.filter(d => d.provider?.toLowerCase() === provider.toLowerCase());
    }

    if (q) {
        allDeals = allDeals.filter(d =>
            d.title?.toLowerCase().includes(q) ||
            d.description?.toLowerCase().includes(q)
        );
    }

    const total = allDeals.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const items = allDeals.slice(start, start + pageSize);

    return new Response(JSON.stringify({
        items,
        page,
        totalPages,
        total
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
