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

function getToken() {
  request
  .post(apiUrl)
  .send({ client_id: clientID, client_secret: clientSecret })
  .end(function(res) {
    xappToken = res.body.token;
    getArtists();
  });
}


function getArtists() {
  api.newRequest()
  .follow('artist')
  .withRequestOptions({
    headers: {
      'X-Xapp-Token': xappToken,
      'Accept': 'application/vnd.artsy-v2+json'
    }
  })
  .withTemplateParameters({ id: 'kate-abercrombie' })
  .getResource(function(error, res) {
    console.log(error);
    console.log(res);
  });
}

getToken();

// Include config file
var T = new Twit(require('./config.js'));
