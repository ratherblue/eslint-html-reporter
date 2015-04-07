/**
 * @fileoverview ESLint HTML reporter with Team City integration
 * @author Evangelia Dendramis
 */
"use strict";

var util = require("./src/js/util");
var hbsUtil = require("./src/js/hbs-util");


module.exports = function(results) {

  var data = util.summarizeData(results, true, "teamCity");

  return hbsUtil.applyTemplates(data);
};
