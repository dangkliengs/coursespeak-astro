// API endpoint to serve deals data
import dealsData from '../../data/deals.json';

export async function GET() {
  return new Response(JSON.stringify(dealsData), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
