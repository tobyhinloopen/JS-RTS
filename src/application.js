var WorldMap = require('world_map');
var ImageWorldMapReader = require('image_world_map_reader');
var CanvasPathFinderDebugView = require('canvas_path_finder_debug_view');
// var DomJpsPlusDebugView = require('dom_jps_plus_debug_view');
var DomWorldMapView = require('dom_world_map_view');
var Unit = require('unit');
var DomUnitsView = require('dom_units_view');
var Timer = require('timer');
var PathFinder = require('path_finder');
var Point = require('point');
var Q = require('q');

var time = new Timer();

var canvas = document.getElementById('canvas');
var unitsView;
var worldMap = new WorldMap();
var units = [];
var pathFinder;
var activeUnitIndex = 0;

function onClick(x, y) {
  if(++activeUnitIndex >= units.length)
    activeUnitIndex = 0;
  var unit = units[activeUnitIndex];
  var path = pathFinder.find(unit, { x: x, y: y });
  if(path && path.length)
    unit.scheduleMoveToPoints(path.points.slice(1));
}

function loadAndRenderMap() {
  var mapImage = new Image();
  mapImage.src = 'maps/sample-map-rooms.png';

  return new ImageWorldMapReader(mapImage, worldMap).read().then(function() {
    var domWorldMapView = new DomWorldMapView(worldMap, onClick);
    canvas.appendChild(domWorldMapView.element);
    domWorldMapView.render();
  });
}

function loadAndRenderUnits() {
  unitsView = new DomUnitsView();
  canvas.appendChild(unitsView.element);

  var createAndRenderMovingUnit = function(from, to) {
    var unit = new Unit(from.x, from.y);
    unit.time = time.time;
    var path = pathFinder.find(unit, to);
    if(path && path.length)
      unit.scheduleMoveToPoints(path.points.slice(1));
    units.push(unit);
    unitsView.add(unit);
  }

  for(var i=0, spawnPoint; spawnPoint = worldMap.spawnPoints[i]; i++)
    createAndRenderMovingUnit(spawnPoint, { x: (Math.random()*16)|0, y: (Math.random()*16)|0 });

  unitsView.render();

  return Q();
}

function loadPathFinder() {
  pathFinder = new PathFinder(worldMap);

  var gridSize = parseInt(window.getComputedStyle(canvas).fontSize);
  canvas.appendChild(new CanvasPathFinderDebugView(pathFinder, gridSize).element);

  // var view = new DomJpsPlusDebugView(pathFinder.jpsPlus);
  // canvas.appendChild(view.element);
  // view.render();

  return Q();
}

function update() {
  for(var i=0, unit; unit = units[i]; i++) {
    unit.time = time.time;
    unit.update();
  }
  unitsView.render();
}

function next() {
  time.next();
  update();
  requestAnimationFrame(next);
}

function initializeGameLoop() {
  time.start();
  requestAnimationFrame(next);
  return Q();
}

loadAndRenderMap().
then(loadPathFinder).
then(loadAndRenderUnits).
then(initializeGameLoop).
done();
