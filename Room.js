import { Stack } from "./Stack.js"
import { getJson } from "./utils.js"


// Create Room & Load Cards
// const room = new Room()
// await room.init("./mocks/answers.json", "./mocks/questions.json")
export class Room {
    constructor() {
        this.players = []
        this.rounds = []
    }

    #loadCards = (arq, isQuestionCards = true) => {
        const cards = new Stack(getJson(arq))
        isQuestionCards ? this.questionDeck = cards : this.answerDeck = cards
    }

    init = (arqAnswer, arqQuestion) => {
        this.#loadCards(arqAnswer, false)
        this.#loadCards(arqQuestion, true)
        this.answerDeck.shuffle()
        this.questionDeck.shuffle()
    }
}
