// 🎯 MCP TOOL: Dynamic Prompt Intelligence for ANY Sales Prompt
// Enhances your existing prompt with learned conversation intelligence

import DynamicNichePromptIntelligence from './dynamic-niche-prompt-intelligence.js';

export const promptEnhancementTool = {
  name: "enhance_sales_prompt",
  description: "Enhance any sales prompt with dynamic niche intelligence based on learned conversation patterns",
  inputSchema: {
    type: "object",
    properties: {
      originalPrompt: {
        type: "string",
        description: "Your existing sales prompt/system message"
      },
      customerMessage: {
        type: "string", 
        description: "Current customer message to analyze"
      },
      niche: {
        type: "string",
        description: "Product niche (VITAC, EXAMA, any product)"
      },
      conversationStage: {
        type: "string",
        description: "Current conversation stage (Problem Identification, Present Solution, etc.)"
      },
      customerProfile: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          previousInteractions: { type: "number" },
          industry: { type: "string" }
        },
        description: "Customer information"
      },
      conversationHistory: {
        type: "array",
        items: { type: "string" },
        description: "Previous messages in this conversation"
      },
      enhancementMode: {
        type: "string",
        enum: ["intelligence_injection", "context_enhancement", "full_guidance"],
        default: "intelligence_injection",
        description: "How to enhance the prompt"
      }
    },
    required: ["originalPrompt", "customerMessage", "niche"]
  }
};

// Implementation in brain processor
async function enhanceSalesPrompt(params: any, staffId: string): Promise<any> {
  try {
    console.log(`🎯 Enhancing sales prompt for ${params.niche}`);
    
    // Step 1: Generate niche intelligence
    const promptIntelligence = new DynamicNichePromptIntelligence();
    const intelligence = await promptIntelligence.generatePromptIntelligence({
      customerMessage: params.customerMessage,
      customerProfile: params.customerProfile,
      niche: params.niche,
      staffId: staffId,
      conversationStage: params.conversationStage,
      previousMessages: params.conversationHistory
    });

    // Step 2: Create intelligence injection for ANY prompt
    const intelligenceInjection = createIntelligenceInjection(intelligence, params);
    
    // Step 3: Enhanced prompt ready for any AI service
    const enhancedPrompt = buildEnhancedPrompt(
      params.originalPrompt,
      intelligenceInjection,
      params.enhancementMode
    );

    return {
      success: true,
      message: `🧠 Sales prompt enhanced with ${params.niche} intelligence`,
      
      // Ready-to-use enhanced prompt
      enhancedPrompt: enhancedPrompt,
      
      // Raw intelligence data
      intelligence: {
        customerAnalysis: intelligence.customerInsights,
        recommendedStrategy: intelligence.recommendedApproach,
        successPatterns: intelligence.successPatterns,
        objectionAnticipation: intelligence.objectionAnticipation,
        malaysiamContext: intelligence.malaysianContext,
        nextActions: intelligence.nextBestActions,
        confidence: intelligence.confidence
      },
      
      // For debugging/monitoring
      processingDetails: {
        niche: params.niche,
        stage: params.conversationStage,
        intelligenceSource: intelligence.learningSource,
        enhancementMode: params.enhancementMode,
        staffId: staffId
      },
      
      // Usage instructions
      usage: {
        instruction: "Use 'enhancedPrompt' as your system message for ChatGPT/Claude",
        format: "Ready for OpenAI, Anthropic, or any LLM API",
        dynamic: true,
        noHardcoding: true
      }
    };

  } catch (error) {
    console.error('Prompt enhancement failed:', error);
    return {
      success: false,
      message: `Prompt enhancement failed: ${error.message}`,
      fallback: {
        enhancedPrompt: params.originalPrompt, // Return original if failed
        error: error.message
      }
    };
  }
}

// Helper function: Create intelligence injection (works with ANY prompt)
function createIntelligenceInjection(intelligence: any, params: any): string {
  return `
---
🧠 ELASTIC BRAIN INTELLIGENCE FOR THIS CONVERSATION:

NICHE: ${params.niche}
CUSTOMER ANALYSIS: ${intelligence.customerInsights}
RECOMMENDED APPROACH: ${intelligence.recommendedApproach}
SUCCESS PATTERNS: ${intelligence.successPatterns}
OBJECTION ANTICIPATION: ${intelligence.objectionAnticipation}
MALAYSIAN CONTEXT: ${intelligence.malaysianContext}
SUGGESTED ACTIONS: ${intelligence.nextBestActions.join(' | ')}
CONFIDENCE LEVEL: ${intelligence.confidence}

📊 LEARNED INTELLIGENCE:
Based on analysis of similar ${params.niche} conversations, this customer profile suggests:
${intelligence.recommendedApproach}

🎯 OPTIMIZATION GUIDANCE:
${intelligence.successPatterns}

⚠️ POTENTIAL CHALLENGES:
${intelligence.objectionAnticipation}

🇲🇾 CULTURAL CONTEXT:
${intelligence.malaysianContext}

---
Apply this intelligence to enhance your responses while following your existing stage flow.
`;
}

// Helper function: Build enhanced prompt (dynamic for any prompt structure)
function buildEnhancedPrompt(originalPrompt: string, intelligenceInjection: string, mode: string): string {
  switch (mode) {
    case 'intelligence_injection':
      return `${originalPrompt}\n\n${intelligenceInjection}`;
      
    case 'context_enhancement':
      return `${intelligenceInjection}\n\n---\n\n${originalPrompt}`;
      
    case 'full_guidance':
      return `
${originalPrompt}

${intelligenceInjection}

ENHANCED INSTRUCTIONS:
- Use the intelligence above to adapt your responses
- Maintain your existing stage flow and structure  
- Apply learned patterns for better conversion
- Anticipate and prepare for likely objections
- Use Malaysian context for natural communication
      `;
      
    default:
      return `${originalPrompt}\n\n${intelligenceInjection}`;
  }
}

export { enhanceSalesPrompt };