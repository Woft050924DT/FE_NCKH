/**
 * Utility to test API Gateway connectivity
 * Run this in browser console or import in a component to test connection
 */

import { apiClient } from '@/plugins/api';
import { authService } from '@/plugins/api';

export async function testApiGatewayConnection() {
  console.log('🔍 Testing API Gateway Connection...');
  console.log('📍 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

  const results = {
    healthCheck: false,
    login: false,
    profile: false,
    errors: [] as string[]
  };

  // Test 1: Health Check
  try {
    console.log('\n1️⃣ Testing Health Check endpoint...');
    const health = await apiClient.healthCheck();
    console.log('✅ Health Check successful:', health);
    results.healthCheck = true;
  } catch (error: any) {
    console.error('❌ Health Check failed:', error.message);
    results.errors.push(`Health Check: ${error.message}`);
  }

  // Test 2: Login (if API Gateway is running)
  if (results.healthCheck) {
    try {
      console.log('\n2️⃣ Testing Login endpoint...');
      const loginResponse = await authService.login({
        username: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Login successful:', loginResponse);
      results.login = true;

      // Test 3: Get Profile (requires authentication)
      if (loginResponse.user && (loginResponse.user.role === 'student' || loginResponse.user.role === 'instructor')) {
        try {
          console.log('\n3️⃣ Testing Profile endpoint...');
          const profile = await authService.getProfile(
            loginResponse.user.id,
            loginResponse.user.role
          );
          console.log('✅ Profile fetch successful:', profile);
          results.profile = true;
        } catch (error: any) {
          console.error('❌ Profile fetch failed:', error.message);
          results.errors.push(`Profile: ${error.message}`);
        }
      } else if (loginResponse.user) {
        console.log('⏭️  Skipping profile test - user role is not student or instructor');
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      results.errors.push(`Login: ${error.message}`);
      console.log('ℹ️  Note: Login may fail if test user does not exist');
    }
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('Health Check:', results.healthCheck ? '✅ PASS' : '❌ FAIL');
  console.log('Login:', results.login ? '✅ PASS' : '❌ FAIL');
  console.log('Profile:', results.profile ? '✅ PASS' : '❌ FAIL');

  if (results.errors.length > 0) {
    console.log('\n⚠️ Errors encountered:');
    results.errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  }

  if (results.healthCheck) {
    console.log('\n🎉 API Gateway is running and accessible!');
  } else {
    console.log('\n❌ API Gateway is not accessible. Please check:');
    console.log('  1. API Gateway is running (npm start)');
    console.log('  2. Port 3000 is not blocked');
    console.log('  3. VITE_API_BASE_URL is correct in .env');
  }

  return results;
}

/**
 * Quick health check only
 */
export async function quickHealthCheck() {
  try {
    const health = await apiClient.healthCheck();
    console.log('✅ API Gateway is healthy:', health);
    return true;
  } catch (error: any) {
    console.error('❌ API Gateway health check failed:', error.message);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testApiGateway = testApiGatewayConnection;
  (window as any).quickHealthCheck = quickHealthCheck;
  console.log('💡 API Gateway test utilities available:');
  console.log('  - testApiGateway() : Run full connection test');
  console.log('  - quickHealthCheck() : Quick health check only');
}
