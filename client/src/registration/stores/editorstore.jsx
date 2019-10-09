import { observable, computed, action, decorate, flow } from "mobx"
class EditorStore {
    displayEditor = false
    ticketId = null
    commentsLoaded = false
    description = ''
    constructor(root) {
        this.rootStore = root
    }

    setTicketId(ticketId) {
        if (this.ticketId !== ticketId) {
            this.reset()
            this.ticketId = ticketId
        }
    } 

    reset() {
        this.description = ''
        this.commentsLoaded = false
    }

    loadTicketInfo = flow(function * () {
        if (!this.ticketId) {
            return
        }
        this.reset()
        const ticket = yield this.rootStore.ticketStore.loadTicket(this.ticketId)
        yield this.rootStore.ticketStore.loadTicketComments(ticket)
        this.commentsLoaded = true
        this.description = ticket.description
    })

    get comments() {
        if (this.commentsLoaded) {
            return this.rootStore.ticketStore.getTicket(this.ticketId).comments.values()
        }
    }

    submit = flow(function * () {
        const { ticketStore } = this.rootStore
        const data = {
            id: this.ticketId,
            description: this.description
        }
        const updateOrCreate = this.ticketId ? ticketStore.updateTicket(data) : ticketStore.createTicket(data)
        yield updateOrCreate
    })
}
decorate(EditorStore, {
    displayEditor: observable,
    ticketId: observable,
    description: observable,
    loadTicketInfo: action,
    reset: action,
    setTicketId: action,
    submit: action,
    comments: computed,
    commentsLoaded: observable
})
export default EditorStore