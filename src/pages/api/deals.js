import { readFileSync } from 'fs';
import { join } from 'path';

export const prerender = false;

export async function GET() {
  try {
    console.log('API: GET deals request received');
    
    // Read current deals
    const filePath = join(process.cwd(), 'src', 'data', 'deals.json');
    const dealsData = JSON.parse(readFileSync(filePath, 'utf8'));
    
    console.log('API: Returning', dealsData.length, 'deals');

    return new Response(JSON.stringify(dealsData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API GET deals error:', error);
    
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
