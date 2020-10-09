// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run our code faster.
'use strict';

// console.log('It works!');

// This map contains the matching pattern to win for each move
const winningMap = new Map()
winningMap.set('A1', [ ['A2', 'A3'], ['B2', 'C3'], ['B1', 'C1'] ]);
winningMap.set('A2', [ ['A1', 'A3'], ['B2', 'C2']]);
winningMap.set('A3', [ ['A1', 'A2'], ['B3', 'C3'], ['C1', 'B2']]);
winningMap.set('B1', [ ['B2', 'B3'], ['A1', 'C1']]);
winningMap.set('B2', [ ['A1', 'C3'], ['A2', 'C2'], ['A3','C1'], ['B1', 'B3']]);
winningMap.set('B3', [ ['A3', 'C3'], ['B1', 'B2']]);
winningMap.set('C1', [ ['A1', 'B1'], ['A3', 'B2'], ['C2', 'C3'] ]);
winningMap.set('C2', [ ['A2', 'B2'], ['C1', 'C3']]);
winningMap.set('C3', [ ['A1', 'B2'], ['C1', 'C2'], ['A3', 'B3'] ]);

const container = document.querySelector('.container');
const playButton = document.querySelector('.button1');
const boxes = document.querySelectorAll('.box');
const status = document.querySelector('h1');
const player1Score = document.querySelector('#player1_score');
const player2Score = document.querySelector('#player2_score');
const tieScore = document.querySelector('#ties');
const tie = 9;

// DECLARATION
let player1 = null;
let player2 = null;
let sequence = 0;
let moves = [];
let player = null;
let nextPlayer = null;
let gameOver = false;
let wins = [];
let loses = [];
let ties = 0;

/**
 * Reset game panel to play the game again
 * @param {*} event 
 */
function reset() {
    console.log('reset');
    player1 = new Player('A', 'Player');
    player2 = new Player('B', 'Computer');
    sequence = 0;
    moves = [];
    gameOver = false;
    player = player1;
    nextPlayer = player2;
    displayStatus('New Game');
    boxes.forEach(box => {
        box.style.color = 'black';
        box.innerHTML = '';
    })
}

function moveHandler(e) {
    e.preventDefault();
    const move = e.target.id;
    // console.log('moveSelected: ' + move);

    // player can proceed the move only if the move is not taken
    if (gameOver) {
        alert('Game over.  Please click Play to start another game');
    }
    else if(isNewMove(move)) {
 
        makeMove(move);

        if (nextPlayer.name === 'Computer' && !gameOver) {
            // console.log('possible move: ' + automateMove());  // TODO: automate move
            container.style.pointerEvents = 'none';
            setTimeout(function(){ 
                // makeMove(automateMove());  // THIS IS THE WORKING LOGIC

                // makeMove(automateMoveLevel2(player2));  // Assuming computer is always player 2
                makeMove(findPlayer1WinningMoveIfPossible());
                container.style.pointerEvents = 'auto';
            }, 1000);
        }
        
    } 
    else {
        alert('Wrong move, this move is already taken.  Please try again!');
    }
}

function makeMove(move) {
    playSound();
    sequence += 1;
    
    // console.log(moves);

    // update the game's moves made so far
    moves.push(move);
    player = getTurn(sequence, move);
    player.move(move);
    console.log(player.name + '\'s move: ' + 'step ' + sequence + ', move ' + move );

    // check for winning move
    if(isPlayerWinning(player, move)) {
        // console.log('********* Winner is ' + player.name + '**********');
        
        wins.push(player.id);
        loses.push(nextPlayer.id);
        
        updateScoreBoard();
        displayStatus(`${player.name} wins!!!`, 'red')
    } else if (sequence === tie) {
        // console.log('The game is tie!');
        ties += 1;
        updateScoreBoard();
        displayStatus('The game is tie!', 'green')
    } else {
        // console.log('game is not over yet');
        displayStatus(`${nextPlayer.name}\'s Turn`)
    }
}

function playSound() {
    // console.log("Playing sound")
    let audio = new Audio("./audio/Button.wav");
    audio.play();
}

function updateScoreBoard() {
    gameOver = true;
    let scores = wins.reduce(function(acc,win) {
        acc[win] = acc[win] ? acc[win] + 1 : 1;
        return acc;
    },[]);
    player1Score.innerHTML = scores.A === undefined? 0 : scores.A;
    player2Score.innerHTML = scores.B === undefined? 0 : scores.B;
    tieScore.innerHTML = ties;
}

function displayStatus(message, color='black') {
    status.innerHTML = message;
    status.style.color = color
}

 /**
  * This determines current player and next player based on the play sequence.   
  * And it marks the clicked move with appropriate symbol or text
  * @param {*} num  sequence of the game
  * @param {*} move  the move current player is clicked on 
  * @returns 
  */
function getTurn(num, move) {
    //console.log('step ' + num + ', move ' + move );
    let selectedmove = document.querySelector(`#${move}`);
    console.log(selectedmove);

    if(num % 2 === 0) {
        // selectedmove.style.color = 'green';
        let image = `<img src="./images/cat.jpeg" width='100px' height='100px'>`
        selectedmove.innerHTML = image
        nextPlayer = player1;
        return player2;
    } else {
        // selectedmove.style.color = 'blue';
        let image = `<img src="./images/dog.jpeg" width='100px' height='100px'>`
        selectedmove.innerHTML = image;
        nextPlayer = player2;
        return player1;
    }
}

