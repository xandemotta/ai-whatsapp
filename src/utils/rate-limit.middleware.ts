import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter = new RateLimiterMemory({
    points: parseInt(process.env.RATE_LIMIT_MAX || '10'),
    duration: 60,
  });
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.limiter.consume(req.ip);
      next();
    } catch (err) {
      throw new HttpException('Too many requests', 429);
    }
  }
}
