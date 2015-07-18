function DomWorldMapView(worldMap, fn) {
  this.worldMap = worldMap;

  this.element = document.createElement('div');
  this.element.className = 'world-map';

  var element = this.element;
  this.element.addEventListener('click', function(e) {
    var gridSize = parseInt(window.getComputedStyle(element).fontSize, 10);
    var x = Math.floor(e.layerX / gridSize) - 1;
    var y = Math.floor(e.layerY / gridSize) - 1;
    fn && fn(x, y);
  });
}

DomWorldMapView.prototype.render = function() {
  this.element.style.width = this.worldMap.width + 'em';
  this.element.style.height = this.worldMap.height + 'em';

  this.worldMap.iterateWalls(this.renderWall.bind(this));
}

DomWorldMapView.prototype.renderWall = function(x, y) {
  var wallDiv = document.createElement('div');
  wallDiv.className = 'wall';
  wallDiv.style.marginLeft = x + 'em';
  wallDiv.style.marginTop = y + 'em';
  this.element.appendChild(wallDiv);
}

module.exports = DomWorldMapView;
