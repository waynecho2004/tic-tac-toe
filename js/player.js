class Player {
    constructor(id, name) 
    {
        this.id = id;
        this.name = name;
        this.moves = [];
    }

    /**
     * Update the moves player being made
     * @param {*} move 
     */
    move(move) {
        this.moves.push(move);
    }

    /**
     * Get player's name
     */
    getPlayerName() {
        return this.name;
    }

    /**
     * Get all the moves player being made
     */
    getPlayerMoves() {
        return this.moves;
    }
}