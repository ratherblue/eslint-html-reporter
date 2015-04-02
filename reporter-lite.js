/**
 * @fileoverview ESLint HTML "Lite" reporter
 * @author Evangelia Dendramis
 */
"use strict";

var util = require("./util");


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
module.exports = function(results) {

  var data = util.summarizeData(results, false);

  data.fullReport = false;

  return util.applyTemplates(data);
};
