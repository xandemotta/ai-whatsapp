/**
 * Módulo que expõe o OpenAiService para interagir com a API do OpenAI.
 */
import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';

@Module({
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
