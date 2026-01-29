import nodemailer from 'nodemailer';

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async verifyConnection() {
    try {
      await this._transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error.message);
      throw new Error(`Failed to connect to SMTP server: ${error.message}`);
    }
  }

  async sendEmail(targetEmail, content) {
    try {
      const message = {
        from: 'OpenMusic API',
        to: targetEmail,
        subject: 'Ekspor Playlist',
        text: 'Terlampir hasil dari ekspor playlist',
        attachments: [
          {
            filename: 'playlist.json',
            content,
          },
        ],
      };

      const result = await this._transporter.sendMail(message);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

export default MailSender;
