#!/usr/bin/env node

// Standalone script to initialize Brain Elasticsearch indices
import { initializeBrainIndices } from './src/brain-indices-init.js';

console.log('🧠 Brain Elasticsearch Indices Initialization');
console.log('============================================');

try {
  const success = await initializeBrainIndices();
  if (success) {
    console.log('\n✅ SUCCESS: All Brain indices initialized!');
    console.log('\n📋 Created indices:');
    console.log('   • brain-shared-intelligence');
    console.log('   • brain-private-* (template)');
    console.log('   • brain-conversations-* (template)');
    console.log('\n🚀 Your Brain MCP Server is ready for 32 tools!');
  } else {
    console.log('\n❌ FAILED: Some indices could not be initialized');
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ ERROR:', error);
  process.exit(1);
}
