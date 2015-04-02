/**
 * @fileoverview ESLint HTML "Lite" reporter with Team City integration
 * @author Evangelia Dendramis
 */
"use strict";

var util = require("./util");


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
module.exports = function(results) {

  var data = util.summarizeData(results, false, "teamCity");

  return util.applyTemplates(data);
};
