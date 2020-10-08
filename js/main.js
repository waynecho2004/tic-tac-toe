// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run our code faster.
'use strict';

console.log('It works!');

// This map contains the matching pattern to win for each move
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

const container = document.querySelector('.container');
const status = document.querySelector('#status');
const player1 = new Player('Wayne');
const player2 = new Player('Computer');
const draw = 9;
console.log(status);

// INITIALIZATION
let sequence = 0;
let moves = [];
let player = player1;
let nextPlayer = player2;

function moveHandler(e) {
    e.preventDefault();
   // console.log('Clicked');
   const box = e.target.id;
   console.log('boxSelected: ');
   console.log(box);

   // player can proceed the move only if the box is not taken
   if(isNewMove(box)) {
        sequence += 1;
        console.log(player.name + '\'s move');
        // console.log(moves);

        // update the moves made so far
        moves.push(box);
        player = getTurn(sequence, box);
        player.move(box);
        
        // check for winning move
        if (sequence === draw) {
            console.log('The game is draw!');
            displayStatus('The game is draw!')
        } else if(isPlayerWinning(player, box)) {
            console.log('Winner');
            displayStatus(`${player.name} wins!!!`)
        } else {
            console.log('game is not over yet');
            displayStatus(`${nextPlayer.name}\'s Turn`)
        }

   } else {
        alert('Wrong move, this box is already taken.  Please try again!');
   }
}

function displayStatus(message) {
    status.innerHTML = message;
}

 /**
  * This determines current player and next player based on the play sequence.   
  * And it marks the clicked box with appropriate symbol or text
  * @param {*} num  sequence of the game
  * @param {*} box  the box current player is clicked on 
  * @returns 
  */
function getTurn(num, box) {
    console.log('step ' + num + ', move ' + box );
    let selectedBox = document.querySelector(`#${box}`);
    console.log(selectedBox);

    if(num % 2 === 0) {
        selectedBox.style.color = 'green';
        selectedBox.innerHTML = 'O';
        selectedBox.style.fontSize = 'xx-large';
        nextPlayer = player1;
        return player2;
    } else {
        selectedBox.style.color = 'blue';
        selectedBox.innerHTML = 'X';
        selectedBox.style.fontSize = 'xx-large';
        nextPlayer = player2;
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

/**
 * The determines if player is winning based on the box selected
 * @param {Player} player 
 * @param {*} box 
 */
function isPlayerWinning(player, box) {
    // It takes at least 3 moves to win
    if (moves.length < 3) {
        return false;  
    }

    // get the winning patterns for selected box
    let winningPatterns = [];
    let isWinning = false;
    winningPatterns = winningMap.get(box);
    
    winningPatterns.forEach(winningPattern => {
        console.log('winning pattern for ' + box + ': ' + winningPattern);
        if (containWinningMatch(winningPattern, player.getPlayerMoves())) {
            isWinning = true;
        }
    });
    
    return isWinning;
}

/**
 * This determine if the moves player made match any winning pattern. 
 * If any two matching boxes are found, player wins
 * @param {*} winningPattern 
 * @param {*} moves 
 */
function containWinningMatch(winningPattern, moves) {

    let matchingBoxesCount = 0;
    winningPattern.forEach(box => {
        if(moves.includes(box)) {
            console.log(moves + ' includes ' + box);
            matchingBoxesCount += 1;
        }
    })

    return matchingBoxesCount == 2;
}






