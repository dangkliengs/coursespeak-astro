import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST({ request }) {
  try {
    console.log('API: Save deal request received');
    
    // Parse request body properly
    let dealData;
    try {
      const text = await request.text();
      console.log('API: Raw save request body:', text.substring(0, 200));
      
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
    if (!dealData || !dealData.title) {
      return new Response(JSON.stringify({ success: false, error: 'Deal title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('API: Saving new deal:', dealData.title);
    
    // Read current deals
    const filePath = join(process.cwd(), 'src', 'data', 'deals.json');
    const dealsData = JSON.parse(readFileSync(filePath, 'utf8'));
    
    // Add new deal with ID and timestamp
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dealsData.push(newDeal);
    
    // Sort by recency (newest first)
    const sortedDeals = dealsData.sort((a, b) => {
      const timeA = new Date(a.updatedAt ?? a.createdAt ?? a.expiresAt ?? 0).getTime();
      const timeB = new Date(b.updatedAt ?? b.createdAt ?? b.expiresAt ?? 0).getTime();
      return timeB - timeA;
    });
    
    // Write back to file
    writeFileSync(filePath, JSON.stringify(sortedDeals, null, 2));
    
    console.log('API: Deal saved successfully:', newDeal.id);
    
    return new Response(JSON.stringify({ success: true, savedDeal: newDeal }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('API Save error:', error);
    console.error('API Error stack:', error.stack);
    
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
