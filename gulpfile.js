// Web dev is weird and so is this file. Compiling things like SCSS, Pug.js,
// and TypeScript is very formulaic so to avoid that and reduce magics, the
// file is broken into two sections. Every compilation thing that needs to be
// done is given a metacompiler with the naming convention <thing>_compiler.
// That function takes in the path of the file to be compiled, the output
// and the name of the task that will do that compiling. It returns an
// anonymous function that does that compiling. There are then exports that
// run tons of these constructed anonymous functions in parallel.

const { src, dest, parallel, series } = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
var ts = require('gulp-typescript');
var webpack = require('webpack-stream');

// -------- Compilers

// Returns a function that compiles the scss file(s) in input to css in output
function scss_compiler(input, output, task_name) {
    const fn = () => src(input)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest(output));

    fn.displayName = task_name;
    return fn;
}

// Returns a function that compiles the pug file(s) in input to html in output
function pug_compiler(input, output, task_name) {
    const fn = () => src(input)
        .pipe(pug({}))
        .pipe(dest(output));

    fn.displayName = task_name;
    return fn;
}

// Returns a function that compiles the ts file(s) in input to html in output
function ts_compiler(input, output, task_name) {
    const fn = () => src(input)
        .pipe(ts({
            noImplicitAny: true,
        }))
        .pipe(dest(output));

    fn.displayName = task_name;
    return fn;
}

// Returns a function that packs a js file in input to output
function pack_js(input, output, task_name) {
    const fn = () => src(input)
        .pipe(webpack({
            mode: 'production'
        }))
        .pipe(dest(output))

    fn.displayName = task_name;
    return fn;
}

// -------- Exports

// SCSS
exports.compile_scss = parallel(
    //scss_compiler(Paths.SCSS_TOOLKIT_SOURCES, Paths.CSS, 'compile_scss_toolkit'),
    scss_compiler('./src/home/scss/style.scss', './dist/home/css/', 'compile_scss_home')
);

// Pug
exports.compile_pug = parallel(
    pug_compiler('./src/home/pug/index.pug', './dist/home/', 'compile_pug_home')
);

// Typescript
exports.compile_ts = parallel(
    ts_compiler('./src/home/typescript/*', './dist/home/ts/', 'compile_ts_home')
);

// Webpack
exports.pack_compiled_ts = parallel(
    pack_js('./dist/home/ts/script.js', './dist/home/js/', 'pack_ts_home')
);

exports.build_site = series(
    parallel(
        this.compile_scss,
        this.compile_pug,
        this.compile_ts,
    ),
    this.pack_compiled_ts
);
