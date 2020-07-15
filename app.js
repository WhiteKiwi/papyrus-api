const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Hello, wolrd!');
});

app.listen(app.get('port'), () => {
  console.log('TODO API Server listening on port ' + app.get('port'));
});

module.exports = app;
