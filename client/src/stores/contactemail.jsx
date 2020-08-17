import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
class ContactEmail {
    address = ""
    contactEmailId = ""
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
    initData: action,
    setValue: action,
    asJSON: computed
})
export default ContactEmail