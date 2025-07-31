export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { email, password, name } = JSON.parse(event.body);
    
    // Add your signup logic here
    // For now, we'll just return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User created successfully',
        user: { id: Date.now().toString(), name, email }
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
