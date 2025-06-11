import { elasticsearchConfig } from './config.js';

// Brain-specific index configurations
const BRAIN_INDICES = {
  'brain-shared-intelligence': {
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0,
      analysis: {
        analyzer: {
          intelligence_analyzer: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'asciifolding']
          }
        }
      }
    },
    mappings: {
      properties: {
        zone: { type: 'keyword' },
        patternType: { type: 'keyword' },
        extractedPattern: {
          type: 'object',
          properties: {
            objectionType: { type: 'keyword' },
            industry: { type: 'keyword' },
            successRate: { type: 'float' },
            responsePattern: { type: 'text' }
          }
        },
        anonymizedData: {
          type: 'object',
          properties: {
            objection: { type: 'text', analyzer: 'intelligence_analyzer' },
            response: { type: 'text', analyzer: 'intelligence_analyzer' },
            outcome: { type: 'keyword' },
            industry: { type: 'keyword' }
          }
        },
        metadata: {
          type: 'object',
          properties: {
            confidence: { type: 'float' },
            frequency: { type: 'integer' },
            lastUpdated: { type: 'date' }
          }
        },
        timestamp: { type: 'date' },
        staffId: { type: 'keyword' }
      }
    }
  }
};

// Dynamic private zone indices will be created with this template
const PRIVATE_ZONE_TEMPLATE = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    analysis: {
      analyzer: {
        private_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'asciifolding']
        }
      }
    }
  },
  mappings: {
    properties: {
      zone: { type: 'keyword' },
      entityType: { type: 'keyword' },
      data: {
        type: 'object',
        properties: {
          customerId: { type: 'keyword' },
          name: { type: 'text', analyzer: 'private_analyzer' },
          company: { type: 'text', analyzer: 'private_analyzer' },
          industry: { type: 'keyword' },
          email: { type: 'keyword' },
          phone: { type: 'keyword' },
          notes: { type: 'text', analyzer: 'private_analyzer' }
        }
      },
      tags: { type: 'keyword' },
      aiAnalysis: {
        type: 'object',
        properties: {
          profileType: { type: 'keyword' },
          attributes: { type: 'keyword' },
          confidence: { type: 'float' }
        }
      },
      timestamp: { type: 'date' },
      staffId: { type: 'keyword' }
    }
  }
};

// Conversation index template
const CONVERSATION_TEMPLATE = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0
  },
  mappings: {
    properties: {
      conversationId: { type: 'keyword' },
      customerId: { type: 'keyword' },
      messages: {
        type: 'nested',
        properties: {
          messageId: { type: 'keyword' },
          timestamp: { type: 'date' },
          sender: { type: 'keyword' },
          content: { type: 'text' },
          aiAnalysis: {
            type: 'object',
            properties: {
              sentiment: { type: 'keyword' },
              intent: { type: 'keyword' },
              confidence: { type: 'float' }
            }
          }
        }
      },
      outcome: { type: 'keyword' },
      dealSize: { type: 'float' },
      timestamp: { type: 'date' },
      staffId: { type: 'keyword' }
    }
  }
};

export async function initializeBrainIndices() {
  try {
    console.error('🧠 Initializing Brain Elasticsearch Indices...');
    
    const headers = {
      'Authorization': `ApiKey ${elasticsearchConfig.auth.apiKey}`,
      'Content-Type': 'application/json'
    };

    // 1. Create shared intelligence index
    console.error('📊 Creating shared intelligence index...');
    const sharedResponse = await fetch(`${elasticsearchConfig.node}/brain-shared-intelligence`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(BRAIN_INDICES['brain-shared-intelligence'])
    });
    
    if (sharedResponse.ok) {
      console.error('✅ brain-shared-intelligence index created');
    } else {
      const error = await sharedResponse.json();
      if (error.error?.type === 'resource_already_exists_exception') {
        console.error('✅ brain-shared-intelligence index already exists');
      } else {
        console.error('❌ Failed to create shared intelligence index:', error);
      }
    }

    // 2. Create index templates for dynamic private zones
    console.error('📋 Creating private zone index template...');
    const templateResponse = await fetch(`${elasticsearchConfig.node}/_index_template/brain-private-template`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        index_patterns: ['brain-private-*'],
        template: PRIVATE_ZONE_TEMPLATE,
        priority: 100
      })
    });
    
    if (templateResponse.ok) {
      console.error('✅ brain-private-* template created');
    } else {
      const error = await templateResponse.json();
      console.error('❌ Failed to create private template:', error);
    }

    // 3. Create conversation index template
    console.error('💬 Creating conversation index template...');
    const conversationTemplateResponse = await fetch(`${elasticsearchConfig.node}/_index_template/brain-conversations-template`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        index_patterns: ['brain-conversations-*'],
        template: CONVERSATION_TEMPLATE,
        priority: 100
      })
    });
    
    if (conversationTemplateResponse.ok) {
      console.error('✅ brain-conversations-* template created');
    } else {
      const error = await conversationTemplateResponse.json();
      console.error('❌ Failed to create conversation template:', error);
    }

    // 4. Test creating sample indices to verify templates work
    console.error('🧪 Testing index creation with sample data...');
    
    // Create a sample private index
    const samplePrivateResponse = await fetch(`${elasticsearchConfig.node}/brain-private-test-staff/_doc/test`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        zone: 'private',
        entityType: 'customer',
        data: {
          name: 'Test Customer',
          company: 'Test Company'
        },
        staffId: 'test-staff',
        timestamp: new Date().toISOString()
      })
    });

    if (samplePrivateResponse.ok) {
      console.error('✅ Sample private index created successfully');
      
      // Clean up test document
      await fetch(`${elasticsearchConfig.node}/brain-private-test-staff/_doc/test`, {
        method: 'DELETE',
        headers
      });
    }

    console.error('🎉 Brain indices initialization complete!');
    console.error('📋 Available indices:');
    console.error('   • brain-shared-intelligence (shared patterns)');
    console.error('   • brain-private-{staffId} (private customer data)');
    console.error('   • brain-conversations-{staffId} (conversation logs)');

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize brain indices:', error);
    return false;
  }
}

// Auto-initialize if this module is imported
initializeBrainIndices();
