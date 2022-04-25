---
title: A Lot Can Change In Five Years
---

And a lot can stay the same.

A little over five years have come and gone since I wrote [Questions About Tooling](/posts/2017-03-06-questions-about-tooling.html), and as I was paging through my site&thinsp;&mdash;&thinsp;handling my quarterly SSL certificate reissuance, because it's easier spending five minutes re-running the same `certbot` command every three months than 20 minutes figuring out how to automate it&thinsp;&mdash;&thinsp;I found this post pretty interesting to look back on.

1. Yarn vs npm

I completely switched to Yarn shortly after writing the post, and I loved the experience. But I've recently come back to npm after the yarn 2.0 release and the sheer [number of steps](https://yarnpkg.com/getting-started/migration) required to migrate legacy codebases&thinsp;&mdash;&thinsp;of which I maintain many&thinsp;&mdash;&thinsp;to their [PnP](https://yarnpkg.com/features/pnp) architecture. I keep forgetting to add `run` to my commands, but other than that npm is just fine.

2. webpack vs browserify

Well, webpack definitely won this one. I still maintain a few repos with browserify-based scripting, but any new project will have webpack enabled from the start. The experience with webpack is a lot better now too, as this will typically be abstracted away from you via `create-react-app`, `create-next-app`, `create-remix`, or whatever scripts you're using to bootstrap your platform of choice. All of the advantages of webpack with none&thinsp;&mdash;&thinsp;well, less&thinsp;&mdash;&thinsp;of the googling to figure out what packages you need to install for your code to compile.

3. VS Code vs Atom

I'm still very happy with VS Code&thinsp;&mdash;&thinsp;to the point that we're now using it's [core architecture](https://microsoft.github.io/monaco-editor/) to power the [SuperHi Editor](https://www.superhi.com/editor)&thinsp;&mdash;&thinsp;though I no longer put as much effort into theming as I once did. I'll set the typeface to `16px IBMPlexMono-Regular`, choose a [nice theme](https://marketplace.visualstudio.com/items?itemName=wicked-labs.old-serendipity) with light and dark modes and leave everything else. Once I've added [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) of course.

4. Typescript vs Flow

Another resounding win in the column, this time for Typescript. The tooling's gotten even better and the team are constantly adding [new features and various improvements](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html) to the way that it works. At this point I'm uncomfortable whenever I have to write vanilla JavaScript, as I need all of the various safeties and niceties of Typescript to protect me from myself.

## What else?

Personally, I'm still [here at SuperHi](https://www.superhi.com/about), though in a slightly different role from five years ago. Most of my days are now spent in research, support, management and meetings, though I still have the opportunity to write code here and there. Over the past few weeks I've been reviewing our tech stack as we start to [ramp up hiring](https://www.superhi.com/jobs) for a load of new projects that're close to kicking off.
