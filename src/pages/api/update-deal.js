import { promises as fs } from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    const dealData = await request.json();
    console.log('Received deal data:', dealData);
    
    if (!dealData.id) {
      return new Response(JSON.stringify({ error: 'Deal ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Read existing deals
    const dealsPath = path.join(process.cwd(), 'src', 'data', 'deals.json');
    let existingDeals = [];
    
    try {
      const data = await fs.readFile(dealsPath, 'utf-8');
      existingDeals = JSON.parse(data);
      console.log('Read existing deals:', existingDeals.length, 'deals');
    } catch (error) {
      console.error('Failed to read deals file:', error);
      return new Response(JSON.stringify({ error: 'Failed to read deals file' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Find and update the deal
    const dealIndex = existingDeals.findIndex(deal => deal.id === dealData.id);
    if (dealIndex === -1) {
      return new Response(JSON.stringify({ error: 'Deal not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the deal
    existingDeals[dealIndex] = {
      ...existingDeals[dealIndex],
      ...dealData,
      updatedAt: new Date().toISOString()
    };
    
    // Sort by updated date
    existingDeals.sort((a, b) => {
      const timeA = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const timeB = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return timeB - timeA;
    });
    
    // Write back to file
    await fs.writeFile(dealsPath, JSON.stringify(existingDeals, null, 2), 'utf-8');
    console.log('Successfully updated deal');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Deal updated successfully',
      deal: existingDeals[dealIndex]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
