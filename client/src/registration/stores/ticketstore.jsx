import { observable, computed, action, decorate, flow } from "mobx"
import TicketService from "../services/ticketservice"
class TicketStore {
    ticketRegistry = observable.map()
    constructor(root) {
        this.rootStore = root
        this.ticketService = TicketService
    }

    getTicket(ticketId) {
        return this.ticketRegistry.get(ticketId)
    }

    loadTicket(ticketId) {
        const cachedTicket = this.getTicket(ticketId)
        if (cachedTicket) {
            return cachedTicket
        }
        return this.ticketService.getTicket(ticketId)
            .then(action(({data}) => {
                if (data !== undefined) {
                    const ticket = data
                    this.ticketRegistry.set(ticket.id, ticket)
                    return ticket
                }
            }))
    }

    loadTicketComments = flow(function * (ticket) {
        const response = yield this.ticketService.getTicketComments(ticket.id)
        const comments = response.data
        if (comments && comments.length > 0) {
            ticket.comments = comments
            this.ticketRegistry.set(ticket.id, ticket)
            return comments
        }
    })

    loadTickets = flow(function * () {
        const response = yield this.ticketService.allTickets()
        for (let index in response.data) {
            let currentTicket = response.data[index]
            let activeTicket = this.rootStore.editorStore.ticketId
            let displayEditor = this.rootStore.editorStore.displayEditor
            if (activeTicket == currentTicket.id && displayEditor) {
                const comments = yield this.loadTicketComments(currentTicket)
            } else {
                this.ticketRegistry.set(currentTicket.id, currentTicket)
            }
        }
    })

    updateTicket(data) {
        return this.ticketService.updateTicket(data)
            .then(action(({data}) => {
                this.ticketRegistry.set(data.id, data)
            }))
    }

    createTicket(data) {
        return this.ticketService.createTicket(data)
            .then(action(({data}) => {
                this.ticketRegistry.set(data.id, data)
            }))
    }

    
}
decorate(TicketStore, {
    displayModal: observable,
    ticketRegistry: observable,
    loadTickets: action,
    loadTicket: action.bound,
    updateTicket: action.bound,
    createTicket: action.bound,
    loadTicketComments: action
})
export default TicketStore