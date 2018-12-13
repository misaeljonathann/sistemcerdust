class pawnType {
    /*
    Turn :
    isEven && isKing = 1
    !isEven && isKing = 2
    isEven && !isKing = 3
    !isEven && !isKing = 4
    */
    isEven: boolean;
    isKing: boolean;
    constructor(isEven: boolean, isKing: boolean) {
        this.isEven = isEven;
        this.isKing = isKing;
    }
};

const pawnClass: { [id: number]: pawnType } = {
    1: new pawnType(false, true),
    2: new pawnType(true, true),
    3: new pawnType(false, false),
    4: new pawnType(true, false)
};

class UtilityCoor {
    point: number;
    coor: [number, number];

    constructor(point: number, coor: [number, number]) {
        this.point = point;
        this.coor = coor;
    }
}

var counter: number = 1;
class Board {
    parent: Board;
    child: Board[] = [];
    array: number[][];
    pawn: pawnType;
    turn: number;
    utilityPoint: number;
    candidatePoint: UtilityCoor;
    isMax: boolean;
    depth: number;
    move: [number, number];

    constructor(parent: Board, array: number[][], turn: number, bool: boolean, depth: number, move: [number, number]) {
        this.parent = parent;
        this.array = array;
        this.pawn = pawnClass[turn];
        this.turn = turn;
        this.utilityPoint = this.utilityFunction(array)[0] - this.utilityFunction(array)[1];
        if (userTurn == "second") this.utilityPoint = -this.utilityPoint;
        this.isMax = bool;
        this.depth = depth;
        this.move = move;
    }

