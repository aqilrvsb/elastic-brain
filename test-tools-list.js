// Simple test for MCP tools/list endpoint
const fetch = require('node-fetch');

const BASE_URL = 'https://elastic-brain-production.up.railway.app';
const STAFF_ID = 'test-staff-123';

async function testToolsList() {
  try {
    console.log('Testing MCP tools/list via POST /stream...');
    
    const response = await fetch(`${BASE_URL}/stream/${STAFF_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        params: {},
        id: 1
      })
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Total tools:', result.result?.totalTools || result.result?.tools?.length);
    
    if (result.result?.tools) {
      console.log('\nAll available tools:');
      result.result.tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} - ${tool.description}`);
      });
    } else {
      console.log('Full response:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testToolsList();
