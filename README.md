# ESLint HTML Reporter

HTML Reporter for ESLint

* Please report bugs to https://github.com/edendramis/eslint-html-reporter/issues
* Todo: Write tests

## Installation

```sh
npm install eslint-html-reporter -g
```

## Usage

Example usage with [ESLint CLI](http://eslint.org/docs/user-guide/command-line-interface):

```
eslint file.js -f node_modules/eslint-html-reporter/reporter.js -o report.html
```

Example usage with [Gulp ESLint](https://github.com/adametry/gulp-eslint):

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
