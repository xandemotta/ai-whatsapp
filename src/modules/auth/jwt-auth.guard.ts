/**
 * Empacotamento simples do guard JWT do Passport para que possa ser injetado
 * por dependência do NestJS.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
