import 'dotenv/config';

import MailSender from './customize/MailSender.js';

const testMailConnection = async () => {
  try {
    console.log('Testing SMTP connection...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);

    const mailSender = new MailSender();
    await mailSender.verifyConnection();

    console.log('\n✓ SMTP connection test passed!');
    console.log('Mailtrap is configured correctly and ready to send emails.');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ SMTP connection test failed!');
    console.error('Error:', error.message);
    console.error('\nPlease check your .env file and ensure:');
    console.error('- SMTP_HOST is correct');
    console.error('- SMTP_PORT is correct');
    console.error('- SMTP_USER is valid');
    console.error('- SMTP_PASSWORD is correct');

    process.exit(1);
  }
};

testMailConnection();
