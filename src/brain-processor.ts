import { userSessionManager } from './config.js';
import { inspectFile } from './filesystem/index.js';

// Format response helper
const formatResponse = (data: any) => {
  return JSON.stringify(data, null, 2);
};

// Helper function to format dates
function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export async function processBrainTool(toolName: string, params: any, userId: string): Promise<any> {
  // Get user session and initialize KG client
  const session = userSessionManager.getSession(userId);
  if (!session) {
    throw new Error('Invalid session');
  }

  // Initialize KG client for this session
  const kgClient = await userSessionManager.initializeKgClient(userId);

  try {
    switch (toolName) {
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
        
        return { success: true, results };      case "inspect_knowledge_graph":
        const { information_needed: kgInfo, reason: kgReason, include_entities, include_relations, keywords: kgKeywords, memory_zone, entity_types } = params;
        
        const { inspectKnowledgeGraph } = await import('./kg-inspection.js');
        
        try {
          const kgResults = await inspectKnowledgeGraph(
            kgClient,
            kgInfo,
            kgReason,
            kgKeywords,
            memory_zone,
            entity_types
          );
          
          return {
            success: true,
            tentativeAnswer: kgResults.tentativeAnswer,
            entities: include_entities ? kgResults.entities : kgResults.entities.map(e => ({ name: e.name, entityType: e.entityType })),
            relations: include_relations ? kgResults.relations : []
          };
        } catch (error) {
          return {
            success: false,
            error: `Error inspecting knowledge graph: ${error.message}`
          };
        }

      case "create_entities":
        const entities = params.entities;
        const zone = params.memory_zone;
        
        // Check for conflicts and invalid entities
        const conflictingEntities = [];
        const invalidEntities = [];
        
        for (const entity of entities) {
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
        }        // Handle conflicts and invalid entities
        if (conflictingEntities.length > 0 || invalidEntities.length > 0) {
          const zoneMsg = zone ? ` in zone "${zone}"` : "";
          
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
            error: `Entity creation failed${zoneMsg}, no entities were created.`,
            conflicts: conflictingEntities.length > 0 ? conflictingEntities : undefined,
            existingEntities: existingEntitiesData.length > 0 ? existingEntitiesData : undefined,
            invalidEntities: invalidEntities.length > 0 ? invalidEntities : undefined,
            message: conflictingEntities.length > 0 ? 
              "Feel free to extend existing entities with more information if needed, or create entities with different names. Use update_entities to modify existing entities." : 
              "Please provide valid entity names for all entities."
          };
        }
        
        // Create entities
        const createdEntities = [];
        for (const entity of entities) {
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
          entities: createdEntities.map(e => ({
            name: e.name,
            entityType: e.entityType,
            observations: e.observations
          }))
        };      case "update_entities":
        const updateEntities = params.entities;
        const updateZone = params.memory_zone;
        const updatedEntities = [];
        
        for (const entity of updateEntities) {
          const existingEntity = await kgClient.getEntity(entity.name, updateZone);
          if (!existingEntity) {
            const zoneMsg = updateZone ? ` in zone "${updateZone}"` : "";
            throw new Error(`Entity "${entity.name}" not found${zoneMsg}`);
          }
          
          const updatedEntity = await kgClient.saveEntity({
            name: entity.name,
            entityType: entity.entityType || existingEntity.entityType,
            observations: entity.observations || existingEntity.observations,
            relevanceScore: entity.relevanceScore || ((existingEntity.relevanceScore ?? 1.0) * 2.0)
          }, updateZone);
          
          updatedEntities.push(updatedEntity);
        }
        
        return {
          entities: updatedEntities.map(e => ({
            name: e.name,
            entityType: e.entityType,
            observations: e.observations
          }))
        };

      case "search_nodes":
        const includeObservations = params.includeObservations ?? false;
        const searchZone = params.memory_zone;
        
        const { entities: filteredEntities, relations: formattedRelations } = await kgClient.userSearch({
          query: params.query,
          entityTypes: params.entityTypes,
          limit: params.limit,
          sortBy: params.sortBy,
          includeObservations,
          zone: searchZone,
          informationNeeded: params.informationNeeded,
          reason: params.reason
        });
        
        return { entities: filteredEntities, relations: formattedRelations };      case "get_time_utc":
        const now = new Date();
        return {
          success: true,
          utc_time: now.toISOString().replace('T', ' ').replace('Z', ''),
          timestamp: now.toISOString(),
          date: formatDate(now)
        };

      // Add more brain tools here...
      // For now, we'll implement the core ones and add others progressively

      default:
        // For tools not yet implemented, delegate to the original brain system
        console.error(`Brain tool '${toolName}' not yet implemented in HTTP version`);
        return {
          success: false,
          error: `Brain tool '${toolName}' not yet implemented in HTTP version`,
          message: 'This tool will be added in the next update'
        };
    }
  } catch (error) {
    console.error(`Error processing brain tool '${toolName}':`, error);
    return {
      success: false,
      error: `Error processing brain tool: ${error.message}`,
      tool: toolName
    };
  }
}