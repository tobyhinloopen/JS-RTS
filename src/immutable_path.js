var Point = require('point');

function ImmutablePath(p1) {
  this.points = [p1];
  this.last = p1;
  this.distance = 0;
}

ImmutablePath.prototype.length = 1;

ImmutablePath.prototype.add = function(point) {
  return new ImmutablePathChild(this, point);
}

ImmutablePath.prototype.contains = function(point) {
  return this.last.x == point.x && this.last.y == point.y || this.parent && this.parent.contains(point);
}

function ImmutablePathChild(parentPath, point) {
  this.parent = parentPath;
  this.points = parentPath.points.slice();
  this.points.push(point);
  this.last = point;
  this.distance = parentPath.distance + Point.getDistance(parentPath.last, point);
  this.length = parentPath.length + 1;
}

ImmutablePathChild.prototype = Object.create(ImmutablePath.prototype);

module.exports = ImmutablePath;
