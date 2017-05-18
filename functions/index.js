var functions = require('firebase-functions');

// https://firebase.google.com/docs/hosting/functions

exports.preview = functions.https.onRequest((req, res) => {
  res.status(200).send(`<!doctype html>
    <head>
      <title>${JSON.stringify(req.query)}</title>
    </head>
    <body>
      ${JSON.stringify(req.query)}
    </body>
  </html>`);
});