# ESLint HTML Reporter

HTML Reporter for ESLint

* Please report bugs to https://github.com/edendramis/eslint-html-reporter/issues

## Installation

```sh
npm install eslint-html-reporter
```

## Usage

Example CLI:

```
eslint -f *.js node_modules/eslint-html-reporter/reporter.js
```

Gulp:

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

## Author

* http://edendramis.com(http://edendramis.com)
* Evangelia Dendramis

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0) © Evangelia Dendramis
