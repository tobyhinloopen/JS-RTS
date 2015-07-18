function Timer() {
  this.time = 0;
  this.delta = null;
  this.startRealTime = null;
}

Timer.TICKS_PER_SECOND = 1000;
Timer.getRealTime = performance.now.bind(performance);

Timer.prototype.start = function() {
  this.time = 0;
  this.delta = 0;
  this.startRealTime = Timer.getRealTime();
}

Timer.prototype.next = function() {
  var newTime = Timer.getRealTime() - this.startRealTime;
  this.delta = newTime - this.time;
  this.time = newTime;
}

module.exports = Timer;
