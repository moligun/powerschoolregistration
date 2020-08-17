import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
class ContactDemographics {
    firstName = ''
    lastName = ''
    data
    constructor(data) {
        this.data = data
        this.initData(this.data)
    }

    initData(data) {
        this.firstName = data && data.firstName ? data.firstName : ''
        this.lastName = data && data.lastName ? data.lastName : ''
    }

    setValue(name, value) {
        this[name] = value
    }

    get asJSON() {
        const { firstName, lastName } = this
        return {
            firstName,
            lastName
        }
    }
}

decorate(ContactDemographics, {
    firstName: observable,
    lastName: observable,
    initData: action,
    setValue: action,
    asJSON: computed
})
export default ContactDemographics