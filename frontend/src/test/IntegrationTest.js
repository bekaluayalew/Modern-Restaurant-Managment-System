const API_BASE = 'http://localhost:5000/api';

const testIntegration = async () => {
  console.log('🔍 Starting Integration Tests...\n');

  // Test 1: Health Check
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health Check Passed:', data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  // Test 2: Get Products
  try {
    const response = await fetch(`${API_BASE}/products`);
    const data = await response.json();
    if (data.success) {
      console.log(`✅ Products API: Found ${data.products?.length || 0} products`);
    } else {
      console.log('❌ Products API Failed:', data);
    }
  } catch (error) {
    console.log('❌ Products API Error:', error.message);
  }

  // Test 3: Register User
  try {
    const testUser = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpass123'
    };
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ Registration: User created successfully');
    } else {
      console.log('❌ Registration Failed:', data);
    }
  } catch (error) {
    console.log('❌ Registration Error:', error.message);
  }

  // Test 4: Login
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@coffeeshop.com',
        password: 'admin123'
      })
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ Login: Admin user logged in successfully');
      console.log('   Token:', data.token?.substring(0, 30) + '...');
    } else {
      console.log('❌ Login Failed:', data);
    }
  } catch (error) {
    console.log('❌ Login Error:', error.message);
  }

  console.log('\n🏁 Integration Tests Complete!');
};
testIntegration();