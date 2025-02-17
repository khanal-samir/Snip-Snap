import { PrismaClient } from "@prisma/client";

// DOUBLE TYPE ASSERTION
// // Step 1: Remove all type information from globalThis
// const step1 = globalThis as unknown;

// // Step 2: Add our new type definition
// const globalForPrisma = step1 as {
//   prisma: PrismaClient | undefined;
// };
// global object similar to window object for nodejs

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "query"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// to prevent duplication of prisma client in development due to hot reloading

export default prisma;
