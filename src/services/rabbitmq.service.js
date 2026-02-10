const rabbit = require('amqplib');
const config = require("../../config/local.json");
const {
    postDocument,
    deleteDocument
} = require('./elasticsearch.service');

const QUEUE_NAME = config.RABBITMQ_QUEUE_NAME;
const EXCHANGE_TYPE = config.RABBITMQ_EXCHANGE_TYPE || "direct";
const EXCHANGE_NAME = config.RABBITMQ_EXCHANGE_NAME || "plan_events";
const KEY = config.RABBITMQ_KEY;

let channel;

(() => {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || config.RABBITMQ_URL || 'amqp://localhost';
    const connection = rabbit.connect(RABBITMQ_URL);
    connection.then(async (conn) => {
        channel = await conn.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE);
        await channel.assertQueue(QUEUE_NAME);
        channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, KEY);
        console.log('RabbitMQ connected successfully');
    }).catch((err) => {
        console.error('RabbitMQ connection error:', err.message);
        console.error('Please ensure RabbitMQ is running on', RABBITMQ_URL);
    });
})();

const producer = (content) => {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(content)));
    setInterval(() => {
        consumer();
    }, 1000);
}

const consumer = async () => {
    return await channel.consume(QUEUE_NAME, async (message) => {
        const content = message.content.toString();
        await channel.ack(message);

        const {
            operation,
            body
        } = JSON.parse(content);

        if (operation === "STORE") {
            await postDocument(body);
        } else if (operation === "DELETE") {
            await deleteDocument(body);
        }
    })
}

module.exports = {
    producer,
    consumer
}