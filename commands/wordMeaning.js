(function() {

  var jisho = require('../scripts/jisho.js');
  var utils = require('./utils.js');

  function wordMeaning(slackRequest, slackResponse, word) {
    jisho.getWordInformation(word, function(error, wordInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
        return;
      }

      var meaning = '';

      if (wordInformation.meanings.length > 0) {
        if (word !== wordInformation.inflection) {
          meaning += word + ' looks like an inflection of ' + wordInformation.inflection + '\nIts meanings are:\n';
        } else {
          meaning += word + '\'s meanings are:\n';
        }

        for (var i = 0; i < wordInformation.meanings.length; ++i) {
          if (i > 0) {
            meaning += '\n';
          }

          meaning += (i + 1) + '. ' + wordInformation.meanings[i];
        }

        utils.postToSlack(slackResponse, meaning);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
      }
    });
  }

  module.exports = wordMeaning;

}());
