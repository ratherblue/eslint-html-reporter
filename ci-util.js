/**
 * @fileoverview CI Utils for ESLint HTML Reporter
 * @author Evangelia Dendramis
 */
"use strict";

/**
 * Escapes a string for Team City
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
*/
exports.escapeTeamCityString = function(str) {

  if (!str) {
    return "";
  }

  return str.replace(/\|/g, "||")
    .replace(/\'/g, "|\'")
    .replace(/\n/g, "|n")
    .replace(/\r/g, "|r")
    .replace(/\u0085/g, "|x")
    .replace(/\u2028/g, "|l")
    .replace(/\u2029/g, "|p")
    .replace(/\[/g, "|[")
    .replace(/\]/g, "|]");
};
