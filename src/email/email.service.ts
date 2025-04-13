import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private config: ConfigService) {
    this.transporter = createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM'),
      to,
      subject,
      html,
    });
  }
  async notify(to: string, orderId: string, status: string): Promise<void> {
    const subject = `Order Status Update - Order #${orderId}`;
    const html = `
      <h1>Order Status Update</h1>
      <p>Your order #${orderId} status has been updated to: ${status}</p>
      <p>You can check your order status in your account dashboard.</p>
    `;

    await this.sendEmail(to, subject, html);
  }
}
