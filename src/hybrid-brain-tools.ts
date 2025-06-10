// ULTIMATE HYBRID BRAIN TOOLS - ALL GAPS FILLED
// Enhanced for HTTP Stream MCP with AI-powered intelligence
// Total: 32 Ultimate Tools (18 Enhanced + 14 New Critical Tools)

import { getBrainToolsList } from './brain-tools.js';

// Get original 32 brain tools
const originalBrainTools = getBrainToolsList();

// ULTIMATE HYBRID LEARNING TOOLS (All Gaps Filled)
const ultimateHybridTools = [
  // ==========================================
  // ENHANCED PRIVATE ZONE TOOLS (AI-Powered)
  // ==========================================
  
  {
    name: "create_private_entities",
    description: "AI-powered entity creation with automatic profiling and intelligence extraction",
    inputSchema: {
      type: "object",
      properties: {
        entityType: {
          type: "string",
          enum: ["customer", "conversation", "deal", "personal_note"],
          description: "Type of private entity to create"
        },
        entityData: {
          type: "object",
          description: "Entity data with AI analysis"
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags for categorization"
        },
        aiAnalysis: {
          type: "boolean",
          default: true,
          description: "Enable AI profiling and intelligence extraction"
        },
        extractInsights: {
          type: "boolean", 
          default: true,
          description: "Extract actionable insights for sales strategy"
        }
      },
      required: ["entityType", "entityData"]
    }
  },

  {
    name: "search_private_data",
    description: "AI-powered semantic search with contextual understanding and relevance ranking",
    inputSchema: {
      type: "object", 
      properties: {
        query: { type: "string", description: "Natural language search query" },
        entityType: {
          type: "string",
          enum: ["customer", "conversation", "deal", "personal_note", "all"],
          description: "Type of private data to search"
        },
        context: { type: "string", description: "Current situation context for relevance" },
        aiRanking: { type: "boolean", default: true, description: "Use AI for relevance ranking" },
        limit: { type: "number", default: 10, description: "Max results to return" },
        includeInsights: { type: "boolean", default: true, description: "Include AI-generated insights" }
      },
      required: ["query"]
    }
  },

  {
    name: "update_customer_profile",
    description: "AI-enhanced customer profile updates with behavioral analysis and predictions",
    inputSchema: {
      type: "object",
      properties: {
        customerId: { type: "string", description: "Customer identifier" },
        updates: { type: "object", description: "Fields to update" },
        addTags: { type: "array", items: { type: "string" }, description: "Tags to add" },
        analyzeChanges: { type: "boolean", default: true, description: "AI analysis of profile changes" },
        predictBehavior: { type: "boolean", default: true, description: "Predict customer behavior changes" },
        updateStrategy: { type: "boolean", default: true, description: "Update sales strategy based on changes" }
      },
      required: ["customerId", "updates"]
    }
  },

  {
    name: "log_conversation",
    description: "Advanced conversation logging with real-time AI analysis and outcome prediction",
    inputSchema: {
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
              timestamp: { type: "string" },
              sentiment: { type: "string", description: "AI-detected sentiment" },
              intent: { type: "string", description: "AI-detected intent" }
            }
          }
        },
        outcome: {
          type: "string", 
          enum: ["scheduled_call", "sent_quote", "closed_deal", "objection", "follow_up_needed", "no_response"],
          description: "Conversation outcome"
        },
        aiAnalysis: {
          type: "object",
          properties: {
            sentimentAnalysis: { type: "boolean", default: true },
            intentDetection: { type: "boolean", default: true },
            buyingSignals: { type: "boolean", default: true },
            nextBestAction: { type: "boolean", default: true },
            outcomePredict: { type: "boolean", default: true }
          }
        },
        extractIntelligence: {
          type: "boolean",
          default: true,
          description: "Extract anonymized patterns for shared learning"
        }
      },
      required: ["customerId", "messages"]
    }
  },

  // ==========================================
  // ULTIMATE SHARED INTELLIGENCE TOOLS (AI-Enhanced)
  // ==========================================

  {
    name: "extract_sales_intelligence",
    description: "Advanced AI-powered intelligence extraction with deep pattern analysis",
    inputSchema: {
      type: "object",
      properties: {
        conversationId: { type: "string", description: "Private conversation to analyze" },
        extractionType: {
          type: "string",
          enum: ["objection_pattern", "success_strategy", "industry_insight", "timing_pattern", "personality_match", "competitive_intel"],
          description: "Type of intelligence to extract"
        },
        aiDepthAnalysis: { type: "boolean", default: true, description: "Deep AI pattern recognition" },
        crossReference: { type: "boolean", default: true, description: "Cross-reference with market data" },
        predictiveValue: { type: "boolean", default: true, description: "Calculate predictive value" },
        anonymize: { type: "boolean", default: true, description: "Remove all personal data" }
      },
      required: ["conversationId", "extractionType"]
    }
  },

  {
    name: "query_shared_intelligence",
    description: "AI-powered contextual intelligence retrieval with real-time optimization",
    inputSchema: {
      type: "object",
      properties: {
        situation: { type: "string", description: "Current sales situation or objection" },
        customerProfile: { type: "object", description: "Customer characteristics for matching" },
        conversationContext: { type: "string", description: "Current conversation context" },
        customerType: {
          type: "string",
          enum: ["manufacturing", "healthcare", "retail", "service", "technology", "small_business", "enterprise"],
          description: "Customer industry/type"
        },
        intelligenceType: {
          type: "string", 
          enum: ["objection_handling", "success_strategies", "response_templates", "timing_optimization", "personality_matching", "competitive_intel", "all"],
          description: "Type of intelligence needed"
        },
        aiContextMatching: { type: "boolean", default: true, description: "AI-powered context matching" },
        personalityFiltering: { type: "boolean", default: true, description: "Filter by customer personality" },
        marketConditions: { type: "boolean", default: true, description: "Include current market conditions" },
        limit: { type: "number", default: 5, description: "Max suggestions to return" }
      },
      required: ["situation"]
    }
  },

  {
    name: "get_ai_objection_responses",
    description: "Ultimate AI-powered objection handling with contextual analysis and success prediction",
    inputSchema: {
      type: "object",
      properties: {
        objectionText: { type: "string", description: "Exact customer objection" },
        objectionType: {
          type: "string",
          enum: ["price_too_high", "need_to_think", "budget_constraints", "timing_not_right", "already_have_solution", "decision_maker_not_available", "trust_concerns", "feature_gaps"],
          description: "Type of objection received"
        },
        customerProfile: { type: "object", description: "Complete customer profile" },
        conversationHistory: { type: "array", description: "Previous messages for context" },
        customerIndustry: { type: "string", description: "Customer's industry" },
        dealContext: {
          type: "object",
          properties: {
            dealSize: { type: "number", description: "Potential deal value" },
            timeline: { type: "string", description: "Customer's timeline" },
            competitors: { type: "array", description: "Mentioned competitors" },
            decisionMakers: { type: "array", description: "Decision makers involved" }
          }
        },
        aiAnalysis: {
          type: "object",
          properties: {
            contextAnalysis: { type: "boolean", default: true },
            personalityMatching: { type: "boolean", default: true },
            successPrediction: { type: "boolean", default: true },
            responseOptimization: { type: "boolean", default: true },
            followUpStrategy: { type: "boolean", default: true }
          }
        },
        minSuccessRate: { type: "number", default: 70, description: "Minimum success rate for suggestions" }
      },
      required: ["objectionText", "customerProfile"]
    }
  },

  {
    name: "suggest_intelligent_response",
    description: "AI-generated contextually perfect responses with personality matching",
    inputSchema: {
      type: "object",
      properties: {
        customerMessage: { type: "string", description: "Customer's latest message" },
        messageType: {
          type: "string",
          enum: ["initial_outreach", "follow_up", "objection_response", "closing", "quote_delivery", "check_in", "urgent_response"],
          description: "Type of message to send"
        },
        customerPersonality: { type: "object", description: "AI-analyzed customer personality" },
        conversationGoal: {
          type: "string",
          enum: ["build_rapport", "qualify_lead", "present_solution", "handle_objection", "close_deal", "schedule_meeting"],
          description: "Primary goal for this response"
        },
        customerProfile: { type: "string", description: "Customer industry and characteristics" },
        previousInteraction: { type: "string", description: "Context from previous interaction" },
        urgency: { type: "string", enum: ["low", "medium", "high"], description: "Response urgency" },
        aiOptimization: {
          type: "object",
          properties: {
            personalityMatching: { type: "boolean", default: true },
            sentimentAlignment: { type: "boolean", default: true },
            culturalSensitivity: { type: "boolean", default: true },
            responseOptimization: { type: "boolean", default: true }
          }
        },
        minSuccessRate: { type: "number", default: 70, description: "Minimum success rate for templates" }
      },
      required: ["customerMessage", "messageType", "conversationGoal"]
    }
  },

  {
    name: "analyze_conversation_intelligence",
    description: "Deep AI analysis of conversation patterns with predictive insights",
    inputSchema: {
      type: "object",
      properties: {
        conversationText: { type: "string", description: "Recent conversation text to analyze" },
        customerContext: { type: "string", description: "Customer industry and background" },
        currentStage: {
          type: "string",
          enum: ["prospecting", "discovery", "presentation", "objection_handling", "closing", "follow_up"],
          description: "Current sales stage"
        },
        analysisDepth: {
          type: "string",
          enum: ["basic", "standard", "deep", "comprehensive"],
          default: "comprehensive",
          description: "Level of AI analysis"
        },
        includeAnalysis: {
          type: "object",
          properties: {
            sentimentTrend: { type: "boolean", default: true },
            buyingSignals: { type: "boolean", default: true },
            objectionPatterns: { type: "boolean", default: true },
            personalityProfile: { type: "boolean", default: true },
            nextBestActions: { type: "boolean", default: true },
            riskFactors: { type: "boolean", default: true },
            opportunityMoments: { type: "boolean", default: true }
          }
        }
      },
      required: ["conversationText", "currentStage"]
    }
  },

  {
    name: "predict_conversation_outcome",
    description: "Advanced AI prediction of conversation outcomes with confidence scoring",
    inputSchema: {
      type: "object",
      properties: {
        conversationData: { type: "object", description: "Complete conversation analysis" },
        customerProfile: { type: "object", description: "Customer characteristics and history" },
        marketConditions: { type: "object", description: "Current market context" },
        competitorActivity: { type: "string", description: "Known competitive pressure" },
        salesApproach: { type: "string", description: "Current sales strategy being used" },
        predictionScope: {
          type: "object",
          properties: {
            dealProbability: { type: "boolean", default: true },
            timeToClose: { type: "boolean", default: true },
            dealSize: { type: "boolean", default: true },
            nextActions: { type: "boolean", default: true },
            riskFactors: { type: "boolean", default: true },
            successTriggers: { type: "boolean", default: true }
          }
        },
        timeframe: {
          type: "string",
          enum: ["24_hours", "1_week", "1_month", "3_months"],
          default: "1_week",
          description: "Prediction timeframe"
        }
      },
      required: ["conversationData", "customerProfile"]
    }
  },

  {
    name: "detect_buying_signals",
    description: "Real-time AI detection of buying signals with confidence scoring",
    inputSchema: {
      type: "object",
      properties: {
        customerMessage: { type: "string", description: "Latest customer message" },
        conversationHistory: { type: "array", description: "Previous conversation context" },
        conversationStage: { type: "string", description: "Current conversation stage" },
        customerProfile: { type: "object", description: "Customer background for context" },
        previousSignals: { type: "array", description: "Previously detected signals" },
        signalTypes: {
          type: "array",
          items: {
            type: "string",
            enum: ["budget_questions", "timeline_interest", "decision_maker_involvement", "implementation_questions", "competitor_comparison", "urgency_indicators", "approval_process", "roi_focus"]
          },
          description: "Types of signals to detect"
        },
        aiAnalysis: {
          type: "object",
          properties: {
            sentimentShift: { type: "boolean", default: true },
            languagePatterns: { type: "boolean", default: true },
            questionTypes: { type: "boolean", default: true },
            urgencyLevel: { type: "boolean", default: true },
            commitmentLevel: { type: "boolean", default: true }
          }
        }
      },
      required: ["customerMessage"]
    }
  },

  {
    name: "optimize_timing_strategy",
    description: "AI-powered timing optimization with behavioral prediction",
    inputSchema: {
      type: "object",
      properties: {
        lastInteraction: { type: "string", description: "When and how you last contacted customer" },
        customerResponse: { type: "string", description: "Customer's last response or behavior" },
        customerProfile: { type: "object", description: "Customer characteristics and preferences" },
        customerType: { type: "string", description: "Customer industry and profile" },
        messageType: {
          type: "string",
          enum: ["follow_up", "quote_follow_up", "check_in", "closing_attempt", "urgent_response", "value_reinforcement"],
          description: "Type of next message planned"
        },
        urgencyLevel: { type: "string", enum: ["low", "medium", "high"], description: "Business urgency" },
        timingAnalysis: {
          type: "object",
          properties: {
            responsePatterns: { type: "boolean", default: true },
            industryTiming: { type: "boolean", default: true },
            personalPreferences: { type: "boolean", default: true },
            businessCycles: { type: "boolean", default: true },
            competitivePressure: { type: "boolean", default: true }
          }
        }
      },
      required: ["lastInteraction", "customerResponse", "messageType"]
    }
  },

  // ==========================================
  // CUSTOMER INTELLIGENCE TOOLS (NEW)
  // ==========================================

  {
    name: "analyze_customer_personality",
    description: "Deep AI analysis of customer personality and communication style",
    inputSchema: {
      type: "object",
      properties: {
        communicationSamples: { type: "array", description: "Customer's messages for analysis" },
        responsePatterns: { type: "object", description: "How customer typically responds" },
        decisionMakingStyle: { type: "string", description: "Observed decision patterns" },
        industryContext: { type: "string", description: "Industry context for personality norms" },
        analysisAreas: {
          type: "object",
          properties: {
            communicationStyle: { type: "boolean", default: true },
            decisionFactors: { type: "boolean", default: true },
            riskTolerance: { type: "boolean", default: true },
            informationProcessing: { type: "boolean", default: true },
            relationshipPreference: { type: "boolean", default: true },
            pressureResponse: { type: "boolean", default: true }
          }
        }
      },
      required: ["communicationSamples"]
    }
  },

  {
    name: "match_communication_style",
    description: "AI-powered communication style optimization for specific customer personality",
    inputSchema: {
      type: "object",
      properties: {
        customerPersonality: { type: "object", description: "Customer personality analysis" },
        messageObjective: { type: "string", description: "What you want to achieve" },
        currentApproach: { type: "string", description: "Current communication approach" },
        previousApproaches: { type: "array", description: "What's been tried before and results" },
        situationContext: { type: "string", description: "Current situation context" },
        optimizationFocus: {
          type: "object",
          properties: {
            messageStyle: { type: "boolean", default: true },
            informationDepth: { type: "boolean", default: true },
            persuasionApproach: { type: "boolean", default: true },
            relationshipBuilding: { type: "boolean", default: true },
            decisionSupport: { type: "boolean", default: true }
          }
        }
      },
      required: ["customerPersonality", "messageObjective"]
    }
  },

  // ==========================================
  // AUTOMATIC LEARNING TOOLS (NEW)
  // ==========================================

  {
    name: "auto_learn_from_outcome",
    description: "Automatic learning and optimization from every conversation outcome",
    inputSchema: {
      type: "object",
      properties: {
        conversationId: { type: "string", description: "Conversation to learn from" },
        actualOutcome: { 
          type: "string",
          enum: ["deal_closed", "follow_up_scheduled", "objection_raised", "lost_deal", "no_response", "escalated", "postponed"],
          description: "What actually happened"
        },
        predictedOutcome: { type: "string", description: "What AI originally predicted" },
        surpriseFactors: { type: "array", description: "Unexpected elements in conversation" },
        successFactors: { type: "array", description: "What contributed to success/failure" },
        learningScope: {
          type: "object",
          properties: {
            responseOptimization: { type: "boolean", default: true },
            predictionImprovement: { type: "boolean", default: true },
            patternUpdates: { type: "boolean", default: true },
            strategyRefinement: { type: "boolean", default: true },
            marketIntelligence: { type: "boolean", default: true }
          }
        }
      },
      required: ["conversationId", "actualOutcome"]
    }
  },

  {
    name: "optimize_sales_strategy",
    description: "AI-powered continuous optimization of sales strategies based on performance",
    inputSchema: {
      type: "object",
      properties: {
        marketerId: { type: "string", description: "Marketer to optimize for" },
        timeframe: { type: "string", description: "Period to analyze" },
        performanceData: { type: "object", description: "Recent performance metrics" },
        focusArea: {
          type: "string",
          enum: ["response_rate", "conversion_rate", "deal_size", "speed_to_close", "customer_satisfaction", "objection_handling", "overall_performance"],
          description: "What metric to optimize"
        },
        optimizationDepth: {
          type: "string",
          enum: ["surface", "standard", "deep", "comprehensive"],
          default: "comprehensive"
        },
        includeAnalysis: {
          type: "object",
          properties: {
            approachEffectiveness: { type: "boolean", default: true },
            messagingOptimization: { type: "boolean", default: true },
            timingImprovements: { type: "boolean", default: true },
            personalityMatching: { type: "boolean", default: true },
            competitivePositioning: { type: "boolean", default: true }
          }
        }
      },
      required: ["marketerId", "focusArea"]
    }
  },

  // ==========================================
  // MARKET INTELLIGENCE TOOLS (NEW)
  // ==========================================

  {
    name: "generate_market_intelligence",
    description: "Advanced AI-powered market analysis and competitive intelligence",
    inputSchema: {
      type: "object",
      properties: {
        industry: { type: "string", description: "Industry to analyze" },
        timeframe: { type: "string", description: "Time period for analysis" },
        competitorData: { type: "array", description: "Known competitor information" },
        customerFeedback: { type: "array", description: "Customer feedback about market" },
        pricingIntelligence: { type: "array", description: "Price-related customer feedback" },
        analysisScope: {
          type: "object",
          properties: {
            trendAnalysis: { type: "boolean", default: true },
            competitiveMapping: { type: "boolean", default: true },
            opportunityIdentification: { type: "boolean", default: true },
            riskAssessment: { type: "boolean", default: true },
            strategicRecommendations: { type: "boolean", default: true }
          }
        },
        insightDepth: {
          type: "string",
          enum: ["summary", "detailed", "comprehensive", "strategic"],
          default: "comprehensive"
        }
      },
      required: ["industry"]
    }
  },

  {
    name: "track_competitive_mentions",
    description: "Real-time tracking and analysis of competitor mentions in conversations",
    inputSchema: {
      type: "object",
      properties: {
        conversationData: { type: "object", description: "Conversation containing competitor mention" },
        competitorName: { type: "string", description: "Mentioned competitor" },
        mentionContext: { type: "string", description: "Context of competitor mention" },
        customerSentiment: { type: "string", description: "Customer sentiment toward competitor" },
        analysisScope: {
          type: "object",
          properties: {
            strengthsWeaknesses: { type: "boolean", default: true },
            pricingComparison: { type: "boolean", default: true },
            featureComparison: { type: "boolean", default: true },
            customerPreference: { type: "boolean", default: true },
            counterStrategy: { type: "boolean", default: true }
          }
        }
      },
      required: ["conversationData", "competitorName", "mentionContext"]
    }
  },

  // ==========================================
  // ENHANCED LEARNING MANAGEMENT
  // ==========================================

  {
    name: "contribute_success_intelligence",
    description: "Advanced success story contribution with AI pattern extraction",
    inputSchema: {
      type: "object",
      properties: {
        successType: {
          type: "string",
          enum: ["objection_overcome", "quick_close", "large_deal", "difficult_customer", "industry_breakthrough", "competitive_win", "relationship_save"],
          description: "Type of success to share"
        },
        detailedApproach: { type: "object", description: "Detailed approach that worked" },
        situationContext: { type: "object", description: "Complete situation context" },
        customerProfile: { type: "object", description: "Anonymized customer characteristics" },
        outcome: { type: "object", description: "Detailed results achieved" },
        competitiveContext: { type: "string", description: "Competitive situation if relevant" },
        aiExtraction: {
          type: "object",
          properties: {
            patternRecognition: { type: "boolean", default: true },
            successFactors: { type: "boolean", default: true },
            replicability: { type: "boolean", default: true },
            marketApplicability: { type: "boolean", default: true }
          }
        },
        reusable: { type: "boolean", default: true, description: "Whether this strategy can be replicated" }
      },
      required: ["successType", "detailedApproach", "outcome"]
    }
  },

  {
    name: "analyze_failure_patterns",
    description: "AI analysis of failed approaches to prevent future failures",
    inputSchema: {
      type: "object",
      properties: {
        failedApproach: { type: "object", description: "Detailed approach that failed" },
        customerReaction: { type: "object", description: "Complete customer response" },
        situationContext: { type: "object", description: "Full situation context" },
        alternativesTried: { type: "array", description: "Other approaches attempted" },
        rootCauseAnalysis: { type: "boolean", default: true, description: "Perform root cause analysis" },
        preventionStrategy: { type: "boolean", default: true, description: "Generate prevention strategies" },
        lessonsLearned: { type: "string", description: "Key insights and lessons" }
      },
      required: ["failedApproach", "customerReaction"]
    }
  },

  {
    name: "get_comprehensive_intelligence_stats",
    description: "Comprehensive AI-powered statistics and performance analytics",
    inputSchema: {
      type: "object",
      properties: {
        statsType: {
          type: "string",
          enum: ["objection_success_rates", "template_performance", "timing_effectiveness", "industry_insights", "personality_matching", "competitive_analysis", "overall_learning", "predictive_accuracy"],
          description: "Type of statistics to retrieve"
        },
        timeframe: {
          type: "string",
          enum: ["last_week", "last_month", "last_quarter", "all_time"],
          description: "Time period for statistics"
        },
        segmentation: {
          type: "object",
          properties: {
            byIndustry: { type: "boolean", default: false },
            byPersonality: { type: "boolean", default: false },
            byDealSize: { type: "boolean", default: false },
            byCompetitor: { type: "boolean", default: false },
            byMarketer: { type: "boolean", default: false }
          }
        },
        analysisDepth: {
          type: "string",
          enum: ["summary", "detailed", "comprehensive"],
          default: "detailed"
        }
      },
      required: ["statsType"]
    }
  },

  // ==========================================
  // ENHANCED PRIVACY & COMPLIANCE
  // ==========================================

  {
    name: "audit_data_privacy",
    description: "Comprehensive privacy audit with AI compliance verification",
    inputSchema: {
      type: "object",
      properties: {
        auditType: {
          type: "string",
          enum: ["personal_data_check", "shared_data_review", "anonymization_verification", "full_audit", "compliance_check"],
          description: "Type of privacy audit to perform"
        },
        entityId: { type: "string", description: "Specific entity to audit (optional)" },
        complianceStandards: {
          type: "array",
          items: {
            type: "string",
            enum: ["GDPR", "CCPA", "PIPEDA", "general_privacy"]
          },
          description: "Compliance standards to check against"
        },
        auditDepth: {
          type: "string",
          enum: ["basic", "standard", "comprehensive"],
          default: "comprehensive"
        }
      },
      required: ["auditType"]
    }
  },

  {
    name: "intelligently_anonymize_data",
    description: "AI-powered data anonymization with pattern preservation",
    inputSchema: {
      type: "object",
      properties: {
        dataToAnonymize: { type: "object", description: "Data to anonymize" },
        anonymizationLevel: {
          type: "string",
          enum: ["basic", "standard", "aggressive", "pattern_preserving"],
          default: "pattern_preserving"
        },
        preservePatterns: {
          type: "array",
          items: {
            type: "string",
            enum: ["objection_types", "response_strategies", "timing_patterns", "industry_context", "success_indicators", "personality_traits", "communication_styles"]
          },
          description: "What patterns to preserve while anonymizing"
        },
        verifyAnonymization: { type: "boolean", default: true, description: "Verify anonymization effectiveness" }
      },
      required: ["dataToAnonymize"]
    }
  },

  // ==========================================
  // ENHANCED UTILITY TOOLS
  // ==========================================

  {
    name: "get_comprehensive_zone_info",
    description: "Comprehensive information about zones with AI-powered insights",
    inputSchema: {
      type: "object",
      properties: {
        infoType: {
          type: "string",
          enum: ["private_zone_stats", "shared_intelligence_access", "learning_contributions", "performance_metrics", "ai_insights", "all"],
          description: "Type of zone information to retrieve"
        },
        includeAIInsights: { type: "boolean", default: true, description: "Include AI-generated insights" },
        performanceAnalysis: { type: "boolean", default: true, description: "Include performance analysis" },
        optimizationSuggestions: { type: "boolean", default: true, description: "Include optimization suggestions" }
      },
      required: ["infoType"]
    }
  },

  {
    name: "get_time_utc",
    description: "Enhanced time utility with timezone intelligence and optimal timing suggestions",
    inputSchema: {
      type: "object",
      properties: {
        format: {
          type: "string",
          enum: ["iso", "timestamp", "readable", "business_context"],
          description: "Time format to return"
        },
        includeTimingIntel: { type: "boolean", default: false, description: "Include optimal timing intelligence" },
        customerTimezone: { type: "string", description: "Customer timezone for timing optimization" },
        businessContext: { type: "string", description: "Business context for timing suggestions" }
      }
    }
  }
];

// Combine original brain tools + ultimate hybrid learning tools
export const brainTools = [
  ...originalBrainTools,  // Original 32 brain tools
  ...ultimateHybridTools  // 32 ultimate hybrid learning tools
];

export default brainTools;