import amqp from 'amqplib';

const ProducerService = {
  sendMessage: async (queue, message) => {
    let connection;
    try {
      connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));

      console.log(`Message sent to queue ${queue}`);

      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      console.error('RabbitMQ Producer Error:', error.message);
      if (connection) {
        await connection.close();
      }
      throw new Error(`Failed to send message to queue: ${error.message}`);
    }
  },
};

export default ProducerService;
