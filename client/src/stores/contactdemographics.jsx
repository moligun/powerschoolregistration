import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import ContactService from '../services/contactservice'
class ContactDemographics {
    firstName = ''
    lastName = ''
    data
    contactId
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

    get changesMade() {
        const changes = [
            this.firstName !== (this.data && this.data.firstName ? this.data.firstName : ''),
            this.lastName !== (this.data && this.data.lastName ? this.data.lastName : '')
        ]
        return changes.some((obj) => obj === true)
    }

    update() {
        return ContactService.updateContactDemographics(this.contactId, this.asJSON)
            .then(
                action("updateContactDemographic", (response) => {
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
                    return ["Generic Issue updating contact name"]
                })
            )
    }
}
decorate(ContactDemographics, {
    firstName: observable,
    lastName: observable,
    contactId: observable,
    initData: action,
    setValue: action,
    update: action,
    asJSON: computed,
    changesMade: computed
})
export default ContactDemographics