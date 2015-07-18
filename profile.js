var WorldMapFactory = require('world_map_factory');
var PathFinder = require('path_finder');
var pathFinder = new PathFinder(WorldMapFactory.buildJsRtsSampleMap());

var COUNT = 400;
for(var i=0, points = []; i<COUNT+1; i++)
  points.push({ x: (Math.random()*16)|0, y: (Math.random()*16)|0 });

while(points.length > 2)
  pathFinder.find(points.shift(), points[0]);
