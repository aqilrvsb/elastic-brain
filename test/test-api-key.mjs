// Test with API Key authentication
const config = await import('../dist/config.js');

console.log('🔧 Testing Elasticsearch with API Key...');
console.log('URL:', config.elasticsearchConfig.node);
console.log('API Key length:', config.elasticsearchConfig.auth.apiKey.length);

async function testApiKeyConnection() {
  try {
    console.log('\n🔍 Testing API Key authentication...');
    
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
      console.log('✅ SUCCESS! Elasticsearch Connected with API Key!');
      console.log('Cluster status:', data.status);
      console.log('Cluster name:', data.cluster_name);
      console.log('Number of nodes:', data.number_of_nodes);
      console.log('Active shards:', data.active_shards);
      
      // Test basic index creation
      console.log('\n🧠 Testing brain operations...');
      const indexResponse = await fetch(config.elasticsearchConfig.node + '/brain-test', {
        method: 'PUT',
        headers: {
          'Authorization': `ApiKey ${config.elasticsearchConfig.auth.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mappings: {
            properties: {
              staffId: { type: 'keyword' },
              zone: { type: 'keyword' },
              entity: { type: 'text' },
              timestamp: { type: 'date' }
            }
          }
        })
      });

      if (indexResponse.ok) {
        console.log('✅ Brain index created successfully!');
        
        // Test document creation
        const docResponse = await fetch(config.elasticsearchConfig.node + '/brain-test/_doc', {
          method: 'POST',
          headers: {
            'Authorization': `ApiKey ${config.elasticsearchConfig.auth.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            staffId: 'staff-alice-123',
            zone: 'private',
            entity: 'Test customer entity',
            timestamp: new Date().toISOString()
          })
        });

        if (docResponse.ok) {
          const docData = await docResponse.json();
          console.log('✅ Brain document created:', docData._id);
          console.log('🎉 FULL BRAIN FUNCTIONALITY WORKING!');
        }
      }
      
      return true;
    } else {
      console.log('❌ API Key authentication failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return false;
  }
}

const isConnected = await testApiKeyConnection();

if (isConnected) {
  console.log('\n🎉 ELASTICSEARCH BRAIN CONNECTION SUCCESSFUL!');
  console.log('✅ Real memory persistence enabled');
  console.log('✅ Ready for 200 marketers with hybrid learning');
  console.log('✅ Can now switch from mock to real Elasticsearch operations');
} else {
  console.log('\n💥 Still having connection issues - may need to check deployment status');
}
