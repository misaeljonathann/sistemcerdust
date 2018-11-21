var Board = /** @class */ (function () {
    function Board(parent, array, isEven, isKing) {
        this.child = [];
        this.parent = parent;
        this.array = array;
        this.isEven = isEven;
        this.isKing = isKing;
    }
    Board.prototype.addChild = function (newChild) {
        this.child.push(newChild);
    };
    Board.prototype.generateChild = function () {
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                var totalTurnedPin = this.totalTurnedPin(i, j);
                if (this.array[i][j] == 0 && totalTurnedPin && totalTurnedPin.length > 0) {
                    var newArray = this.generateTurnedArray(totalTurnedPin);
                    newArray[i][j] = 1;
                    console.log(i, j);
                    var newNode = new Board(this, newArray, !this.isEven, this.isKing);
                    this.addChild(newNode);
                }
            }
        }
        console.log("selesai");
    };
    Board.prototype.generateTurnedArray = function (paths) {
        var _this = this;
        var newArray = this.array.map(function (arr) {
            return arr.slice();
        });
        paths.forEach(function (path) {
            // masih kurang , karena masih ganti jadi king doang, kan bisa jadi warrior juga
            if (_this.isEven && _this.isKing) {
                newArray[path[0]][path[1]] = 2;
            }
            else {
                newArray[path[0]][path[1]] = 1;
            }
        });
        return newArray;
    };
    // this function return array of location turned pin [[x,y],....]
    Board.prototype.totalTurnedPin = function (i, j) {
        var turnedPin = [];
        // check right 
        for (var x = i + 1; x < 6; x++) {
            if (this.array[x][j] == 0) {
                break;
            }
            else if ((this.isEven && this.array[x][j] % 2 == 1) || (!this.isEven && this.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            }
            else {
                break;
            }
        }
        // check left
        for (var x = i - 1; x > 0; x--) {
            if (this.array[x][j] == 0) {
                break;
            }
            else if ((this.isEven && this.array[x][j] % 2 == 1) || (!this.isEven && this.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            }
            else {
                break;
            }
        }
        // check top 
        for (var y = j - 1; y > 0; y--) {
            if (this.array[i][y] == 0)
                break;
            else if ((this.isEven && this.array[i][y] % 2 == 1) || (!this.isEven && this.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            }
            else {
                break;
            }
        }
        // check bottom
        for (var y = j + 1; y < 6; y++) {
            if (this.array[i][y] == 0)
                break;
            else if ((this.isEven && this.array[i][y] % 2 == 1) || (!this.isEven && this.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            }
            else {
                break;
            }
        }
        //check top right 
        for (var x = i + 1; x < 6; x++) {
            var breakCheck = false;
            for (var y = j - 1; y > 0; y--) {
                if (this.array[i][y] == 0) {
                    breakCheck = true;
                    break;
                }
                else if ((this.isEven && this.array[i][y] % 2 == 1) || (!this.isEven && this.array[i][y] % 2 == 0)) {
                    turnedPin.push([i, y]);
                }
                else {
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck)
                break;
        }
        //check bot right 
        for (var x = i + 1; x < 6; x++) {
            var breakCheck = false;
            for (var y = j + 1; y < 6; y++) {
                if (this.array[i][y] == 0) {
                    breakCheck = true;
                    break;
                }
                else if ((this.isEven && this.array[i][y] % 2 == 1) || (!this.isEven && this.array[i][y] % 2 == 0)) {
                    turnedPin.push([i, y]);
                }
                else {
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck)
                break;
        }
        //check left top
        for (var x = i - 1; x > 0; x--) {
            var breakCheck = false;
            for (var y = j - 1; y > 0; y--) {
                if (this.array[i][y] == 0) {
                    breakCheck = true;
                    break;
                }
                else if ((this.isEven && this.array[i][y] % 2 == 1) || (!this.isEven && this.array[i][y] % 2 == 0)) {
                    turnedPin.push([i, y]);
                }
                else {
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck)
                break;
        }
        //check left bottom
        for (var x = i - 1; x > 0; x--) {
            var breakCheck = false;
            for (var y = j + 1; y < 6; y++) {
                if (this.array[i][y] == 0) {
                    breakCheck = true;
                    break;
                }
                else if ((this.isEven && this.array[i][y] % 2 == 1) || (!this.isEven && this.array[i][y] % 2 == 0)) {
                    turnedPin.push([i, y]);
                }
                else {
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck)
                break;
        }
        return turnedPin;
    };
    return Board;
}());
var OthelloV2 = /** @class */ (function () {
    function OthelloV2() {
        this.counter = 1;
        var array = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 0, 0],
            [0, 0, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        this.initialConfiguration = new Board(null, array, false, true);
        this.constructTree();
    }
    OthelloV2.prototype.constructTree = function () {
        this.initialConfiguration.generateChild();
        this.initialConfiguration.child.forEach(function (array) {
            console.log(array.array);
        });
    };
    return OthelloV2;
}());
var game = new OthelloV2();
// console.log('eqweq');
