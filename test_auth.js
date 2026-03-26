const axios = require('axios');

async function testAuth() {
  try {
    const email = `test${Date.now()}@example.com`;
    console.log(`Registering user: ${email}`);
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test',
      email: email,
      password: 'password123'
    });
    console.log('Register successful:', regRes.data);

    console.log(`Logging in user: ${email}`);
    const logRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: 'password123'
    });
    console.log('Login successful:', logRes.data);
    
    console.log('Getting protected route...');
    const taskRes = await axios.get('http://localhost:5000/api/tasks/analytics', {
      headers: {
        Authorization: `Bearer ${logRes.data.token}`
      }
    });
    console.log('Tasks fetched:', taskRes.data);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}
testAuth();
