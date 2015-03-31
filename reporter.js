/**
 * @fileoverview HTML reporter
 * @author Evangelia Dendramis
 */
"use strict";

var handlebars = require("handlebars");
var fs         = require("fs");
var path       = require("path");

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Sorting function
 * @param {object} a
 * @param {object} b
 * @returns {int}
 */
function sortSummary(a, b) {
  return (b.errors - a.errors);
}

/**
 * Handlebars helper
 * @param {object} context
 * @param {object} options
 * @returns {string}
 */
function rowHelper(context, options) {
  var className = "success";

  if (context.errors) {
    className = "danger";
  } else if (context.warnings) {
    className = "warning";
  }

  return "<tr class=\"" + className + "\">" + options.fn(this) + "</tr>";
}

/**
 * Apply handlebars template to data
 * @param {object} data
 * @returns {string}
 */
function applyTemplate(data) {
  registerHelpers();
  registerPartials();

  var source = fs.readFileSync(path.join(__dirname, "reporter.hbs"),
    { encoding: "utf-8" }
  );

  var template = handlebars.compile(source);

  return template(data);
}

/**
 * Register Handlebars partials
 */
function registerPartials() {
  var summary = fs.readFileSync(path.join(__dirname, "partials", "summary.hbs"),
    { encoding: "utf-8" }
  );

  handlebars.registerPartial("summary", handlebars.compile(summary));

  var fileBreakdown = fs.readFileSync(path.join(__dirname, "partials", "file-breakdown.hbs"),
    { encoding: "utf-8" }
  );

  handlebars.registerPartial("fileBreakdown", handlebars.compile(fileBreakdown));
}

/**
 * Register Handlebars helpers
 */
 function registerHelpers() {
   handlebars.registerHelper("row", rowHelper);
 }

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
module.exports = function (results) {

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
      total: 0
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

  files.sort(sortSummary);

  return applyTemplate(
    {
      summary: summary,
      files: files
    }
  );
};