    utilityFunction(array: number[][]) {
        const pointAlloc: { [pawn: number]: number } = {
            0: 0,
            1: 2,
            2: 2,
            3: 1,
            4: 1
        };
        let evenPoint = 0;
        let oddPoint = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (array[i][j] % 2 == 0 ) {
                    evenPoint += pointAlloc[array[i][j]];
                } else {
                    oddPoint += pointAlloc[array[i][j]];
                }
            }
        }
        return [evenPoint,oddPoint];
    }

    addChild(newChild: Board) {
        this.child.push(newChild);
    }

    generateChild(alpha: number, beta: number) {
        var depth_treshold = 0;
        if (difficulty == "easy") depth_treshold = 5;
        if (difficulty == "medium") depth_treshold = 8;
        if (difficulty == "hard") depth_treshold = 11;
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
            let valMax = -1000000;
            let coor;
            // debugger
            for (let child of this.child) {
                let nextMove = child.generateChild(alpha, beta);
                if (nextMove.point > valMax) {
                    valMax = nextMove.point;
                    coor = child.move;
                    if (valMax >= beta) return new UtilityCoor(valMax, child.move);
                    alpha = Math.max(alpha, valMax);
                }
            }
            return new UtilityCoor(valMax, coor);
        }

        else {
            let valMin = 10000000;
            let coor;
            for (let child of this.child) {
                let nextMove = child.generateChild(alpha, beta);
                if (nextMove.point < valMin) {
                    valMin = nextMove.point;
                    coor = child.move;
                    if (valMin <= beta) return new UtilityCoor(valMin, child.move);
                    beta = Math.min(beta, valMin);
                }
            }
            return new UtilityCoor(valMin, coor);
        }
    }

    generateTurnedArray(paths: { [pawn: number]: number[][] }): number[][] {
        var newArray = this.array.map(arr => {
            return arr.slice();
        })
        //key : 1, 2, 3, 4
        //value : [[x,y], [i,j]]

        for (let key in paths) {
            let value = paths[key];
            value.forEach(path => {
                // if(!this.isMax && this.turn == 3){
                //     console.log("change ", path, " with => ", key);
                // }
                newArray[path[0]][path[1]] = parseInt(key, 10);
            })
        }

        return newArray;
    }

    

    // this function return array of location turned pin [[x,y],....]
    totalTurnedPin(i: number, j: number): { [pawn: number]: number[][] } {
        var turnedPin: number[][] = [];
        var whichPin: { [pawn: number]: number[][]; } = {};

        // check bottom
        for (let x = i + 1; x < 6; x++) {
            if (this.array[x][j] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[x][j] % 2 == 1) || (!this.pawn.isEven && this.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor)
                    let jenisBidak = (this.turn > this.array[x][j]) ? this.turn : this.array[x][j];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }

        // check top
        for (let x = i - 1; x >= 0; x--) {
            if (this.array[x][j] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[x][j] % 2 == 1) || (!this.pawn.isEven && this.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor);
                    let jenisBidak = (this.turn > this.array[x][j]) ? this.turn : this.array[x][j];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }
        turnedPin = [];
        // check left
        for (let y = j - 1; y >= 0; y--) {
            if (this.array[i][y] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[i][y] % 2 == 1) || (!this.pawn.isEven && this.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor);
                    let jenisBidak = (this.turn > this.array[i][y]) ? this.turn : this.array[i][y];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }
        turnedPin = [];
        // check right
        for (let y = j + 1; y < 6; y++) {
            if (this.array[i][y] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[i][y] % 2 == 1) || (!this.pawn.isEven && this.array[i][y] % 2 == 0)) {
                turnedPin.push([i, y]);
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor);
                    let jenisBidak = (this.turn > this.array[i][y]) ? this.turn : this.array[i][y];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }
        turnedPin = [];
        //check bot right
        for (let a = 1; a <= 5-i; a++) {
            if (i + a > 5 || j + a > 5) {
                turnedPin = [];
                break;
            }
            if (this.array[i + a][j + a] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[i + a][j + a] % 2 == 1) || (!this.pawn.isEven && this.array[i + a][j + a] % 2 == 0)) {
                turnedPin.push([i + a, j + a]);
            } else {
                turnedPin.forEach(coor => {
                    let jenisBidak = (this.turn > this.array[i + a][j + a]) ? this.turn : this.array[i + a][j + a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }
        turnedPin = [];


        //check top right
        for (let a = 1; a <= 5-i; a++) {
            if (i + a > 5 || j - a < 0) {
                turnedPin = [];
                break;
            }
            if (this.array[i + a][j - a] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[i + a][j - a] % 2 == 1) || (!this.pawn.isEven && this.array[i + a][j - a] % 2 == 0)) {
                turnedPin.push([i + a, j - a]);
                
            } else {
                turnedPin.forEach(coor => {
                    let jenisBidak = (this.turn > this.array[i + a][j - a]) ? this.turn : this.array[i + a][j - a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }
        turnedPin = [];

        //check top left
        for (let a = 1; a <= i; a++) {
            if (i - a < 0 || j - a < 0) {
                turnedPin = [];
                break;
            }
            if (this.array[i - a][j - a] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[i - a][j - a] % 2 == 1) || (!this.pawn.isEven && this.array[i - a][j - a] % 2 == 0)) {
                turnedPin.push([i - a, j - a]);
            } else {
                turnedPin.forEach(coor => {
                    let jenisBidak = (this.turn > this.array[i - a][j - a]) ? this.turn : this.array[i - a][j - a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }
        turnedPin = [];
        //check bottom left
        for (let a = 1; a <= i; a++) {
            if (i - a < 0 || j + a > 5) {
                turnedPin = [];
                break;
            }
            if (this.array[i - a][j + a] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[i - a][j + a] % 2 == 1) || (!this.pawn.isEven && this.array[i - a][j + a] % 2 == 0)) {
                turnedPin.push([i - a, j + a]);
            }
            else {
                turnedPin.forEach(coor => {
                    let jenisBidak = (this.turn > this.array[i - a][j + a]) ? this.turn : this.array[i - a][j + a];
                    if (!(jenisBidak in whichPin) && (whichPin[jenisBidak] = [])) { //if not exists
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[jenisBidak].push(coor);
                    }
                })
                break;
            }
        }

        return whichPin;
    }
}

class OthelloV2 {
    boardState: Board;

    // main class : ubah array, ubah turn.
    botPlay(array: number[][], turn: number) {
        this.boardState = new Board(null, array, turn, true, 1, [null, null]);
        this.boardState.candidatePoint = this.boardState.generateChild(-100000000, 100000000);
        return this.boardState.candidatePoint.coor;
    }
}

class Main {
    game: OthelloV2;
    pawnType: number;
    boardArr: number[][];
    isBot: boolean;
    userHistory = [];

    constructor() {
        this.boardArr = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 0, 0],
            [0, 0, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ]
        this.game = new OthelloV2();
        this.pawnType = 1;
        this.isBot = false; // who first?
        // console.log('misael', this.turnCounter);
    }

    updateDisplay() {
        for (let i = 0; i < 6 ; i++ ){
            for (let j = 0 ; j < 6; j++) {
                switch (this.boardArr[i][j]) {
                    case 1:
                        document.getElementById(i+'-'+j).className = "cell crown-red";
                        break;
                    case 2:
                        document.getElementById(i+'-'+j).className = "cell crown-blue";
                        break;
                    case 3:
                        document.getElementById(i+'-'+j).className = "cell helmet-red";
                        break;
                    case 4:
                        document.getElementById(i+'-'+j).className = "cell helmet-blue";
                        break;
                    default:
                        document.getElementById(i+'-'+j).className = "cell";
                        break;
                }
            }
        }
    }

    undoState() {
        console.log(gameStarted && this.userHistory.length != 0)
        if (gameStarted && this.userHistory.length != 0) {
            this.boardArr = this.userHistory.pop();
            var score = this.game.boardState.utilityFunction(this.boardArr);
            this.updateScore(score);
            if (userTurn != "second") {
                this.pawnType =  this.pawnType == 1 ? 3 : this.pawnType-2;
            }else {
                this.pawnType = this.pawnType == 2 ? 4 : this.pawnType -2;
            }
            this.updateDisplay();
        }
    }

    // kiri score bot, kanan score user
    updateScore(bothScore: number[]) {
        document.getElementById("bot_score").innerHTML = bothScore[0].toString();
        document.getElementById("user_score").innerHTML = bothScore[1].toString();
    }

    checkGameFinished(array: number[][], bothScore: number[]) {
        let allEven = true;
        let allOdd = true;
        let allFilled = true;
        for (let i = 0 ; i < 6 ; i++ ){
            for (let j = 1; j < 6; j++) {
                if (array[i][j] != 0 && array[i][j] % 2 != 0) {
                    allEven = false;
                } else {
                    allOdd = false;
                }
                if (array[i][j] == 0) {
                    allFilled = false;
                }
            }
        }
        if (allEven || allFilled || allOdd) {
            if (bothScore[0] < bothScore[1]) {
                setTimeout(() => alert('Yeay user win! Congratulations!'), 1000);
                
            } else {
                setTimeout(() => alert('Whoopsie! You lose this time! Try again next time!'), 1000 );
                
            }
        }
    }

    placePawn(x: number, y: number) {
        gameStarted = true;
        this.game.boardState = new Board(this.game.boardState, this.boardArr, this.pawnType, false, 1, [null, null]);
        const turnedPin = this.game.boardState.totalTurnedPin(x,y);
        if (Object.keys(turnedPin).length > 0) {
            var tempState = this.boardArr.map(obj => ([...obj]));
            this.userHistory.push(tempState);
            this.boardArr[x][y] = this.pawnType;
            this.boardArr = this.game.boardState.generateTurnedArray(turnedPin);
            this.game.boardState.array = this.boardArr;
            var score = this.game.boardState.utilityFunction(this.boardArr);
            this.updateScore(score);
            this.updateDisplay();
            this.checkGameFinished(this.boardArr,score);
            console.log(this.pawnType)
            this.pawnType = (this.pawnType % 4) + 1;
            this.botTurn();
        }
    }

    botTurn() {
        const [x, y] = this.game.botPlay(this.boardArr, this.pawnType);
        this.boardArr[x][y] = this.pawnType;
        this.game.boardState = new Board(this.game.boardState, this.boardArr, this.pawnType, true, 1, [null, null]);
        const turnedPin = this.game.boardState.totalTurnedPin(x,y);
        this.boardArr = this.game.boardState.generateTurnedArray(turnedPin);
        this.game.boardState.array = this.boardArr;
        setTimeout(() => {
            this.updateDisplay();
            var score = this.game.boardState.utilityFunction(this.boardArr);
            this.updateScore(score);
            this.checkGameFinished(this.boardArr,score);
            this.pawnType = (this.pawnType % 4) + 1;
        }, 1000);
    }
}

const main = new Main();
var gameStarted = false;

function handleClick(coor) {
    var [x, y] = coor.split('-');
    x = parseInt(x);
    y = parseInt(y);
    if (gameStarted &&
        !document.getElementById(coor).classList.contains('crown-red') && 
        !document.getElementById(coor).classList.contains('crown-blue') &&
        !document.getElementById(coor).classList.contains('helmet-red') &&
        !document.getElementById(coor).classList.contains('helmet-blue') 
    ) {
        this.main.placePawn(x, y);
    }
    
}

function display(x, y) {
    const cssClass = x + '-' + y;
    const element = document.getElementById(cssClass);
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
    document.getElementById("gameStatus").innerHTML = "Game started ! Goodluck !"
    for (var i = 0, length = userTurnsElement.length; i < length; i++) {    
        if ((<HTMLInputElement>userTurnsElement[i]).checked){
            userTurn = (<HTMLInputElement>userTurnsElement[i]).value;
            break;
        }
    }

    for (var i = 0, length = difficulties.length; i < length; i++) {    
        if ((<HTMLInputElement>difficulties[i]).checked){
            difficulty = (<HTMLInputElement>difficulties[i]).value;
            break;
        }
    }
    if (userTurn == "second") {
        this.main.botTurn();
    }

}

function reset() {
    location.reload();
}