---
title: Questions About Tooling
---

Recently I've been asking myself some questions about the tools I use day-to-day and their possible alternatives. Please note all answers are purely personal and it's likely your own experiences will differ, but if you feel you need to tell me I'm wrong&thinsp;&mdash;&thinsp;or right!&thinsp;&mdash;&thinsp;feel free to get in touch with me on [Twitter](https://twitter.com/ccommma).

1.  Should I use [Yarn](https://yarnpkg.com/) over [npm](https://www.npmjs.com/)?

Not just yet. [Heroku](http://heroku.com/)&thinsp;&mdash;&thinsp;my deployment method of choice&thinsp;&mdash;&thinsp;say they support Yarn but my builds often fail. Added to this: Yarn can't be installed the recommended way when using [nvm](http://nvm.sh), global installs (unfortunately sometimes necessary) don't work as expected and the promised speed increases over npm aren't noticeable when my 80KB/s internet connection is the bottleneck. As such I'm putting Yarn to the side for a little longer.

2.  Should I use [webpack](https://webpack.js.org/) over [browserify](http://browserify.org/)?

Probably not. From spending time in Slack and on Twitter you'd expect the gains to be massive but although my browserify scripts occasionally end up looking like the below there's many methods to clean that up. Going back to [hundreds of lines](https://github.com/facebookincubator/create-react-app/blob/fe7b5c212b5127775287ce444947f4c604c024dd/packages/react-scripts/config/webpack.config.dev.js) of JavaScript to control my builds feels too much like a return to gulp.

```json
"NODE_ENV=production browserify ./src/App.js -t [ babelify --presets [ es2015 stage-2 react ] --plugins [ transform-flow-strip-types transform-class-properties ] ] | uglifyjs > ./public/js/bundle.js"
```

If you use browserify and feel like you're missing out or if you use webpack and want to know how to do bundle splitting, loaders, source maps or more then I recommend checking out [substack](https://github.com/substack)'s great post "[browserify for webpack users](https://gist.github.com/substack/68f8d502be42d5cd4942)".

3.  Should I use [VS Code](https://code.visualstudio.com/) over [Atom](https://atom.io/)?

Absolutely! It's less resource intensive, much faster and has a great set of defaults including: tooltips, css completion that actually works, debugging, great git integration and many [neat tricks](https://github.com/Microsoft/vscode-tips-and-tricks). Plus if you don't mind hacking it up [a little](https://github.com/orta/Essence#using) you can have a beautiful editor as well.

![VS Code with Ayu light theme](/images/tooling-2.png)

4.  Should I use [TypeScript](http://www.typescriptlang.org/) over [Flow](https://flowtype.org/)?

Maybe? Although TypeScript's known to be unsound they make a [good case for that](https://github.com/Microsoft/TypeScript/issues/9825#issuecomment-234115900) and in my experience Flow has many issues with soundness too. VS Code's TypeScript tooling makes it an obvious winner when using the editor but TypeScript also beats out Flow in the [shear number](https://github.com/DefinitelyTyped/DefinitelyTyped) of typings available for external libraries and hasn't once yet told me that an `EventEmitter` isn't an `EventEmitter`.

Either way they're both a good midway point between untyped, vanilla JavaScript and something strongly typed like Purescript. I'm currently choosing between them on a project-by-project basis and usually use Flow for React and the frontend and TypeScript on the server.
