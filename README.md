# HttpLoggerMiddleware

HttpLoggerMiddleware is a configurable middleware for logging HTTP requests and responses in a NestJS application. It provides detailed information about incoming requests and completed responses, including the method, URL, status code, and processing duration.

## Features

- Logs incoming HTTP request details.
- Logs response details, including the status code and duration.
- Configurable log messages for both incoming and completed requests.
- Differentiates between successful and error responses for better debugging.

## Installation

Install the package using npm or yarn:

```bash
npm install @samofprog/nestjs-http-logger
```

or

```bash
yarn add @samofprog/nestjs-http-logger
```

## Usage

### Importing the Middleware

To use the `HttpLoggerMiddleware`, import it in your module and configure it in the middleware consumer.

```typescript
import {Module, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {HttpLoggerMiddleware} from 'your-package-name';

@Module({
    imports: [],
    controllers: [],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(HttpLoggerMiddleware({
                incomingRequestMessage: (method, url) => `Received: ${method} ${url}`,
                completedRequestMessage: (method, url, statusCode, durationMs) =>
                    `Handled: ${method} ${url} - ${statusCode} (${durationMs} ms)`
            }))
            .forRoutes({path: '*', method: RequestMethod.ALL});
        
        //or 
        
        consumer
            .apply(HttpLoggerMiddleware())
    }
}
```

### Using with `app.use`

The `HttpLoggerMiddleware` can also be used directly with the `app.use` method in a NestJS application:

```typescript
import {HttpLoggerMiddleware} from 'your-package-name';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(HttpLoggerMiddleware({
        incomingRequestMessage: (method, url) => `Received: ${method} ${url}`,
        completedRequestMessage: (method, url, statusCode, durationMs) =>
            `Handled: ${method} ${url} - ${statusCode} (${durationMs} ms)`
    }));

    // or

    app.use(HttpLoggerMiddleware());


    await app.listen(3000);
}

bootstrap();
```

### Middleware Options

The middleware accepts an optional `HttpLoggerOptions` object to customize the log messages. If not provided, default messages will be used.

#### `HttpLoggerOptions` Interface

```typescript
export interface HttpLoggerOptions {
  incomingRequestMessage?: (method: string, url: string) => string;
  completedRequestMessage?: (
    method: string,
    url: string,
    statusCode: number,
    durationMs: string
  ) => string;
}
```

- `incomingRequestMessage`: A function that generates the log message for incoming requests. Receives `method` and `url` as parameters.
- `completedRequestMessage`: A function that generates the log message for completed requests. Receives `method`, `url`, `statusCode`, and `durationMs` as parameters.

### Example

#### Default Usage

```typescript
consumer
  .apply(HttpLoggerMiddleware())
  .forRoutes({ path: '*', method: RequestMethod.ALL });
```

This will log messages with the following formats:

- Incoming request: `Incoming Request: GET /example`
- Completed request: `Completed Request: GET /example - 200 (123.45 ms)`

#### Custom Messages

```typescript
consumer
  .apply(HttpLoggerMiddleware({
    incomingRequestMessage: (method, url) => `>>> ${method} ${url} >>>`,
    completedRequestMessage: (method, url, statusCode, durationMs) =>
      `<<< ${method} ${url} <<< Status: ${statusCode}, Time: ${durationMs}ms`,
  }))
  .forRoutes({ path: '*', method: RequestMethod.ALL });
```

This will log messages with custom formats, e.g.,

- Incoming request: `>>> GET /example >>>`
- Completed request: `<<< GET /example <<< Status: 200, Time: 123.45ms`

## License

This package is open-source and available under the [MIT License](LICENSE).

