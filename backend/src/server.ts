import "dotenv/config";
import http from "http";
import chalk from "chalk";
import boxen from "boxen";
import { app } from "./app.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

export const io = new Server(server, { cors: { origin: "*" } });

const frames = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
let i = 0;

const spinner = setInterval(() => {
  process.stdout.write(`\r${chalk.cyan(frames[i++ % frames.length])} Starting Shigosag POS...`);
}, 80);

server.listen(PORT, () => {
  setTimeout(() => {
    clearInterval(spinner);
    process.stdout.write("\r"); 

    const banner = boxen(
      [
        chalk.cyan.bold("🚀 Shigosag POS Backend Running"),
        "",
        chalk.blue(`🌐 Port: ${PORT}`),
        chalk.indigo?.("⚡ Powered by Shigosag Terminal") || chalk.blue("⚡ Powered by Shigosag")
      ].join("\n"),
      { padding: 1, margin: 1, borderStyle: "round", borderColor: "cyan" }
    );

    console.log(banner);
  }, 2000);
});
