import { Module } from '@nestjs/common';
import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { RedisCacheRepository } from '@/infra/cache/redis/redis-cache-repository';
import { RedisService } from '@/infra/cache/redis/redis.service';

@Module({
  imports:[EnvModule],
  providers:[
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    }
  ],
  exports:[
    CacheRepository
  ]
})

export class CacheModule{}