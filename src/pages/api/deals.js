import { readDeals, writeDeals } from '../../lib/store.js';

export async function GET() {
  try {
    const deals = await readDeals();
    return new Response(JSON.stringify(deals), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch deals' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST({ request }) {
  try {
    const deals = await readDeals();

    const newDeal = await request.json();

    // Field yang tidak perlu diinput manual — jangan simpan dari form
    delete newDeal.discount;
    delete newDeal.skills;
    delete newDeal.faqs;
    delete newDeal.seoTitle;
    delete newDeal.seoDescription;
    delete newDeal.seoOgImage;
    delete newDeal.curriculum;

    if (!newDeal.title || !newDeal.url || !newDeal.category || typeof newDeal.price !== 'number') {
      return new Response(JSON.stringify({ error: 'Title, URL, category, and price are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!newDeal.provider) newDeal.provider = 'Udemy';
    if (!newDeal.id) {
      const existingIds = deals.map(deal => deal.id);
      let newId;

      // Keep generating until we find a unique ID
      do {
        newId = Math.floor(1000 + Math.random() * 9000).toString();
      } while (existingIds.includes(newId));

      newDeal.id = newId;
    }
    // Set timestamps
    const now = new Date().toISOString();
    newDeal.createdAt = now;
    newDeal.updatedAt = now;

    deals.push(newDeal);

    await writeDeals(deals);

    return new Response(JSON.stringify(newDeal), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[API] Error creating deal:', error);
    return new Response(JSON.stringify({ error: 'Failed to create deal' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT({ request }) {
  try {
    const url = new URL(request.url);
    const dealId = url.searchParams.get('id');

    if (!dealId) {
      return new Response(JSON.stringify({ error: 'Deal ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const patch = await request.json();
    // Field yang tidak perlu diinput manual — jangan simpan dari form
    delete patch.id;
    delete patch.discount;
    delete patch.skills;
    delete patch.faqs;
    delete patch.seoTitle;
    delete patch.seoDescription;
    delete patch.seoOgImage;
    delete patch.curriculum;
    delete patch.createdAt;

    if (!patch.provider) patch.provider = 'Udemy';

    const deals = await readDeals();
    const idx = deals.findIndex((d) => d.id === dealId);
    if (idx === -1) {
      return new Response(JSON.stringify({ error: 'Deal not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updated = {
      ...deals[idx],
      ...patch,
      id: dealId,
      updatedAt: new Date().toISOString(),
    };
    deals[idx] = updated;

    await writeDeals(deals);

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error updating deal:', error);
    return new Response(JSON.stringify({ error: 'Failed to update deal' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE({ request }) {
  try {

    const url = new URL(request.url);
    const dealId = url.searchParams.get('id');

    if (!dealId) {
      return new Response(JSON.stringify({ error: 'Deal ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deals = await readDeals();

    const initialLength = deals.length;
    const filteredDeals = deals.filter(deal => deal.id !== dealId);

    if (filteredDeals.length === initialLength) {
      return new Response(JSON.stringify({ error: 'Deal not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await writeDeals(filteredDeals);

    return new Response(JSON.stringify({
      success: true,
      message: 'Deal deleted successfully',
      deletedId: dealId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error deleting deal:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete deal' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}