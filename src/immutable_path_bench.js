var ImmutablePath = require('immutable_path');
var StaticRandom = require('static_random');

var P = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }];

benchmark('ImmutablePath - initialize with 3 points', 1e5, function() {
  var path = new ImmutablePath(P[0]).add(P[1]).add(P[2]);
});

var rand = new StaticRandom();
var path = new ImmutablePath(P[0]);
for(var i=0; i<19; i++)
  path = path.add({ x: Math.floor(rand.next()*10), y: Math.floor(rand.next()*10) });

benchmark('ImmutablePath.contains with 20 points', 1e5, function(i) {
  path.contains({ x: Math.floor(rand.next()*10), y: Math.floor(rand.next()*10) })
});

benchmark('ImmutablePath - initialize with 1 point', 1e6, function() {
  var path = new ImmutablePath(P[0]);
});
