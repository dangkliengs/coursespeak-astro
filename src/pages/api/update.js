import { githubAPI } from '../../lib/github-api.js';
import { updateDeal as updateDealLocal } from '../../lib/store.ts';

export async function POST({ request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const updatedDeal = { id };

    // Extract all form fields
    for (const [key, value] of formData.entries()) {
      if (key === 'price' || key === 'originalPrice' || key === 'rating' || key === 'students') {
        updatedDeal[key] = value ? parseFloat(value) : null;
      } else if (key === 'learn' || key === 'requirements') {
        // Handle arrays - split by newlines and filter empty lines
        updatedDeal[key] = value ? value.split('\n').filter(item => item.trim()) : [];
      } else if (key === 'expiresAt') {
        // Convert datetime-local to ISO string
        updatedDeal[key] = value ? new Date(value).toISOString() : null;
      } else {
        updatedDeal[key] = value;
      }
    }

    const useGitHubApi = process.env.USE_GITHUB_API === 'false';

    if (useGitHubApi) {
      // Update deal using GitHub API
      await githubAPI.updateDeal(updatedDeal);
    } else {
      // Update deal locally in dev mode
      const result = await updateDealLocal(id, updatedDeal);
      if (!result) {
        return new Response(JSON.stringify({ error: 'Deal not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Redirect back to admin deals page
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/deals',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error updating deal:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}