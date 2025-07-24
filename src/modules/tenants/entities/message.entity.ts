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
