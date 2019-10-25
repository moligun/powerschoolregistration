import { observable, 
        action, 
        decorate, 
        flow, 
        onBecomeObserved,
        onBecomeUnobserved
    } from "mobx"
import TicketService from "../services/ticketservice"
class UserStore {
    userRegistry = observable.map()
    totalPages = 1
    activePage = 1
    activeFilters = {}
    itemsPerPage = 100
    refreshInterval = 30000
    interval
    constructor(root) {
        this.rootStore = root
        this.ticketService = TicketService
        onBecomeObserved(this, 'userRegistry', this.resumeRegistryObserve)
        onBecomeUnobserved(this, 'userRegistry', this.cancelRegistryObserve)
    }

    updateAccess = flow(function * (userId, direction) {
        const user = this.userRegistry.get(userId)
        let originalAccess = user.access_level
        let updatedAccessNum
        if (direction === 'up') {
           updatedAccessNum = user.access_level + 1
           if (updatedAccessNum <= 2) {
               user.access_level = updatedAccessNum
           }
        } else if (direction === 'down') {
            updatedAccessNum = user.access_level - 1
            if (updatedAccessNum >= 0) {
                user.access_level = updatedAccessNum
            }
        }
        if (originalAccess !== user.access_level) {
            const response = yield this.ticketService.updateUser(user)
            const updatedUser = response.data
            if (updatedUser && updatedUser.id) {
                this.userRegistry.set(updatedUser.id, updatedUser)
            }
        }
    })

    updatePage = (pageNum) => {
        this.activePage = pageNum
        this.loadUsers()
    }

    resumeRegistryObserve = () => {
        this.loadUsers()
    }

    cancelRegistryObserve = () => {
        this.userRegistry = undefined
    }

    setPageTotal(itemCount) {
        this.totalPages = Math.ceil(itemCount / this.itemsPerPage) 
    }

    loadUsers = flow(function * () {
        const response = yield this.ticketService.allUsers(this.activeFilters, this.itemsPerPage, this.activePage)
        const users = response.data.data
        this.userRegistry = observable.map()
        this.setPageTotal(response.data.count)
        for (let index in users) {
            let currentUser = users[index]
            this.userRegistry.set(currentUser.id, currentUser)
        }
    })
}
decorate(UserStore, {
    userRegistry: observable,
    activePage: observable,
    totalPages: observable,
    activeFilters: observable,
    loadUsers: action,
    setPageTotal: action,
    updateAccess: action
})
export default UserStore