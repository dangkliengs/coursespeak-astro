import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST({ request }) {
  try {
    const dealData = await request.json();
    
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
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Update error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}