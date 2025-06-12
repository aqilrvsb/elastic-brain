// Import Malaysian language response generation
import { generateMalaysianAIResponse, generateContextualMalaysianResponse, generateMalaysianObjectionResponse } from './malaysian-language-responses.js';

// Updated brain processor with Malaysian language requirement
export async function processBrainTool(toolName: string, params: any, staffId: string): Promise<any> {
  try {
    console.log(`🧠 Processing brain tool: ${toolName} for staff: ${staffId}`);
    console.log(`🇲🇾 Language: Bahasa Malaysia (casual, relatable tone)`);
    console.log(`📊 Parameters:`, params);

    switch (toolName) {
      
      case "suggest_intelligent_response":
        // FULLY AI-POWERED RESPONSE GENERATION IN BAHASA MALAYSIA
        const responsePatterns = await queryLearnedPatterns('intelligent_response', {
          messageCategory: params.messageCategory,
          industry: params.customerProfile?.industry,
          scenario: params.scenario
        }, staffId);

        const malaysianAIResponse = generateMalaysianAIResponse('intelligent_response', {
          customerMessage: params.customerMessage,
          customerProfile: params.customerProfile,
          conversationGoal: params.conversationGoal,
          messageCategory: params.messageCategory,
          nicheId: params.nicheId || params.productName
        }, responsePatterns?.hits?.hits || []);

        // Store for learning
        await storeInteractionForLearning({
          type: 'intelligent_response',
          pattern: {
            customerMessage: params.customerMessage,
            responseGenerated: malaysianAIResponse.response,
            messageCategory: params.messageCategory,
            approach: malaysianAIResponse.source,
            language: 'bahasa_malaysia'
          },
          anonymizedData: {
            messageIntent: extractIntentFromData({ message: params.customerMessage }),
            responseCategory: params.messageCategory,
            industry: params.customerProfile?.industry,
            language: 'bahasa_malaysia'
          },
          metadata: {
            confidence: malaysianAIResponse.confidence,
            willTrackResponseEffectiveness: true,
            language: 'bahasa_malaysia'
          }
        }, staffId);

        return {
          success: true,
          message: `🤖 AI-powered Malaysian response with continuous learning`,
          customerMessage: params.customerMessage,
          intelligentResponse: malaysianAIResponse.response,
          confidence: malaysianAIResponse.confidence,
          learningSource: malaysianAIResponse.source,
          responseOptimized: true,
          language: 'bahasa_malaysia',
          tone: 'casual_relatable',
          learnable: true,
          willImproveOverTime: true
        };

      case "get_ai_objection_responses":
        const objectionPatterns = await queryLearnedPatterns('objection_handling', {
          objectionType: params.objectionType,
          industry: params.customerProfile?.industry
        }, staffId);

        let malaysianObjectionResponse;
        if (objectionPatterns?.hits?.hits?.length > 0) {
          // Use learned objection handling with Malaysian adaptation
          const bestPattern = objectionPatterns.hits.hits[0]._source;
          malaysianObjectionResponse = {
            response: generateContextualMalaysianResponse(bestPattern.extractedPattern.responseStrategy, {
              objectionText: params.objectionText,
              objectionType: params.objectionType,
              customerProfile: params.customerProfile,
              nicheId: params.nicheId
            }),
            approach: bestPattern.extractedPattern.approach || 'learned_strategy_malaysian',
            successRate: bestPattern.metadata.successRate || 0.85,
            source: 'learned_intelligence_malaysian'
          };
        } else {
          // AI-generate Malaysian objection response
          malaysianObjectionResponse = {
            response: generateMalaysianObjectionResponse({
              objectionText: params.objectionText,
              objectionType: params.objectionType,
              customerProfile: params.customerProfile,
              nicheId: params.nicheId
            }),
            approach: 'ai_malaysian_generation',
            successRate: 0.75,
            source: 'ai_generation_malaysian'
          };
        }

        // Store this interaction for learning
        await storeInteractionForLearning({
          type: 'objection_handling',
          pattern: {
            objectionText: params.objectionText,
            objectionType: params.objectionType,
            responseStrategy: malaysianObjectionResponse.response,
            approach: malaysianObjectionResponse.approach,
            language: 'bahasa_malaysia'
          },
          anonymizedData: {
            objectionCategory: params.objectionType,
            industry: params.customerProfile?.industry,
            responseType: malaysianObjectionResponse.approach,
            language: 'bahasa_malaysia'
          },
          metadata: {
            confidence: malaysianObjectionResponse.successRate,
            willTrackOutcome: true,
            language: 'bahasa_malaysia'
          }
        }, staffId);

        return {
          success: true,
          message: `🧠 AI-powered Malaysian objection response with learning`,
          objectionType: params.objectionType,
          responses: [malaysianObjectionResponse],
          learningSource: malaysianObjectionResponse.source,
          confidenceLevel: malaysianObjectionResponse.successRate,
          language: 'bahasa_malaysia',
          tone: 'casual_relatable',
          willLearnFromOutcome: true,
          learnable: true
        };

      // All other tools remain the same but with Malaysian language integration
      // ... (keeping existing tools structure)
      
      default:
        return {
          success: false,
          error: `Unknown brain tool: ${toolName}`,
          availableTools: 35,
          language: 'bahasa_malaysia',
          learnable: true,
          timestamp: new Date().toISOString()
        };
    }

  } catch (error) {
    return {
      success: false,
      error: error.message,
      tool: toolName,
      staffId: staffId,
      language: 'bahasa_malaysia',
      learnable: true,
      timestamp: new Date().toISOString()
    };
  }
}
