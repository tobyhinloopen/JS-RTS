var expect = require('expect.js');
var Point = require('point');

describe('Point', function() {
  describe('.duplicate', function() {
    it('should return a copy of self', function() {
      var p1 = new Point(1, 2);
      var p2 = p1.duplicate();
      p2.x = 3;
      expect(p2).to.be.a(Point);
      expect(p2).to.not.eql(p1);
    });
  });

  describe('.addVector', function() {
    it('should return a point', function() {
      expect(new Point(0, 0).addVector('nw', 1)).to.be.a(Point);
    });

    it('should update the x/y of the point', function() {
      expect(new Point(0, 0).addVector('nw', 1)).to.eql({ x: -1, y: -1 });
    });
  });

  describe('.getPivotPoints', function() {
    it('should return an empty array for a straight line', function() {
      expect(Point.getPivotPoints({ x: 3, y: 3 }, { x: 5, y: 5 })).to.eql([]);
    });

    it('should return 2 pivot points for a non-straight line (vertical)', function() {
      var points = Point.getPivotPoints({ x: 3, y: 1 }, { x: 5, y: 5 });
      expect(points).to.be.an(Array);
      points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
      expect(points).to.eql([ { x: 3, y: 3 }, { x: 5, y: 3 } ]);
    });

    it('should return 2 pivot points for a non-straight line (horizontal)', function() {
      var points = Point.getPivotPoints({ x: 1, y: 3 }, { x: 5, y: 5 });
      expect(points).to.be.an(Array);
      points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
      expect(points).to.eql([ { x: 3, y: 3 }, { x: 3, y: 5 } ]);
    });

    it('should return 2 pivot points for a non-straight line (vertical, inverted)', function() {
      var points = Point.getPivotPoints({ x: 5, y: 5 }, { x: 3, y: 1 });
      expect(points).to.be.an(Array);
      points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
      expect(points).to.eql([ { x: 3, y: 3 }, { x: 5, y: 3 } ]);
    });

    it('should return 2 pivot points for a non-straight line (horizontal, inverted)', function() {
      var points = Point.getPivotPoints({ x: 5, y: 5 }, { x: 1, y: 3 });
      expect(points).to.be.an(Array);
      points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
      expect(points).to.eql([ { x: 3, y: 3 }, { x: 3, y: 5 } ]);
    });

    it('should return 2 pivot points for a non-straight line (horizontal)', function() {
      var points = Point.getPivotPoints({x: 9, y: 1 }, { x: 13, y: 0 });
      expect(points).to.be.an(Array);
      points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
      expect(points).to.eql([ { x: 10, y: 0 }, { x: 12, y: 1 } ]);
    });

    it('should return 2 pivot points for a non-straight line (vertical)', function() {
      var points = Point.getPivotPoints({x: 1, y: 9 }, { x: 0, y: 13 });
      expect(points).to.be.an(Array);
      points.sort(function(a, b) { return (a.y - b.y) || (a.x - b.x) });
      expect(points).to.eql([ { x: 0, y: 10 }, { x: 1, y: 12 } ]);
    });
  });

  describe('.getExactDistance', function() {
    it('should return a distance of 0 for the same point', function() {
      expect(Point.getExactGridDistance({ x: 3, y: 3 }, { x: 3, y: 3 })).to.be(0);
    });

    it('should return a distance of 1 for 1 horizontal distance', function() {
      expect(Point.getExactGridDistance({ x: 4, y: 3 }, { x: 3, y: 3 })).to.be(1);
    });

    it('should return a distance of 1 for 1 diagonal distance', function() {
      expect(Point.getExactGridDistance({ x: 4, y: 4 }, { x: 3, y: 3 })).to.be(1);
    });
  });

  describe('.getDistance', function() {
    it('should return a travel time of 1 for 1 straight distance', function() {
      expect(Point.getDistance({ x: 1, y: 1 }, { x: 2, y: 1 })).to.be(1);
    });

    it('should return a travel time of ~1.4 for 1 straight distance', function() {
      var expectedDistance = Math.sqrt(1*1+1*1);
      expect(Point.getDistance({ x: 1, y: 1 }, { x: 2, y: 2 })).to.be(expectedDistance);
    });
  });

  describe('.getExactGridDirection', function() {
    it('should recognize north', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 1 }, { x: 2, y: 0 })).to.be('n');
    });

    it('should recognize south', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 1 }, { x: 2, y: 2 })).to.be('s');
    });

    it('should recognize west', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 1 }, { x: 1, y: 1 })).to.be('w');
    });

    it('should recognize east', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 4 }, { x: 3, y: 4 })).to.be('e');
    });

    it('should recognize north-west', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 1 }, { x: 1, y: 0 })).to.be('nw');
    });

    it('should recognize north-east', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 1 }, { x: 3, y: 0 })).to.be('ne');
    });

    it('should recognize south-west', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 1 }, { x: 1, y: 2 })).to.be('sw');
    });

    it('should recognize south-east', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 4 }, { x: 3, y: 5 })).to.be('se');
    });

    it('should return false-like for other cases', function() {
      expect(Point.getExactGridDirection({ x: 2, y: 4 }, { x: 3, y: 7 })).to.not.be.ok();
    });
  });

  describe('.getAngleDifference', function() {
    var p = function(x, y) { return new Point(x, y); };

    it('should return 0 for the same point', function() {
      expect(Point.getAngleDifference(p(0, 0), p(1, 1), p(1, 1))).to.be(0);
    });

    it('should return 180 (degs) for the opposite point', function() {
      expect(Point.getAngleDifference(p(0, 0), p(-1, -1), p(1, 1))).to.be(180);
    });

    it('should return 90 (degs) for a straight corner', function() {
      expect(Point.getAngleDifference(p(0, 0), p(1, -1), p(1, 1))).to.be(90);
      expect(Point.getAngleDifference(p(0, 0), p(-1, 1), p(1, 1))).to.be(90);
    });
  });
});
