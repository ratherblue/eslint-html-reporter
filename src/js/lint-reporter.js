/**
 * @fileoverview SCSS Lint HTML reporter
 */


var TeamCityLogger = require('hairballs').TeamCityLogger;
var hairballs = require('hairballs');


function LintReporter() {

  /**
   * Update summary of individual file
   * @param {object} file - File object
   * @param {object} message - Alert object
   * @returns {object} - Updated file
   */
  this.summarizeFile = function(file, message) {

    var ruleUrl = this.ruleUrl + message.ruleId;

    message.ruleUrl = ruleUrl;

    if (message.severity === 2) {
      file.errors++;

      file.errorList.push('line ' + message.line + ', col ' + message.column + ', ' + message.message);
    } else if (message.severity === 1) {
      file.warnings++;
    }

    hairballs.updateOccurance(message.ruleId, message.severity, ruleUrl);

    file.messages.push(message);

    return file;
  };

  /**
   * Summarizes the data
   * @param {object} results - JSON object
   * @returns {void}
   */
  this.summarizeData = function(results) {

    var teamCityLogger = new TeamCityLogger('ESLint');
    teamCityLogger.reportStart();


    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var fileName = result.filePath;
      var messages = result.messages;
      var file = { path: fileName, errors: 0, warnings: 0, messages: [], errorList: [] };

      teamCityLogger.testStart(fileName);

      for (var x = 0; x < messages.length; x++) {
        var message = messages[x];

        hairballs.updateAlertSummary(message);
        file = this.summarizeFile(file, message);
      }

      if (file.errorList.length) {
        teamCityLogger.testFailed(fileName, file.errorList);
      }

      teamCityLogger.testEnd(fileName);
      hairballs.updateFileSummary(file);

      // remove messages so that handlebars doesn't print links in the report
      // @todo get rid of handlebars
      if (!this.fullReport) {
        file.messages = null;
      }
    }

    teamCityLogger.reportEnd();

    // output team city report to the console
    if (this.useTeamCityReport) {
      console.log(teamCityLogger.reportOutput.join('\n'));
    }
  };

  /**
   * Starts the Linting Report
   * @param {object} data - Data object
   * @param {boolean} fullReport - Whether or not to include the full report
   * @param {boolean} useTeamCityReport - Whether or not to output to TeamCity
   * @returns {object} - Object used to send to template for parsing
   */
  this.runReport = function(data, fullReport, useTeamCityReport) {

    this.fullReport = fullReport;
    this.useTeamCityReport = useTeamCityReport;

    this.summarizeData(data);

    hairballs.files.sort(hairballs.sortErrors);

    hairballs.errorOccurances.sort(hairballs.sortOccurances);
    hairballs.warningOccurances.sort(hairballs.sortOccurances);

    return {
      fileSummary: hairballs.fileSummary,
      alertSummary: hairballs.alertSummary,
      files: hairballs.files,
      fullReport: this.fullReport,
      errorOccurances: hairballs.errorOccurances,
      warningOccurances: hairballs.warningOccurances,
      pageTitle: 'ESLint Results' + (this.fullReport ? '' : ' (lite)')
    };
  };

  // initialization
  // @todo: probably a better way to organize this
  this.fullReport = true;
  this.useTeamCityReport = false;
  this.ruleUrl = 'http://eslint.org/docs/rules/';
}

module.exports = LintReporter;
