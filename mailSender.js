const nodemailer = require("nodemailer");

// Simple in-memory rate limiter to avoid sending duplicate emails rapidly to same recipient
const lastSent = new Map();
const COOLDOWN_MS = 30 * 1000; // 30 seconds

async function mailSender(from, receiver, subject, message, options = {}) {
  // basic rate-limiting per recipient
  const now = Date.now();
  const last = lastSent.get(receiver) || 0;
  if (now - last < COOLDOWN_MS) {
    const err = new Error('Rate limit: email to this recipient was sent recently');
    err.code = 'RATE_LIMIT';
    throw err;
  }

  let transporter = nodemailer.createTransport({
    host: "mail.hublinkexpress.com",
    secureConnection: true,
    tls: {
      rejectUnauthorized: false,
    },
    port: 465,
    auth: {
      user: "noreply@hublinkexpress.com",
      pass: "Dx19Si[81R!hrS",
    },
  });

  // create a plain-text fallback if none provided by stripping tags
  const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, '');
  const textFallback = options.text || stripHtml(message);

  const mailOptions = {
    from,
    to: receiver,
    subject,
    html: message,
    text: textFallback,
  };

  // optional Reply-To and List-Unsubscribe header
  if (options.replyTo) mailOptions.replyTo = options.replyTo;
  mailOptions.headers = mailOptions.headers || {};
  if (options.listUnsubscribe) mailOptions.headers['List-Unsubscribe'] = options.listUnsubscribe;

  // send mail
  const info = await transporter.sendMail(mailOptions);

  // update lastSent timestamp
  lastSent.set(receiver, Date.now());

  return info;
}

module.exports.mailSender = mailSender;
