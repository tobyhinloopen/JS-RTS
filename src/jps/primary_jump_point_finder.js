function PrimaryJumpPointFinder(worldMap) {
  this.worldMap = worldMap;
}

PrimaryJumpPointFinder.prototype.find = function() {
  this.e = [];
  this.w = [];
  this.n = [];
  this.s = [];

  for(var x=0; x<this.worldMap.width; x++)
    for(var y=0; y<this.worldMap.height; y++)
      if(!this.worldMap.isWall(x, y))
        this.findPrimaryJumpPointsAt(x, y);
}

PrimaryJumpPointFinder.prototype.findPrimaryJumpPointsAt = function(x, y) {
  var canN = y-1 >= 0;
  var canS = y+1 < this.worldMap.height;
  var canW = x-1 >= 0;
  var canE = x+1 < this.worldMap.width;

  var n = canN && !this.worldMap.isWall(x, y-1);
  var s = canS && !this.worldMap.isWall(x, y+1);
  var w = canW && !this.worldMap.isWall(x-1, y);
  var e = canE && !this.worldMap.isWall(x+1, y);
  var nw = canN && canW && !this.worldMap.isWall(x-1, y-1);
  var sw = canS && canW && !this.worldMap.isWall(x-1, y+1);
  var ne = canN && canE && !this.worldMap.isWall(x+1, y-1);
  var se = canS && canE && !this.worldMap.isWall(x+1, y+1);

  var point = { x: x, y: y };

  if(w && (n && !nw || s && !sw)) this.e.push(point);
  if(e && (n && !ne || s && !se)) this.w.push(point);
  if(n && (e && !ne || w && !nw)) this.s.push(point);
  if(s && (e && !se || w && !sw)) this.n.push(point);
}

module.exports = PrimaryJumpPointFinder;
