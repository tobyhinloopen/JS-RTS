var WorldMap = require('world_map');
var WorldMapFactory = require('world_map_factory');

var map5x5Empty = WorldMapFactory.build5x5empty();
benchmark('WorldMap.isWall - Empty map', 1e6, function(i) {
  map5x5Empty.isWall(Math.floor(i/5), i%5);
});

var jsRtsSampleMap = WorldMapFactory.buildJsRtsSampleMap();
benchmark('WorldMap.isWall - JS-RTS sample map', 1e6, function(i) {
  jsRtsSampleMap.isWall(Math.floor(i/16), i%16);
});
