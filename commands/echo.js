(function() {

  var utils = require('./utils.js');

  function echo(slackRequest, slackResponse, command) {
    utils.postToSlack(slackResponse, '今日は、' + slackRequest.body.user_name + '！ You said: [' + command  + ']');
  }

  module.exports = echo;

})();
