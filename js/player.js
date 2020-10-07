class Player {
    constructor(name) {
        this.name = name;
        this.moves = [];
    }

    move(move) {
        this.moves.push(move);
    }

    getPlayerName() {
        this.name;
    }
}