# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2025-01-13

### Added
- Introduced the `create` static method for easier instantiation of `HttpLoggerMiddleware`.
- Added support for a custom logger by providing a `logger` option in `HttpLoggerOptions`.
- Enhanced documentation with examples for using a custom logger and the `create` method.

### Changed
- Updated middleware implementation to use the `logger` option, allowing integration with the application's global or custom logger.

## [1.0.1] - 2025-01-07
### Added
- Added keywords in `package.json` to optimize search results.

### Fixed
- Corrected an issue with the middleware that caused it to behave incorrectly with Fastify.

### Removed
- Removed unit tests to rewrite them later with improved coverage and structure.

### Updated
- Updated project documentation and README.

## [1.0.0] - 2025-01-06
### Added
- Initial release of the `http-logger-middleware` package for NestJS.
- Middleware to log HTTP requests and responses in a customizable manner.
- Support for logging incoming requests with HTTP method and URL.
- Support for logging completed requests with HTTP method, URL, status code, and duration.
- Customizable messages for logging using `HttpLoggerOptions`.
- Optional configuration for error logging for requests with status codes >= 300.
- Added MIT License to the project.

### Changed
- N/A

### Fixed
- N/A
