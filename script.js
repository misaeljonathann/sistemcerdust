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
var UtilityCoor = /** @class */ (function () {
    function UtilityCoor(point, coor) {
        this.point = point;
        this.coor = coor;
    }
    return UtilityCoor;
}());
var counter = 1;
var Board = /** @class */ (function () {
    function Board(parent, array, pawn, turn, bool, depth, move) {
        this.child = [];
        this.parent = parent;
        this.array = array;
        this.pawn = pawn;
        this.turn = turn;
        this.utilityPoint = this.utilityFunction(array);
        this.isMax = bool;
        this.depth = depth;
        this.move = move;
    }
    Board.prototype.utilityFunction = function (array) {
        var pointAlloc = {
            0: 0,
            1: -3,
            2: 3,
            3: -1,
            4: 1
        };
        var totalPoint = 0;
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                totalPoint += pointAlloc[array[i][j]];
            }
        }
        return totalPoint;
    };
    Board.prototype.addChild = function (newChild) {
        this.child.push(newChild);
    };
    Board.prototype.generateChild = function (alpha, beta) {
        if (this.depth == 4) {
            return new UtilityCoor(this.utilityPoint, this.move);
        }
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                var totalTurnedPin = this.totalTurnedPin(i, j);
                if (this.array[i][j] == 0 && totalTurnedPin && Object.keys(totalTurnedPin).length > 0) {
                    counter++;
                    var newArray = this.generateTurnedArray(totalTurnedPin);
                    newArray[i][j] = (this.turn == 4) ? 4 : this.turn % 4;
                    var newNode = new Board(this, newArray, pawnClass[(this.turn % 4) + 1], (this.turn % 4) + 1, !this.isMax, this.depth + 1, [i, j]);
                    this.addChild(newNode);
                }
            }
        }
        console.log(this.array);
        console.log(this.depth);
        if (this.isMax) {
            var valMax = Number.MIN_SAFE_INTEGER;
            var coor = void 0;
            for (var _i = 0, _a = this.child; _i < _a.length; _i++) {
                var child = _a[_i];
                var nextMove = child.generateChild(alpha, beta);
                if (nextMove.point > valMax) {
                    valMax = nextMove.point;
                    coor = nextMove.coor;
                    if (valMax >= beta)
                        return new UtilityCoor(valMax, null);
                    alpha = Math.max(alpha, valMax);
                }
            }
            return new UtilityCoor(valMax, coor);
        }
        else {
            var valMin = Number.MAX_SAFE_INTEGER;
            var coor = void 0;
            for (var _b = 0, _c = this.child; _b < _c.length; _b++) {
                var child = _c[_b];
                var nextMove = child.generateChild(alpha, beta);
                if (nextMove.point < valMin) {
                    valMin = nextMove.point;
                    coor = nextMove.coor;
                    if (valMin <= beta)
                        return new UtilityCoor(valMin, null);
                    beta = Math.min(beta, valMin);
                }
            }
            return new UtilityCoor(valMin, coor);
        }
        // if (counter >= 15) {
        //     return 0;
        // }
        // console.log(this.utilityPoint);
        // console.log(this.array);
        // this.child.forEach(path => {
        //     path.generateChild();
        // });
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
                turnedPin = [];
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
                turnedPin = [];
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
                turnedPin = [];
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
                turnedPin = [];
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
        var _loop_2 = function (a) {
            if (i + a > 5 || j + a > 5) {
                return "break";
            }
            if (this_1.array[i + a][j + a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_1.pawn.isEven && this_1.array[i + a][j + a] % 2 == 1) || (!this_1.pawn.isEven && this_1.array[i + a][j + a] % 2 == 0)) {
                turnedPin.push([i + a, j + a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    if (!(_this.array[i + a][j + a] in whichPin) && (whichPin[_this.array[i + a][j + a]] = [])) { //if not exists
                        var jenisBidak = (_this.turn > _this.array[i + a][j + a]) ? _this.turn : _this.array[i + a][j + a];
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[_this.array[i + a][j + a]].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_1 = this;
        //check bot right
        for (var a = 1; a <= 5 - i; a++) {
            var state_1 = _loop_2(a);
            if (state_1 === "break")
                break;
        }
        var _loop_3 = function (a) {
            if (i + a > 5 || j - a < 0) {
                return "break";
            }
            if (this_2.array[i + a][j - a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_2.pawn.isEven && this_2.array[i + a][j - a] % 2 == 1) || (!this_2.pawn.isEven && this_2.array[i + a][j - a] % 2 == 0)) {
                turnedPin.push([i + a, j - a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    if (!(_this.array[i + a][j - a] in whichPin) && (whichPin[_this.array[i + a][j - a]] = [])) { //if not exists
                        var jenisBidak = (_this.turn > _this.array[i + a][j - a]) ? _this.turn : _this.array[i + a][j - a];
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[_this.array[i + a][j - a]].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_2 = this;
        //check top right
        for (var a = 1; a <= 5 - i; a++) {
            var state_2 = _loop_3(a);
            if (state_2 === "break")
                break;
        }
        var _loop_4 = function (a) {
            if (i - a < 0 || j - a < 0) {
                return "break";
            }
            if (this_3.array[i - a][j - a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_3.pawn.isEven && this_3.array[i - a][j - a] % 2 == 1) || (!this_3.pawn.isEven && this_3.array[i - a][j - a] % 2 == 0)) {
                turnedPin.push([i - a, j - a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    if (!(_this.array[i - a][j - a] in whichPin) && (whichPin[_this.array[i - a][j - a]] = [])) { //if not exists
                        var jenisBidak = (_this.turn > _this.array[i - a][j - a]) ? _this.turn : _this.array[i - a][j - a];
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[_this.array[i - a][j - a]].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_3 = this;
        //check top left
        for (var a = 1; a <= 5 - i; a++) {
            var state_3 = _loop_4(a);
            if (state_3 === "break")
                break;
        }
        var _loop_5 = function (a) {
            if (i - a < 0 || j + a > 5) {
                return "break";
            }
            if (this_4.array[i - a][j + a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_4.pawn.isEven && this_4.array[i - a][j + a] % 2 == 1) || (!this_4.pawn.isEven && this_4.array[i - a][j + a] % 2 == 0)) {
                turnedPin.push([i - a, j + a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    if (!(_this.array[i - a][j + a] in whichPin) && (whichPin[_this.array[i - a][j + a]] = [])) { //if not exists
                        var jenisBidak = (_this.turn > _this.array[i - a][j + a]) ? _this.turn : _this.array[i - a][j + a];
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[_this.array[i - a][j + a]].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_4 = this;
        //check bottom left
        for (var a = 1; a <= 5 - i; a++) {
            var state_4 = _loop_5(a);
            if (state_4 === "break")
                break;
        }
        return whichPin;
    };
    return Board;
}());
var HUMAN = 1;
var BOT = 2;
var OthelloV2 = /** @class */ (function () {
    function OthelloV2() {
        this.array = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 0, 0],
            [0, 0, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        this.initialConfiguration = new Board(null, this.array, new pawnType(false, true), 1, true, 1, [null, null]);
    }
    OthelloV2.prototype.play = function (whoseTurn) {
        if (whoseTurn == HUMAN) {
            this.array[i][j] =
            ;
        }
    };
    OthelloV2.prototype.constructTree = function () {
        if (whoseTurn == BOT) {
            this.initialConfiguration.generateChild(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        }
    };
    return OthelloV2;
}());
var game = new OthelloV2();
