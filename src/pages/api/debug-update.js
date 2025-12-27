// Debug API endpoint
export const prerender = false;

export async function POST({ request }) {
  console.log('DEBUG API: Request received');
  
  try {
    const dealData = await request.json();
    console.log('DEBUG API: Deal data:', JSON.stringify(dealData, null, 2));
    
    // Read current deals
    const fs = await import('fs/promises');
    const path = await import('path');
    const dealsPath = path.join(process.cwd(), 'src/data/deals.json');
    
    console.log('DEBUG API: Working directory:', process.cwd());
    console.log('DEBUG API: Deals path:', dealsPath);
    console.log('DEBUG API: File exists before:', await fs.access(dealsPath).then(() => true).catch(() => false));
    
    const currentDeals = JSON.parse(await fs.readFile(dealsPath, 'utf8'));
    console.log('DEBUG API: Current deals count:', currentDeals.length);
    
    // Find and update deal
    const dealIndex = currentDeals.findIndex(deal => deal.id === dealData.id);
    console.log('DEBUG API: Deal index:', dealIndex);
    
    if (dealIndex !== -1) {
      const oldTitle = currentDeals[dealIndex].title;
      currentDeals[dealIndex] = {
        ...currentDeals[dealIndex],
        ...dealData,
        updatedAt: new Date().toISOString()
      };
      
      console.log('DEBUG API: Title changed from:', oldTitle, 'to:', dealData.title);
      
      // Write back to file
      await fs.writeFile(dealsPath, JSON.stringify(currentDeals, null, 2));
      console.log('DEBUG API: File written successfully');
      
      // Verify file was written
      const verifyDeals = JSON.parse(await fs.readFile(dealsPath, 'utf8'));
      const verifyDeal = verifyDeals.find(d => d.id === dealData.id);
      console.log('DEBUG API: Verification - title in file:', verifyDeal?.title);
      
      return new Response(JSON.stringify({
        success: true,
        updatedDeal: currentDeals[dealIndex],
        message: `Deal "${dealData.title}" updated successfully`,
        debug: {
          oldTitle,
          newTitle: dealData.title,
          fileVerified: verifyDeal?.title === dealData.title
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: `Deal with ID "${dealData.id}" not found`,
        debug: {
          availableIds: currentDeals.slice(0, 5).map(d => d.id)
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('DEBUG API: Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
