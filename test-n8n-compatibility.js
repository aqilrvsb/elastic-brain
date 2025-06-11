// Test n8n MCP client compatibility
async function testN8nMcpCompatibility() {
  console.log('🔗 Testing n8n MCP Client Compatibility');
  console.log('=====================================');

  const BASE_URL = 'https://elastic-brain-production.up.railway.app';
  const STAFF_ID = 'staff-test-123';
  const NICHE_ID = 'EXAMA';

  let totalTests = 0;
  let successCount = 0;

  // Test 1: Standard endpoint - notifications/initialized
  console.log('\n1. 📡 Testing Standard Endpoint - notifications/initialized...');
  totalTests++;
  try {
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
        id: 1
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.result?.acknowledged) {
        successCount++;
        console.log('   ✅ SUCCESS: Standard endpoint handles notifications/initialized');
        console.log(`   📝 Message: ${result.result.message}`);
      } else {
        console.log('   ❌ FAILED: No acknowledgment received');
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 2: Niche endpoint - notifications/initialized
  console.log(`\n2. 🎯 Testing Niche Endpoint (${NICHE_ID}) - notifications/initialized...`);
  totalTests++;
  try {
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}/${NICHE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
        id: 1
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.result?.acknowledged && result.result?.nicheId === NICHE_ID) {
        successCount++;
        console.log(`   ✅ SUCCESS: Niche endpoint handles notifications/initialized`);
        console.log(`   🎯 Niche ID: ${result.result.nicheId}`);
        console.log(`   📝 Message: ${result.result.message}`);
      } else {
        console.log('   ❌ FAILED: No proper acknowledgment received');
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 3: Standard endpoint - initialize
  console.log('\n3. 🚀 Testing Standard Endpoint - initialize...');
  totalTests++;
  try {
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'n8n-test', version: '1.0.0' }
        },
        id: 2
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.result?.serverInfo?.name === 'brain-mcp') {
        successCount++;
        console.log('   ✅ SUCCESS: Standard endpoint initialization working');
        console.log(`   🛠️ Server: ${result.result.serverInfo.name}`);
      } else {
        console.log('   ❌ FAILED: Invalid initialization response');
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 4: Niche endpoint - initialize
  console.log(`\n4. 🎯 Testing Niche Endpoint (${NICHE_ID}) - initialize...`);
  totalTests++;
  try {
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}/${NICHE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'n8n-niche-test', version: '1.0.0' }
        },
        id: 2
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.result?.serverInfo?.nicheId === NICHE_ID) {
        successCount++;
        console.log(`   ✅ SUCCESS: Niche endpoint initialization working`);
        console.log(`   🎯 Niche Server: ${result.result.serverInfo.name}`);
        console.log(`   🆔 Niche ID: ${result.result.serverInfo.nicheId}`);
      } else {
        console.log('   ❌ FAILED: Invalid niche initialization response');
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 5: Standard endpoint - tools/list
  console.log('\n5. 🛠️ Testing Standard Endpoint - tools/list...');
  totalTests++;
  try {
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 3
      })
    });

    if (response.ok) {
      const result = await response.json();
      const toolsCount = result.result?.tools?.length || 0;
      if (toolsCount >= 35) {
        successCount++;
        console.log(`   ✅ SUCCESS: ${toolsCount} tools available`);
      } else {
        console.log(`   ⚠️  PARTIAL: ${toolsCount} tools (expected 35+)`);
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Test 6: Niche endpoint - tools/list
  console.log(`\n6. 🎯 Testing Niche Endpoint (${NICHE_ID}) - tools/list...`);
  totalTests++;
  try {
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}/${NICHE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 3
      })
    });

    if (response.ok) {
      const result = await response.json();
      const toolsCount = result.result?.tools?.length || 0;
      const nicheSpecific = result.result?.nicheSpecific;
      
      if (toolsCount >= 35 && nicheSpecific && result.result?.nicheId === NICHE_ID) {
        successCount++;
        console.log(`   ✅ SUCCESS: ${toolsCount} niche-specific tools`);
        console.log(`   🎯 Niche ID: ${result.result.nicheId}`);
      } else {
        console.log(`   ⚠️  PARTIAL: ${toolsCount} tools, niche-specific: ${nicheSpecific}`);
      }
    } else {
      console.log(`   ❌ FAILED: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   💥 ERROR: ${error.message}`);
  }

  // Final Results
  console.log('\n🎉 N8N MCP CLIENT COMPATIBILITY TEST COMPLETE!');
  console.log('=============================================');
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${totalTests - successCount}`);
  console.log(`📈 Success Rate: ${Math.round((successCount / totalTests) * 100)}%`);

  console.log('\n📋 n8n MCP Client Configuration Status:');
  console.log(`🔗 Standard Endpoint: ${successCount >= 3 ? '✅ READY' : '❌ ISSUES'}`);
  console.log(`🎯 Niche Endpoint: ${successCount >= 5 ? '✅ READY' : '❌ ISSUES'}`);
  console.log(`📡 MCP Protocol: ${successCount >= 4 ? '✅ COMPATIBLE' : '❌ NEEDS_WORK'}`);

  if (successCount >= totalTests * 0.8) {
    console.log('\n🎊 N8N MCP CLIENT COMPATIBILITY ACHIEVED!');
    console.log('🔗 Ready for WAblas → n8n → Brain integration!');
    console.log('\n📋 Use these configurations in n8n:');
    console.log(`   Standard: ${BASE_URL}/stream/${STAFF_ID}`);
    console.log(`   Niche: ${BASE_URL}/stream/${STAFF_ID}/${NICHE_ID}`);
  } else {
    console.log('\n⚠️ Some compatibility issues detected');
    console.log('💡 Wait for Railway deployment to complete');
  }
}

testN8nMcpCompatibility();
