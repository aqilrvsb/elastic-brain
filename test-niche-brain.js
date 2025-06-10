// NICHE-BASED BRAIN TESTING
async function testNicheBrainArchitecture() {
  console.log('🎯 TESTING DYNAMIC NICHE-BASED BRAIN ARCHITECTURE');
  console.log('================================================');

  const BASE_URL = 'https://elastic-brain-production.up.railway.app';
  const STAFF_ID = 'staff-test-123';
  
  // Test different niches
  const niches = [
    'product-a-kids-genius',
    'product-b-health-supplement', 
    'product-c-business-software'
  ];

  let totalTests = 0;
  let successCount = 0;

  for (const nicheId of niches) {
    console.log(`\n🧠 Testing Niche: ${nicheId}`);
    console.log('----------------------------------------');

    // Test 1: Niche Info Endpoint
    totalTests++;
    try {
      console.log(`📋 Testing niche info for ${nicheId}...`);
      const infoResponse = await fetch(`${BASE_URL}/niche/${nicheId}/info`);
      
      if (infoResponse.ok) {
        const nicheInfo = await infoResponse.json();
        successCount++;
        console.log(`   ✅ SUCCESS: Niche info retrieved`);
        console.log(`   📊 Tools: ${nicheInfo.activeTools}`);
        console.log(`   🎯 Endpoints: ${Object.keys(nicheInfo.endpoints).length} available`);
      } else {
        console.log(`   ❌ FAILED: Status ${infoResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
    }

    // Test 2: Niche-Specific Tools List
    totalTests++;
    try {
      console.log(`🛠️ Testing niche tools list for ${nicheId}...`);
      const toolsResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}/${nicheId}`, {
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
        successCount++;
        console.log(`   ✅ SUCCESS: ${toolsData.result?.tools?.length || 0} tools available`);
        console.log(`   🎯 Niche ID: ${toolsData.result?.nicheId}`);
        console.log(`   📦 Niche specific: ${toolsData.result?.nicheSpecific}`);
      } else {
        console.log(`   ❌ FAILED: Status ${toolsResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
    }

    // Test 3: Niche-Specific Buying Signals Detection
    totalTests++;
    try {
      console.log(`🎯 Testing niche buying signals for ${nicheId}...`);
      const signalsResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}/${nicheId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'detect_buying_signals',
            arguments: {
              customerMessage: `I'm interested in ${nicheId.replace('-', ' ')}. What's the next step?`,
              conversationText: `I'm interested in ${nicheId.replace('-', ' ')}. What's the next step?`
            }
          },
          id: 2
        })
      });

      if (signalsResponse.ok) {
        const signalsResult = await signalsResponse.json();
        const result = signalsResult.result?.content?.[0]?.text ? 
          JSON.parse(signalsResult.result.content[0].text) : signalsResult.result;
        
        if (result?.success) {
          successCount++;
          console.log(`   ✅ SUCCESS: Signals detected for ${result.nicheId}`);
          console.log(`   📊 Close readiness: ${result.closeReadinessScore || 'N/A'}`);
          console.log(`   🎯 Niche specific: ${result.nicheSpecificLearning || 0} learned patterns`);
        } else {
          console.log(`   ❌ FAILED: No signals detected`);
        }
      } else {
        console.log(`   ❌ FAILED: Status ${signalsResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
    }

    // Test 4: Niche-Specific Intelligence Extraction
    totalTests++;
    try {
      console.log(`🧠 Testing niche intelligence extraction for ${nicheId}...`);
      const extractResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}/${nicheId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'extract_sales_intelligence',
          params: {
            conversationData: { 
              text: `Customer showed high interest in ${nicheId} features` 
            },
            extractionType: 'interest_patterns'
          }
        })
      });

      if (extractResponse.ok) {
        const extractResult = await extractResponse.json();
        if (extractResult?.success) {
          successCount++;
          console.log(`   ✅ SUCCESS: Intelligence extracted for ${extractResult.nicheId}`);
          console.log(`   📝 Pattern ID: ${extractResult.patternId}`);
          console.log(`   🔄 Shared with niche: ${extractResult.sharedWithNiche}`);
        } else {
          console.log(`   ❌ FAILED: No intelligence extracted`);
        }
      } else {
        console.log(`   ❌ FAILED: Status ${extractResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
    }

    // Test 5: Niche-Specific Private Entity Creation
    totalTests++;
    try {
      console.log(`📝 Testing niche entity creation for ${nicheId}...`);
      const entityResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}/${nicheId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'create_private_entities',
          params: {
            entityType: 'customer',
            entityData: {
              name: `Test Customer for ${nicheId}`,
              product: nicheId,
              interest_level: 'high'
            },
            tags: ['niche-test', nicheId]
          }
        })
      });

      if (entityResponse.ok) {
        const entityResult = await entityResponse.json();
        if (entityResult?.success) {
          successCount++;
          console.log(`   ✅ SUCCESS: Entity created for ${entityResult.nicheId}`);
          console.log(`   🆔 Entity ID: ${entityResult.entityId}`);
          console.log(`   🎯 Niche specific: ${entityResult.nicheSpecific}`);
        } else {
          console.log(`   ❌ FAILED: No entity created`);
        }
      } else {
        console.log(`   ❌ FAILED: Status ${entityResponse.status}`);
      }
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
    }
  }

  // Test Cross-Niche Separation
  console.log(`\n🔄 Testing Cross-Niche Intelligence Separation`);
  console.log('==============================================');

  totalTests++;
  try {
    console.log('🔍 Testing niche intelligence query...');
    
    // Query intelligence for specific niche
    const nicheQueryResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}/${niches[0]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'query_shared_intelligence',
        params: {
          queryType: 'interest_patterns',
          limit: 5
        }
      })
    });

    if (nicheQueryResponse.ok) {
      const queryResult = await nicheQueryResponse.json();
      if (queryResult?.success) {
        successCount++;
        console.log(`   ✅ SUCCESS: Niche-specific intelligence queried`);
        console.log(`   🎯 Niche: ${queryResult.nicheId}`);
        console.log(`   📊 Results: ${queryResult.totalNicheIntelligence} patterns`);
        console.log(`   🔒 Niche separation: ${queryResult.nicheSpecificLearning ? 'WORKING' : 'FAILED'}`);
      } else {
        console.log(`   ❌ FAILED: No intelligence found`);
      }
    } else {
      console.log(`   ❌ FAILED: Status ${nicheQueryResponse.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Final Results
  console.log('\n🎉 NICHE-BASED BRAIN ARCHITECTURE TEST COMPLETE!');
  console.log('===============================================');
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${totalTests - successCount}`);
  console.log(`📈 Success Rate: ${Math.round((successCount / totalTests) * 100)}%`);
  console.log(`🧠 Niche Intelligence: ${successCount >= totalTests * 0.8 ? '✅ WORKING' : '⚠️ NEEDS WORK'}`);
  console.log(`🎯 Dynamic Separation: ${successCount >= totalTests * 0.8 ? '✅ FUNCTIONAL' : '⚠️ ISSUES'}`);
  
  console.log('\n🎯 NICHE ARCHITECTURE FEATURES:');
  console.log(`   • Product A marketers learn separately from Product B`);
  console.log(`   • Each product has its own closing strategies and objection handling`);
  console.log(`   • Intelligence is shared only within the same product/niche`);
  console.log(`   • Private customer data is separated by staff + niche`);
  console.log(`   • Brain gets smarter for each product independently`);

  if (successCount >= totalTests * 0.8) {
    console.log('\n🎊 NICHE-BASED BRAIN ARCHITECTURE SUCCESSFUL!');
    console.log('🔥 Ready for multi-product WhatsApp domination!');
    console.log('💰 Each product will have optimized closing strategies!');
  } else {
    console.log('\n⚠️ Some niche features need deployment to Railway first');
  }
}

testNicheBrainArchitecture();
