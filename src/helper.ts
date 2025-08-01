import { HttpLoggerOptions } from './types';
import { Logger } from '@nestjs/common';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';

export function createHttpLoggerMiddleware(
    options: Partial<HttpLoggerOptions> = {}
) {
    const middleware = new HttpLoggerMiddleware({
        logger: new Logger(HttpLoggerMiddleware.name),
        ...options,
    });
    return middleware.use.bind(middleware);
}
