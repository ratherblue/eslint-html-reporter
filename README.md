# ESLint HTML Reporter

[![Build Status](https://img.shields.io/travis/ratherblue/eslint-html-reporter.svg?style=flat-square)](https://travis-ci.org/ratherblue/eslint-html-reporter)
[![Coverage Status](https://img.shields.io/coveralls/ratherblue/eslint-html-reporter.svg?style=flat-square)](https://coveralls.io/r/ratherblue/eslint-html-reporter)
[![License](https://img.shields.io/github/license/ratherblue/eslint-html-reporter.svg?style=flat-square)](https://github.com/ratherblue/eslint-html-reporter/blob/master/LICENSE)
[![Dependencies](https://img.shields.io/david/ratherblue/eslint-html-reporter.svg?style=flat-square)](https://david-dm.org/ratherblue/eslint-html-reporter)
[![devDependency Status](https://img.shields.io/david/dev/ratherblue/eslint-html-reporter.svg?style=flat-square)](https://david-dm.org/ratherblue/eslint-html-reporter#info=devDependencies&view=table)

HTML Reporter for ESLint. Please report bugs to [https://github.com/ratherblue/eslint-html-reporter/issues](https://github.com/ratherblue/eslint-html-reporter/issues)

Features:
* Generates an HTML page with a summary of all linted files and their errors
* Choice between detailed and "lite" output
* Optional integration with TeamCity's console
* Shows summary of all errors and warnings so you can easily identify top linting issues


## Installation

```sh
npm install eslint-html-reporter
```

## Usage

### With [ESLint CLI](http://eslint.org/docs/user-guide/command-line-interface):

```sh
# Basic - Single file
eslint file.js -f node_modules/eslint-html-reporter/reporter.js -o report.html

# Basic - Recurse current directory
eslint . -f node_modules/eslint-html-reporter/reporter.js -o report.html

# "Lite" (same as Basic, but omits the detailed error messages)
eslint file.js -f node_modules/eslint-html-reporter/reporter-lite.js -o report.html

# TeamCity Basic
eslint file.js -f node_modules/eslint-html-reporter/reporter-team-city.js -o report.html

# TeamCity "Lite"
eslint file.js -f node_modules/eslint-html-reporter/reporter-lite-team-city.js -o report.html
```

### With [Gulp ESLint](https://github.com/adametry/gulp-eslint):

```js
var eslint   = require('gulp-eslint');
var reporter = require('eslint-html-reporter');
var path     = require('path');
var fs       = require('fs');

gulp.src(['js/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format(reporter, function(results) {
      fs.writeFileSync(path.join(__dirname, 'report-results.html'), results);
    })
  );
```

## License

[MIT](https://github.com/ratherblue/eslint-html-reporter/blob/master/LICENSE)
