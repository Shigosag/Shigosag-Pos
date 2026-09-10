import "dotenv/config";
import http from "http";
import chalk from "chalk";
import boxen from "boxen";
import { app } from "./app.js";
import { initSocket } from "./lib/socket.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

export const io = initSocket(server);

server.listen(PORT, () => {
  const banner = boxen(
    [
      chalk.cyan.bold("🚀 Shigosag POS Backend Running"),
      "",
      chalk.blue(`🌐 Port: ${PORT}`),
      chalk.green("🔒 Security & Ledger Engine Active"),
      chalk.magenta("⚡ Database & Real-Time Sync Ready")
    ].join("\n"),
    { padding: 1, margin: 1, borderStyle: "round", borderColor: "cyan" }
  );
  console.log(banner);
});

const gracefulShutdown = async (signal: string) => {
  console.log(chalk.yellow(`\nReceived ${signal}. Shutting down gracefully...`));
  server.close(async () => {
    try {
      await (prisma as any).$disconnect?.();
      console.log(chalk.green("PostgreSQL Database connection closed."));
      process.exit(0);
    } catch (e) {
      console.error(chalk.red("Error during shutdown:"), e);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
