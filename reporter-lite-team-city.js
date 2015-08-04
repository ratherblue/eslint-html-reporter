/**
 * @fileoverview ESLint HTML 'Lite' reporter
 */

var LintReporter = require('./src/js/lint-reporter');
var templateUtils = require('hairballs').templateUtils;


module.exports = function(results) {
  var lintReporter = new LintReporter();
  var data = lintReporter.runReport(results, false, true);

  return templateUtils.applyTemplates(data);
};
