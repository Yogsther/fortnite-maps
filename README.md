## Fortnite Maps [maps.ygstr.com](https://maps.ygstr.com/)

### Distance and ETA calculator for Fortnite Battle Royale

![Gif showcase](img/showcase.gif)

[Reddit thread (discussion and ideas)](https://www.reddit.com/r/FortNiteBR/comments/8hhaiq/i_made_a_fortnite_eta_calculator/)

#### How to:

Click anywhere to spawn a new marker.
Click on an existing marker to move it.
Right click on a marker to delete it.

#### Recently added:
- Mobile / Touch support!
  - Drag and spawn points
  - Drag out mid-points
  - Delete specific point in the options menu
- Option menu for better UI
- Multiple maps from different seasons and resolutions
- Iframe embed support
- Mid-points:
  - Click in the middle of a path to create a new point!
  - Displays length between each point
- Right-click markers to remove them
- Optional grid
- Better distance presentation

#### Embed (depricated, use maps.ygstr.com instead):

It's very easy to embed this into your own website!
Just paste the iframe code below in the body. You can change the height and width to your own desire, just make
sure that the height is at least 100px bigger than the width (to make room for the options menu below!);
Example: [maps.livfor.it/embed_example](http://maps.livfor.it/embed_example.html)
```html
<!-- (HTTPS) Embed Fortnite Maps -->
<iframe src="https://yogsther.github.io/embed-fortnite-maps/embed.html" width="600" height="650" style="border:none; box-shadow:0px 0px 5px rgba(0,0,0,0.7); border-radius:2px;"></iframe>

<!-- (HTTP) Embed Fortnite Maps -->
<iframe src="http://maps.livfor.it/embed.html" width="600" height="650" style="border:none; box-shadow:0px 0px 5px rgba(0,0,0,0.7); border-radius:2px;"></iframe>
```

#### TODO:

- [x]  Scale down the canvas
- [x]  Add an optional grid
- [x]  Right click markers to remove them
- [x]  Spawn mid-points between points
- [x]  Map option (choose from what season you want the map to be displayed from)
- [x]  Iframe embed support
- [x]  Mobile support & manifesto
- [x]  Optimize hud, fewer links with overlay toggle for options menu
- [ ]  Package electron app
- [ ]  Optmize unnecessary big texture sizes
- [ ]  Zoom and pan features
  - Work has started on zoom features but are currently not worked on. Feel free to pick this up.
  - A camera offset and a global scale has been implemented for all drawn textures.
  - Scroll to zoom has been started on, but not finished. (See eventlistener "wheel")
  - Left todo:
    - Zoom in on cursor position relative to camera position (like in-game)
    - fix hitching bug when moving the camera (right click held down)
- [ ]  ~~Terrain height calcualtion.~~ Not needed since traveling with ramps has the same horizontal speed.

#### Known bugs:

- A lot of bugs in the zoom-and-pan features, but they are currently being worked on!
- Positions for pins and midpoints are not accurate on diffrence scales (When zooming)
- Season 3 8k is wrongly scaled, I will fix this once it's necessary and the zoom features are done.
