const nodemailer = require('nodemailer');
const logger = require('../config/logger');
const env = require('../config/env');

let cachedTransporter = null;

function isSmtpEnabled() {
  return Boolean(env.SMTP_ENABLED);
}

function getTransporter() {
  if (!isSmtpEnabled()) {
    return null;
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.warn('SMTP is enabled but credentials are missing.');
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return cachedTransporter;
}

async function sendEmail({ to, subject, text, html, from }) {
  if (!isSmtpEnabled()) {
    return { skipped: true, reason: 'SMTP disabled' };
  }

  const transporter = getTransporter();

  if (!transporter) {
    return { skipped: true, reason: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: from || env.SMTP_FROM || env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    logger.info('Email sent: %s', info.messageId);
    return { skipped: false, info };
  } catch (error) {
    logger.error('Email send failed: %s', error.message);
    return { skipped: false, error };
  }
}

function buildWelcomeEmail(user) {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'there';
  const subject = 'Welcome to Education System';
  const text = `Hi ${displayName},\n\nYour account has been created.\n\nThanks,\nEducation System`;

  return { subject, text };
}

async function sendWelcomeEmail(user) {
  if (!user || !user.email) {
    return { skipped: true, reason: 'Missing user email' };
  }

  const { subject, text } = buildWelcomeEmail(user);
  return sendEmail({ to: user.email, subject, text });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
};
