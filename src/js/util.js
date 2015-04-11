/**
 * @fileoverview Utils for ESLint HTML reporter
 * @author Evangelia Dendramis
 */
"use strict";

var ciUtil = require("./ci-util.js");


var errorOccurances = [];
var warningOccurances = [];

/**
 * Sort files so the ones with the most errors are at the top
 * @param {object} a - Object to compare to b
 * @param {object} b - Object to compare to a
 * @returns {int} - Value used to sort the list of files
 */
exports.sortErrors = function(a, b) {
  if (b.errors === 0 && a.errors === 0) {
    if (b.warnings === 0 && a.warnings === 0) {
      if (a.path < b.path) {
        return -1;
      } else if (a.path > b.path) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return (b.warnings - a.warnings);
    }
  } else {
    if (b.errors === a.errors) {
      return (b.warnings - a.warnings);
    } else {
      return (b.errors - a.errors);
    }
  }
};

var sortFunc = function(a, b) {
  return b[1] - a[1];
};

/**
 * Count the occurances of an error
 * @param {string} key - Linting rule
 * @returns {void}
 */
var addErrorOccurance = function(key) {

  if (!errorOccurances[key]) {
    errorOccurances[key] = 0;
  }

  errorOccurances[key]++;
};

/**
 * Count the occurances of a warning
 * @param {string} key - Linting rule
 * @returns {void}
 */
var addWarningOccurance = function(key) {

  if (!warningOccurances[key]) {
    warningOccurances[key] = 0;
  }

  warningOccurances[key]++;
};

/**
 * Summarize reported data
 * @param {object} results - Data to parse with Handlebars template
 * @param {boolean} fullReport - Whether or not to print the full report
 * @param {string} ciTool - Optional, currently only option is "teamCity"
 * @returns {object} - HTML-formatted report
 */
exports.summarizeData = function(results, fullReport, ciTool) {

  // summarize messages
  var summary = {
    alerts: {
      errors: 0,
      warnings: 0,
      total: 0
    },
    files: {
      errors: 0,
      warnings: 0,
      clean: 0,
      total: results.length
    },
    errorTypes: {}
  };

  ciUtil.reportStart(ciTool);

  var files = [];

  results.forEach(function(result) {

    var messages = result.messages;

    summary.alerts.total += messages.length;

    var file = {
      path: result.filePath,
      errors: 0,
      warnings: 0
    };

    if (fullReport) {
      file.messages = messages;
    }

    ciUtil.testStart(result.filePath, ciTool);

    var messageList = [];

    messages.forEach(function(message) {

      if (message.severity === 2) {
        addErrorOccurance(message.ruleId);

        summary.alerts.errors++;
        file.errors++;

        messageList.push("line " + message.line + ", col " + message.column + ", " + message.message);
      } else if (message.severity === 1) {
        addWarningOccurance(message.ruleId);

        summary.alerts.warnings++;
        file.warnings++;
      }
    });

    if (messageList.length) {
      ciUtil.testFailed(result.filePath, messageList, ciTool);
    }

    ciUtil.testEnd(result.filePath, ciTool);

    if (file.errors) {
      summary.files.errors++;
    } else if (file.warnings) {
      summary.files.warnings++;
    } else {
      summary.files.clean++;
    }

    files.push(file);
  });

  var foonew = [];

  for (var obj in errorOccurances) {
    foonew.push([obj, errorOccurances[obj]]);
    console.log(errorOccurances[obj]);
  }

  foonew.sort(sortFunc);

  console.log(foonew);
  ciUtil.reportEnd(ciTool);

  files.sort(this.sortErrors);

  return {
    summary: summary,
    files: files,
    fullReport: fullReport,
    errorOccurances: foonew,
    pageTitle: (fullReport ? "ESLint HTML Report" : "ESLint HTML Report (lite)")
  };
};
