// Quick Elasticsearch connection test
import { elasticsearchConfig } from '../src/config.js';

console.log('🔧 Testing Elasticsearch Connection...');
console.log('URL:', elasticsearchConfig.node);
console.log('API Key length:', elasticsearchConfig.auth.apiKey.length);

// Test basic connectivity
async function testConnection() {
  try {
    const response = await fetch(elasticsearchConfig.node + '/_cluster/health', {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${elasticsearchConfig.auth.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Elasticsearch Connected!');
      console.log('Cluster status:', data.status);
      console.log('Cluster name:', data.cluster_name);
      return true;
    } else {
      console.log('❌ Connection failed');
      console.log('Response:', await response.text());
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

testConnection();
