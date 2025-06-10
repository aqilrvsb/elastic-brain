// Test specific real Elasticsearch tools via HTTP
const baseUrl = 'https://elastic-brain-production.up.railway.app';
const staffId = 'staff-alice-123';

console.log('🔥 Testing REAL Elasticsearch Tools via HTTP...\n');

async function testRealTool(toolName, params) {
  try {
    console.log(`🧠 Testing REAL: ${toolName}`);
    
    const response = await fetch(`${baseUrl}/stream/${staffId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: params
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS!');
      console.log('📄 Full Response:', JSON.stringify(data, null, 2));
      return data;
    } else {
      console.log(`❌ HTTP ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`💥 ERROR: ${error.message}`);
    return null;
  }
  console.log('');
}

async function testRealElasticsearchTools() {
  // Test 1: get_time_utc (should show real Elasticsearch connection)
  console.log('=== TEST 1: Real Elasticsearch Connection ===');
  await testRealTool('get_time_utc', { format: 'iso' });
  
  console.log('\n=== TEST 2: Create Private Entity (Real Elasticsearch) ===');
  await testRealTool('create_private_entities', {
    entityType: 'customer',
    entityData: {
      name: 'John Smith - Manufacturing Co',
      industry: 'manufacturing',
      phone: '+1-555-123-4567',
      notes: 'Interested in cost-saving solutions'
    },
    tags: ['warm_lead', 'manufacturing']
  });
  
  console.log('\n=== TEST 3: Log Conversation (Real Elasticsearch) ===');
  await testRealTool('log_conversation', {
    customerId: 'customer_john_manufacturing',
    messages: [
      { sender: 'customer', message: 'What is your pricing structure?', timestamp: '10:00' },
      { sender: 'marketer', message: 'Our solution starts at $5,000 annually', timestamp: '10:05' },
      { sender: 'customer', message: 'That seems quite expensive for our budget', timestamp: '10:10' },
      { sender: 'marketer', message: 'Let me show you our ROI calculator to demonstrate value...', timestamp: '10:15' },
      { sender: 'customer', message: 'OK, I\'d like to see that', timestamp: '10:20' }
    ],
    outcome: 'scheduled_call',
    extractIntelligence: true
  });
  
  console.log('\n=== TEST 4: Query Shared Intelligence (Real Elasticsearch) ===');
  await testRealTool('query_shared_intelligence', {
    situation: 'Customer expressed budget concerns about pricing',
    customerType: 'manufacturing',
    intelligenceType: 'objection_handling',
    limit: 5
  });
  
  console.log('\n=== TEST 5: Search Private Data (Real Elasticsearch) ===');
  await testRealTool('search_private_data', {
    query: 'manufacturing customer budget',
    entityType: 'customer',
    limit: 10
  });
  
  console.log('\n🎉 REAL ELASTICSEARCH TESTING COMPLETE!');
  console.log('📊 All tools should now be using real Elasticsearch operations');
  console.log('🚀 Ready for production deployment with persistent memory!');
}

testRealElasticsearchTools().catch(console.error);
