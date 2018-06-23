// server.js

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
      var tweetPackage = {
        text: tweet.text,
        followers: tweet.user.followers_count,
        geo: tweet.geo,
        coordinates: tweet.coordinates
      };
      socket.volatile.emit('tweet', tweetPackage);
    }
  });

  stream.on('error', error => {
    console.log(error);
  });

  socket.on('disconnect', function() {
    stream.stop();
  });
});
