import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as https from 'https';
import { Logger } from './utils/logger';

async function bootstrap() {
  const configService = new ConfigService();
  const httpsOptions = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions, logger: new Logger() });
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
