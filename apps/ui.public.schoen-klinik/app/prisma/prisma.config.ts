import 'dotenv/config';
import path from 'node:path';
import { defineConfig, type PrismaConfig, env } from 'prisma/config';

const prismaConfig = {
  schema: path.join('schema.prisma'),
  migrations: {
    path: 'prisma/migrations',
  },
  // engine: "classic",
  datasource: {
    url: env('DATABASE_URL'),
  },
} satisfies PrismaConfig;

export default defineConfig(prismaConfig);
