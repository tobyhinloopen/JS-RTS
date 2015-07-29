var Game = require('game');
var GameRenderer = require('view/game_renderer');

function GameApplication(worldMap) {
  this.game = new Game(worldMap);
  this.gameRenderer = new GameRenderer(this.game);
  this.view = this.gameRenderer.renderer.view;
  this.gameRenderer.onClick(this.onClick.bind(this));
}

GameApplication.prototype.load = function(fn) {
  this.gameRenderer.load((function() {
    this.loadUnits();
    fn();
  }).bind(this));
};

GameApplication.prototype.onClick = function(point) {
  var sqrt = Math.sqrt(this.game.units.length)|0;
  var offset = -(sqrt/2)|0;
  for(var i=0, unit, path; unit = this.game.units[i]; i++) {
    path = this.game.pathFinder.find(unit, {
      x: point.x + offset + i%sqrt,
      y: point.y + offset + (i/sqrt)|0
    });
    if(path && path.length)
      unit.scheduleMoveToPoints(path.points.slice(1));
  }
};

GameApplication.prototype.start = function() {
  this.game.start();
  this.scheduleNextFrame();
}

GameApplication.prototype.scheduleNextFrame = function() {
  requestAnimationFrame(this.next.bind(this));
}

GameApplication.prototype.next = function() {
  this.game.timer.next();
  for(var i=0, unit; unit = this.game.units[i]; i++)
    unit.update(this.game.timer.time);
  this.gameRenderer.render();
  this.scheduleNextFrame();
}

GameApplication.prototype.createUnit = function(position) {
  this.gameRenderer.createUnitRenderer(this.game.createUnit(position));
};

GameApplication.prototype.loadUnits = function() {
  for(var i=0, spawnPoint; spawnPoint = this.game.worldMap.spawnPoints[i]; i++)
    this.createUnit(spawnPoint);
};

module.exports = GameApplication;
