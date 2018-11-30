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
    function Board(parent, array, turn, bool, depth, move) {
        this.child = [];
        this.parent = parent;
        this.array = array;
        this.pawn = pawnClass[turn];
        this.turn = turn;
        this.utilityPoint = this.utilityFunction(array)[0] - this.utilityFunction(array)[1];
        if (userTurn == "second")
            this.utilityPoint = -this.utilityPoint;
        this.isMax = bool;
        this.depth = depth;
        this.move = move;
    }
    Board.prototype.utilityFunction = function (array) {
        var pointAlloc = {
            0: 0,
            1: 2,
            2: 2,
            3: 1,
            4: 1
        };
        var evenPoint = 0;
        var oddPoint = 0;
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                if (array[i][j] % 2 == 0) {
                    evenPoint += pointAlloc[array[i][j]];
                }
                else {
                    oddPoint += pointAlloc[array[i][j]];
                }
            }
        }
        return [evenPoint, oddPoint];
    };
    Board.prototype.addChild = function (newChild) {
        this.child.push(newChild);
    };
    Board.prototype.generateChild = function (alpha, beta) {
        var depth_treshold = 0;
        if (difficulty == "easy")
            depth_treshold = 5;
        if (difficulty == "medium")
            depth_treshold = 8;
        if (difficulty == "hard")
            depth_treshold = 11;
        if (this.depth == depth_treshold) {
            return new UtilityCoor(this.utilityPoint, this.move);
        }
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                var totalTurnedPin = this.totalTurnedPin(i, j);
                if (this.array[i][j] == 0 && totalTurnedPin && Object.keys(totalTurnedPin).length > 0) {
                    counter++;
                    var newArray = this.generateTurnedArray(totalTurnedPin);
                    newArray[i][j] = (this.turn == 4) ? 4 : this.turn % 4;
                    var newNode = new Board(this, newArray, (this.turn % 4) + 1, !this.isMax, this.depth + 1, [i, j]);
                    this.addChild(newNode);
                }
            }
        }
        if (this.isMax) {
            var valMax = -1000000;
            var coor = void 0;
            // debugger
            for (var _i = 0, _a = this.child; _i < _a.length; _i++) {
                var child = _a[_i];
                var nextMove = child.generateChild(alpha, beta);
                if (nextMove.point > valMax) {
                    valMax = nextMove.point;
                    coor = child.move;
                    if (valMax >= beta)
                        return new UtilityCoor(valMax, child.move);
                    alpha = Math.max(alpha, valMax);
                }
            }
            return new UtilityCoor(valMax, coor);
        }
        else {
            var valMin = 10000000;
            var coor = void 0;
            for (var _b = 0, _c = this.child; _b < _c.length; _b++) {
                var child = _c[_b];
                var nextMove = child.generateChild(alpha, beta);
                if (nextMove.point < valMin) {
                    valMin = nextMove.point;
                    coor = child.move;
                    if (valMin <= beta)
                        return new UtilityCoor(valMin, child.move);
                    beta = Math.min(beta, valMin);
                }
            }
            return new UtilityCoor(valMin, coor);
        }
    };
    Board.prototype.generateTurnedArray = function (paths) {
        var newArray = this.array.map(function (arr) {
            return arr.slice();
        });
        var _loop_1 = function (key) {
            var value = paths[key];
            value.forEach(function (path) {
                // if(!this.isMax && this.turn == 3){
                //     console.log("change ", path, " with => ", key);
                // }
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
        var _loop_2 = function (x) {
            if (this_1.array[x][j] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_1.pawn.isEven && this_1.array[x][j] % 2 == 1) || (!this_1.pawn.isEven && this_1.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor)
                    var jenisBidak = (_this.turn > _this.array[x][j]) ? _this.turn : _this.array[x][j];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_1 = this;
        // check bottom
        for (var x = i + 1; x < 6; x++) {
            var state_1 = _loop_2(x);
            if (state_1 === "break")
                break;
        }
        var _loop_3 = function (x) {
            if (this_2.array[x][j] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_2.pawn.isEven && this_2.array[x][j] % 2 == 1) || (!this_2.pawn.isEven && this_2.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor);
                    var jenisBidak = (_this.turn > _this.array[x][j]) ? _this.turn : _this.array[x][j];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_2 = this;
        // check top
        for (var x = i - 1; x >= 0; x--) {
            var state_2 = _loop_3(x);
            if (state_2 === "break")
                break;
        }
        turnedPin = [];
        var _loop_4 = function (y) {
            if (this_3.array[i][y] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_3.pawn.isEven && this_3.array[i][y] % 2 == 1) || (!this_3.pawn.isEven && this_3.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor);
                    var jenisBidak = (_this.turn > _this.array[i][y]) ? _this.turn : _this.array[i][y];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_3 = this;
        // check left
        for (var y = j - 1; y >= 0; y--) {
            var state_3 = _loop_4(y);
            if (state_3 === "break")
                break;
        }
        turnedPin = [];
        var _loop_5 = function (y) {
            if (this_4.array[i][y] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_4.pawn.isEven && this_4.array[i][y] % 2 == 1) || (!this_4.pawn.isEven && this_4.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    //whichPin[this.array[x][j]].push(coor);
                    var jenisBidak = (_this.turn > _this.array[i][y]) ? _this.turn : _this.array[i][y];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_4 = this;
        // check right
        for (var y = j + 1; y < 6; y++) {
            var state_4 = _loop_5(y);
            if (state_4 === "break")
                break;
        }
        turnedPin = [];
        var _loop_6 = function (a) {
            if (i + a > 5 || j + a > 5) {
                turnedPin = [];
                return "break";
            }
            if (this_5.array[i + a][j + a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_5.pawn.isEven && this_5.array[i + a][j + a] % 2 == 1) || (!this_5.pawn.isEven && this_5.array[i + a][j + a] % 2 == 0)) {
                turnedPin.push([i + a, j + a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    var jenisBidak = (_this.turn > _this.array[i + a][j + a]) ? _this.turn : _this.array[i + a][j + a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_5 = this;
        //check bot right
        for (var a = 1; a <= 5 - i; a++) {
            var state_5 = _loop_6(a);
            if (state_5 === "break")
                break;
        }
        turnedPin = [];
        var _loop_7 = function (a) {
            if (i + a > 5 || j - a < 0) {
                turnedPin = [];
                return "break";
            }
            if (this_6.array[i + a][j - a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_6.pawn.isEven && this_6.array[i + a][j - a] % 2 == 1) || (!this_6.pawn.isEven && this_6.array[i + a][j - a] % 2 == 0)) {
                turnedPin.push([i + a, j - a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    var jenisBidak = (_this.turn > _this.array[i + a][j - a]) ? _this.turn : _this.array[i + a][j - a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_6 = this;
        //check top right
        for (var a = 1; a <= 5 - i; a++) {
            var state_6 = _loop_7(a);
            if (state_6 === "break")
                break;
        }
        turnedPin = [];
        var _loop_8 = function (a) {
            if (i - a < 0 || j - a < 0) {
                turnedPin = [];
                return "break";
            }
            if (this_7.array[i - a][j - a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_7.pawn.isEven && this_7.array[i - a][j - a] % 2 == 1) || (!this_7.pawn.isEven && this_7.array[i - a][j - a] % 2 == 0)) {
                turnedPin.push([i - a, j - a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    var jenisBidak = (_this.turn > _this.array[i - a][j - a]) ? _this.turn : _this.array[i - a][j - a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_7 = this;
        //check top left
        for (var a = 1; a <= i; a++) {
            var state_7 = _loop_8(a);
            if (state_7 === "break")
                break;
        }
        turnedPin = [];
        var _loop_9 = function (a) {
            if (i - a < 0 || j + a > 5) {
                turnedPin = [];
                return "break";
            }
            if (this_8.array[i - a][j + a] == 0) {
                turnedPin = [];
                return "break";
            }
            else if ((this_8.pawn.isEven && this_8.array[i - a][j + a] % 2 == 1) || (!this_8.pawn.isEven && this_8.array[i - a][j + a] % 2 == 0)) {
                turnedPin.push([i - a, j + a]);
            }
            else {
                turnedPin.forEach(function (coor) {
                    var jenisBidak = (_this.turn > _this.array[i - a][j + a]) ? _this.turn : _this.array[i - a][j + a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    }
                    else {
                        whichPin[jenisBidak].push(coor);
                    }
                });
                return "break";
            }
        };
        var this_8 = this;
        //check bottom left
        for (var a = 1; a <= i; a++) {
            var state_8 = _loop_9(a);
            if (state_8 === "break")
                break;
        }
        return whichPin;
    };
    return Board;
}());
var OthelloV2 = /** @class */ (function () {
    function OthelloV2() {
    }
    // main class : ubah array, ubah turn.
    OthelloV2.prototype.botPlay = function (array, turn) {
        this.boardState = new Board(null, array, turn, true, 1, [null, null]);
        this.boardState.candidatePoint = this.boardState.generateChild(-100000000, 100000000);
        return this.boardState.candidatePoint.coor;
    };
    return OthelloV2;
}());
var Main = /** @class */ (function () {
    function Main() {
        this.userHistory = [];
        this.boardArr = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 0, 0],
            [0, 0, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ];
        this.game = new OthelloV2();
        this.pawnType = 1;
        this.isBot = false; // who first?
        // console.log('misael', this.turnCounter);
    }
    Main.prototype.updateDisplay = function () {
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                switch (this.boardArr[i][j]) {
                    case 1:
                        document.getElementById(i + '-' + j).className = "cell crown-red";
                        break;
                    case 2:
                        document.getElementById(i + '-' + j).className = "cell crown-blue";
                        break;
                    case 3:
                        document.getElementById(i + '-' + j).className = "cell helmet-red";
                        break;
                    case 4:
                        document.getElementById(i + '-' + j).className = "cell helmet-blue";
                        break;
                    default:
                        document.getElementById(i + '-' + j).className = "cell";
                        break;
                }
            }
        }
    };
    Main.prototype.undoState = function () {
        if (gameStarted && this.userHistory.length != 0) {
            this.boardArr = this.userHistory.pop();
            var score = this.game.boardState.utilityFunction(this.boardArr);
            this.updateScore(score);
            console.log('tebak score', score);
            this.pawnType = this.pawnType == 1 ? 3 : this.pawnType - 2;
            console.log("tot", this.pawnType);
            this.updateDisplay();
        }
    };
    // kiri score bot, kanan score user
    Main.prototype.updateScore = function (bothScore) {
        console.log("UPDATE SCORE", bothScore);
        document.getElementById("bot_score").innerHTML = bothScore[0].toString();
        document.getElementById("user_score").innerHTML = bothScore[1].toString();
    };
    Main.prototype.checkGameFinished = function (array, bothScore) {
        var allEven = true;
        var allOdd = true;
        var allFilled = true;
        for (var i = 0; i < 6; i++) {
            for (var j = 1; j < 6; j++) {
                if (array[i][j] != 0 && array[i][j] % 2 != 0) {
                    allEven = false;
                }
                else {
                    allOdd = false;
                }
                if (array[i][j] == 0) {
                    allFilled = false;
                }
            }
        }
        if (allEven || allFilled || allOdd) {
            if (bothScore[0] < bothScore[1]) {
                alert('Yeay user win! Congratulations!');
            }
            else {
                alert('Whoopsie! You lose this time! Try again next time!');
            }
        }
    };
    Main.prototype.placePawn = function (x, y) {
        gameStarted = true;
        this.game.boardState = new Board(this.game.boardState, this.boardArr, this.pawnType, false, 1, [null, null]);
        var turnedPin = this.game.boardState.totalTurnedPin(x, y);
        if (Object.keys(turnedPin).length > 0) {
            var tempState = this.boardArr.map(function (obj) { return (obj.slice()); });
            this.userHistory.push(tempState);
            this.boardArr[x][y] = this.pawnType;
            this.boardArr = this.game.boardState.generateTurnedArray(turnedPin);
            this.game.boardState.array = this.boardArr;
            var score = this.game.boardState.utilityFunction(this.boardArr);
            this.updateScore(score);
            this.updateDisplay();
            this.checkGameFinished(this.boardArr, score);
            this.pawnType = (this.pawnType % 4) + 1;
            console.log("HUMAN ", this.boardArr);
            this.botTurn();
        }
    };
    Main.prototype.botTurn = function () {
        var _this = this;
        var _a = this.game.botPlay(this.boardArr, this.pawnType), x = _a[0], y = _a[1];
        this.boardArr[x][y] = this.pawnType;
        this.game.boardState = new Board(this.game.boardState, this.boardArr, this.pawnType, true, 1, [null, null]);
        var turnedPin = this.game.boardState.totalTurnedPin(x, y);
        this.boardArr = this.game.boardState.generateTurnedArray(turnedPin);
        this.game.boardState.array = this.boardArr;
        setTimeout(function () {
            _this.updateDisplay();
            var score = _this.game.boardState.utilityFunction(_this.boardArr);
            _this.updateScore(score);
            _this.checkGameFinished(_this.boardArr, score);
            _this.pawnType = (_this.pawnType % 4) + 1;
        }, 1000);
        console.log("BOT ", this.boardArr);
    };
    return Main;
}());
var main = new Main();
var gameStarted = false;
console.log('giliran sokap :', this.main.isBot ? 'Bot' : 'Human');
function handleClick(coor) {
    var _a = coor.split('-'), x = _a[0], y = _a[1];
    x = parseInt(x);
    y = parseInt(y);
    if (gameStarted &&
        !document.getElementById(coor).classList.contains('crown-red') &&
        !document.getElementById(coor).classList.contains('crown-blue') &&
        !document.getElementById(coor).classList.contains('helmet-red') &&
        !document.getElementById(coor).classList.contains('helmet-blue')) {
        this.main.placePawn(x, y);
    }
}
function display(x, y) {
    var cssClass = x + '-' + y;
    var element = document.getElementById(cssClass);
    switch (main.pawnType) {
        case 1:
            element.classList.add("crown-red");
            break;
        case 2:
            element.classList.add("crown-blue");
            break;
        case 3:
            element.classList.add("helmet-red");
            break;
        case 4:
            element.classList.add("helmet-blue");
            break;
        default:
            break;
    }
}
function undo() {
    main.undoState();
}
var userTurn = "";
var difficulty = "";
function initGame() {
    var difficulties = document.getElementsByName("bot_difficulty");
    var userTurnsElement = document.getElementsByName("user_turn");
    gameStarted = true;
    document.getElementById("gameStatus").innerHTML = "Game started ! Goodluck !";
    for (var i = 0, length = userTurnsElement.length; i < length; i++) {
        if (userTurnsElement[i].checked) {
            userTurn = userTurnsElement[i].value;
            break;
        }
    }
    for (var i = 0, length = difficulties.length; i < length; i++) {
        if (difficulties[i].checked) {
            difficulty = difficulties[i].value;
            break;
        }
    }
    if (userTurn == "second") {
        this.main.botTurn();
    }
}
