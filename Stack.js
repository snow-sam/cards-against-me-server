export class Stack {
    constructor(initialItems = []) {
        this.items = initialItems;
    }

    clear = () => this.items = []

    isEmpty = () => this.items.length === 0

    peek = () => this.isEmpty() ? "No elements in Stack" : this.items[this.items.length - 1]

    pop = () => this.isEmpty() ? "Underflow" : this.items.pop()

    pickCards = (nCards) => {
        const cards = []
        for (let i = 0; i < nCards; i++) {
            if (this.isEmpty()) break
            cards.push(this.pop())
        }
        return cards
    }

    printStack = () => console.log(this.items.join(" "));

    push = (element) => this.items.push(element)

    size = () => this.items.length

    shuffle() {
        for (let i = this.size() - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.items[i], this.items[j]] = [this.items[j], this.items[i]]; // Troca os elementos
        }
        return this
    }
}