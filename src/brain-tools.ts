// Brain tools list - Complete 32 tools implementation
export function getBrainToolsList() {
  return [
    // ===== CORE MEMORY OPERATIONS (8 tools) =====
    {
      name: "create_entities",
      description: "Create entities in knowledge graph (memory)",
      inputSchema: {
        type: "object",
        properties: {
          entities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {type: "string", description: "Entity name"},
                entityType: {type: "string", description: "Entity type"},
                observations: {type: "array", items: {type: "string"}, description: "Observations about this entity"}
              },
              required: ["name", "entityType"]
            }
          },
          memory_zone: { type: "string", description: "Memory zone to create entities in." }
        },
        required: ["entities", "memory_zone"]
      }
    },
    {
      name: "update_entities",
      description: "Update entities in knowledge graph (memory)",
      inputSchema: {
        type: "object",
        properties: {
          entities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {type: "string"},
                entityType: {type: "string"},
                observations: {type: "array", items: {type: "string"}},
                isImportant: {type: "boolean"}
              },
              required: ["name"]
            }
          },
          memory_zone: { type: "string", description: "Memory zone specifier." }
        },
        required: ["entities", "memory_zone"]
      }
    },
    {
      name: "delete_entities",
      description: "Delete entities from knowledge graph (memory)",
      inputSchema: {
        type: "object",
        properties: {
          names: { type: "array", items: {type: "string"} },
          memory_zone: { type: "string", description: "Memory zone specifier." },
          cascade_relations: { type: "boolean", description: "Whether to delete relations (default: true)", default: true }
        },
        required: ["names", "memory_zone"]
      }
    },
    {
      name: "search_nodes",
      description: "Search entities using ElasticSearch query syntax with AI filtering",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "ElasticSearch query string." },
          informationNeeded: { type: "string", description: "What information you're looking for." },
          reason: { type: "string", description: "Why this information is needed." },
          entityTypes: { type: "array", items: {type: "string"}, description: "Filter to specific entity types." },
          limit: { type: "integer", description: "Max results (default: 20)." },
          sortBy: { type: "string", enum: ["relevance", "recency", "importance"], description: "Sort method." },
          includeObservations: { type: "boolean", description: "Include full observations (default: false).", default: false },
          memory_zone: { type: "string", description: "Limit search to specific zone." }
        },
        required: ["query", "memory_zone", "informationNeeded", "reason"]
      }
    },
    {
      name: "open_nodes",
      description: "Get details about specific entities and their relations",
      inputSchema: {
        type: "object",
        properties: {
          names: { type: "array", items: {type: "string"} },
          memory_zone: { type: "string", description: "Memory zone to retrieve from." }
        },
        required: ["names", "memory_zone"]
      }
    },
    {
      name: "add_observations",
      description: "Add observations to an existing entity",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Entity name" },
          observations: { type: "array", items: {type: "string"} },
          memory_zone: { type: "string", description: "Memory zone." }
        },
        required: ["memory_zone", "name", "observations"]
      }
    },
    {
      name: "mark_important",
      description: "Mark entity as important by boosting relevance score",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Entity name" },
          important: { type: "boolean", description: "Set as important (true) or not (false)" },
          memory_zone: { type: "string", description: "Memory zone." },
          auto_create: { type: "boolean", description: "Auto-create if doesn't exist (default: false)", default: false }
        },
        required: ["memory_zone", "name", "important"]
      }
    },
    {
      name: "get_recent",
      description: "Get recently accessed entities and their relations",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "integer", description: "Max results (default: 20)" },
          includeObservations: { type: "boolean", description: "Include full observations (default: false)", default: false },
          memory_zone: { type: "string", description: "Memory zone." }
        },
        required: ["memory_zone"]
      }
    },

    // ===== RELATIONSHIP MANAGEMENT (3 tools) =====
    {
      name: "create_relations",
      description: "Create relationships between entities in knowledge graph (memory)",
      inputSchema: {
        type: "object",
        properties: {
          relations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                from: {type: "string", description: "Source entity name"},
                fromZone: {type: "string", description: "Optional zone for source entity"},
                to: {type: "string", description: "Target entity name"},
                toZone: {type: "string", description: "Optional zone for target entity"},
                type: {type: "string", description: "Relationship type"}
              },
              required: ["from", "to", "type"]
            }
          },
          memory_zone: { type: "string", description: "Default memory zone." },
          auto_create_missing_entities: { type: "boolean", description: "Auto-create missing entities (default: true)", default: true }
        },
        required: ["relations"]
      }
    },
    {
      name: "delete_relations",
      description: "Delete relationships from knowledge graph (memory)",
      inputSchema: {
        type: "object",
        properties: {
          relations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                from: {type: "string"},
                to: {type: "string"},
                type: {type: "string"}
              },
              required: ["from", "to", "type"]
            }
          },
          memory_zone: { type: "string", description: "Optional memory zone." }
        },
        required: ["relations"]
      }
    },
    {
      name: "cross_zone_relations",
      description: "Link knowledge across different memory zones",
      inputSchema: {
        type: "object",
        properties: {
          source_zone: { type: "string", description: "Source memory zone" },
          target_zone: { type: "string", description: "Target memory zone" },
          relation: {
            type: "object",
            properties: {
              from: { type: "string", description: "Source entity name" },
              to: { type: "string", description: "Target entity name" },
              type: { type: "string", description: "Relationship type" }
            },
            required: ["from", "to", "type"]
          }
        },
        required: ["source_zone", "target_zone", "relation"]
      }
    },

    // ===== MEMORY ZONE MANAGEMENT (8 tools) =====
    {
      name: "list_zones",
      description: "List all available memory zones with metadata",
      inputSchema: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Reason for listing zones for AI filtering." }
        }
      }
    },
    {
      name: "create_zone",
      description: "Create a new memory zone",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Zone name (cannot be 'default')" },
          shortDescription: { type: "string", description: "Short description." },
          description: { type: "string", description: "Full detailed description." }
        },
        required: ["name"]
      }
    },
    {
      name: "delete_zone",
      description: "Delete a memory zone and all its entities/relations",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Zone name (cannot be 'default')" },
          confirm: { type: "boolean", description: "Confirmation flag, must be true", default: false }
        },
        required: ["name", "confirm"]
      }
    },
    {
      name: "copy_entities",
      description: "Copy entities between zones with optional relations",
      inputSchema: {
        type: "object",
        properties: {
          names: { type: "array", items: { type: "string" } },
          source_zone: { type: "string" },
          target_zone: { type: "string" },
          copy_relations: { type: "boolean", default: true },
          overwrite: { type: "boolean", default: false }
        },
        required: ["names", "source_zone", "target_zone"]
      }
    },
    {
      name: "move_entities",
      description: "Move entities between zones (copy + delete from source)",
      inputSchema: {
        type: "object",
        properties: {
          names: { type: "array", items: { type: "string" } },
          source_zone: { type: "string" },
          target_zone: { type: "string" },
          move_relations: { type: "boolean", default: true },
          overwrite: { type: "boolean", default: false }
        },
        required: ["names", "source_zone", "target_zone"]
      }
    },
    {
      name: "merge_zones",
      description: "Merge multiple zones with conflict resolution",
      inputSchema: {
        type: "object",
        properties: {
          source_zones: { type: "array", items: { type: "string" } },
          target_zone: { type: "string" },
          delete_source_zones: { type: "boolean", default: false },
          overwrite_conflicts: { type: "string", enum: ["skip", "overwrite", "rename"], default: "skip" }
        },
        required: ["source_zones", "target_zone"]
      }
    },
    {
      name: "zone_stats",
      description: "Get statistics for entities and relationships in a zone",
      inputSchema: {
        type: "object",
        properties: {
          zone: { type: "string", description: "Zone name (omit for default zone)" }
        },
        required: ["zone"]
      }
    },
    {
      name: "zone_isolation",
      description: "Secure multi-tenant operation with isolated memory zones",
      inputSchema: {
        type: "object",
        properties: {
          check_isolation: { type: "boolean", description: "Check current isolation status", default: true }
        }
      }
    },

    // ===== AI-POWERED INTELLIGENCE (4 tools) =====
    {
      name: "inspect_knowledge_graph",
      description: "Agent driven knowledge graph inspection that uses AI to retrieve relevant entities and relations based on a query.",
      inputSchema: {
        type: "object",
        properties: {
          information_needed: { type: "string", description: "Full description of what information is needed from the knowledge graph." },
          reason: { type: "string", description: "Explain why this information is needed." },
          include_entities: { type: "boolean", description: "Whether to include full entity details (default: false)" },
          include_relations: { type: "boolean", description: "Whether to include entity relations (default: false)" },
          keywords: { type: "array", items: { type: "string" }, description: "Keywords for targeting entities." },
          memory_zone: { type: "string", description: "Memory zone to search in." },
          entity_types: { type: "array", items: { type: "string" }, description: "Filter to specific entity types" }
        },
        required: ["information_needed", "keywords"]
      }
    },
    {
      name: "inspect_files",
      description: "Agent driven file inspection that uses AI to retrieve relevant content from multiple files.",
      inputSchema: {
        type: "object",
        properties: {
          file_paths: {
            type: "array",
            items: { type: "string" },
            description: "Paths to the files (or directories) to inspect"
          },
          information_needed: {
            type: "string",
            description: "Full description of what information is needed from the files, including the context of the information needed."
          },
          reason: {
            type: "string",
            description: "Explain why this information is needed to help the AI agent give better results."
          },
          include_lines: {
            type: "boolean",
            description: "Whether to include the actual line content in the response (default: false)"
          },
          keywords: {
            type: "array",
            items: { type: "string" },
            description: "Array of specific keywords related to the information needed."
          }
        },
        required: ["file_paths", "information_needed", "include_lines", "keywords"]
      }
    },
    {
      name: "smart_search_ranking",
      description: "AI-powered search with relevance-based ranking and intelligent scoring",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          information_needed: { type: "string", description: "What information is needed" },
          reason: { type: "string", description: "Reason for the search" },
          memory_zone: { type: "string", description: "Memory zone to search" },
          limit: { type: "integer", description: "Max results (default: 10)", default: 10 }
        },
        required: ["query", "information_needed", "reason"]
      }
    },
    {
      name: "context_aware_retrieval",
      description: "Conversational memory with context-aware retrieval based on conversation history",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          information_needed: { type: "string", description: "What information is needed" },
          reason: { type: "string", description: "Reason for the search" },
          conversation_context: { 
            type: "array", 
            items: {
              type: "object",
              properties: {
                role: { type: "string" },
                content: { type: "string" }
              }
            },
            description: "Previous conversation messages for context"
          },
          memory_zone: { type: "string", description: "Memory zone to search" },
          limit: { type: "integer", description: "Max results (default: 15)", default: 15 }
        },
        required: ["query", "information_needed", "reason"]
      }
    },

    // ===== SALES INTELLIGENCE EXTENSIONS (9 tools) =====
    {
      name: "customer_profiling",
      description: "Store and manage customer information with sales-specific data structure",
      inputSchema: {
        type: "object",
        properties: {
          customer_data: {
            type: "object",
            properties: {
              name: { type: "string" },
              company: { type: "string" },
              industry: { type: "string" },
              budget: { type: "number" },
              contact_method: { type: "string" },
              sales_stage: { type: "string" },
              lead_source: { type: "string" },
              priority_score: { type: "number" },
              notes: { type: "array", items: { type: "string" } }
            },
            required: ["name"]
          },
          memory_zone: { type: "string", description: "Memory zone for customer data" }
        },
        required: ["customer_data"]
      }
    },
    {
      name: "conversation_analysis",
      description: "Track and analyze WhatsApp conversation history for sales intelligence",
      inputSchema: {
        type: "object",
        properties: {
          conversation_data: {
            type: "object",
            properties: {
              customer_name: { type: "string" },
              channel: { type: "string" },
              sentiment: { type: "string" },
              topics: { type: "array", items: { type: "string" } },
              outcome: { type: "string" },
              next_steps: { type: "string" },
              message_content: { type: "string" }
            },
            required: ["customer_name", "message_content"]
          },
          memory_zone: { type: "string", description: "Memory zone for conversation data" }
        },
        required: ["conversation_data"]
      }
    },
    {
      name: "objection_handling",
      description: "Learn from sales interactions and store effective objection handling strategies",
      inputSchema: {
        type: "object",
        properties: {
          objection_data: {
            type: "object",
            properties: {
              type: { type: "string" },
              concern: { type: "string" },
              response: { type: "string" },
              outcome: { type: "string" },
              effectiveness: { type: "number", minimum: 1, maximum: 10 },
              context: { type: "string" },
              customer_segment: { type: "string" }
            },
            required: ["type", "concern", "response", "effectiveness"]
          },
          memory_zone: { type: "string", description: "Memory zone for objection data" }
        },
        required: ["objection_data"]
      }
    },
    {
      name: "pattern_recognition",
      description: "Identify successful sales strategies and patterns from historical data",
      inputSchema: {
        type: "object",
        properties: {
          analysis_type: { type: "string", enum: ["success_patterns", "failure_patterns", "customer_segments"], default: "success_patterns" },
          memory_zone: { type: "string", description: "Memory zone to analyze" }
        }
      }
    },
    {
      name: "conversion_tracking",
      description: "Monitor sales performance and conversion rates across the pipeline",
      inputSchema: {
        type: "object",
        properties: {
          tracking_period: { type: "string", enum: ["daily", "weekly", "monthly"], default: "monthly" },
          memory_zone: { type: "string", description: "Memory zone to analyze" }
        }
      }
    },
    {
      name: "response_suggestions",
      description: "AI-powered recommendations for customer responses based on history and context",
      inputSchema: {
        type: "object",
        properties: {
          customer_name: { type: "string", description: "Customer name for personalized suggestions" },
          context: {
            type: "object",
            properties: {
              concern: { type: "string" },
              topic: { type: "string" },
              budget: { type: "string" },
              urgency: { type: "string" }
            }
          },
          memory_zone: { type: "string", description: "Memory zone to search for context" }
        },
        required: ["customer_name", "context"]
      }
    },
    {
      name: "lead_scoring",
      description: "Prioritize prospects using AI-powered lead scoring algorithm",
      inputSchema: {
        type: "object",
        properties: {
          lead_data: {
            type: "object",
            properties: {
              name: { type: "string" },
              budget: { type: "number" },
              industry: { type: "string" },
              company_size: { type: "number" },
              engagement_level: { type: "number", minimum: 1, maximum: 10 },
              urgency: { type: "number", minimum: 1, maximum: 10 },
              lead_source: { type: "string" }
            },
            required: ["name"]
          },
          memory_zone: { type: "string", description: "Memory zone for lead data" }
        },
        required: ["lead_data"]
      }
    },
    {
      name: "pipeline_management",
      description: "Track deal progression through sales pipeline stages",
      inputSchema: {
        type: "object",
        properties: {
          analysis_type: { type: "string", enum: ["pipeline_overview", "stage_analysis", "forecasting"], default: "pipeline_overview" },
          memory_zone: { type: "string", description: "Memory zone to analyze" }
        }
      }
    },
    {
      name: "performance_analytics",
      description: "Generate comprehensive sales intelligence dashboards and metrics",
      inputSchema: {
        type: "object",
        properties: {
          timeframe: { type: "number", description: "Analysis timeframe in days (default: 30)", default: 30 },
          metrics: { 
            type: "array", 
            items: { type: "string" },
            description: "Specific metrics to include",
            default: ["conversations", "customers", "objections", "performance"]
          },
          memory_zone: { type: "string", description: "Memory zone to analyze" }
        }
      }
    },

    // ===== UTILITY TOOLS (1 tool) =====
    {
      name: "get_time_utc",
      description: "Get the current UTC time in multiple formats",
      inputSchema: {
        type: "object",
        properties: {
          format: { type: "string", enum: ["iso", "timestamp", "formatted"], default: "iso" }
        }
      }
    },

    // ==========================================
    // CSV CONVERSATION IMPORT TOOL (NEW!)
    // ==========================================
    {
      name: "import_csv_conversations",
      description: "Import and learn from CSV conversation data to enhance all 35 AI tools",
      inputSchema: {
        type: "object",
        properties: {
          csvData: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id_staff: { type: "string", description: "Staff ID (e.g., RV-003, SCAQL-S06)" },
                prospect_num: { type: "string", description: "Customer phone number" },
                prospect_nama: { type: "string", description: "Customer name" },
                stage: { type: "string", description: "Conversation stage" },
                date_order: { type: "string", description: "Date of conversation" },
                conversation: { type: "string", description: "Full conversation with USER: and BOT: prefixes" },
                niche: { type: "string", description: "Product niche (VITAC, EXAMA, etc.)" }
              },
              required: ["id_staff", "prospect_nama", "conversation", "niche"]
            },
            description: "Array of conversation data from CSV"
          },
          targetNiche: {
            type: "string",
            description: "Focus on specific niche (optional, processes all niches if not specified)"
          },
          processingMode: {
            type: "string",
            enum: ["analysis_only", "full_import", "incremental"],
            description: "Processing mode - analysis_only for testing, full_import for complete learning",
            default: "full_import"
          }
        },
        required: ["csvData"]
      }
    }
  ];
}