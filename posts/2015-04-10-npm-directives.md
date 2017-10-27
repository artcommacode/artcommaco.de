---
title: npm Directives
---
``` js
"scripts": {
   "build-js": "browserify src/js/script.js | uglifyjs -mc > build/js/script.js",
   "build-css": "cat src/css/*/*.css src/css/*.css | uglifycss > build/css/style.css",
   "build-html": "jade src/jade/*.jade -o build",
   "build": "npm run build-js && npm run build-css && npm run build-html",
   "watch-js": "watchify src/js/script.js -o build/js/script.js -dv",
   "watch-css": "catw src/css/*/*.css src/css/*.css -o build/css/style.css -v",
   "watch-html": "jade src/jade/*.jade -o build -w",
   "watch": "npm run watch-js & npm run watch-css & npm run watch-html",
   "start": "npm run build && cd build; http-server",
   "start-dev": "npm run watch & npm start",
   "postinstall": "npm run build"
 }
```
I recently replaced my 100 line gulp file with 10 lines of npm directives which have already proven to be simpler and more reliable. 

Not happy with the hacks that were piling up in my gulpfile.js I started looking at the alternatives. Makefiles are too magical for me but I haven't ruled them out completely. For anybody interested in using them I highly recommend James Coglan's post "[Building JavaScript projects with Make](https://blog.jcoglan.com/2014/02/05/building-javascript-projects-with-make/)".

Instead I found substack's post "[task automation with npm run](http://substack.net/task_automation_with_npm_run)" and have liberally copied from it. Because this current project is a static site and not one of my usual [Express](http://expressjs.com) applications I've also added [Jade](http://jade-lang.com/command-line/) to convert my .jade files to HTML and [http-server](https://www.npmjs.com/package/http-server) to serve the site. 
