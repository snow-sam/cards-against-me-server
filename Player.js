class Player {
    constructor(id, cards = []) {
        this.id = id
        this.cards = cards
        this.blackCards = 0
    }

    changeCard = (oldCard, newCard) => {
        this.cards = [...this.cards, ...newCard].filter(item => item !== oldCard)
    }

    win = () => this.blackCards++
}