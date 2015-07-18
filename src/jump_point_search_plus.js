var PrimaryJumpPointFinder = require('jps/primary_jump_point_finder');
var StraightJumpPointDistanceFinder = require('jps/straight_jump_point_distance_finder');
var DiagonalJumpPointDistanceFinder = require('jps/diagonal_jump_point_distance_finder');
var WallDistanceFinder = require('jps/wall_distance_finder');

function JumpPointSearchPlus(worldMap) {
  this.worldMap = worldMap;
}

JumpPointSearchPlus.prototype.find = function() {
  var pjpf = new PrimaryJumpPointFinder(this.worldMap);
  pjpf.find();

  var sjpdf = new StraightJumpPointDistanceFinder(pjpf, this.worldMap);
  sjpdf.find();

  var djpdf = new DiagonalJumpPointDistanceFinder(pjpf, sjpdf.distances, this.worldMap);
  djpdf.find();

  var wallDistanceFinder = new WallDistanceFinder(djpdf.distances, this.worldMap);
  wallDistanceFinder.find();

  this.points = wallDistanceFinder.distances;
}

JumpPointSearchPlus.prototype.getPoint = function(x, y) {
  return this.points[y][x];
}

module.exports = JumpPointSearchPlus;
