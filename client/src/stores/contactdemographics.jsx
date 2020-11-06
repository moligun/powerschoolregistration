import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import ContactService from '../services/contactservice'
import Extension from './extension'
class ContactDemographics {
    firstName = ''
    lastName = ''
    employer = ''
    prefix = ''
    data
    contactId
    contactExtension
    initialPersonCoreFields = []
    constructor(data, contact) {
        this.contact = contact
        this.data = data
        this.contactExtension = new Extension('personcorefields')
        this.loadExtensionData(data)
        this.initData(data)
    }

    initData(data) {
        this.firstName = data && data.firstName ? data.firstName : ''
        this.lastName = data && data.lastName ? data.lastName : ''
        this.employer = data && data.employer ? data.employer : ''
        this.prefix = data && data.prefix ? data.prefix : ''
    }

    setValue(name, value) {
        this[name] = value
    }

    get asJSON() {
        const { firstName, lastName, employer, prefix } = this
        return {
            firstName,
            lastName,
            employer,
            prefix,
            "@extensions": "personcorefields",
            "_extension_data": {"_table_extension": [this.contactExtension.asJSON]}
        }
    }

    get personFieldsChanged() {
        return JSON.stringify(this.initialPersonCoreFields) !== JSON.stringify([...this.contactExtension.fields.values()])
    }

    get changesMade() {
        const changes = [
            this.firstName !== (this.data && this.data.firstName ? this.data.firstName : ''),
            this.lastName !== (this.data && this.data.lastName ? this.data.lastName : ''),
            this.employer !== (this.data && this.data.employer ? this.data.employer : ''),
            this.prefix !== (this.data && this.data.prefix ? this.data.prefix : ''),
            this.personFieldsChanged
        ]
        return changes.some((obj) => obj === true)
    }

    loadExtensionData(contactData) {
        if (contactData && contactData['_extension_data'] && contactData['_extension_data']['_table_extension']) {
            for (const extension of contactData['_extension_data']['_table_extension']) {
                switch (extension.name) {
                    case 'personcorefields':
                        this.initialPersonCoreFields = Object.assign([], extension['_field'])
                        this.contactExtension.loadExtensionData(extension, false)
                        break
                    default:
                        break
                }
            }
        }
    }

    update() {
        return ContactService.updateContactDemographics(this.contactId, this.asJSON)
            .then(
                action("updateContactDemographic", (response) => {
                    if (response && response.data) {
                        const { savedObject } = response.data
                        if (savedObject) {
                            this.data = savedObject
                            this.loadExtensionData(savedObject)
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
    prefix: observable,
    employer: observable,
    contactId: observable,
    personCoreFields: observable,
    contactExtension: observable,
    initData: action,
    setValue: action,
    update: action,
    loadExtensionData: action,
    asJSON: computed,
    changesMade: computed,
    personFieldsChanged: computed
})
export default ContactDemographics