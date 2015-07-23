var WorldMap = require('world_map');
var ImageWorldMapReader = require('image_world_map_reader');
var Unit = require('unit');
var Timer = require('timer');
var PathFinder = require('path_finder');
var Point = require('point');

var time = new Timer();

var worldMap = new WorldMap();
var units = [];
var pathFinder;
var renderer;
var activeUnitIndex = 0;
var stage = new PIXI.Container();
var unitTexture = PIXI.Texture.fromImage('assets/unit.png');
var wallTexture = PIXI.Texture.fromImage('assets/wall-tile.png');
var groundTexture = PIXI.Texture.fromImage('assets/ground-tile.png');
var unitSprites = [];
var GRID_SIZE = 32;

function onClick(x, y) {
  if(++activeUnitIndex >= units.length)
    activeUnitIndex = 0;
  var unit = units[activeUnitIndex];
  var path = pathFinder.find(unit, { x: x, y: y });
  if(path && path.length)
    unit.scheduleMoveToPoints(path.points.slice(1));
}

function createRenderer() {
  renderer = new PIXI.WebGLRenderer(worldMap.width * GRID_SIZE, worldMap.height * GRID_SIZE);
  renderer.view.addEventListener('click', function(e) {
    onClick((e.layerX / GRID_SIZE)|0, (e.layerY / GRID_SIZE)|0);
  });
  document.body.appendChild(renderer.view);
}

function loadMap(fn) {
  var mapImage = new Image();
  mapImage.src = 'maps/8room_005_cropped.png';
  new ImageWorldMapReader(mapImage, worldMap).read().then(fn);
}

function renderMap() {
  var groundSprite = new PIXI.extras.TilingSprite(groundTexture, worldMap.width * GRID_SIZE, worldMap.height * GRID_SIZE);
  stage.addChild(groundSprite);

  worldMap.iterateWalls(function(x, y) {
    var wallSprite = new PIXI.Sprite(wallTexture);
    wallSprite.position.x = x * GRID_SIZE;
    wallSprite.position.y = y * GRID_SIZE;
    stage.addChild(wallSprite);
  });
}

function createUnit(position) {
  var unit = new Unit(position.x, position.y);
  unit.time = time.time;
  units.push(unit);
  var unitSprite = new PIXI.Sprite(unitTexture);
  unitSprites.push(unitSprite);
  unitSprite.anchor.set(0.5);
  unitSprite.position.x = unit.x * GRID_SIZE + GRID_SIZE/2;
  unitSprite.position.y = unit.y * GRID_SIZE + GRID_SIZE/2;
  stage.addChild(unitSprite);
}

function loadUnits() {
  for(var i=0, spawnPoint; spawnPoint = worldMap.spawnPoints[i]; i++)
    createUnit(spawnPoint);
}

function loadPathFinder() {
  pathFinder = new PathFinder(worldMap);
}

function update() {
  for(var i=0, unit; unit = units[i]; i++) {
    unit.time = time.time;
    unit.update();
    var sprite = unitSprites[i];
    sprite.position.x = unit.x * GRID_SIZE + GRID_SIZE/2;
    sprite.position.y = unit.y * GRID_SIZE + GRID_SIZE/2;
    sprite.rotation = unit.rotation;
  }
}

function next() {
  time.next();
  update();
  renderer.render(stage);
  requestAnimationFrame(next);
}

function initializeGameLoop() {
  time.start();
  requestAnimationFrame(next);
}

loadMap(function() {
  createRenderer();
  renderMap();
  loadPathFinder();
  loadUnits();
  initializeGameLoop();
});
