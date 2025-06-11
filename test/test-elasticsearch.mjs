// Quick Elasticsearch connection test
const config = await import('../dist/config.js');

console.log('🔧 Testing Elasticsearch Connection...');
console.log('URL:', config.elasticsearchConfig.node);
console.log('API Key length:', config.elasticsearchConfig.auth.apiKey.length);

// Test basic connectivity
async function testConnection() {
  try {
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
      console.log('Number of nodes:', data.number_of_nodes);
      return true;
    } else {
      console.log('❌ Connection failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return false;
  }
}

console.log('Starting connection test...');
const isConnected = await testConnection();

if (isConnected) {
  console.log('\n🎉 SUCCESS: Elasticsearch is ready for brain operations!');
  console.log('✅ Your URL fix worked perfectly!');
} else {
  console.log('\n💥 FAILED: Need to debug Elasticsearch connection');
}
