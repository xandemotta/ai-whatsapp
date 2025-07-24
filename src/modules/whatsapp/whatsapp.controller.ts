/**
 * Controller que processa o webhook do WhatsApp para mensagens recebidas e
 * requisições de verificação. Utiliza o OpenAI para gerar respostas e persiste
 * a conversa através do TenantsService.
 */
import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OpenAiService } from '../openai/openai.service';
import { TenantsService } from '../tenants/tenants.service';

@Controller('webhook')
export class WhatsappController {
  constructor(
    private whatsapp: WhatsappService,
    private openai: OpenAiService,
    private tenants: TenantsService,
  ) {}

  @Get()
  verify(@Query('hub.mode') mode: string, @Query('hub.verify_token') verifyToken: string, @Query('hub.challenge') challenge: string) {
    if (mode === 'subscribe' && verifyToken === process.env.WHATSAPP_VERIFY_TOKEN) {
      return challenge;
    }
    return 'Invalid verify token';
  }

  @Post()
  async handle(@Body() body: any, @Req() req: Request) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    let text = message?.text?.body;
    if (message?.type === 'audio' && message.audio?.id) {
      // fetch audio from WhatsApp API (simplified)
      const audioBuffer = Buffer.from('');
      text = await this.openai.transcribeAudio(audioBuffer);
    }
    if (!from || !text) return 'ok';

    const tenantName = 'default'; // in real case map from from or metadata
    const tenant = await this.tenants.findByName(tenantName);
    if (!tenant) return 'ok';
    const historyEntities = await this.tenants.getHistory(tenant);
    const history = historyEntities
      .reverse()
      .map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: text });

    const answer = await this.openai.generateChatCompletion(history, { system: tenant.systemPrompt });
    await this.tenants.saveMessage(tenant, 'user', text);
    await this.tenants.saveMessage(tenant, 'assistant', answer);
    await this.whatsapp.sendText(from, answer);
    return 'ok';
  }
}
