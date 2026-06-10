import "dotenv/config";
import http from "http";
import chalk from "chalk";
import boxen from "boxen";
import { app } from "./app.js";
import { Server } from "socket.io";
import Stripe from "stripe";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup Socket.IO
export const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log(chalk.green(`🔌 Client connected: ${socket.id}`));
});

// -------------------------
// STRIPE SETUP
// Not currently in use, reserved for future real Stripe integration
// -------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Route to create PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Payment intent creation failed" });
  }
});

// -------------------------
// Animated startup spinner
// -------------------------
const frames = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
let i = 0;

const spinner = setInterval(() => {
  process.stdout.write(`\r${chalk.red(frames[i++ % frames.length])} Starting Shigosag POS...`);
}, 80);

server.listen(PORT, () => {
  setTimeout(() => {
    clearInterval(spinner);
    process.stdout.write("\r"); // clear spinner

    const banner = boxen(
      [
        chalk.red.bold("🚀 Shigosag POS Backend Running"),
        "",
        chalk.cyan(`🌐 Port: ${PORT}`),
        chalk.yellow("⚡ Powered by Shigosag")
      ].join("\n"),
      { padding: 1, margin: 1, borderStyle: "round", borderColor: "red" }
    );

    console.log(banner);
  }, 2000);
});