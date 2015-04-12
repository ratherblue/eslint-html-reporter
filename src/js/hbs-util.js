/**
 * @fileoverview Handlebars Utils for ESLint HTML Reporter
 * @author Evangelia Dendramis
 */
'use strict';

var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');


/**
* Adds appropriate class name to a row
* @param {object} context - Data passed to the helper
* @param {object} options - Nested data
* @returns {string} - Table row with appropriate class name
*/
exports.rowHelper = function(context, options) {
  var className = 'success';

  if (context.errors) {
    className = 'danger';
  } else if (context.warnings) {
    className = 'warning';
  }

  return '<tr class="' + className + '">' + options.fn(this) + '</tr>';
};

/**
* Adds appropriate class name to a message row
* @param {object} context - Data passed to the helper
* @param {object} options - Nested data
* @returns {string} - Table row with appropriate class name
*/
exports.messageRow = function(context, options) {
  var className = '';

  if (context.severity === 2) {
    className = 'msg-danger';
  } else if (context.severity === 1) {
    className = 'msg-warning';
  }

  return '<tr class="' + className + '">' + options.fn(this) + '</tr>';
};

/**
* Format severity number into text
* @param {object} context - Data passed to the helper
* @returns {string} - Severity as text
*/
exports.formatSeverity = function(context) {
  if (context.severity === 2) {
    return 'Error';
  } else if (context.severity === 1) {
    return 'Warning';
  } else {
    return '';
  }
};

/**
* Register Handlebars partials
* @returns {void}
*/
exports.registerPartials = function() {

  var partialsPath = path.join(__dirname, '..', 'templates', 'partials');

  // top summary
  var summary = fs.readFileSync(path.join(partialsPath, 'summary.hbs'),
    { encoding: 'utf-8' }
  );

  // file breakdown
  var fileBreakdown = fs.readFileSync(path.join(partialsPath, 'file-breakdown.hbs'),
    { encoding: 'utf-8' }
  );

  // occurances
  var occurances = fs.readFileSync(path.join(partialsPath, 'occurances.hbs'),
    { encoding: 'utf-8' }
  );

  // css
  var css = fs.readFileSync(path.join(partialsPath, 'css.hbs'),
    { encoding: 'utf-8' }
  );

  // js
  var js = fs.readFileSync(path.join(partialsPath, 'js.hbs'),
    { encoding: 'utf-8' }
  );

  handlebars.registerPartial({
    summary: handlebars.compile(summary),
    fileBreakdown: handlebars.compile(fileBreakdown),
    occurances: handlebars.compile(occurances),
    js: handlebars.compile(js),
    css: handlebars.compile(css)
  });
};

/**
* Register Handlebars helpers
* @returns {void}
*/
exports.registerHelpers = function() {
  handlebars.registerHelper('row', this.rowHelper);
  handlebars.registerHelper('messageRow', this.messageRow);
  handlebars.registerHelper('formatSeverity', this.formatSeverity);
};

/**
* Apply handlebars template to data
* @param {object} data - Data to parse with Handlebars template
* @returns {string} - HTML-formatted report
*/
exports.applyTemplates = function(data) {
  this.registerHelpers();
  this.registerPartials();

  var overview = fs.readFileSync(path.join(__dirname, '..', 'templates', 'reporter.hbs'),
    { encoding: 'utf-8' }
  );

  var template = handlebars.compile(overview);

  return template(data);
};
