import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CookieMiddleware implements NestMiddleware {W
  use(req: any, res: any, next: () => void) {
    const allowedDomains: string[] = ['https://padel-point.vercel.app'];
    const originDomain: string = req.headers.origin;

    if (!allowedDomains.includes(originDomain)) {
      return res.status(403).send({ message: 'Padel Point API - Forbidden Recourse.', origin: originDomain});
    }

    next();
  }
}
