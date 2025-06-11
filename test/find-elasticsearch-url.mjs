// Test multiple URL formats for Elasticsearch endpoint
const baseUrl = 'brain-mcp-elasticsearch.kb.ap-southeast-1.aws.found.io';
const username = 'elastic';
const password = 'ytwXHJvqUsXnwMJRddtRKe0v';

console.log('🔧 Testing multiple Elasticsearch URL formats...\n');

async function testUrlFormat(url, description) {
  try {
    console.log(`🔍 Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    const credentials = btoa(`${username}:${password}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! This URL works!');
      console.log('Response:', JSON.stringify(data, null, 2));
      return url;
    } else {
      console.log('❌ Failed');
      const errorText = await response.text();
      console.log('Error:', errorText.substring(0, 100));
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
  console.log('');
  return null;
}

// Test different URL formats
const urlsToTest = [
  {
    url: `https://${baseUrl}:9243`,
    desc: 'Standard port 9243'
  },
  {
    url: `https://${baseUrl}:9200`,
    desc: 'Standard port 9200'
  },
  {
    url: `https://${baseUrl}`,
    desc: 'No port (HTTPS default)'
  },
  {
    url: `https://${baseUrl}:443`,
    desc: 'HTTPS port 443'
  },
  {
    url: `https://${baseUrl}:9243/_cluster/health`,
    desc: 'Port 9243 with health endpoint'
  },
  {
    url: `https://${baseUrl}/_cluster/health`,
    desc: 'No port with health endpoint'
  }
];

async function findWorkingUrl() {
  for (const test of urlsToTest) {
    const workingUrl = await testUrlFormat(test.url, test.desc);
    if (workingUrl) {
      const baseEndpoint = workingUrl.replace('/_cluster/health', '');
      console.log('🎉 FOUND WORKING ELASTICSEARCH ENDPOINT:');
      console.log(`✅ ${baseEndpoint}`);
      return baseEndpoint;
    }
  }
  console.log('💥 None of the URL formats worked. May need to check deployment status.');
  return null;
}

findWorkingUrl();
