import { v4 as uuidv4 } from 'uuid';

// Server configuration
export const serverConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  environment: process.env.NODE_ENV || 'development',
  maxConnections: process.env.MAX_CONNECTIONS ? parseInt(process.env.MAX_CONNECTIONS) : 200,
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
  rateLimit: {
    maxRequests: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100,
    windowMs: process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : 60000
  },
  sessionTimeout: process.env.SESSION_TIMEOUT ? parseInt(process.env.SESSION_TIMEOUT) : 3600000 // 1 hour
};

// User credentials interface
export interface UserCredentials {
  elasticsearchUrl: string;
  elasticsearchApiKey: string;
  groqApiKey?: string;
  userId: string;
}

// User session interface
export interface UserSession {
  credentials: UserCredentials;
  createdAt: Date;
  lastActivity: Date;
  kgClient?: any; // KnowledgeGraphClient instance
}

// Session management
class UserSessionManager {
  private sessions: Map<string, UserSession> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired sessions every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 10 * 60 * 1000);
  }  createSession(credentials: UserCredentials): { success: boolean; error?: string } {
    try {
      // Validate Elasticsearch credentials
      if (!credentials.elasticsearchUrl || !credentials.elasticsearchApiKey) {
        return { success: false, error: 'Missing Elasticsearch credentials' };
      }

      // Create session
      const session: UserSession = {
        credentials,
        createdAt: new Date(),
        lastActivity: new Date()
      };

      this.sessions.set(credentials.userId, session);
      console.error(`Brain session created for user: ${credentials.userId}`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  getSession(userId: string): UserSession | null {
    const session = this.sessions.get(userId);
    if (session) {
      // Update last activity
      session.lastActivity = new Date();
      return session;
    }
    return null;
  }

  deleteSession(userId: string): boolean {
    const deleted = this.sessions.delete(userId);
    if (deleted) {
      console.error(`Brain session deleted for user: ${userId}`);
    }
    return deleted;
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }  private cleanupExpiredSessions(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [userId, session] of this.sessions.entries()) {
      const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
      
      if (timeSinceLastActivity > serverConfig.sessionTimeout) {
        this.sessions.delete(userId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.error(`Cleaned up ${cleanedCount} expired brain sessions`);
    }
  }

  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.sessions.clear();
  }

  // Initialize KnowledgeGraphClient for a session
  async initializeKgClient(userId: string): Promise<any> {
    const session = this.getSession(userId);
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.kgClient) {
      return session.kgClient;
    }

    // Import and create KG client
    const { KnowledgeGraphClient } = await import('./kg-client.js');
    
    const kgClient = new KnowledgeGraphClient({
      node: session.credentials.elasticsearchUrl,
      auth: {
        apiKey: session.credentials.elasticsearchApiKey
      }
    });

    await kgClient.initialize();
    session.kgClient = kgClient;
    
    return kgClient;
  }
}

export const userSessionManager = new UserSessionManager();