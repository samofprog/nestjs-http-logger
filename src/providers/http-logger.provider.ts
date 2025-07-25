import { Provider } from '@nestjs/common';
import { HttpLoggerAsyncOptions, HttpLoggerModuleOptions } from '../types';
import {
    HTTP_LOGGER_OPTIONS,
    HttpLoggerMiddleware,
} from '../middleware/http-logger.middleware';

export function createHttpLoggerProviders(
    options: HttpLoggerModuleOptions = {}
): Provider[] {
    return [
        {
            provide: HTTP_LOGGER_OPTIONS,
            useValue: options,
        },
        HttpLoggerMiddleware,
    ];
}

export function createHttpLoggerAsyncProviders(
    options: HttpLoggerAsyncOptions
): Provider[] {
    return [
        {
            provide: HTTP_LOGGER_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        },
        HttpLoggerMiddleware,
    ];
}
