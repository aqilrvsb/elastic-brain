// 🧠 DYNAMIC NICHE PROMPT INTELLIGENCE SYSTEM
// Enhances your existing prompts with learned intelligence from conversation data

import { elasticsearchConfig } from './config.js';
import { analyzeCustomerMessage } from './malaysian-language-style.js';

interface PromptIntelligenceContext {
  customerMessage: string;
  customerProfile?: any;
  niche: string;
  staffId: string;
  conversationStage?: string;
  previousMessages?: string[];
}

interface PromptIntelligence {
  customerInsights: string;
  recommendedApproach: string;
  objectionAnticipation: string;
  successPatterns: string;
  malaysianContext: string;
  nextBestActions: string[];
  confidence: number;
  learningSource: string;
}

export class DynamicNichePromptIntelligence {
  
  /**
   * Generate intelligent prompt guidance based on learned patterns
   */
  async generatePromptIntelligence(context: PromptIntelligenceContext): Promise<PromptIntelligence> {
    try {
      console.log(`🧠 Generating prompt intelligence for ${context.niche}`);
      
      // Analyze customer message
      const messageAnalysis = analyzeCustomerMessage(context.customerMessage);
      
      // Query learned patterns for this niche and context
      const relevantPatterns = await this.queryRelevantPatterns(context, messageAnalysis);
      
      // Generate intelligent guidance
      const intelligence = await this.synthesizeIntelligence(context, messageAnalysis, relevantPatterns);
      
      return intelligence;
      
    } catch (error) {
      console.error('Failed to generate prompt intelligence:', error);
      return this.getFallbackIntelligence(context);
    }
  }

