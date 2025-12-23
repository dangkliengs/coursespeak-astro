export async function POST({ request }) {
  try {
    const { email } = await request.json();

    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Please enter a valid email address.' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // For static sites, we'll return success and let frontend handle localStorage
    console.log('Newsletter subscription:', email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for subscribing! You will receive exclusive Udemy coupons soon.',
        email: email,
        subscribedAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Newsletter error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Something went wrong. Please try again.' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
