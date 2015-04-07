"use strict";

var assert = require("assert");

var util = require("../src/js/util");

describe("util", function() {
  describe("sortErrors(a, b)", function() {
    it("should return -1 when a.errors = 2 and b.errors = 1", function() {
      assert.equal(-1, util.sortErrors({ "errors": 2 }, { "errors": 1 }));
    });

    it("should return 1 when a.errors = 1 and b.errors = 2", function() {
      assert.equal(1, util.sortErrors({ "errors": 1 }, { "errors": 2 }));
    });
  });

  describe("sortWarnings(a, b)", function() {
    it("should return -1 when a.warnings = 2 and b.warnings = 1", function() {
      assert.equal(-1, util.sortWarnings({ "warnings": 2 }, { "warnings": 1 }));
    });

    it("should return 1 when a.warnings = 1 and b.warnings = 2", function() {
      assert.equal(1, util.sortWarnings({ "warnings": 1 }, { "warnings": 2 }));
    });
  });

  describe("sortClean(a, b)", function() {
    it("should return 1 when a.path = 'fileA.js' and b.path = 'fileB.js'", function() {
      assert.equal(-1, util.sortClean({ "path": "fileA.js" }, { "path": "fileB.js" }));
    });

    it("should return 1 when a.path = 'fileB.js' and b.path = 'fileA.js'", function() {
      assert.equal(1, util.sortClean({ "path": "fileB.js" }, { "path": "fileA.js" }));
    });

    it("should return 0 when a.path = 'fileA.js' and b.path = 'fileA.js'", function() {
      assert.equal(0, util.sortClean({ "path": "fileA.js" }, { "path": "fileA.js" }));
    });
  });
});
