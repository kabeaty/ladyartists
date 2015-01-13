var request = require('request');

// for Twitter
var conf = require('./config.js');
var Twitter = require('node-twitter');
var twitterRestClient = new Twitter.RestClient(
  conf.consumer_key,
  conf.consumer_secret,
  conf.access_token,
  conf.access_token_secret
);
var Twit = require('twit');
var T = new Twit(require('./config.js'));

// for Artsy requests
var request = require('superagent');
var traverson = require('traverson');
var api = traverson.jsonHal.from('https://api.artsy.net/api/');
var clientID = '80f24fbda1ca089c92e8',
    clientSecret = 'd26c0ef2d239f4e2d2e178fb5866b58a',
    apiUrl = 'https://api.artsy.net/api/tokens/xapp_token',
    xappToken;

// artist ids
var artist_ids = [
  "mary-abbott",
  "kate-abercrombie",
  "katrina-abbott",
  "michele-abeles",
  "jenny-abell",
  "gertrude-abercrombie",
  "barbro-aberg",
  "etti-abergel",
  "inbal-abergil",
  "zarouhie-abdalian",
  "abigail-goldman",
  "sara-abdu",
  "nina-chanel-abney",
  "angela-abbott",
];

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

// pick an artist to tweet about at random
var artist_to_get = artist_ids.pick();
var tweet_to_tweet;
var twitter_image;

function getToken() {
  request
  .post(apiUrl)
  .send({ client_id: clientID, client_secret: clientSecret })
  .end(function(res) {
    xappToken = res.body.token;
    getArtistInfo();
  });
}

// get info on that artist
function getArtistInfo() {
  api.newRequest()
  .follow('artist')
  .withRequestOptions({
    headers: {
      'X-Xapp-Token': xappToken,
      'Accept': 'application/vnd.artsy-v2+json'
    }
  })
  .withTemplateParameters({ id: artist_to_get })
  .getResource(function(error, res) {
    if (res) {
      console.log(res);
      if (res.name) {
        tweet_to_tweet = res.name;
        tweet_to_tweet += ' is an artist.';
        console.log(tweet_to_tweet);
      }
      if (res.nationality) {
        tweet_to_tweet += ' She is ';
        tweet_to_tweet += res.nationality;
        tweet_to_tweet += '.';
      }
      if (res._links.permalink.href) {
        tweet_to_tweet += ' ' + res._links.permalink.href;
      }
      if (res._links.thumbnail.href) {
        if (res._links.thumbnail.href == '/assets/shared/missing_image.png') {
          twitter_image = undefined;
        } else {
          twitter_image = res._links.thumbnail.href;
        }
      }
    }
    tweet_it_out(tweet_to_tweet, twitter_image);
  });
}

function tweet_it_out(tweet_to_tweet, twitter_image) {
  console.log(tweet_to_tweet, twitter_image);
  // if (twitter_image) {
  //   twitterRestClient.statusesUpdateWithMedia({
  //     'status': tweet_to_tweet,
  //     'media[]': twitter_image.toString()
  //   });
  // } else {
    T.post('statuses/update', { status: tweet_to_tweet }, function(err, reply) {
        if (err) {
          console.log('error:', err);
        }
        else {
          console.log('reply:', reply);
        }
      });
  // }
}

getToken();
