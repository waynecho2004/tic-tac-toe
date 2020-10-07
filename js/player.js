class Player {
    constructor(name) {
        this.name = name;
        this.moves = [];
    }

    move(move) {
        this.moves.push(move);
    }

    getPlayerName() {
        return this.name;
    }

    getPlayerMoves() {
        return this.moves;
    }
}