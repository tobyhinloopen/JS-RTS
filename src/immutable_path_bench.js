var ImmutablePath = require('immutable_path');

var P = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }];

benchmark('ImmutablePath - initialize with 3 points', 1e5, function() {
  var path = new ImmutablePath(P[0]).add(P[1]).add(P[2]);
});

benchmark('ImmutablePath - initialize with 1 point', 1e6, function() {
  var path = new ImmutablePath(P[0]);
});
