var expect = require('expect.js');
var StraightJumpPointDistanceFinder = require('./straight_jump_point_distance_finder');
var WorldMapFactory = require('world_map_factory');

describe('StraightJumpPointDistanceFinder', function() {
  it('should initialize', function() {
    new StraightJumpPointDistanceFinder();
  });

  context('with empty map', function() {
    var sjpDistanceFinder;

    beforeEach(function() {
      var emptyMap = WorldMapFactory.build3x3empty();
      var primaryJumpPoints = { e: [], w: [], s: [], n: []};
      sjpDistanceFinder = new StraightJumpPointDistanceFinder(primaryJumpPoints, emptyMap);
      sjpDistanceFinder.find();
    });

    it('should set no south-distances', function() {
      expect(sjpDistanceFinder.distances.s).to.eql([{},{},{}]);
    });

    it('should set no west-distances', function() {
      expect(sjpDistanceFinder.distances.w).to.eql([{},{},{}]);
    });

    it('should set no north-distances', function() {
      expect(sjpDistanceFinder.distances.n).to.eql([{},{},{}]);
    });

    it('should set no south-distances', function() {
      expect(sjpDistanceFinder.distances.s).to.eql([{},{},{}]);
    });

    it('should set all not-a-jump-distance point distances to null', function() {
      var point = sjpDistanceFinder.get(0, 0);
      expect(point).to.eql({ n: undefined, s: undefined, w: undefined, e: undefined });
    });
  });

  context('with 3x3 map with gated wall', function() {
    var sjpDistanceFinder;

    beforeEach(function() {
      var mapWithGate = WorldMapFactory.build3x3withGate();
      var primaryJumpPoints = {
        w: [{ x: 0, y: 1 }],
        e: [{ x: 2, y: 1 }],
        n: [{ x: 0, y: 1 }, { x: 2, y: 1 }],
        s: [{ x: 0, y: 1 }, { x: 2, y: 1 }]
      };
      sjpDistanceFinder = new StraightJumpPointDistanceFinder(primaryJumpPoints, mapWithGate);
      sjpDistanceFinder.find();
    });

    it('should set the proper east-distances', function() {
      expect(sjpDistanceFinder.distances.e).to.eql([ { 1: 2 }, { 1: 1 }, {} ]);
    });

    it('should set the proper west-distances', function() {
      expect(sjpDistanceFinder.distances.w).to.eql([ {}, { 1: 1 }, { 1: 2 } ]);
    });

    it('should set the proper south-distances', function() {
      expect(sjpDistanceFinder.distances.s).to.eql([ { 0: 1 }, {}, { 0: 1 } ]);
    });

    it('should set the proper north-distances', function() {
      expect(sjpDistanceFinder.distances.n).to.eql([ { 2: 1 }, {}, { 2: 1 } ]);
    });
  });

  context('with JPS+ sample map', function() {
    it('should set the proper distances', function() {
      var jpsPlusSampleMap = WorldMapFactory.buildJpsPlusSample();
      var primaryJumpPoints = {
        n: [
          { x: 0, y: 1 },
          { x: 3, y: 1 },
          { x: 5, y: 3 },
          { x: 7, y: 3 },
          { x: 8, y: 1 }
        ],
        s: [
          { x: 0, y: 3 },
          { x: 1, y: 1 },
          { x: 3, y: 1 },
          { x: 5, y: 3 },
          { x: 8, y: 3 }
        ],
        w: [
          { x: 0, y: 1 },
          { x: 0, y: 3 },
          { x: 1, y: 1 },
          { x: 5, y: 3 }
        ],
        e: [
          { x: 3, y: 1 },
          { x: 7, y: 3 },
          { x: 8, y: 1 },
          { x: 8, y: 3 }
        ]
      };
      sjpDistanceFinder = new StraightJumpPointDistanceFinder(primaryJumpPoints, jpsPlusSampleMap);
      sjpDistanceFinder.find();

      expect(sjpDistanceFinder.distances.s).to.eql([
        { 0: 3, 1: 2, 2: 1 },
        { 0: 1 },
        {},
        { 0: 1 },
        {},
        { 0: 3, 1: 2, 2: 1 },
        {},
        {},
        { 0: 3, 1: 2, 2: 1 }
      ]);

      expect(sjpDistanceFinder.distances.n).to.eql([
        { 4: 3, 3: 2, 2: 1 },
        {},
        {},
        { 4: 3, 3: 2, 2: 1 },
        {},
        { 4: 1 },
        {},
        { 4: 1 },
        { 4: 3, 3: 2, 2: 1 }
      ]);

      expect(sjpDistanceFinder.distances.e).to.eql([
        { 1: 3 },
        { 1: 2 },
        { 1: 1 },
        { 3: 4 },
        { 3: 3 },
        { 3: 2 },
        { 3: 1 },
        { 1: 1, 3: 1 },
        {}
      ]);

      expect(sjpDistanceFinder.distances.w).to.eql([
        {},
        { 1: 1, 3: 1 },
        { 1: 1 },
        { 1: 2 },
        { 1: 3 },
        { 1: 4 },
        { 3: 1 },
        { 3: 2 },
        { 3: 3 }
      ]);
    });
  });
});
