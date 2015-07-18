function WallDistanceFinder(diagonalJumpPoints, worldMap) {
  this.distances = diagonalJumpPoints;
  this.worldMap = worldMap;
}

WallDistanceFinder.prototype.find = function() {
  this.worldMap.iterateWalls(this.wallAt.bind(this));

  var width = this.worldMap.width, height = this.worldMap.height;

  for(var y=0; y<height; y++)
    for(var x=0; x<width; x++)
      if(!this.worldMap.isWall(x, y))
        this.addWorldBorderDistanceFor(x, y);
};

WallDistanceFinder.prototype.wallAt = function(x, y) {
  var DIRECTIONS = {
    n:  { x: 0, y:+1 },
    s:  { x: 0, y:-1 },
    w:  { x:+1, y: 0 },
    e:  { x:-1, y: 0 },
    nw: { x:+1, y:+1 },
    ne: { x:-1, y:+1 },
    sw: { x:+1, y:-1 },
    se: { x:-1, y:-1 }
  };

  for(var directionName in DIRECTIONS) {
    var incr = DIRECTIONS[directionName];
    this.wallDistancesFrom(x, y, incr.x, incr.y, directionName);
    this.wallDistancesFrom(x - incr.x, y, incr.x, incr.y, directionName);
    this.wallDistancesFrom(x, y - incr.y, incr.x, incr.y, directionName);
  }
};

WallDistanceFinder.prototype.wallDistancesFrom = function(originX, originY, incrX, incrY, direction) {
  for(var i=1, x, y;;i++) {
    x = originX + incrX * i;
    y = originY + incrY * i;
    if(this.worldMap.isWall(x, y))
      return;
    var distance = 1-i, currentDistance = this.distances[y][x][direction];
    if(currentDistance == null || currentDistance < distance)
      this.distances[y][x][direction] = distance;
  }
};

WallDistanceFinder.prototype.addWorldBorderDistanceFor = function(x, y) {
  var width = this.worldMap.width, height = this.worldMap.height;
  var n = (-y)||0, s = (1-(height - y))||0;
  var w = (-x)||0, e = (1-(width - x))||0;

  var point = this.distances[y][x];
  point.n == null && (point.n = n);
  point.s == null && (point.s = s);
  point.w == null && (point.w = w);
  point.e == null && (point.e = e);

  point.nw == null && (point.nw = n > w ? n : w);
  point.sw == null && (point.sw = s > w ? s : w);
  point.ne == null && (point.ne = n > e ? n : e);
  point.se == null && (point.se = s > e ? s : e);
}

module.exports = WallDistanceFinder;
