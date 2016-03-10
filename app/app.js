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
        // ctrl.step = 1;

    };

    this.linesWithValues = function() {


      return ctrl.lineCoords.map(function(line, idx) {

        return line.map(function(coord, idx) {

          return [coord[0], coord[1], ctrl._readCell(coord[0], coord[1])];

        });

      });

    };


    //

    this.attemptToWin = function(expectedValue) {

      // ctrl.lineCoords
      var countInLine,
          cellValue,
          missingCellCoords,
          line,
          coords,
          weGotWinner = false;

      _.each(ctrl.lineCoords, function(line){

      // for (var i = 0; i < ctrl.lineCoords.length - 1; i++) {

        // line = ctrl.lineCoords[i];

        if (weGotWinner) return; // break dla ubogich


        countInLine = 0;
        missingCellCoords = null;
        cellValue = null;

        _.each(line, function(coords){

        // for (var ii = 0; ii < line.length - 1; ii++) {

          // coords = line[ii];

          cellValue = ctrl._readCell(coords[0], coords[1]);

          // cell matches expected result
          if (cellValue === expectedValue) {
            countInLine += 1;

          // there is a blank space in line
          } else if (cellValue === null) {
            missingCellCoords = coords;
          }

        // };

        });

        if (countInLine === 2 && missingCellCoords) {

          ctrl._setCell(missingCellCoords[0], missingCellCoords[1], expectedValue);

          weGotWinner = true;

          // break;

        }

      // };

      });

      return weGotWinner;

    };


    this.computerMove = function() {
      switch (this.step) {
        case 2:
          var oppositeCornerCoords = ctrl.oppositeCornerCoords(ctrl.computerSelectedCoords[0]);

          var oppositeCornerVal = ctrl._readCell(oppositeCornerCoords[0], oppositeCornerCoords[1]);

          if (oppositeCornerVal === null) { // if opposite corner is free - go get it

            ctrl.selectCell(oppositeCornerCoords[0], oppositeCornerCoords[1], 0);

          } else { // otherwise get some other free corner

            var freeCornerCords = ctrl._freeCornerCoords()[0];

            ctrl.selectCell(freeCornerCords[0], freeCornerCords[1], 0);

          }
          break;
        case 3:

          // find line occupied by computer with 2 placed already in place

          // if it aint possible, find a line occupied by human with a single space

          // debugger;

          ctrl.attemptToWin(0);







          break;
        default:
          console.error('something wrong unknown step!');
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
