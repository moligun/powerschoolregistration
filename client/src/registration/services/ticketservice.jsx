const axios = require('axios')
class TicketService {
    allTickets() {
        return axios('/tickets')
    }
    updateTicket(data) {
        const config = {
            method: "PUT",
            data,
            url: `/tickets/ticket/${data.id}`
        }
        return axios(config)
    }
    createTicket(data) {
        const config = {
            method: "POST",
            data,
            url: "/tickets/ticket/"
        }
        return axios(config)
    }
    getTicketComments(ticketId) {
        const config = {
            method: "GET",
            url: `tickets/ticket/${ticketId}/comments`
        }
        return axios(config)
    }
}
const ticketService = new TicketService()
export default ticketService