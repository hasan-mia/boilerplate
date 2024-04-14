const {onRequest} = require('firebase-functions/v2/https');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const {API_PREFIX} = require('./constant.js');

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// all routes
const hello = require('./routes/helloRoutes');
const postmark = require('./routes/postmarkRoutes');

// site status
app.get(`${API_PREFIX}/health`, (_, res) => {
  res.send('OK : Server is running');
});

app.use(`${API_PREFIX}`, hello);
app.use(`${API_PREFIX}`, postmark);

// Expose Express app as a Firebase Function
exports.api = onRequest(app);
