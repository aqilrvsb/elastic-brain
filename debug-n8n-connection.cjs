// Debug script to test n8n MCP Client connection issues
const https = require('https');
const http = require('http');

const BASE_URL = 'elastic-brain-production.up.railway.app';
const STAFF_ID = 'staff-test-123';

console.log('🔍 Debugging n8n MCP Client Connection Issues');
console.log('==============================================');

// Test 1: Check if domain resolves
console.log('\n1. 🌐 Testing Domain Resolution...');
const dns = require('dns');
dns.lookup(BASE_URL, (err, address, family) => {
  if (err) {
    console.log(`❌ DNS Resolution FAILED: ${err.message}`);
  } else {
    console.log(`✅ DNS Resolution SUCCESS: ${BASE_URL} → ${address} (IPv${family})`);
  }
});

// Test 2: Test HTTPS connection directly
console.log('\n2. 🔒 Testing HTTPS Connection...');
const healthOptions = {
  hostname: BASE_URL,
  port: 443,
  path: '/health',
  method: 'GET',
  timeout: 10000
};

const healthReq = https.request(healthOptions, (res) => {
  console.log(`✅ HTTPS Connection SUCCESS: Status ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const health = JSON.parse(data);
      console.log(`   Server Status: ${health.status}`);
      console.log(`   Active Staff: ${health.activeStaff}`);
      console.log(`   Environment: ${health.environment}`);
    } catch (e) {
      console.log(`   Raw Response: ${data}`);
    }
  });
});

healthReq.on('error', (err) => {
  console.log(`❌ HTTPS Connection FAILED: ${err.message}`);
});

healthReq.on('timeout', () => {
  console.log(`❌ HTTPS Connection TIMEOUT`);
  healthReq.destroy();
});

healthReq.end();

// Test 3: Test Stream Endpoint (n8n tries this first)
console.log('\n3. 📡 Testing Stream Endpoint (GET)...');
const streamOptions = {
  hostname: BASE_URL,
  port: 443,
  path: `/stream/${STAFF_ID}`,
  method: 'GET',
  timeout: 5000,
  headers: {
    'User-Agent': 'n8n-debug-test',
    'Accept': 'text/event-stream',
    'Cache-Control': 'no-cache'
  }
};

const streamReq = https.request(streamOptions, (res) => {
  console.log(`✅ Stream GET SUCCESS: Status ${res.statusCode}`);
  console.log(`   Content-Type: ${res.headers['content-type']}`);
  console.log(`   Connection: ${res.headers.connection}`);
  
  // Read first few bytes to see if it's SSE
  let dataReceived = false;
  res.on('data', (chunk) => {
    if (!dataReceived) {
      dataReceived = true;
      const firstData = chunk.toString().substring(0, 200);
      console.log(`   First Data: ${firstData}`);
      res.destroy(); // Close connection after first data
    }
  });
});

streamReq.on('error', (err) => {
  console.log(`❌ Stream GET FAILED: ${err.message}`);
});

streamReq.on('timeout', () => {
  console.log(`⏰ Stream GET TIMEOUT (expected for SSE)`);
  streamReq.destroy();
});

streamReq.end();

// Test 4: Test MCP Protocol (POST to stream)
console.log('\n4. 🔧 Testing MCP Protocol (POST /stream)...');
const mcpData = JSON.stringify({
  jsonrpc: '2.0',
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'debug-test',
      version: '1.0.0'
    }
  },
  id: 1
});

const mcpOptions = {
  hostname: BASE_URL,
  port: 443,
  path: `/stream/${STAFF_ID}`,
  method: 'POST',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(mcpData),
    'User-Agent': 'n8n-debug-test'
  }
};

const mcpReq = https.request(mcpOptions, (res) => {
  console.log(`✅ MCP Protocol SUCCESS: Status ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log(`   MCP Response: ${JSON.stringify(response, null, 2)}`);
    } catch (e) {
      console.log(`   Raw Response: ${data}`);
    }
  });
});

mcpReq.on('error', (err) => {
  console.log(`❌ MCP Protocol FAILED: ${err.message}`);
});

mcpReq.on('timeout', () => {
  console.log(`❌ MCP Protocol TIMEOUT`);
  mcpReq.destroy();
});

mcpReq.write(mcpData);
mcpReq.end();

// Test 5: Test tools/list
setTimeout(() => {
  console.log('\n5. 🛠️ Testing tools/list...');
  const toolsData = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 2
  });

  const toolsOptions = {
    hostname: BASE_URL,
    port: 443,
    path: `/stream/${STAFF_ID}`,
    method: 'POST',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(toolsData)
    }
  };

  const toolsReq = https.request(toolsOptions, (res) => {
    console.log(`✅ Tools List SUCCESS: Status ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`   Total Tools: ${response.result?.totalTools || response.result?.tools?.length}`);
        if (response.result?.tools) {
          console.log(`   Sample Tools: ${response.result.tools.slice(0, 3).map(t => t.name).join(', ')}`);
        }
      } catch (e) {
        console.log(`   Raw Response: ${data.substring(0, 200)}...`);
      }
    });
  });

  toolsReq.on('error', (err) => {
    console.log(`❌ Tools List FAILED: ${err.message}`);
  });

  toolsReq.write(toolsData);
  toolsReq.end();
}, 2000);

// Test 6: Test direct MCP endpoint
setTimeout(() => {
  console.log('\n6. 🎯 Testing Direct MCP Endpoint...');
  const directData = JSON.stringify({
    method: 'get_time_utc',
    params: {}
  });

  const directOptions = {
    hostname: BASE_URL,
    port: 443,
    path: `/mcp/${STAFF_ID}`,
    method: 'POST',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(directData)
    }
  };

  const directReq = https.request(directOptions, (res) => {
    console.log(`✅ Direct MCP SUCCESS: Status ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`   Direct Response: ${JSON.stringify(response, null, 2)}`);
      } catch (e) {
        console.log(`   Raw Response: ${data}`);
      }
    });
  });

  directReq.on('error', (err) => {
    console.log(`❌ Direct MCP FAILED: ${err.message}`);
  });

  directReq.write(directData);
  directReq.end();
}, 4000);

console.log('\n⏳ Running connection tests...');
console.log('This will test exactly what n8n MCP Client tries to do.\n');
