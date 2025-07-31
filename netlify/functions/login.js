export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);
    
    // Add your login logic here
    // For now, we'll just return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Login successful',
        user: { id: Date.now().toString(), email }
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
