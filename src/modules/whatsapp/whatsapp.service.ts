import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private token: string;
  private phoneId: string;
  constructor(private config: ConfigService) {
    this.token = this.config.get<string>('WHATSAPP_API_TOKEN') || '';
    this.phoneId = this.config.get<string>('WHATSAPP_PHONE_NUMBER_ID') || '';
  }

  async sendText(to: string, text: string) {
    const url = `https://graph.facebook.com/v19.0/${this.phoneId}/messages`;
    return axios.post(
      url,
      { messaging_product: 'whatsapp', to, text: { body: text } },
      { headers: { Authorization: `Bearer ${this.token}` } },
    );
  }
}
