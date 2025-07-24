import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = (req as any).user?.tenant || req.headers['x-tenant-id'];
    if (!tenantId) {
      throw new UnauthorizedException('Tenant not specified');
    }
    (req as any).tenantId = tenantId;
    next();
  }
}
