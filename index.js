const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const password = require('passport');
const bodyParser = require('body-parser');
const appKeys = require('./config/keys');
require('./models/User');
require('./services/password');

mongoose.connect(appKeys.mongoURI);
// const options = {
//   autoIndex: false, // Don't build indexes
//   reconnectTries: 30, // Retry up to 30 times
//   reconnectInterval: 500, // Reconnect every 500ms
//   poolSize: 10, // Maintain up to 10 socket connections
//   // If not connected, return errors immediately rather than waiting for reconnect
//   bufferMaxEntries: 0
// }
// const connectWithRetry = () => {
//   console.log('MongoDB connection with retry')
//   // mongoose.connection.close();
//   mongoose.connect(appKeys.mongoURI, options).then(()=>{
//     console.log('MongoDB is connected')
//   }).catch(err=>{
//     console.log('MongoDB connection unsuccessful, retry after 5 seconds.', err)
//     setTimeout(connectWithRetry, 5000)
//   })
// }
// connectWithRetry();
const app = express();
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 20 * 20 * 24 * 60 * 60 * 1000,
    keys: [appKeys.cookieKey],
  })
);
app.use(password.initialize());
app.use(password.session());
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
if (process.env.NODE_ENV === 'production') {
  // express will serveup production assets
  // like our main.js file or main.css file
  app.use(express.static('client/build'));

  //express will serve up the index.html file
  // if it doesnot reconize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
// add dynamic port for the production like heruku
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('server running on port no: ' + PORT);
