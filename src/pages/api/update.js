import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export const prerender = false;

export async function POST({ request }) {
  try {
    console.log('API: Request received');
    
    // Parse request body properly
    let dealData;
    try {
      const text = await request.text();
      console.log('API: Raw request body:', text.substring(0, 200));
      
      if (!text || text.trim() === '') {
        return new Response(JSON.stringify({ success: false, error: 'Request body is empty' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      dealData = JSON.parse(text);
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
    
    console.log('API: Received deal data:', { id: dealData.id, title: dealData.title });
    
    // Read current deals
    const filePath = join(process.cwd(), 'src', 'data', 'deals.json');
    const dealsData = JSON.parse(readFileSync(filePath, 'utf8'));
    
    // Find and update the deal
    const dealIndex = dealsData.findIndex(deal => deal.id === dealData.id);
    
    if (dealIndex === -1) {
      return new Response(JSON.stringify({ success: false, error: 'Deal not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the deal
    dealsData[dealIndex] = { ...dealsData[dealIndex], ...dealData };
    
    // Write back to file
    writeFileSync(filePath, JSON.stringify(dealsData, null, 2));
    
    console.log('API: Deal updated successfully:', dealData.id);
    
    return new Response(JSON.stringify({ success: true }), {
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