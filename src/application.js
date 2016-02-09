var GameApplication = require('game_application');
var ImageWorldMapReader = require('image_world_map_reader');

ImageWorldMapReader.load('maps/sample-map-crosshair.png', function(worldMap) {
  var app = new GameApplication(worldMap);
  document.body.appendChild(app.view);
  app.load(app.start.bind(app));
});
