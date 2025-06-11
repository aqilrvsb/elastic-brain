// HTTP Testing Script for Brain MCP Server
const https = require('https');

const BASE_URL = 'elastic-brain-production.up.railway.app';
const STAFF_ID = 'staff-alice-123';

console.log('🧪 Testing Brain MCP Server HTTP Endpoints');
console.log('==========================================');

// Test 1: GET /stream (should work for n8n connection)
console.log('\n1. 🔗 Testing GET /stream (n8n connection endpoint)');
const streamOptions = {
  hostname: BASE_URL,
  port: 443,
  path: '/stream',
  method: 'GET',
  timeout: 5000,
  headers: {
    'Accept': 'text/event-stream',
    'Cache-Control': 'no-cache'
  }
};

const streamReq = https.request(streamOptions, (res) => {
  console.log(`✅ GET /stream: Status ${res.statusCode}`);
  console.log(`   Content-Type: ${res.headers['content-type']}`);
  
  res.on('data', (chunk) => {
    const data = chunk.toString();
    console.log(`   Stream Data: ${data.substring(0, 100)}...`);
    res.destroy(); // Close after first data
  });
});

streamReq.on('error', (err) => {
  console.log(`❌ GET /stream FAILED: ${err.message}`);
});

streamReq.on('timeout', () => {
  console.log(`⏰ GET /stream TIMEOUT (expected for SSE)`);
  streamReq.destroy();
});

streamReq.end();

// Test 2: POST /mcp/staffId with MCP initialize
setTimeout(() => {
  console.log('\n2. 🤝 Testing POST /mcp/staffId - MCP Initialize');
  
  const initData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    },
    id: 1
  });

  const initOptions = {
    hostname: BASE_URL,
    port: 443,
    path: `/mcp/${STAFF_ID}`,
    method: 'POST',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(initData)
    }
  };

  const initReq = https.request(initOptions, (res) => {
    console.log(`✅ POST /mcp/${STAFF_ID} Initialize: Status ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`   Response: ${JSON.stringify(response, null, 2)}`);
      } catch (e) {
        console.log(`   Raw Response: ${data}`);
      }
    });
  });

  initReq.on('error', (err) => {
    console.log(`❌ POST /mcp/${STAFF_ID} Initialize FAILED: ${err.message}`);
  });

  initReq.write(initData);
  initReq.end();
}, 2000);

// Test 3: POST /mcp/staffId with MCP tools/list
setTimeout(() => {
  console.log('\n3. 🛠️ Testing POST /mcp/staffId - MCP tools/list');
  
  const toolsData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 2
  });

  const toolsOptions = {
    hostname: BASE_URL,
    port: 443,
    path: `/mcp/${STAFF_ID}`,
    method: 'POST',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(toolsData)
    }
  };

  const toolsReq = https.request(toolsOptions, (res) => {
    console.log(`✅ POST /mcp/${STAFF_ID} tools/list: Status ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`   Total Tools: ${response.result?.tools?.length || 'Unknown'}`);
        if (response.result?.tools) {
          console.log(`   Sample Tools: ${response.result.tools.slice(0, 3).map(t => t.name).join(', ')}`);
        }
      } catch (e) {
        console.log(`   Raw Response: ${data.substring(0, 200)}...`);
      }
    });
  });

  toolsReq.on('error', (err) => {
    console.log(`❌ POST /mcp/${STAFF_ID} tools/list FAILED: ${err.message}`);
  });

  toolsReq.write(toolsData);
  toolsReq.end();
}, 4000);

// Test 4: POST /mcp/staffId with MCP tools/call
setTimeout(() => {
  console.log('\n4. ⚡ Testing POST /mcp/staffId - MCP tools/call (get_time_utc)');
  
  const callData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'get_time_utc',
      arguments: {}
    },
    id: 3
  });

  const callOptions = {
    hostname: BASE_URL,
    port: 443,
    path: `/mcp/${STAFF_ID}`,
    method: 'POST',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(callData)
    }
  };

  const callReq = https.request(callOptions, (res) => {
    console.log(`✅ POST /mcp/${STAFF_ID} tools/call: Status ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`   Tool Call Response:`);
        console.log(JSON.stringify(response, null, 2));
      } catch (e) {
        console.log(`   Raw Response: ${data}`);
      }
    });
  });

  callReq.on('error', (err) => {
    console.log(`❌ POST /mcp/${STAFF_ID} tools/call FAILED: ${err.message}`);
  });

  callReq.write(callData);
  callReq.end();
}, 6000);

console.log('\n⏳ Running all HTTP tests...\n');
