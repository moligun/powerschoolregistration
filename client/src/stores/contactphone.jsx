import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import Validation from "./validation"
import ContactService from '../services/contactservice'
import Contact from "./contact"
class ContactPhone {
    sequence
    preferred = false
    deleted = false
    markedForDeletion = false
    phoneType = ""
    contactsPhoneId = 0
    contactId = 0
    phoneNumber = ''
    validation
    validationRules = [
        {"name": "phoneNumber", "rules": ["phone", "required"]}
    ]
    sms = false
    data
    constructor(phoneObj, contactId, markedForDeletion) {
        this.contactId = contactId
        if (markedForDeletion === true) {
            this.markedForDeletion = true
        }
        this.setServerData(phoneObj)
        this.validation = new Validation(this.validationRules)
        this.initData()
    }

    setServerData(data) {
        if (data) {
            if (!data.phoneType || data.phoneType === null) {
                data.phoneType = ""
            }
        } else {
            data = {}
        }
        console.log(data)
        this.data = data
    }

    initData() {
        for (const key in this.data) {
            if (key in this) {
                this[key] = this.data[key] !== undefined ? this.data[key] : ""
            }
        }
        const { phoneNumber } = this
        this.validation.validateAll({phoneNumber})
    }

    setValue(name, value) {
        this[name] = value
    }

    update() {
        if (this.contactsPhoneId > 0) {
            if (this.markedForDeletion === true) {
                return ContactService.deleteContactPhone(this.contactId, this.contactsPhoneId)
                    .then(
                        action("deletePhoneSuccess", (response) => {
                            this.markedForDeletion = false
                            this.deleted = true
                        })
                    )
            } else {
                return ContactService.updateContactPhone(this.contactId, this.contactsPhoneId, this.asJSON)
                    .then(
                        action("updatePhoneSuccess", (response) => {
                            const { savedObject } = response.data
                            this.setServerData(savedObject)
                        })
                    )
            }
        } else {
            return ContactService.addContactPhone(this.contactId, this.asJSON)
                .then(
                    action("addPhoneSuccess", (response) => {
                        const { savedObject } = response.data
                        if (savedObject.contactsPhoneId > 0) {
                            this.setServerData(savedObject)
                            this.contactsPhoneId = savedObject.contactsPhoneId
                        }
                    })
                )
        }
    }

    get changesMade() {
        if (!this.contactsPhoneId) {
            return true
        }

        if (this.markedForDeletion === true) {
            return true
        }

        const changes = [
            this.phoneType !== this.data.phoneType,
            this.phoneNumber !== this.data.phoneNumber
        ]
        return changes.some((obj) => obj === true) || !this.contactsPhoneId
    }

    get asJSON() {
        const { sequence, preferred, phoneType, contactsPhoneId, phoneNumber, sms } = this
        return {
            phoneType,
            contactsPhoneId,
            preferred,
            sequence,
            phoneNumber,
            sms
        }
    }
}

decorate(ContactPhone, {
    phoneNumber: observable,
    sms: observable,
    contactsPhoneId: observable,
    sequence: observable,
    preferred: observable,
    phoneType: observable,
    validation: observable,
    deleted: observable,
    markedForDeletion: observable,
    setValue: action,
    update: action,
    setServerData: action,
    asJSON: computed,
    changesMade: computed
})
export default ContactPhone