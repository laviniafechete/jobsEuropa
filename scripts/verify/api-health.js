#!/usr/bin/env node

/**
 * API Health Check Script
 * Verifies all API endpoints are responding correctly
 */

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5001/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

// Public endpoints to test
const publicEndpoints = [
  { method: 'GET', path: '/health', name: 'Health Check' },
  { method: 'GET', path: '/cors-test', name: 'CORS Test' },
];

// Protected endpoints (require auth)
const protectedEndpoints = [
  { method: 'GET', path: '/auth/me', name: 'Get User Info', requiresAuth: true },
  { method: 'GET', path: '/users/me', name: 'Get User Profile', requiresAuth: true },
];

async function checkEndpoint({ method, path, name, requiresAuth = false }) {
  try {
    const url = `${API_BASE}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(url, options);
    
    if (requiresAuth && response.status === 401) {
      log.warn(`${name} (${method} ${path}) - Requires auth (as expected)`);
      return true;
    }

    if (response.ok) {
      log.success(`${name} (${method} ${path}) - ${response.status}`);
      return true;
    } else {
      log.error(`${name} (${method} ${path}) - ${response.status}`);
      return false;
    }
  } catch (error) {
    log.error(`${name} (${method} ${path}) - ${error.message}`);
    return false;
  }
}

async function runHealthChecks() {
  log.info('Starting API Health Checks...\n');
  log.info(`API Base URL: ${API_BASE}\n`);

  let passed = 0;
  let failed = 0;

  // Test public endpoints
  log.info('Testing Public Endpoints:');
  for (const endpoint of publicEndpoints) {
    const result = await checkEndpoint(endpoint);
    result ? passed++ : failed++;
  }

  console.log('');
  
  // Test protected endpoints
  log.info('Testing Protected Endpoints:');
  for (const endpoint of protectedEndpoints) {
    const result = await checkEndpoint(endpoint);
    result ? passed++ : failed++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('='.repeat(50) + '\n');

  if (failed > 0) {
    log.error('Some endpoints are not responding correctly!');
    process.exit(1);
  } else {
    log.success('All endpoints are healthy!');
    process.exit(0);
  }
}

// Run checks
runHealthChecks().catch(error => {
  log.error(`Health check failed: ${error.message}`);
  process.exit(1);
});

