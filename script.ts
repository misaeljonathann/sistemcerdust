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

const pawnClass: {[id: number]: pawnType} = {
    1: new pawnType(false, true),
    2: new pawnType(true, true),
    3: new pawnType(false, false),
    4: new pawnType(true, false)
};
var counter: number = 1;
class Board {
    parent: Board;
    child: Board[] = [];
    array: number[][];
    pawn: pawnType;
    turn: number;
    utilityPoint: number;
    candidatePoint: number[];
    isMax: boolean;
    depth: number;

    constructor(parent: Board, array: number[][], pawn: pawnType, turn: number, bool: boolean, depth: number) {
        this.parent = parent;
        this.array = array;
        this.pawn = pawn;
        this.turn = turn;
        this.utilityPoint = this.utilityFunction(array);
        this.candidatePoint = [];
        this.isMax = bool;
        this.depth = depth;
    }

    utilityFunction(array: number[][]) {
        const pointAlloc: { [pawn: number]: number} = {
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


    generateChild() {

        if (this.depth == 4) {
            return this.utilityPoint;
        }

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++ ) {
                var totalTurnedPin = this.totalTurnedPin(i,j);
                if (this.array[i][j] == 0 && totalTurnedPin && Object.keys(totalTurnedPin).length > 0) {
                    
                    counter++;                    
                    var newArray = this.generateTurnedArray(totalTurnedPin);
                    newArray[i][j] = (this.turn == 4) ? 4 : this.turn%4 ;
                    
                    var newNode = new Board(this, newArray, pawnClass[(this.turn%4)+1], (this.turn%4)+1, !this.isMax, this.depth+1);
                    this.addChild(newNode);
                    //Minimax
                    
                    this.candidatePoint.push(newNode.generateChild());
                }
            }
        }      
        console.log(this.array);
        console.log(this.depth);
        
        if (this.isMax) {
            return Math.max.apply(Math, this.candidatePoint);
        } 

        else {
            // this.candidatePoint.push(newNode.generateChild());
            return Math.min.apply(Math, this.candidatePoint);
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

    generateTurnedArray(paths: {[pawn: number]: number[][]}): number[][] {
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
    totalTurnedPin(i: number, j: number): {[pawn: number]: number[][]} {
        var turnedPin: number[][] = [];
        var whichPin: { [pawn: number]: number[][];} = {};
        
        // check right 
        for (var x = i+1; x < 6; x++) {
            if (this.array[x][j] == 0) {
                break;
            }
            else if ( (this.pawn.isEven && this.array[x][j] % 2 == 1) || (!this.pawn.isEven && this.array[x][j] % 2 == 0) ) {
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
                        console.log("turn : ", this.turn);
                        whichPin[this.array[x][j]].push(coor);
                    }
                })
                break;
            }
        }

        // check left
        for (var x = i-1; x > 0; x--) {
            if (this.array[x][j] == 0) {
                break;
            }
            else if ( (this.pawn.isEven && this.array[x][j] % 2 == 1) || (!this.pawn.isEven && this.array[x][j] % 2 == 0) ) {
                turnedPin.push([x,j]);
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
        for (var y = j-1; y > 0; y--) {
            if (this.array[i][y] == 0) {
                break;
            }
            else if ( (this.pawn.isEven && this.array[i][y] % 2 == 1) || (!this.pawn.isEven && this.array[i][y] % 2 == 0) ) {
                turnedPin.push([i,y]);
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
        for (var y = j+1; y < 6; y++) {
            if (this.array[i][y] == 0) {
                break;
            }
            else if ( (this.pawn.isEven && this.array[i][y] % 2 == 1) || (!this.pawn.isEven && this.array[i][y] % 2 == 0) ) {
                turnedPin.push([i,y]);
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
        for (let a = 1; a <= 5-i; a++) {
            if (i+a > 5 || j+a > 5) {
                break;
            }
            if (this.array[i+a][j+a] == 0) {
                turnedPin = [];
                break;
            }
            else if ( (this.pawn.isEven && this.array[i+a][j+a] % 2 == 1) || (!this.pawn.isEven && this.array[i+a][j+a] % 2 == 0) ) {
                turnedPin.push([i+a,j+a]);
            } else {
                turnedPin.forEach(coor => {
                    if (!(this.array[i+a][j+a] in whichPin) && (whichPin[this.array[i+a][j+a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i+a][j+a]) ? this.turn : this.array[i+a][j+a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i+a][j+a]].push(coor);
                    }
                })
                break;
            }
        }
        
        //check top right
        for (let a = 1; a <= 5-i; a++) {
            if (i+a > 5 || j-a < 0) {
                break;
            }
            if (this.array[i+a][j-a] == 0) {
                turnedPin = [];
                break;
            }
            else if ( (this.pawn.isEven && this.array[i+a][j-a] % 2 == 1) || (!this.pawn.isEven && this.array[i+a][j-a] % 2 == 0) ) {
                turnedPin.push([i+a,j-a]);
            } else {
                turnedPin.forEach(coor => {
                    if (!(this.array[i+a][j-a] in whichPin) && (whichPin[this.array[i+a][j-a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i+a][j-a]) ? this.turn : this.array[i+a][j-a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i+a][j-a]].push(coor);
                    }
                })
                break;
            }
        }

        //check top left
        for (let a = 1; a <= 5-i; a++) {
            if (i-a < 0 || j-a < 0) {
                break;
            }
            if (this.array[i-a][j-a] == 0) {
                turnedPin = [];
                break;
            }
            else if ( (this.pawn.isEven && this.array[i-a][j-a] % 2 == 1) || (!this.pawn.isEven && this.array[i-a][j-a] % 2 == 0) ) {
                turnedPin.push([i-a,j-a]);
            } else {
                turnedPin.forEach(coor => {
                    if (!(this.array[i-a][j-a] in whichPin) && (whichPin[this.array[i-a][j-a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i-a][j-a]) ? this.turn : this.array[i-a][j-a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i-a][j-a]].push(coor);
                    }
                })
                break;
            }
        }
        //check bottom left
        for (let a = 1; a <= 5-i; a++) {
            if (i-a < 0 || j+a > 5) {
                break;
            }
            if (this.array[i-a][j+a] == 0) {
                turnedPin = [];
                break;
            }
            else if ( (this.pawn.isEven && this.array[i-a][j+a] % 2 == 1) || (!this.pawn.isEven && this.array[i-a][j+a] % 2 == 0) ) {
                turnedPin.push([i-a,j+a]);
            } 
            else {
                turnedPin.forEach(coor => {
                    if (!(this.array[i-a][j+a] in whichPin) && (whichPin[this.array[i-a][j+a]] = [])) { //if not exists
                        let jenisBidak = (this.turn > this.array[i-a][j+a]) ? this.turn : this.array[i-a][j+a];
                        whichPin[jenisBidak] = [coor];
                    } else {
                        whichPin[this.array[i-a][j+a]].push(coor);
                    }
                })
                break;
            }
        }
        return whichPin;
    }
}

class OthelloV2 {
    initialConfiguration: Board;
    counter = 1;


    constructor() {
        const array = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 2, 0, 0],
            [0, 0, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
        ];
        this.initialConfiguration = new Board(null, array, new pawnType(false, true), 1, true, 1);
        this.constructTree();
    }

    constructTree() {
        this.initialConfiguration.generateChild();
        // this.initialConfiguration.child.forEach(array => {
        //     console.log(array.array);
        // });
    }

}

var game = new OthelloV2();