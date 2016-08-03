(function() {

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  function getKanjiInformation(kanji, callback) {
    request('http://jisho.org/search/' + encodeURI(kanji) + '%20%23kanji', function(error, response, data) {
      if (error) {
        callback(error, undefined);
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(data);
      var meaningNodes = select(doc, '//div[@class="kanji-details__main-meanings"]');
      var readingNodes = select(doc, '//div[@class="kanji-details__main-readings"]');

      var meaningNodes = select(meaningNodes[0], './text()');
      var kunYomiNodes = select(readingNodes[0], './/*[contains(@class, "kun_yomi")]//a/text()');
      var onYomiNodes = select(readingNodes[0], './/*[contains(@class, "on_yomi")]//a/text()');

      var kanjiInformation = {
        meanings: [],
        readings: {
          kunYomi: [],
          onYomi: []
        }
      };

      for (var i = 0; i < meaningNodes.length; ++i) {
        var meaningNode = meaningNodes[i];
        kanjiInformation.meanings.push(meaningNode.data.replace(/\s+/g, ' ').trim());
      }

      for (var i = 0; i < kunYomiNodes.length; ++i) {
        var kunYomiNode = kunYomiNodes[i];
        kanjiInformation.readings.kunYomi.push(kunYomiNode.data.replace(/\s+/g, ' ').trim());
      }

      for (var i = 0; i < onYomiNodes.length; ++i) {
        var onYomiNode = onYomiNodes[i];
        kanjiInformation.readings.onYomi.push(onYomiNode.data.replace(/\s+/g, ' ').trim());
      }

      callback(null, kanjiInformation);
    });
  }

  function getWordInformation(word, callback) {
    request('http://jisho.org/search/' + encodeURI(word), function(error, response, data) {
      if (error) {
        callback(error, undefined);
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(data);
      var detailsLink = select(doc, '//a[@class="light-details_link"]/@href[1]')[0].value;

      request(detailsLink, function(error, response, data) {
        if (error) {
          callback(error, undefined);
          return;
        }

        var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(data);
        var conceptNode = select(doc, '//div[contains(@class, "concept_light-representation")][1]')[0];

        var meaningNodes = select(doc, '//span[@class="meaning-meaning"]/text()');
        var furiganaNodes = select(conceptNode, './/span[@class="furigana"]/node()').filter(function(node) { return node.toString().trim().length != 0 });
        var textNodes = select(conceptNode, './/span[@class="text"]/node()').filter(function(node) { return node.toString().trim().length != 0 });

        var wordInformation = {
          meanings: [],
          reading: '',
          inflection: ''
        }

        for (var i = 0; i < meaningNodes.length; ++i) {
          var meaningNode = meaningNodes[i];
          wordInformation.meanings.push(meaningNode.toString().replace(/\s+/g, ' ').trim());
        }

        for (var i = 0; i < textNodes.length; ++i) {
          var textNode = textNodes[i];

          if (textNode.firstChild) {
            wordInformation.reading += textNode.firstChild.data;
          } else {
            wordInformation.reading += '[' + textNode.toString().trim() + ':' + furiganaNodes[i].firstChild.data + ']';
          }
        }

        for (var i = 0; i < textNodes.length; ++i) {
          var textNode = textNodes[i];

          if (textNode.firstChild) {
            wordInformation.inflection += textNode.firstChild.data;
          } else {
            wordInformation.inflection += textNode.toString().trim();
          }
        }

        callback(null, wordInformation);
      });
    });
  }

  module.exports = {
    getKanjiInformation: getKanjiInformation,
    getWordInformation: getWordInformation
  };

})();
