
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator qui récupère le user de la requête
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
