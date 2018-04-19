---
title: Join Me on My Functional JavaScript Journey
---

I have some pages, each of these pages has a string called "tags" containing a list of comma-separated tags. What I need is a way of grabbing all of these tags and counting them:

``` js
var allTags = {};
for (var i = 0; i < pages.length; i++) {
  var tags = pages[i].tags.split(', ');
  for (var j = 0; j < tags.length; j++) {
    allTags[tags[j]] = allTags[tags[j]]
      ? allTags[tags[j]]++
      : 1;
  }
}
```

Okay, that's not even remotely functional and it's also pretty ugly. Lets take advantage of `Array.reduce` to functionify this up a little:

``` js
pages.reduce(function (allTags, page) {
  page.tags.split(', ').forEach(function (tag) {
    allTags[tag] = ++allTags[tag] || 1;
  });
  return allTags;
}, {});
```

That's a little better! We're just reducing the pages into an empty object (`{}` at the end there) that contains the summed-up tags. It works quite well and is looking pretty good but I'm not happy with the nesting of that `forEach` loop. Lets try again:

``` js
pages.reduce(function (allTags, page) {
  return allTags.concat(page.tags.split(', '));
}, []).reduce(function (countedTags, tag) {
  countedTags[tag] = ++countedTags[tag] || 1;
  return countedTags;
}, {});
```

Much better. On the first pass we go through each page and return an array containing every occurrence of a tag, the second pass simply takes this array and sums up those occurrences.
