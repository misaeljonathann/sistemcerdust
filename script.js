var pawnType = /** @class */ (function () {
    function pawnType(isEven, isKing) {
        this.isEven = isEven;
        this.isKing = isKing;
    }
    return pawnType;
}());
;
var pawnClass = {
    1: new pawnType(false, true),
    2: new pawnType(true, true),
    3: new pawnType(false, false),
    4: new pawnType(true, false)
};
var counter = 1;
var Board = /** @class */ (function () {
    function Board(parent, array, pawn, turn) {
        this.child = [];
        this.parent = parent;
        this.array = array;
        this.pawn = pawn;
        this.turn = turn;
    }
    Board.prototype.addChild = function (newChild) {
        this.child.push(newChild);
    };
    Board.prototype.generateChild = function () {
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                var totalTurnedPin = this.totalTurnedPin(i, j);
                //console.log(Object.keys(totalTurnedPin));
                if (this.array[i][j] == 0 && totalTurnedPin && Object.keys(totalTurnedPin).length > 0) {
                    counter++;
                    console.log(counter);
                    var newArray = this.generateTurnedArray(totalTurnedPin);
                    newArray[i][j] = (this.turn == 4) ? 4 : this.turn % 4;
                    var newNode = new Board(this, newArray, pawnClass[(this.turn % 4) + 1], (this.turn % 4) + 1);
                    this.addChild(newNode);
                }
            }
        }
        if (counter >= 30) {
            return 0;
        }
        console.log(this.array);
        this.child.forEach(function (path) {
            path.generateChild();
        });
        console.log("selesai");
    };
    Board.prototype.generateTurnedArray = function (paths) {
        var newArray = this.array.map(function (arr) {
            return arr.slice();
        });
        var _loop_1 = function (key) {
            var value = paths[key];
            value.forEach(function (path) {
                newArray[path[0]][path[1]] = parseInt(key, 10);
            });
        };
        //key : 1, 2, 3, 4
        //value : [[x,y], [i,j]]
        for (var key in paths) {
            _loop_1(key);
        }
        return newArray;
    };
    // this function return array of location turned pin [[x,y],....]
    Board.prototype.totalTurnedPin = function (i, j) {
        var _this = this;
        var turnedPin = [];
        var whichPin = {};
        // check right 
        for (var x = i + 1; x < 6; x++) {
            if (this.array[x][j] == 0) {
                break;
            }
            else if ((this.pawn.isEven && this.array[x][j] % 2 == 1) || (!this.pawn.isEven && this.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor);
                    if (!(_this.array[x][j] in whichPin) && (whichPin[_this.array[x][j]] = [])) { //if not exists
                        if (_this.turn > _this.array[x][j] || _this.turn < _this.array[x][j]) {
                            whichPin[_this.turn] = [coor];
                        }
                        else {
                            whichPin[_this.array[x][j]] = [coor];
                        }
                    }
                    else {
                        console.log("turn : ", _this.turn);
                        whichPin[_this.array[x][j]].push(coor);
                    }
                });
                break;
            }
        }
        // check left
        for (var x = i - 1; x > 0; x--) {
            if (this.array[x][j] == 0) {
                break;
            }
            else if ((this.pawn.isEven && this.array[x][j] % 2 == 1) || (!this.pawn.isEven && this.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor);
                    if (!(_this.array[x][j] in whichPin) && (whichPin[_this.array[x][j]] = [])) { //if not exists
                        if (_this.turn > _this.array[x][j] || _this.turn < _this.array[x][j]) {
                            whichPin[_this.turn] = [coor];
                        }
                        else {
                            whichPin[_this.array[x][j]] = [coor];
                        }
                    }
                    else {
                        whichPin[_this.array[x][j]].push(coor);
                    }
                });
                break;
            }
        }
        // check top 
        for (var y = j - 1; y > 0; y--) {
            if (this.array[i][y] == 0) {
                break;
            }
            else if ((this.pawn.isEven && this.array[i][y] % 2 == 1) || (!this.pawn.isEven && this.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor);
                    if (!(_this.array[i][y] in whichPin) && (whichPin[_this.array[i][y]] = [])) { //if not exists
                        if (_this.turn > _this.array[i][y] || _this.turn < _this.array[i][y]) {
                            whichPin[_this.turn] = [coor];
                        }
                        else {
                            whichPin[_this.array[i][y]] = [coor];
                        }
                    }
                    else {
                        whichPin[_this.array[i][y]].push(coor);
                    }
                });
                break;
            }
        }
        // check bottom
        for (var y = j + 1; y < 6; y++) {
            if (this.array[i][y] == 0) {
                break;
            }
            else if ((this.pawn.isEven && this.array[i][y] % 2 == 1) || (!this.pawn.isEven && this.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor);
                    if (!(_this.array[i][y] in whichPin) && (whichPin[_this.array[i][y]] = [])) { //if not exists
                        if (_this.turn > _this.array[i][y] || _this.turn < _this.array[i][y]) {
                            whichPin[_this.turn] = [coor];
                        }
                        else {
                            whichPin[_this.array[i][y]] = [coor];
                        }
                    }
                    else {
                        whichPin[_this.array[i][y]].push(coor);
                    }
                });
                break;
            }
        }
        //check top right 
        for (var x = i + 1; x < 6; x++) {
            var breakCheck = false;
            for (var y = j - 1; y > 0; y--) {
                if (this.array[x][y] == 0) {
                    breakCheck = true;
                    break;
                }
                else if ((this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0)) {
                    turnedPin.push([x, y]);
                }
                else {
                    turnedPin.forEach(function (coor) {
                        //whichPin[this.array[x][j]].push(coor);
                        if (!(_this.array[x][y] in whichPin) && (whichPin[_this.array[x][y]] = [])) { //if not exists
                            if (_this.turn > _this.array[x][y] || _this.turn < _this.array[x][y]) {
                                whichPin[_this.turn] = [coor];
                            }
                            else {
                                whichPin[_this.array[x][y]] = [coor];
                            }
                        }
                        else {
                            whichPin[_this.array[x][y]].push(coor);
                        }
                    });
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck)
                break;
        }
        //check bot right 
        //console.log ("Check Bottom Right dari koor: x:", i, "- y:", j, " dengan nilai : ", this.array[i][j]);
        for (var x = i + 1; x < 6; x++) {
            var breakCheck = false;
            for (var y = j + 1; y < 6; y++) {
                if (this.array[i][j] == 0) {
                    console.log("koor ", i, "-", j, " bernilai 0");
                    breakCheck = true;
                    break;
                }
                else if ((this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0)) {
                    console.log("PUSH : ", i, "-", j);
                    turnedPin.push([x, y]);
                }
                else {
                    turnedPin.forEach(function (coor) {
                        console.log("lets push koor : ", coor);
                        if (!(_this.array[x][y] in whichPin) && (whichPin[_this.array[x][y]] = [])) { //if not exists
                            if (_this.turn > _this.array[x][y] || _this.turn < _this.array[x][y]) {
                                whichPin[_this.turn] = [coor];
                            }
                            else {
                                whichPin[_this.array[x][y]] = [coor];
                            }
                        }
                        else {
                            whichPin[_this.array[x][y]].push(coor);
                        }
                    });
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
                if (this.array[i][j] == 0) {
                    breakCheck = true;
                    break;
                }
                else if ((this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0)) {
                    turnedPin.push([x, y]);
                }
                else {
                    turnedPin.forEach(function (coor) {
                        //whichPin[this.array[x][j]].push(coor);
                        if (!(_this.array[x][y] in whichPin) && (whichPin[_this.array[x][y]] = [])) { //if not exists
                            if (_this.turn > _this.array[x][y] || _this.turn < _this.array[x][y]) {
                                whichPin[_this.turn] = [coor];
                            }
                            else {
                                whichPin[_this.array[x][y]] = [coor];
                            }
                        }
                        else {
                            whichPin[_this.array[x][y]].push(coor);
                        }
                    });
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
                if (this.array[x][y] == 0) {
                    breakCheck = true;
                    break;
                }
                else if ((this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0)) {
                    turnedPin.push([x, y]);
                }
                else {
                    turnedPin.forEach(function (coor) {
                        //whichPin[this.array[x][j]].push(coor);
                        if (!(_this.array[x][y] in whichPin) && (whichPin[_this.array[x][y]] = [])) { //if not exists
                            if (_this.turn > _this.array[x][y] || _this.turn < _this.array[x][y]) {
                                whichPin[_this.turn] = [coor];
                            }
                            else {
                                whichPin[_this.array[x][y]] = [coor];
                            }
                        }
                        else {
                            whichPin[_this.array[x][y]].push(coor);
                        }
                    });
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck)
                break;
        }
        return whichPin;
    };
    return Board;
}());
var OthelloV2 = /** @class */ (function () {
    function OthelloV2() {
        this.counter = 1;
        var array = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 2, 1, 0, 0],
            [0, 0, 1, 2, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        this.initialConfiguration = new Board(null, array, new pawnType(false, true), 1);
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
