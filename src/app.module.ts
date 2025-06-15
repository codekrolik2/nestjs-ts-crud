import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    UserModule, 
    LoggerModule
  ],
})
export class AppModule {}
