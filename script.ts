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

    constructor(parent: Board, array: number[][], pawn: pawnType, turn: number) {
        this.parent = parent;
        this.array = array;
        this.pawn = pawn;
        this.turn = turn;
    }
    
    addChild(newChild: Board) {
        this.child.push(newChild);
    }

    generateChild() {
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++ ) {
                var totalTurnedPin = this.totalTurnedPin(i,j);
                //console.log(Object.keys(totalTurnedPin));
                if (this.array[i][j] == 0 && totalTurnedPin && Object.keys(totalTurnedPin).length > 0) {
                    counter++;
                    console.log(counter);
                    var newArray = this.generateTurnedArray(totalTurnedPin);
                    newArray[i][j] = (this.turn == 4) ? 4 : this.turn%4 ;
                    var newNode = new Board(this, newArray, pawnClass[(this.turn%4)+1], (this.turn%4)+1);
                    this.addChild(newNode);              
                }
            }
        }
        if (counter >= 5000) {
            return 0;
        }
        console.log(this.array);
        this.child.forEach(path => {
            path.generateChild();
        });
        console.log("selesai");
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
                        whichPin[this.array[x][j]] = [coor];
                    } else {
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
                        whichPin[this.array[x][j]] = [coor];
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
                        whichPin[this.array[i][y]] = [coor];
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
                        whichPin[this.array[i][y]] = [coor];
                    } else {
                        whichPin[this.array[i][y]].push(coor);
                    }
                })
                break;
            }
        }

        //check top right 
        for (var x = i+1; x < 6; x++) {
            let breakCheck = false;
            for ( var y = j-1; y > 0; y--) {
                if (this.array[i][j] == 0) {
                    breakCheck = true;
                    break;   
                }
                else if ( (this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0) ) {
                    turnedPin.push([x,y]);
                } else {
                    turnedPin.forEach(coor => {
                        //whichPin[this.array[x][j]].push(coor);
                        if (!(this.array[x][y] in whichPin) && (whichPin[this.array[x][y]] = [])) { //if not exists
                            whichPin[this.array[x][y]] = [coor];
                        } else {
                            whichPin[this.array[x][y]].push(coor);
                        }
                    })
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck) break;
        }
        
        //check bot right 
        for (var x = i+1; x < 6; x++) {
            let breakCheck = false;
            for ( var y = j+1; y < 6; y++) {
                if (this.array[i][j] == 0) {
                    breakCheck = true;
                    break;   
                }
                else if ( (this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0) ) {
                    turnedPin.push([x,y]);
                } else {
                    turnedPin.forEach(coor => {
                        //whichPin[this.array[x][j]].push(coor);
                        if (!(this.array[x][y] in whichPin) && (whichPin[this.array[x][y]] = [])) { //if not exists
                            whichPin[this.array[x][y]] = [coor];
                        } else {
                            whichPin[this.array[x][y]].push(coor);
                        }
                    })
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck) break;
        }

        //check left top
        for (var x = i-1; x > 0; x--) {
            let breakCheck = false;
            for ( var y = j-1; y > 0; y--) {
                if (this.array[i][j] == 0) {
                    breakCheck = true;
                    break;   
                }
                else if ( (this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0) ) {
                    turnedPin.push([x,y]);
                } else {
                    turnedPin.forEach(coor => {
                        //whichPin[this.array[x][j]].push(coor);
                        if (!(this.array[x][y] in whichPin) && (whichPin[this.array[x][y]] = [])) { //if not exists
                            whichPin[this.array[x][y]] = [coor];
                        } else {
                            whichPin[this.array[x][y]].push(coor);
                        }
                    })
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck) break;
        }

        //check left bottom
        for (var x = i-1; x > 0; x--) {
            let breakCheck = false;
            for ( var y = j+1; y < 6; y++) {
                if (this.array[i][j] == 0) {
                    breakCheck = true;
                    break;   
                }
                else if ( (this.pawn.isEven && this.array[x][y] % 2 == 1) || (!this.pawn.isEven && this.array[x][y] % 2 == 0) ) {
                    turnedPin.push([x,y]);                
                } else {
                    turnedPin.forEach(coor => {
                        //whichPin[this.array[x][j]].push(coor);
                        if (!(this.array[x][y] in whichPin) && (whichPin[this.array[x][y]] = [])) { //if not exists
                            whichPin[this.array[x][y]] = [coor];
                        } else {
                            whichPin[this.array[x][y]].push(coor);
                        }
                    })
                    breakCheck = true;
                    break;
                }
                break;
            }
            if (breakCheck) break;
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
        this.initialConfiguration = new Board(null, array, new pawnType(false, true), 1);
        this.constructTree();
    }

    constructTree() {
        this.initialConfiguration.generateChild();
        this.initialConfiguration.child.forEach(array => {
            console.log(array.array);
        });
    }

}

var game = new OthelloV2();