# Tic Tac Toe

## Description:

This is a simple game of Tic Tac Toe, with you as the player (dog), plays against the AI (cat).  Click on any empty boxes to start the game.  Player always go first.   You can click on 'Play Again' button to restart/reset a game.

## Technology:
- HTML, CSS, Javascript

## User Stories:

- As a user, I should be able to start a new tic tac toe game
- As a user, I should be able to click on a square to add X first and then O, and so on
- As a user, I should be shown a message after each turn for if I win, lose, tie or who's turn it is next
- As a user, I should not be able to click the same square twice
- As a user, I should be shown a message when I win, lose or tie
- As a user, I should not be able to continue playing once I win, lose, or tie
- As a user, I should be able to play the game again without refreshing the page
- A scoreboard keeping track of multiple game rounds with a win, lose and tie counter
- An AI component that can make intelligent move automatically
- An audio sound when player makes a move
- The X is replacing with dog token, and O with cat token to make it attractive to users - kids

## Strategy:
- Keep it simple
- Focus on MVP
- Refactor to prevent repeating myself
- Work on extra features once MVP is complete and fully tested

## Development Process

1. Create a simple 3x3 board in the middle of the page using CSS Grid and Flexbox design, which also makes the page fully responsive.
2. Give each box an unique id/key - A1, A2, A3, B1, B2, B3, etc
3. Create a map with all the winning pattern for each id/key
4. Create a class of Player with attributes - name, id, moves.  The main function is the keep track of the moves the player makes
5. Create a eventListener and callback for click event on the boxes
6. Create winning logic
7. Create AI logic
8. Add extra features and styling

## Winning Logic

1. A map contains the patterns to win for each move
```javascript
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
```

2. For each move, the logic will loop through winning patterns for that move.  And for each winning pattern, if two matching moves are found, return true

```javascript
function isPlayerWinning(player, move) {
    …
    winningPatterns = winningMap.get(move);
    
    winningPatterns.forEach(winningPattern => {

        if (containWinningMatch(winningPattern, player.getPlayerMoves())) {

            isWinning = true;
        }
    });
    
    return isWinning;
}

function containWinningMatch(winningPattern, moves) {
    let matchingCount = 0;
    winningPattern.forEach(move => {
        if(moves.includes(move)) {
            matchingCount += 1;
        }
    })

    return matchingCount == 2;
}
```


## Favorite Function - AI Logic
*It originally starts out with just randomly selecting an empty box.  Then the users - my 6 years old son and his 8 years old friend - play it and find the AI too dumb to play against.  So I added step 1-3 below to make it more chanllenging.  Now my users are happy*:grinning:
1. Find AI winning move
2. Find opponent's winning move
3. Select 'B2' for better chance to win
4. Select a random move

```javascript
function automateMove() {
    
    let possibleMoves = allMoves.filter(mv => !moves.includes(mv));
    let aiWinningMove = possibleMoves.find(mv => isPlayerWinning(player2, mv));
    let playerwinningMove = possibleMoves.find(mv => isPlayerWinning(player1, mv));

    if (aiWinningMove) {
        return aiWinningMove;
    } else if (playerwinningMove) {
        return playerwinningMove;
    } else if (possibleMoves.includes('B2')) { 
        return 'B2';
    } else {
        return possibleMoves[getRandomIndex(possibleMoves.length)];
    } 
}
```