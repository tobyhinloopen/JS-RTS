var expect = require('expect.js');
var PrimaryJumpPointFinder = require('./primary_jump_point_finder');
var WorldMap = require('world_map');
var WorldMapFactory = require('world_map_factory');

describe('PrimaryJumpPointFinder', function() {
  it('should initialize', function() {
    new PrimaryJumpPointFinder();
  });

  it('should find no primary jump points for an empty map', function() {
    var pjp = new PrimaryJumpPointFinder(WorldMapFactory.build3x3empty());
    pjp.find();
    expect(pjp.e).to.be.empty();
    expect(pjp.w).to.be.empty();
    expect(pjp.s).to.be.empty();
    expect(pjp.n).to.be.empty();
  });

  context('for a 3x3 map with a gate-like vertical wall', function() {
    var pjp;

    beforeEach(function() {
      pjp = new PrimaryJumpPointFinder(WorldMapFactory.build3x3withGate());
      pjp.find();
    });

    it('should find a east primary jump point after a wall', function() {
      expect(pjp.e).to.have.length(1);
      expect(pjp.e[0]).to.eql({ x: 2, y: 1 });
    });

    it('should find a west primary jump point after a wall', function() {
      expect(pjp.w).to.have.length(1);
      expect(pjp.w[0]).to.eql({ x: 0, y: 1 });
    });

    it('should find all north primary jump point after a wall', function() {
      expect(pjp.n).to.have.length(2);
      expect(pjp.n[0]).to.eql({ x: 0, y: 1 });
      expect(pjp.n[1]).to.eql({ x: 2, y: 1 });
    });

    it('should find all south primary jump point after a wall', function() {
      expect(pjp.s).to.have.length(2);
      expect(pjp.s[0]).to.eql({ x: 0, y: 1 });
      expect(pjp.s[1]).to.eql({ x: 2, y: 1 });
    });
  });

  context('for jps+ sample world map', function() {
    var pjp;

    beforeEach(function() {
      pjp = new PrimaryJumpPointFinder(WorldMapFactory.buildJpsPlusSample());
      pjp.find();
    });

    it('should find all west primary jump points', function() {
      expect(pjp.w).to.have.length(4);
      expect(pjp.w).to.eql([
        { x: 0, y: 1 },
        { x: 0, y: 3 },
        { x: 1, y: 1 },
        { x: 5, y: 3 }
      ]);
    });

    it('should find all east primary jump points', function() {
      expect(pjp.e).to.have.length(4);
      expect(pjp.e).to.eql([
        { x: 3, y: 1 },
        { x: 7, y: 3 },
        { x: 8, y: 1 },
        { x: 8, y: 3 }
      ]);
    });

    it('should find all north primary jump points', function() {
      expect(pjp.n).to.have.length(5);
      expect(pjp.n).to.eql([
        { x: 0, y: 1 },
        { x: 3, y: 1 },
        { x: 5, y: 3 },
        { x: 7, y: 3 },
        { x: 8, y: 1 }
      ]);
    });

    it('should find all south primary jump points', function() {
      expect(pjp.s).to.have.length(5);
      expect(pjp.s).to.eql([
        { x: 0, y: 3 },
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 5, y: 3 },
        { x: 8, y: 3 }
      ]);
    });
  });
});
