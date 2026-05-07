const nodemailer = require("nodemailer");

const SMTP = {
  host: "mail.smtp2go.com",
  port: 465,
  secure: true,               // SSL
  auth: {
    user: "oviatech.com",
    pass: process.env.SMTP_PASS || "EZPCFCaFmhR04UlZ",
  },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "allen@oviatech.com";

exports.handler = async (event) => {
  // Only POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Basic CORS so chatbot JS can call this
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, phone, project } = payload;

  if (!name || !email) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card { background: #fff; border-radius: 12px; max-width: 560px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0F172A, #1e293b); padding: 28px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; font-weight: 700; }
    .header p  { color: rgba(255,255,255,0.55); margin: 6px 0 0; font-size: 13px; }
    .badge { display: inline-block; background: #eb4604; color: #fff; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .body { padding: 28px 32px; }
    .row { padding: 12px 0; border-bottom: 1px solid #f0f0f0; display: flex; gap: 12px; }
    .row:last-child { border-bottom: none; }
    .label { color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; width: 90px; flex-shrink: 0; padding-top: 2px; }
    .value { color: #111; font-size: 15px; font-weight: 500; flex: 1; }
    .footer { background: #f8fafc; padding: 16px 32px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f0f0f0; }
    .cta { display: inline-block; margin-top: 20px; background: #eb4604; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">New Lead</span>
      <h1>New Chatbot Lead — Ovia Tech</h1>
      <p>Captured via Aria chatbot on oviatech.com</p>
    </div>
    <div class="body">
      <div class="row">
        <span class="label">Name</span>
        <span class="value">${escHtml(name)}</span>
      </div>
      <div class="row">
        <span class="label">Email</span>
        <span class="value"><a href="mailto:${escHtml(email)}" style="color:#eb4604;">${escHtml(email)}</a></span>
      </div>
      <div class="row">
        <span class="label">Phone</span>
        <span class="value">${escHtml(phone || "Not provided")}</span>
      </div>
      <div class="row">
        <span class="label">Project</span>
        <span class="value">${escHtml(project || "Not provided")}</span>
      </div>
      <div style="text-align:center; margin-top:8px;">
        <a class="cta" href="mailto:${escHtml(email)}?subject=Re: Your Ovia Tech inquiry">Reply to ${escHtml(name)}</a>
      </div>
    </div>
    <div class="footer">Sent by Aria · Ovia Tech chatbot · oviatech.com</div>
  </div>
</body>
</html>`;

  const text =
    `New Lead from Ovia Tech Chatbot\n\n` +
    `Name:    ${name}\nEmail:   ${email}\nPhone:   ${phone || "Not provided"}\nProject: ${project || "Not provided"}\n\n` +
    `Reply directly to ${email}`;

  try {
    const transporter = nodemailer.createTransport(SMTP);
    // Verify SMTP connection before sending
    await transporter.verify();
    console.log("SMTP connection verified OK");
    await transporter.sendMail({
      from:    `"Ovia Tech Chatbot" <hello@oviatech.com>`,
      to:      ADMIN_EMAIL,
      replyTo: email,
      subject: `New Lead from Ovia Tech Chatbot — ${name}`,
      text,
      html,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Email error:", err.message, err.code, err.response);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to send email", detail: err.message }),
    };
  }
};

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
