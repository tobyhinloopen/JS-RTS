function Point(x, y) {
  if(arguments.length == 1 && x.x != undefined && x.y != undefined) {
    this.x = x.x;
    this.y = x.y;
  } else if(arguments.length == 2) {
    this.x = x;
    this.y = y;
  } else {
    this.x = this.y = 0;
  }
}

var POINT_INCR = {
  n:  { x: 0, y:-1 },
  s:  { x: 0, y:+1 },
  w:  { x:-1, y: 0 },
  e:  { x:+1, y: 0 },
  nw: { x:-1, y:-1 },
  ne: { x:+1, y:-1 },
  sw: { x:-1, y:+1 },
  se: { x:+1, y:+1 }
};

Point.prototype.duplicate = function() {
  return new Point(this.x, this.y);
}

Point.prototype.addVector = function(direction, distance) {
  var INCR = POINT_INCR[direction];
  this.x += INCR.x * distance;
  this.y += INCR.y * distance;
  return this;
};

Point.getPivotPoints = function(from, to) {
  if(this.getExactGridDirection(from, to))
    return [];

  var xDiff = from.x - to.x;
  var yDiff = from.y - to.y;

  var xSign = xDiff > 0 ? -1 : 1;
  var ySign = yDiff > 0 ? -1 : 1;

  var absXDiff = Math.abs(xDiff);
  var absYDiff = Math.abs(yDiff);

  if(absXDiff > absYDiff) {
    // horizontal-ish movement
    return [new Point(from.x + (absXDiff - absYDiff) * xSign, from.y), new Point(from.x + absYDiff * xSign, from.y + absYDiff * ySign)]
  } else {
    // vertical-ish movement
    return [new Point(from.x, from.y + (absYDiff - absXDiff) * ySign), new Point(from.x + absXDiff * xSign, from.y + absXDiff * ySign)]
  }
};

Point.getExactGridDirection = function(from, to) {
  if(from.x == to.x) {
    if(to.y > from.y) return "s";
    else return "n";
  }
  else if(from.y == to.y) {
    if(to.x > from.x) return "e";
    else return "w";
  }
  else if(from.y - to.y == from.x - to.x) {
    if(to.x > from.x) return "se";
    else return "nw";
  }
  else if(to.y - from.y == from.x - to.x) {
    if(to.x > from.x) return "ne";
    else return "sw";
  }
};

Point.getDistance = function(from, to) {
  var x = from.x - to.x;
  var y = from.y - to.y;
  return Math.sqrt(x*x+y*y);
};

Point.getExactGridDistance = function(from, to) {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
};

function angleInDegs(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) / Math.PI * 180;
}

Point.getAngleDifference = function(from, to1, to2) {
  var a1 = angleInDegs(from, to1);
  var a2 = angleInDegs(from, to2);
  return Math.min((a2-a1+360)%360, (a1-a2+360)%360);
};

module.exports = Point;
