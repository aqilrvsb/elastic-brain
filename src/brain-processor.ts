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
  // Get KG client for this staff member (auto-creates if needed)
  const kgClient = await staffBrainManager.getKgClient(staffId);

  // Auto-set memory_zone to staffId if not provided
  if (params && typeof params === 'object' && !params.memory_zone) {
    params.memory_zone = staffId;
  }

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
        
        return { success: true, results, staffId };

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
        }      case "create_entities":
        const entities = params.entities;
        const zone = params.memory_zone || staffId;
        
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
          staffId,
          zone,
          entities: createdEntities.map(e => ({
            name: e.name,
            entityType: e.entityType,
            observations: e.observations
          }))
        };      case "search_nodes":
        const includeObservations = params.includeObservations ?? false;
        const searchZone = params.memory_zone || staffId;
        
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
        
        return { 
          success: true,
          staffId, 
          zone: searchZone,
          entities: filteredEntities, 
          relations: formattedRelations 
        };

      case "get_time_utc":
        const now = new Date();
        return {
          success: true,
          staffId,
          utc_time: now.toISOString().replace('T', ' ').replace('Z', ''),
          timestamp: now.toISOString(),
          date: formatDate(now)
        };

      // Add more core brain tools as needed...
      case "create_zone":
        const zoneName = params.name;
        const zoneDescription = params.description || params.shortDescription || `Memory zone for ${zoneName}`;
        
        try {
          // For staff-based zones, prefix with staff ID to ensure isolation
          const fullZoneName = zoneName.startsWith(staffId) ? zoneName : `${staffId}-${zoneName}`;
          
          await kgClient.createZone(fullZoneName, zoneDescription, params.shortDescription);
          
          return {
            success: true,
            staffId,
            zone: fullZoneName,
            message: `Zone "${fullZoneName}" created successfully`
          };
        } catch (error) {
          return {
            success: false,
            staffId,
            error: `Failed to create zone: ${error.message}`
          };
        }

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
        }      default:
        // For tools not yet implemented in this simplified version
        console.error(`Brain tool '${toolName}' not yet implemented in STAFF_ID version`);
        return {
          success: false,
          staffId,
          error: `Brain tool '${toolName}' not yet implemented`,
          message: 'Core tools: create_entities, search_nodes, inspect_knowledge_graph, create_zone, list_zones, get_time_utc'
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