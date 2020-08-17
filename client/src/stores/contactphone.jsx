import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import Validation from "./validation"
class ContactPhone {
    sequence
    preferred = false
    phoneType = ""
    phoneNumberId = 0
    phoneNumber = ''
    validation
    validationRules = [
        {"name": "phoneNumber", "rules": ["phone", "required"]}
    ]
    sms = false
    data
    constructor(phoneObj) {
        this.data = phoneObj
        this.validation = new Validation(this.validationRules)
        this.initData()
    }

    initData() {
        for (const key in this.data) {
            if (key in this) {
                this[key] = this.data[key] ? this.data[key] : ""
            }
        }
        const { phoneNumber } = this
        this.validation.validateAll({phoneNumber})
    }

    setValue(name, value) {
        this[name] = value
    }

    get asJSON() {
        const { sequence, preferred, phoneType, phoneNumberId, phoneNumber, sms } = this
        return {
            phoneType,
            phoneNumberId,
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
    phoneNumberId: observable,
    sequence: observable,
    preferred: observable,
    phoneType: observable,
    validation: observable,
    setValue: action,
    asJSON: computed
})
export default ContactPhone