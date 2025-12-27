// API endpoint to check localStorage data
export const prerender = false;

export async function POST({ request }) {
  try {
    const { searchTitle } = await request.json();
    
    // Read current deals
    const fs = await import('fs/promises');
    const path = await import('path');
    const dealsPath = path.join(process.cwd(), 'src/data/deals.json');
    
    const currentDeals = JSON.parse(await fs.readFile(dealsPath, 'utf8'));
    
    // Search for deals with Blender in title
    const blenderDeals = currentDeals.filter(deal => 
      deal.title && deal.title.toLowerCase().includes('blender')
    );
    
    // Also search for Modelling Challenges
    const modellingDeals = currentDeals.filter(deal => 
      deal.title && deal.title.toLowerCase().includes('modelling')
    );
    
    return new Response(JSON.stringify({
      success: true,
      blenderDeals: blenderDeals.map(d => ({ id: d.id, title: d.title })),
      modellingDeals: modellingDeals.map(d => ({ id: d.id, title: d.title })),
      searchTitle: searchTitle,
      totalDeals: currentDeals.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
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
