import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class VerifyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers['x-hub-signature-256'] as string;
    if (!signature) throw new UnauthorizedException('Missing signature');
    const payload = JSON.stringify(req.body);
    const expected =
      'sha256=' +
      crypto
        .createHmac('sha256', process.env.WHATSAPP_VERIFY_TOKEN || '')
        .update(payload)
        .digest('hex');
    if (signature !== expected) {
      throw new UnauthorizedException('Invalid signature');
    }
    next();
  }
}
