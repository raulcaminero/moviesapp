import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

const API_SECRET = process.env.API_SECRET || 'my-secret-token'; // You can set this in .env

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');
    // Expect header: Authorization: Bearer <token>
    const token = authHeader.split(' ')[1];
    if (token !== API_SECRET) throw new UnauthorizedException('Invalid API token');
    return true;
  }
}