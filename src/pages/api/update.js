import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export const prerender = false;

export async function POST({ request }) {
  try {
    console.log('API: Update request received');
    console.log('API: Request method:', request.method);
    console.log('API: Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Parse request body properly for Astro
    let dealData;
    try {
      const text = await request.text();
      console.log('API: Raw update request body:', text);
      console.log('API: Body length:', text?.length || 0);
      console.log('API: Body type:', typeof text);

      if (!text || text.trim() === '') {
        console.log('API: Empty body detected');
        return new Response(JSON.stringify({ success: false, error: 'Request body is empty' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      dealData = JSON.parse(text);
      console.log('API: Parsed deal data:', dealData);
    } catch (parseError) {
      console.error('API: JSON parse error:', parseError);
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON: ' + parseError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    if (!dealData || !dealData.id) {
      return new Response(JSON.stringify({ success: false, error: 'Deal ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('API: Updating deal:', dealData.id);

    // Read current deals
    const filePath = join(process.cwd(), 'src', 'data', 'deals.json');
    const dealsData = JSON.parse(readFileSync(filePath, 'utf8'));

    // Find and update deal
    const dealIndex = dealsData.findIndex(deal => deal.id === dealData.id);

    if (dealIndex === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Deal not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update deal
    dealsData[dealIndex] = dealData;

    // Sort by recency (newest first) like store.ts does
    const sortedDeals = dealsData.sort((a, b) => {
      const timeA = new Date(a.updatedAt ?? a.createdAt ?? a.expiresAt ?? 0).getTime();
      const timeB = new Date(b.updatedAt ?? b.createdAt ?? b.expiresAt ?? 0).getTime();
      return timeB - timeA;  // Newest first
    });

    // Write back to file
    writeFileSync(filePath, JSON.stringify(sortedDeals, null, 2));

    console.log('API: Deal updated successfully:', dealData.id);

    return new Response(JSON.stringify({ success: true, updatedDeal: dealData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Update error:', error);
    console.error('API Error stack:', error.stack);

    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
