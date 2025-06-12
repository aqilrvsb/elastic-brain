// DYNAMIC NICHE-BASED BRAIN ARCHITECTURE
// Brain intelligence separated by product/niche dynamically

import { elasticsearchConfig } from './config.js';

export interface DynamicNicheConfig {
  nicheId: string;
  productName: string;
  productCategory: string;
  targetMarket: string;
  activeMarketers: string[];
  sharedIntelligence: {
    successPatterns: any[];
    objectionHandling: any[];
    closingStrategies: any[];
    customerProfiles: any[];
  };
}

// AI Processing Functions (Mock implementations)
function mockAIAnalysis(type: string, data: any) {
  const timestamp = new Date().toISOString();
  
  switch (type) {
    case 'niche_entity_profile':
      return { 
        nicheSpecific: true,
        entityProfile: data,
        nicheId: data.nicheId,
        profileType: 'niche_customer', 
        attributes: ['niche_specific', 'data_driven'], 
        confidence: 0.89,
        timestamp 
      };
    default:
      return { type, data, timestamp };
  }
}

// Elasticsearch operations for niche brain
async function executeElasticsearchOperation(operation: string, indexName: string, data: any = null, staffId: string = null) {
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
    }

    console.log(`🔗 Elasticsearch ${operation} to ${url}`);
    console.log(`📊 Request body:`, body ? JSON.parse(body) : 'N/A');

    const response = await fetch(url, { method, headers, body });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Elasticsearch ${operation} success:`, result);
      return result;
    } else {
      const errorText = await response.text();
      console.error(`❌ Elasticsearch ${operation} failed: ${response.status} - ${errorText}`);
      return null;
    }
  } catch (error) {
    console.error(`💥 Elasticsearch ${operation} error:`, error.message);
    return null;
  }
}

// Dynamic niche brain processor that separates learning by product
export async function processNicheBrainTool(toolName: string, params: any, staffId: string, nicheId: string): Promise<any> {
  try {
    // Create niche-specific indices for shared intelligence (LOWERCASE REQUIRED)
    const nicheSharedIndex = `brain-shared-intelligence-${nicheId.toLowerCase()}`;
    const nichePrivateIndex = `brain-private-${staffId.toLowerCase()}-${nicheId.toLowerCase()}`;
    const nicheConversationIndex = `brain-conversations-${staffId.toLowerCase()}-${nicheId.toLowerCase()}`;

    switch (toolName) {
      
      // ==========================================
      // NICHE-SPECIFIC ENHANCED TOOLS
      // ==========================================
      
      case "detect_buying_signals":
        // Get niche-specific buying signals from shared intelligence
        const nicheSignalsQuery = {
          query: {
            bool: {
              must: [
                { term: { nicheId: nicheId }},
                { term: { 'extractedPattern.patternType': 'buying_signals' }}
              ]
            }
          },
          size: 10
        };
        
        const nicheSignalPatterns = await executeElasticsearchOperation('search', nicheSharedIndex, nicheSignalsQuery);
        
        // Enhanced signal detection specific to this niche
        const messageText = (params.customerMessage || params.conversationText || '').toLowerCase();
        const detectedSignals = [];
        let closeReadinessScore = 0;
        
        // Use niche-specific learned signals
        const learnedSignals = nicheSignalPatterns?.hits?.hits?.map(hit => hit._source.extractedPattern.signal) || [];
        
        // Default signals + learned niche signals
        const allSignals = [
          ...learnedSignals,
          'what\'s the next step',
          'how do we get started',
          'send me information',
          'i\'m interested',
          'what\'s the price'
        ];
        
        allSignals.forEach(signal => {
          if (messageText.includes(signal.toLowerCase())) {
            detectedSignals.push({
              signal: signal,
              strength: 'high',
              nicheSpecific: learnedSignals.includes(signal)
            });
            closeReadinessScore += 0.2;
          }
        });

        return {
          success: true,
          message: `🎯 Niche-specific buying signals for ${nicheId}`,
          nicheId: nicheId,
          detectedSignals: detectedSignals,
          closeReadinessScore: Math.min(closeReadinessScore, 1.0),
          nicheSpecificLearning: learnedSignals.length,
          recommendedAction: closeReadinessScore >= 0.6 ? 'proceed_to_close' : 'continue_nurturing'
        };

      case "get_ai_objection_responses":
        // Get niche-specific objection responses
        const nicheObjectionQuery = {
          query: {
            bool: {
              must: [
                { term: { nicheId: nicheId }},
                { match: { 'extractedPattern.objectionType': params.objectionType }},
                { match: { 'anonymizedData.objection': params.objectionText }}
              ]
            }
          },
          size: 5
        };
        
        const nicheObjectionPatterns = await executeElasticsearchOperation('search', nicheSharedIndex, nicheObjectionQuery);
        
        // Generate niche-specific response
        let nicheResponse = {
          response: `Based on experience with ${nicheId}, here's how to handle this objection...`,
          approach: 'niche_specific',
          successRate: 0.75
        };
        
        // Use learned responses if available
        if (nicheObjectionPatterns?.hits?.hits?.length > 0) {
          const bestPattern = nicheObjectionPatterns.hits.hits[0]._source;
          nicheResponse = {
            response: bestPattern.extractedPattern.response || nicheResponse.response,
            approach: bestPattern.extractedPattern.approach || 'learned_from_niche',
            successRate: bestPattern.metadata?.successRate || 0.85
          };
        }

        return {
          success: true,
          message: `🎯 Niche-specific objection response for ${nicheId}`,
          nicheId: nicheId,
          objectionType: params.objectionType,
          responses: [nicheResponse],
          nichePatterns: nicheObjectionPatterns?.hits?.hits?.length || 0,
          sharedLearning: true
        };

      case "extract_sales_intelligence":
        // Extract and store niche-specific intelligence
        const nicheIntelligenceDoc = {
          nicheId: nicheId,
          zone: 'shared_niche',
          patternType: params.extractionType || 'general',
          extractedPattern: {
            nicheId: nicheId,
            pattern: params.conversationData?.text || 'intelligence_pattern',
            patternType: params.extractionType,
            confidence: 0.85
          },
          anonymizedData: {
            niche: nicheId,
            pattern: params.conversationData?.text || 'pattern',
            outcome: 'positive'
          },
          metadata: {
            contributingStaff: staffId,
            confidence: 0.85,
            nicheSpecific: true,
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        };

        const nicheIntelligenceResult = await executeElasticsearchOperation('createDocument', nicheSharedIndex, nicheIntelligenceDoc, staffId);

        return {
          success: true,
          message: `🧠 Niche intelligence extracted for ${nicheId}`,
          nicheId: nicheId,
          patternId: nicheIntelligenceResult?._id,
          extractionType: params.extractionType,
          sharedWithNiche: true,
          contributingToNiche: nicheId
        };

      case "query_shared_intelligence":
        // Query niche-specific shared intelligence
        const nicheIntelligenceQuery = {
          query: {
            bool: {
              must: [
                { term: { nicheId: nicheId }},
                { match: { 'extractedPattern.patternType': params.queryType }}
              ]
            }
          },
          size: params.limit || 10,
          sort: [{ 'metadata.confidence': { order: 'desc' }}]
        };

        const nicheIntelligenceResults = await executeElasticsearchOperation('search', nicheSharedIndex, nicheIntelligenceQuery);

        return {
          success: true,
          message: `🔍 Niche intelligence query for ${nicheId}`,
          nicheId: nicheId,
          queryType: params.queryType,
          results: nicheIntelligenceResults?.hits?.hits || [],
          totalNicheIntelligence: nicheIntelligenceResults?.hits?.total?.value || 0,
          nicheSpecificLearning: true
        };

      case "create_private_entities":
        // Create private entities with niche association - FIXED VERSION
        console.log(`🔧 Creating entity for niche ${nicheId}, staff ${staffId}`);
        console.log(`📊 Full params received:`, JSON.stringify(params, null, 2));
        console.log(`📊 Entity data:`, params.entityData);
        console.log(`📊 Entity type:`, params.entityType);
        
        // CRITICAL FIX: Ensure we have valid entityData - provide fallback if missing
        const validEntityData = params.entityData || {
          name: `${params.entityType || 'entity'}_${Date.now()}`,
          createdFor: nicheId,
          generatedAt: new Date().toISOString(),
          fallbackUsed: true
        };
        
        console.log(`📊 Using entity data:`, validEntityData);
        
        const nicheEntityData = {
          nicheId: nicheId,
          zone: 'private',
          entityType: params.entityType || 'customer',
          data: {
            ...validEntityData,
            associatedNiche: nicheId,
            nicheSpecific: true
          },
          tags: [...(params.tags || []), `niche:${nicheId}`],
          aiAnalysis: (params.aiAnalysis !== false) ? mockAIAnalysis('niche_entity_profile', { ...validEntityData, nicheId }) : null,
          staffId,
          timestamp: new Date().toISOString()
        };

        console.log(`🔗 Final entity data to store:`, JSON.stringify(nicheEntityData, null, 2));
        console.log(`🔗 Attempting to create document in index: ${nichePrivateIndex}`);
        
        const nicheEntityResult = await executeElasticsearchOperation('createDocument', nichePrivateIndex, nicheEntityData, staffId);
        
        console.log(`📊 Elasticsearch result:`, nicheEntityResult);
        
        if (nicheEntityResult && nicheEntityResult._id) {
          console.log(`✅ Successfully created entity with ID: ${nicheEntityResult._id}`);
          return {
            success: true,
            message: `✅ Created ${params.entityType || 'entity'} for niche ${nicheId}`,
            nicheId: nicheId,
            entityId: nicheEntityResult._id,
            zone: `staff-${staffId}/niche-${nicheId}`,
            nicheSpecific: true,
            elasticsearchResult: nicheEntityResult,
            indexUsed: nichePrivateIndex,
            entityData: validEntityData
          };
        } else {
          console.log(`❌ Failed to create entity - Elasticsearch returned null or no ID`);
          return {
            success: false,
            message: `❌ Failed to create ${params.entityType || 'entity'} for niche ${nicheId}`,
            nicheId: nicheId,
            zone: `staff-${staffId}/niche-${nicheId}`,
            nicheSpecific: true,
            error: 'Elasticsearch operation failed',
            elasticsearchResult: nicheEntityResult,
            indexUsed: nichePrivateIndex,
            entityData: validEntityData
          };
        }

      case "log_conversation":
        // Log conversation with niche context
        const nicheConversationData = {
          nicheId: nicheId,
          customerId: params.customerId,
          messages: params.messages?.map(msg => ({
            ...msg,
            nicheContext: nicheId,
            aiAnalysis: mockAIAnalysis('niche_message_analysis', { ...msg, nicheId })
          })) || [],
          outcome: params.outcome || 'ongoing',
          dealContext: {
            ...params.dealContext,
            niche: nicheId,
            product: nicheId
          },
          aiSummary: mockAIAnalysis('niche_conversation_summary', { messages: params.messages, nicheId }),
          staffId,
          timestamp: new Date().toISOString()
        };

        const nicheConversationResult = await executeElasticsearchOperation('createDocument', nicheConversationIndex, nicheConversationData, staffId);

        return {
          success: true,
          message: `💬 Conversation logged for niche ${nicheId}`,
          nicheId: nicheId,
          conversationId: nicheConversationResult?._id,
          messagesCount: params.messages?.length || 0,
          nicheSpecificContext: true
        };

      case "get_niche_stats":
        // Get comprehensive niche-specific statistics
        const nicheStatsQuery = {
          query: {
            bool: {
              must: [{ term: { nicheId: nicheId }}]
            }
          },
          aggs: {
            success_rate: { avg: { field: 'metadata.confidence' }},
            total_patterns: { value_count: { field: 'extractedPattern.patternType' }},
            active_marketers: { cardinality: { field: 'staffId' }}
          }
        };

        const nicheStats = await executeElasticsearchOperation('search', nicheSharedIndex, nicheStatsQuery);

        return {
          success: true,
          message: `📊 Niche statistics for ${nicheId}`,
          nicheId: nicheId,
          stats: {
            totalIntelligence: nicheStats?.hits?.total?.value || 0,
            averageSuccessRate: nicheStats?.aggregations?.success_rate?.value || 0,
            totalPatterns: nicheStats?.aggregations?.total_patterns?.value || 0,
            activeMarketers: nicheStats?.aggregations?.active_marketers?.value || 0
          },
          nichePerformance: 'calculated',
          sharedLearning: true
        };

      case "suggest_intelligent_response":
        // Generate niche-specific intelligent responses
        const nicheResponseTemplates = {
          greeting: [
            `Waalaikumsalam! Terima kasih hubungi kami tentang ${nicheId}. Saya boleh bantu akak dengan maklumat lengkap tentang produk ni. Apa yang akak nak tahu dulu?`,
            `Salam! Selamat datang ke ${nicheId} specialist team. Saya di sini untuk bantu akak. Boleh saya tahu apa keperluan utama akak untuk ${nicheId}?`
          ],
          interest: [
            `Bagus akak berminat dengan ${nicheId}! Produk ni memang terbukti effective untuk yang serious nak results. Boleh saya hantar case study customer yang dah success?`,
            `Alhamdulillah! Ramai customer ${nicheId} dah proven hasil dalam masa singkat. Akak nak saya explain benefit utama atau nak terus tengok demo product?`
          ],
          price_inquiry: [
            `Harga ${nicheId} package ni start dari RM${Math.floor(Math.random() * 500) + 500} je, tapi value yang akak dapat dengan ${nicheId} worth lebih dari tu. Nak saya explain ROI calculation?`,
            `Investment untuk ${nicheId} system ni sangat reasonable compare dengan result yang akak akan dapat. Boleh schedule call 15 minit untuk breakdown ${nicheId} pricing?`
          ],
          comparison: [
            `Good question! ${nicheId} solution kami unique sebab kami ada proven methodology yang competitor ${nicheId} tak ada. Nak saya show ${nicheId} comparison chart?`,
            `Betul, penting compare dulu. Yang beza ${nicheId} kami dengan lain - kami guarantee ${nicheId} results dalam 30 hari atau money back. Nak details lengkap?`
          ]
        };

        // Determine response category for niche
        const messageContent = (params.customerMessage || '').toLowerCase();
        let category = 'interest'; // default
        
        if (messageContent.includes('salam') || messageContent.includes('hello')) {
          category = 'greeting';
        } else if (messageContent.includes('harga') || messageContent.includes('price')) {
          category = 'price_inquiry';
        } else if (messageContent.includes('compare') || messageContent.includes('banding')) {
          category = 'comparison';
        }

        const nicheResponses = nicheResponseTemplates[category] || nicheResponseTemplates.interest;
        const selectedNicheResponse = nicheResponses[Math.floor(Math.random() * nicheResponses.length)];

        return {
          success: true,
          message: `🎯 Niche-specific intelligent response for ${nicheId}`,
          nicheId: nicheId,
          customerMessage: params.customerMessage,
          detectedCategory: category,
          nicheOptimizedResponse: selectedNicheResponse,
          nicheSpecific: true,
          productFocus: nicheId,
          responseOptimized: true,
          language: 'bahasa_malaysia'
        };

      default:
        // For other tools, add niche context
        return {
          success: true,
          message: `🧠 ${toolName} with niche context for ${nicheId}`,
          nicheId: nicheId,
          toolName: toolName,
          staffId: staffId,
          nicheSpecific: true,
          params: params,
          timestamp: new Date().toISOString()
        };
    }

  } catch (error) {
    return {
      success: false,
      error: error.message,
      tool: toolName,
      nicheId: nicheId,
      staffId: staffId,
      timestamp: new Date().toISOString()
    };
  }
}
