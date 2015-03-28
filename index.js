var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

module.exports = function (results, config) {
  'use strict';

  // fetch and compile template
  var source = fs.readFileSync(path.join(__dirname, 'reporter.hbs'),
    { encoding: 'utf-8' }
  );

  var template = handlebars.compile(source);

  var data = JSON.stringify(
    {
      config: config,
      results: results
    },
    function (key, val) {
      // filter away the Esprima AST
      if (key !== 'node') {
        return val;
      }
    }
  );

  var html = template(JSON.parse(data));

  return html;
};
