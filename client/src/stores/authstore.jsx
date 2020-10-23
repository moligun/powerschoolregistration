import { 
        observable, 
        computed,
        action, 
        decorate, 
        flow, 
        onBecomeObserved,
        onBecomeUnobserved
    } from "mobx"
import StudentService from "../services/studentservice"
class AuthStore {
    userInfo
    interval
    loading = true
    constructor(root) {
        this.rootStore = root
        this.studentService = StudentService
        onBecomeObserved(this, 'userInfo', this.resumeObserve)
        onBecomeUnobserved(this, 'userInfo', this.stopObserve)
    }

    resumeObserve = () => {
        this.loadUserInfo()
    }

    stopObserve = () => {
        this.userInfo = undefined
    }

    get authorized() {
        if (this.userInfo && parseInt(this.userInfo.dcid) > 0) {
            return true
        }
        return true
    }

    loadUserInfo = flow(function * () {
        try {
            const userInfo = yield this.studentService.userInfo()
            if (userInfo.data && userInfo.data.dcid) {
                this.userInfo = userInfo.data
                console.log(this.userInfo)
            } else {
                console.log('undefined')
                this.userInfo = undefined
            }
        } catch(error) {
            console.log(error)
        } finally {
            this.loading = false
        }

    })
}
decorate(AuthStore, {
    authorized: computed,
    userInfo: observable,
    loading: observable,
    loadUserInfo: action
})
export default AuthStore