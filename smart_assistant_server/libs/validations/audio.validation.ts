import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  PipeTransform,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';

@Injectable()
export class AudioValidationPipe implements PipeTransform {
  private validTypes: string[] = [
    'audio/ogg',
    'audio/wav',
    'audio/mpeg',
    'audio/acc',
    'audio/webm',
  ];

  constructor(private readonly configService: ConfigService) {}

  public transform(value: Express.Multer.File) {
    const maxAudioSizeInMg =
      this.configService.getOrThrow<string>('MAX_AUDIO_SIZE');
    const maxAudioSize = Number(maxAudioSizeInMg || 0) * Math.pow(10, 6);
    if (value.size > maxAudioSize) {
      throw new BadRequestException(
        `Max audio file size is ${maxAudioSizeInMg}mg`,
      );
    }
    if (!this.validTypes.includes(value.mimetype)) {
      throw new BadGatewayException(
        `Audio file type must be ${this.validTypes.join(', ')}`,
      );
    }
    return value;
  }
}
