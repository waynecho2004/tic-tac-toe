class Player {
    constructor(name) {
        this.name = name;
        this.moves = [];
    }

    move(move) {
        this.moves.push(move);
        return this.isWinning(move);
    }

    isWinning(move) {
        return true;
    }

    getPlayerName() {
        this.name;
    }
}