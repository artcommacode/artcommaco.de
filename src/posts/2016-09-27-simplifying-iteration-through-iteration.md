---
title: Simplifying Iteration Through Iteration
---

Given an input of `"a monad is just a monoid in the category of endofunctors"` and an output of:

``` js
"a monad is just a monoid in the category of endofunctors"
"monad is just a monoid in the category of endofunctors"
"is just a monoid in the category of endofunctors"
"just a monoid in the category of endofunctors"
"a monoid in the category of endofunctors"
"monoid in the category of endofunctors"
"in the category of endofunctors"
"the category of endofunctors"
"category of endofunctors"
"of endofunctors"
"endofunctors"
```

How would you handle the transformation? My first idea was to use two folds (or `reduce` in JavaScript speak):

``` js
const permutations = (str) => {
  const words = str.split(' ')
  return words.reduce((p, _, i) => {
    return p.concat([words.reduce((s, word, j) => {
      return j >= i ? s + ` ${word}` : s
    }, '').trim()])
  }, [])
}
```

Here I'm splitting the string into an array of words and folding over it twice to build an array of strings of words. However the first fold is basically `xs.reduce((ys, x) => ys.concat([fn(x)]), [])` and is equivalent to `xs.map(fn)`, meaning the above can be rewritten as:

``` js
const permutations = (str) => {
  const words = str.split(' ')
  return words.map((_, i) => (
    words.reduce((s, word, j) => (
      j >= i ? s + ` ${word}` : s
    ), '').trim()
  ))
}
```

Which is already a little easier to understand. But I don't need that second fold at all, as instead of taking an array of words, finding all words past a certain index and concatenating them into a string it's much neater to simply `slice` the array at that index and `join` it back into a string. If I re-rewrite the function I get:

``` js
const permutations = (str) => {
  const words = str.split(' ')
  return words.map((_, i) => words.slice(i).join(' '))
}
```

Much better! And seeing as JavaScript gives us the original array as the third argument to `map` I can take the whole thing down to a tweet-sized chunk:

``` js
const permutations = (str) => (
  str.split(' ').map((_, i, words) => words.slice(i).join(' '))
)
```

I have a habit of jumping straight to folds as the solution to list problems. Seeing as they're the root of all iteration methods (it can be seen above how I accidentally implemented `map` and the same can be done for `filter`, `some`, `find` and all the others) the answer won't be wrong, but it *will* be overly complicated. I'm quite happy with how easy it is to read the solution when compared to my initial attempt.
