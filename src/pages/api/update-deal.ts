import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import type { Deal } from '@/types/deal';

const DEALS_FILE = path.join(process.cwd(), 'src', 'data', 'deals.json');

export const POST: APIRoute = async ({ request }) => {
  try {
    const dealData: Deal = await request.json();
    
    if (!dealData.id) {
      return new Response(JSON.stringify({ error: 'Deal ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Read existing deals
    let existingDeals: Deal[] = [];
    try {
      const data = await fs.readFile(DEALS_FILE, 'utf-8');
      existingDeals = JSON.parse(data);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to read existing deals' }), {
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
    
    // Update the deal with new data and timestamp
    existingDeals[dealIndex] = {
      ...existingDeals[dealIndex],
      ...dealData,
      updatedAt: new Date().toISOString()
    };
    
    // Sort deals by recency (updated first)
    existingDeals.sort((a, b) => {
      const timeA = new Date(a.updatedAt ?? a.createdAt ?? a.expiresAt ?? 0).getTime();
      const timeB = new Date(b.updatedAt ?? b.createdAt ?? b.expiresAt ?? 0).getTime();
      return timeB - timeA; // Newest first
    });
    
    // Write back to file
    await fs.writeFile(DEALS_FILE, JSON.stringify(existingDeals, null, 2), 'utf-8');
    
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
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
