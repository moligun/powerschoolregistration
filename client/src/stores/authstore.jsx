import { 
        observable, 
        computed,
        action, 
        decorate, 
        flow, 
        onBecomeObserved,
        onBecomeUnobserved
    } from "mobx"
import TicketService from "../services/ticketservice"
class AuthStore {
    userInfo
    interval
    constructor(root) {
        this.rootStore = root
        this.ticketService = TicketService
        onBecomeObserved(this, 'userInfo', this.resumeObserve)
        onBecomeUnobserved(this, 'userInfo', this.stopObserve)
    }

    resumeObserve = () => {
        this.loadUserInfo()
        this.interval = setInterval(
            () => this.loadUserInfo(),
            30000
        )
    }

    stopObserve = () => {
        this.userInfo = undefined
        clearInterval(this.interval)
    }

    get isAdmin() {
        if (this.userInfo && parseInt(this.userInfo.access_level) === 2) {
            return true
        }
        return false
    }

    get authorized() {
        if (this.userInfo && parseInt(this.userInfo.access_level) > 0) {
            return true
        }
        return false
    }

    loadUserInfo = flow(function * () {
        const userInfo = yield this.ticketService.userInfo()
        if (userInfo.data && userInfo.data.id) {
            this.userInfo = userInfo.data
        } else {
            this.userInfo = undefined
        } 
    })
}
decorate(AuthStore, {
    authorized: computed,
    isAdmin: computed,
    userInfo: observable,
    loadUserInfo: action
})
export default AuthStore