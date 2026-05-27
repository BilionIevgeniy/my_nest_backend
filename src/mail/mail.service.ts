import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendContactFormDto } from './dto/send-contact-form.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize Gmail SMTP transport
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for port 465, false for other ports
      connectionTimeout: 10000,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP connection failed:', error.message);
      } else {
        this.logger.log('✅ SMTP connection established');
      }
    });
  }

  async sendContactEmail(dto: SendContactFormDto): Promise<{ success: boolean; message: string }> {
    const { name, email, message } = dto;
    const receiver = this.configService.get<string>('CONTACT_RECEIVER_EMAIL');

    // Build HTML email structure
    const htmlContent = `
      <h2>📩 New message from portfolio contact form</h2>
      <p><b>Sender name:</b> ${name}</p>
      <p><b>Sender email:</b> ${email}</p>
      <br />
      <p><b>Message:</b></p>
      <div style="padding: 15px; background-color: #f5f5f5; border-radius: 5px; border-left: 4px solid #007bff;">
        ${message.replace(/\n/g, '<br />')}
      </div>
    `;

    try {
      this.logger.log(`Attempting to send email from ${email}...`);

      await this.transporter.sendMail({
        from: `"Portfolio Contact Form" <${this.configService.get<string>('SMTP_USER')}>`,
        to: receiver,
        subject: `📩 New email from ${name}`,
        replyTo: email,
        html: htmlContent,
      });

      this.logger.log(`Email from ${email} successfully delivered.`);
      return { success: true, message: 'Email successfully sent!' };
    } catch (error: unknown) {
      this.logger.error('Error sending email via Nodemailer:', error instanceof Error ? error.message : error);
      throw new InternalServerErrorException('Failed to send email. Please try again later.');
    }
  }
}
