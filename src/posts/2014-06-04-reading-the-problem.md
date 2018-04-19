---
title: Reading the Problem
---

Yesterday a friend asked on [Twitter](https://twitter.com/artcommacode)&nbsp;if I had any JavaScript/jQuery snippets to “detect that something has scrolled into view and trigger an event”. Pretty easy I thought:

``` js
$(window).bind('scroll', function() {
  var $e = $('.some-element')
    , scrolltop = $(window).scrollTop() + $(window).height();
  if (scrolltop > $e.offset().top) {
    console.log('in view');
  } else {
    console.log('not in view');
  }
});
```

Of course, anybody that actually read the question (unlike me, apparently) would realise that the above snippet doesn't answer it at all, all we can do with this is constantly log whether or not the element is view. Lets try again:

``` js
var currentlyIn = false;
$(window).bind('scroll', function() {
  var inView = ($(this).scrollTop() + $(this).height()) > $('.some-element').offset().top;
  if (inView === currentlyIn) return true;
  $('.some-element').trigger(inView ? 'in-view' : 'out-view');
  currentlyIn = inView;
});
```

Which – unless you already know what it's for – is almost as useless as the first attempt. Time for some comments:

``` js
var currentlyIn = false; 
// we need somewhere to hold state so that we don't continuously emit events
$(window).bind('scroll', function() {
// bind the scroll event from the window so this function's called when the user scrolls
  var inView = ($(this).scrollTop() + $(this).height()) > $('.some-element').offset().top; 
  // check if the top of the element is less than the bottom of the window
  if (inView === currentlyIn) return true;
  // if the new state is the same as the old then don't do anything
  $('.some-element').trigger(inView ? 'in-view' : 'out-view');
  // 'else' trigger an event depending on whether the element has gone in or out of view
  currentlyIn = inView;
  // update the state
});
```

Done!

… and then I woke up this morning and realised that I *still* hadn't answered the question. (this might explain why I do so poorly in written examinations) While the code would detect when the element comes in from the bottom of the screen, what happens at the top of the viewport? Lets fix that right up and turn it into a little jQuery plugin too:

``` js
// the plugin
(function($) {
  var currentlyIn = false
    , $window = $(window);
  $.fn.inViewport = function() {
    var $e = this;
    $window.bind('scroll', function() {
      var aboveBottom = ($window.scrollTop() + $window.height()) > $e.offset().top
        , belowTop = ($window.scrollTop() < ($e.offset().top + $e.outerHeight()))
        , inView = aboveBottom && belowTop; 
      if (inView === currentlyIn) return true;
      $e.trigger(inView ? 'in-view' : 'out-view');
      currentlyIn = inView;
    });
    return this;
  };
}(jQuery));

// and to call it
$('.some-element')
  .inViewport()
  .on('in-view', function() {
    // in view
  })
  .on('out-view', function() {
    // out of view
  });
```

Overall, quite different from where I started.
