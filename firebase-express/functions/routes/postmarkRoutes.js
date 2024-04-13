const express = require('express');
const {postmarkWebhook} = require('../controllers/postmarkController');

const router = express.Router();

router.post('/postmark', postmarkWebhook);

module.exports = router;
