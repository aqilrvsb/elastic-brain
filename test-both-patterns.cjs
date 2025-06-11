// Test both URL patterns for n8n MCP Client
const https = require('https');

const BASE_URL = 'elastic-brain-production.up.railway.app';
const STAFF_ID = 'staff-alice-123';

console.log('🧪 Testing Both URL Patterns for n8n MCP Client');
console.log('===============================================');

// Test Pattern 1: Both URLs have STAFF_ID
console.log('\n📋 PATTERN 1: Both URLs with STAFF_ID');
console.log('Stream URL: /stream/staff-alice-123');
console.log('Post URL: /stream/staff-alice-123');

setTimeout(() => {
  // Test GET /stream/staff-alice-123 (SSE connection)
  console.log('\n1️⃣ Testing GET /stream/staff-alice-123 (SSE)');
  const streamReq = https.request({
    hostname: BASE_URL,
    port: 443,
    path: `/stream/${STAFF_ID}`,
    method: 'GET',
    timeout: 3000,
    headers: { 'Accept': 'text/event-stream' }
  }, (res) => {
    console.log(`✅ GET /stream/${STAFF_ID}: Status ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log(`   Data: ${chunk.toString().substring(0, 100)}...`);
      res.destroy();
    });
  });

  streamReq.on('error', (err) => {
    console.log(`❌ GET /stream/${STAFF_ID} FAILED: ${err.message}`);
  });

  streamReq.on('timeout', () => {
    console.log(`⏰ GET /stream/${STAFF_ID} TIMEOUT (might be normal for SSE)`);
    streamReq.destroy();
  });

  streamReq.end();
}, 1000);

setTimeout(() => {
  // Test POST /stream/staff-alice-123 (tool call)
  console.log('\n2️⃣ Testing POST /stream/staff-alice-123 (tool call)');
  const toolData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: { name: 'get_time_utc', arguments: {} },
    id: 1
  });

  const toolReq = https.request({
    hostname: BASE_URL,
    port: 443,
    path: `/stream/${STAFF_ID}`,
    method: 'POST',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(toolData)
    }
  }, (res) => {
    console.log(`✅ POST /stream/${STAFF_ID}: Status ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.result && response.result.content) {
          const result = JSON.parse(response.result.content[0].text);
          console.log(`   Success: ${result.success}`);
          console.log(`   Message: ${result.message}`);
        } else if (response.error) {
          console.log(`   Error: ${response.error.message}`);
        }
      } catch (e) {
        console.log(`   Raw: ${data.substring(0, 100)}...`);
      }
    });
  });

  toolReq.on('error', (err) => {
    console.log(`❌ POST /stream/${STAFF_ID} FAILED: ${err.message}`);
  });

  toolReq.write(toolData);
  toolReq.end();
}, 3000);

// Test Pattern 2: Different URLs
console.log('\n📋 PATTERN 2: Different URLs (like Facebook)');
console.log('Stream URL: /stream');
console.log('Post URL: /mcp/staff-alice-123');

setTimeout(() => {
  // Test GET /stream (no ID)
  console.log('\n3️⃣ Testing GET /stream (no ID)');
  const streamReq2 = https.request({
    hostname: BASE_URL,
    port: 443,
    path: '/stream',
    method: 'GET',
    timeout: 3000,
    headers: { 'Accept': 'text/event-stream' }
  }, (res) => {
    console.log(`✅ GET /stream: Status ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log(`   Data: ${chunk.toString().substring(0, 100)}...`);
      res.destroy();
    });
  });

  streamReq2.on('error', (err) => {
    console.log(`❌ GET /stream FAILED: ${err.message}`);
  });

  streamReq2.on('timeout', () => {
    console.log(`⏰ GET /stream TIMEOUT (normal for SSE)`);
    streamReq2.destroy();
  });

  streamReq2.end();
}, 5000);

setTimeout(() => {
  // Test POST /mcp/staff-alice-123
  console.log('\n4️⃣ Testing POST /mcp/staff-alice-123');
  const mcpData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: { name: 'get_time_utc', arguments: {} },
    id: 2
  });

  const mcpReq = https.request({
    hostname: BASE_URL,
    port: 443,
    path: `/mcp/${STAFF_ID}`,
    method: 'POST',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(mcpData)
    }
  }, (res) => {
    console.log(`✅ POST /mcp/${STAFF_ID}: Status ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log(`   Success: ${response.success}`);
          console.log(`   Message: ${response.message}`);
        } else if (response.error) {
          console.log(`   Error: ${response.error}`);
        }
      } catch (e) {
        console.log(`   Raw: ${data.substring(0, 100)}...`);
      }
    });
  });

  mcpReq.on('error', (err) => {
    console.log(`❌ POST /mcp/${STAFF_ID} FAILED: ${err.message}`);
  });

  mcpReq.write(mcpData);
  mcpReq.end();
}, 7000);

setTimeout(() => {
  console.log('\n🎯 CONCLUSION:');
  console.log('Both patterns should work. Choose based on n8n behavior:');
  console.log('- If n8n sends tool calls to Stream URL → Use Pattern 1 (both same)');
  console.log('- If n8n sends tool calls to Messages Post → Use Pattern 2 (different)');
}, 10000);
