// Simple Elasticsearch connection test
async function testConnection() {
  console.log('🔍 Testing Elasticsearch Connection');
  console.log('==================================');

  try {
    const config = {
      node: 'https://bc4d20f99098440d8df975469328cb06.ap-southeast-1.aws.found.io:443',
      apiKey: 'S0NjaFdwY0JZa0RQVUJjS1ZzR2o6X1ZvdTNTUXJKWldOb1ZnZlZySk1JQQ=='
    };

    const headers = {
      'Authorization': `ApiKey ${config.apiKey}`,
      'Content-Type': 'application/json'
    };

    // Test cluster health
    console.log('📡 Testing cluster health...');
    const healthResponse = await fetch(`${config.node}/_cluster/health`, {
      method: 'GET',
      headers
    });
    
    if (!healthResponse.ok) {
      throw new Error(`HTTP ${healthResponse.status}: ${healthResponse.statusText}`);
    }
    
    const health = await healthResponse.json();
    console.log(`✅ Cluster Status: ${health.status}`);
    console.log(`📊 Nodes: ${health.number_of_nodes}`);
    console.log(`🔒 Security: ${health.cluster_name}`);

    // List indices
    console.log('\n📋 Listing indices...');
    const indicesResponse = await fetch(`${config.node}/_cat/indices?format=json&h=index,docs.count,store.size`, {
      method: 'GET',
      headers
    });
    
    if (indicesResponse.ok) {
      const indices = await indicesResponse.json();
      console.log(`📊 Total indices: ${indices.length}`);
      
      if (indices.length === 0) {
        console.log('⚠️  No indices found - this is why your tools show no data!');
        console.log('💡 Indices will be created when you first use the brain tools');
      } else {
        console.log('\n📂 Found indices:');
        indices.forEach(idx => {
          console.log(`   • ${idx.index}: ${idx['docs.count']} docs`);
        });
      }
      
      const brainIndices = indices.filter(idx => idx.index.includes('brain'));
      if (brainIndices.length === 0) {
        console.log('\n🧠 No brain-specific indices found yet');
        console.log('   This explains why your 32 tools show no data');
        console.log('   Indices will be auto-created when tools are used');
      }
    }

    console.log('\n🎉 CONNECTION SUCCESSFUL!');
    console.log('\n📋 Next steps:');
    console.log('   1. Deploy to Railway (will auto-create indices on first use)');
    console.log('   2. Test a brain tool to create first index');
    console.log('   3. Indices will populate as marketers use the system');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔧 This might be a network/firewall issue');
      console.log('   The connection should work fine from Railway servers');
    }
  }
}

testConnection();
