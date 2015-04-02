# ESLint HTML Reporter

HTML Reporter for ESLint. Please report bugs to [https://github.com/edendramis/eslint-html-reporter/issues](https://github.com/edendramis/eslint-html-reporter/issues)

Supports:
  * Detailed output (default)
  * "Lite" output (omits the detailed error messages)

Todo: 
  * Write tests
  * Add "Lite" and TeamCity support to Gulp

## Installation

```sh
npm install eslint-html-reporter
```

## Usage

### With [ESLint CLI](http://eslint.org/docs/user-guide/command-line-interface):

```sh
# Basic
eslint file.js -f node_modules/eslint-html-reporter/reporter.js -o report.html

# "Lite" (same as Basic, but omits the detailed error messages)
eslint file.js -f node_modules/eslint-html-reporter/reporter-lite.js -o report.html

# TeamCity Basic
eslint file.js -f node_modules/eslint-html-reporter/reporter-team-city.js -o report.html

# TeamCity "Lite"
eslint file.js -f node_modules/eslint-html-reporter/reporter-lite-team-city.js -o report.html
```

### With [Gulp ESLint](https://github.com/adametry/gulp-eslint):

```js
var eslint         = require('gulp-eslint');
var eslintReporter = require('eslint-html-reporter');
var path           = require('path');
var fs             = require('fs');

gulp.src(['js/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format(eslintReporter, function(results) {
      fs.writeFileSync(path.join(__dirname, 'report-results.html'), results);
    })
  );
```

## License

[MIT](https://github.com/edendramis/eslint-html-reporter/blob/master/LICENSE) © Evangelia Dendramis
