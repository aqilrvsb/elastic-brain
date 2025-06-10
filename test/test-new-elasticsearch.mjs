// Test NEW Elasticsearch deployment connection
const config = await import('../dist/config.js');

console.log('🔧 Testing NEW Elasticsearch Deployment...');
console.log('URL:', config.elasticsearchConfig.node);
console.log('Username:', config.elasticsearchConfig.auth.username);
console.log('Password length:', config.elasticsearchConfig.auth.password.length);

// Test connection with username/password auth
async function testNewConnection() {
  try {
    console.log('\n🔍 Testing connection to your new deployment...');
    
    // Create basic auth header
    const credentials = btoa(`${config.elasticsearchConfig.auth.username}:${config.elasticsearchConfig.auth.password}`);
    
    const response = await fetch(config.elasticsearchConfig.node + '/_cluster/health', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ NEW Elasticsearch Connected Successfully!');
      console.log('Cluster status:', data.status);
      console.log('Cluster name:', data.cluster_name);
      console.log('Number of nodes:', data.number_of_nodes);
      console.log('Active shards:', data.active_shards);
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

console.log('Starting connection test with NEW credentials...');
const isConnected = await testNewConnection();

if (isConnected) {
  console.log('\n🎉 SUCCESS: Your NEW Elasticsearch deployment is ready!');
  console.log('✅ Brain MCP server can now use real memory persistence!');
  console.log('🚀 Ready for 200 marketers with hybrid learning!');
} else {
  console.log('\n💥 FAILED: Need to debug the new connection');
}
