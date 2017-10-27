---
title: The Right Solution to the Wrong Problem
---

So I thought I'd come up with a pretty neat solution to organising a collection of posts in the format "YYYY [title]" by year:

``` js
Collection.findAndPopulate({
  title: this.controller
}, function (error, collection) {
  if (error) return callback(error);
  collection.pages = _.filter(collection.pages, function (page) {
    return _.first(page.title.split(' ')) === req.params.year;
  });
  callback(null, collection.pages);
});
```

Pretty cool right? [Underscore](http://underscorejs.org/) is great when working with lists. However, a few hours after pushing the new code to production I realised (while in the shower) I could've skipped the Underscore and just done:

``` js
Page.findAndPopulate({
  title: new RegExp('^' + req.params.year),
  collection: this.controller
}, callback);
```
