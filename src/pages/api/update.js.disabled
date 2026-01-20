import { updateDeal } from '../../lib/store';
import { GitHubAPI } from '../../lib/github-api.js';

export const prerender = false;

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

    // Check if GitHub API is enabled
    console.log('🔍 Environment check:');
    console.log('USE_GITHUB_API:', process.env.USE_GITHUB_API);
    console.log('GITHUB_TOKEN exists:', !!process.env.GITHUB_TOKEN);
    console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN?.length || 0);
    
    const useGitHubAPI = process.env.USE_GITHUB_API === 'true' && process.env.GITHUB_TOKEN;
    console.log('useGitHubAPI result:', useGitHubAPI);
    
    if (useGitHubAPI) {
      // Update via GitHub API
      try {
        console.log('🚀 Attempting GitHub API update...');
        const githubAPI = new GitHubAPI();
        await githubAPI.updateDeal(updatedDeal);
        console.log(`✅ Successfully updated deal ${id} via GitHub API`);
        
        // Trigger build after successful update
        try {
          console.log('🔄 Triggering GitHub Actions build...');
          const buildResponse = await fetch(`https://api.github.com/repos/${githubAPI.repoOwner}/${githubAPI.repoName}/actions/workflows/manual-build.yml/dispatches`, {
            method: 'POST',
            headers: {
              'Authorization': `token ${githubAPI.getToken()}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ref: 'main',
              inputs: {
                reason: `Auto-triggered after updating deal ${id}`
              }
            })
          });
          
          if (buildResponse.ok) {
            console.log('✅ Build triggered successfully');
          } else {
            console.warn('⚠️ Failed to trigger build:', buildResponse.status);
          }
        } catch (buildError) {
          console.warn('⚠️ Build trigger failed:', buildError.message);
        }
        
      } catch (githubError) {
        console.error('❌ GitHub API failed, falling back to local file:', githubError);
        console.error('GitHub Error details:', githubError.message);
        // Fallback to local file
        await updateDeal(id, updatedDeal);
        console.log(`✅ Fallback: Updated deal ${id} locally`);
      }
    } else {
      // Update using local store (syncs to deals.json)
      console.log('📁 Using local file mode (GitHub API disabled)');
      await updateDeal(id, updatedDeal);
      console.log(`✅ Successfully updated deal ${id} locally`);
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