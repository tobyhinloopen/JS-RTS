var Q = require('q');

function ImageWorldMapReader(image, worldMap) {
  this.canvas = document.createElement('canvas');
  this.canvas2dContext = this.canvas.getContext('2d');
  this.image = image;
  this.worldMap = worldMap;
}

ImageWorldMapReader.prototype.read = function() {
  return new Q.Promise((function(resolve) {
    var imageReady = (function() {
      this.readFromImage();
      resolve();
    }).bind(this);

    if(this.image.naturalWidth && this.image.naturalHeight)
      imageReady();
    else
      this.image.onload = imageReady;
  }).bind(this));
}

ImageWorldMapReader.prototype.readFromImage = function() {
  this.readPixelDataFromImage();
  this.readWorldMapFromPixelData();
}

ImageWorldMapReader.prototype.readPixelDataFromImage = function() {
  this.canvas.width = this.image.naturalWidth;
  this.canvas.height = this.image.naturalHeight;
  this.canvas2dContext.drawImage(this.image, 0, 0);
  this.pixelData = this.canvas2dContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
}

ImageWorldMapReader.prototype.readWorldMapFromPixelData = function() {
  var data = this.pixelData.data,
    width = this.pixelData.width,
    height = this.pixelData.height;

  this.worldMap.setSize(width, height);

  for(var y=0; y<height; y++) {
    for(var x=0; x<width; x++) {
      var pixelDataOffset = (y * width + x) * 4;
      var r = data[pixelDataOffset + 0];
      var g = data[pixelDataOffset + 1];
      var b = data[pixelDataOffset + 2];
      var a = data[pixelDataOffset + 3];
      this.readPixel(x, y, r, g, b, a)
    }
  }
}

ImageWorldMapReader.prototype.readPixel = function(x, y, r, g, b, a) {
  if(!a) return;
  if(Math.round(r/255)) this.worldMap.addWallPoint(x, y);
  else if(Math.round(b/255)) this.worldMap.addSpawnPoint(x, y);
}

module.exports = ImageWorldMapReader;