/**
 * Returns the key of a random box that's not yet taken
 */
function automateMove() {
    let allMoves = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
    let possibleMoves = allMoves.filter(mv => !moves.includes(mv));
    // console.log('possible moves: ' + possibleMoves);
    let index = getRandomIndex(possibleMoves.length);
    // console.log('index: ' + index);
    return possibleMoves[index];
}

/**
 * Assuming player always start first. Here's the winning prevention strategy to make game more difficult
 */
function getMovePreventPlayerFromWinning() {
    console.log('findPlayer1WinningMoveIfPossible');
    // find all the available moves, 
    let allMoves = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
    let possibleMoves = allMoves.filter(mv => !moves.includes(mv));

    // and find the first that leads to winning move
    for (let i=0; i< possibleMoves.length; i++) {
        if(isPlayerWinning(player1, possibleMoves[i])) {
            console.log('player\'s possible winning move ' + possibleMoves[i])
            return possibleMoves[i];
        }
    }
    // console.log('No winning move found');
    if (possibleMoves.includes('B2')) { 
        return 'B2';
    } else {
        let index = getRandomIndex(possibleMoves.length);
        return possibleMoves[index];
    }
    
    // console.log('index: ' + index);
    
}

// /**
//  * This is an enhancement, definitely not the best logic to beat the game. I called this level2
//  * This finds the adjacent empty box that can leads to victory
//  */
// function automateMoveLevel2(ai) {
//     // If this is first move, find one that empty adjacent box, record nextMoves
//     let nextMoves = [];
//     let move = null;
//     if (ai.moves.length === 0) {
//         move = automateMove();
//         nextMoves = getNextMoves(move);
//     } else {
//         // from the nextMoves, find the one that's not taken
//         nextMoves = ai.getPlayerNextMoves();
//         // nextMoves = getNextMoves(move);

//         if(nextMoves.length === 0) {
//             move = automateMove();
//             nextMoves = getNextMoves(move);
//         } else {
//             // get the moves not taken
//             nextMoves = nextMoves.filter(move => !moves.includes(move));
//             if (nextMoves.length === 0) {
//                 move = automateMove();
//                 nextMoves = getNextMoves(move);
//             } else {
//                 let size = nextMoves.length;
//                 for(let i=0; i< size; i++) {
//                     // check if any move leads to winning
//                     if(isPlayerWinning(ai, nextMoves[i])) {
//                         return nextMoves[i];
//                     }
//                 }
                
//                 let index = getRandomIndex(size)
//                 move = nextMoves[index];
//                 console.log('size: ' + size + ', index: ' + index + ', move ' + move);
//                 // TODO: can following be enhanced to find one not empty
//                 nextMoves = getNextMoves(move); 
//             }
//         }
    


//     }
//     ai.setPlayerNextMoves(nextMoves);
//     console.log('AI next moves ' + nextMoves);
//     return move;
// }

/**
 * Get all the empty adjacent boxes as next moves
 * @param {*} move 
 */
function getNextMoves(move) {
    console.log('Try to get next moves with this move: ' + move);
    return winningMap.get(move).map(e => e[0]).filter(n => !moves.includes(n));
}

function getRandomIndex(maximumSize) {
    return Math.floor(Math.random() * maximumSize);
}

function isNewMove(move) {
    return !moves.includes(move);
}

/**
 * The determines if player is winning based on the move selected
 * @param {Player} player 
 * @param {*} move 
 */
function isPlayerWinning(player, move) {
    // It takes at least 5 moves to win
    // if (moves.length < 5) {
    //     return false;  
    // }

    // get the winning patterns for selected move
    let winningPatterns = [];
    let isWinning = false;
    winningPatterns = winningMap.get(move);
    
    winningPatterns.forEach(winningPattern => {
        // console.log('  winning pattern for ' + move + ': ' + winningPattern);
        if (containWinningMatch(winningPattern, player.getPlayerMoves())) {
            console.log('  winning pattern found for ' + move + ': ' + winningPattern);
            isWinning = true;
        }
    });
    
    return isWinning;
}

/**
 * This determine if the moves player made match any winning pattern. 
 * If any two matching movees are found, player wins
 * @param {*} winningPattern 
 * @param {*} moves 
 */
function containWinningMatch(winningPattern, moves) {
    let matchingmoveesCount = 0;
    winningPattern.forEach(move => {
        if(moves.includes(move)) {
            console.log('     ' + moves + ' includes ' + move);
            matchingmoveesCount += 1;
        }
    })

    return matchingmoveesCount == 2;
}

function init() {
    reset();
    container.addEventListener('click', moveHandler);
    playButton.addEventListener('click', reset);
    const player1Tag = document.querySelector('#player1');
    const player2Tag = document.querySelector('#player2');
    player1Tag.innerHTML = player1.name;
    player2Tag.innerHTML = player2.name;
}

document.addEventListener('DOMContentLoaded', init);


