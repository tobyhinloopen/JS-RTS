var expect = require('expect.js');
var ImmutablePath = require('immutable_path');

describe('ImmutablePath', function() {
  it('should initialize', function() {
    new ImmutablePath({ x: 0, y: 0 }, { x: 1, y: 1 });
  });

  context('with minimal path (2 points)', function() {
    var path;

    beforeEach(function() {
      path = new ImmutablePath({ x: 0, y: 0 }).add({ x: 1, y: 1 });
    });

    it('.length should be 2', function() {
      expect(path.length).to.be(2);
    });

    it('.points should be an array with the 2 points', function() {
      expect(path.points).to.eql([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
    });

    it('.distance should be set', function() {
      expect(path.distance).to.be(Math.sqrt(2));
    });

    it('.add should create a copy', function() {
      var copy = path.add({ x: 2, y: 2 });
      expect(path).not.to.be(copy);
      expect(path.length).to.be(2);
      expect(copy.length).to.be(3);
    });

    it('.contains should return true-like if it contains the point', function() {
      expect(path.contains({ x: 1, y: 1 })).to.be.ok();
    });

    it('.contains should return false-like if it does not contain the point', function() {
      expect(path.contains({ x: 1, y: 3 })).to.not.be.ok();
    });
  });
});
