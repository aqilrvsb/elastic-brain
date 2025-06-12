// 📊 CSV LEARNING PROCESSOR FOR VITAC (and any niche)
// Processes uploaded CSV data and enhances all 35 AI tools

import { elasticsearchConfig } from './config.js';
import { analyzeCustomerMessage, generateMalaysianStyleResponse } from './malaysian-language-style.js';

export interface CSVConversationData {
  id_staff: string;
  prospect_num: string;
  prospect_nama: string;
  stage: string;
  date_order: string;
  conversation: string;
  niche: string;
}

export interface ProcessedLearningPattern {
  patternType: string;
  nicheId: string;
  extractedPattern: {
    staffId: string;
    customerName: string;
    customerPhone: string;
    conversationStage: string;
    conversationText: string;
    messageAnalysis: any;
    responseStrategy: string;
    effectiveness: number;
    timestamp: string;
  };
  metadata: {
    learningSource: string;
    successRate: number;
    timestamp: string;
    productNiche: string;
  };
}

export class CSVLearningProcessor {
  
  /**
   * Process CSV conversation data and enhance AI tools
   */
  async processCSVLearning(csvData: CSVConversationData[], targetNiche?: string): Promise<any> {
    console.log(`📊 Processing CSV learning data: ${csvData.length} conversations`);
    
    try {
      // Filter by niche if specified
      const filteredData = targetNiche 
        ? csvData.filter(conv => conv.niche?.toUpperCase() === targetNiche.toUpperCase())
        : csvData;

      console.log(`🎯 Processing ${filteredData.length} conversations for niche: ${targetNiche || 'ALL'}`);

      if (filteredData.length === 0) {
        return {
          success: false,
          message: `No conversations found for niche: ${targetNiche || 'ANY'}`,
          availableNiches: [...new Set(csvData.map(c => c.niche).filter(Boolean))]
        };
      }

      // Group by niche for organized processing
      const nicheGroups = this.groupByNiche(filteredData);
      let totalPatterns = 0;
      const processingResults = {};

      // Process each niche separately
      for (const [niche, conversations] of Object.entries(nicheGroups)) {
        const nicheResult = await this.processNicheConversations(niche, conversations);
        processingResults[niche] = nicheResult;
        totalPatterns += nicheResult.patternsExtracted;
      }

      return {
        success: true,
        message: `CSV learning completed successfully`,
        results: {
          totalConversations: filteredData.length,
          nichesProcessed: Object.keys(nicheGroups),
          totalPatternsExtracted: totalPatterns,
          nicheResults: processingResults,
          enhancedTools: this.getEnhancedToolsList()
        },
        instructions: [
          "All 35+ AI tools now enhanced with CSV conversation intelligence",
          "Use suggest_intelligent_response with learned patterns",
          "Malaysian language responses improved with real conversation data",
          "Test enhanced responses with your actual customer scenarios"
        ]
      };

    } catch (error) {
      console.error('CSV learning failed:', error);
      return {
        success: false,
        message: `CSV learning failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Group conversations by niche
   */
  private groupByNiche(conversations: CSVConversationData[]): Record<string, CSVConversationData[]> {
    const groups: Record<string, CSVConversationData[]> = {};
    
    conversations.forEach(conv => {
      const niche = conv.niche || 'GENERAL';
      if (!groups[niche]) {
        groups[niche] = [];
      }
      groups[niche].push(conv);
    });

    return groups;
  }

  /**
   * Process conversations for a specific niche
   */
  private async processNicheConversations(niche: string, conversations: CSVConversationData[]): Promise<any> {
    console.log(`🧠 Processing ${niche}: ${conversations.length} conversations`);
    
    const patterns: ProcessedLearningPattern[] = [];
    
    // Extract learning patterns from each conversation
    for (const conversation of conversations) {
      try {
        const conversationPatterns = await this.extractConversationPatterns(conversation, niche);
        patterns.push(...conversationPatterns);
      } catch (error) {
        console.error(`Failed to process conversation from ${conversation.prospect_nama}:`, error.message);
      }
    }

    // Store patterns in Elasticsearch for AI learning
    const storedCount = await this.storePatternsInBrain(patterns, niche);

    // Create niche intelligence summary
    await this.createNicheSummary(niche, conversations.length, storedCount);

    return {
      niche,
      conversationsProcessed: conversations.length,
      patternsExtracted: patterns.length,
      patternsStored: storedCount,
      intelligenceLevel: this.calculateIntelligenceLevel(storedCount)
    };
  }

  /**
   * Extract learning patterns from a single conversation
   */
  private async extractConversationPatterns(conversation: CSVConversationData, niche: string): Promise<ProcessedLearningPattern[]> {
    const patterns: ProcessedLearningPattern[] = [];

    if (!conversation.conversation || !conversation.prospect_nama) {
      return patterns;
    }

    // Analyze the conversation content
    const messageAnalysis = analyzeCustomerMessage(conversation.conversation);
    const effectiveness = this.calculateEffectiveness(conversation.stage);

    // Main conversation pattern
    const conversationPattern: ProcessedLearningPattern = {
      patternType: 'csv_conversation',
      nicheId: niche,
      extractedPattern: {
        staffId: conversation.id_staff,
        customerName: conversation.prospect_nama,
        customerPhone: conversation.prospect_num,
        conversationStage: conversation.stage || 'unknown',
        conversationText: conversation.conversation,
        messageAnalysis: messageAnalysis,
        responseStrategy: this.extractResponseStrategy(conversation.conversation),
        effectiveness: effectiveness,
        timestamp: conversation.date_order || new Date().toISOString()
      },
      metadata: {
        learningSource: 'csv_import',
        successRate: effectiveness,
        timestamp: new Date().toISOString(),
        productNiche: niche
      }
    };
    patterns.push(conversationPattern);

    // Extract objection patterns if detected
    const objectionPattern = this.extractObjectionPattern(conversation, niche);
    if (objectionPattern) {
      patterns.push(objectionPattern);
    }

    // Extract success patterns for successful conversations
    if (effectiveness > 0.7) {
      const successPattern = this.extractSuccessPattern(conversation, niche);
      if (successPattern) {
        patterns.push(successPattern);
      }
    }

    return patterns;
  }

  /**
   * Extract objection handling patterns
   */
  private extractObjectionPattern(conversation: CSVConversationData, niche: string): ProcessedLearningPattern | null {
    const objectionKeywords = ['mahal', 'expensive', 'tak yakin', 'doubt', 'ragu', 'bimbang', 'worried', 'tidak', 'tak nak'];
    
    const hasObjection = objectionKeywords.some(keyword => 
      conversation.conversation.toLowerCase().includes(keyword)
    );

    if (hasObjection) {
      return {
        patternType: 'objection_handling',
        nicheId: niche,
        extractedPattern: {
          staffId: conversation.id_staff,
          customerName: conversation.prospect_nama,
          customerPhone: conversation.prospect_num,
          conversationStage: conversation.stage || 'objection',
          conversationText: conversation.conversation,
          messageAnalysis: analyzeCustomerMessage(conversation.conversation),
          responseStrategy: this.extractResponseStrategy(conversation.conversation),
          effectiveness: this.calculateEffectiveness(conversation.stage),
          timestamp: conversation.date_order || new Date().toISOString()
        },
        metadata: {
          learningSource: 'csv_objection_detection',
          successRate: this.calculateEffectiveness(conversation.stage),
          timestamp: new Date().toISOString(),
          productNiche: niche
        }
      };
    }

    return null;
  }

  /**
   * Extract success patterns from successful conversations
   */
  private extractSuccessPattern(conversation: CSVConversationData, niche: string): ProcessedLearningPattern | null {
    const successKeywords = ['setuju', 'ok', 'deal', 'order', 'booking', 'berminat', 'interested'];
    
    const hasSuccess = successKeywords.some(keyword => 
      conversation.conversation.toLowerCase().includes(keyword) ||
      conversation.stage?.toLowerCase().includes(keyword)
    );

    if (hasSuccess) {
      return {
        patternType: 'success_strategy',
        nicheId: niche,
        extractedPattern: {
          staffId: conversation.id_staff,
          customerName: conversation.prospect_nama,
          customerPhone: conversation.prospect_num,
          conversationStage: conversation.stage || 'success',
          conversationText: conversation.conversation,
          messageAnalysis: analyzeCustomerMessage(conversation.conversation),
          responseStrategy: this.extractResponseStrategy(conversation.conversation),
          effectiveness: 0.9, // High effectiveness for success patterns
          timestamp: conversation.date_order || new Date().toISOString()
        },
        metadata: {
          learningSource: 'csv_success_pattern',
          successRate: 0.9,
          timestamp: new Date().toISOString(),
          productNiche: niche
        }
      };
    }

    return null;
  }

  /**
   * Store patterns in Elasticsearch brain
   */
  private async storePatternsInBrain(patterns: ProcessedLearningPattern[], niche: string): Promise<number> {
    let storedCount = 0;
    const indexName = `brain-shared-intelligence-${niche.toLowerCase()}`;

    for (const pattern of patterns) {
      try {
        const response = await fetch(`${elasticsearchConfig.node}/${indexName}/_doc`, {
          method: 'POST',
          headers: {
            'Authorization': `ApiKey ${elasticsearchConfig.auth.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...pattern,
            importTimestamp: new Date().toISOString(),
            version: '1.0'
          })
        });

