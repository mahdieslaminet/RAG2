import { Module } from '@nestjs/common';

import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';

@Module({
  providers: [AssistantService],
  controllers: [AssistantController],
})
export class AssistantModule {}
