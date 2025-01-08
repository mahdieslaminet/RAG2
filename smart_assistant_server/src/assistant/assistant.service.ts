import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Part,
  GenerativeModel,
  GoogleGenerativeAI,
  EnhancedGenerateContentResponse,
} from '@google/generative-ai';

import {
  speechToTextPrompt,
  promptGenerationConfig,
  promptSystemInstruction,
} from 'libs/constants';

@Injectable()
export class AssistantService {
  private readonly geminiModel: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const genAI = new GoogleGenerativeAI(
      configService.getOrThrow<string>('GEMINI_API_KEY'),
    );
    this.geminiModel = genAI.getGenerativeModel({
      model: configService.getOrThrow<string>('GEMINI_MODEL_NAME'),
      systemInstruction: promptSystemInstruction,
    });
  }

  public async prompt(
    message: string,
  ): Promise<AsyncGenerator<EnhancedGenerateContentResponse, any, any>> {
    const chat = this.geminiModel.startChat({
      generationConfig: promptGenerationConfig,
    });
    const result = await chat.sendMessageStream(message);
    return result.stream;
  }

  public async voicePrompt(
    audio: Express.Multer.File,
  ): Promise<AsyncGenerator<EnhancedGenerateContentResponse, any, any>> {
    const audioPart: Part = {
      inlineData: {
        data: audio.buffer.toString('base64'),
        mimeType: audio.mimetype,
      },
    };
    const result = await this.geminiModel.generateContentStream([
      speechToTextPrompt,
      audioPart,
    ]);
    return result.stream;
  }
}
