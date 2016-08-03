(function() {

  var jisho = require('../scripts/jisho.js');
  var utils = require('./utils.js');

  function wordMeaning(slackRequest, slackResponse, word) {
    jisho.getWordInformation(word, function(error, wordInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + word + '? I don\'t know it either!');
        return;
      }

      if (wordInformation.reading.length > 0) {
        var reading = '';

        if (word !== wordInformation.inflection) {
          reading += word + ' looks like an inflection of ' + wordInformation.inflection + '\nIts reading is ' + wordInformation.reading;
        } else {
          reading += word + '\'s reading is ' + wordInformation.reading;
        }

        utils.postToSlack(slackResponse, reading);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + word + '? I don\'t know it either!');
      }
    });
  }

  module.exports = wordMeaning;

}());
