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
        this.utilityPoint = this.utilityFunction(array);
        this.isMax = bool;
        this.depth = depth;
        this.move = move;
    }

    utilityFunction(array: number[][]) {
        const pointAlloc: { [pawn: number]: number } = {
            0: 0,
            1: -3,
            2: 3,
            3: -1,
            4: 1
        };
        let totalPoint = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                totalPoint += pointAlloc[array[i][j]];
            }
        }
        return totalPoint;
    }

    addChild(newChild: Board) {
        this.child.push(newChild);
    }

    generateChild(alpha: number, beta: number) {

        if (this.depth == 3) {
            console.log("LEAF : ", this.move);
            return new UtilityCoor(this.utilityPoint, this.move);
        }

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                var totalTurnedPin = this.totalTurnedPin(i, j);
                if (this.array[i][j] == 0 && totalTurnedPin && Object.keys(totalTurnedPin).length > 0) {

                    counter++;
                    var newArray = this.generateTurnedArray(totalTurnedPin);
                    newArray[i][j] = (this.turn == 4) ? 4 : this.turn%4;
                    
                    var newNode = new Board(this, newArray, (this.turn%4)+1, !this.isMax, this.depth+1, [i,j]) ;
                    this.addChild(newNode);
                }
            }
        }
        console.log(this.array);
        console.log(this.depth);
        if (this.isMax) {
            let valMax = -1000000;
            let coor;
            // debugger
            for (let child of this.child) {
                let nextMove = child.generateChild(alpha, beta);
                if (nextMove.point > valMax) {
                    valMax = nextMove.point;
                    coor = nextMove.coor;
                    console.log("duar2 ",coor);
                    if (valMax >= beta) return new UtilityCoor(valMax, child.move);
                    alpha = Math.max(alpha, valMax);
                }
            }
            return new UtilityCoor(valMax, coor);
        }

        else {
            let valMin = Number.MAX_VALUE;
            let coor;
            for (let child of this.child) {
                let nextMove = child.generateChild(alpha, beta);
                if (nextMove.point < valMin) {
                    valMin = nextMove.point;
                    coor = nextMove.coor;
                    console.log("duar ",coor);
                    if (valMin <= beta) return new UtilityCoor(valMin, child.move);
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
                newArray[path[0]][path[1]] = parseInt(key, 10);
            })
        }

        return newArray;
    }

    // this function return array of location turned pin [[x,y],....]
    totalTurnedPin(i: number, j: number): { [pawn: number]: number[][] } {
        var turnedPin: number[][] = [];
        var whichPin: { [pawn: number]: number[][]; } = {};

        // check right 
        for (var x = i + 1; x < 6; x++) {
            if (this.array[x][j] == 0) {
                turnedPin = [];
                break;
            }
            else if ((this.pawn.isEven && this.array[x][j] % 2 == 1) || (!this.pawn.isEven && this.array[x][j] % 2 == 0)) {
                turnedPin.push([x, j]);
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor)
                    if (!(this.array[x][j] in whichPin) && (whichPin[this.array[x][j]] = [])) { //if not exists
                        if (this.turn > this.array[x][j] || this.turn < this.array[x][j]) {
                            whichPin[this.turn] = [coor];
                        } else {
                            whichPin[this.array[x][j]] = [coor];
                        }
                    } else {
                        console.log("turn : ", this.turn);
                        whichPin[this.array[x][j]].push(coor);
                    }
                })
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
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor);
                    if (!(this.array[x][j] in whichPin) && (whichPin[this.array[x][j]] = [])) { //if not exists
                        if (this.turn > this.array[x][j] || this.turn < this.array[x][j]) {
                            whichPin[this.turn] = [coor];
                        } else {
                            whichPin[this.array[x][j]] = [coor];
                        }
                    } else {
                        whichPin[this.array[x][j]].push(coor);
                    }
                })
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
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor);
                    if (!(this.array[i][y] in whichPin) && (whichPin[this.array[i][y]] = [])) { //if not exists
                        if (this.turn > this.array[i][y] || this.turn < this.array[i][y]) {
                            whichPin[this.turn] = [coor];
                        } else {
                            whichPin[this.array[i][y]] = [coor];
                        }
                    } else {
                        whichPin[this.array[i][y]].push(coor);
                    }
                })
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
            } else {
                turnedPin.forEach(coor => {
                    //whichPin[this.array[x][j]].push(coor);
                    if (!(this.array[i][y] in whichPin) && (whichPin[this.array[i][y]] = [])) { //if not exists
                        if (this.turn > this.array[i][y] || this.turn < this.array[i][y]) {
                            whichPin[this.turn] = [coor];
                        } else {
                            whichPin[this.array[i][y]] = [coor];
                        }
                    } else {
                        whichPin[this.array[i][y]].push(coor);
                    }
                })
                break;
            }
        }

        //check bot right
        for (let a = 1; a <= 5 - i; a++) {
            if (i + a > 5 || j + a > 5) {
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
                    if (!(this.array[i + a][j + a] in whichPin) && (whichPin[this.array[i + a][j + a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i + a][j + a]) ? this.turn : this.array[i + a][j + a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i + a][j + a]].push(coor);
                    }
                })
                break;
            }
        }

        //check top right
        for (let a = 1; a <= 5 - i; a++) {
            if (i + a > 5 || j - a < 0) {
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
                    if (!(this.array[i + a][j - a] in whichPin) && (whichPin[this.array[i + a][j - a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i + a][j - a]) ? this.turn : this.array[i + a][j - a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i + a][j - a]].push(coor);
                    }
                })
                break;
            }
        }

        //check top left
        for (let a = 1; a <= 5 - i; a++) {
            if (i - a < 0 || j - a < 0) {
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
                    if (!(this.array[i - a][j - a] in whichPin) && (whichPin[this.array[i - a][j - a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i - a][j - a]) ? this.turn : this.array[i - a][j - a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i - a][j - a]].push(coor);
                    }
                })
                break;
            }
        }
        //check bottom left
        for (let a = 1; a <= 5 - i; a++) {
            if (i - a < 0 || j + a > 5) {
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
                    if (!(this.array[i - a][j + a] in whichPin) && (whichPin[this.array[i - a][j + a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i - a][j + a]) ? this.turn : this.array[i - a][j + a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i - a][j + a]].push(coor);
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
        this.boardState = new Board(null, array, turn, true, 1, [null, null])
        this.boardState.candidatePoint = this.boardState.generateChild(Number.MAX_VALUE, Number.MIN_VALUE);
        console.log(this.boardState.candidatePoint);
        return this.boardState.candidatePoint.coor;
    }
}

class Main {
    game: OthelloV2;
    // turnCounter: number;
    pawnType: number;
    boardArr: number[][];
    isBot: boolean;

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
        // this.turnCounter = 1;
        this.pawnType = 1;
        this.isBot = true;
        if(this.isBot) {
            this.placePawn(0,0);
        }
        // console.log('misael', this.turnCounter);
    }

    placePawn(x: number, y: number) {
        if (this.isBot) {
            [x,y] = this.game.botPlay(this.boardArr, this.pawnType);
        }
        console.log("xy : ",x,y);
        this.boardArr[x][y] = this.pawnType;
        this.game.boardState = new Board(this.game.boardState, this.boardArr, this.pawnType, this.isBot, 1, [null, null]);

        const cssClass = x + '-' + y;
        const element = document.getElementById(cssClass);
        switch (this.pawnType) {
            case 1:
                element.classList.add("crown-red");
                break
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

        console.log('giliran sokap :', this.isBot? 'Bot': 'Human');
        this.isBot = !this.isBot;
        this.pawnType = (this.pawnType % 4) + 1;
    }

}

const main = new Main();
console.log('giliran sokap :', this.main.isBot? 'Bot': 'Human');

function handleClick(coor) {
    const [x, y] = coor.split('-');
    this.main.placePawn(x, y);
}

function mikir() {

}