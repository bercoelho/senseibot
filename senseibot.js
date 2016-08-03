(function() {

  var bodyParser = require('body-parser');
  var express = require('express');

  var variables = require('./variables.js');

  var echo = require('./commands/echo.js');
  var getWanikaniProgression = require('./commands/getWanikaniProgression.js');
  var kanjiMeaning = require('./commands/kanjiMeaning.js');
  var kanjiReading = require('./commands/kanjiReading.js');
  var registerWanikaniToken = require('./commands/registerWanikaniToken.js');
  var wordMeaning = require('./commands/wordMeaning.js');
  var wordReading = require('./commands/wordReading.js');
  var utils = require('./commands/utils.js');

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function (slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.SLACK_TOKEN) {
      var command = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();

      var parsed = false;
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^kanji meaning (.)$/, kanjiMeaning);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^kanji reading (.)$/, kanjiReading);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^word meaning (.*)$/, wordMeaning);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^word reading (.*)$/, wordReading);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^wanikani token (.*)$/, registerWanikaniToken);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^wanikani progression$/, getWanikaniProgression);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^(.*)$/, echo);
    }
  });

  app.listen(7001, function () {
    console.log('senseibot app listening on port 7001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}());
