var Timer = require('timer');
var PathFinder = require('path_finder');
var Unit = require('unit');

function Game(worldMap) {
  this.worldMap = worldMap;
  this.timer = new Timer(),
  this.units = [],
  this.pathFinder = new PathFinder(worldMap);

  this.unitCreatedCallbacks = [];
}

Game.prototype.start = function() {
  this.timer.start();
}

Game.prototype.onUnitCreated = function(cb) {
  this.unitCreatedCallbacks.push(cb);
}

Game.prototype.triggerUnitCreated = function(unit) {
  for(var i=0, cb; cb = this.unitCreatedCallbacks[i]; i++)
    cb(unit);
}

Game.prototype.createUnit = function(position) {
  var unit = new Unit(position.x, position.y);
  unit.time = this.timer.time;
  this.units.push(unit);
  this.triggerUnitCreated(unit);
  return unit;
};

module.exports = Game;
