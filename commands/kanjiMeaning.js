(function() {

  var jisho = require('../scripts/jisho.js');
  var utils = require('./utils.js');

  function kanjiMeaning(slackRequest, slackResponse, kanji) {
    jisho.getKanjiInformation(kanji, function(error, kanjiInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
        return;
      }

      if (kanjiInformation.meanings.length > 0) {
        utils.postToSlack(slackResponse, kanji + ' means ' + kanjiInformation.meanings.join(', '));
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  module.exports = kanjiMeaning;

}());
