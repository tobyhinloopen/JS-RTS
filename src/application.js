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
var unitSprites = [];
var GRID_SIZE = 32;
var resources;

var RESOLUTION = 2;

PIXI.loader.add('unit', 'assets/unit.png');
PIXI.loader.add('wallTile', 'assets/wall-tile.png');
PIXI.loader.add('groundTile', 'assets/ground-tile.png');

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
  var mapContainer = new PIXI.Container();
  
  var groundSprite = new PIXI.extras.TilingSprite(resources.groundTile.texture, worldMap.width * GRID_SIZE, worldMap.height * GRID_SIZE);
  mapContainer.addChild(groundSprite);

  worldMap.iterateWalls(function(x, y) {
    var wallSprite = new PIXI.Sprite(resources.wallTile.texture);
    wallSprite.position.x = x * GRID_SIZE;
    wallSprite.position.y = y * GRID_SIZE;
    mapContainer.addChild(wallSprite);
  });

  var mapTexture = new PIXI.RenderTexture(renderer, worldMap.width * GRID_SIZE, worldMap.height * GRID_SIZE);
  mapTexture.render(mapContainer);
  stage.addChild(new PIXI.Sprite(mapTexture));
}

function createUnit(position) {
  var unit = new Unit(position.x, position.y);
  unit.time = time.time;
  units.push(unit);
  var unitSprite = new PIXI.Sprite(resources.unit.texture);
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

  PIXI.loader.load(function(_, _resources) {
    resources = _resources;
    renderMap();
    loadPathFinder();
    loadUnits();
    initializeGameLoop();
  });
});
