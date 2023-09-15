# lakewood.ai
This is the frontend of the lakewood.ai website. This is not the actual hosting; that is managed by Apache2 configured on the server (containerization might come later but this works for now). This package just produces a bunch of files that are then served by Apache2.

## Overview
This project forgoes the plebian languages of usual web development. We are members of the bourgeoisie here. Therefore, this project uses Pug.js, SCSS, and TypeScript. It is all compiled together by Gulp. We also use yarn instead of npm, because its output looks nicer. This setup will allow efficient and runtime (type) error bug free (sort of). Really it all just looks nicer.

### Pug
HTML is complex and verbose. We replace it with Pug.js, which gives it an indentation based syntax instead of an XML based syntax. It looks much more clean this way. It also allows computed (and passed) attributes in the site, which will be very useful during compilation.

### SCSS
SCSS is an extension of regular CSS, that allows nesting, imports, variables, and a suite of other cool things. It, of course, gets compiled to CSS eventually. There is an alternate syntax, called SASS that looks closer to yaml and Pug.js, but it is up to Mr. Cortez whether we go with that instead. It appears that SCSS is the newer one.

### TypeScript
Just javascript with types, really. It also has a much nicer import syntax. Not that much more to be said about it.

### Gulp
Gulp is a task scripter, that allows us to write down the complex motions of compiling the website, and execute it with a few fingerstrokes in our terminal. It also allows Makefile type seperation of various tasks, so you don't have to recompile the whole website if you only change a single thing.

## File Structure
### Source
All of the source files that we write are stored in `./src/`. This is then divided into folders that each contain a site. Each site will contain a `pug/` folder, which contains the Pug.js code, an `scss/` folder, which contains the SCSS code, and a `typescript/` folder, which contains the TypeScript code. The source files from the kit are located in `dist/assets/` for access from hosted files. 

### Build
The build is located in `dest/`, along with the assets from the kit. Currently, `dest/` is divided into folders that contain the sites, just like in `src/`. Each of these page folders contain an `html/` folder that contains the html (compiled from the Pug.js usually), and a `css/` folder that contains the CSS (compiled from the SCSS usually). The scripting is a bit weird. It has too be done in two passes, first the TypeScript compilation, then the webpack. We'll probably develop a better solution eventually, but right now I am outputting the compiled TypeScript to the folder `ts/` in the page. This is then packed to the folder `js/`. After it gets packed there isn't any use for `ts/` (directly importing a TypeScript module in HTML is major codesmell and will cause issues down the line so just don't). There isn't any solution for programmatically cleaning `ts/` right now, but there will be in the future to keep down the size of the distribution.

Currently `assets/` is a blackbox to me, but I'll figure it out eventually. Maybe once I analyze it it will turn up better solutions for bundling that. 

## The Kit
We're not UI designers. We're programmers; their antithesis. So we chose a theme for Bootstrap 5 from a group known as Creative Tim. This can be found [here](https://www.creative-tim.com/product/material-dashboard).