// Debug path API
export const prerender = false;

export async function GET() {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const cwd = process.cwd();
  const dealsPath = path.join(cwd, 'src/data/deals.json');
  
  const info = {
    workingDirectory: cwd,
    dealsPath: dealsPath,
    fileExists: await fs.access(dealsPath).then(() => true).catch(() => false),
    nodeEnv: process.env.NODE_ENV,
    astroNode: process.env.ASTRO_NODE
  };
  
  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
