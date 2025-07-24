/**
 * Módulo raiz da aplicação que reúne configurações, banco de dados e
 * módulos de funcionalidades como integração com WhatsApp e suporte ao OpenAI.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { AuthModule } from './modules/auth/auth.module';
import { OpenAiModule } from './modules/openai/openai.module';
import { TenantsModule } from './modules/tenants/tenants.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    WhatsappModule,
    AuthModule,
    OpenAiModule,
    TenantsModule,
  ],
})
export class AppModule {}
