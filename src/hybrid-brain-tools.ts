// Enhanced Brain Tools for Hybrid Learning Architecture
// Supports both private staff zones and shared intelligence
// INCLUDES: Original 32 Brain Tools + 16 Hybrid Learning Tools = 48 Total Tools

import { getBrainToolsList } from './brain-tools.js';

// Get original 32 brain tools
const originalBrainTools = getBrainToolsList();

// Hybrid Learning Tools (16 additional tools)
const hybridLearningTools = [
  // ==========================================
  // PRIVATE ZONE TOOLS (Staff-specific data)
  // ==========================================
  
  {
    name: "create_private_entities",
    description: "Create entities in marketer's private zone (customers, conversations, deals)",
    parameters: {
      type: "object",
      properties: {
        entityType: {
          type: "string",
          enum: ["customer", "conversation", "deal", "personal_note"],
          description: "Type of private entity to create"
        },
        entityData: {
          type: "object",
          description: "Entity data (kept private to this marketer)"
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags for categorization"
        }
      },
      required: ["entityType", "entityData"]
    }
  },

  {
    name: "search_private_data",
    description: "Search marketer's private customer data, conversations, and deals",
    parameters: {
      type: "object", 
      properties: {
        query: { type: "string", description: "Search query for private data" },
        entityType: {
          type: "string",
          enum: ["customer", "conversation", "deal", "personal_note", "all"],
          description: "Type of private data to search"
        },
        limit: { type: "number", default: 10, description: "Max results to return" }
      },
      required: ["query"]
    }
  },

  {
    name: "update_customer_profile",
    description: "Update customer information in marketer's private zone",
    parameters: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Customer identifier" },
        updates: { type: "object", description: "Fields to update" },
        addTags: { type: "array", items: { type: "string" }, description: "Tags to add" }
      },
      required: ["customerId", "updates"]
    }
  },

  {
    name: "log_conversation",
    description: "Log WhatsApp conversation in marketer's private zone",
    parameters: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Customer this conversation is with" },
        messages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sender: { type: "string", enum: ["marketer", "customer"] },
              message: { type: "string" },
              timestamp: { type: "string" }
            }
          }
        },
        outcome: {
          type: "string", 
          enum: ["scheduled_call", "sent_quote", "closed_deal", "objection", "follow_up_needed", "no_response"],
          description: "Conversation outcome"
        },
        extractIntelligence: {
          type: "boolean",
          default: true,
          description: "Whether to extract anonymized patterns for shared learning"
        }
      },
      required: ["customerId", "messages"]
    }
  },

  // ==========================================
  // SHARED INTELLIGENCE TOOLS
  // ==========================================

  {
    name: "extract_sales_intelligence",
    description: "Extract anonymized sales patterns from private conversation for shared learning",
    parameters: {
      type: "object",
      properties: {
        conversationId: { type: "string", description: "Private conversation to analyze" },
        extractionType: {
          type: "string",
          enum: ["objection_pattern", "success_strategy", "industry_insight", "timing_pattern"],
          description: "Type of intelligence to extract"
        },
        anonymize: { type: "boolean", default: true, description: "Remove all personal data" }
      },
      required: ["conversationId", "extractionType"]
    }
  },

  {
    name: "query_shared_intelligence",
    description: "Get sales intelligence from shared learning across all marketers",
    parameters: {
      type: "object",
      properties: {
        situation: { type: "string", description: "Current sales situation or objection" },
        customerType: {
          type: "string",
          enum: ["manufacturing", "healthcare", "retail", "service", "technology", "small_business", "enterprise"],
          description: "Customer industry/type"
        },
        intelligenceType: {
          type: "string", 
          enum: ["objection_handling", "success_strategies", "response_templates", "timing_optimization", "all"],
          description: "Type of intelligence needed"
        },
        limit: { type: "number", default: 5, description: "Max suggestions to return" }
      },
      required: ["situation"]
    }
  },

  {
    name: "get_objection_responses",
    description: "Get proven responses for specific objections from shared intelligence",
    parameters: {
      type: "object",
      properties: {
        objectionType: {
          type: "string",
          enum: ["price_too_high", "need_to_think", "budget_constraints", "timing_not_right", "already_have_solution", "decision_maker_not_available"],
          description: "Type of objection received"
        },
        customerIndustry: { type: "string", description: "Customer's industry" },
        successRate: { type: "number", minimum: 0, maximum: 100, description: "Minimum success rate for suggestions" }
      },
      required: ["objectionType"]
    }
  },

  {
    name: "suggest_response_template",
    description: "Get high-converting message templates from shared intelligence",
    parameters: {
      type: "object",
      properties: {
        messageType: {
          type: "string",
          enum: ["initial_outreach", "follow_up", "objection_response", "closing", "quote_delivery", "check_in"],
          description: "Type of message to send"
        },
        customerProfile: { type: "string", description: "Customer industry and characteristics" },
        previousInteraction: { type: "string", description: "Context from previous interaction" },
        minSuccessRate: { type: "number", default: 70, description: "Minimum success rate for templates" }
      },
      required: ["messageType"]
    }
  },

  {
    name: "analyze_conversation_patterns",
    description: "Analyze conversation for patterns and get intelligence-based suggestions",
    parameters: {
      type: "object",
      properties: {
        conversationText: { type: "string", description: "Recent conversation text to analyze" },
        customerContext: { type: "string", description: "Customer industry and background" },
        currentStage: {
          type: "string",
          enum: ["prospecting", "discovery", "presentation", "objection_handling", "closing", "follow_up"],
          description: "Current sales stage"
        }
      },
      required: ["conversationText", "currentStage"]
    }
  },

  {
    name: "predict_success_probability",
    description: "Predict likelihood of success for proposed approach using shared intelligence",
    parameters: {
      type: "object",
      properties: {
        proposedApproach: { type: "string", description: "Sales approach or message being considered" },
        customerProfile: { type: "string", description: "Customer characteristics and context" },
        currentSituation: { type: "string", description: "Current conversation state and challenges" }
      },
      required: ["proposedApproach", "customerProfile"]
    }
  },

  {
    name: "get_timing_recommendations",
    description: "Get optimal timing for follow-ups based on shared intelligence",
    parameters: {
      type: "object",
      properties: {
        lastInteraction: { type: "string", description: "When and how you last contacted customer" },
        customerResponse: { type: "string", description: "Customer's last response or behavior" },
        customerType: { type: "string", description: "Customer industry and profile" },
        messageType: {
          type: "string",
          enum: ["follow_up", "quote_follow_up", "check_in", "closing_attempt"],
          description: "Type of next message planned"
        }
      },
      required: ["lastInteraction", "customerResponse"]
    }
  },

  // ==========================================
  // HYBRID LEARNING MANAGEMENT
  // ==========================================

  {
    name: "contribute_success_story",
    description: "Contribute anonymized success story to shared intelligence",
    parameters: {
      type: "object",
      properties: {
        successType: {
          type: "string",
          enum: ["objection_overcome", "quick_close", "large_deal", "difficult_customer", "industry_breakthrough"],
          description: "Type of success to share"
        },
        approach: { type: "string", description: "What approach or strategy worked" },
        context: { type: "string", description: "Anonymized situation context" },
        outcome: { type: "string", description: "Results achieved" },
        customerProfile: { type: "string", description: "Anonymized customer characteristics" },
        reusable: { type: "boolean", default: true, description: "Whether this strategy can be replicated" }
      },
      required: ["successType", "approach", "outcome"]
    }
  },

  {
    name: "report_failed_approach",
    description: "Report approach that didn't work to help improve shared intelligence",
    parameters: {
      type: "object",
      properties: {
        failedApproach: { type: "string", description: "What was tried that didn't work" },
        customerReaction: { type: "string", description: "How customer responded" },
        situationContext: { type: "string", description: "Anonymized context" },
        lessonsLearned: { type: "string", description: "What to avoid or do differently" }
      },
      required: ["failedApproach", "customerReaction"]
    }
  },

  {
    name: "get_intelligence_stats",
    description: "Get statistics about shared intelligence learning and effectiveness",
    parameters: {
      type: "object",
      properties: {
        statsType: {
          type: "string",
          enum: ["objection_success_rates", "template_performance", "timing_effectiveness", "industry_insights", "overall_learning"],
          description: "Type of statistics to retrieve"
        },
        timeframe: {
          type: "string",
          enum: ["last_week", "last_month", "last_quarter", "all_time"],
          description: "Time period for statistics"
        }
      },
      required: ["statsType"]
    }
  },

  // ==========================================
  // PRIVACY & COMPLIANCE TOOLS
  // ==========================================

  {
    name: "audit_data_privacy",
    description: "Audit what data is private vs shared for compliance",
    parameters: {
      type: "object",
      properties: {
        auditType: {
          type: "string",
          enum: ["personal_data_check", "shared_data_review", "anonymization_verification", "full_audit"],
          description: "Type of privacy audit to perform"
        },
        entityId: { type: "string", description: "Specific entity to audit (optional)" }
      },
      required: ["auditType"]
    }
  },

  {
    name: "anonymize_conversation",
    description: "Convert private conversation to anonymized intelligence data",
    parameters: {
      type: "object",
      properties: {
        conversationId: { type: "string", description: "Private conversation to anonymize" },
        preservePatterns: {
          type: "array",
          items: {
            type: "string",
            enum: ["objection_types", "response_strategies", "timing_patterns", "industry_context", "success_indicators"]
          },
          description: "What patterns to preserve while anonymizing"
        }
      },
      required: ["conversationId"]
    }
  },

  // ==========================================
  // UTILITY TOOLS
  // ==========================================

  {
    name: "get_zone_info",
    description: "Get information about private zone and shared intelligence access",
    parameters: {
      type: "object",
      properties: {
        infoType: {
          type: "string",
          enum: ["private_zone_stats", "shared_intelligence_access", "learning_contributions", "all"],
          description: "Type of zone information to retrieve"
        }
      },
      required: ["infoType"]
    }
  },

  {
    name: "get_time_utc",
    description: "Get current UTC time - useful for timestamping conversations and activities",
    parameters: {
      type: "object",
      properties: {
        format: {
          type: "string",
          enum: ["iso", "timestamp", "readable"],
          description: "Time format to return"
        }
      }
    }
  }
];

// Combine original brain tools + hybrid learning tools
export const brainTools = [
  ...originalBrainTools,  // Original 32 brain tools
  ...hybridLearningTools  // 16 hybrid learning tools
];

export default brainTools;
