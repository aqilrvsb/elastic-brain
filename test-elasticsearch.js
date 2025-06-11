import { elasticsearchConfig } from './src/config.js';

async function testElasticsearchConnection() {
  console.log('🔍 Testing Elasticsearch Connection & Indices');
  console.log('============================================');

  try {
    const headers = {
      'Authorization': `ApiKey ${elasticsearchConfig.auth.apiKey}`,
      'Content-Type': 'application/json'
    };

    // 1. Test connection
    console.log('📡 Testing connection...');
    const healthResponse = await fetch(`${elasticsearchConfig.node}/_cluster/health`, {
      method: 'GET',
      headers
    });
    
    if (!healthResponse.ok) {
      throw new Error(`Connection failed: ${healthResponse.status} ${healthResponse.statusText}`);
    }
    
    const health = await healthResponse.json();
    console.log(`✅ Connection successful: ${health.status} cluster with ${health.number_of_nodes} nodes`);

    // 2. List all indices
    console.log('\n📋 Listing all indices...');
    const indicesResponse = await fetch(`${elasticsearchConfig.node}/_cat/indices?format=json&h=index,docs.count,store.size`, {
      method: 'GET',
      headers
    });
    
    if (indicesResponse.ok) {
      const indices = await indicesResponse.json();
      console.log(`📊 Found ${indices.length} indices:`);
      
      const brainIndices = indices.filter(idx => idx.index.startsWith('brain-'));
      const kgIndices = indices.filter(idx => idx.index.startsWith('sales-brain-kg'));
      const otherIndices = indices.filter(idx => !idx.index.startsWith('brain-') && !idx.index.startsWith('sales-brain-kg'));
      
      if (brainIndices.length > 0) {
        console.log('\n🧠 Brain Indices:');
        brainIndices.forEach(idx => {
          console.log(`   • ${idx.index}: ${idx['docs.count']} docs, ${idx['store.size']}`);
        });
      }
      
      if (kgIndices.length > 0) {
        console.log('\n🔗 Knowledge Graph Indices:');
        kgIndices.forEach(idx => {
          console.log(`   • ${idx.index}: ${idx['docs.count']} docs, ${idx['store.size']}`);
        });
      }
      
      if (otherIndices.length > 0) {
        console.log('\n📂 Other Indices:');
        otherIndices.forEach(idx => {
          console.log(`   • ${idx.index}: ${idx['docs.count']} docs, ${idx['store.size']}`);
        });
      }
      
      if (brainIndices.length === 0 && kgIndices.length === 0) {
        console.log('\n⚠️  No Brain or KG indices found!');
        console.log('💡 Run: npm run init-brain  (to create brain indices)');
        console.log('💡 Or use tools to create data which will auto-create indices');
      }
    }

    // 3. Test index templates
    console.log('\n📋 Checking index templates...');
    const templatesResponse = await fetch(`${elasticsearchConfig.node}/_index_template/brain-*`, {
      method: 'GET',
      headers
    });
    
    if (templatesResponse.ok) {
      const templates = await templatesResponse.json();
      if (templates.index_templates && templates.index_templates.length > 0) {
        console.log('✅ Brain index templates found:');
        templates.index_templates.forEach(template => {
          console.log(`   • ${template.name}: ${template.index_template.index_patterns.join(', ')}`);
        });
      } else {
        console.log('⚠️  No brain index templates found');
      }
    }

    console.log('\n🎉 Elasticsearch test complete!');
    console.log('\n📋 Summary:');
    console.log(`   • Cluster Status: ${health.status}`);
    console.log(`   • Total Indices: ${indices.length}`);
    console.log(`   • Brain Indices: ${brainIndices.length}`);
    console.log(`   • Connection: ✅ Working`);

  } catch (error) {
    console.error('\n❌ Elasticsearch test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if Elasticsearch URL is correct');
    console.log('   2. Verify API key is valid');
    console.log('   3. Ensure network connectivity');
    console.log(`   4. URL: ${elasticsearchConfig.node}`);
  }
}

// Run the test
testElasticsearchConnection();
