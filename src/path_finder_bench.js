var PathFinder = require('path_finder');
var WorldMapFactory = require('world_map_factory');
var StaticRandom = require('static_random');

function benchmarkMap(map, name, findIterations, isJumpIterations) {
  var pathFinder = new PathFinder(map);
  var width = map.width, height = map.height;
  var random = new StaticRandom();

  benchmark('PathFinder.find '+name, findIterations, function() {
    var p1 = { x: Math.floor(random.next() * width), y: Math.floor(random.next() * height) };
    var p2 = { x: Math.floor(random.next() * width), y: Math.floor(random.next() * height) };
    pathFinder.find(p1, p2);
  });
}

benchmarkMap(WorldMapFactory.build5x5empty(), '5x5 empty', 1e6, 1e5);
benchmarkMap(WorldMapFactory.build5x5WithCenterObstructions(), '5x5 center walls', 1e5, 1e5);
benchmarkMap(WorldMapFactory.buildJpsPlusSample(), 'JPS+ sample map', 1e5, 1e5);
benchmarkMap(WorldMapFactory.buildJsRtsSampleMap(), 'JS-RTS sample map', 1e4, 1e5);

var pathFinder = new PathFinder(WorldMapFactory.buildJsRtsSampleMap());
benchmark('PathFinder.find JS-RTS sample map 9,13 to 13,0', 1e3, function() {
  pathFinder.find({ x: 9, y: 13 }, { x: 13, y: 0 });
});

benchmark('PathFinder.find JS-RTS sample map 0,15 to 12,3', 1e3, function() {
  pathFinder.find({ x: 0, y: 15 }, { x: 12, y: 3 });
});
