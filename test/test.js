var assert = require('assert');

var util = require('../src/js/util');


describe('util', function() {
  describe('sortErrors(a, b)', function() {
    it('should return -1 when a.errors = 2 and b.errors = 1', function() {
      assert.equal(-1, util.sortErrors({ 'errors': 2 }, { 'errors': 1 }));
    });

    it('should return 1 when a.errors = 1 and b.errors = 2', function() {
      assert.equal(1, util.sortErrors({ 'errors': 1 }, { 'errors': 2 }));
    });

    // only warnings
    it('should return -1 when a.warnings = 2 and b.warnings = 1', function() {
      assert.equal(-1, util.sortErrors({ 'errors': 0, 'warnings': 2 }, { 'errors': 0, 'warnings': 1 }));
    });

    it('should return 1 when a.warnings = 1 and b.warnings = 2', function() {
      assert.equal(1, util.sortErrors({ 'warnings': 1 }, { 'warnings': 2 }));
    });

    // clean files
    it('should return 1 when a.path = "fileA.js" and b.path = "fileB.js"', function() {
      assert.equal(-1, util.sortErrors({ 'errors': 0, 'warnings': 0, 'path': 'fileA.js' }, { 'errors': 0, 'warnings': 0, 'path': 'fileB.js' }));
    });

    it('should return 1 when a.path = "fileB.js" and b.path = "fileA.js"', function() {
      assert.equal(1, util.sortErrors({ 'errors': 0, 'warnings': 0, 'path': 'fileB.js' }, { 'errors': 0, 'warnings': 0, 'path': 'fileA.js' }));
    });

    it('should return 0 when a.path = "fileA.js" and b.path = "fileA.js"', function() {
      assert.equal(0, util.sortErrors({ 'errors': 0, 'warnings': 0, 'path': 'fileA.js' }, { 'errors': 0, 'warnings': 0, 'path': 'fileA.js' }));
    });
  });

});
