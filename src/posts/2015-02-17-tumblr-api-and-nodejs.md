---
title: Tumblr API & Node.js
---

``` js
function getFacebooks(id) {
   var fb = require('fb')
   fb.setAccessToken(config.facebook.accessToken)
   return new Promise(function (resolve, reject) {
     fb.api(id + '/feed', function (res) {
       if (!res || res.error) return reject(res.error)
       return resolve(res.data.filter(filterFbPost).map(formatFbPost))
     })
   })
}

function getTumblrs(name) {
   var tumblr = require('tumblr.js').createClient(config.tumblr)
   var getPosts = Promise.promisify(tumblr.posts, tumblr)
   return getPosts(name).then(function(data) {
     return data.posts.map(formatTumblrPost)
   })
}
```

Thank you Tumblr for having the best API documentation I’ve seen in this week of scraping posts from every social media site under the sun. Maintaining an official npm library is an added bonus.

(the differences between scraping from Tumblr and Facebook can be seen above)
