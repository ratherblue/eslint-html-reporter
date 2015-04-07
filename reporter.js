/**
 * @fileoverview ESLint HTML reporter
 * @author Evangelia Dendramis
 */
"use strict";

var util = require("./src/js/util");
var hbsUtil = require("./src/js/hbs-util");


module.exports = function(results) {

  var data = util.summarizeData(results, true);

  return hbsUtil.applyTemplates(data);
};
