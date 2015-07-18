var WorldMapFactory = require('world_map_factory');
var PathFinder = require('path_finder');
var pathFinder = new PathFinder(WorldMapFactory.buildJsRtsSampleMap());

var COUNT = 10;
for(var i=0; i<COUNT; i++)
  pathFinder.find({ x: 9, y: 13 }, { x: 13, y: 0 });
