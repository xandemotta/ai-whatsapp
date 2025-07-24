/**
 * Serviço contendo operações para recuperar tenants e armazenar mensagens do
 * histórico de chat no banco de dados.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private tenantsRepo: Repository<Tenant>,
    @InjectRepository(Message) private messagesRepo: Repository<Message>,
  ) {}

  findByName(name: string) {
    return this.tenantsRepo.findOne({ where: { name } });
  }

  async getHistory(tenant: Tenant, limit = 10) {
    return this.messagesRepo.find({ where: { tenant }, order: { id: 'DESC' }, take: limit });
  }

  async saveMessage(tenant: Tenant, role: 'user' | 'assistant', content: string) {
    const msg = this.messagesRepo.create({ tenant, role, content });
    return this.messagesRepo.save(msg);
  }
}
