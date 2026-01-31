#!/usr/bin/env node
/**
 * Test Bankr API - No SDK required
 * Direct API integration example
 */

import https from 'https';
import { promisify } from 'util';

// Test agent address
const TEST_AGENT = '0x1234567890123456789012345678901234567890';
const BANKR_BASE = 'api.bankr.bot';

async function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BANKR_BASE,
      path: `/v1${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Meridian Agent Economics Research'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testBankrAPI() {
  console.log('🦞 Testing Bankr API...\n');

  try {
    // Test 1: Check API health
    console.log('1️⃣  Checking API health...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    if (health.status === 200) {
      console.log('   ✅ API is responding\n');
    } else {
      console.log(`   Response: ${JSON.stringify(health.body).substring(0, 200)}\n`);
    }

    // Test 2: List strategies
    console.log('2️⃣  Checking available strategies...');
    const strategies = await makeRequest('/strategies');
    console.log(`   Status: ${strategies.status}`);
    if (strategies.status === 200) {
      console.log(`   ✅ Strategies found\n`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('Test complete.\n');
}

testBankrAPI();
