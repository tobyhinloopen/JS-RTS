var PathRenderer = require('path_renderer');

function CanvasPathFinderDebugView(pathFinder, gridSize) {
  var canvas = this.element = document.createElement('canvas');
  canvas.width = pathFinder.worldMap.width * gridSize;
  canvas.height = pathFinder.worldMap.height * gridSize;
  canvas.style.position = 'absolute';

  var pathRenderer = new PathRenderer(canvas, gridSize);

  var paths = [];
  var ctx = canvas.getContext('2d');
  var oldFind = pathFinder.find.bind(pathFinder);
  pathFinder.find = function(from, to) {
    pathRenderer.clear();
    ctx.strokeStyle = '#C88';
    paths = [];
    result = oldFind(from, to);
    if(result)
      paths.push({ points: extractPoints(result), result: true });
    return result;
  };

  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  var next = function() {
    if(paths.length) {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      var path = paths.shift();
      if(path.result)
        ctx.strokeStyle = 'blue';
      pathRenderer.render(path);
    }
    requestAnimationFrame(next);
  };

  next();

  var oldPushSortedPath = pathFinder.pushSortedPath.bind(pathFinder);
  pathFinder.pushSortedPath = function(path) {
    paths.push({ points: extractPoints(path) });
    return oldPushSortedPath(path);
  };
}

function extractPoints(path) {
  var points = path.points.slice();
  points[0] = { x: points[0].x, y: points[0].y };
  return points;
}

module.exports = CanvasPathFinderDebugView;
