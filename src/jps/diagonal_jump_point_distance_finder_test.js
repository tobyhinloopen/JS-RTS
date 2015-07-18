var expect = require('expect.js');
var DiagonalJumpPointDistanceFinder = require('./diagonal_jump_point_distance_finder');
var WorldMapFactory = require('world_map_factory');

describe('DiagonalJumpPointDistanceFinder', function() {
  it('should initialize', function() {
    new DiagonalJumpPointDistanceFinder();
  });

  context('with 3x2 map corner piece', function() {
    var djpDistanceFinder;

    beforeEach(function() {
      var mapWithGate = WorldMapFactory.build3x2withCorner();

      var primaryJumpPoints = {
        w: [],
        e: [{ x: 1, y: 0 }],
        n: [{ x: 1, y: 0 }],
        s: []
      };

      var straightJumpPoints = {
        n: [{}, { 1: 1 }, {}],
        s: [{}, {}, {}],
        w: [{}, {}, {}],
        e: [{ 0: 1 }, {}, {}]
      };

      djpDistanceFinder = new DiagonalJumpPointDistanceFinder(primaryJumpPoints, straightJumpPoints, mapWithGate);
      djpDistanceFinder.find();
    });

    it('should assign the straight jump point distances', function() {
      expect(djpDistanceFinder.straightDistancesForPoint(1, 1)).to.eql({ n: 1 });
      expect(djpDistanceFinder.straightDistancesForPoint(0, 0)).to.eql({ e: 1 });
    });

    it('should find all jump points', function() {
      expect(djpDistanceFinder.distances).to.eql([
        [{ e: 1 }, {}, {}],
        [{}, { n: 1 }, { nw: 1 }]
      ]);
    });
  });

  context('with JPS+ sample map', function() {
    it('should set the proper distances', function() {
      var jpsPlusSampleMap = WorldMapFactory.buildJpsPlusSample();
      var primaryJumpPoints = {
        n: [{x:0,y:1},{x:3,y:1},{x:5,y:3},{x:7,y:3},{x:8,y:1}],
        s: [{x:0,y:3},{x:1,y:1},{x:3,y:1},{x:5,y:3},{x:8,y:3}],
        w: [{x:0,y:1},{x:0,y:3},{x:1,y:1},{x:5,y:3}],
        e: [{x:3,y:1},{x:7,y:3},{x:8,y:1},{x:8,y:3}]
      };

      var straightJumpPoints = {
        n: [{4:3,3:2,2:1},{},{},{4:3,3:2,2:1},{},{4:1},{},{4:1},{4:3,3:2,2:1}],
        s: [{0:3,1:2,2:1},{0:1},{},{0:1},{},{0:3,1:2,2:1},{},{},{0:3,1:2,2:1}],
        w: [{},{1:1,3:1},{1:1},{1:2},{1:3},{1:4},{3:1},{3:2},{3:3}],
        e: [{1:3},{1:2},{1:1},{3:4},{3:3},{3:2},{3:1},{1:1,3:1},{}]
      };

      var djpDistanceFinder = new DiagonalJumpPointDistanceFinder(primaryJumpPoints, straightJumpPoints, jpsPlusSampleMap);
      djpDistanceFinder.find();

      expect(djpDistanceFinder.distances[0]).to.eql([
        {s:3,se:1},{sw:1,s:1},{},{s:1,se:2},{sw:1,se:1},{sw:1,s:3},{},{se:1},{s:3}]);
      expect(djpDistanceFinder.distances[1]).to.eql([
        {s:2,e:3},{w:1,e:2},{w:1,e:1},{w:2,se:2},{w:3,se:1},{w:4,s:2},{},{e:1},{s:2}]);
      expect(djpDistanceFinder.distances[2]).to.eql([
        {n:1,s:1},{},{},{n:1,se:1},{nw:1,se:1},{nw:1,s:1},{},{},{n:1,s:1}]);
      expect(djpDistanceFinder.distances[3]).to.eql([
        {n:2},{w:1},{},{n:2,e:4},{nw:1,e:3},{nw:2,e:2},{e:1,w:1},{w:2,e:1},{w:3,n:2}]);
      expect(djpDistanceFinder.distances[4]).to.eql([
        {n:3},{nw:1},{},{n:3,ne:1},{nw:1,ne:1},{nw:2,n:1},{},{n:1,ne:1},{nw:1,n:3}]);
    });
  });
});
