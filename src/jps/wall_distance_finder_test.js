var expect = require('expect.js');
var WallDistanceFinder = require('./wall_distance_finder');
var WorldMapFactory = require('world_map_factory');

describe('WallDistanceFinder', function() {
  it('should initialize', function() {
    new WallDistanceFinder();
  });

  it('should find a wall right next to a diagonal path', function() {
    var mapWithDiagonalObstruction = WorldMapFactory.build3x3WithDiagonalObstruction();
    var jumpPoints = [
      [{ se: 1 }, { sw: 1, s: 1 }, {}],
      [{}, { w: 1 }, { w: 1 }],
      [{ n: 1 }, {}, {}]
    ];

    wallDistanceFinder = new WallDistanceFinder(jumpPoints, mapWithDiagonalObstruction);
    wallDistanceFinder.find();

    expect(wallDistanceFinder.distances[2][0]).to.eql(
      { e: 0, w: 0, s: 0, n: 1, nw: 0, sw: 0, ne: 0, se: 0 });

    expect(wallDistanceFinder.distances[0][1]).to.eql(
      { e: 0, w:-1, s: 1, n: 0, nw: 0, sw: 1, ne: 0, se: 0 });
  });

  context('with 3x2 map corner piece', function() {
    var wallDistanceFinder;

    beforeEach(function() {
      var mapWithGate = WorldMapFactory.build3x2withCorner();

      var diagonalJumpPoints = [
        [{ e: 1 }, {}, {}],
        [null, { n: 1 }, { nw: 1 }]
      ];

      wallDistanceFinder = new WallDistanceFinder(diagonalJumpPoints, mapWithGate);
      wallDistanceFinder.find();
    });

    it('should calculate the wall distances', function() {
      expect(wallDistanceFinder.distances[0]).to.eql([
        { e: 1, w: 0, s: 0, n: 0, nw: 0, sw: 0, ne: 0, se: 0 },
        { e:-1, w:-1, s:-1, n: 0, nw: 0, sw: 0, ne: 0, se:-1 },
        { e: 0, w:-2, s:-1, n: 0, nw: 0, sw:-1, ne: 0, se: 0 }
      ]);
      expect(wallDistanceFinder.distances[1]).to.eql([
        null,
        { e:-1, w: 0, s: 0, n: 1, nw: 0, sw: 0, ne:-1, se: 0 },
        { e: 0, w:-1, s: 0, n:-1, nw: 1, sw: 0, ne: 0, se: 0 }
      ])
    });
  });
});
