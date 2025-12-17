export const prerender = false;

import { promises as fs } from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    // Add error handling for request body
    let dealData;
    try {
      dealData = await request.json();
    } catch (jsonError) {
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: jsonError.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!dealData || !dealData.id) {
      return new Response(JSON.stringify({ 
        error: 'Deal data and ID are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Read deals.json
    const dealsPath = path.join(process.cwd(), 'src', 'data', 'deals.json');
    let fileData, deals;
    
    try {
      fileData = await fs.readFile(dealsPath, 'utf-8');
      deals = JSON.parse(fileData);
    } catch (fileError) {
      return new Response(JSON.stringify({ 
        error: 'Failed to read deals.json file',
        details: fileError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Find and update the deal
    const index = deals.findIndex(d => d.id === dealData.id);
    if (index === -1) {
      return new Response(JSON.stringify({ 
        error: 'Deal not found with ID: ' + dealData.id 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the deal
    deals[index] = { 
      ...deals[index], 
      ...dealData, 
      updatedAt: new Date().toISOString() 
    };
    
    // Sort by updatedAt
    deals.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    
    // Write back to file
    try {
      await fs.writeFile(dealsPath, JSON.stringify(deals, null, 2));
    } catch (writeError) {
      return new Response(JSON.stringify({ 
        error: 'Failed to write to deals.json',
        details: writeError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return success response
    const successResponse = { 
      success: true, 
      message: 'Deal updated successfully',
      dealId: dealData.id
    };
    
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
