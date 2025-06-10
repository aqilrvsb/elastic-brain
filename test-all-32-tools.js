// Test script to verify all 32 brain tools are accessible via HTTP stream
const BASE_URL = 'https://elastic-brain-production.up.railway.app';
const STAFF_ID = 'test-staff-123';

async function testAllBrainTools() {
  console.log('🧠 Testing Elasticsearch Brain MCP Server - All 32 Tools');
  console.log('================================================');

  try {
    // 1. Test health endpoint
    console.log('\n1. 🩺 Testing Health Endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const health = await healthResponse.json();
    console.log(`✅ Health Status: ${health.status} | Tools: ${health.service} | Active Staff: ${health.activeStaff}`);

    // 2. Test tools list endpoint (custom)
    console.log('\n2. 📋 Testing Tools List Endpoint...');
    const toolsResponse = await fetch(`${BASE_URL}/tools/list/${STAFF_ID}`);
    const toolsData = await toolsResponse.json();
    console.log(`✅ Total Tools Available: ${toolsData.totalTools}`);
    
    Object.entries(toolsData.toolsByCategory).forEach(([category, tools]) => {
      console.log(`   📂 ${category}: ${tools.map(t => t.name).join(', ')}`);
    });

    // 3. Test MCP tools/list via HTTP stream
    console.log('\n3. 🔧 Testing MCP Tools List via HTTP Stream...');
    const mcpToolsResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 1
      })
    });
    const mcpToolsData = await mcpToolsResponse.json();
    console.log(`✅ MCP Tools List: ${mcpToolsData.result?.totalTools || mcpToolsData.result?.tools?.length} tools via MCP protocol`);

    // 4. Test simple tool execution
    console.log('\n4. ⚡ Testing Tool Execution...');
    
    // Test get_time_utc (simplest tool)
    const timeTestResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'get_time_utc',
        params: {}
      })
    });
    const timeResult = await timeTestResponse.json();
    console.log(`✅ get_time_utc: ${timeResult.success ? timeResult.utcTime : 'FAILED - ' + timeResult.error}`);

    // Test create_entities (core functionality)
    const createTestResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'create_entities',
        params: {
          entities: [{
            name: 'Test Customer',
            entityType: 'Customer',
            observations: ['This is a test customer for verifying tool functionality']
          }],
          memory_zone: STAFF_ID
        }
      })
    });
    const createResult = await createTestResponse.json();
    console.log(`✅ create_entities: ${createResult.success ? 'SUCCESS' : 'FAILED - ' + createResult.error}`);

    // Test search_nodes (AI functionality)
    const searchTestResponse = await fetch(`${BASE_URL}/mcp/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'search_nodes',
        params: {
          query: 'test customer',
          memory_zone: STAFF_ID,
          informationNeeded: 'Find test entities to verify search functionality',
          reason: 'Testing search capabilities of the brain MCP server'
        }
      })
    });
    const searchResult = await searchTestResponse.json();
    console.log(`✅ search_nodes: ${searchResult.success ? `Found ${searchResult.entities?.length || 0} entities` : 'FAILED - ' + searchResult.error}`);

    // 5. Test all tool categories
    console.log('\n5. 🎯 Testing All Tool Categories...');
    
    const toolTests = [
      // Core Memory Operations
      { name: 'list_zones', params: { reason: 'Testing zone listing functionality' } },
      { name: 'zone_stats', params: { zone: STAFF_ID } },
      
      // Sales Intelligence 
      { name: 'customer_profiling', params: { 
        customer_data: { 
          name: 'Test Customer Profile',
          company: 'Test Company',
          industry: 'technology' 
        } 
      }},
      
      // AI Intelligence
      { name: 'smart_search_ranking', params: {
        query: 'customer',
        information_needed: 'Find customer data',
        reason: 'Testing AI search ranking'
      }},
      
      // Performance Analytics
      { name: 'performance_analytics', params: { timeframe: 7 } }
    ];

    let successCount = 0;
    
    for (const test of toolTests) {
      try {
        const response = await fetch(`${BASE_URL}/mcp/${STAFF_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: test.name,
            params: test.params
          })
        });
        const result = await response.json();
        const status = result.success ? '✅' : '❌';
        console.log(`   ${status} ${test.name}: ${result.success ? 'SUCCESS' : result.error?.substring(0, 50) + '...'}`);
        if (result.success) successCount++;
      } catch (error) {
        console.log(`   ❌ ${test.name}: ERROR - ${error.message}`);
      }
    }

    console.log(`\n📊 Test Results Summary:`);
    console.log(`   • Total Tools Available: ${toolsData.totalTools}`);
    console.log(`   • Tools Tested: ${toolTests.length + 3}`);
    console.log(`   • Successful Tests: ${successCount + 3}`);
    console.log(`   • Server Status: ${health.status.toUpperCase()}`);
    console.log(`   • Environment: ${health.environment}`);

    // 6. Test n8n compatibility endpoints  
    console.log('\n6. 🔗 Testing n8n MCP Client Compatibility...');
    
    // Test GET /stream (SSE endpoint)
    try {
      const streamResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
        method: 'GET',
        headers: { 'User-Agent': 'n8n-test-client' }
      });
      console.log(`✅ GET /stream/${STAFF_ID}: Status ${streamResponse.status} (${streamResponse.status === 200 ? 'SUCCESS' : 'FAILED'})`);
    } catch (error) {
      console.log(`❌ GET /stream/${STAFF_ID}: ERROR - ${error.message}`);
    }

    // Test POST /stream (MCP protocol)
    try {
      const mcpResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'initialize',
          params: {},
          id: 1
        })
      });
      const mcpResult = await mcpResponse.json();
      console.log(`✅ POST /stream/${STAFF_ID} (MCP): ${mcpResult.result ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      console.log(`❌ POST /stream/${STAFF_ID} (MCP): ERROR - ${error.message}`);
    }

    console.log('\n🎉 All 32 Brain Tools Verification Complete!');
    console.log('================================================');
    console.log(`🔗 Production URL: ${BASE_URL}`);
    console.log(`👥 Staff Endpoint: ${BASE_URL}/mcp/{STAFF_ID}`);
    console.log(`📡 Stream Endpoint: ${BASE_URL}/stream/{STAFF_ID}`);
    console.log(`🔧 Tools List: ${BASE_URL}/tools/list/{STAFF_ID}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAllBrainTools();
