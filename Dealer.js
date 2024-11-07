import { Player } from './Player.js'
import { INITIAL_N_CARDS } from './constants.js'


export class Dealer {
    constructor(room) {
        this.room = room
    }

    dealCards = (nCards) => {
        const { answerDeck } = this.room
        return answerDeck.pickCards(nCards)
    }

    introducePlayer = (playerId) => {
        if(this.room.players.some(player => player.id === playerId)) return
        const player = new Player(
            playerId,
            this.dealCards(INITIAL_N_CARDS)
        )
        this.room.players.push(player)
    }

    showCards = (playerId) => {
        const player = this.room.players.find(player => player.id === playerId);
        return player.cards
    }
}