        if (response.ok) {
          storedCount++;
        } else {
          console.error(`Failed to store pattern: ${response.status}`);
        }

      } catch (error) {
        console.error('Pattern storage failed:', error);
      }
    }

    console.log(`   ✅ Stored ${storedCount}/${patterns.length} patterns for ${niche}`);
    return storedCount;
  }

  /**
   * Create niche intelligence summary
   */
  private async createNicheSummary(niche: string, conversations: number, patterns: number): Promise<void> {
    const summary = {
      patternType: 'niche_intelligence_summary',
      nicheId: niche,
      extractedPattern: {
        nicheId: niche,
        totalConversations: conversations,
        patternsExtracted: patterns,
        lastUpdated: new Date().toISOString(),
        learningStatus: 'active',
        intelligenceLevel: this.calculateIntelligenceLevel(patterns),
        dataSource: 'csv_import',
        readyForTesting: true
      },
      metadata: {
        learningSource: 'csv_summary',
        successRate: 1.0,
        timestamp: new Date().toISOString(),
        productNiche: niche
      }
    };

    const indexName = `brain-shared-intelligence-${niche.toLowerCase()}`;
    
    try {
      await fetch(`${elasticsearchConfig.node}/${indexName}/_doc`, {
        method: 'POST',
        headers: {
          'Authorization': `ApiKey ${elasticsearchConfig.auth.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(summary)
      });

      console.log(`   📊 Created ${niche} intelligence summary`);
    } catch (error) {
      console.error('Failed to create niche summary:', error);
    }
  }

  // Helper methods
  private calculateEffectiveness(stage: string): number {
    if (!stage) return 0.5;
    
    const stageText = stage.toLowerCase();
    if (stageText.includes('order') || stageText.includes('booking') || stageText.includes('close')) return 0.9;
    if (stageText.includes('urgency') || stageText.includes('interest') || stageText.includes('demo')) return 0.7;
    if (stageText.includes('problem') || stageText.includes('objection') || stageText.includes('identifica')) return 0.4;
    if (stageText.includes('null') || stageText === '') return 0.5;
    return 0.6;
  }

  private extractResponseStrategy(conversation: string): string {
    const text = conversation.toLowerCase();
    
    if (text.includes('promo') || text.includes('discount')) return 'promotional_offer';
    if (text.includes('testimoni') || text.includes('client') || text.includes('customer')) return 'social_proof';
    if (text.includes('demo') || text.includes('show') || text.includes('explain')) return 'demonstration';
    if (text.includes('benefit') || text.includes('value') || text.includes('vitamin')) return 'value_proposition';
    if (text.includes('harga') || text.includes('price') || text.includes('rm')) return 'pricing_strategy';
    
    return 'relationship_building';
  }

  private calculateIntelligenceLevel(patterns: number): string {
    if (patterns > 500) return 'expert';
    if (patterns > 200) return 'advanced';
    if (patterns > 50) return 'intermediate';
    if (patterns > 10) return 'basic';
    return 'learning';
  }

  private getEnhancedToolsList(): string[] {
    return [
      'suggest_intelligent_response',
      'get_ai_objection_responses',
      'analyze_conversation_intelligence',
      'extract_sales_intelligence',
      'query_shared_intelligence',
      'predict_conversation_outcome',
      'detect_buying_signals',
      'optimize_timing_strategy',
      'analyze_customer_personality',
      'match_communication_style',
      'auto_learn_from_outcome',
      'optimize_sales_strategy',
      'generate_market_intelligence',
      'track_competitive_mentions',
      'contribute_success_intelligence',
      'analyze_failure_patterns',
      'get_comprehensive_intelligence_stats',
      'audit_data_privacy',
      'intelligently_anonymize_data',
      'get_comprehensive_zone_info',
      'suggest_response_template',
      'analyze_conversation_patterns',
      'predict_success_probability',
      'get_timing_recommendations',
      'contribute_success_story',
      'report_failed_approach',
      'get_intelligence_stats',
      'track_closing_readiness',
      'get_closing_recommendations',
      'analyze_closing_outcome',
      'create_private_entities',
      'search_private_data',
      'update_customer_profile',
      'log_conversation',
      'get_time_utc'
    ];
  }
}

export default CSVLearningProcessor;