import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;
  constructor(private config: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  async generateChatCompletion(history: ChatCompletionMessageParam[], tenantConfig: { system?: string }) {
    const system = tenantConfig.system || 'You are a helpful assistant.';
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: system },
      ...history,
    ];
    const model = this.config.get('OPENAI_MODEL') || 'gpt-4o';
    const res = await this.openai.chat.completions.create({
      model,
      messages,
    });
    return res.choices[0].message?.content || '';
  }

  async transcribeAudio(buffer: Buffer) {
    const res = await this.openai.audio.transcriptions.create({
      file: buffer as any,
      model: 'whisper-1',
    } as any);
    return (res as any).text;
  }
}
