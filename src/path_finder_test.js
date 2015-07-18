var expect = require('expect.js');
var PathFinder = require('path_finder');
var WorldMapFactory = require('world_map_factory');
var DIAGONAL_DISTANCE = Math.sqrt(2);

describe('PathFinder', function() {
  it('should initialize', function() {
    expect(new PathFinder(WorldMapFactory.build3x3empty())).to.be.a(PathFinder);
  });

  context('without walls', function() {
    var pathFinder;

    beforeEach(function() {
      pathFinder = new PathFinder(WorldMapFactory.build5x5empty());
    });

    it('should return empty array for zero length path', function() {
      var path = pathFinder.find({ x: 0, y: 0 }, { x: 0, y: 0 });
      expect(path.points).to.be.empty();
    });

    it('should return the input points for a straight horizontal path', function() {
      var path = pathFinder.find({ x: 0, y: 0 }, { x: 2, y: 0 });
      expect(path.points).to.eql([{ x: 0, y: 0 }, { x: 2, y: 0 }]);
    });

    it('should return the input points for a diagonal path', function() {
      var path = pathFinder.find({ x: 0, y: 0 }, { x: 2, y: 2 });
      expect(path.points).to.eql([{ x: 0, y: 0 }, { x: 2, y: 2 }]);
    });

    it('should return 3 points for a horizontal diagonal path', function() {
      var path = pathFinder.find({ x: 0, y: 0 }, { x: 4, y: 2 });
      expect(path).to.have.length(3);
      expect(path.points[0]).to.eql({ x: 0, y: 0 });
      expect(path.points[2]).to.eql({ x: 4, y: 2 });
      expect(path.distance).to.be(DIAGONAL_DISTANCE*2+2);
    });

    it('should return 3 points for a vertical diagonal path', function() {
      var path = pathFinder.find({ x: 0, y: 0 }, { x: 2, y: 4 });
      expect(path).to.have.length(3);
      expect(path.points[0]).to.eql({ x: 0, y: 0 });
      expect(path.points[2]).to.eql({ x: 2, y: 4 });
      expect(path.distance).to.be(DIAGONAL_DISTANCE*2+2);
    });
  });

  context('with 5x5 map with multiple obstructions and multiple routes', function() {
    var pathFinder;

    beforeEach(function() {
      pathFinder = new PathFinder(WorldMapFactory.build5x5WithCenterObstructions());
    });

    it('should return false-like for a request ending in a wall', function() {
      var path = pathFinder.find({ x: 0, y: 0 }, { x: 1, y: 1 });
      expect(path).to.not.be.ok();
    });

    it('should return the shortest route', function() {
      var path = pathFinder.find({ x: 0, y: 1 }, { x: 4, y: 3 });
      expect(path.points).to.eql([{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 3 }]);
    });
  });

  context('with JS-RTS sample map', function() {
    var pathFinder;

    beforeEach(function() {
      pathFinder = new PathFinder(WorldMapFactory.buildJsRtsSampleMap());
    });

    it('should find shortest path from 9,1 to 13,0', function() {
      var path = pathFinder.find({ x: 9, y: 1 }, { x: 13, y: 0 });
      try {
        expect(path.points).to.eql([{ x: 9, y: 1 }, { x: 10, y: 0 }, { x: 13, y: 0 }]);
      } catch(e) {
        expect(path.points).to.eql([{ x: 9, y: 1 }, { x: 12, y: 1 }, { x: 13, y: 0 }]);
      }
    });

    it('should find shortest path from 9,2 to 13,0', function() {
      var path = pathFinder.find({ x: 9, y: 2 }, { x: 13, y: 0 });
      expect(path.points).to.eql([{ x: 9, y: 2 }, { x: 11, y: 0 }, { x: 13, y: 0 }]);
    });

    it('should find shortest path from 9,3 to 13,0', function() {
      var path = pathFinder.find({ x: 9, y: 3 }, { x: 13, y: 0 });
      expect(path.points).to.eql([{x:9,y:3},{x:10,y:2},{x:10,y:1},{x:12,y:1},{x:13,y:0}]);
    });

    it('should path-find from 9,13 to 13,0 without freezing', function() {
      var path = pathFinder.find({ x: 9, y: 13 }, { x: 13, y: 0 });
      expect(path.points).to.eql([{x:9,y:13},{x:10,y:12},{x:10,y:10},{x:14,y:6},{x:14,y:1},{x:13,y:0}]);
    });

    var COUNT = 0;
    for(var i=0, points = []; i<COUNT+1; i++)
      points.push({ x: (Math.random()*16)|0, y: (Math.random()*16)|0 });

    (COUNT > 0 ? it : xit)('should path-find '+COUNT+' random routes without error', function() {
      while(points.length > 2)
        pathFinder.find(points.shift(), points[0]);
    });
  });

  context('with JPS+ sample map', function() {
    var pathFinder;

    beforeEach(function() {
      pathFinder = new PathFinder(WorldMapFactory.buildJpsPlusSample());
    });

    describe('.find', function() {
      it('should return a single point for a straight unobstructed line', function() {
        var path = pathFinder.find({ x: 0, y: 1 }, { x: 5, y: 1 });
        expect(path.points).to.eql([{ x: 0, y: 1 }, { x: 5, y: 1 }]);
      });

      it('should return 3 points for an unobstructed pivoted line', function() {
        var path = pathFinder.find({ x: 0, y: 1 }, { x: 5, y: 3 });
        expect(path.points).to.eql([{ x: 0, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 3 }]);
      });

      it('should return 4 points for an obstructed line', function() {
        var path = pathFinder.find({ x: 0, y: 1 }, { x: 8, y: 3 });
        expect(path.points).to.eql([{ x: 0, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 3 }, { x: 8, y: 3 }]);
      });

      it('should return 7 points for the sample path', function() {
        var path = pathFinder.find({ x: 0, y: 4 }, { x: 7, y: 0 });
        expect(path.points).to.eql([{x:0,y:4},{x:0,y:1},{x:3,y:1},{x:5,y:3},{x:8,y:3},{x:8,y:1},{x:7,y:0}]);
      });
    });

    describe('.nextJumpPointsFor', function() {
      it('should return all next jump points as an array', function() {
        var points = pathFinder.nextJumpPointsFor({ x: 0, y: 1 });
        expect(points).to.be.an(Array);
        points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
        expect(points).to.eql([
          { x: 3, y: 1 },
          { x: 0, y: 3 }
        ]);
      });

      it('should return all next jump points as an array', function() {
        var points = pathFinder.nextJumpPointsFor({ x: 0, y: 0 });
        expect(points).to.be.an(Array);
        points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
        expect(points).to.eql([
          { x: 1, y: 1 },
          { x: 0, y: 3 }
        ]);
      });

      it('should honor the incoming direction', function() {
        var points = pathFinder.nextJumpPointsFor({ x: 0, y: 0 }, "w");
        expect(points).to.be.an(Array);
        expect(points).to.eql([ { x: 0, y: 3 } ]);
      });
    });

    describe('.isStraightUnobstructedJump', function() {
      it('should be false for a non-straight line', function() {
        expect(pathFinder.isStraightUnobstructedJump({ x: 0, y: 0}, { x: 2, y: 1 })).to.be(false);
      });

      it('should be true for a straight diagonal line south-east', function() {
        expect(pathFinder.isStraightUnobstructedJump({ x: 0, y: 0}, { x: 1, y: 1 })).to.be(true);
      });

      it('should be true for a straight horizontal line west', function() {
        expect(pathFinder.isStraightUnobstructedJump({ x: 1, y: 0}, { x: 0, y: 0 })).to.be(true);
      });

      it('should be false for an obstructed straight line east', function() {
        expect(pathFinder.isStraightUnobstructedJump({ x: 0, y: 0 }, { x: 4, y: 0 })).to.be(false);
      });

      it('should be true for a straight line crossing multiple jump points, east', function() {
        expect(pathFinder.isStraightUnobstructedJump({ x: 3, y: 3 }, { x: 8, y: 3 })).to.be(true);
      });

      it('should be false for a line starting on a wall', function() {
        expect(pathFinder.isStraightUnobstructedJump({ x: 2, y: 0 }, { x: 3, y: 0 })).to.be(false);
      });

      it('should be false for a line crossing a jump point and a wall', function() {
        expect(pathFinder.isStraightUnobstructedJump({ x: 2, y: 1 }, { x: 7, y: 1 })).to.be(false);
      });
    });
  });
});
