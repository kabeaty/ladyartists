var request = require('request');
// Twitter library
var Twit = require('twit');

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
  "luciana-abait",
  "barbro-aberg",
  "etti-abergel",
  "inbal-abergil",
  "zarouhie-abdalian",
  "abigail-goldman",
  "sara-abdu",
  "christine-aaron",
  "nina-chanel-abney",
  "angela-abbott",
  "bernice-abbott"
]

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

// pick an artist to tweet about at random
var artist_to_get = artist_ids.pick();
var tweet_to_tweet;

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
      if (res.name) {
        tweet_to_tweet = res.name;
        tweet_to_tweet += ' is an artist';
        console.log(tweet_to_tweet);
      }
    }
  });
}

getToken();

// Include config file
var T = new Twit(require('./config.js'));
