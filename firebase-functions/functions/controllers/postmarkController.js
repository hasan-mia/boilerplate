/* eslint-disable require-jsdoc */
const logger = require('firebase-functions/logger');
const axios = require('axios');
const {POSTMARK_SERVER_TOKEN} = require('../constant');

exports.postmarkWebhook = async (req, res, next) => {
  const {textBody, threadID, recipients, subject, message} = req.body;
  try {
    const isFirstEmail = threadID === null;
    const containsString = textBody.includes('specified_string');

    if (isFirstEmail && containsString) {
      const recipientList = recipients || [];
      await sendBatchResponse(recipientList, subject, message);
    }

    res.status(200).send('Webhook received and processed successfully.');
  } catch (error) {
    logger.error(error.message, {structuredData: true});
    res.status(500).send('Internal server error');
  }
};

// Function to send batch response using Postmark API
async function sendBatchResponse(recipients, subject, message) {
  try {
    const response = await axios.post(
        'https://api.postmarkapp.com/email/batch',
        {
          Messages: recipients.map((recipient) => ({
            From: 'admin@ensellers.com',
            To: recipient,
            Subject: subject,
            TextBody: message,
          })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN,
          },
        },
    );

    console.log('Batch response sent successfully:', response.data);
    // logger.info(response.data, {structuredData: true});
  } catch (error) {
    logger.error(error.message, {structuredData: true});
  }
}
