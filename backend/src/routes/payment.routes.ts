import { Router } from "express";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import { io } from "../server.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET!);

router.post("/checkout", async (req, res) => {
  const { items, total } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "usd",
    automatic_payment_methods: { enabled: true }
  });

  io.emit("sale:update", { items, total });

  res.json({ clientSecret: paymentIntent.client_secret });
});

router.get("/receipt/pdf", (req, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Shigosag POS Receipt");
  doc.moveDown();
  doc.text("Thank you for your purchase!");
  doc.end();
});

export default router;