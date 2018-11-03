const redis = require('redis');
const logger = require('../../helpers/logger');
const Config = require('../../../config');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

exports.end = (request, response) => {
  // client.flushdb((err, succeeded) => {
  //   console.log(succeeded); // will be true if successfull
  // });
  const winners = [];
  client.keys('*', (err, keys) => {
    if (err) return console.log(err);
    console.log(keys);
    keys.forEach((key) => {
      client.get(key, (err, value) => {
        console.log(value);
        winners.push(value);
      });
    });
    response.customSuccess(winners);
  });
};
