(function() {
  var app = angular.module('gameOfLife', []);

  app.controller("GameController", function(){

    var ctrl = this;

    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

    this.lineCoords = [
      // rows:
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],

      // cols:
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],

      // diags:
      [[0,0], [1,1], [2,2]],
      [[2,0], [1,1], [0,2]]
    ];

    this.step = 1;

    this.userSelectedCoords = [];
    this.computerSelectedCoords = [];

    this.cornersCoords = [[0,0], [0,2], [2,0], [2,2]];

    var init = function() {
      var randomCornerCoords = ctrl.cornersCoords[Math.floor(Math.random()*ctrl.cornersCoords.length)];
      ctrl.selectCell(randomCornerCoords[0], randomCornerCoords[1], 0);
    };

    this.attemptToFillLine = function(expectedValue, inputValue) {

      var countInLine,
          cellValue,
          missingCellCoords,
          line,
          coords,
          inputSet = false;

      _.each(ctrl.lineCoords, function(line){

        if (inputSet) return; // break dla ubogich

        countInLine = 0;
        missingCellCoords = null;
        cellValue = null;

        _.each(line, function(coords){

          cellValue = ctrl._readCell(coords[0], coords[1]);

          // cell matches expected result
          if (cellValue === expectedValue) {
            countInLine += 1;

          // there is a blank space in line
          } else if (cellValue === null) {
            missingCellCoords = coords;
          }

        });

        if (countInLine === 2 && missingCellCoords) {

          ctrl._setCell(missingCellCoords[0], missingCellCoords[1], inputValue);

          inputSet = true;

        }

      });

      return inputSet;

    };


    this.computerMove = function() {

      if (ctrl.step == 2) {

        var oppositeCornerCoords = ctrl.oppositeCornerCoords(ctrl.computerSelectedCoords[0]);

        var oppositeCornerVal = ctrl._readCell(oppositeCornerCoords[0], oppositeCornerCoords[1]);

        if (oppositeCornerVal === null) { // if opposite corner is free - go get it

          ctrl.selectCell(oppositeCornerCoords[0], oppositeCornerCoords[1], 0);

        } else { // otherwise get some other free corner

          var freeCornerCords = ctrl._freeCornerCoords()[0];

          ctrl.selectCell(freeCornerCords[0], freeCornerCords[1], 0);

        }

      } else if (ctrl.step >= 3) {

        // find line occupied by computer with 2 placed already in place
        // if it aint possible, find a line occupied by human with a single space
        // if the above doesnt happen, try to go in empty corner
        // if no corners empty go to random free cell

        if (!ctrl.attemptToFillLine(0,0)) {

          if (!ctrl.attemptToFillLine(1,0)){

            var freeCorners = ctrl._freeCornerCoords();

            if (freeCorners.length) {

              var firstFreeCorner = freeCorners[0];

              ctrl.selectCell(firstFreeCorner[0], firstFreeCorner[1], 0);

            } else {

              var randFreeCell = ctrl._freeCellsCoords()[0];

              ctrl.selectCell(randFreeCell[0], randFreeCell[1], 0);

            }

          };
        };

      } else {
        console.error('Something wrong! Unexpected step.')
      }

    };

    this.oppositeCornerCoords = function(coords) {

      switch (coords.join(' ')) {
        case '0 0':
          return [2,2];
          break;
        case '2 2':
          return [0,0];
          break;
        case '0 2':
          return [2,0];
          break;
        case '2 0':
          return [0,2];
          break;
      }
    };

    this.selectCell = function(rowIdx, colIdx, value) {
      var curVal = ctrl._readCell(rowIdx, colIdx);
      if (curVal === null) {
        ctrl._setCell(rowIdx, colIdx, value);

        // next computer step!
        if (value == 1) {

          ctrl.step += 1;

          ctrl.userSelectedCoords.push([rowIdx, colIdx]);

          ctrl.computerMove();
        } else {

          ctrl.computerSelectedCoords.push([rowIdx, colIdx]);

        }

      } else {
        return false;
      }
    };

    this._readCell = function(rowIdx, colIdx) {
      return ctrl.board[rowIdx][colIdx];
    };

    this._setCell = function(rowIdx, colIdx, value) {
      ctrl.board[rowIdx][colIdx] = value;
    };

    this._freeCellsCoords = function() {

      var freeCoords = [];

      _.each(ctrl.lineCoords, function(line){

        _.each(line, function(coords){

          cellValue = ctrl._readCell(coords[0], coords[1]);

          if (cellValue === null) {
            freeCoords.push(coords);
          }

        });

      });

      return freeCoords;
    };

    this._freeCornerCoords = function() {

      var results = [];
      var singleCoords;

      for ( i = 0; i < 3; i++ ) {

        singleCoords = ctrl.cornersCoords[i];

        if ( ctrl._readCell(singleCoords[0], singleCoords[1]) === null ) {
          results.push(singleCoords);
        }

      }
      return results;

    };

    init();

  });
})();
