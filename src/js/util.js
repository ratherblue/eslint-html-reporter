/**
 * @fileoverview Utils for ESLint HTML reporter
 * @author Evangelia Dendramis
 */
"use strict";

var ciUtil = require("./ci-util.js");


/**
 * Sort files so the ones with the most errors are at the top
 * @param {object} a - Object to compare to b
 * @param {object} b - Object to compare to a
 * @returns {int} - Value used to sort the list of files
 */
exports.sortErrors = function(a, b) {
  return (b.errors - a.errors);
};

/**
 * Sort files with only warnings so the ones with the most warnings are at the top
 * @param {object} a - Object to compare to b
 * @param {object} b - Object to compare to a
 * @returns {int} - Value used to sort the list of files
 */
exports.sortWarnings = function(a, b) {
  return (b.warnings - a.warnings);
};

/**
 * Sort clean files alphabetically
 * @param {object} a - Object to compare to b
 * @param {object} b - Object to compare to a
 * @returns {int} - Value used to sort the list of files
 */
exports.sortClean = function(a, b) {
  if (a.path < b.path) {
    return -1;
  } else if (a.path > b.path) {
    return 1;
  } else {
    return 0;
  }
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

        summary.alerts.errors++;
        file.errors++;

        messageList.push("line " + message.line + ", col " + message.column + ", " + message.message);

      } else if (message.severity === 1) {
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

  ciUtil.reportEnd(ciTool);

  files.sort(this.sortErrors);

  return {
    summary: summary,
    files: files,
    fullReport: fullReport,
    pageTitle: (fullReport ? "ESLint HTML Report" : "ESLint HTML Report (lite)")
  };
};
