export class Player {
    constructor(id, cards = []) {
        this.id = id
        this.cards = new Set(cards)
        this.blackCards = 0
    }
}