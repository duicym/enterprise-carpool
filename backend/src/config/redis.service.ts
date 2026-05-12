import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null;
  private inMemoryStore = new Map<string, { value: string; expiry?: number }>();
  private isRedisAvailable = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const db = this.configService.get<number>('REDIS_DB', 0);

    try {
      this.client = createClient({
        socket: {
          host,
          port,
          connectTimeout: 2000,
          reconnectStrategy: false, // 禁用自动重连
        },
        password,
        database: db,
      });

      this.client.on('error', (err) => {
        console.warn('Redis Client Error:', err.message);
      });

      await this.client.connect();
      this.isRedisAvailable = true;
      console.log('Redis connected');
    } catch (error) {
      console.warn('Redis not available, using in-memory storage');
      this.isRedisAvailable = false;
      if (this.client) {
        this.client.removeAllListeners('error');
        this.client = null;
      }
    }
  }

  async onModuleDestroy() {
    if (this.client && this.isRedisAvailable) {
      await this.client.quit();
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  // 分布式锁
  async acquireLock(key: string, ttl: number = 5000): Promise<boolean> {
    if (this.isRedisAvailable && this.client) {
      const result = await this.client.set(key, '1', {
        PX: ttl,
        NX: true,
      });
      return !!result;
    }
    
    // 内存中的锁
    const existing = this.inMemoryStore.get(key);
    if (existing && (!existing.expiry || existing.expiry > Date.now())) {
      return false;
    }
    this.inMemoryStore.set(key, { value: '1', expiry: Date.now() + ttl });
    return true;
  }

  async releaseLock(key: string): Promise<void> {
    if (this.isRedisAvailable && this.client) {
      await this.client.del(key);
    } else {
      this.inMemoryStore.delete(key);
    }
  }

  // 缓存操作
  async get<T>(key: string): Promise<T | null> {
    if (this.isRedisAvailable && this.client) {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    }
    
    const item = this.inMemoryStore.get(key);
    if (!item) return null;
    if (item.expiry && item.expiry < Date.now()) {
      this.inMemoryStore.delete(key);
      return null;
    }
    return JSON.parse(item.value);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (this.isRedisAvailable && this.client) {
      if (ttl) {
        await this.client.set(key, JSON.stringify(value), { PX: ttl });
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
    } else {
      this.inMemoryStore.set(key, {
        value: JSON.stringify(value),
        expiry: ttl ? Date.now() + ttl : undefined,
      });
    }
  }

  async del(key: string): Promise<void> {
    if (this.isRedisAvailable && this.client) {
      await this.client.del(key);
    } else {
      this.inMemoryStore.delete(key);
    }
  }
}
