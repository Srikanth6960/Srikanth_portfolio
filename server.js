require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MAIL_TO = process.env.MAIL_TO || 'tejavathsrikanth60@gmail.com';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const transporter = SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
  : null;

app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  const origin = req.get('origin');
  const isLocalOrigin = origin && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);

  if (isLocalOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS' && isLocalOrigin) {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.static(__dirname));

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'Backend is running.' });
});

app.post('/api/contact', async (req, res) => {
  const body = req.body;
  const fields = ['name', 'email', 'subject', 'message'];

  if (!body || fields.some((field) => typeof body[field] !== 'string' || !body[field].trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please complete all fields before sending the message.'
    });
  }

  const data = Object.fromEntries(fields.map((field) => [field, body[field].trim()]));
  const limits = { name: 120, email: 254, subject: 200, message: 5000 };

  if (fields.some((field) => data[field].length > limits[field])) {
    return res.status(400).json({
      success: false,
      message: 'One or more fields exceed the allowed length.'
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  if (/[\r\n]/.test(data.subject)) {
    return res.status(400).json({
      success: false,
      message: 'The subject must be a single line.'
    });
  }

  if (!transporter) {
    return res.status(503).json({
      success: false,
      message: 'Email is not configured on the server. Add SMTP settings to the .env file.'
    });
  }

  try {
    await transporter.sendMail({
      from: SMTP_USER,
      replyTo: data.email,
      to: MAIL_TO,
      subject: `Portfolio contact: ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      `
    });

    return res.json({
      success: true,
      message: `Thanks ${data.name.split(' ')[0]}, your message has been sent.`
    });
  } catch (error) {
    console.error('Failed to send portfolio contact email:', error);
    return res.status(502).json({
      success: false,
      message: 'The email service could not send your message. Please try again later.'
    });
  }
});

app.use('/api', (_, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

app.use((error, req, res, next) => {
  if (!req.path.startsWith('/api/')) return next(error);

  const status = error.status === 413 ? 413 : 400;
  const message = status === 413
    ? 'The request is too large.'
    : 'The request body must be valid JSON.';

  return res.status(status).json({ success: false, message });
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio backend running at http://localhost:${PORT}`);
});
