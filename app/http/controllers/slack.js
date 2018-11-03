const { IncomingWebhook } = require('@slack/client');
const logger = require('../../helpers/logger');
const redis = require("redis");
const Config = require('../../../config');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);
const lotteryKey = process.env.LOTTERY_KEY;


exports.connect = (request, response) => {
  webhook.send('Hello there', (err, res) => {
    if (err) {
      console.log('Error:', err);
    } else {
      // console.log('Message sent: ', res);
      response.customSuccess(res);
    }
  });
};

exports.buyin = (request, response) => {
  // console.log(request.body)

  const text = request.body.event.text.replace('<@UDW82H33R> ', '').split(' ');
  const { user } = request.body.event;
  const userName = text[0];

  let slackMsg = false;
  if (text[1] === lotteryKey) {

    client.get('winners', (err, winnersArray) => {
      console.log(winnersArray);
      if (!winnersArray) winnersArray = {};
      winnersArray.push({ user: userName });
      client.set('winners', winnersArray, (error, data) => {
        if (error) console.log(error);
        console.log(data)
      });
    });

    slackMsg = `Thanks Dude ({${userName}) Good Luck!`;
  } else {
    slackMsg = `Sorry Dude (${userName}) Νο massage today!`;
  }
  webhook.send(slackMsg, (err, res) => {
    if (err) {
      logger.error(err);
    } else {
      response.customSuccess(res);
    }
  });
};
