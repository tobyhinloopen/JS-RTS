function DomUnitsView() {
  this.element = document.createElement('div');
  this.element.className = 'units-container';
  this.unitViews = [];
}

DomUnitsView.prototype.add = function(unit) {
  this.unitViews.push({
    unit: unit,
    renderState: {},
    element: this.createUnitElement()
  });
};

DomUnitsView.prototype.render = function() {
  for(var unitView, i=0; unitView = this.unitViews[i]; i++)
    this.renderUnit(unitView);
};

DomUnitsView.prototype.createUnitElement = function() {
  var unitElement = document.createElement('div');
  unitElement.className = 'unit';
  this.element.appendChild(unitElement);
  return unitElement;
};

DomUnitsView.prototype.renderUnit = function(unitView) {
  var unit = unitView.unit, element = unitView.element, renderState = unitView.renderState;
  if(renderState.x != unit.x || renderState.y != unit.y) {
    renderState.x = unit.x;
    renderState.y = unit.y;
    element.style.marginTop = unit.y + 'em';
    element.style.marginLeft = unit.x + 'em';
  }
};

module.exports = DomUnitsView;
