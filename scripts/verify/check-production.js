import axios from 'axios';

const PRODUCTION_URL = 'https://jobs-europa.com';

async function checkProductionHealth() {
  console.log('🔍 Checking production site health...\n');
  
  const checks = [
    { name: 'Homepage', url: `${PRODUCTION_URL}/` },
    { name: 'Main JS Bundle', url: `${PRODUCTION_URL}/assets/index-UAex7nmB.js` },
    { name: 'Store Bundle', url: `${PRODUCTION_URL}/assets/store-wPHh-DWH.js` },
    { name: 'UI Bundle', url: `${PRODUCTION_URL}/assets/ui-BBixyvyd.js` },
    { name: 'CSS Bundle', url: `${PRODUCTION_URL}/assets/index-BKePdUjZ.css` },
    { name: 'Favicon', url: `${PRODUCTION_URL}/favicons/favicon.ico` },
    { name: 'Android Icon', url: `${PRODUCTION_URL}/favicons/android-chrome-192x192.png` }
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      const response = await axios.head(check.url, { 
        timeout: 10000,
        validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
      });
      
      if (response.status === 200) {
        console.log(`✅ ${check.name}: OK (${response.status})`);
        passed++;
      } else if (response.status === 429) {
        console.log(`❌ ${check.name}: RATE LIMITED (${response.status})`);
        failed++;
      } else {
        console.log(`⚠️  ${check.name}: ${response.status}`);
        passed++; // Accept redirects, etc.
      }
    } catch (error) {
      if (error.response?.status === 429) {
        console.log(`❌ ${check.name}: RATE LIMITED (429)`);
      } else {
        console.log(`❌ ${check.name}: ERROR - ${error.message}`);
      }
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All production assets accessible!');
  } else {
    console.log('⚠️  Some assets still have issues. Check rate limiting.');
  }
}

checkProductionHealth().catch(console.error);
