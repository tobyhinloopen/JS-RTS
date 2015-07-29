function GameRenderer(game) {
  this.game = game;
  this.stage = new PIXI.Container();
  this.unitRenderables = [];
  this.renderer = new PIXI.WebGLRenderer(game.worldMap.width * GRID_SIZE, game.worldMap.height * GRID_SIZE);
  this.resources = null;
  this.renderer.view.addEventListener('click', this.handleClickEvent.bind(this));
  this.clickCallbacks = [];
}

var GRID_SIZE = 32;
var GRID_SIZE_HALF = (GRID_SIZE/2)|0;

GameRenderer.prototype.render = function() {
  for(var i=0, unitRenderable; unitRenderable = this.unitRenderables[i]; i++)
    this.updateUnitRenderable(unitRenderable);
  this.renderer.render(this.stage);
};

GameRenderer.prototype.createMapRenderer = function() {
  var mapContainer = new PIXI.Container();
  var gridMapWidth = this.game.worldMap.width * GRID_SIZE;
  var gridMapHeight = this.game.worldMap.height * GRID_SIZE;

  var groundSprite = new PIXI.extras.TilingSprite(
    this.resources.groundTile.texture, gridMapWidth, gridMapHeight);

  mapContainer.addChild(groundSprite);

  this.game.worldMap.iterateWalls((function(x, y) {
    var wallSprite = new PIXI.Sprite(this.resources.wallTile.texture);
    wallSprite.position.x = x * GRID_SIZE;
    wallSprite.position.y = y * GRID_SIZE;
    mapContainer.addChild(wallSprite);
  }).bind(this));

  var mapTexture = new PIXI.RenderTexture(this.renderer, gridMapWidth, gridMapHeight);
  mapTexture.render(mapContainer);
  this.stage.addChild(new PIXI.Sprite(mapTexture));
};

GameRenderer.prototype.updateUnitRenderable = function(unitRenderable) {
  unitRenderable.sprite.position.x = unitRenderable.unit.x * GRID_SIZE + GRID_SIZE_HALF;
  unitRenderable.sprite.position.y = unitRenderable.unit.y * GRID_SIZE + GRID_SIZE_HALF;
  unitRenderable.sprite.rotation = unitRenderable.unit.rotation;
};

GameRenderer.prototype.createUnitRenderer = function(unit) {
  var unitRenderable = {
    unit: unit,
    sprite: new PIXI.Sprite(this.resources.unit.texture)
  };
  unitRenderable.sprite.anchor.set(0.5);
  this.stage.addChild(unitRenderable.sprite);
  this.unitRenderables.push(unitRenderable);
  this.updateUnitRenderable(unitRenderable);
};

GameRenderer.prototype.load = function(cb) {
  var loader = new PIXI.loaders.Loader();
  loader.add('unit', 'assets/unit.png');
  loader.add('wallTile', 'assets/wall-tile.png');
  loader.add('groundTile', 'assets/ground-tile.png');
  loader.load((function(_, resources) {
    this.resources = resources;
    this.createMapRenderer();
    cb();
  }).bind(this))
};

GameRenderer.prototype.onClick = function(cb) {
  this.clickCallbacks.push(cb);
};

GameRenderer.prototype.handleClickEvent = function(event) {
  if(!this.clickCallbacks.length)
    return;
  var x = (event.layerX / GRID_SIZE)|0;
  var y = (event.layerY / GRID_SIZE)|0;
  this.triggerClickCallbacks({ x: x, y: y });
};

GameRenderer.prototype.triggerClickCallbacks = function(point) {
  for(var i=0, cb; cb = this.clickCallbacks[i]; i++)
    cb(point);
};

module.exports = GameRenderer;
