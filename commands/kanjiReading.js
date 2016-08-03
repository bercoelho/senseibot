(function() {

  var jisho = require('../scripts/jisho.js');
  var utils = require('./utils.js');

  function kanjiReading(slackRequest, slackResponse, kanji) {
    jisho.getKanjiInformation(kanji, function(error, kanjiInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
        return;
      }

      if (kanjiInformation.readings.kunYomi.length > 0 || kanjiInformation.readings.onYomi.length > 0) {
        var readings = kanji + ' readings:\n';

        if (kanjiInformation.readings.kunYomi.length > 0) {
          readings += '- Kun-yomi: ' + kanjiInformation.readings.kunYomi.join(', ');
        }

        if (kanjiInformation.readings.onYomi.length > 0) {
          readings += '- On-yomi: ' + kanjiInformation.readings.onYomi.join(', ');
        }

        utils.postToSlack(slackResponse, readings);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  module.exports = kanjiReading;

}());
