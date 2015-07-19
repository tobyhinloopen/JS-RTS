function PathRenderer(canvas, gridSize) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');
  this.gridSize = gridSize;
}

PathRenderer.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

PathRenderer.prototype.render = function(path) {
  var points = path.points;

  this.ctx.save();
  this.ctx.scale(this.gridSize, this.gridSize);
  this.ctx.translate(0.5, 0.5);
  this.ctx.lineWidth = 1 / this.gridSize;

  this.ctx.beginPath();
  this.ctx.moveTo(points[0].x, points[0].y);

  for(var i=1, point; point = points[i]; i++)
    this.ctx.lineTo(point.x, point.y);
  
  this.ctx.stroke();
  this.ctx.restore();
}

module.exports = PathRenderer;
