// API endpoint for updating deals
export const prerender = false;

import { updateDeal } from '../../lib/store.js';

export async function POST({ request }) {
  console.log('API UPDATE: Request received');
  
  try {
    const dealData = await request.json();
    console.log('API UPDATE: Deal data received:', dealData);
    
    // Use store.ts updateDeal function (same as dashboard)
    const updatedDeal = await updateDeal(dealData.id, dealData);
    
    if (updatedDeal) {
      console.log('API UPDATE: Deal updated successfully:', updatedDeal.title);
      return new Response(JSON.stringify({
        success: true,
        updatedDeal: updatedDeal,
        message: `Deal "${updatedDeal.title}" updated successfully`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.log('API UPDATE: Deal not found with ID:', dealData.id);
      return new Response(JSON.stringify({
        success: false,
        error: `Deal with ID "${dealData.id}" not found`,
        message: 'Please check deal ID and try again'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('API UPDATE: Error occurred:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: 'Failed to update deal'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
