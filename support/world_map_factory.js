var WorldMap = require('world_map');
var _128x128rooms_walls = require('128x128rooms_walls');

function worldMapForWalls(walls) {
  var worldMap = new WorldMap();
  worldMap.setSize(walls[0].length, walls.length);

  for(var y=0, row; row = walls[y]; y++) {
    for(var x=0, cell; cell = row[x]; x++) {
      if(cell == 'x')
        worldMap.addWallPoint(x, y);
      else if(cell == 's')
        worldMap.addSpawnPoint(x, y);
    }
  }

  return worldMap;
}

exports.buildJpsPlusSample = function() {
  return worldMapForWalls([
    "  x   xs ",
    "      x  ",
    " xx   xx ",
    "  x      ",
    "s x   x  "
  ]);
};

exports.buildJsRtsSampleMap = function() {
  return worldMapForWalls([
    "                ",
    " s              ",
    "    x      x    ",
    "    x      x    ",
    "  xxx      xxx  ",
    "                ",
    "                ",
    "       xx       ",
    "       xx       ",
    "                ",
    "                ",
    "  xxx      xxx  ",
    "    x      x    ",
    "    x      x    ",
    "              s ",
    "                "
  ]);
};

exports.buildRoomsSampleMap = function() {
  return worldMapForWalls([
    "         x      ",
    " x   s          ",
    " x       x      ",
    "xxxxx xxxxxxxx x",
    " x       x      ",
    " x       x      ",
    " x       x      ",
    " x       x      ",
    "                ",
    " x       x      ",
    " x       x      ",
    " xx xxxxxxxx xxx",
    " x       x      ",
    " x  s           ",
    " x       x      ",
    " x       x      "
  ]);
};

exports.build3x3empty = function() {
  return worldMapForWalls([
    "  s",
    "   ",
    "s  "
  ]);
};

exports.build5x5empty = function() {
  return worldMapForWalls([
    "    s",
    "     ",
    "     ",
    "     ",
    "s    "
  ]);
};

exports.build3x2withCorner = function() {
  return worldMapForWalls([
    "   ",
    "x s",
  ]);
};

exports.build3x3WithDiagonalObstruction = function() {
  return worldMapForWalls([
    "  x",
    "   ",
    "sxx"
  ]);
};

exports.build5x5WithCenterObstructions = function() {
  return worldMapForWalls([
    "     ",
    "sx x ",
    "     ",
    " x xs",
    "     "
  ]);
};

exports.build3x3withGate = function() {
  return worldMapForWalls([
    " xs",
    "   ",
    "sx "
  ]);
};

exports.build128x128rooms = function() {
  var worldMap = new WorldMap();
  worldMap.setSize(128, 128);
  for(var i=0, wall; wall = _128x128rooms_walls[i]; i++)
    worldMap.addWallPoint(wall.x, wall.y);
  return worldMap;
};
