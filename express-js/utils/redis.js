const Redis = require('ioredis');

class RedisClient {
  constructor(options) {
    // Set default options or use provided options
    this.options = options || {
      host: process.env.NODE_ENV === 'development'
        ? 'redis-123590.c3522.us-east-1-2.ec2.redns.redis-cloud.com'
        : 'redis-service.default.svc.cluster.local', // default service name in Kubernetes cluster
      port: process.env.NODE_ENV === 'development' ? 12890 : 6379, // default Redis port
      password: process.env.NODE_ENV === 'development' ? 'password' : undefined, // Redis password for cloud instance
    };
    
    // Create a new Redis client instance with authentication options
    this.redis = new Redis(this.getRedisOptions());

    // Log connection success
    this.redis.on('connect', () => {
        console.log('Connected to Redis Cache Server');
    });
  }

  // Helper method to construct the Redis options object
  getRedisOptions() {
    const { host, port, password } = this.options;
    return {
      host,
      port,
      password, // Pass the password only if provided
    };
  }

  // Method to set a key-value pair in Redis
  async set(key, value, expire = 300) {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', expire);
    } catch (error) {
      console.error(`Error setting key '${key}' in Redis:`, error);
    }
  }

  // Method to get the value of a key from Redis
  async get(key) {
    try {
      const value = await this.redis.get(key);
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error retrieving value for key '${key}' from Redis:`, error);
      return null;
    }
  }

  
  // Method to remove a key from Redis
  async remove(key) {
    try {
      const result = await this.redis.del(key);
      if (result === 1) {
        console.log(`Key '${key}' removed successfully from Redis.`);
      } else {
        console.log(`Key '${key}' does not exist in Redis.`);
      }
    } catch (error) {
      console.error(`Error removing key '${key}' from Redis:`, error);
    }
  }


  // Method to close the Redis connection
  async close() {
    try {
      await this.redis.quit();
      console.log('Redis connection closed.');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
}

// Create a single instance of RedisClient for reusability
const redis = new RedisClient();

module.exports = {
  redis
};
