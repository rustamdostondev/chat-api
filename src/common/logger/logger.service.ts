import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Request } from 'express';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const esTransportOpts = {
      level: 'info',
      clientOpts: {
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      },
      indexPrefix: 'logs-eduplus',
      dataStream: true,
      op_type: 'create',
      source: 'eduplus-api',
      transformer: (logData: any) => {
        return {
          '@timestamp': new Date().toISOString(),
          severity: logData.level,
          fields: {
            ...logData.meta,
            environment: process.env.NODE_ENV || 'development',
            service: 'eduplus-api',
          },
          message: logData.message,
          error: logData.error,
          trace: {
            userId: logData.userId,
            requestId: logData.requestId,
            correlationId: logData.correlationId,
          },
          http: {
            method: logData.method,
            url: logData.url,
            userAgent: logData.userAgent,
            ip: logData.ip,
          },
        };
      },
    };

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: {
        service: 'logs-eduplus',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: [new ElasticsearchTransport(esTransportOpts)],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const userId = meta.userId || 'anonymous';
              const requestId = meta.requestId || '-';
              return `[${timestamp}] ${level} [${userId}] [${requestId}]: ${message}`;
            }),
          ),
        }),
      );
    }
  }

  private extractRequestInfo(request?: Request) {
    if (!request) {
      return {
        userId: 'system',
        requestId: `req_${Date.now()}`,
        correlationId: `corr_${Date.now()}`,
      };
    }

    let userId = 'anonymous';

    // Try to get user_id from request.user first
    if ((request as any).user?.id) {
      userId = (request as any).user.id;
    }

    return {
      userId,
      requestId: request.headers['x-request-id'] || `req_${Date.now()}`,
      correlationId:
        request.headers['x-correlation-id'] || `corr_${Date.now()}`,
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.get('user-agent'),
      params: request.params,
      query: request.query,
      body: this.sanitizeBody(request.body),
    };
  }

  private sanitizeBody(body: any) {
    if (!body) return null;
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });
    return sanitized;
  }

  error(message: string, error: any, request?: Request) {
    const requestInfo = this.extractRequestInfo(request);
    const errorInfo = {
      message,
      level: 'error',
      timestamp: new Date().toISOString(),
      ...requestInfo,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        details: error?.details,
        type: error?.constructor?.name,
      },
      context: {
        functionName: (new Error().stack || '').split('\n')[2]?.trim(),
      },
    };

    this.logger.error(errorInfo);

    console.log(error);
  }

  warn(message: string, meta?: any, request?: Request) {
    const requestInfo = this.extractRequestInfo(request);
    this.logger.warn({
      message,
      level: 'warn',
      timestamp: new Date().toISOString(),
      ...meta,
      ...requestInfo,
    });
  }

  info(message: string, meta?: any, request?: Request) {
    const requestInfo = this.extractRequestInfo(request);
    this.logger.info({
      message,
      level: 'info',
      timestamp: new Date().toISOString(),
      ...meta,
      ...requestInfo,
    });
  }

  debug(message: string, meta?: any, request?: Request) {
    const requestInfo = this.extractRequestInfo(request);
    this.logger.debug({
      message,
      level: 'debug',
      timestamp: new Date().toISOString(),
      ...meta,
      ...requestInfo,
    });
  }
}
