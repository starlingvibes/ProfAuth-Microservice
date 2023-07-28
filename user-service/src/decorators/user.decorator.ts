// import { createParamDecorator } from '@nestjs/common';

// export const AuthUser = createParamDecorator((data, req) => {
//   return req.user;
// });

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
