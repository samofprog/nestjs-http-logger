
# HttpLoggerMiddleware

HttpLoggerMiddleware is a configurable middleware for logging HTTP requests and responses in a NestJS application. It provides detailed information about incoming requests and completed responses, including the method, URL, status code, and processing duration. You can now also ignore specific paths from being logged.

## Features

- Logs detailed information about incoming HTTP requests (method, URL, headers).
- Logs detailed information about completed responses, including:
  - HTTP status code.
  - Precise processing duration in milliseconds.
- Supports custom log messages for incoming and completed requests.
- Allows the use of a custom logger (`LoggerService`) or defaults to NestJS's global logger.
- Differentiates between successful responses (logged as `log`) and error responses (logged as `error`) for better debugging.
- Allows ignoring specific paths using `ignorePaths`.
- Easy integration with both default and custom configurations.
- **Framework Compatibility**: Seamless integration with both Express and Fastify frameworks.

## Installation

Install the package using npm or yarn:

```bash
npm install @samofprog/nestjs-http-logger 
# or  
yarn add @samofprog/nestjs-http-logger
```

## Usage

The `HttpLoggerMiddleware` can be used directly with the `app.use` method in a NestJS application:

```typescript
import {HttpLoggerMiddleware} from '@samofprog/nestjs-http-logger';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(HttpLoggerMiddleware.create({
        incomingRequestMessage: (details) => 
            `Received: ${details.method} ${details.url}`,
        completedRequestMessage: (details) =>
            `Handled: ${details.method} ${details.url} - ${details.statusCode} (${details.durationMs} ms)`,
        ignorePaths: ['/health', '/metrics']  // Paths to ignore in logs
    }));

    // or

    app.use(HttpLoggerMiddleware.create());

    await app.listen(3000);
}

bootstrap();
```

### Middleware Options

The middleware accepts an optional `HttpLoggerOptions` object to customize the log messages. If not provided, default messages will be used.

#### `HttpLoggerOptions` Interface

```typescript
export interface HttpLoggerOptions {
  logger?: LoggerService; // NestJS LoggerService
  ignorePaths?: string[]; // List of paths to ignore for logging
  incomingRequestMessage?: (details: {
    method: string;
    url: string;
    headers: Record<string, string | string[] | undefined>;
  }) => string;
  completedRequestMessage?: (details: {
    method: string;
    url: string;
    statusCode: number;
    durationMs: string;
  }) => string;
}
```

- `incomingRequestMessage`: A function that generates the log message for incoming requests. Receives `method` and `url` as parameters.
- `completedRequestMessage`: A function that generates the log message for completed requests. Receives `method`, `url`, `statusCode`, and `durationMs` as parameters.
- `logger`: An optional custom logger implementing the `LoggerService` interface from NestJS. If not provided, a default `Logger` will be used.


### Example

#### Default Usage

```typescript
app.use(HttpLoggerMiddleware.create());
```

This will log messages with the following formats:

- Incoming request: `Incoming Request: GET /example - Headers: {"user-agent":"Mozilla/5.0","accept":"*/*"}`
- Completed request: `Completed Request: GET /example - Status: 200 - Duration: 123.45 ms`

#### Custom Messages

```typescript
app.use(HttpLoggerMiddleware.create({
    incomingRequestMessage: (details) => 
        `Received: ${details.method} ${details.url}`,
    completedRequestMessage: (details) =>
        `Handled: ${details.method} ${details.url} - ${details.statusCode} (${details.durationMs} ms)`
}));
```

This will log messages with custom formats, e.g.,

- Incoming request: `>>> GET /example >>>`
- Completed request: `<<< GET /example <<< Status: 200, Time: 123.45ms`

#### Custom Logger

If you want to use your own logger instead of the default NestJS logger, you can pass it via the `logger` option:

```typescript
import { Logger } from '@nestjs/common';

const customLogger = new Logger('CustomLogger');

app.use(HttpLoggerMiddleware.create({ logger: customLogger }));
```


## License

This package is open-source and available under the [MIT License](https://mit-license.org/).