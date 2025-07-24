/**
 * Middleware que anexa o identificador do tenant à requisição com base no
 * usuário autenticado ou em um header. Lança exceção quando não é possível
 * resolver o tenant.
 */
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
