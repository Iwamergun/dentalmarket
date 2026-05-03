import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { siteConfig } from '@/lib/constants/site-config'

let _transporter: Transporter | null = null

/** Create (and cache) a nodemailer SMTP transporter from environment variables. */
function getTransporter(): Transporter {
  if (_transporter) return _transporter

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  })

  return _transporter
}

export interface EmailAttachment {
  filename: string
  content: Buffer
  contentType: string
}

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  attachments?: EmailAttachment[]
}

/**
 * Send an email via the configured SMTP transport.
 * Throws if the transport is not configured or if sending fails.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const transport = getTransporter()

  await transport.sendMail({
    from:
      process.env.SMTP_FROM ??
      `"${siteConfig.name}" <${siteConfig.contact.email}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
  })
}

/**
 * Returns true when all required SMTP environment variables are present.
 * Use this guard before calling sendEmail to avoid runtime errors.
 */
export function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  )
}
