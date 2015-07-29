var Timer = require('timer');

function Unit(x, y) {
  this.x = x;
  this.y = y;
  this.rotation = 0;
  this.time = 0;
}

// Movement speed in grid cells per timer unit
Unit.MOVEMENT_SPEED = 8 / Timer.TICKS_PER_SECOND;

Unit.prototype.scheduleMoveToPoints = function(points) {
  if(!this.scheduledMovement)
    this.scheduledMovement = points;
  else
    this.scheduledMovement.push.apply(this.scheduledMovement, points);
  if(!this.isMoving())
    this.scheduleNextMovement();
}

Unit.prototype.scheduleNextMovement = function() {
  var point = this.scheduledMovement.shift();
  this.moveTo(point.x, point.y);
}

Unit.prototype.isMoving = function() {
  return this.moveDuration;
}

Unit.prototype.moveTo = function(x, y) {
  this.moveBy(x - this.x, y - this.y);
}

Unit.prototype.moveBy = function(x, y) {
  if(!x && !y)
    return;

  this.rotation = Math.atan2(y, x);

  this.moveFromX = this.x;
  this.moveFromY = this.y;
  this.moveByX = x;
  this.moveByY = y;
  this.moveStartTime = this.time;

  var distance = Math.sqrt(x*x+y*y);
  this.moveDuration = distance / Unit.MOVEMENT_SPEED;
  this.moveEndTime = this.moveStartTime + this.moveDuration;
}

Unit.prototype.update = function(time) {
  this.time = time;
  this.updateMovement();
}

Unit.prototype.finalizeMovement = function() {
  this.x = this.moveFromX + this.moveByX;
  this.y = this.moveFromY + this.moveByY;
  if(this.scheduledMovement.length) {
    var actualTime = this.time;
    this.time = this.moveEndTime;
    this.scheduleNextMovement();
    this.time = actualTime;
    this.updateMovement();
  } else {
    this.clearMovement();
  }
}

Unit.prototype.updateMovement = function() {
  if(this.isMoving()) {
    if(this.time >= this.moveEndTime)
      this.finalizeMovement();
    else {
      var movementProgress = (this.time - this.moveStartTime) / this.moveDuration;
      this.x = this.moveFromX + movementProgress * this.moveByX;
      this.y = this.moveFromY + movementProgress * this.moveByY;
    }
  }
}

Unit.prototype.clearMovement = function() {
  this.moveDuration = null;
}

module.exports = Unit;
