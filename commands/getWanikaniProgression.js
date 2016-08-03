(function() {

  var utils = require('./utils.js');
  var wanikani = require('../scripts/wanikani.js');

  function getWanikaniProgression(slackRequest, slackResponse) {
    wanikani.getProgression(slackRequest.body.user_name, function (error, progression) {
      if (error) {
        utils.postToSlack(slackResponse, slackRequest.body.user_name + ', there was an error: ' + error.message);
        return;
      }

      var progressionPost = slackRequest.body.user_name + ', your progression is:\n';
      progressionPost += 'Level: ' + progression.user_information.level + '\n';
      progressionPost += 'Radicals: ' + progression.requested_information.radicals_progress + '/' + progression.requested_information.radicals_total + '\n';
      progressionPost += 'Kanjis: ' + progression.requested_information.kanji_progress + '/' + progression.requested_information.kanji_total + '\n';

      utils.postToSlack(slackResponse, progressionPost);
    });
  }

  module.exports = getWanikaniProgression;

})();
