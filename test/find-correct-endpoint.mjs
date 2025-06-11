// Test different URL formats for the new deployment
const apiKey = 'SWZJZlc1Y0JrNlo1blhWeFd4bzM6Nnlfd2pxVlc4b09YOV80QXoxOWVOQQ==';

console.log('🔧 Finding correct Elasticsearch endpoint...\n');

// From your Kibana URL: brain-mcp-elasticsearch.kb.ap-southeast-1.aws.found.io
// The Elasticsearch endpoint is typically different

const possibleUrls = [
  'https://brain-mcp-elasticsearch.es.ap-southeast-1.aws.found.io:9243',
  'https://brain-mcp-elasticsearch.es.ap-southeast-1.aws.found.io',
  'https://brain-mcp-elasticsearch.kb.ap-southeast-1.aws.found.io:9200',
  'https://brain-mcp-elasticsearch.kb.ap-southeast-1.aws.found.io',
  'https://brain-mcp-elasticsearch.ap-southeast-1.aws.found.io:9243',
  'https://brain-mcp-elasticsearch.ap-southeast-1.aws.found.io',
  'https://brain-mcp-elasticsearch.ap-southeast-1.aws.elastic.cloud:9243',
  'https://brain-mcp-elasticsearch.ap-southeast-1.aws.elastic.cloud'
];

async function testUrl(url) {
  try {
    console.log(`🔍 Testing: ${url}`);
    
    const response = await fetch(url + '/_cluster/health', {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ SUCCESS! This URL works!');
      console.log('   Cluster:', data.cluster_name);
      console.log('   Status:', data.status);
      return url;
    } else if (response.status === 401) {
      console.log('   🔑 URL responds but auth issue (this means URL format is correct!)');
      return url; // URL format is correct even if auth fails
    } else {
      console.log('   ❌ Failed');
    }
  } catch (error) {
    console.log(`   ❌ Network error: ${error.message}`);
  }
  console.log('');
  return null;
}

async function findCorrectUrl() {
  console.log('Testing possible Elasticsearch endpoint URLs...\n');
  
  for (const url of possibleUrls) {
    const result = await testUrl(url);
    if (result) {
      console.log(`🎉 FOUND WORKING ENDPOINT: ${result}`);
      return result;
    }
  }
  
  console.log('💥 Could not find working endpoint. The deployment might still be starting up.');
  console.log('💡 Try checking the deployment status in your Elasticsearch Cloud dashboard.');
  return null;
}

findCorrectUrl();
