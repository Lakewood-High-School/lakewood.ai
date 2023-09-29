// Web dev is weird and so is this file. Compiling things like SCSS, Pug.js,
// and TypeScript is very formulaic so to avoid that and reduce magics, the
// file is broken into two sections. Every compilation thing that needs to be
// done is given a metacompiler with the naming convention <thing>_compiler.
// That function takes in the path of the file to be compiled, the output
// and the name of the task that will do that compiling. It returns an
// anonymous function that does that compiling. There are then exports that
// run tons of these constructed anonymous functions in parallel.

const { src, dest, parallel, series } = require('gulp');
var { existsSync } = require('fs');
var sass = require('gulp-sass')(require('sass'));
var autoprefixer = require('gulp-autoprefixer');
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
            rootDir: './src'
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

// Move a file(s) unchanged
function pass(input, output, task_name) {
    const fn = () => src(input)
        .pipe(dest(output))

    fn.displayName = task_name;
    return fn;
}

// -------- Exports

// SCSS
const compile_scss_kit = () =>
    existsSync('./dist/kit.css') ? Promise.resolve()
        : scss_compiler('./src/kit.scss', './dist', '')();
exports.compile_scss = parallel(
    scss_compiler('./src/home/scss/style.scss', './dist/home/css/', 'compile_scss_home'),
    scss_compiler('./src/test/scss/style.scss', './dist/test/css/', 'compile_scss_test'),
    compile_scss_kit
);

// Pug
exports.compile_pug = parallel(
    pug_compiler('./src/home/pug/index.pug', './dist/home/', 'compile_pug_home'),
    pug_compiler('./src/test/pug/index.pug', './dist/test/', 'compile_pug_test'),
);

// Typescript
const compile_ts_kit = () =>
    existsSync('./dist/kit.js') ? Promise.resolve()
        : ts_compiler('./src/kit.ts', './dist', '')();
exports.compile_ts = parallel(
    ts_compiler('./src/home/typescript/*', './dist/home/ts/', 'compile_ts_home'),
    ts_compiler('./src/test/typescript/*', './dist/test/ts/', 'compile_ts_test'),
    compile_ts_kit
);

// Webpack
exports.pack_compiled_ts = parallel(
    pack_js('./dist/home/ts/script.js', './dist/home/js/', 'pack_ts_home'),
    pack_js('./dist/test/ts/script.js', './dist/test/js/', 'pack_ts_test'),
);

// Pass
exports.pass = parallel(
    pass('./src/SpartanFullLogo.png', './dist/', 'pass_lhs_logo_home')
);

exports.build_site = series(
    parallel(
        this.compile_scss,
        this.compile_pug,
        this.compile_ts,
        this.pass
    ),
    this.pack_compiled_ts
);
