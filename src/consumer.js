import 'dotenv/config';

import amqp from 'amqplib';
import { Pool } from 'pg';

import PlaylistsServiceExport from './services/postgres/PlaylistsServiceExport.js';
import MailSender from './customize/MailSender.js';
import Listener from './customize/Listener.js';

const init = async () => {
  try {
    // Database connection
    const pool = new Pool();
    const client = await pool.connect();
    console.log('Consumer: Database PostgreSQL connected');
    client.release();

    // SMTP verification
    const mailSender = new MailSender();
    await mailSender.verifyConnection();

    // RabbitMQ connection
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    console.log('Consumer: RabbitMQ connected');

    const channel = await connection.createChannel();
    await channel.assertQueue('export:playlists', { durable: true });

    const playlistsService = new PlaylistsServiceExport(pool);
    const listener = new Listener(playlistsService, mailSender);

    console.log('Consumer is running and waiting for messages...');

    channel.consume('export:playlists', listener.listen, { noAck: true });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nClosing consumer...');
      await channel.close();
      await connection.close();
      await pool.end();
      process.exit(0);
    });
  } catch (error) {
    console.error('Consumer initialization failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

init();
