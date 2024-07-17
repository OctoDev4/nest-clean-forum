import { CacheRepository } from '@/infra/cache/cache-repository';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@/infra/cache/redis/redis.service';
import { undefined } from 'zod';



@Injectable()
export class RedisCacheRepository implements CacheRepository{

  constructor(private redis: RedisService) {}

  async delete(key: string){
    await this.redis.del(key)
  }

  async get(key: string){
    return this.redis.get(key)
  }

  async set(key: string, value: string){

    await  this.redis.set(key,value,'EX',60*15)

  }
  }
