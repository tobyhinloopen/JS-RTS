function WorldMap() {
  this.spawnPoints = [];
  this.walls = [];
  this.fastAccessWalls = {};
}

WorldMap.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
}

WorldMap.prototype.addWallPoint = function(x, y) {
  this.walls.push({ x: x, y: y });
  this.fastAccessWalls[x*this.width+y] = true;
}

WorldMap.prototype.addSpawnPoint = function(x, y) {
  this.spawnPoints.push({ x: x, y: y });
}

WorldMap.prototype.iterateWalls = function(fn) {
  for(var wall, i=0; wall=this.walls[i]; i++)
    fn(wall.x, wall.y);
}

WorldMap.prototype.isWall = function(x, y) {
  return x < 0 || x >= this.width || y < 0 || y >= this.height || this.fastAccessWalls[x*this.width+y];
}

module.exports = WorldMap;
