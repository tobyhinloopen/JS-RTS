function DomJpsPlusDebugView(jpsPlus) {
  this.jpsPlus = jpsPlus;
  this.worldMap = jpsPlus.worldMap;

  this.element = document.createElement('div');
  this.element.className = 'jps-plus-debug-view';
}

DomJpsPlusDebugView.prototype.render = function() {
  this.element.style.width = this.worldMap.width + 'em';
  this.element.style.height = this.worldMap.height + 'em';

  for(var x=0; x<this.worldMap.width; x++)
    for(var y=0; y<this.worldMap.height; y++)
      this.renderPoint(x, y, this.jpsPlus.getPoint(x, y));
}

var DIRS = ['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'];

DomJpsPlusDebugView.prototype.renderPoint = function(x, y, point) {
  var pointDiv = document.createElement('div');
  pointDiv.className = '-point';
  pointDiv.style.marginLeft = x + 'em';
  pointDiv.style.marginTop = y + 'em';

  for(var i=0, dir; dir = DIRS[i]; i++)
    if(point[dir] != null)
      pointDiv.appendChild(debugValLabel('-'+dir, point[dir]));

  this.element.appendChild(pointDiv);
}

function debugValLabel(className, value) {
  var elem = document.createElement('div');
  elem.className = className;
  if(value < 0) {
    value = Math.abs(value);
    elem.className += ' -neg'
  }
  elem.textContent = value;
  return elem;
}

module.exports = DomJpsPlusDebugView;
