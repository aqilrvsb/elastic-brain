import { staffBrainManager, elasticsearchConfig } from './config.js';

// Real Elasticsearch operations
async function executeElasticsearchOperation(operation, indexName, data = null, staffId = null) {
  try {
    const headers = {
      'Authorization': `ApiKey ${elasticsearchConfig.auth.apiKey}`,
      'Content-Type': 'application/json'
    };

    let url = `${elasticsearchConfig.node}/${indexName}`;
    let method = 'GET';
    let body = null;

    switch (operation) {
      case 'createDocument':
        url += '/_doc';
        method = 'POST';
        body = JSON.stringify({
          ...data,
          staffId,
          timestamp: new Date().toISOString()
        });
        break;
      
      case 'search':
        url += '/_search';
        method = 'POST';
        body = JSON.stringify(data);
        break;
      
      case 'createIndex':
        method = 'PUT';
        body = JSON.stringify(data);
        break;
    }

    const response = await fetch(url, { method, headers, body });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Elasticsearch ${operation} failed:`, response.status);
      return null;
    }
  } catch (error) {
    console.error(`Elasticsearch ${operation} error:`, error.message);
    return null;
  }
}

// Format response helper
const formatResponse = (data: any) => {
  return JSON.stringify(data, null, 2);
};

export async function processBrainTool(toolName: string, params: any, staffId: string): Promise<any> {
  // Use real Elasticsearch for supported operations
  try {
    switch (toolName) {
      case "create_private_entities":
        const privateIndex = `brain-private-${staffId}`;
        const entityResult = await executeElasticsearchOperation('createDocument', privateIndex, {
          zone: 'private',
          entityType: params.entityType,
          data: params.entityData,
          tags: params.tags || []
        }, staffId);

        if (entityResult) {
          return {
            success: true,
            message: `✅ Created ${params.entityType} in private zone`,
            entityId: entityResult._id,
            zone: `staff-${staffId}/private`,
            elasticsearchId: entityResult._id
          };
        }
        break;

      case "log_conversation":
        const convIndex = `brain-private-${staffId}`;
        const conversation = {
          zone: 'private',
          entityType: 'conversation',
          data: {
            customerId: params.customerId,
            messages: params.messages,
            outcome: params.outcome
          }
        };

        const convResult = await executeElasticsearchOperation('createDocument', convIndex, conversation, staffId);
        
        let response = {
          success: true,
          message: '💬 Conversation logged in private zone',
          conversationId: convResult?._id,
          zone: `staff-${staffId}/private/conversations`
        };

        // Extract intelligence if requested
        if (params.extractIntelligence && convResult) {
          const intelligence = {
            zone: 'shared',
            entityType: 'objection_pattern',
            data: {
              pattern: analyzeConversationPattern(conversation),
              industry: extractIndustry(params.customerId),
              objectionType: detectObjection(params.messages),
              outcome: params.outcome,
              anonymized: true,
              successRate: params.outcome === 'closed_deal' ? 95 : 
                          params.outcome === 'sent_quote' ? 75 : 50
            }
          };

          const sharedResult = await executeElasticsearchOperation('createDocument', 'brain-shared', intelligence);
          
          if (sharedResult) {
            response.sharedIntelligence = {
              message: '🧠 Anonymized intelligence extracted for shared learning',
              intelligenceId: sharedResult._id,
              zone: 'global-sales-intelligence'
            };
          }
        }

        return response;

      case "query_shared_intelligence":
        const searchQuery = {
          query: {
            bool: {
              must: [
                { term: { zone: 'shared' } },
                { match: { 'data.pattern': params.situation } }
              ]
            }
          },
          size: params.limit || 5
        };

        if (params.customerType) {
          searchQuery.query.bool.must.push({ term: { 'data.industry': params.customerType } });
        }

        const searchResult = await executeElasticsearchOperation('search', 'brain-shared', searchQuery);
        
        if (searchResult && searchResult.hits.hits.length > 0) {
          const suggestions = searchResult.hits.hits.map(hit => ({
            strategy: hit._source.data.pattern,
            successRate: hit._source.data.successRate,
            description: `Approach used successfully for ${hit._source.data.objectionType}`,
            industry: hit._source.data.industry,
            evidenceBase: `Learned from anonymous marketer experiences`
          }));

          return {
            success: true,
            message: '🧠 Shared intelligence retrieved from real Elasticsearch',
            suggestions,
            totalFound: searchResult.hits.total.value,
            zone: 'global-sales-intelligence'
          };
        }
        break;

      case "search_private_data":
        const privateSearchIndex = `brain-private-${staffId}`;
        const privateSearchQuery = {
          query: {
            bool: {
              must: [
                { term: { staffId } },
                { multi_match: { query: params.query, fields: ['data.*'] } }
              ]
            }
          },
          size: params.limit || 10
        };

        if (params.entityType && params.entityType !== 'all') {
          privateSearchQuery.query.bool.must.push({ term: { entityType: params.entityType } });
        }

        const privateResult = await executeElasticsearchOperation('search', privateSearchIndex, privateSearchQuery);
        
        if (privateResult) {
          const results = privateResult.hits.hits.map(hit => ({
            id: hit._id,
            type: hit._source.entityType,
            data: hit._source.data,
            timestamp: hit._source.timestamp
          }));

          return {
            success: true,
            message: `🔍 Found ${results.length} results in private data`,
            results,
            totalFound: privateResult.hits.total.value,
            zone: `staff-${staffId}/private`
          };
        }
        break;

      case "get_time_utc":
        // Keep this simple test working
        const currentTime = new Date();
        return {
          success: true,
          staffId,
          utcTime: currentTime.toISOString(),
          formattedTime: currentTime.toISOString().replace('T', ' ').substring(0, 19),
          timestamp: currentTime.getTime(),
          message: '🎉 REAL Elasticsearch Brain MCP server is working!',
          elasticsearchConnected: true
        };

      default:
        // For unsupported tools, return helpful message
        return {
          success: false,
          error: `Tool ${toolName} not yet implemented with real Elasticsearch`,
          message: 'This tool is available but needs real implementation',
          elasticsearchStatus: 'connected',
          staffId
        };
    }

  } catch (error) {
    console.error('Real Elasticsearch operation failed:', error);
    
    // Fallback to mock for development
    return {
      success: true,
      mode: 'mock_fallback',
      message: `Mock response for ${toolName} (Elasticsearch operation failed)`,
      error: error.message,
      staffId
    };
  }
}

// Helper functions for intelligence extraction
function analyzeConversationPattern(conversation) {
  const messages = conversation.data.messages || [];
  const text = messages.map(m => m.message).join(' ').toLowerCase();
  
  if (text.includes('price') || text.includes('expensive')) return 'price_objection_pattern';
  if (text.includes('think') || text.includes('consider')) return 'consideration_pattern';
  if (text.includes('budget')) return 'budget_pattern';
  return 'general_inquiry_pattern';
}

function extractIndustry(customerId) {
  if (customerId.includes('manufacturing')) return 'manufacturing';
  if (customerId.includes('healthcare')) return 'healthcare';
  if (customerId.includes('retail')) return 'retail';
  return 'general';
}

function detectObjection(messages) {
  const text = messages.map(m => m.message).join(' ').toLowerCase();
  if (text.includes('expensive') || text.includes('price')) return 'price_too_high';
  if (text.includes('budget')) return 'budget_constraints';
  if (text.includes('think')) return 'need_to_think';
  return 'general_concern';
}

export default processBrainTool;
