// Test all hybrid brain tools via HTTP for n8n integration
const baseUrl = 'https://elastic-brain-production.up.railway.app';
const staffId = 'staff-alice-123';

console.log('🧠 Testing ALL Hybrid Brain Tools via HTTP for n8n...\n');

// All hybrid brain tools to test
const toolsToTest = [
  // Private Zone Tools
  {
    name: 'create_private_entities',
    params: {
      entityType: 'customer',
      entityData: {
        name: 'John Smith',
        company: 'ABC Manufacturing',
        phone: '+1234567890',
        industry: 'manufacturing'
      },
      tags: ['warm_lead', 'budget_conscious']
    }
  },
  {
    name: 'search_private_data', 
    params: {
      query: 'manufacturing customer',
      entityType: 'customer',
      limit: 5
    }
  },
  {
    name: 'update_customer_profile',
    params: {
      customerId: 'customer_001',
      updates: { status: 'hot_lead', lastContact: '2024-06-11' },
      addTags: ['ready_to_buy']
    }
  },
  {
    name: 'log_conversation',
    params: {
      customerId: 'customer_john_manufacturing',
      messages: [
        { sender: 'customer', message: 'What is your pricing?', timestamp: '10:00' },
        { sender: 'marketer', message: 'Our solution starts at $5,000', timestamp: '10:05' },
        { sender: 'customer', message: 'That seems expensive', timestamp: '10:10' },
        { sender: 'marketer', message: 'Let me show you the ROI...', timestamp: '10:15' }
      ],
      outcome: 'sent_quote',
      extractIntelligence: true
    }
  },

  // Shared Intelligence Tools
  {
    name: 'extract_sales_intelligence',
    params: {
      conversationId: 'conv_123',
      extractionType: 'objection_pattern',
      anonymize: true
    }
  },
  {
    name: 'query_shared_intelligence',
    params: {
      situation: 'Customer says price is too high',
      customerType: 'manufacturing',
      intelligenceType: 'objection_handling',
      limit: 3
    }
  },
  {
    name: 'get_objection_responses',
    params: {
      objectionType: 'price_too_high',
      customerIndustry: 'manufacturing',
      successRate: 70
    }
  },
  {
    name: 'suggest_response_template',
    params: {
      messageType: 'objection_response',
      customerProfile: 'manufacturing, budget-conscious',
      previousInteraction: 'expressed price concerns',
      minSuccessRate: 75
    }
  },
  {
    name: 'analyze_conversation_patterns',
    params: {
      conversationText: 'Customer: That price seems high for our budget. Me: Let me show you the ROI calculator...',
      customerContext: 'Manufacturing company, 50-200 employees',
      currentStage: 'objection_handling'
    }
  },
  {
    name: 'predict_success_probability',
    params: {
      proposedApproach: 'Send ROI calculator with 6-month payback analysis',
      customerProfile: 'Manufacturing, mid-size, cost-conscious',
      currentSituation: 'Price objection but showed interest in solution'
    }
  },
  {
    name: 'get_timing_recommendations',
    params: {
      lastInteraction: 'Sent quote 2 days ago',
      customerResponse: 'Said they need to think about it',
      customerType: 'manufacturing',
      messageType: 'follow_up'
    }
  },

  // Learning Contribution Tools
  {
    name: 'contribute_success_story',
    params: {
      successType: 'objection_overcome',
      approach: 'ROI calculator demonstration with industry-specific examples',
      context: 'Manufacturing client with budget constraints',
      outcome: 'Closed $8,000 deal within 3 days',
      customerProfile: 'Mid-size manufacturing, cost-focused',
      reusable: true
    }
  },
  {
    name: 'report_failed_approach',
    params: {
      failedApproach: 'Aggressive discount offer without value demonstration',
      customerReaction: 'Became suspicious of product quality',
      situationContext: 'Small business owner, price-sensitive',
      lessonsLearned: 'Lead with value, not discounts'
    }
  },
  {
    name: 'get_intelligence_stats',
    params: {
      statsType: 'objection_success_rates',
      timeframe: 'last_month'
    }
  },

  // Privacy & Compliance Tools  
  {
    name: 'audit_data_privacy',
    params: {
      auditType: 'personal_data_check'
    }
  },
  {
    name: 'anonymize_conversation',
    params: {
      conversationId: 'conv_123',
      preservePatterns: ['objection_types', 'response_strategies', 'success_indicators']
    }
  },

  // Utility Tools
  {
    name: 'get_zone_info',
    params: {
      infoType: 'all'
    }
  },
  {
    name: 'get_time_utc',
    params: {
      format: 'iso'
    }
  }
];

async function testTool(tool) {
  try {
    console.log(`🔧 Testing: ${tool.name}`);
    
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
          name: tool.name,
          arguments: tool.params
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.result) {
        console.log(`   ✅ SUCCESS`);
        console.log(`   📝 Response: ${JSON.stringify(data.result, null, 2).substring(0, 200)}...`);
        return { tool: tool.name, status: 'success', data: data.result };
      } else if (data.error) {
        console.log(`   ⚠️ ERROR: ${data.error.message}`);
        return { tool: tool.name, status: 'error', error: data.error.message };
      }
    } else {
      console.log(`   ❌ HTTP ${response.status}: ${response.statusText}`);
      return { tool: tool.name, status: 'http_error', code: response.status };
    }
  } catch (error) {
    console.log(`   💥 NETWORK ERROR: ${error.message}`);
    return { tool: tool.name, status: 'network_error', error: error.message };
  }
  console.log('');
}

async function testAllTools() {
  console.log(`Testing ${toolsToTest.length} hybrid brain tools...\n`);
  
  const results = [];
  
  for (const tool of toolsToTest) {
    const result = await testTool(tool);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  
  const successful = results.filter(r => r.status === 'success').length;
  const errors = results.filter(r => r.status === 'error').length;
  const httpErrors = results.filter(r => r.status === 'http_error').length;
  const networkErrors = results.filter(r => r.status === 'network_error').length;
  
  console.log(`✅ Successful: ${successful}/${toolsToTest.length} tools`);
  console.log(`⚠️ Errors: ${errors} tools`);
  console.log(`❌ HTTP Errors: ${httpErrors} tools`);
  console.log(`💥 Network Errors: ${networkErrors} tools`);
  
  if (successful === toolsToTest.length) {
    console.log('\n🎉 ALL HYBRID BRAIN TOOLS WORKING WITH HTTP!');
    console.log('✅ n8n integration ready for all tools');
    console.log('✅ Production deployment successful');
    console.log('✅ Ready for 200 marketers');
  } else {
    console.log('\n🔧 Some tools need attention:');
    results.filter(r => r.status !== 'success').forEach(r => {
      console.log(`   - ${r.tool}: ${r.status} (${r.error || r.code})`);
    });
  }
  
  return results;
}

// Run the test
testAllTools().catch(console.error);
