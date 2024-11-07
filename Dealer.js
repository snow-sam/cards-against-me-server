import { Player } from './Player.js'
import { INITIAL_N_CARDS } from './constants.js'


export class Dealer {
    constructor(room) {
        this.room = room
    }

    dealCards = (nCards) => {
        const { questionDeck } = this.room
        return questionDeck.pickCards(nCards)
    }

    introducePlayer = (playerId) => {
        const player = new Player(
            playerId,
            this.dealCards(INITIAL_N_CARDS)
        )
        this.room.players.add(player)
    }
}