import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import ContactService from '../services/contactservice'
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
            return ContactService.updateContactEmail(this.contactId, this.contactEmailId, this.asJSON)
                .then(
                    action("updateContactEmail", (response) => {
                        if (response && response.data) {
                            const { savedObject } = response.data
                            if (savedObject) {
                                this.data = savedObject
                                return false
                            } else if (response.data.error_message) {
                                if (response.data.error_message.error) {
                                    return response.data.error_message.error
                                }
                            }
                        }
                        return ["Generic Issue updating contact email"]
                    })
                )
        } else {
            return ContactService.addContactEmail(this.contactId, this.asJSON)
                .then(
                    action("addContactEmail", (response) => {
                        if (response && response.data) {
                            const { savedObject } = response.data
                            if (savedObject) {
                                this.data = savedObject
                                return false
                            } else if (response.data.error_message) {
                                if (response.data.error_message.error) {
                                    return response.data.error_message.error
                                }
                            }
                        }
                        return ["Generic Issue adding contact email"]
                    })
                )
        }
    }

    get changesMade() {
        const changes = [
            this.address !== (this.data && this.data.address ? this.data.address : '')
        ]
        return changes.some((obj) => obj === true) || !this.contactEmailId
    }

    get asJSON() {
        const { address } = this
        return {
            address
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