// API endpoint to restore data from localStorage
export const prerender = false;

export async function POST({ request }) {
  try {
    const { dealId } = await request.json();
    
    // Read current deals
    const fs = await import('fs/promises');
    const path = await import('path');
    const dealsPath = path.join(process.cwd(), 'src/data/deals.json');
    
    const currentDeals = JSON.parse(await fs.readFile(dealsPath, 'utf8'));
    
    // Find the deal
    const deal = currentDeals.find(deal => deal.id === dealId);
    
    if (deal) {
      return new Response(JSON.stringify({
        success: true,
        deal: deal,
        message: `Found deal: ${deal.title}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: `Deal with ID "${dealId}" not found`,
        availableDeals: currentDeals.map(d => ({ id: d.id, title: d.title }))
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
