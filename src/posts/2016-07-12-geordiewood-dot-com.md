---
title: geordiewood.com
---

![geordiewood.com, main page](/images/geordie-1.png)

Recently I had the pleasure of working with [Hassan Rahim](https://twitter.com/hassanrahim) on [Geordie Wood](http://geordiewood.com)'s new website.

It was fantastic. Working with Hassan's clean, intelligent designs for a man who's photographed the greats — from [Obama](http://geordiewood.com/projects/obama) to [Gucci Mane](https://twitter.com/GuwopSnap/status/745304872912818178) — was an inspiration. Hassan's attention to detail is immense and after his carefully labelled Dropbox folders and intensely annotated [Invision](https://www.invisionapp.com) boards I may never be happy to go back to the ubiquitous, industry standard PDF…

There were three main requirements for the project; a near instantaneous front end with the highest possible visual fidelity and an easy to use backend.

Now, these may seem fairly obvious requests for a photographer's portfolio site but they're not as common as you'd expect so here's a little about how I went about it.

Starting with the frontend, working with large images meant I had to be sure I was sending correctly sized files to each and every client. Previously I'd resize the images on upload to the CMS, but this slows down the editing process and leaves me with just a few sizes to choose from.

So this time I turned to [Imgix](http://imgix.com), and all I had to do was point it to an [Amazon S3](https://aws.amazon.com/s3/) bucket and make a request with the filename and dimensions of the image (calculated based on the size the image is to be shown at, the screen size and `window.devicePixelRatio`). I rounded all sizes to the nearest 50px to make sure I'd hit Imgix's cache as often as possible, as a cache hit takes only a few milliseconds but with a miss it can be over a second as we wait for Imgix to resize the image before sending it back.

![geordiewood.com, slide](/images/geordie-2.png)

As an aside, I'm only using a few libraries on the frontend — [React](https://facebook.github.io/react/) and [React Router](https://github.com/reactjs/react-router) are the two big ones — and all my code's written in what I've taken to calling ES6+ (ES6 with a few neat ES7 extras such as `async` and `await`) and compiled with [Babel](https://babeljs.io).

With the image sizes sorted I had to make sure they were loaded as quickly as possible. For the desktop I went with a very aggressive caching strategy that loads all of the slides in the background one-by-one. Though I made sure to take the first slide out of each project and loaded those in immediately so they were ready when the user interacted with the homepage.

![geordiewood.com, main page hover](/images/geordie-3.png)

For mobile it's a little different as I couldn't take the desktop strategy because at best it noticeably slowed things down and at worst it crashed the tab entirely (something that happened a lot on earlier iPads as low internal memory and large images aren't a good mix). So instead the site waits until the user hits a slide and simply loads in that slide and the one immediately after it. It's not a perfect solution but it still feels rapid and doesn't cause any slow-downs.

![geordiewood.com, mobile views](/images/geordie-4.png)

The backend is very different, while the frontend is rendered almost entirely in the browser the backend is a more typical website. I use [Express](http://expressjs.com) (I _am_ a member of the [organisation](https://github.com/orgs/expressjs/people) and an operator in the IRC channel #express after all), [Postgres](http://www.postgresql.org) and a relative newcomer to the Node.js ORM scene: [Objection.js](http://vincit.github.io/objection.js/). Prior to this I'd been using [Bookshelf](http://bookshelfjs.org) in all my projects but was increasingly dissatisfied with the way it forces a [Backbone](http://backbonejs.org)-like structure on you and felt that it made too many things (such as validation and nested relations) harder to implement than they should've been.

The [Objection documentation](http://vincit.github.io/objection.js/) is also a lot more thorough than Bookshelf's and an [example repo](https://github.com/Vincit/objection.js/tree/master/examples) showing you how to write a basic site in ES5, ES6 and ES7 is an added bonus. Seeing as I was compiling everything anyway I took the ES7 route, allowing me to write code like:

```js
router.get('/', async (req, res, next) => {
  const projects = await Project.query().orderBy('position')
  res.render('projects/index', {projects})
})
```

and:

```js
const project = await Project.query()
  .where('id', +req.params.id)
  .eager(
    '[slides(orderByPosition), slides.images(orderByPosition)]',
    {orderByPosition}
  )
  .first()
```

(Objection's [eager queries](http://vincit.github.io/objection.js/#eager-queries) make nested relations absolutely painless)

The main part of the backend is the drag-and-drop slide editor:

![geordiewood.com, editor](/images/geordie-5.png)

![geordiewood.com, editor](/images/geordie-6.png)

With this Geordie can simply upload images and drag and drop them into the layout grid. They fall where they're dropped — snapped to the nearest column — and a click can set their width. I used the standard HTML5 drag-and-drop API for this:

```js
const onDragStart = e => {
  const {offsetX, offsetY} = e
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', JSON.stringify({offsetX, offsetY}))
}

const onDrop = e => {
  e.preventDefault()
  const {offsetX, offsetY} = JSON.parse(e.dataTransfer.getData('text'))
  // ...
}
```

The rest is just some maths to figure out which column we're on and then sending this data to the server. There's only two fields needed in the database for this; `columnsLeft` (the column number the image starts at) and `columnsWide` (the width of the image in columns). Everything else is extrapolated from this and our 16 column grid.

![geordiewood.com, slide](/images/geordie-7.png)

And that's the majority of it!

Thanks to Hassan and Geordie for being such a delight to work with, thanks ​*again* to [Eric Hu](https://twitter.com/_EricHu) for setting me up with them and thanks to the [snek](https://snek.slack.com) team on Slack for helping me brainstorm the best way to lay out the thumbnails.

If you have any questions about this project, or any other projects, get in touch with me via [twitter](https://twitter.com/ccommma) or at [ryan@artcommaco.de](mailto:ryan@artcommaco.de).
