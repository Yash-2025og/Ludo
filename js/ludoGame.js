var latestDiceNo = 0;
var turnRGBY = 0;
var secChanceFl = false;

const safeBlocks = [2, 10, 15, 23, 28, 36, 41, 49];
const startingBlocks = {
    "r":"g-2",
    "g":"g-15",
    "y":"g-28",
    "b":"g-41"
}
const corrNo = {
    "r":0,
    "g":1,
    "y":2,
    "b":3
}

const corrAlpha = {
    0:"r",
    1:"g",
    2:"y",
    3:"b"
}

var openingMove = [0, 0, 0, 0];
var reachedHome = [0, 0, 0, 0];

const corrCol = {
    "y":"#fffb00",
    "r":"#ff0909",
    "g":"#00ff00",
    "b":"#008cff",
}
const startingPosition = {
    "rgt-1":"rgtc-1",
    "rgt-2":"rgtc-2",
    "rgt-3":"rgtc-3",
    "rgt-4":"rgtc-4",
    "ggt-1":"ggtc-1",
    "ggt-2":"ggtc-2",
    "ggt-3":"ggtc-3",
    "ggt-4":"ggtc-4",
    "ygt-1":"ygtc-1",
    "ygt-2":"ygtc-2",
    "ygt-3":"ygtc-3",
    "ygt-4":"ygtc-4",
    "bgt-1":"bgtc-1",
    "bgt-2":"bgtc-2",
    "bgt-3":"bgtc-3",
    "bgt-4":"bgtc-4"
}

var goatStepCounter = {
    "rgt-1":56,
    "rgt-2":56,
    "rgt-3":56,
    "rgt-4":56,
    "ggt-1":56,
    "ggt-2":56,
    "ggt-3":56,
    "ggt-4":56,
    "ygt-1":56,
    "ygt-2":56,
    "ygt-3":56,
    "ygt-4":56,
    "bgt-1":56,
    "bgt-2":56,
    "bgt-3":56,
    "bgt-4":56,
}


document.getElementById('p-0').src = "images/dice.png";


function rollTheDice(){
    var latestDiceNo1 = 0;
    if(latestDiceNo != 0){
        return;
    }
    var rollingDice = document.getElementById("rolling-dice");
    var rollingInterval = setInterval(function(){
        latestDiceNo1 = getRandomInt();
        rollingDice.src = "images/f"+latestDiceNo1+".png";
    }, 200);
    setTimeout(function(){
        clearInterval(rollingInterval);
        latestDiceNo = latestDiceNo1;
        if (latestDiceNo != 6 && openingMove[turnRGBY] == 0) {
            setTimeout(function(){
                nextMove();
            }, 1500);
        }
    }, 3000);
}

function getRandomInt(){
    return Math.floor(Math.random()*6 + 1);
}

function moveOutOfHome(elem){
    if(latestDiceNo == 6){
        goat = elem.children[0].children[0];
        if(goat == undefined){
            return false;
        }
        if(isMoveValid(goat.id)){
            transferGoatToNextBlock(goat, startingBlocks[corrAlpha[turnRGBY]]);
            openingMove[turnRGBY] += 1;
            latestDiceNo = 0;
        }
    }
    else{
        return false;
    }
}

function updateBlockDetails(new_block_id, new_block_no, block_id, block_no, goat_id, goat){
    if(!safeBlocks.includes(new_block_no)){
        var elem = document.getElementById(new_block_id);
        var elems = elem.children[0].children;
        var gtType = goat_id[0];
        if(elems[0] != undefined){
            var gtpType = elems[0].id;
            if(gtpType[0] != gtType){
                returnToStart(elems);
                secChanceFl = true;
            }
        }
    }
    if(safeBlocks.includes(block_no)){
        goat = moveOutFromSafety(block_id);
        if(goat != "null"){
            transferGoatToNextBlock(goat, new_block_id);
        }
    }
    else{
        transferGoatToNextBlock(goat, new_block_id);
    }
}

function moveOutFromSafety(block_id){
    playerCol = corrAlpha[turnRGBY];
    elements = document.getElementById(block_id).children[0].children;
    for(i = 0; i < elements.length; i++){
        if(elements[i].id[0] == playerCol){
            return elements[i]
        }
    }
    return "null"
}

function returnToStart(elems){
    var j = elems.length-1;
    while (j >= 0){
        openingMove[corrNo[elems[j].id[0]]] -= 1;
        document.getElementById(startingPosition[elems[j].id]).children[0].append(elems[j]);
        j--;
    }
}

function goatReachedHome(goat){
    document.getElementById('hiddenArea').append(goat);
    reachedHome[corrNo[goat.id[0]]] += 1;
    document.getElementById('h'+goat.id[0]+'b-'+reachedHome[corrNo[goat.id[0]]]).style.background = corrCol[goat.id[0]];
}


function moveGoat(elem){
    goats = elem.children[0].children;
    if(goats.length == 0 || latestDiceNo == 0){
        return false;
    }
    grid_id = elem.id;
    goat = moveOutFromSafety(grid_id);

    if(goat == "null"){
        return;
    }

    block_no = parseInt(grid_id.split("-")[1]);
    if(isMoveValid(goat.id)){
        if(goatStepCounter[goat.id] < latestDiceNo){
            return false;
        }
        next_grid_id = getNextBlockId(block_no, goat.id);
        if(next_grid_id == "HOME"){
            secChanceFl = true;
            nextMove();
            return goatReachedHome(goat);
        }
        else{
            new_block_id = next_grid_id.split("+")[0];
            new_block_no = parseInt(next_grid_id.split("+")[1]);
            if(new_block_no != 0){
                updateBlockDetails(new_block_id, new_block_no, grid_id, block_no, goat.id, goat);
            }
            else{
                transferGoatToNextBlock(goat, new_block_id);
            }
        }
        nextMove();
    }

}

function nextMove(){
    if(latestDiceNo != 6 && !secChanceFl){
        document.getElementById('p-'+turnRGBY).src =  "";
        turnRGBY = (turnRGBY + 1) % 4;
        document.getElementById("rolling-dice").src = "images/dice.png";
        document.getElementById('p-'+turnRGBY).src =  "images/dice.png";
    }
    latestDiceNo = 0;
}

function transferGoatToNextBlock(goat, block_id){
    document.getElementById(block_id).children[0].append(goat);
}

function getNextBlockId(currectBlockNo, goat_id){
    newBlockNo = (currectBlockNo + latestDiceNo)%52;
    if(newBlockNo == 0){
        newBlockNo = 52;
    }
    id = updateSteps(goat_id);
    if(id == "null"){
        id = "g-"+newBlockNo+"+"+newBlockNo;
    }
    else if(id == "HOME"){
        return id;
    }
    else{
        id += "+0";
    }
    return id;
}


function updateSteps(goat_id) {
    steps = goatStepCounter[goat_id]
    newSteps = steps - latestDiceNo;
    goatStepCounter[goat_id] = newSteps;
    if(newSteps == 0){
        return "HOME";
    }
    if(newSteps <= 5){
        return "g-"+goat_id[0]+newSteps;
    }
    return "null";
}

function isMoveValid(goat_id){
    if(goat_id[0] == corrAlpha[turnRGBY]){
        return true;
    }
    return false;
}


