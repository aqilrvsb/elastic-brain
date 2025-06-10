// More detailed Elasticsearch connection test
const config = await import('../dist/config.js');

console.log('🔧 Testing Elasticsearch Connection...');
console.log('URL:', config.elasticsearchConfig.node);
console.log('API Key length:', config.elasticsearchConfig.auth.apiKey.length);

// Test 1: Basic HTTPS connection (no auth)
async function testBasicConnection() {
  try {
    console.log('\n🔍 Test 1: Basic HTTPS connectivity...');
    const response = await fetch(config.elasticsearchConfig.node, {
      method: 'GET'
    });
    console.log('✅ Basic HTTPS works, status:', response.status);
    return true;
  } catch (error) {
    console.log('❌ Basic HTTPS failed:', error.message);
    return false;
  }
}

// Test 2: With authentication
async function testAuthConnection() {
  try {
    console.log('\n🔍 Test 2: With API key authentication...');
    const response = await fetch(config.elasticsearchConfig.node + '/_cluster/health', {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${config.elasticsearchConfig.auth.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Elasticsearch Connected Successfully!');
      console.log('Cluster status:', data.status);
      console.log('Cluster name:', data.cluster_name);
      return true;
    } else {
      console.log('❌ Auth failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Auth test error:', error.message);
    return false;
  }
}

// Test 3: Alternative URL format
async function testAlternativeURL() {
  try {
    console.log('\n🔍 Test 3: Alternative URL without port...');
    const altUrl = 'https://my-elasticsearch-project-d584c1.kb.ap-southeast-1.aws.elastic.cloud';
    const response = await fetch(altUrl + '/_cluster/health', {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${config.elasticsearchConfig.auth.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Alt URL response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Alternative URL works!');
      console.log('Cluster status:', data.status);
      return true;
    } else {
      console.log('❌ Alternative URL failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Alternative URL error:', error.message);
    return false;
  }
}

console.log('Starting comprehensive connection tests...');

const test1 = await testBasicConnection();
const test2 = await testAuthConnection();
const test3 = await testAlternativeURL();

if (test1 || test2 || test3) {
  console.log('\n🎉 SUCCESS: At least one connection method works!');
} else {
  console.log('\n💥 FAILED: All connection methods failed');
  console.log('\n🔧 Troubleshooting suggestions:');
  console.log('1. Check if your Elasticsearch cluster is running');
  console.log('2. Verify the API key is still valid');
  console.log('3. Check if your IP is whitelisted');
  console.log('4. Try accessing the cluster from Elasticsearch Cloud console');
}
