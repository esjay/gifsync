var functions = require('firebase-functions');
var getVisualUrl = require('./parse').getVisualUrl;

// https://firebase.google.com/docs/hosting/functions

exports.preview = functions.https.onRequest((req, res) => {
  res.status(200).send(`<!doctype html>
    <head>
      <title>GifSync</title>
    </head>
    <body>
      ${getVisualUrl(req.query)}
    </body>
  </html>`);
});