  /**
   * Query relevant learned patterns from Elasticsearch
   */
  private async queryRelevantPatterns(context: PromptIntelligenceContext, analysis: any): Promise<any[]> {
    const nicheIndex = `brain-shared-intelligence-${context.niche.toLowerCase()}`;
    
    try {
      // Build search query for relevant patterns
      const searchQuery = {
        query: {
          bool: {
            should: [
              // Similar customer intent
              { 
                match: { 
                  "extractedPattern.customerAnalysis.intent": analysis.intent 
                }
              },
              // Similar conversation stage
              {
                match: {
                  "metadata.stage": context.conversationStage || "general"
                }
              },
              // Successful patterns
              {
                range: {
                  "metadata.successRate": { gte: 0.7 }
                }
              },
              // Recent patterns (more relevant)
              {
                range: {
                  "metadata.timestamp": {
                    gte: "now-30d"
                  }
                }
              }
            ],
            must: [
              { term: { "nicheId": context.niche } }
            ]
          }
        },
        sort: [
          { "metadata.successRate": { order: "desc" } },
          { "metadata.timestamp": { order: "desc" } }
        ],
        size: 10
      };

      const response = await fetch(`${elasticsearchConfig.node}/${nicheIndex}/_search`, {
        method: 'POST',
        headers: {
          'Authorization': `ApiKey ${elasticsearchConfig.auth.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchQuery)
      });

      if (response.ok) {
        const data = await response.json();
        return data.hits?.hits?.map(hit => hit._source) || [];
      }

      return [];

    } catch (error) {
      console.error('Failed to query patterns:', error);
      return [];
    }
  }

  /**
   * Synthesize intelligence from learned patterns
   */
  private async synthesizeIntelligence(
    context: PromptIntelligenceContext, 
    analysis: any, 
    patterns: any[]
  ): Promise<PromptIntelligence> {
    
    const customerInsights = this.generateCustomerInsights(context, analysis, patterns);
    const recommendedApproach = this.generateRecommendedApproach(context, analysis, patterns);
    const objectionAnticipation = this.generateObjectionAnticipation(context, patterns);
    const successPatterns = this.generateSuccessPatterns(context, patterns);
    const malaysianContext = this.generateMalaysianContext(context, analysis);
    const nextBestActions = this.generateNextBestActions(context, analysis, patterns);

    return {
      customerInsights,
      recommendedApproach,
      objectionAnticipation,
      successPatterns,
      malaysianContext,
      nextBestActions,
      confidence: patterns.length > 0 ? 0.85 : 0.6,
      learningSource: patterns.length > 0 ? 'learned_patterns' : 'ai_analysis'
    };
  }

  /**
   * Generate customer insights based on patterns
   */
  private generateCustomerInsights(context: PromptIntelligenceContext, analysis: any, patterns: any[]): string {
    const insights = [];
    
    // Customer intent analysis
    insights.push(`Customer Intent: ${analysis.intent} (${analysis.emotion} sentiment, ${analysis.urgency} urgency)`);
    
    // Pattern-based insights
    if (patterns.length > 0) {
      const similarCustomers = patterns.filter(p => 
        p.extractedPattern?.customerAnalysis?.intent === analysis.intent
      );
      
      if (similarCustomers.length > 0) {
        const successRate = similarCustomers.reduce((acc, p) => acc + (p.metadata?.successRate || 0), 0) / similarCustomers.length;
        insights.push(`Similar customers: ${Math.round(successRate * 100)}% success rate with this intent`);
        
        // Common characteristics
        const commonTraits = this.extractCommonTraits(similarCustomers);
        if (commonTraits.length > 0) {
          insights.push(`Common traits: ${commonTraits.join(', ')}`);
        }
      }
    }
    
    // Malaysian context
    if (analysis.language === 'malay' || analysis.language === 'mixed') {
      insights.push(`Malaysian customer: Prefers casual Bahasa Malaysia communication style`);
    }

    return insights.join(' | ');
  }

  /**
   * Generate recommended approach based on successful patterns
   */
  private generateRecommendedApproach(context: PromptIntelligenceContext, analysis: any, patterns: any[]): string {
    if (patterns.length === 0) {
      return this.getDefaultApproach(analysis.intent, context.niche);
    }

    // Find most successful approaches for this context
    const successfulApproaches = patterns
      .filter(p => p.metadata?.successRate > 0.7)
      .map(p => p.extractedPattern?.responseStrategy || p.extractedPattern?.approach)
      .filter(Boolean);

    if (successfulApproaches.length > 0) {
      const topApproach = this.getMostCommonApproach(successfulApproaches);
      return `Based on successful ${context.niche} conversations: Use ${topApproach} approach. This has proven effective for similar customers with ${analysis.intent} intent.`;
    }

    return this.getDefaultApproach(analysis.intent, context.niche);
  }

  /**
   * Generate objection anticipation
   */
  private generateObjectionAnticipation(context: PromptIntelligenceContext, patterns: any[]): string {
    const objectionPatterns = patterns.filter(p => p.patternType === 'objection_handling');
    
    if (objectionPatterns.length === 0) {
      return `Common ${context.niche} objections: price concerns, timing issues, comparison requests. Be ready to address value proposition.`;
    }

    const commonObjections = objectionPatterns
      .map(p => p.extractedPattern?.objectionType)
      .filter(Boolean);
    
    const objectionCounts = commonObjections.reduce((acc, obj) => {
      acc[obj] = (acc[obj] || 0) + 1;
      return acc;
    }, {});

    const topObjections = Object.entries(objectionCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([objection]) => objection);

    return `Likely objections based on ${context.niche} data: ${topObjections.join(', ')}. Have resolution strategies ready.`;
  }

  /**
   * Generate success patterns guidance
   */
  private generateSuccessPatterns(context: PromptIntelligenceContext, patterns: any[]): string {
    const successPatterns = patterns.filter(p => 
      p.patternType === 'conversation_outcome' && 
      p.extractedPattern?.outcome === 'success'
    );

    if (successPatterns.length === 0) {
      return `Focus on ${context.niche} value proposition, Malaysian communication style, and relationship building.`;
    }

    const successFactors = successPatterns
      .flatMap(p => p.extractedPattern?.successFactors || [])
      .filter(Boolean);

    const factorCounts = successFactors.reduce((acc, factor) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {});

    const topFactors = Object.entries(factorCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([factor]) => factor);

    return `Success factors from ${context.niche} wins: ${topFactors.join(', ')}. Incorporate these elements.`;
  }

  /**
   * Generate Malaysian context guidance
   */
  private generateMalaysianContext(context: PromptIntelligenceContext, analysis: any): string {
    const guidance = [
      "Use casual Bahasa Malaysia with English technical terms",
      "Address customer as 'awak' or 'akak' appropriately", 
      "Include cultural elements like 'Alhamdulillah' for positive outcomes",
      "Use 'boleh', 'nak', 'dengan' for natural flow"
    ];

    // Add specific guidance based on customer message
    if (analysis.urgency === 'high') {
      guidance.push("Malaysian customers appreciate direct but respectful urgency");
    }

    if (analysis.emotion === 'concerned') {
      guidance.push("Use empathetic Malaysian phrases like 'Saya faham concern awak'");
    }

    return guidance.join(' | ');
  }

  /**
   * Generate next best actions
   */
  private generateNextBestActions(context: PromptIntelligenceContext, analysis: any, patterns: any[]): string[] {
    const actions = [];

    // Based on intent
    switch (analysis.intent) {
      case 'pricing_inquiry':
        actions.push("Provide value-focused pricing discussion");
        actions.push("Offer ROI calculation or comparison");
        break;
      case 'demo_request':
        actions.push("Schedule demo with customization focus");
        actions.push("Prepare industry-specific examples");
        break;
      case 'objection':
        actions.push("Address objection with evidence");
        actions.push("Provide social proof or testimonials");
        break;
      default:
        actions.push("Build rapport and understand needs");
        actions.push("Identify decision-making process");
    }

    // Add pattern-based actions
    if (patterns.length > 0) {
      const successfulNextActions = patterns
        .filter(p => p.extractedPattern?.nextBestAction)
        .map(p => p.extractedPattern.nextBestAction);
      
      if (successfulNextActions.length > 0) {
        actions.push(`Learned action: ${successfulNextActions[0]}`);
      }
    }

    return actions;
  }

  /**
   * Get fallback intelligence when no patterns available
   */
  private getFallbackIntelligence(context: PromptIntelligenceContext): PromptIntelligence {
    return {
      customerInsights: `New ${context.niche} inquiry - building initial customer profile`,
      recommendedApproach: `Use relationship-building approach for ${context.niche} introduction`,
      objectionAnticipation: `Standard objections: pricing, timing, comparison. Focus on value.`,
      successPatterns: `Build trust, demonstrate value, use Malaysian communication style`,
      malaysianContext: `Casual Bahasa Malaysia, include English technical terms, respectful tone`,
      nextBestActions: ['Understand customer needs', 'Build rapport', 'Identify decision criteria'],
      confidence: 0.6,
      learningSource: 'default_guidance'
    };
  }

  // Helper methods
  private extractCommonTraits(customers: any[]): string[] {
    // Extract common customer characteristics
    const traits = customers
      .flatMap(c => Object.keys(c.extractedPattern?.customerAnalysis || {}))
      .filter(trait => trait !== 'keyPhrases');
    
    return [...new Set(traits)].slice(0, 3);
  }

  private getMostCommonApproach(approaches: string[]): string {
    const counts = approaches.reduce((acc, approach) => {
      acc[approach] = (acc[approach] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
  }

  private getDefaultApproach(intent: string, niche: string): string {
    const defaultApproaches = {
      'pricing_inquiry': 'value-focused discussion',
      'demo_request': 'demonstration-driven engagement',
      'objection': 'evidence-based resolution',
      'interest_expression': 'benefit-focused conversation',
      'general_inquiry': 'relationship-building approach'
    };

    const approach = defaultApproaches[intent] || defaultApproaches['general_inquiry'];
    return `Recommended ${niche} approach: ${approach}`;
  }
}

export default DynamicNichePromptIntelligence;