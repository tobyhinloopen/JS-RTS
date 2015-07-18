function DiagonalJumpPointDistanceFinder(primaryJumpPoints, straightJumpPoints, worldMap) {
  this.primaryJumpPoints = primaryJumpPoints;
  this.straightJumpPoints = straightJumpPoints;
  this.worldMap = worldMap;
}

DiagonalJumpPointDistanceFinder.prototype.find = function() {
  this.setStraightDistances();
  this.setDiagonalDistances();
};

DiagonalJumpPointDistanceFinder.prototype.setStraightDistances = function() {
  var width = this.worldMap.width, height = this.worldMap.height;
  this.distances = new Array(height);
  for(var y=0; y<height; y++) {
    this.distances[y] = new Array(width);
    for(var x=0; x<width; x++) {
      this.distances[y][x] = this.straightDistancesForPoint(x, y);
    }
  }
};


DiagonalJumpPointDistanceFinder.prototype.straightDistancesForPoint = function(x, y) {
  var DIRECTIONS = ["n", "w", "s", "e"];
  var point = {};
  for(var direction, value, i=0; direction = DIRECTIONS[i]; i++) {
    if(value = this.straightJumpPoints[direction][x][y])
      point[direction] = value;
  }
  return point;
};

DiagonalJumpPointDistanceFinder.prototype.setDiagonalDistances = function() {
  var width = this.worldMap.width, height = this.worldMap.height;
  for(var y=0; y<height; y++)
    for(var x=0; x<width; x++)
      this.setDiagonalDistancesToPoint(x, y);
};

DiagonalJumpPointDistanceFinder.prototype.setDiagonalDistancesToPoint = function(x, y) {
  var STRAIGHT_DIRECTIONS = { n: ["nw", "ne"], s: ["sw", "se"], e: ["ne", "se"], w: ["nw", "sw"] };

  for(var straightDirectionName in STRAIGHT_DIRECTIONS) {
    if(this.isJumpPoint(x, y, straightDirectionName)) {
      var diagonalDirectionsNames = STRAIGHT_DIRECTIONS[straightDirectionName];
      for(var i=0, diagonalDirectionName; diagonalDirectionName = diagonalDirectionsNames[i]; i++)
        this.findDiagonalDistancesToPoint(x, y, diagonalDirectionName)
    }
  }
};

DiagonalJumpPointDistanceFinder.prototype.findDiagonalDistancesToPoint = function(originX, originY, diagonal) {
  var incr = {
    nw: { x: +1, y: +1 },
    sw: { x: +1, y: -1 },
    ne: { x: -1, y: +1 },
    se: { x: -1, y: -1 }
  }[diagonal];

  for(var i=1, x, y;; i++) {
    x = originX + incr.x * i;
    y = originY + incr.y * i;
    if(this.worldMap.isWall(x - incr.x, y )
    || this.worldMap.isWall(x, y - incr.y)
    || this.worldMap.isWall(x, y))
      return;
    this.distances[y][x][diagonal] = i;
  }
};

DiagonalJumpPointDistanceFinder.prototype.isJumpPoint = function(x, y, direction) {
  return this.isStraightJumpPoint(x, y, direction) || this.isPrimaryJumpPoint(x, y, direction);
}

DiagonalJumpPointDistanceFinder.prototype.isPrimaryJumpPoint = function(x, y, direction) {
  for(var i=0, pjps = this.primaryJumpPoints[direction], pjp; pjp = pjps[i]; i++)
    if(pjp.x == x && pjp.y == y)
      return true;
  return false;
};

DiagonalJumpPointDistanceFinder.prototype.isStraightJumpPoint = function(x, y, direction) {
  return this.distances[y][x][direction] > 0;
};

module.exports = DiagonalJumpPointDistanceFinder;
