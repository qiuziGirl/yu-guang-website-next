import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL 环境变量未设置");
  }
  const parsed = new URL(url);

  const poolConfig: Record<string, unknown> = {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    connectionLimit: 5,
  };

  // SSL 配置
  const sslEnabled = process.env.DATABASE_SSL === "true";
  if (sslEnabled) {
    const sslConfig: Record<string, string | boolean> = {
      // 如果需要验证服务器证书，提供 CA 证书
    };
    const ca = process.env.DATABASE_SSL_CA;
    if (ca) {
      sslConfig.ca = ca;
    }
    const cert = process.env.DATABASE_SSL_CERT;
    if (cert) {
      sslConfig.cert = cert;
    }
    const key = process.env.DATABASE_SSL_KEY;
    if (key) {
      sslConfig.key = key;
    }
    // 默认 rejectUnauthorized 为 true，除非显式设置为 false
    if (process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false") {
      sslConfig.rejectUnauthorized = true;
    }
    poolConfig.ssl = sslConfig;
  }

  const adapter = new PrismaMariaDb(poolConfig);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
