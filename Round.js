export class Round {
    constructor(hasToSend = []) {
        this.hasToSend = new Set(hasToSend),
            this.hasToVote = new Set(),
            this.cards = new Set(),
            this.voting = new Map()
    }

    computeCard = (playerId, card) => {
        const { hasToVote, hasToSend, voting } = this
        if (!(hasToSend.has(playerId))) return

        voting.set(card, { author: playerId, voters: new Set() })

        hasToSend.delete(playerId)
        hasToVote.add(playerId)
    }

    computeVote = (playerId, card) => {
        const { hasToVote, voting } = this
        if (!hasToVote.has(playerId)) return

        voting.get(card).voters.add(playerId)
        hasToVote.delete(playerId)
    }
}