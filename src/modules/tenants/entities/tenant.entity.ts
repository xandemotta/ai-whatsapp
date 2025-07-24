/**
 * Entidade TypeORM que representa a configuração de um tenant do chatbot.
 * Cada tenant possui um nome único e um prompt de sistema opcional usado nas
 * conversas com o OpenAI.
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ default: 'You are a helpful assistant.' })
  systemPrompt!: string;
}
