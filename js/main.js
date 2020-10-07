// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run our code faster.
'use strict';

// This map contains the matching pattern to win
const winningMap = new Map()
winningMap.set('A1', [ ['A2', 'A3'], ['B2', 'C3'], ['B1', 'C1'] ]);
winningMap.set('A2', [ ['A1', 'A3'], ['B2', 'C3']]);
winningMap.set('A3', [ ['A1', 'A2'], ['B3', 'C3'], ['A1', 'B2']]);
winningMap.set('B1', [ ['B2', 'B3'], ['A1', 'C1']]);
winningMap.set('B2', [ ['A1', 'C3'], ['A2', 'C2'], ['A3','C1'], ['B1', 'B3']]);
winningMap.set('B3', [ ['A3', 'C3'], ['B1', 'B2']]);
winningMap.set('C1', [ ['A1', 'B1'], ['A3', 'B2'], ['C2', 'C3'] ]);
winningMap.set('C2', [ ['A2', 'B2'], ['C1', 'C2']]);
winningMap.set('C3', [ ['A1', 'B2'], ['C1', 'C2'], ['C3', 'B3'] ]);

console.log('It works!');

const container = document.querySelector('.container');
// console.log(container);

let sequence = 1;
let moves = [];

const player1 = new Player('Wayne');
const player2 = new Player('Computer');
let player = new Player('who am i');

const moveHandler = (e) => {
   // console.log('Clicked');
   const box = e.target.id;
   console.log('boxSelected: ');
   console.log(box);

   if(isNewMove(box)) {
        moves.push(box)
        // console.log(moves);
        player = getTurn(sequence, box);
        console.log(player.name + '\'s move');
        player.move(box);
        
        // TODO: check for winning move
        if(isPlayerWinning(player, box)) {
            // TODO: display winner
            console.log('Winner');
        } else {
            console.log('game is not over yet');
        }

        sequence += 1;
   } else {
        alert('Wrong move, this box is already taken.  Please try again!');
   }
}

function getTurn(num, box) {
    console.log('move ' + num + ', boxId ' + box );
    let selectedBox = document.querySelector(`#${box}`);
    console.log(selectedBox);

    if(num === 1) {
        selectedBox.style.color = 'blue';
        selectedBox.innerHTML = 'X';
        return player1;
    } else if(num % 2 === 0) {
        selectedBox.style.color = 'green';
        selectedBox.innerHTML = 'O';
        return player2;
    } else {
        selectedBox.style.color = 'blue';
        selectedBox.innerHTML = 'X';
        return player1;
    }
}

function reset() {
    sequence = 1;
    moves = [];
    // TODO: reset boxes
}

function isNewMove(box) {
    return !moves.includes(box);
}

container.addEventListener('click', moveHandler);



function isPlayerWinning(player, box) {
    let winningStrArr = winningMap.get(box);
    console.log('winning str arr: ' + winningStrArr);
    let moves = player.getPlayerMoves();
    for (let i =0; i< winningStrArr.length; i++) {
        let winningStr = winningStrArr[i];
        // console.log('winningStr: '  + winningStr);
        if (containWinningMatch(winningStr, moves)) {
            return true;
        }
    }
    // console.log(winningStr);
    return false;
}

// Check if winning pattern is matched
function containWinningMatch(arr, moves) {
    // It takes at least 3 moves to win
    if (moves.length < 3) {
        return false;  
    }

    let winningCount = 0;
    for(let i=0; i < arr.length; i++) {
    
        if(moves.includes(arr[i])) {
            console.log(moves + ' includes ' + arr[i]);
            winningCount += 1;
        }
    }
    if (winningCount == 2) {
        return true;
    } else {
        return false;
    }
}






