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

// Elasticsearch configuration - REAL DEPLOYMENT (Updated API Key)
export const elasticsearchConfig = {
  node: 'https://bc4d20f99098440d8df975469328cb06.ap-southeast-1.aws.found.io:443',
  auth: {
    apiKey: 'T3ZKdVc1Y0JrNlo1blhWeHBocjA6dEZXWGJUUnVtWVJzRDZ5bUhDUHNxZw=='
  }
};

// Debug logging for Railway deployment
console.error('[CONFIG] Elasticsearch URL:', elasticsearchConfig.node);
console.error('[CONFIG] API Key length:', elasticsearchConfig.auth.apiKey.length);

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