# 📡 HttpLoggerMiddleware

[![npm version](https://img.shields.io/npm/v/@samofprog/nestjs-logstack.svg)](https://www.npmjs.com/package/@samofprog/nestjs-http-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

HttpLoggerMiddleware is a powerful and configurable middleware for logging HTTP requests and responses in your NestJS
application.  
It provides detailed logs about incoming requests and completed responses, including HTTP method, URL, headers, response
status, and processing duration.  
Additional features include masking sensitive headers, ignoring specific paths, and supporting custom loggers.

## ✨ Features

| Feature                                  | Description                                                    |
|------------------------------------------|----------------------------------------------------------------|
| 📥 Detailed request and response logging | Logs HTTP method, URL, headers, status codes, and duration     |
| 🔒 Sensitive header masking              | Allows masking sensitive headers like Authorization or Cookie  |
| 🚫 Path ignoring                         | Ignore logging on specific paths                               |
| 📝 Custom log message formatting         | Customize incoming and completed request log messages          |
| 🛠 Custom logger support                 | Use your own LoggerService or fallback to NestJS global logger |
| ⚠️ Log level distinction                 | Successful responses logged with `log`, errors with `error`    |
| ⚙️ Framework compatibility               | Works with both Express and Fastify                            |
| 🎛️ Configurable logging levels          | Control what data to log: headers, request body, response data |

## 📦 Installation

Install the package using npm or yarn:

```bash
npm install @samofprog/nestjs-http-logger
# or
yarn add @samofprog/nestjs-http-logger
```

---

## 🚀 Usage

Use the middleware in your NestJS bootstrap file:

```typescript
import { HttpLoggerMiddleware } from '@samofprog/nestjs-http-logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(HttpLoggerMiddleware.create());

  await app.listen(3000);
}
bootstrap();
```

## ⚙️ Usage with Custom Configuration

You can customize the middleware behavior with options:

```typescript
app.use(HttpLoggerMiddleware.create({
  ignorePaths: ['/health', '/metrics'],
  sensitiveHeaders: ['authorization', 'cookie'],
  sanitizeHeaders: (headers) => {
    const sanitized = { ...headers };
    ['authorization', 'cookie'].forEach(key => {
      if (sanitized[key]) sanitized[key] = '[REDACTED]';
    });
    return sanitized;
  },
  incomingRequestMessage: (details) =>
    `Incoming: ${details.method} ${details.url} → headers: ${JSON.stringify(details.headers)}`,
  completedRequestMessage: (details) =>
    `Completed: ${details.method} ${details.url} ← status ${details.statusCode} in ${details.durationMs} ms`,
}));
```

---

## 🛠 Options

| Option                    | Type                                                    | Description                                                                                                    | Default                       |
|---------------------------|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|-------------------------------|
| `logger`                  | `LoggerService`                                         | Custom logger implementing NestJS `LoggerService` interface.                                                   | NestJS default logger         |
| `ignorePaths`             | `string[]`                                              | List of URL paths to ignore from logging.                                                                      | `[]`                          |
| `sensitiveHeaders`        | `string[]`                                              | List of header names to mask in logs (case-insensitive).                                                       | `[]`                          |
| `sanitizeHeaders`         | `(headers: Record<string, any>) => Record<string, any>` | Function to transform headers before logging (e.g., to mask values).                                           | Identity function (no change) |
| `incomingRequestMessage`  | `(details) => string`                                   | Function returning the log message for incoming requests. Receives `{ method, url, headers, body }`.           | Default formatted string      |
| `completedRequestMessage` | `(details) => string`                                   | Function returning the log message for completed requests. Receives `{ method, url, statusCode, durationMs, responseData }`. | Default formatted string      |
| `logHeaders`              | `boolean`                                               | Whether to include headers in the log messages.                                                                | `true`                        |
| `logRequestBody`          | `boolean`                                               | Whether to include request body in the log messages.                                                           | `false`                       |
| `logResponseData`         | `boolean`                                               | Whether to include response data in the log messages.                                                          | `false`                       |

---

## 🧩 Examples

### 🚫 Ignore paths and 🔒 mask sensitive headers

```typescript
app.use(HttpLoggerMiddleware.create({
  ignorePaths: ['/health', '/metrics'],
  sensitiveHeaders: ['authorization', 'cookie'],
}));
```

### 🧼 Custom sanitization of headers

```typescript
app.use(HttpLoggerMiddleware.create({
  sanitizeHeaders: (headers) => {
    const sanitized = { ...headers };
    if (sanitized['authorization']) sanitized['authorization'] = '[TOKEN REDACTED]';
    if (sanitized['cookie']) sanitized['cookie'] = '[COOKIE REDACTED]';
    return sanitized;
  }
}));
```

### 🎛️ Configure logging levels

```typescript
app.use(HttpLoggerMiddleware.create({
  logHeaders: true,        // Include headers in logs (default: true)
  logRequestBody: true,    // Include request body in logs (default: false)
  logResponseData: true,   // Include response data in logs (default: false)
}));
```

### 🛠 Custom logger

```typescript
import { Logger } from '@nestjs/common';

const customLogger = new Logger('MyCustomLogger');

app.use(HttpLoggerMiddleware.create({ logger: customLogger }));
```

## 📄 License

This package is open-source and available under the [MIT License](https://mit-license.org/).