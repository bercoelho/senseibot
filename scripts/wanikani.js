(function() {

  var fs = require('fs');
  var request = require('request');

  var WANIKANI_TOKENS = {};

  function registerToken(username, token, callback) {
    WANIKANI_TOKENS[username] = token;
    callback();
  }

  function getProgression(username, callback) {
    var token = WANIKANI_TOKENS[username];

    if (!token) {
      callback(new Error('Undefined token'), undefined);
      return;
    }

    request('https://www.wanikani.com/api/user/' + token + '/level-progression', function(error, response, dataString) {
      if (error) {
        callback(error, undefined);
        return;
      }

      var data = JSON.parse(dataString);
      if (data.error) {
        callback(new Error(data.error.message), undefined);
        return;
      }

      callback(null, data);
    });
  }

  module.exports = {
    registerToken: registerToken,
    getProgression: getProgression
  };

})();
