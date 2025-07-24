/**
 * Entidade TypeORM que representa uma mensagem de chat pertencente a um tenant.
 */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Tenant)
  tenant!: Tenant;

  @Column()
  role!: 'user' | 'assistant';

  @Column('text')
  content!: string;
}
