import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    try {
      const token = request.headers.authorization.split(' ')[1];
      if (token) {
        const decodedToken = await this.jwtService.decode(token);
        request['userRole'] = decodedToken; // Attach the user object to the request
      } else {
        request['userRole'] = null;
      }
    } catch (error) {
      // Handle invalid or expired token
    }
    next();
  }
}
