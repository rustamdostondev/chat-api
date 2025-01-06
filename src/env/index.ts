import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const PORT: number = +process.env.PORT || 5001;
const PG_HOST = process.env.PG_HOST || '';
const PG_PORT = +process.env.PG_PORT || 5432;
const PG_DB = process.env.PG_DB || '';
const PG_USER = process.env.PG_USER || '';
const PG_PASS = process.env.PG_PASS || '';

const ACCESS_TOKEN_USER = process.env.JWT_SECRET;
const ACCESS_TOKEN_DOCTOR = process.env.JWT_SECRET + 'doctor';
const ACCESS_TOKEN_EXPIRATION =
  process.env.JWT_ACCESS_TOKEN_EXPIRATION || '10h';
const REFRESH_TOKEN_EXPIRATION =
  process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d';

const REDIS_HOST = process.env.REDIS_HOST || '';
const REDIS_PASS = process.env.REDIS_PASS || '';
const REDIS_PORT = process.env.REDIS_PORT || '';
const REDIS_DB = process.env.REDIS_DB || '0';

const NODE_ENV = process.env.NODE_ENV || 'production';

// Minio config
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || '';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || '';
const MINIO_BUCKET = process.env.MINIO_BUCKET || '';
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || '';
const MINIO_PORT = process.env.MINIO_PORT || '';

export {
  NODE_ENV,
  PG_DB,
  PG_HOST,
  PG_PASS,
  PG_PORT,
  PG_USER,
  PORT,
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PORT,
  ACCESS_TOKEN_USER,
  ACCESS_TOKEN_DOCTOR,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
};
