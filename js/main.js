// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run our code faster.
'use strict';

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

const allMoves = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
const container = document.querySelector('.container');
const playButton = document.querySelector('.button1');
const boxes = document.querySelectorAll('.box');
const status = document.querySelector('h1');
const player1Score = document.querySelector('#player1_score');
const player2Score = document.querySelector('#player2_score');
const tieScore = document.querySelector('#ties');
const audio = new Audio("./audio/Button.wav");
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
    displayStatus('Tic Tac Toe');
    boxes.forEach(box => {
        box.style.color = 'black';
        box.innerHTML = '';
    })
}

function moveHandler(e) {
    e.preventDefault();
    const move = e.target.id;
    // console.log('moveSelected: ' + move);

    if (gameOver) {
        alert('Game over.  Please click Play Again to start a new game');
    }
    else if(isNewMove(move)) {
 
        makeMove(move);

        if (nextPlayer.name === 'Computer' && !gameOver) {
            // console.log('possible move: ' + automateMove());  // TODO: automate move
            container.style.pointerEvents = 'none';
            setTimeout(function(){ 
                makeMove(automateMove());  
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
 
    // update the game's moves
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
        ties += 1;
        updateScoreBoard();
        displayStatus('The game is tie!', 'green')
    } else {
        displayStatus(`${nextPlayer.name}\'s Turn`)
    }
}

function playSound() {
    // console.log("Playing sound")
    audio.play();
    // console.log("sound is played");
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
        let image = `<img src="./images/cat.jpeg" width='100px' height='100px'>`
        selectedmove.innerHTML = image
        nextPlayer = player1;
        return player2;
    } else {
        let image = `<img src="./images/dog.jpeg" width='100px' height='100px'>`
        selectedmove.innerHTML = image;
        nextPlayer = player2;
        return player1;
    }
}

/**
 * AI logic of choosing next available move
 *  Step 1: find ai winning move
 *  Step 2: find player's winning move
 *  Step 3: use B2 if available
 *  Step 4: use random move 
 */
function automateMove() {
    console.log('findPlayer1WinningMoveIfPossible');
    
    let possibleMoves = allMoves.filter(mv => !moves.includes(mv));
    let aiWinningMove = possibleMoves.find(mv => isPlayerWinning(player2, mv));
    let playerwinningMove = possibleMoves.find(mv => isPlayerWinning(player1, mv));

    if (aiWinningMove) {
        console.log('aiWinningMove move found ' + aiWinningMove)
        return aiWinningMove;
    } else if (playerwinningMove) {
        console.log('winning move found ' + playerwinningMove)
        return playerwinningMove;
    } else if (possibleMoves.includes('B2')) { 
        return 'B2';
    } else {
        return possibleMoves[getRandomIndex(possibleMoves.length)];
    } 
}

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
    // It takes at least 3 moves to win
    if (moves.length < 3) {  
        return false;  
    }

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


