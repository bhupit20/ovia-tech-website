const nodemailer = require("nodemailer");

const SMTP = {
  host: "mail.smtp2go.com",
  port: 465,
  secure: true,
  auth: {
    user: "oviatech.com",
    pass: process.env.SMTP_PASS || "EZPCFCaFmhR04UlZ",
  },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "allen@oviatech.com";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, company, budget, timeline, message } = body;

  if (!name || !message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Name and message are required" }) };
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card { background: #fff; border-radius: 12px; max-width: 580px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0F172A, #1e293b); padding: 28px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; font-weight: 700; }
    .header p  { color: rgba(255,255,255,0.52); margin: 6px 0 0; font-size: 13px; }
    .badge { display: inline-block; background: #eb4604; color: #fff; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .body { padding: 28px 32px; }
    .row { padding: 12px 0; border-bottom: 1px solid #f0f0f0; display: flex; gap: 12px; }
    .row:last-child { border-bottom: none; }
    .label { color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; width: 110px; flex-shrink: 0; padding-top: 2px; }
    .value { color: #111; font-size: 15px; font-weight: 500; flex: 1; line-height: 1.6; }
    .footer { background: #f8fafc; padding: 16px 32px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f0f0f0; }
    .cta { display: inline-block; margin-top: 20px; background: #eb4604; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">New Inquiry</span>
      <h1>New Contact Form Submission</h1>
      <p>Received via oviatech.com contact form</p>
    </div>
    <div class="body">
      <div class="row">
        <span class="label">Name</span>
        <span class="value">${esc(name)}</span>
      </div>
      ${email ? `<div class="row"><span class="label">Email</span><span class="value"><a href="mailto:${esc(email)}" style="color:#eb4604;">${esc(email)}</a></span></div>` : ""}
      ${company ? `<div class="row"><span class="label">Company</span><span class="value">${esc(company)}</span></div>` : ""}
      ${budget ? `<div class="row"><span class="label">Budget / Type</span><span class="value">${esc(budget)}</span></div>` : ""}
      ${timeline ? `<div class="row"><span class="label">Timeline</span><span class="value">${esc(timeline)}</span></div>` : ""}
      <div class="row">
        <span class="label">Message</span>
        <span class="value">${esc(message).replace(/\n/g, "<br>")}</span>
      </div>
      ${email ? `<div style="text-align:center;margin-top:8px;"><a class="cta" href="mailto:${esc(email)}?subject=Re: Your Ovia Tech inquiry">Reply to ${esc(name)}</a></div>` : ""}
    </div>
    <div class="footer">Sent via Ovia Tech Contact Form · oviatech.com</div>
  </div>
</body>
</html>`;

  const text =
    `New Contact Form Submission — Ovia Tech\n\n` +
    `Name:     ${name}\n` +
    `Email:    ${email || "Not provided"}\n` +
    `Company:  ${company || "Not provided"}\n` +
    `Budget:   ${budget || "Not provided"}\n` +
    `Timeline: ${timeline || "Not provided"}\n\n` +
    `Message:\n${message}`;

  try {
    const transporter = nodemailer.createTransport(SMTP);
    await transporter.verify();

    await transporter.sendMail({
      from:    `"Ovia Tech Website" <hello@oviatech.com>`,
      to:      ADMIN_EMAIL,
      replyTo: email || ADMIN_EMAIL,
      subject: `New Inquiry from ${name} — Ovia Tech`,
      text,
      html,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Contact email error:", err.message, err.code);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to send", detail: err.message }) };
  }
};

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
