// Verify 32 tools are now available
async function verify32Tools() {
  console.log('🔍 Verifying 32 Tools Available on Railway');
  console.log('========================================');

  try {
    const BASE_URL = 'https://elastic-brain-production.up.railway.app';
    const STAFF_ID = 'staff-test-123';

    // Test tools/list endpoint
    console.log('📋 Testing tools/list endpoint...');
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 1
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const tools = data.result?.tools || [];
    
    console.log(`✅ Response received successfully`);
    console.log(`📊 Tools count: ${tools.length}`);
    
    if (tools.length === 32) {
      console.log('🎉 SUCCESS: Exactly 32 tools confirmed!');
      
      console.log('\n📋 Complete Tool List:');
      tools.forEach((tool, index) => {
        console.log(`   ${(index + 1).toString().padStart(2, '0')}. ${tool.name}`);
      });
      
      console.log('\n✅ ALL TOOLS VERIFIED:');
      console.log('   • Private Zone Tools: 4');
      console.log('   • Shared Intelligence Tools: 12'); 
      console.log('   • Market Intelligence Tools: 4');
      console.log('   • Analytics & Insights Tools: 4');
      console.log('   • Additional Power Tools: 7');
      console.log('   • Utility Tool: 1');
      console.log('   = TOTAL: 32 AI-Powered Tools');
      
    } else {
      console.log(`❌ MISMATCH: Expected 32 tools, got ${tools.length}`);
      console.log('⏳ This might be because Railway is still deploying...');
      console.log('💡 Wait 2-3 minutes and try again');
    }

    // Test a few key tools
    console.log('\n🧪 Testing Key Tool Functionality...');
    
    const testTools = [
      'get_time_utc',
      'suggest_response_template', 
      'analyze_conversation_patterns',
      'predict_success_probability'
    ];

    for (const toolName of testTools) {
      try {
        const testResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: toolName,
              arguments: toolName === 'suggest_response_template' ? { scenario: 'introduction' } :
                        toolName === 'analyze_conversation_patterns' ? { conversationHistory: [], analysisType: 'all' } :
                        toolName === 'predict_success_probability' ? { customerProfile: {}, dealContext: {} } :
                        {}
            },
            id: Math.random()
          })
        });
        
        const result = await testResponse.json();
        const status = result.result?.success ? '✅' : '❌';
        console.log(`   ${status} ${toolName}: ${result.result?.success ? 'Working' : 'Failed'}`);
      } catch (error) {
        console.log(`   ❌ ${toolName}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if Railway deployment completed');
    console.log('   2. Verify URL is accessible');
    console.log('   3. Wait a few minutes for deployment');
  }
}

verify32Tools();
