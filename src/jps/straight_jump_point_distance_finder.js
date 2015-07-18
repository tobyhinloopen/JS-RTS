function StraightJumpPointDistanceFinder(primaryJumpPoints, worldMap) {
  this.primaryJumpPoints = primaryJumpPoints;
  this.worldMap = worldMap;
}

StraightJumpPointDistanceFinder.prototype.find = function() {
  var width = this.worldMap.width;

  this.distances = {
    n: new Array(width), s: new Array(width),
    w: new Array(width), e: new Array(width)
  };

  for(var x=0; x<width; x++) {
    this.distances.n[x] = {};
    this.distances.w[x] = {};
    this.distances.s[x] = {};
    this.distances.e[x] = {};
  }

  this.findForDirection(this.primaryJumpPoints.e, this.distances.e, -1, 0);
  this.findForDirection(this.primaryJumpPoints.w, this.distances.w, +1, 0);
  this.findForDirection(this.primaryJumpPoints.s, this.distances.s, 0, -1);
  this.findForDirection(this.primaryJumpPoints.n, this.distances.n, 0, +1);
};

StraightJumpPointDistanceFinder.prototype.findForDirection = function(pjps, distances, xIncr, yIncr) {
  for(var i=0, point; point = pjps[i]; i++) {
    for(var distance=1, next; (next = {
      x: point.x + xIncr * distance,
      y: point.y + yIncr * distance
    }) && !this.worldMap.isWall(next.x, next.y); distance++) {
      distances[next.x][next.y] = distance;
      if(isPjp(pjps, next))
        break;
    }
  }
};

StraightJumpPointDistanceFinder.prototype.get = function(x, y) {
  return {
    n: this.distances.n[x][y],
    s: this.distances.s[x][y],
    e: this.distances.e[x][y],
    w: this.distances.w[x][y]
  }
};

function isPjp(pjps, point) {
  for(var i=0, pjp; pjp = pjps[i]; i++)
    if(pjp.x == point.x && pjp.y == point.y)
      return true;
  return false;
}

module.exports = StraightJumpPointDistanceFinder;
