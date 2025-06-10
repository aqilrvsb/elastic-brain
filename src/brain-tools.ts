// Brain tools list - extracted from original index.ts
export function getBrainToolsList() {
  return [
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
    },    {
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
    },    {
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
    },    {
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
    },    {
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
    },    {
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
    },    {
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
      name: "get_time_utc",
      description: "Get the current UTC time in YYYY-MM-DD hh:mm:ss format",
      inputSchema: {
        type: "object",
        properties: {}
      }
    }
  ];
}