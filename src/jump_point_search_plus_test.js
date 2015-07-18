var expect = require('expect.js');
var JumpPointSearchPlus = require('jump_point_search_plus');
var WorldMap = require('world_map');
var WorldMapFactory = require('world_map_factory');

var JPS_PLUS_SAMPLE_MAP_DISTANCES = (function() {
  var distances = [
    "+0+0+0 +0+0+0        +0+0+0 +0+0+0 +0+0+0        +0+0+0 +0+0+0",
    "+0  -1 -1  +0        +0  -2 -1  -1 -2  +0        +0  -1 -1  +0",
    "+0+3+1 +1+1+0        +0+1+2 +1-4+1 +1+3+0        +0-1+1 -1+3+0",

    "+0-1-1 -1-1+0 +0+0+0 +0-1-1 -1-1-1 -1-1+0        +0-1-1 -1-1+0",
    "+0  +3 +1  +2 +1  +1 +2  -2 +3  -1 +4  +0        +0  +1 -1  +0",
    "+0+2+0 +0+0+0 +0+0+0 +0-3+2 -1-3+1 -2+2+0        +0+0+0 +0+2+0",

    "+0+1+0               +0+1-2 +1-2-1 +1-2+0               +0+1+0",
    "+0  +0               +0  -2 -1  -1 -2  +0               +0  +0",
    "+0+1+0               +0-2+1 -1-2+1 -2+1+0               +0+1+0",

    "+0+2+0 +0+0+0        +0+2-2 +1-3-1 +2-3+0 +0+0+0 +0+0+0 +0+2+0",
    "+0  -1 +1  +0        +0  +4 -1  +3 -2  +2 +1  +1 +2  +1 +3  +0",
    "+0-1-1 -1-1+0        +0-1-1 -1-1-1 -1-1+0 +0+0+0 +0-1-1 -1-1+0",

    "+0+3-1 +1-1+0        +0+3+1 +1-4+1 +2+1+0        +0+1+1 +1+3+0",
    "+0  -1 -1  +0        +0  -2 -1  -1 -2  +0        +0  -1 -1  +0",
    "+0+0+0 +0+0+0        +0+0+0 +0+0+0 +0+0+0        +0+0+0 +0+0+0",
  ];

  var points = new Array(5);
  for(var y=0; y<5; y++) {
    var row = points[y] = new Array(9);
    for(var x=0; x<9; x++) {
      var point = row[x] = {};
      if(distances[y*3  ].substr(x*7  , 2) == '  ')
        continue;

      point.nw = parseInt(distances[y*3  ].substr(x*7  , 2), 10);
      point.n  = parseInt(distances[y*3  ].substr(x*7+2, 2), 10);
      point.ne = parseInt(distances[y*3  ].substr(x*7+4, 2), 10);
      point.e  = parseInt(distances[y*3+1].substr(x*7+4, 2), 10);
      point.se = parseInt(distances[y*3+2].substr(x*7+4, 2), 10);
      point.s  = parseInt(distances[y*3+2].substr(x*7+2, 2), 10);
      point.sw = parseInt(distances[y*3+2].substr(x*7  , 2), 10);
      point.w  = parseInt(distances[y*3+1].substr(x*7  , 2), 10);
    }
  }

  return points;
})();

describe('JumpPointSearchPlus', function() {
  it('should initialize', function() {
    new JumpPointSearchPlus();
  });

  context('for an empty map', function() {
    var jpsPlus;

    beforeEach(function() {
      var worldMap = new WorldMap();
      worldMap.setSize(3, 3);
      jpsPlus = new JumpPointSearchPlus(worldMap);
      jpsPlus.find();
    });

    it('should get information about a point', function() {
      expect(jpsPlus.getPoint(0, 0)).have.keys('n', 'w', 'e', 's', 'nw', 'sw', 'ne', 'se');
    });

    it('should set a wall-distance of zero for a point at the wall', function() {
      var point = jpsPlus.getPoint(0, 0);
      expect(point.n).to.be(0);
      expect(point.w).to.be(0);
      expect(point.nw).to.be(0);
    });

    it('should set a wall-distance of -1 for a point 1 point away from a wall', function() {
      var point = jpsPlus.getPoint(1, 1);
      expect(point.n).to.be(-1);
      expect(point.w).to.be(-1);
      expect(point.nw).to.be(-1);
    });
  });

  it('should calculate the jps+ sample world map properly', function() {
    var map = WorldMapFactory.buildJpsPlusSample();
    var jpsPlus = new JumpPointSearchPlus(map);
    jpsPlus.find();
    for(var y=0; y<map.height; y++)
      for(var x=0; x<map.width; x++) {
        var p1 = jpsPlus.points[y][x], p2 = JPS_PLUS_SAMPLE_MAP_DISTANCES[y][x];
        p2.x = p1.x = x;
        p2.y = p1.y = y;
        expect(p1).to.eql(p2);
      }
  });
});
