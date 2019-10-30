const axios = require('axios')
class TicketService {
    categories(filters) {
        let config = {
            method: "GET",
            url: '/categories'
        }
        if (filters !== undefined) {
            config.params = { filters }
        }
        return axios(config)
    }

    subCategories(id) {
        const config = {
            method: "GET",
            url: `/categories/category/${id}/subcategories`
        }
        return axios(config)
    }

    updateCategory(id, data) {
        const config = {
            method: "PUT",
            url: `/categories/category/${id}`,
            data
        }
        return axios(config)
    }
    userInfo() {
        const config = {
            method: "GET",
            url: "/users/me",
            withCredentials: true
        }
        return axios(config)
    }

    studentInfo(student_id, id_type) {
        const config = {
            method: "GET",
            url: `/students/student/${student_id}/${id_type}`
        }
        return axios(config)
    }

    allUsers(filters, limit, activePage) {
        const config = {
            method: "GET",
            params: { limit, activePage, filters },
            url: '/users'
        }
        return axios(config)
    }

    allTickets(filters, limit, activePage) {
        const config = {
            method: "GET",
            params: { limit, activePage, filters },
            url: '/tickets'
        }
        return axios(config)
    }

    getTicket(ticketId) {
        const config = {
            method: "GET",
            url: `/tickets/ticket/${ticketId}`
        }
        return axios(config)
    }

    updateTicket(data) {
        const config = {
            method: "PUT",
            data,
            url: `/tickets/ticket/${data.id}`
        }
        return axios(config)
    }

    updateUser(data) {
        const config = {
            method: "PUT",
            data,
            url: `/users/user/${data.id}`
        }
        return axios(config)
    }

    createComment(data) {
        const { ticket_id } = data
        delete data.ticket_id 
        const config = {
            method: "POST",
            data,
            url: `/tickets/ticket/${ticket_id}/comment`
        }
        return axios(config)
    }

    createCategory(data) {
        const config = {
            method: "POST",
            data,
            url: "/categories/category/"
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