var JumpPointSearchPlus = require('jump_point_search_plus');
var Point = require('point');
var ImmutablePath = require('immutable_path');

function PathFinder(worldMap) {
  this.worldMap = worldMap;
  this.jpsPlus = new JumpPointSearchPlus(this.worldMap);
  this.jpsPlus.find();
}

PathFinder.prototype.find = function(from, to) {
  if(from.x == to.x && from.y == to.y)
    return { points: [], distance: 0 };

  if(this.worldMap.isWall(to.x, to.y))
    return null;

  if(this.isStraightUnobstructedJump(from, to))
    return new ImmutablePath(from).add(to);

  var pivotPoints = Point.getPivotPoints(from, to);
  for(var i=0, pivotPoint; pivotPoint = pivotPoints[i]; i++) {
    if(this.isStraightUnobstructedJump(from, pivotPoint)
    && this.isStraightUnobstructedJump(pivotPoint, to))
      return new ImmutablePath(from).add(pivotPoint).add(to);
  }

  this.sortedPaths = [new ImmutablePath(from)];

  while(this.sortedPaths.length > 0) {
    var nextIncompletePath = this.sortedPaths.shift();
    var last = nextIncompletePath.last;
    if(last.x == to.x && last.y == to.y)
      return nextIncompletePath;

    var completePath = this.createUnobstructedJumpPath(nextIncompletePath, to);
    if(completePath)
      this.pushSortedPath(completePath);
    else
      this.createPathsForJumpPoints(nextIncompletePath);
  }
}

PathFinder.prototype.createUnobstructedJumpPath = function(path, to) {
  if(this.isStraightUnobstructedJump(path.last, to))
    return path.add(to);

  var pivotPoints = Point.getPivotPoints(path.last, to);
  for(var i=0, pivotPoint; pivotPoint = pivotPoints[i]; i++)
    if(this.isStraightUnobstructedJump(path.last, pivotPoint)
    && this.isStraightUnobstructedJump(pivotPoint, to))
      return path.add(pivotPoint).add(to);
}

PathFinder.prototype.createPathsForJumpPoints = function(path) {
  var incomingDirection = path.length >= 2 ? Point.getExactGridDirection(path.parent.last, path.last) : null;
  var points = this.nextJumpPointsFor(path.last, incomingDirection);

  for(var i=0, point; point = points[i]; i++) {
    if(!path.contains(point)) {
      var direction = Point.getExactGridDirection(path.last, point);
      this.pushSortedPath(direction == incomingDirection ? path.parent.add(point) : path.add(point));
    }
  }
};

PathFinder.prototype.pushSortedPath = function(path) {
  this.sortedPaths.push(path);
  this.sortedPaths.sort(function(a, b) {
    return a.distance - b.distance;
  });
};

PathFinder.prototype.isStraightUnobstructedJump = function(from, to) {
  if(this.worldMap.isWall(from.x, from.y)
  || this.worldMap.isWall(to.x, to.y))
    return false;

  var distance = Point.getExactGridDistance(from, to);
  var direction = Point.getExactGridDirection(from, to);
  if(!direction)
    return false;

  var value = this.jpsPlus.getPoint(from.x, from.y)[direction];

  // check if value is a distance to wall (as a negative number or 0)
  if(value <= 0)
    return distance <= -value;
  // no distance to wall; value is distance to the next jump point
  else if(distance <= value)
    return true;
  else
    return this.isStraightUnobstructedJump(new Point(from).addVector(direction, value), to);
};

var DIRECTION_BLACKLIST = {
  n: ["se", "s", "sw"],
  w: ["se", "e", "ne"],
  s: ["ne", "n", "nw"],
  e: ["nw", "w", "sw"],
  nw: ["s", "se", "e"],
  sw: ["n", "ne", "e"],
  ne: ["s", "sw", "w"],
  se: ["n", "nw", "w"]
}

PathFinder.prototype.nextJumpPointsFor = function(point, incomingDirection) {
  var directionBlacklist = DIRECTION_BLACKLIST[incomingDirection];
  var distances = this.jpsPlus.getPoint(point.x, point.y), points = [], distance;

  for(var direction in distances)
    if(!directionBlacklist || directionBlacklist.indexOf(direction) == -1)
      if((distance = distances[direction]) > 0)
        points.push(new Point(point).addVector(direction, distance));

  return points;
};

module.exports = PathFinder;
