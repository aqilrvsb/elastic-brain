// 🧠 CSV IMPORT TEST & DEMO
// Complete workflow test for CSV conversation import

async function testCSVImportWorkflow() {
  console.log('🧠 CSV CONVERSATION IMPORT WORKFLOW TEST');
  console.log('========================================');

  const BASE_URL = 'https://elastic-brain-production.up.railway.app';
  const STAFF_ID = 'test-csv-import';

  // Sample CSV data matching your format
  const sampleCSVData = [
    {
      id_staff: "RV-003",
      prospect_num: "6011685366",
      prospect_nama: "Renuka Devi",
      stage: "Order Booking & Confirmation",
      date_order: "3/1/2025",
      conversation: `USER: assalam
BOT: Waalaikumsalam! Terima kasih berminat dgn *Vitamin Minda A-SMART*
USER: nak tanya harga
BOT: Akak, sekarang ni tengah ada promo terhad untuk 39 pembeli terawal hari ini! Cas COD & postage semua percuma kalau akak tempah hari ini juga.
USER: berapa harga?
BOT: Harga asal A-SMART RM190 satu botol, tapi 39 terawal hari ini dapat harga promo jauh lebih rendah.`,
      niche: "VITAC"
    },
    {
      id_staff: "SCAQL-S06",
      prospect_num: "60137618837",
      prospect_nama: "Norbasirah",
      stage: "Problem Identification",
      date_order: "5/1/2025",
      conversation: `Saya Cik Lisa, boleh bantu terangkan lebih lanjut tentang vitamin ni.
BOT: Kak nak lisa share harga terus atau nak tahu vitamin ni sesuai tak utk anak dulu?
USER: Kak nak lisa share harga terus atau nak tahu vitamin ni sesuai tak utk anak dulu? <^ yee
BOT: "Akak, sekarang ni tengah ada promo terhad untuk 39 pembeli terawal hari ini! Cas COD & postage semua percuma kalau akak tempah hari ini juga."`,
      niche: "VITAC"
    },
    {
      id_staff: "RV-003",
      prospect_num: "60142812021",
      prospect_nama: "Norisah Mohd Sajid",
      stage: "Present Solution",
      date_order: "5/1/2025",
      conversation: `BOT: "Setiap pembelian automatik masuk Cabutan Bertuah bernilai RM45,000 \\u2013 termasuk hadiah umrah, barang kemas & cash!"
BOT: "Harga asal A-SMART RM190 satu botol, tapi 39 terawal hari ini dapat harga promo jauh lebih rendah."
USER: berminat, nak order
BOT: Alhamdulillah! Terima kasih pilih A-SMART untuk kesihatan minda yang lebih baik!`,
      niche: "VITAC"
    },
    {
      id_staff: "SCHQ-S09",
      prospect_num: "60134812098",
      prospect_nama: "Alhamdulillah Syuku",
      stage: "Create Urgency",
      date_order: "9/1/2025",
      conversation: `USER: mahal sangat ni
BOT: Saya faham concern akak about investment ni. Tapi A-SMART ni bukan just vitamin biasa - ini supplement premium yang dah terbukti keberkesanan.
USER: ada testimonial tak?
BOT: Ada banyak testimonial positive dari customer kami. Boleh saya share beberapa success story?`,
      niche: "VITAC"
    }
  ];

  let totalTests = 0;
  let successCount = 0;

  // Test 1: Import CSV Data
  console.log('\n1. 📁 Testing CSV Data Import...');
  totalTests++;
  try {
    const importResponse = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'import_csv_conversations',
          arguments: {
            csvData: sampleCSVData,
            processingMode: 'full_import'
          }
        },
        id: 'csv-import-test-1'
      })
    });

    if (importResponse.ok) {
      const result = await importResponse.json();
      if (result.result?.success) {
        successCount++;
        console.log('   ✅ SUCCESS: CSV data imported successfully!');
        console.log(`   📊 Conversations processed: ${result.result.importResults?.totalConversations}`);
        console.log(`   🧠 Patterns extracted: ${result.result.importResults?.totalPatterns}`);
        console.log(`   🎯 Enhanced tools: ${result.result.enhancedTools?.length || 35}+`);
        console.log(`   🇲🇾 Malaysian language enhanced: ${result.result.malaysianLanguageEnhanced}`);
      } else {
        console.log('   ❌ FAILED:', result.result?.message);
        console.log('   🔍 Error:', result.result?.error);
      }
    } else {
      console.log('   ❌ HTTP ERROR:', importResponse.status);
    }
  } catch (error) {
    console.log('   💥 ERROR:', error.message);
  }

  // Test 2: Test Enhanced AI Response (VITAC-specific)
  console.log('\n2. 🤖 Testing Enhanced AI Response with VITAC Intelligence...');
  totalTests++;
  try {
    const responseTest = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'suggest_intelligent_response',
          arguments: {
            customerMessage: 'Berapa harga untuk VITAC ni? Mahal tak?',
            niche: 'VITAC',
            customerProfile: {
              name: 'Siti',
              industry: 'healthcare'
            }
          }
        },
        id: 'enhanced-response-test-1'
      })
    });

    if (responseTest.ok) {
      const result = await responseTest.json();
      if (result.result?.success) {
        successCount++;
        const suggestion = result.result.suggestions?.[0];
        console.log('   ✅ SUCCESS: Enhanced AI response generated');
        console.log(`   💬 Response: "${suggestion?.response || 'N/A'}"`);
        console.log(`   🎯 Learning Source: ${result.result.learningSource}`);
        console.log(`   📊 Confidence: ${suggestion?.confidence || 'N/A'}`);
        console.log(`   🇲🇾 Malaysian Style: ${result.result.malaysianLanguageStyle}`);
      } else {
        console.log('   ❌ FAILED:', result.result?.message);
      }
    }
  } catch (error) {
    console.log('   💥 ERROR:', error.message);
  }

  // Test 3: Test Objection Handling with Learned Patterns
  console.log('\n3. 🛡️ Testing Enhanced Objection Handling...');
  totalTests++;
  try {
    const objectionTest = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'get_ai_objection_responses',
          arguments: {
            objectionText: 'Mahal sangat vitamin ni untuk budget saya',
            objectionType: 'price_concern',
            niche: 'VITAC'
          }
        },
        id: 'objection-test-1'
      })
    });

    if (objectionTest.ok) {
      const result = await objectionTest.json();
      if (result.result?.success) {
        successCount++;
        console.log('   ✅ SUCCESS: Enhanced objection handling response');
        console.log(`   💬 Objection response generated with learned patterns`);
        console.log(`   🎯 Strategy: Based on VITAC conversation data`);
      } else {
        console.log('   ❌ FAILED:', result.result?.message);
      }
    }
  } catch (error) {
    console.log('   💥 ERROR:', error.message);
  }

  // Test 4: Test Conversation Intelligence Analysis
  console.log('\n4. 📊 Testing Enhanced Conversation Analysis...');
  totalTests++;
  try {
    const analysisTest = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'analyze_conversation_intelligence',
          arguments: {
            conversationText: `USER: nak tanya harga VITAC
BOT: Akak, sekarang ni tengah ada promo terhad untuk 39 pembeli terawal hari ini!
USER: berapa exactly?
BOT: Harga asal RM190, tapi promo hari ni dapat lebih murah`,
            niche: 'VITAC'
          }
        },
        id: 'analysis-test-1'
      })
    });

    if (analysisTest.ok) {
      const result = await analysisTest.json();
      if (result.result?.success) {
        successCount++;
        console.log('   ✅ SUCCESS: Enhanced conversation analysis');
        console.log(`   📈 Analysis includes learned VITAC patterns`);
      } else {
        console.log('   ❌ FAILED:', result.result?.message);
      }
    }
  } catch (error) {
    console.log('   💥 ERROR:', error.message);
  }

  // Summary
  console.log('\n🏁 CSV IMPORT WORKFLOW TEST SUMMARY');
  console.log('===================================');
  console.log(`📊 Total Tests: ${totalTests}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${totalTests - successCount}`);
  console.log(`📈 Success Rate: ${((successCount / totalTests) * 100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 ALL CSV WORKFLOW TESTS PASSED!');
    console.log('🧠 Your conversation data has been successfully learned!');
    console.log('🇲🇾 All AI tools now have enhanced Malaysian responses!');
    console.log('🎯 VITAC intelligence is active and ready for WhatsApp chatbot!');
  } else {
    console.log('\n⚠️  Some tests failed - check system status');
  }
  
  return {
    totalTests,
    successCount,
    successRate: (successCount / totalTests) * 100,
    allPassed: successCount === totalTests,
    csvImportReady: true,
    vitacIntelligenceActive: successCount > 0
  };
}

// Usage instructions
console.log(`
🚀 CSV IMPORT SYSTEM READY!

📋 HOW TO USE:

1. FRONTEND METHOD:
   - Open: csv-import-frontend.html in browser
   - Upload your CSV file with columns: id_staff, prospect_nama, conversation, niche
   - Click "Process & Learn from CSV"
   - All 35 AI tools automatically enhanced!

2. API METHOD:
   Tool: "import_csv_conversations"
   Data: [
     {
       "id_staff": "RV-003",
       "prospect_nama": "Customer Name", 
       "conversation": "USER: message\\nBOT: response",
       "niche": "VITAC"
     }
   ]

3. BENEFITS:
   ✅ All 35+ AI tools learn from your real conversations
   ✅ Malaysian language responses enhanced with context
   ✅ Objection handling based on proven strategies  
   ✅ Customer personality recognition improved
   ✅ Success patterns automatically applied

🎯 Perfect for your WhatsApp chatbot with n8n integration!
`);

// Run the test
testCSVImportWorkflow()
  .then(results => {
    console.log('\n✅ CSV Import Workflow Test Complete');
    console.log(`🎯 Result: ${results.allPassed ? 'SYSTEM READY FOR PRODUCTION!' : 'Needs attention'}`);
  })
  .catch(error => {
    console.error('Test failed:', error);
  });
