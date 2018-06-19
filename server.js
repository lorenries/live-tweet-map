// server.js
// where your node app starts

// init project
var express = require('express');
var Twit = require('twit');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('dotenv').load();

// listen for requests :)
var listener = http.listen(process.env.PORT || 8080, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

// authenticate to twitter
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  strictSSL: true
});

// on new websocket connections, send twitter stream to clients
io.on('connection', function(socket) {
  var config = {
    locations: '-180,-90,180,90'
  };
  var stream = twitter.stream('statuses/filter', config);

  stream.on('tweet', function(tweet) {
    if (tweet.geo) {
      var package = {
        text: tweet.text,
        followers: tweet.user.followers_count,
        geo: tweet.geo,
        coordinates: tweet.coordinates
      };
      socket.volatile.emit('tweet', package);
    }
  });

  stream.on('error', error => {
    console.log(error);
  });

  socket.on('disconnect', function() {
    stream.stop();
  });
});

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('client/public'));

// // http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + 'client/public/index.html');
});
