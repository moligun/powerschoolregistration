import { observable, computed, action, decorate, flow } from "mobx"
class AuthStore {
    authorized = false
    constructor(root) {
        this.rootStore = root
    }
}
decorate(AuthStore, {
    authorized: observable
})
export default AuthStore