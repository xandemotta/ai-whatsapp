import { Module, MiddlewareConsumer } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { VerifyMiddleware } from './verify.middleware';
import { OpenAiModule } from '../openai/openai.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [OpenAiModule, TenantsModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyMiddleware).forRoutes(WhatsappController);
  }
}
