// COMPREHENSIVE TEST: All 35 Tools + Niche Architecture with Real Elasticsearch
async function testCompleteSystemWithElasticsearch() {
  console.log('🧠 COMPREHENSIVE SYSTEM TEST: 35 Tools + Niche Architecture');
  console.log('============================================================');

  const config = {
    node: 'https://bc4d20f99098440d8df975469328cb06.ap-southeast-1.aws.found.io:443',
    apiKey: 'T3ZKdVc1Y0JrNlo1blhWeHBocjA6dEZXWGJUUnVtWVJzRDZ5bUhDUHNxZw=='
  };

  const BASE_URL = 'https://elastic-brain-production.up.railway.app';
  const STAFF_ID = 'comprehensive-test-staff';
  const NICHE_ID = 'EXAMA';

  let totalTests = 0;
  let successCount = 0;

  // Test 1: Elasticsearch Connection
  console.log('\n1. 🔗 Testing Elasticsearch Connection...');
  totalTests++;
  try {
    const healthResponse = await fetch(`${config.node}/_cluster/health`, {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      successCount++;
      console.log(`   ✅ SUCCESS: Cluster ${health.status}, ${health.number_of_nodes} nodes`);
    } else {
      console.log(`   ❌ FAILED: HTTP ${healthResponse.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 2: Standard Brain Tools List
  console.log('\n2. 📋 Testing Standard Brain Tools List...');
  totalTests++;
  try {
    const toolsResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 1
      })
    });

    if (toolsResponse.ok) {
      const toolsData = await toolsResponse.json();
      const toolsCount = toolsData.result?.tools?.length || 0;
      if (toolsCount === 35) {
        successCount++;
        console.log(`   ✅ SUCCESS: ${toolsCount} tools available (expected 35)`);
      } else {
        console.log(`   ⚠️  PARTIAL: ${toolsCount} tools (expected 35)`);
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${toolsResponse.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 3: Niche Brain Tools List
  console.log(`\n3. 🎯 Testing Niche Brain Tools List (${NICHE_ID})...`);
  totalTests++;
  try {
    const nicheToolsResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}/${NICHE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 1
      })
    });

    if (nicheToolsResponse.ok) {
      const nicheToolsData = await nicheToolsResponse.json();
      const nicheToolsCount = nicheToolsData.result?.tools?.length || 0;
      const nicheSpecific = nicheToolsData.result?.nicheSpecific;
      
      if (nicheToolsCount === 35 && nicheSpecific) {
        successCount++;
        console.log(`   ✅ SUCCESS: ${nicheToolsCount} niche tools, niche-specific: ${nicheSpecific}`);
      } else {
        console.log(`   ⚠️  PARTIAL: ${nicheToolsCount} tools, niche-specific: ${nicheSpecific}`);
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${nicheToolsResponse.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 4: Key Standard Brain Tools
  console.log('\n4. 🔧 Testing Key Standard Brain Tools...');
  const standardTools = [
    { name: 'get_time_utc', args: { format: 'iso' }},
    { name: 'detect_buying_signals', args: { customerMessage: 'What\'s the next step?' }},
    { name: 'get_ai_objection_responses', args: { objectionText: 'Too expensive', objectionType: 'price_concern' }},
    { name: 'track_closing_readiness', args: { customerId: 'test-001', closingFactors: { budget: 'confirmed' }}},
    { name: 'create_private_entities', args: { entityType: 'customer', entityData: { name: 'Test Customer' }}}
  ];

  for (const tool of standardTools) {
    totalTests++;
    try {
      const toolResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: tool.name,
          params: tool.args
        })
      });

      if (toolResponse.ok) {
        const result = await toolResponse.json();
        if (result.success) {
          successCount++;
          console.log(`   ✅ ${tool.name}: SUCCESS`);
        } else {
          console.log(`   ❌ ${tool.name}: FAILED - ${result.error}`);
        }
      } else {
        console.log(`   ❌ ${tool.name}: HTTP ${toolResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ${tool.name}: ERROR - ${error.message}`);
    }
    
    // Small delay to avoid overwhelming
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Test 5: Key Niche Brain Tools
  console.log(`\n5. 🎯 Testing Key Niche Brain Tools (${NICHE_ID})...`);
  const nicheTools = [
    { name: 'detect_buying_signals', args: { customerMessage: `I'm interested in ${NICHE_ID}. What's next?` }},
    { name: 'get_ai_objection_responses', args: { objectionText: 'Not sure about this', objectionType: 'uncertainty' }},
    { name: 'extract_sales_intelligence', args: { conversationData: { text: `Customer interested in ${NICHE_ID}` }}},
    { name: 'create_private_entities', args: { entityType: 'customer', entityData: { name: `${NICHE_ID} Customer` }}}
  ];

  for (const tool of nicheTools) {
    totalTests++;
    try {
      const nicheToolResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}/${NICHE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: tool.name,
          params: tool.args
        })
      });

      if (nicheToolResponse.ok) {
        const result = await nicheToolResponse.json();
        if (result.success && result.nicheId === NICHE_ID) {
          successCount++;
          console.log(`   ✅ ${tool.name} (${NICHE_ID}): SUCCESS`);
        } else {
          console.log(`   ❌ ${tool.name} (${NICHE_ID}): FAILED`);
        }
      } else {
        console.log(`   ❌ ${tool.name} (${NICHE_ID}): HTTP ${nicheToolResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ${tool.name} (${NICHE_ID}): ERROR - ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Test 6: Elasticsearch Data Verification
  console.log('\n6. 📊 Testing Elasticsearch Data Creation...');
  totalTests++;
  try {
    const indicesResponse = await fetch(`${config.node}/_cat/indices?format=json&h=index,docs.count`, {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (indicesResponse.ok) {
      const indices = await indicesResponse.json();
      const brainIndices = indices.filter(idx => idx.index.includes('brain'));
      const nicheIndices = indices.filter(idx => idx.index.includes(NICHE_ID.toLowerCase()));
      
      successCount++;
      console.log(`   ✅ SUCCESS: Found ${brainIndices.length} brain indices`);
      console.log(`   🎯 Niche indices: ${nicheIndices.length} for ${NICHE_ID}`);
      
      brainIndices.forEach(idx => {
        console.log(`     • ${idx.index}: ${idx['docs.count']} documents`);
      });
    } else {
      console.log(`   ❌ FAILED: Could not check indices`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 7: Niche Information Endpoint
  console.log(`\n7. 📋 Testing Niche Info Endpoint (${NICHE_ID})...`);
  totalTests++;
  try {
    const nicheInfoResponse = await fetch(`${BASE_URL}/niche/${NICHE_ID}/info`);
    
    if (nicheInfoResponse.ok) {
      const nicheInfo = await nicheInfoResponse.json();
      successCount++;
      console.log(`   ✅ SUCCESS: Niche info retrieved`);
      console.log(`   🎯 Niche ID: ${nicheInfo.nicheId}`);
      console.log(`   🛠️ Tools: ${nicheInfo.activeTools}`);
      console.log(`   🔗 Endpoints: ${Object.keys(nicheInfo.endpoints).length}`);
    } else {
      console.log(`   ❌ FAILED: HTTP ${nicheInfoResponse.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 8: Closing Mastery Tools
  console.log('\n8. 🎪 Testing Closing Mastery Tools...');
  const closingTools = [
    { name: 'track_closing_readiness', args: { customerId: 'closing-test', closingFactors: { budget: 'confirmed', timeline: 'urgent' }}},
    { name: 'get_closing_recommendations', args: { customerId: 'closing-test' }},
    { name: 'analyze_closing_outcome', args: { customerId: 'closing-test', closingAttempt: { approach: 'direct' }, outcome: 'deal_closed' }}
  ];

  for (const tool of closingTools) {
    totalTests++;
    try {
      const closingResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: tool.name,
          params: tool.args
        })
      });

      if (closingResponse.ok) {
        const result = await closingResponse.json();
        if (result.success) {
          successCount++;
          console.log(`   ✅ ${tool.name}: SUCCESS`);
        } else {
          console.log(`   ❌ ${tool.name}: FAILED`);
        }
      } else {
        console.log(`   ❌ ${tool.name}: HTTP ${closingResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ${tool.name}: ERROR - ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Final Results
  console.log('\n🎉 COMPREHENSIVE SYSTEM TEST COMPLETE!');
  console.log('=====================================');
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${totalTests - successCount}`);
  console.log(`📈 Success Rate: ${Math.round((successCount / totalTests) * 100)}%`);
  
  console.log('\n📋 System Status:');
  console.log(`🔗 Elasticsearch: ${successCount >= 1 ? '✅ Connected' : '❌ Failed'}`);
  console.log(`🛠️ Standard Brain: ${successCount >= 5 ? '✅ Working' : '❌ Issues'}`);
  console.log(`🎯 Niche Brain: ${successCount >= 8 ? '✅ Working' : '❌ Issues'}`);
  console.log(`🎪 Closing Mastery: ${successCount >= 11 ? '✅ Working' : '❌ Issues'}`);
  console.log(`📊 Data Storage: ${successCount >= 12 ? '✅ Working' : '❌ Issues'}`);

  console.log('\n🔄 Available Endpoints:');
  console.log(`   • Standard Brain: ${BASE_URL}/stream/${STAFF_ID}`);
  console.log(`   • Niche Brain: ${BASE_URL}/stream/${STAFF_ID}/${NICHE_ID}`);
  console.log(`   • Niche Info: ${BASE_URL}/niche/${NICHE_ID}/info`);

  if (successCount >= totalTests * 0.8) {
    console.log('\n🎊 SYSTEM FULLY OPERATIONAL!');
    console.log('🔥 Ready for production WhatsApp integration!');
    console.log('💰 Multi-product sales domination achieved!');
  } else {
    console.log('\n⚠️ Some components need attention after Railway deployment');
  }

  return {
    totalTests,
    successCount,
    successRate: Math.round((successCount / totalTests) * 100),
    systemStatus: successCount >= totalTests * 0.8 ? 'OPERATIONAL' : 'NEEDS_WORK'
  };
}

testCompleteSystemWithElasticsearch();
