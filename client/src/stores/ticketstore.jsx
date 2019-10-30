import { observable, 
        action, 
        decorate, 
        flow, 
        onBecomeObserved,
        onBecomeUnobserved,
        computed,
        runInAction
    } from "mobx"
import TicketService from "../services/ticketservice"
class TicketStore {
    ticketRegistry = observable.map()
    activeTicket
    totalRecords
    activeFilters = observable.map()
    activeTicketId
    showFilters = false
    loadingFile = false
    totalPages = 1
    activePage = 1
    itemsPerPage = 50
    refreshInterval = 30000
    timers = []
    interval
    ticketStatus = {
        'OPEN' : 'Open',
        'WIP' : 'In Progress',
        'CLOSED': 'Closed'
    }
    constructor(root) {
        this.rootStore = root
        this.ticketService = TicketService
        this.setInitialFilters()
        onBecomeObserved(this, 'activeTicket', this.resumeActiveObserve)
        onBecomeUnobserved(this, 'activeTicket', this.cancelActiveObserve)
        onBecomeObserved(this, 'ticketRegistry', this.resumeRegistryObserve)
        onBecomeUnobserved(this, 'ticketRegistry', this.cancelRegistryObserve)
    }

    updatePage = (pageNum) => {
        this.activePage = pageNum
        this.loadTickets()
    }

    updateItemsPerPage = (pageCount) => {
        this.itemsPerPage = pageCount
        this.activePage = 1
        this.loadTickets()
    }

    resumeActiveObserve = () => {
        this.loadTicket()
        this.interval = setInterval(
            () => this.loadTicket(),
            this.refreshInterval
        )
    }

    cancelActiveObserve = () => {
        this.activeTicket = undefined
        clearInterval(this.interval)
    }

    resumeRegistryObserve = () => {
        this.loadTickets()
    }

    cancelRegistryObserve = () => {
        this.ticketRegistry = undefined
        clearTimeout(this.timers['tickets'])
    }

    setInitialFilters() {
        this.activeFilters.set('category_id', '')
        this.activeFilters.set('subcategory_id', '')
        this.activeFilters.set('search', '')
        this.activeFilters.set('daterange', {})
        this.activeFilters.set('status', ['WIP', 'OPEN'])
    }

    get filterStatus() {
        return this.activeFilters.get('status')
    }

    get filterSearch() {
        return this.activeFilters.get('search')
    }

    get filterCategory() {
        return this.activeFilters.get('category_id')
    }

    get filterSubcategory() {
        return this.activeFilters.get('subcategory_id')
    }

    get filterStartDate() {
        const dateRange = this.activeFilters.get('daterange')
        const startdate = dateRange.startdate !== undefined ? dateRange.startdate : ''
        return startdate
    }

    get filterEndDate() {
        const dateRange = this.activeFilters.get('daterange')
        const enddate = dateRange.enddate !== undefined ? dateRange.enddate : ''
        return enddate
    }

    setFilters(name, value) {
        this.activeFilters.set(name, value)
    }


    setTimer(timer) {
        if (this.timers && this.timers[timer] !== undefined) {
            clearTimeout(this.timers[timer])
        }
        this.timers[timer] = setTimeout((function(self){
        return () => {
            self.loadTickets()
        }
        })(this), this.refreshInterval)
    }

    loadTicket = flow(function * () {
        const ticketId = this.rootStore.editorStore.ticketId
        const ticketResponse = yield this.ticketService.getTicket(ticketId)
        const ticket = ticketResponse.data
        let comments = []
        if (ticket && ticket.id !== undefined) {
            this.rootStore.studentStore.studentIdType = 'id'
            this.rootStore.studentStore.studentId = ticket.student_id
            if (this.rootStore.authStore.authorized) {
                const commentResponse = yield this.ticketService.getTicketComments(ticket.id)
                comments = commentResponse.data.data
                ticket.comments = comments
            }
            this.activeTicket = ticket
        }
        this.rootStore.editorStore.loading = false
    })

    addCsvRow(values) {
        let csvString = ''
        for (const value of values) {
            let cleanedValue = value
            cleanedValue = typeof cleanedValue === 'number' ? cleanedValue.toString() : cleanedValue
            cleanedValue = !cleanedValue ? '' : cleanedValue
            cleanedValue = cleanedValue && cleanedValue.includes('"') ? cleanedValue.replace(/"/g, '\""') : cleanedValue
            cleanedValue = '"' + cleanedValue + '"'
            csvString += csvString.length > 0 ? ',' + cleanedValue : cleanedValue
        }
        return csvString + '\r\n'
    }

    getCsvString() {
        this.loadingFile = true
        const itemsPerPage = 1
        const totalPages = Math.ceil(this.totalRecords / itemsPerPage)
        const promises = []
        for (const num of Array(totalPages).keys()) {
            let pageNum = num + 1
            let promise = this.ticketService.allTickets(this.activeFilters, itemsPerPage, pageNum)
                .then((response) => { 
                        return response.data.data
                })
            promises.push(promise)
        }
        return Promise.all(promises)
            .then((pages) => {
                const firstItem = pages[0].shift()
                let csvString = this.addCsvRow(Object.keys(firstItem))
                csvString += this.addCsvRow(Object.values(firstItem))
                for (const page of pages) {
                    for (const item of page) {
                        csvString += this.addCsvRow(Object.values(item))                        
                    }
                }
                runInAction(() => {
                    this.loadingFile = false
                })
                return csvString
            })
    }

    setPageTotal(itemCount) {
        this.totalRecords = itemCount
        this.totalPages = Math.ceil(itemCount / this.itemsPerPage) 
    }

    loadTickets = flow(function * () {
        this.setTimer('tickets')
        const response = yield this.ticketService.allTickets(this.activeFilters, this.itemsPerPage, this.activePage)
        const tickets = response.data.data
        this.ticketRegistry = observable.map()
        this.setPageTotal(response.data.count)
        for (let index in tickets) {
            let currentTicket = tickets[index]
            this.ticketRegistry.set(currentTicket.id, currentTicket)
        }
    })

    updateTicket(data) {
        return this.ticketService.updateTicket(data)
    }

    createTicket(data) {
        return this.ticketService.createTicket(data)
    }

    addComment(data) {
        return this.ticketService.createComment(data)
            .then(action(({data}) => {
                this.loadTicket()
            }))
    }

    
}
decorate(TicketStore, {
    displayModal: observable,
    ticketRegistry: observable,
    activeTicket: observable,
    activeTicketId: observable,
    activePage: observable,
    totalPages: observable,
    activeFilters: observable,
    showFilters: observable,
    itemsPerPage: observable,
    totalRecords: observable,
    loadingFile: observable,
    loadTickets: action,
    loadTicket: action,
    updatePage: action,
    getCsvString: action,
    updateItemsPerPage: action,
    updateTicket: action.bound,
    createTicket: action.bound,
    addComment: action.bound,
    setPageTotal: action,
    setFilters: action,
    setInitialFilters: action,
    filterStatus: computed,
    filterCategory: computed,
    filterSubcategory: computed,
    filterStartDate: computed,
    filterEndDate: computed
})
export default TicketStore