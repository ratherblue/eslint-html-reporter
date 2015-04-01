/**
 * @fileoverview Utils for ESLint HTML reporter
 * @author Evangelia Dendramis
 */
"use strict";

var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");


//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Sorting function
 * @param {object} a - Object to compare to b
 * @param {object} b - Object to compare to a
 * @returns {int} - Value used to sort the list of files
 */
exports.sortSummary = function(a, b) {
  return (b.errors - a.errors);
};

/**
 * Adds appropriate class name to a row
 * @param {object} context - Data passed to the helper
 * @param {object} options - Nested data
 * @returns {string} - Table row with appropriate class name
 */
exports.rowHelper = function(context, options) {
  var className = "success";

  if (context.errors) {
    className = "danger";
  } else if (context.warnings) {
    className = "warning";
  }

  return "<tr class=\"" + className + "\">" + options.fn(this) + "</tr>";
};

/**
 * Adds appropriate class name to a message row
 * @param {object} context - Data passed to the helper
 * @param {object} options - Nested data
 * @returns {string} - Table row with appropriate class name
 */
exports.messageRow = function(context, options) {
  var className = "";

  if (context.severity === 2) {
    className = "msg-danger";
  } else if (context.severity === 1) {
    className = "msg-warning";
  }

  return "<tr class=\"" + className + "\">" + options.fn(this) + "</tr>";
};

/**
 * Format severity number into text
 * @param {object} context - Data passed to the helper
 * @returns {string} - Severity as text
 */
exports.formatSeverity = function(context) {
  if (context.severity === 2) {
    return "Error";
  } else if (context.severity === 1) {
    return "Warning";
  } else {
    return "";
  }
};

/**
 * Register Handlebars partials
 * @returns {void}
 */
exports.registerPartials = function() {
  // top summary
  var summary = fs.readFileSync(path.join(__dirname, "partials", "summary.hbs"),
    { encoding: "utf-8" }
  );

  // file breakdown
  var fileBreakdown = fs.readFileSync(path.join(__dirname, "partials", "file-breakdown.hbs"),
    { encoding: "utf-8" }
  );

  // css
  var css = fs.readFileSync(path.join(__dirname, "partials", "css.hbs"),
    { encoding: "utf-8" }
  );

  // js
  var js = fs.readFileSync(path.join(__dirname, "partials", "js.hbs"),
    { encoding: "utf-8" }
  );

  handlebars.registerPartial({
    summary: handlebars.compile(summary),
    fileBreakdown: handlebars.compile(fileBreakdown),
    js: handlebars.compile(js),
    css: handlebars.compile(css)
  });
};

/**
 * Register Handlebars helpers
 * @returns {void}
 */
exports.registerHelpers = function() {
  handlebars.registerHelper("row", this.rowHelper);
  handlebars.registerHelper("messageRow", this.messageRow);
  handlebars.registerHelper("formatSeverity", this.formatSeverity);
};

/**
 * Apply handlebars template to data
 * @param {object} data - Data to parse with Handlebars template
 * @returns {string} - HTML-formatted report
 */
exports.applyTemplates = function(data) {
  this.registerHelpers();
  this.registerPartials();

  var overview = fs.readFileSync(path.join(__dirname, "reporter.hbs"),
    { encoding: "utf-8" }
  );

  var template = handlebars.compile(overview);

  return template(data);
};


/**
 * Summarize reported data
 * @param {object} results - Data to parse with Handlebars template
 * @param {boolean} fullReport - Whether or not to print the full report
 * @returns {object} - HTML-formatted report
 */
exports.summarizeData = function(results, fullReport) {
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

    messages.forEach(function(message) {
      if (message.severity === 2) {
        summary.alerts.errors++;
        file.errors++;
      } else if (message.severity === 1) {
        summary.alerts.warnings++;
        file.warnings++;
      }
    });

    if (file.errors) {
      summary.files.errors++;
    } else if (file.warnings) {
      summary.files.warnings++;
    } else {
      summary.files.clean++;
    }

    files.push(file);
  });

  files.sort(this.sortSummary);

  return {
    summary: summary,
    files: files,
    fullReport: fullReport,
    pageTitle: (fullReport ? "ESLint HTML Report" : "ESLint HTML Report (lite)")
  };
};

