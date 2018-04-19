---
title: paintingid.com
---

![Painting ID website, painting page](/images/painting-1.png)

_Update 06/16: paintingid.com has been turned off, but you can visit an archive of the site at [paintingid.artcommaco.de](http://paintingid.artcommaco.de)._

I recently had the pleasure to work on [a website](http://paintingid.artcommaco.de) for the NYC artist [Brendan Smith](http://brendansmithstudio.com) with designers [Harry Gassel ](http://eeshirtay.com) and [Seth Hoekstra](http://www.sethhoekstra.com) and 3D Illustrator [James Orlando](http://www.jamesorlando.net).

One of those short-notice jobs that always has the potential to become a nightmare it nontheless turned out to be a great time thanks to the professionalism of my main-point-of-contacts Harry and Seth. However, [three.js](http://threejs.org) was another matter entirely. A mess of horrible documentation, awkward anti-patterns and hundreds of mutable variables it took me a week before I could even display a painting on the screen and when I did it looked something like this:

![3D painting, broken render](/images/painting-2.png)

After that it was a matter of figuring out rotations, positioning, texturing, hooking up controls and how to swap out colours and paintings on the fly. I then discovered how tricky it is to light a scene to show anything from white to bright purple to black. On the advice of [a friend](https://twitter.com/aeleitch) I ended up going with two lights, a very dark blue-black ambient light and a very bright yellow-white directional light.

Despite the pains of three.js it was great to have the opportunity to learn some new skills.

![Painting ID website, opening page](/images/painting-3.png)

![Painting ID website, painting page](/images/painting-4.png)

![Painting ID website, preview page](/images/painting-5.png)

![Painting ID website, about page](/images/painting-6.png)
