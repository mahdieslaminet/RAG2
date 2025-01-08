import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PromptDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  question: string;
}

export class SpeechToTextDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}
