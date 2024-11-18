import { Stack } from "./Stack.js"
import { getJson } from "./utils.js"
import { Player } from './Player.js'
import { Round } from './Round.js'
import { INITIAL_N_CARDS, ANSWER_DECK, QUESTION_DECK, LAST_ROUND } from './constants.js'


export class Room {
    constructor() {
        this.players = new Map()
        this.rounds = []
        this.currentRound

        this.answerDeck = new Stack(getJson(ANSWER_DECK))
        this.questionDeck = new Stack(getJson(QUESTION_DECK))

        this.answerDeck.shuffle()
        this.questionDeck.shuffle()
    }

    getLastWinner = () => {
        const { voting } = this.rounds[this.rounds.length + LAST_ROUND]
        const mockUp = new Map()
        for (const [card, votingInfo] of voting) {
            const key = votingInfo.voters.size
            const value = [card, votingInfo.author]
            if (!mockUp.has(key)) mockUp.set(key, [])
            mockUp.get(key).push(value);
        }
        return mockUp.get(Math.max(...mockUp.keys()))
    }

    introducePlayer = (playerId) => {
        const { players, answerDeck } = this
        if (players.has(playerId)) return
        const init_cards = answerDeck.pickCards(INITIAL_N_CARDS)
        players.set(playerId, new Player(playerId, init_cards))
    }

    receiveCard = (playerId, card) => {
        const { answerDeck, currentRound, players } = this

       currentRound.computeCard(playerId, card)

        const newCard = answerDeck.pickCards(1)
        const playerCards = players.get(playerId).cards
        playerCards.delete(card)
        playerCards.add(newCard)
    }

    receiveVote = (playerId, card) => {
        this.currentRound.computeVote(playerId, card)
    }

    startNewRound = () => {
        if (this.currentRound) this.questionDeck.pop()
        const round = new Round(this.players.keys())
        this.rounds.push(round)
        this.currentRound = round
    }
}
