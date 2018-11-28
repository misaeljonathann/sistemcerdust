var turnCounter = 0;
console.log(turnCounter);
function clickedPiece(event) {
    var mod_4 = turnCounter % 4;
    const element = document.getElementById(event);
    console.log(mod_4,turnCounter);
    switch (mod_4) {
        case 0:
            element.classList.add("crown-red");
            break;
        case 1:
            element.classList.add("crown-blue");
            break;
        case 2:
            element.classList.add("helmet-red");
            break;
        case 3:
            element.classList.add("helmet-blue");
            break;
        default:
            break;
    }
    turnCounter++;
}