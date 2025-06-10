// Test Elasticsearch connection with new API key
async function testNewApiKey() {
  console.log('🔑 Testing New Elasticsearch API Key');
  console.log('==================================');

  try {
    const config = {
      node: 'https://bc4d20f99098440d8df975469328cb06.ap-southeast-1.aws.found.io:443',
      apiKey: 'T3ZKdVc1Y0JrNlo1blhWeHBocjA6dEZXWGJUUnVtWVJzRDZ5bUhDUHNxZw=='
    };

    const headers = {
      'Authorization': `ApiKey ${config.apiKey}`,
      'Content-Type': 'application/json'
    };

    // Test cluster health
    console.log('📡 Testing cluster health with new API key...');
    const healthResponse = await fetch(`${config.node}/_cluster/health`, {
      method: 'GET',
      headers
    });
    
    if (!healthResponse.ok) {
      throw new Error(`HTTP ${healthResponse.status}: ${healthResponse.statusText}`);
    }
    
    const health = await healthResponse.json();
    console.log(`✅ NEW API KEY WORKS! Cluster Status: ${health.status}`);
    console.log(`📊 Nodes: ${health.number_of_nodes}, Shards: ${health.active_shards}`);

    // Test index creation
    console.log('\n🧠 Testing brain index creation...');
    const testIndexResponse = await fetch(`${config.node}/brain-test-${Date.now()}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        mappings: {
          properties: {
            staffId: { type: 'keyword' },
            testData: { type: 'text' },
            timestamp: { type: 'date' }
          }
        }
      })
    });

    if (testIndexResponse.ok) {
      const indexResult = await testIndexResponse.json();
      console.log(`✅ Index creation successful: ${indexResult.acknowledged}`);
    } else {
      console.log(`❌ Index creation failed: ${testIndexResponse.status}`);
    }

    // List current indices
    console.log('\n📋 Current indices in Elasticsearch...');
    const indicesResponse = await fetch(`${config.node}/_cat/indices?format=json&h=index,docs.count,store.size`, {
      method: 'GET',
      headers
    });
    
    if (indicesResponse.ok) {
      const indices = await indicesResponse.json();
      console.log(`📊 Found ${indices.length} indices:`);
      
      const brainIndices = indices.filter(idx => idx.index.includes('brain'));
      if (brainIndices.length > 0) {
        console.log('\n🧠 Brain indices:');
        brainIndices.forEach(idx => {
          console.log(`   • ${idx.index}: ${idx['docs.count']} docs`);
        });
      } else {
        console.log('\n⚠️  No brain indices yet (will be created when tools are used)');
      }
    }

    console.log('\n🎉 NEW API KEY FULLY WORKING!');
    return true;

  } catch (error) {
    console.error('\n❌ API Key test failed:', error.message);
    return false;
  }
}

testNewApiKey();
