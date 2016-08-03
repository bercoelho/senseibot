(function() {

  var utils = require('./utils.js');
  var wanikani = require('../scripts/wanikani.js');

  function registerWanikaniToken(slackRequest, slackResponse, token) {
    wanikani.registerToken(slackRequest.body.user_name, token, function() {
      utils.postToSlack(slackResponse, slackRequest.body.user_name + ', your token is ' + token + ' now!');
    });
  }

  module.exports = registerWanikaniToken;

})();
