import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import Validation from "./validation"
import ContactService from '../services/contactservice'
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
                            if (response && response.data) {
                                if (response.data.action === "DELETE" && response.data.status === "SUCCESS") {
                                    this.markedForDeletion = false
                                    this.deleted = true
                                    return false
                                } else {
                                    if (response.data.error_message.error) {
                                        return response.data.error_message.error
                                    }
                                }
                            }
                            return ["Issues deleting phone"]
                        })
                    )
            } else {
                return ContactService.updateContactPhone(this.contactId, this.contactsPhoneId, this.asJSON)
                    .then(
                        action("updatePhoneSuccess", (response) => {
                            if (response && response.data) {
                                if (response.data.savedObject) {
                                    const { savedObject } = response.data
                                    this.setServerData(savedObject)
                                    return false
                                } else if (response.data.error_message) {
                                    if (response.data.error_message.error) {
                                        return response.data.error_message.error
                                    }
                                }
                            } else {
                                return ["Generic Issue updating contact phone."]
                            }
                        })
                    )
            }
        } else {
            return ContactService.addContactPhone(this.contactId, this.asJSON)
                .then(
                    action("addPhoneSuccess", (response) => {
                        if (response && response.data) {
                            const { savedObject } = response.data
                            if (savedObject && savedObject.contactsPhoneId > 0) {
                                this.setServerData(savedObject)
                                this.contactsPhoneId = savedObject.contactsPhoneId
                                return false
                            } else if (response.data.error_message) {
                                if (response.data.error_message.error) {
                                    return response.data.error_message.error
                                }
                            }

                        }
                        return ["Generic Cannot Add Phone Message"]
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