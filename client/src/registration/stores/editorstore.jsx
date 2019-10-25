import { observable, computed, action, decorate, flow } from "mobx"
class EditorStore {
    displayEditor = false
    displayAdmin = false
    printView = false
    ticketId = null
    loading = false
    description = ''
    studentId = ''
    title = ''
    category = ''
    subcategory = ''
    errors = {
        student: [],
        form: []
    }
    status = ''
    comment = ''
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
        this.subcategory = ''
        this.category = ''
        this.title = ''
        this.studentId = ''
        this.comment = ''
        this.errors = {
            student: [],
            form: []
        }
    }

    setCategory(categoryId) {
        this.category = categoryId
        this.subcategory = ''
    }

    setSubcategory(subcategoryId) {
        if (subcategoryId) {
            this.subcategory = subcategoryId
        }
    }
    
    get ticket() {
        return this.rootStore.ticketStore.activeTicket
    }

    get ticketInfo() {
        let ticketInfo = {}
        const { ticketStatus } = this.rootStore.ticketStore
        if (this.ticket) {
            const lastUpdated = this.ticket.last_updated ? new Date(this.ticket.last_updated) : undefined
            const created = this.ticket.created ? new Date(this.ticket.created) : undefined
            ticketInfo = {
                "ID": this.ticket.id,
                "Created": created ? created.toLocaleString('en-US', {timeZone: 'America/Indiana/Indianapolis'}) : '',
                "Category": this.ticket.category,
                "Sub-Category": this.ticket.subcategory ? this.ticket.subcategory : 'None',
                "Last Updated": lastUpdated ? lastUpdated.toLocaleString('en-US', {timeZone: 'America/Indiana/Indianapolis'}) : '',
                "Status": ticketStatus[this.ticket.status] ? ticketStatus[this.ticket.status] : ''
            }
        }
        return ticketInfo
    }

    get ticketPrintInfo() {
        let ticketInfo = {}
        if (this.ticket) {
            const created = this.ticket.created ? new Date(this.ticket.created) : undefined
            let category = this.ticket.category
            category += !this.ticket.subcategory || this.ticket.subcategory.length === 0 ? '' : ` - ${this.ticket.subcategory}`
            ticketInfo = {
                "Ticket ID": this.ticket.id,
                "Category": category,
                "Created": created ? created.toLocaleString('en-US', {timeZone: 'America/Indiana/Indianapolis'}) : '',
                "Student Name": this.ticket.studentname,
                "Student Number": this.ticket.studentnumber,
                "Device ID": this.ticket.device_id
            }
        }
        return ticketInfo
    }

    get studentInfo() {
        let studentInfo = {}
        if (this.student) {
            studentInfo = {
                "Name": this.student.lastfirst,
                "Student ID": this.student.student_number,
                "Device ID": this.student.device_id,
            }
            return studentInfo
        }
        return undefined
    }

    get comments() {
        if (this.ticket) {
            return this.ticket.comments
        }
        return []
    }

    get student() {
        if (this.rootStore.studentStore.studentId > 0) {
            return this.rootStore.studentStore.student
        }
        return undefined
    }

    get commentData() {
        const { authStore } = this.rootStore
        const data = {
            "ticket_id": this.ticketId,
            "comment": this.comment,
            "status": this.status ? this.status : null,
            "created_by": authStore.userInfo ? authStore.userInfo.id : undefined
        }
        return data
    }

    get ticketData() {
        const data = {
            "id": this.ticketId,
            "description": this.description,
            "title": this.title,
            "category_id": this.category,
            "subcategory_id": this.subcategory,
            "student_id": this.student ? this.student.id : undefined,
            "device_id": this.student ? this.student.device_id : undefined
        }
        return data
    }

    validateComments() {
        this.errors.form = []
        const requiredFields = {
            "ticket_id": "Comments must have a ticket ID associated", 
            "comment": "Must Provide a Comment",
            "created_by": "Must Be Logged In to Submit",
        }
        const data = this.commentData
        for (let field in requiredFields) {
            if (!data[field] || data[field].length === 0) {
                this.errors.form.push(requiredFields[field])
            }
        }

        if (this.errors.form.length > 0) {
            return false
        }
        return data
    }

    validateFields() {
        this.errors.form = []
        const requiredFields = {
            "description": "Must Provide Description", 
            "title": "Must Provide a Title",
            "category_id": "Must Select a Category",
            "student_id": "Must Select a Student"
        }
        const data = this.ticketData
        for (let field in requiredFields) {
            if (!data[field] || data[field].length === 0) {
                this.errors.form.push(requiredFields[field])
            }
        }

        if (this.errors.form.length > 0) {
            return false
        }
        return data
    }

    addComment = flow(function * (data) {
        const { ticketStore } = this.rootStore
        this.loading = true
        yield ticketStore.addComment(data)
    })

    submit = flow(function * (data) {
        const { ticketStore } = this.rootStore
        let result
        if (this.ticketId) {
            result = yield ticketStore.updateTicket(data)
        } else {
            result = yield ticketStore.createTicket(data)
            if (result.id && result.id > 0) {
                this.setTicketId(result.id)
                this.printView = true
                this.displayEditor = false
            }
        }
    })
}
decorate(EditorStore, {
    status: observable,
    displayEditor: observable,
    displayAdmin: observable,
    ticketId: observable,
    description: observable,
    comment: observable,
    printView: observable,
    reset: action,
    setTicketId: action,
    submit: action,
    addComment: action,
    comments: computed,
    ticket: computed,
    ticketInfo: computed,
    studentId: observable,
    errors: observable,
    loading: observable,
    category: observable,
    subcategory: observable,
    setCategory: action,
    setSubcategory: action,
    student: computed,
    studentInfo: computed,
    ticketData: computed,
    commentData: computed,
    ticketPrintInfo: computed,
    title: observable
})
export default EditorStore