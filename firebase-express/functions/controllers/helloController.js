const logger = require('firebase-functions/logger');

exports.sayHello = (req, res) => {
  logger.info('Hello logs!', {structuredData: true});
  res.send('Hello from Firebase!');
};
