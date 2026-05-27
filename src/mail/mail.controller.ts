import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendContactFormDto } from './dto/send-contact-form.dto';

@Controller('mail') // Base route: /mail
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('contact') // Endpoint: POST /mail/contact
  @HttpCode(HttpStatus.OK) // Return 200 OK instead of default 201 Created, as we're not creating anything in the database
  async sendContactForm(@Body() sendContactFormDto: SendContactFormDto) {
    return await this.mailService.sendContactEmail(sendContactFormDto);
  }
}
