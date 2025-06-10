// Simple configuration without sessions
export const serverConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  environment: process.env.NODE_ENV || 'development',
  maxConnections: process.env.MAX_CONNECTIONS ? parseInt(process.env.MAX_CONNECTIONS) : 200,
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
  rateLimit: {
    maxRequests: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100,
    windowMs: process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : 60000
  }
};

// Hardcoded Elasticsearch configuration (your working setup)
export const elasticsearchConfig = {
  node: process.env.ELASTICSEARCH_URL || 'https://my-elasticsearch-project-d584c1b.ap-southeast-1.aws.elastic.cloud:9243',
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY || 'S0NjaFdwY0JZa0RQVUJjS1ZzR2o6X1ZvdTNTUXJKWldOb1ZnZlZySk1JQQ=='
  }
};

// Simple KG client cache for staff IDs
class StaffBrainManager {
  private kgClients: Map<string, any> = new Map();

  async getKgClient(staffId: string): Promise<any> {
    if (this.kgClients.has(staffId)) {
      return this.kgClients.get(staffId);
    }

    // Import and create KG client for this staff member
    const { KnowledgeGraphClient } = await import('./kg-client.js');
    
    const kgClient = new KnowledgeGraphClient({
      node: elasticsearchConfig.node,
      auth: elasticsearchConfig.auth,
      defaultZone: staffId // Use STAFF_ID as default zone
    });

    await kgClient.initialize();
    this.kgClients.set(staffId, kgClient);
    
    return kgClient;
  }

  getActiveStaffCount(): number {
    return this.kgClients.size;
  }

  cleanup(): void {
    this.kgClients.clear();
  }
}

export const staffBrainManager = new StaffBrainManager();