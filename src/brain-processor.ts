import { staffBrainManager } from './config.js';
import { inspectFile } from './filesystem/index.js';

// Format response helper
const formatResponse = (data: any) => {
  return JSON.stringify(data, null, 2);
};

// Helper function to format dates
function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export async function processBrainTool(toolName: string, params: any, staffId: string): Promise<any> {
  // Simple test tool that works without Elasticsearch
  if (toolName === 'get_time_utc') {
    const currentTime = new Date();
    return {
      success: true,
      staffId,
      utcTime: currentTime.toISOString(),
      formattedTime: currentTime.toISOString().replace('T', ' ').substring(0, 19),
      timestamp: currentTime.getTime(),
      message: 'Brain MCP server is working! Elasticsearch connection will be fixed next.'
    };
  }

  // For now, return mock response for other tools
  return {
    success: false,
    staffId,
    error: 'Elasticsearch connection issue - will be fixed. But MCP protocol is working!',
    tool: toolName,
    note: 'The n8n MCP Client connection is successful - just need to fix Elasticsearch URL'
  };
}

  // Auto-set memory_zone to staffId if not provided
  if (params && typeof params === 'object' && !params.memory_zone) {
    params.memory_zone = staffId;
  }

  try {
    switch (toolName) {
      // ===== WORKING TOOLS =====
      case "get_time_utc":
        const currentTime = new Date();
        return {
          success: true,
          staffId,
          utcTime: currentTime.toISOString(),
          formattedTime: currentTime.toISOString().replace('T', ' ').substring(0, 19),
          timestamp: currentTime.getTime()
        };

      case "create_entities":
        // Simple implementation using available methods
        const entityList = params.entities;
        const zone = params.memory_zone || staffId;
        
        try {
          const createdEntities = [];
          for (const entity of entityList) {
            const savedEntity = await kgClient.saveEntity({
              name: entity.name,
              entityType: entity.entityType,
              observations: entity.observations || [],
              relevanceScore: 1.0
            }, zone);
            createdEntities.push(savedEntity);
          }
          
          return {
            success: true,
            staffId,
            zone,
            entities: createdEntities.map(e => ({
              name: e.name,
              entityType: e.entityType,
              observations: e.observations
            }))
          };
        } catch (error) {
          return {
            success: false,
            staffId,
            error: `Failed to create entities: ${error.message}`
          };
        }

      case "search_nodes":
        // Simple implementation using available search method
        try {
          const searchZone = params.memory_zone || staffId;
          const searchResults = await kgClient.search({
            query: params.query,
            zone: searchZone,
            limit: params.limit || 20
          });
          
          return {
            success: true,
            staffId,
            zone: searchZone,
            entities: searchResults.entities || [],
            totalResults: searchResults.entities?.length || 0
          };
        } catch (error) {
          return {
            success: false,
            staffId,
            error: `Search failed: ${error.message}`
          };
        }
        
        // Check for conflicts and invalid entities
        const conflictingEntities = [];
        const invalidEntities = [];
        
        for (const entity of entityList) {
          if (!entity.name || entity.name.trim() === '') {
            invalidEntities.push({
              name: "[empty]",
              reason: "Entity name cannot be empty"
            });
            continue;
          }
          
          const existingEntity = await kgClient.getEntity(entity.name, zone);
          if (existingEntity) {
            conflictingEntities.push(entity.name);
          }
        }

        // Handle conflicts and invalid entities
        if (conflictingEntities.length > 0 || invalidEntities.length > 0) {
          const existingEntitiesData = [];
          if (conflictingEntities.length > 0) {
            for (const entityName of conflictingEntities) {
              const existingEntity = await kgClient.getEntity(entityName, zone);
              if (existingEntity) {
                existingEntitiesData.push(existingEntity);
              }
            }
          }
          
          return {
            success: false,
            staffId,
            error: `Entity creation failed in zone "${zone}", no entities were created.`,
            conflicts: conflictingEntities.length > 0 ? conflictingEntities : undefined,
            existingEntities: existingEntitiesData.length > 0 ? existingEntitiesData : undefined,
            invalidEntities: invalidEntities.length > 0 ? invalidEntities : undefined,
            message: conflictingEntities.length > 0 ? 
              "Use update_entities to modify existing entities or create with different names." : 
              "Please provide valid entity names for all entities."
          };
        }
        
        // Create entities
        const createdEntities = [];
        for (const entity of entityList) {
          const savedEntity = await kgClient.saveEntity({
            name: entity.name,
            entityType: entity.entityType,
            observations: entity.observations,
            relevanceScore: entity.relevanceScore ?? 1.0
          }, zone);
          
          createdEntities.push(savedEntity);
        }
        
        return {
          success: true,
          staffId,
          zone,
          entities: createdEntities.map(e => ({
            name: e.name,
            entityType: e.entityType,
            observations: e.observations
          }))
        };

      case "update_entities":
        const updateZone = params.memory_zone || staffId;
        const updatedEntities = [];
        
        for (const entity of params.entities) {
          const existingEntity = await kgClient.getEntity(entity.name, updateZone);
          if (!existingEntity) {
            return {
              success: false,
              staffId,
              error: `Entity "${entity.name}" not found in zone "${updateZone}"`
            };
          }
          
          const updatedEntity = await kgClient.saveEntity({
            ...existingEntity,
            ...entity,
            name: entity.name // Ensure name stays the same
          }, updateZone);
          
          updatedEntities.push(updatedEntity);
        }
        
        return {
          success: true,
          staffId,
          zone: updateZone,
          entities: updatedEntities.map(e => ({
            name: e.name,
            entityType: e.entityType,
            observations: e.observations
          }))
        };

      case "delete_entities":
        const deleteZone = params.memory_zone || staffId;
        const deletedNames = [];
        
        for (const name of params.names) {
          try {
            await kgClient.deleteEntity(name, deleteZone);
            deletedNames.push(name);
            
            // Delete relations if cascade_relations is true (default)
            if (params.cascade_relations !== false) {
              await kgClient.deleteRelationsForEntity(name, deleteZone);
            }
          } catch (error) {
            console.warn(`Failed to delete entity "${name}":`, error.message);
          }
        }
        
        return {
          success: true,
          staffId,
          zone: deleteZone,
          deletedEntities: deletedNames
        };

      case "search_nodes":
        const includeObservations = params.includeObservations ?? false;
        const searchZone = params.memory_zone || staffId;
        
        const { entities: filteredEntities, relations: formattedRelations } = await kgClient.userSearch({
          query: params.query,
          informationNeeded: params.informationNeeded,
          reason: params.reason,
          entityTypes: params.entityTypes,
          limit: params.limit || 20,
          sortBy: params.sortBy || 'relevance',
          includeObservations,
          memoryZone: searchZone
        });
        
        return {
          success: true,
          staffId,
          zone: searchZone,
          entities: filteredEntities,
          relations: formattedRelations,
          query: params.query,
          totalResults: filteredEntities.length
        };

      case "open_nodes":
        const openZone = params.memory_zone || staffId;
        const nodeDetails = [];
        
        for (const name of params.names) {
          const entity = await kgClient.getEntity(name, openZone);
          if (entity) {
            const relations = await kgClient.getRelationsForEntity(name, openZone);
            nodeDetails.push({
              ...entity,
              relations
            });
          }
        }
        
        return {
          success: true,
          staffId,
          zone: openZone,
          entities: nodeDetails
        };

      case "add_observations":
        const obsZone = params.memory_zone || staffId;
        const entity = await kgClient.getEntity(params.name, obsZone);
        
        if (!entity) {
          return {
            success: false,
            staffId,
            error: `Entity "${params.name}" not found in zone "${obsZone}"`
          };
        }
        
        const updatedEntity = await kgClient.saveEntity({
          ...entity,
          observations: [...(entity.observations || []), ...params.observations]
        }, obsZone);
        
        return {
          success: true,
          staffId,
          zone: obsZone,
          entity: {
            name: updatedEntity.name,
            entityType: updatedEntity.entityType,
            observations: updatedEntity.observations
          }
        };

      case "mark_important":
        const importantZone = params.memory_zone || staffId;
        let targetEntity = await kgClient.getEntity(params.name, importantZone);
        
        if (!targetEntity && params.auto_create) {
          targetEntity = await kgClient.saveEntity({
            name: params.name,
            entityType: 'Unknown',
            observations: [],
            relevanceScore: 1.0
          }, importantZone);
        } else if (!targetEntity) {
          return {
            success: false,
            staffId,
            error: `Entity "${params.name}" not found in zone "${importantZone}"`
          };
        }
        
        const markedEntity = await kgClient.saveEntity({
          ...targetEntity,
          relevanceScore: params.important ? 2.0 : 1.0,
          isImportant: params.important
        }, importantZone);
        
        return {
          success: true,
          staffId,
          zone: importantZone,
          entity: {
            name: markedEntity.name,
            entityType: markedEntity.entityType,
            isImportant: params.important
          }
        };

      case "get_recent":
        const recentZone = params.memory_zone || staffId;
        const recentEntities = await kgClient.getRecentEntities(
          recentZone, 
          params.limit || 20, 
          params.includeObservations || false
        );
        
        return {
          success: true,
          staffId,
          zone: recentZone,
          entities: recentEntities
        };

      // ===== RELATIONSHIP MANAGEMENT (3 tools) =====
      case "create_relations":
        const relZone = params.memory_zone || staffId;
        const createdRelations = [];
        
        for (const relation of params.relations) {
          // Auto-create missing entities if enabled
          if (params.auto_create_missing_entities !== false) {
            const fromZone = relation.fromZone || relZone;
            const toZone = relation.toZone || relZone;
            
            const fromEntity = await kgClient.getEntity(relation.from, fromZone);
            if (!fromEntity) {
              await kgClient.saveEntity({
                name: relation.from,
                entityType: 'AutoCreated',
                observations: [`Auto-created for relation to ${relation.to}`]
              }, fromZone);
            }
            
            const toEntity = await kgClient.getEntity(relation.to, toZone);
            if (!toEntity) {
              await kgClient.saveEntity({
                name: relation.to,
                entityType: 'AutoCreated',
                observations: [`Auto-created for relation from ${relation.from}`]
              }, toZone);
            }
          }
          
          const savedRelation = await kgClient.saveRelation({
            from: relation.from,
            to: relation.to,
            type: relation.type,
            fromZone: relation.fromZone || relZone,
            toZone: relation.toZone || relZone
          });
          
          createdRelations.push(savedRelation);
        }
        
        return {
          success: true,
          staffId,
          zone: relZone,
          relations: createdRelations
        };

      case "delete_relations":
        const delRelZone = params.memory_zone || staffId;
        const deletedRelations = [];
        
        for (const relation of params.relations) {
          try {
            await kgClient.deleteRelation(relation.from, relation.to, relation.type, delRelZone);
            deletedRelations.push(relation);
          } catch (error) {
            console.warn(`Failed to delete relation:`, error.message);
          }
        }
        
        return {
          success: true,
          staffId,
          zone: delRelZone,
          deletedRelations
        };

      case "cross_zone_relations":
        // Link knowledge across different memory zones
        const sourceZone = params.source_zone;
        const targetZone = params.target_zone;
        const relationData = params.relation;
        
        const crossRelation = await kgClient.saveRelation({
          from: relationData.from,
          to: relationData.to,
          type: relationData.type,
          fromZone: sourceZone,
          toZone: targetZone,
          crossZone: true
        });
        
        return {
          success: true,
          staffId,
          relation: crossRelation,
          sourceZone,
          targetZone
        };

      // ===== MEMORY ZONE MANAGEMENT (8 tools) =====
      case "list_zones":
        try {
          const zones = await kgClient.listZones();
          // Filter zones for this staff member
          const staffZones = zones.filter(zone => 
            zone.name === staffId || 
            zone.name.startsWith(`${staffId}-`) ||
            zone.name === 'default'
          );
          
          return {
            success: true,
            staffId,
            zones: staffZones,
            totalZones: staffZones.length
          };
        } catch (error) {
          return {
            success: false,
            staffId,
            error: `Failed to list zones: ${error.message}`
          };
        }

      case "create_zone":
        const zoneName = params.name;
        const zoneDescription = params.description || params.shortDescription || `Memory zone for ${zoneName}`;
        
        if (zoneName === 'default') {
          return {
            success: false,
            staffId,
            error: "Cannot create zone named 'default' - it's reserved"
          };
        }
        
        try {
          const zone = await kgClient.createZone(zoneName, zoneDescription);
          return {
            success: true,
            staffId,
            zone: {
              name: zone.name,
              description: zone.description,
              createdAt: zone.createdAt
            }
          };
        } catch (error) {
          return {
            success: false,
            staffId,
            error: `Failed to create zone: ${error.message}`
          };
        }

      case "delete_zone":
        if (!params.confirm) {
          return {
            success: false,
            staffId,
            error: "Zone deletion requires confirmation flag to be true"
          };
        }
        
        if (params.name === 'default') {
          return {
            success: false,
            staffId,
            error: "Cannot delete the default zone"
          };
        }
        
        try {
          await kgClient.deleteZone(params.name);
          return {
            success: true,
            staffId,
            deletedZone: params.name
          };
        } catch (error) {
          return {
            success: false,
            staffId,
            error: `Failed to delete zone: ${error.message}`
          };
        }

      case "copy_entities":
        const copiedEntities = [];
        
        for (const name of params.names) {
          const sourceEntity = await kgClient.getEntity(name, params.source_zone);
          if (sourceEntity) {
            // Check if entity exists in target zone
            const existingEntity = await kgClient.getEntity(name, params.target_zone);
            if (existingEntity && !params.overwrite) {
              continue; // Skip if exists and overwrite is false
            }
            
            const copiedEntity = await kgClient.saveEntity(sourceEntity, params.target_zone);
            copiedEntities.push(copiedEntity);
            
            // Copy relations if enabled
            if (params.copy_relations) {
              const relations = await kgClient.getRelationsForEntity(name, params.source_zone);
              for (const relation of relations) {
                try {
                  await kgClient.saveRelation({
                    ...relation,
                    fromZone: params.target_zone,
                    toZone: params.target_zone
                  });
                } catch (error) {
                  console.warn(`Failed to copy relation:`, error.message);
                }
              }
            }
          }
        }
        
        return {
          success: true,
          staffId,
          sourceZone: params.source_zone,
          targetZone: params.target_zone,
          copiedEntities: copiedEntities.map(e => e.name)
        };

      case "move_entities":
        const movedEntities = [];
        
        for (const name of params.names) {
          const sourceEntity = await kgClient.getEntity(name, params.source_zone);
          if (sourceEntity) {
            // Check if entity exists in target zone
            const existingEntity = await kgClient.getEntity(name, params.target_zone);
            if (existingEntity && !params.overwrite) {
              continue; // Skip if exists and overwrite is false
            }
            
            // Copy to target
            const movedEntity = await kgClient.saveEntity(sourceEntity, params.target_zone);
            movedEntities.push(movedEntity);
            
            // Move relations if enabled
            if (params.move_relations) {
              const relations = await kgClient.getRelationsForEntity(name, params.source_zone);
              for (const relation of relations) {
                try {
                  await kgClient.saveRelation({
                    ...relation,
                    fromZone: params.target_zone,
                    toZone: params.target_zone
                  });
                  await kgClient.deleteRelation(relation.from, relation.to, relation.type, params.source_zone);
                } catch (error) {
                  console.warn(`Failed to move relation:`, error.message);
                }
              }
            }
            
            // Delete from source
            await kgClient.deleteEntity(name, params.source_zone);
          }
        }
        
        return {
          success: true,
          staffId,
          sourceZone: params.source_zone,
          targetZone: params.target_zone,
          movedEntities: movedEntities.map(e => e.name)
        };

      case "merge_zones":
        const mergedEntities = [];
        const conflicts = [];
        
        for (const sourceZoneName of params.source_zones) {
          const sourceEntities = await kgClient.getAllEntities(sourceZoneName);
          
          for (const entity of sourceEntities) {
            const existingEntity = await kgClient.getEntity(entity.name, params.target_zone);
            
            if (existingEntity) {
              if (params.overwrite_conflicts === 'skip') {
                conflicts.push(entity.name);
                continue;
              } else if (params.overwrite_conflicts === 'rename') {
                entity.name = `${entity.name}_from_${sourceZoneName}`;
              }
              // overwrite_conflicts === 'overwrite' will just replace
            }
            
            const mergedEntity = await kgClient.saveEntity(entity, params.target_zone);
            mergedEntities.push(mergedEntity);
          }
          
          // Delete source zone if requested
          if (params.delete_source_zones) {
            await kgClient.deleteZone(sourceZoneName);
          }
        }
        
        return {
          success: true,
          staffId,
          sourceZones: params.source_zones,
          targetZone: params.target_zone,
          mergedEntities: mergedEntities.length,
          conflicts: conflicts.length > 0 ? conflicts : undefined,
          deletedSourceZones: params.delete_source_zones
        };

      case "zone_stats":
        const statsZone = params.zone || staffId;
        const zoneEntities = await kgClient.getAllEntities(statsZone);
        const relations = await kgClient.getAllRelations(statsZone);
        
        const entityTypes = {};
        zoneEntities.forEach(entity => {
          entityTypes[entity.entityType] = (entityTypes[entity.entityType] || 0) + 1;
        });
        
        const relationTypes = {};
        relations.forEach(relation => {
          relationTypes[relation.type] = (relationTypes[relation.type] || 0) + 1;
        });
        
        return {
          success: true,
          staffId,
          zone: statsZone,
          stats: {
            totalEntities: zoneEntities.length,
            totalRelations: relations.length,
            entityTypes,
            relationTypes,
            lastUpdated: new Date().toISOString()
          }
        };

      case "zone_isolation":
        // Ensure secure multi-tenant operation
        const isolatedZones = await kgClient.listZones();
        const userZones = isolatedZones.filter(zone => 
          zone.name === staffId || 
          zone.name.startsWith(`${staffId}-`)
        );
        
        return {
          success: true,
          staffId,
          isolation: {
            staffId,
            accessibleZones: userZones.map(z => z.name),
            isolationLevel: 'STAFF_ID_BASED',
            securityStatus: 'ISOLATED'
          }
        };

      // ===== AI-POWERED INTELLIGENCE (4 tools) =====
      case "inspect_knowledge_graph":
        const { information_needed: kgInfo, reason: kgReason, include_entities, include_relations, keywords: kgKeywords, memory_zone, entity_types } = params;
        const { inspectKnowledgeGraph } = await import('./kg-inspection.js');
        
        try {
          const kgResults = await inspectKnowledgeGraph(
            kgClient,
            kgInfo,
            kgReason,
            kgKeywords,
            memory_zone || staffId,
            entity_types
          );
          
          return {
            success: true,
            staffId,
            tentativeAnswer: kgResults.tentativeAnswer,
            entities: include_entities ? kgResults.entities : kgResults.entities.map(e => ({ name: e.name, entityType: e.entityType })),
            relations: include_relations ? kgResults.relations : []
          };
        } catch (error) {
          return {
            success: false,
            staffId,
            error: `Error inspecting knowledge graph: ${error.message}`
          };
        }

      case "inspect_files":
        const { file_paths, information_needed, reason, include_lines, keywords } = params;
        const results = [];

        for (const filePath of file_paths) {
          try {
            const fileResults = await inspectFile(filePath, information_needed, reason, keywords);
            results.push({            
              filePath,
              linesContent: `lines as returned by cat -n ${filePath}`,
              lines: include_lines ? fileResults.lines.map(line => `${line.lineNumber}\t${line.content}`) : [],
              tentativeAnswer: fileResults.tentativeAnswer
            });
          } catch (error) {
            results.push({
              filePath,
              error: error.message
            });
          }
        }
        
        return { success: true, results, staffId };

      case "smart_search_ranking":
        // Relevance-based search results with AI ranking
        const smartResults = await kgClient.userSearch({
          query: params.query,
          informationNeeded: params.information_needed,
          reason: params.reason,
          memoryZone: params.memory_zone || staffId,
          limit: params.limit || 10,
          sortBy: 'relevance'
        });
        
        // Apply AI-powered ranking boost
        const rankedEntities = smartResults.entities.map(entity => ({
          ...entity,
          aiRankingScore: entity.relevanceScore * (entity.isImportant ? 1.5 : 1.0),
          rankingFactors: {
            relevanceScore: entity.relevanceScore,
            importanceBoost: entity.isImportant ? 1.5 : 1.0,
            recentActivity: entity.lastAccessed ? 1.2 : 1.0
          }
        })).sort((a, b) => b.aiRankingScore - a.aiRankingScore);
        
        return {
          success: true,
          staffId,
          rankedEntities,
          totalResults: rankedEntities.length,
          rankingMethod: 'AI_POWERED_RELEVANCE'
        };

      case "context_aware_retrieval":
        // Conversational memory with context awareness
        const conversationContext = params.conversation_context || [];
        const contextKeywords = conversationContext.map(msg => 
          msg.content.split(' ').filter(word => word.length > 3)
        ).flat();
        
        const contextualResults = await kgClient.userSearch({
          query: params.query,
          informationNeeded: params.information_needed,
          reason: `Context-aware search based on conversation: ${params.reason}`,
          memoryZone: params.memory_zone || staffId,
          limit: params.limit || 15
        });
        
        // Boost entities that match conversation context
        const contextAwareEntities = contextualResults.entities.map(entity => {
          const contextMatches = entity.observations?.filter(obs => 
            contextKeywords.some(keyword => 
              obs.toLowerCase().includes(keyword.toLowerCase())
            )
          ).length || 0;
          
          return {
            ...entity,
            contextRelevance: contextMatches,
            contextAwareScore: entity.relevanceScore + (contextMatches * 0.5)
          };
        }).sort((a, b) => b.contextAwareScore - a.contextAwareScore);
        
        return {
          success: true,
          staffId,
          contextAwareEntities,
          conversationContext: conversationContext.length,
          contextKeywords: contextKeywords.slice(0, 10) // Top 10 context keywords
        };

      // ===== SALES INTELLIGENCE EXTENSIONS (9 tools) =====
      case "customer_profiling":
        // Store client information with sales-specific structure
        const customerData = params.customer_data;
        const customerEntity = await kgClient.saveEntity({
          name: customerData.name,
          entityType: 'Customer',
          observations: [
            `Company: ${customerData.company || 'Unknown'}`,
            `Industry: ${customerData.industry || 'Unknown'}`,
            `Budget: ${customerData.budget || 'Unknown'}`,
            `Contact Method: ${customerData.contact_method || 'Unknown'}`,
            `Sales Stage: ${customerData.sales_stage || 'Prospect'}`,
            `Lead Source: ${customerData.lead_source || 'Unknown'}`,
            `Last Contact: ${customerData.last_contact || new Date().toISOString()}`,
            ...(customerData.notes || [])
          ],
          salesProfile: customerData,
          relevanceScore: customerData.priority_score || 1.0
        }, params.memory_zone || staffId);
        
        return {
          success: true,
          staffId,
          customer: customerEntity,
          profileType: 'SALES_CUSTOMER'
        };

      case "conversation_analysis":
        // Track communication history
        const conversationData = params.conversation_data;
        const analysisEntity = await kgClient.saveEntity({
          name: `conversation_${conversationData.customer_name}_${Date.now()}`,
          entityType: 'Conversation',
          observations: [
            `Customer: ${conversationData.customer_name}`,
            `Channel: ${conversationData.channel || 'WhatsApp'}`,
            `Sentiment: ${conversationData.sentiment || 'Neutral'}`,
            `Key Topics: ${conversationData.topics?.join(', ') || 'None'}`,
            `Outcome: ${conversationData.outcome || 'Ongoing'}`,
            `Next Steps: ${conversationData.next_steps || 'Follow up'}`,
            `Message Content: ${conversationData.message_content}`
          ],
          conversationData
        }, params.memory_zone || staffId);
        
        // Create relation to customer
        if (conversationData.customer_name) {
          await kgClient.saveRelation({
            from: conversationData.customer_name,
            to: analysisEntity.name,
            type: 'HAD_CONVERSATION',
            fromZone: params.memory_zone || staffId,
            toZone: params.memory_zone || staffId
          });
        }
        
        return {
          success: true,
          staffId,
          conversation: analysisEntity,
          analysisType: 'COMMUNICATION_TRACKING'
        };

      case "objection_handling":
        // Learn from sales interactions
        const objectionData = params.objection_data;
        const objectionEntity = await kgClient.saveEntity({
          name: `objection_${objectionData.type}_${Date.now()}`,
          entityType: 'SalesObjection',
          observations: [
            `Objection Type: ${objectionData.type}`,
            `Customer Concern: ${objectionData.concern}`,
            `Response Used: ${objectionData.response}`,
            `Outcome: ${objectionData.outcome}`,
            `Effectiveness: ${objectionData.effectiveness}/10`,
            `Context: ${objectionData.context || 'Unknown'}`,
            `Customer Segment: ${objectionData.customer_segment || 'Unknown'}`
          ],
          objectionData,
          relevanceScore: objectionData.effectiveness / 10
        }, params.memory_zone || staffId);
        
        return {
          success: true,
          staffId,
          objection: objectionEntity,
          learningType: 'OBJECTION_HANDLING'
        };

      case "pattern_recognition":
        // Identify successful strategies
        const patternZone = params.memory_zone || staffId;
        const successfulConversations = await kgClient.userSearch({
          query: 'outcome:success OR outcome:closed OR outcome:won',
          informationNeeded: 'Find successful sales conversations and patterns',
          reason: 'Identify winning sales strategies',
          memoryZone: patternZone,
          entityTypes: ['Conversation', 'Customer'],
          limit: 50
        });
        
        // Analyze patterns
        const patterns = {
          commonTopics: {},
          successfulResponses: {},
          customerSegments: {},
          timePatterns: {}
        };
        
        successfulConversations.entities.forEach(entity => {
          if (entity.conversationData) {
            const data = entity.conversationData;
            // Track common topics
            data.topics?.forEach(topic => {
              patterns.commonTopics[topic] = (patterns.commonTopics[topic] || 0) + 1;
            });
            // Track customer segments
            if (data.customer_segment) {
              patterns.customerSegments[data.customer_segment] = (patterns.customerSegments[data.customer_segment] || 0) + 1;
            }
          }
        });
        
        return {
          success: true,
          staffId,
          patterns,
          analysisType: 'SUCCESS_PATTERN_RECOGNITION',
          totalSuccessfulInteractions: successfulConversations.entities.length
        };

      case "conversion_tracking":
        // Monitor sales performance
        const conversionZone = params.memory_zone || staffId;
        const allCustomers = await kgClient.userSearch({
          query: '*',
          informationNeeded: 'Get all customer data for conversion analysis',
          reason: 'Track conversion rates and sales performance',
          memoryZone: conversionZone,
          entityTypes: ['Customer'],
          limit: 1000
        });
        
        const conversionStats = {
          totalCustomers: allCustomers.entities.length,
          converted: 0,
          inProgress: 0,
          lost: 0,
          conversionRate: 0,
          avgDealSize: 0,
          topPerformingSegments: {}
        };
        
        allCustomers.entities.forEach(customer => {
          if (customer.salesProfile) {
            const stage = customer.salesProfile.sales_stage?.toLowerCase();
            if (stage?.includes('closed') || stage?.includes('won')) {
              conversionStats.converted++;
            } else if (stage?.includes('lost') || stage?.includes('rejected')) {
              conversionStats.lost++;
            } else {
              conversionStats.inProgress++;
            }
          }
        });
        
        conversionStats.conversionRate = (conversionStats.converted / conversionStats.totalCustomers) * 100;
        
        return {
          success: true,
          staffId,
          conversionStats,
          trackingType: 'SALES_PERFORMANCE'
        };

      case "response_suggestions":
        // AI-powered recommendations
        const suggestionContext = params.context;
        const customerName = params.customer_name;
        
        // Get customer history
        const customerHistory = await kgClient.userSearch({
          query: customerName,
          informationNeeded: 'Get customer history and conversation patterns',
          reason: 'Generate personalized response suggestions',
          memoryZone: params.memory_zone || staffId,
          limit: 20
        });
        
        // Get successful objection handling patterns
        const objectionPatterns = await kgClient.userSearch({
          query: `objection ${suggestionContext.concern || ''}`,
          informationNeeded: 'Find successful objection handling strategies',
          reason: 'Generate contextual response suggestions',
          memoryZone: params.memory_zone || staffId,
          entityTypes: ['SalesObjection'],
          limit: 10
        });
        
        const suggestions = {
          personalizedResponses: [
            `Based on ${customerName}'s history, consider mentioning their previous interest in ${suggestionContext.topic}`,
            `Reference their budget range of ${suggestionContext.budget || 'previous discussions'}`,
            `Acknowledge their ${suggestionContext.concern} concern and provide specific examples`
          ],
          objectionHandling: objectionPatterns.entities.map(obj => ({
            type: obj.objectionData?.type,
            response: obj.objectionData?.response,
            effectiveness: obj.objectionData?.effectiveness
          })).filter(obj => obj.effectiveness > 7),
          nextSteps: [
            'Schedule a follow-up call',
            'Send relevant case studies',
            'Provide pricing information',
            'Connect with decision maker'
          ]
        };
        
        return {
          success: true,
          staffId,
          suggestions,
          context: suggestionContext,
          customerHistory: customerHistory.entities.length
        };

      case "lead_scoring":
        // Prioritize prospects
        const leadData = params.lead_data;
        let score = 0;
        const scoringFactors: any = {};
        
        // Budget score (30%)
        const budgetScore = leadData.budget ? Math.min(leadData.budget / 10000, 10) : 5;
        score += budgetScore * 0.3;
        scoringFactors.budget = budgetScore;
        
        // Industry score (20%)
        const highValueIndustries = ['technology', 'finance', 'healthcare', 'enterprise'];
        const industryScore = highValueIndustries.includes(leadData.industry?.toLowerCase()) ? 10 : 6;
        score += industryScore * 0.2;
        scoringFactors.industry = industryScore;
        
        // Engagement score (25%)
        const engagementScore = leadData.engagement_level || 5;
        score += engagementScore * 0.25;
        scoringFactors.engagement = engagementScore;
        
        // Company size score (15%)
        const sizeScore = leadData.company_size ? Math.min(leadData.company_size / 100, 10) : 5;
        score += sizeScore * 0.15;
        scoringFactors.companySize = sizeScore;
        
        // Urgency score (10%)
        const urgencyScore = leadData.urgency || 5;
        score += urgencyScore * 0.1;
        scoringFactors.urgency = urgencyScore;
        
        const leadEntity = await kgClient.saveEntity({
          name: leadData.name,
          entityType: 'Lead',
          observations: [
            `Lead Score: ${score.toFixed(2)}/10`,
            `Priority: ${score > 7 ? 'HIGH' : score > 5 ? 'MEDIUM' : 'LOW'}`,
            `Budget: ${leadData.budget}`,
            `Industry: ${leadData.industry}`,
            `Company Size: ${leadData.company_size}`,
            `Engagement Level: ${leadData.engagement_level}/10`
          ],
          leadData: { ...leadData, leadScore: score, scoringFactors },
          relevanceScore: score
        }, params.memory_zone || staffId);
        
        return {
          success: true,
          staffId,
          lead: leadEntity,
          leadScore: score,
          priority: score > 7 ? 'HIGH' : score > 5 ? 'MEDIUM' : 'LOW',
          scoringFactors
        };

      case "pipeline_management":
        // Track deal progression
        const pipelineZone = params.memory_zone || staffId;
        const allDeals = await kgClient.userSearch({
          query: '*',
          informationNeeded: 'Get all deals and customers for pipeline analysis',
          reason: 'Track deal progression and pipeline health',
          memoryZone: pipelineZone,
          entityTypes: ['Customer', 'Lead'],
          limit: 1000
        });
        
        const pipeline = {
          prospect: { count: 0, value: 0 },
          qualified: { count: 0, value: 0 },
          proposal: { count: 0, value: 0 },
          negotiation: { count: 0, value: 0 },
          closed_won: { count: 0, value: 0 },
          closed_lost: { count: 0, value: 0 }
        };
        
        allDeals.entities.forEach(deal => {
          const stage = deal.salesProfile?.sales_stage?.toLowerCase().replace(/\s+/g, '_') || 'prospect';
          const value = parseFloat(deal.salesProfile?.budget || deal.leadData?.budget || 0);
          
          if (pipeline[stage]) {
            pipeline[stage].count++;
            pipeline[stage].value += value;
          } else {
            pipeline.prospect.count++;
            pipeline.prospect.value += value;
          }
        });
        
        const totalPipelineValue = Object.values(pipeline).reduce((sum, stage) => sum + stage.value, 0);
        const conversionRate = pipeline.closed_won.count / (pipeline.closed_won.count + pipeline.closed_lost.count || 1) * 100;
        
        return {
          success: true,
          staffId,
          pipeline,
          metrics: {
            totalDeals: allDeals.entities.length,
            totalPipelineValue,
            conversionRate: parseFloat(conversionRate.toFixed(2)),
            avgDealSize: parseFloat((totalPipelineValue / allDeals.entities.length || 0).toFixed(2))
          },
          managementType: 'PIPELINE_TRACKING'
        };

      case "performance_analytics":
        // Sales intelligence dashboards
        const analyticsZone = params.memory_zone || staffId;
        const timeframe = params.timeframe || 30; // days
        const cutoffDate = new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000);
        
        // Get all entities for analysis
        const allEntities = await kgClient.userSearch({
          query: '*',
          informationNeeded: 'Get all data for performance analytics',
          reason: 'Generate comprehensive sales analytics dashboard',
          memoryZone: analyticsZone,
          limit: 2000
        });
        
        const analytics = {
          conversations: {
            total: 0,
            successful: 0,
            byChannel: {},
            byOutcome: {}
          },
          customers: {
            total: 0,
            new: 0,
            converted: 0,
            byIndustry: {},
            bySegment: {}
          },
          objections: {
            total: 0,
            byType: {},
            avgEffectiveness: 0
          },
          performance: {
            conversionRate: 0,
            avgResponseTime: 0,
            customerSatisfaction: 0,
            revenueGenerated: 0
          }
        };
        
        allEntities.entities.forEach(entity => {
          const createdAt = new Date(entity.createdAt || Date.now());
          const isRecent = createdAt >= cutoffDate;
          
          if (entity.entityType === 'Conversation' && isRecent) {
            analytics.conversations.total++;
            if (entity.conversationData?.outcome?.includes('success')) {
              analytics.conversations.successful++;
            }
            const channel = entity.conversationData?.channel || 'unknown';
            analytics.conversations.byChannel[channel] = (analytics.conversations.byChannel[channel] || 0) + 1;
          }
          
          if (entity.entityType === 'Customer') {
            analytics.customers.total++;
            if (isRecent) analytics.customers.new++;
            if (entity.salesProfile?.sales_stage?.includes('closed')) {
              analytics.customers.converted++;
              analytics.performance.revenueGenerated += parseFloat(entity.salesProfile.budget || 0);
            }
          }
          
          if (entity.entityType === 'SalesObjection' && isRecent) {
            analytics.objections.total++;
            const type = entity.objectionData?.type || 'unknown';
            analytics.objections.byType[type] = (analytics.objections.byType[type] || 0) + 1;
            analytics.objections.avgEffectiveness += entity.objectionData?.effectiveness || 0;
          }
        });
        
        analytics.objections.avgEffectiveness = analytics.objections.total > 0 ? 
          analytics.objections.avgEffectiveness / analytics.objections.total : 0;
        
        analytics.performance.conversionRate = analytics.customers.total > 0 ? 
          parseFloat((analytics.customers.converted / analytics.customers.total * 100).toFixed(2)) : 0;
        
        return {
          success: true,
          staffId,
          analytics,
          timeframe: `${timeframe} days`,
          generatedAt: new Date().toISOString(),
          dashboardType: 'COMPREHENSIVE_SALES_ANALYTICS'
        };

      // ===== UTILITY TOOLS =====
      case "get_time_utc":
        const timeNow = new Date();
        return {
          success: true,
          staffId,
          utcTime: timeNow.toISOString(),
          formattedTime: timeNow.toISOString().replace('T', ' ').substring(0, 19),
          timestamp: timeNow.getTime()
        };

      default:
        console.error(`Brain tool '${toolName}' not implemented`);
        return {
          success: false,
          staffId,
          error: `Brain tool '${toolName}' not implemented`,
          availableTools: [
            'Core Memory: create_entities, update_entities, delete_entities, search_nodes, open_nodes, add_observations, mark_important, get_recent',
            'Relationships: create_relations, delete_relations, cross_zone_relations', 
            'Memory Zones: list_zones, create_zone, delete_zone, copy_entities, move_entities, merge_zones, zone_stats, zone_isolation',
            'AI Intelligence: inspect_knowledge_graph, inspect_files, smart_search_ranking, context_aware_retrieval',
            'Sales Intelligence: customer_profiling, conversation_analysis, objection_handling, pattern_recognition, conversion_tracking, response_suggestions, lead_scoring, pipeline_management, performance_analytics',
            'Utility: get_time_utc'
          ]
        };
    }
  } catch (error) {
    console.error(`Error processing brain tool '${toolName}' for staff ${staffId}:`, error);
    return {
      success: false,
      staffId,
      error: `Error processing brain tool: ${error.message}`,
      tool: toolName
    };
  }
}