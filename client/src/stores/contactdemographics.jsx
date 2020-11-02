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
    employer = ''
    data
    contactId
    constructor(data) {
        this.data = data
        this.initData(this.data)
    }

    initData(data) {
        this.firstName = data && data.firstName ? data.firstName : ''
        this.lastName = data && data.lastName ? data.lastName : ''
        this.employer = data && data.employer ? data.employer : ''
    }

    setValue(name, value) {
        this[name] = value
    }

    get asJSON() {
        const { firstName, lastName, employer } = this
        return {
            firstName,
            lastName,
            employer
        }
    }

    get changesMade() {
        const changes = [
            this.firstName !== (this.data && this.data.firstName ? this.data.firstName : ''),
            this.lastName !== (this.data && this.data.lastName ? this.data.lastName : ''),
            this.employer !== (this.data && this.data.employer ? this.data.employer : '')
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
    employer: observable,
    contactId: observable,
    initData: action,
    setValue: action,
    update: action,
    asJSON: computed,
    changesMade: computed
})
export default ContactDemographics