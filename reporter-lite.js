/**
 * @fileoverview ESLint HTML "Lite" reporter
 * @author Evangelia Dendramis
 */
"use strict";

var util = require("./src/js/util");
var hbsUtil = require("./src/js/hbs-util");


module.exports = function(results) {

  var data = util.summarizeData(results, false);

  return hbsUtil.applyTemplates(data);
};
