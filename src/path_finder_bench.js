var PathFinder = require('path_finder');
var WorldMapFactory = require('world_map_factory');
var StaticRandom = require('static_random');

function benchmarkMap(map, name, iterations) {
  var pathFinder = new PathFinder(map);
  var width = map.width, height = map.height;
  var random = new StaticRandom();

  benchmark('PathFinder('+name+').find', iterations, function() {
    var p1 = { x: Math.floor(random.next() * width), y: Math.floor(random.next() * height) };
    var p2 = { x: Math.floor(random.next() * width), y: Math.floor(random.next() * height) };
    pathFinder.find(p1, p2);
  });
}

benchmarkMap(WorldMapFactory.build5x5empty(), '5x5 empty', 1e5);
benchmarkMap(WorldMapFactory.build5x5WithCenterObstructions(), '5x5 with center obstructions', 1e5);
benchmarkMap(WorldMapFactory.buildJpsPlusSample(), 'JPS+ sample map', 1e5);
benchmarkMap(WorldMapFactory.buildJsRtsSampleMap(), 'JS-RTS sample map', 1e3);
