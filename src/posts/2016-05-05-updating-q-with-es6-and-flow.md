---
title: Updating q with ES6 and flow
---

I'm now at the point where all JavaScript I'm writing is compiled via [babel](http://babeljs.io), even on the server. The recent release of Node.js 6.0 brought [great ES6 support](http://node.green) with it (`const` finally works correctly!) but I'm using more and more experimental features that won't be landing in the EcmaScript standard any time soon and babel allows me to take advantage of this. More on that&thinsp;&mdash;&thinsp;including using `async` and `await` in production&thinsp;&mdash;&thinsp;in a later post.

I'll start off with the final code:

``` js
const toArray = (list) => [].slice.call(list)

const first = (xs: T[]): T => xs[0]

const elemError = (e) => {
  throw new Error(`"${e}" doesn't exist in the document`)
}

const getRoot = (e: ?HTMLElement): Document | HTMLElement => (
  !e ? document : (document.body.contains(e) ? e : elemError(e))
)

export const query = (q: string, e: HTMLElement): HTMLElement[] => (
  toArray((getRoot(e)).querySelectorAll(q))
)

export const queryOne = (q: string, e: HTMLElement): ?HTMLElement => (
  first(query(q, e))
)
```

A few things to note here:

1. I'm using [flow](http://flowtype.org) for static type checking.
2. q doesn't shim `querySelectorAll` and as such is meant for modern (post IE7 or post IE8 if you're using CSS 3 selectors) browsers.
3. Instead of `Array.from` I'm using my own `toArray` function as the shim is too large for me to comfortably include in a library.

You'll also note that rather than exporting a single function and making you guess whether you'd get an element or an array of elements back we now have two explicit functions to use. In version 1.0 of q I found that I'd often get errors when I didn't know how many elements I'd be querying, expecting an array of elements only to get an element itself.

Using q — in an ES6 environment — is even easier than before:

``` js
import {query, queryOne} from '@artcommacode/q'

query('ul li')
// => [ <li>...</li>, <li>...</li>, <li>...</li> ]

query('ul li')[0].textContent
// => $1

queryOne('ul li')
// => <li>...</li>

queryOne('ul li') === query('ul li')[0]
// => true
```

You can compose queries by passing an element as the second argument:

``` js
const ul = queryOne('ul')
query('li', ul)
// => [ <li>...</li>, <li>...</li>, <li>...</li> ]
```

`query` will now return an empty array when no elements are found and  `queryOne` will return `undefined`:

``` js
query('ul div')
// => []

queryOne('ul div')
// => undefined
```

q will throw an error if you try to run a query on an element that doesn't exist:

``` js
const li = 'not_an_element'
query('div', li)
// => Error: "not_an_element" does't exist in the document
```

My experience with flow has been good, but not great. The inference is very clever but it's clearly still in active development and there are times you'll get completely unrelated errors when it can't determine what you're trying to do, or — even worse — it'll assume `any` and not tell you that the type-checking has now become next to useless.

The code above has been annotated with types but my more usual flow workflow is to simply let it infer everything and use it as a form of static analysis, a more intelligent [eslint](http://eslint.org) that can tell me when I've misspelled variables or haven't declared a function properly.

The other issue is that you need to use [transform-flow-strip-types](https://www.npmjs.com/package/babel-plugin-transform-flow-strip-types) to remove the annotations when you compile your code. The first problem with this is transform-flow-strip-types lags behind flow and you'll occasionally find yourself rewriting code that type-checked fine to stop it from throwing errors. The second problem is that your careful type annotations are now gone and you have no runtime guarantees. Because of this I'm now looking into solutions such as contracts — and [contracts.js](http://www.contractsjs.org) — rather than annotating my code for flow, while retaining flow for static analysis.

You can download q from [npm](https://www.npmjs.com/package/@artcommacode/q).
