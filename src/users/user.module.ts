import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { userProviders } from "./user.providers";
import { DatabaseModule } from "../database/database.module";
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [DatabaseModule,
      ThrottlerModule.forRoot([{
        ttl: 60000,
        limit: 10
      }]) ],
  controllers: [UserController],
  providers: [UserService, ...userProviders,
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
      }
  ],
})
export class UserModule {}
