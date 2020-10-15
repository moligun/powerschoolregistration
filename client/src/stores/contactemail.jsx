import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
class ContactEmail {
    address = ""
    contactEmailId = ""
    contactId
    data
    constructor(emailObj) {
        this.data = emailObj
        if (emailObj) {
            this.initData(emailObj)
        }
    }

    initData(emailObj) {
        for (const key in emailObj) {
            if (key in this) {
                this[key] = emailObj[key] ? emailObj[key] : ""
            }
        }
    }

    setValue(name, value) {
        this[name] = value
    }

    update() {
        if (this.contactEmailId > 0) {
            return `/ws/contacts/${this.contactId}/emails/${this.contactEmailId}`
        } else {
            return `/ws/contacts/${this.contactId}/emails`
        }
    }

    get changesMade() {
        /*
        const changes = [
            this.address !== this.data.address
        ]
        return changes.some((obj) => obj === true) || !this.contactEmailId
        */
       return false
    }

    get asJSON() {
        const { address, contactEmailId } = this
        return {
            address,
            contactEmailId
        }
    }
}

decorate(ContactEmail, {
    address: observable,
    contactEmailId: observable,
    contactId: observable,
    initData: action,
    setValue: action,
    asJSON: computed,
    changesMade: computed
})
export default ContactEmail