var Point = require('point');

function ImmutablePath(p1) {
  this.last = p1;
}

ImmutablePath.prototype.distance = 0;
ImmutablePath.prototype.length = 1;

ImmutablePath.prototype.add = function(point) {
  return new ImmutablePathChild(this, point);
}

ImmutablePath.prototype.contains = function(point) {
  return this.last.x == point.x && this.last.y == point.y;
}

Object.defineProperty(ImmutablePathChild.prototype, 'points', {
  get: function() { return [this.last]; }
});

function ImmutablePathChild(parentPath, point) {
  this.parent = parentPath;
  this.last = point;
  this.distance = parentPath.distance + Point.getDistance(parentPath.last, point);
  this.length = parentPath.length + 1;
}

ImmutablePathChild.prototype = Object.create(ImmutablePath.prototype);

Object.defineProperty(ImmutablePathChild.prototype, 'points', {
  get: function() {
    var points = new Array(this.length);
    for(var path = this; path; path = path.parent)
      points[path.length-1] = path.last;
    return points;
  }
});

ImmutablePathChild.prototype.contains = function(point) {
  return this.last.x == point.x && this.last.y == point.y || this.parent.contains(point);
}

module.exports = ImmutablePath;
