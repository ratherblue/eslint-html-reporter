var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

module.exports = function (results, config) {
  'use strict';

  // fetch and compile template
  var source = fs.readFileSync(path.join(__dirname, 'reporter.hbs'),
    { encoding: 'utf-8' }
  );

  var summaryTemplate = fs.readFileSync(path.join(__dirname, 'summary.hbs'),
    { encoding: 'utf-8' }
  );

  handlebars.registerPartial('summary', handlebars.compile(summaryTemplate));

  handlebars.registerHelper('row', function(context, options) {

    var className = '';

    console.log(context);

    if (context.errors) {
      className = 'danger';
    } else if (context.warnings) {
      className = 'warning';
    } else {
      className = 'success';
    }

    return '<tr class="' + className + '">' + options.fn(this) + '</tr>';
  });

  var template = handlebars.compile(source);
  //var summary = handles.compile(summaryTemplate);

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

  data = JSON.parse(data);


  // summarize messages
  var summary = {
    files: results.length,
    messages: 0,
    errors: 0,
    warnings: 0
  };

  var fileSummary = [];

  results.forEach(function(result) {
    var messages = result.messages;

    summary.messages += messages.length;

    var fileData = {
      file: result.filePath,
      errors: 0,
      warnings: 0
    };

    messages.forEach(function(message) {
      if (message.severity === 2) {
        summary.errors += 1;
        fileData.errors += 1;
      } else if (message.severity === 1) {
        summary.warnings += 1;
        fileData.warnings += 1;
      }
    });

    fileSummary.push(fileData);
  });

  fileSummary.sort(sortSummary);

  data.summary = summary;
  data.fileSummary = fileSummary;

  var html = template(data);

  fs.writeFileSync(path.join(__dirname, 'report.html'), html);

  function sortSummary(a, b) {
    return (b.errors - a.errors);
  }

  return html;
};
