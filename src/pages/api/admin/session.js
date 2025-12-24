export async function GET({ request }) {
  // Check for existing session (cookie-based or header-based)
  const session = request.headers.get('authorization');
  
  if (session && session === 'Bearer admin-token') {
    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // For local development, check if there's a valid admin token
  const adminToken = 'admin-token'; // Simple token for local dev
  
  return new Response(JSON.stringify({ authenticated: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { token } = body;
    
    // Simple token validation for now
    if (token === 'admin-token') {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `admin-session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`
        }
      });
    }
    
    return new Response(JSON.stringify({ success: false, message: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE({ request }) {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin-session=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  });
}
