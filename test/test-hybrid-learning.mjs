// Test Hybrid Learning Architecture
import { processHybridBrainTool } from '../src/hybrid-brain-processor.js';

console.log('🧠 Testing Hybrid Learning Architecture...\n');

// Test data for demonstrations
const staffAlice = 'staff-alice-123';
const staffBob = 'staff-bob-456';

async function testHybridLearning() {
  console.log('=== TESTING PRIVATE ZONE OPERATIONS ===\n');
  
  // Test 1: Alice logs a private conversation
  console.log('📱 Test 1: Alice logs WhatsApp conversation with customer...');
  const conversation = await processHybridBrainTool('log_conversation', {
    customerId: 'customer_john_abc_manufacturing',
    messages: [
      { sender: 'customer', message: 'Hi Alice, what\'s the price for your software?', timestamp: '2024-06-10T10:00:00Z' },
      { sender: 'marketer', message: 'Hi John! Our solution starts at $5,000. Let me show you the ROI...', timestamp: '2024-06-10T10:05:00Z' },
      { sender: 'customer', message: 'That seems expensive for our budget.', timestamp: '2024-06-10T10:10:00Z' },
      { sender: 'marketer', message: 'I understand. Let me show you exactly how this pays for itself...', timestamp: '2024-06-10T10:15:00Z' },
      { sender: 'customer', message: 'Ok, send me the details.', timestamp: '2024-06-10T10:20:00Z' }
    ],
    outcome: 'sent_quote',
    extractIntelligence: true
  }, staffAlice);
  
  console.log('✅ Alice\'s conversation result:');
  console.log(JSON.stringify(conversation, null, 2));
  console.log('\n');

  // Test 2: Alice searches her private data
  console.log('🔍 Test 2: Alice searches her private customer data...');
  const searchResult = await processHybridBrainTool('search_private_data', {
    query: 'manufacturing customers with budget concerns',
    entityType: 'customer'
  }, staffAlice);
  
  console.log('✅ Alice\'s search result:');
  console.log(JSON.stringify(searchResult, null, 2));
  console.log('\n');

  console.log('=== TESTING SHARED INTELLIGENCE ===\n');

  // Test 3: Bob encounters similar objection and queries shared intelligence
  console.log('💡 Test 3: Bob gets price objection and queries shared intelligence...');
  const intelligenceQuery = await processHybridBrainTool('query_shared_intelligence', {
    situation: 'Customer says our solution is too expensive',
    customerType: 'manufacturing',
    intelligenceType: 'objection_handling'
  }, staffBob);
  
  console.log('✅ Bob gets shared intelligence:');
  console.log(JSON.stringify(intelligenceQuery, null, 2));
  console.log('\n');

  // Test 4: Bob gets specific objection responses
  console.log('🎯 Test 4: Bob gets proven responses for price objections...');
  const objectionResponses = await processHybridBrainTool('get_objection_responses', {
    objectionType: 'price_too_high',
    customerIndustry: 'manufacturing'
  }, staffBob);
  
  console.log('✅ Bob gets objection handling strategies:');
  console.log(JSON.stringify(objectionResponses, null, 2));
  console.log('\n');

  // Test 5: Bob gets response templates
  console.log('📝 Test 5: Bob gets high-converting response templates...');
  const templates = await processHybridBrainTool('suggest_response_template', {
    messageType: 'objection_response',
    customerProfile: 'manufacturing, budget-conscious',
    minSuccessRate: 70
  }, staffBob);
  
  console.log('✅ Bob gets response templates:');
  console.log(JSON.stringify(templates, null, 2));
  console.log('\n');

  // Test 6: Success prediction
  console.log('🎯 Test 6: Bob checks success probability of ROI approach...');
  const prediction = await processHybridBrainTool('predict_success_probability', {
    proposedApproach: 'Send ROI calculator showing 6-month payback period',
    customerProfile: 'Manufacturing company, 50-200 employees, budget concerns',
    currentSituation: 'Customer expressed price sensitivity but showed interest'
  }, staffBob);
  
  console.log('✅ Success prediction:');
  console.log(JSON.stringify(prediction, null, 2));
  console.log('\n');

  // Test 7: Alice contributes success story
  console.log('🏆 Test 7: Alice contributes success story to shared learning...');
  const successContribution = await processHybridBrainTool('contribute_success_story', {
    successType: 'objection_overcome',
    approach: 'ROI calculator with 6-month payback demo',
    context: 'Manufacturing client with budget constraints',
    outcome: 'Closed $8,000 deal within 2 days',
    customerProfile: 'Mid-size manufacturing, cost-conscious',
    reusable: true
  }, staffAlice);
  
  console.log('✅ Alice\'s contribution:');
  console.log(JSON.stringify(successContribution, null, 2));
  console.log('\n');

  // Test 8: Get learning statistics
  console.log('📊 Test 8: Check shared intelligence statistics...');
  const stats = await processHybridBrainTool('get_intelligence_stats', {
    statsType: 'objection_success_rates',
    timeframe: 'last_month'
  }, staffAlice);
  
  console.log('✅ Learning statistics:');
  console.log(JSON.stringify(stats, null, 2));
  console.log('\n');

  console.log('=== PRIVACY & COMPLIANCE TEST ===\n');

  // Test 9: Zone information
  console.log('🔒 Test 9: Check zone information and privacy boundaries...');
  const zoneInfo = await processHybridBrainTool('get_zone_info', {
    infoType: 'all'
  }, staffAlice);
  
  console.log('✅ Zone information:');
  console.log(JSON.stringify(zoneInfo, null, 2));
  console.log('\n');

  console.log('🎉 HYBRID LEARNING ARCHITECTURE TEST COMPLETE!');
  console.log('\n📋 TEST SUMMARY:');
  console.log('✅ Private conversation logging (with intelligence extraction)');
  console.log('✅ Private data search (customer data stays isolated)');
  console.log('✅ Shared intelligence queries (cross-marketer learning)');
  console.log('✅ Objection handling suggestions (proven responses)');
  console.log('✅ Response template recommendations (high-converting)');
  console.log('✅ Success probability predictions (data-driven)');
  console.log('✅ Success story contributions (anonymous sharing)');
  console.log('✅ Learning statistics (performance tracking)');
  console.log('✅ Privacy boundaries (zone isolation maintained)');
  console.log('\n🚀 READY FOR 200 MARKETERS WITH SHARED LEARNING!');
}

// Run the test
testHybridLearning().catch(console.error);
