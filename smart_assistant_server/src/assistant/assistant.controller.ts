import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiTags,
  ApiConsumes,
  ApiProduces,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Res,
  Body,
  Post,
  Header,
  HttpCode,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { AssistantService } from './assistant.service';
import { AudioValidationPipe } from 'libs/validations';
import { PromptDto, SpeechToTextDto } from 'libs/dtos';

@ApiTags('assistant')
@ApiBearerAuth()
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('prompt')
  @HttpCode(200)
  @ApiProduces('application/octet-stream')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  @ApiResponse({
    status: 200,
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async prompt(
    @Body() body: PromptDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.flushHeaders();
    const stream = await this.assistantService.prompt(body.question);
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      response.write(chunkText);
    }
    response.end();
  }

  @Post('voice-prompt')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @Header('Connection', 'keep-alive')
  @Header('Cache-Control', 'no-cache')
  @ApiProduces('application/octet-stream')
  @UseInterceptors(FileInterceptor('file'))
  @Header('Content-Type', 'text/event-stream')
  @ApiBody({ type: SpeechToTextDto })
  @ApiResponse({
    status: 200,
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async voicePrompt(
    @Res({ passthrough: true }) response: Response,
    @UploadedFile(AudioValidationPipe) file: Express.Multer.File,
  ) {
    response.flushHeaders();
    const stream = await this.assistantService.voicePrompt(file);
    for await (const chunk of stream) {
      const chunkText = chunk.text();
      response.write(chunkText);
    }
    response.end();
  }
}
