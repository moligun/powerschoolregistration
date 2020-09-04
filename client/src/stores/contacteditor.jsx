import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import ContactPhone from "./contactphone"
import ContactStudent from "./contactstudent"
import ContactDemographic from './contactdemographics'
import ContactEmail from "./contactemail"
import ContactDemographics from "./contactdemographics"
import Validation from "./validation"
class ContactEditorStore {
    phones = observable.array()
    contactDemographics
    activeContactStudent
    validation
    validationRules = [
        {"name": "phoneCount", "rules": ["atLeast"], "comparisonValue": 1, "label": "Phone Number"},
        {"name": "contactDemographics.firstName", "rules": ["required"]},
        {"name": "contactDemographics.lastName", "rules": ["required"]}
    ]
    email
    display = false
    activeContactId = undefined
    relationshipOptions= [
        {"label": "Aunt", "value": "Aunt"},
        {"label": "Brother", "value": "Brother"},
        {"label": "Father", "value": "Father"},
        {"label": "Friend", "value": "Friend"},
        {"label": "Grandfather", "value": "Grandfather"},
        {"label": "Grandmother", "value": "Grandmother"},
        {"label": "Mother", "value": "Mother"},
        {"label": "Neighbor", "value": "Neighbor"},
        {"label": "Other", "value": "Other"},
        {"label": "Sister", "value": "Sister"},
        {"label": "Uncle", "value": "Uncle"},
        {"label": "Stepfather", "value": "Stepfather"},
        {"label": "Stepmother", "value": "Stepmother"},
        {"label": "Guardian", "value": "Guardian"},
        {"label": "Babysitter", "value": "Babysitter"},
        {"label": "Day Care", "value": "Day Care"}
    ]

    constructor(root) {
        this.rootStore = root
        this.validation = new Validation(this.validationRules)
    }

    loadContactInfo() {
        this.phones = observable.array()
        this.activeContactStudent = new ContactStudent()
        this.contactDemographics = new ContactDemographics()
        this.email = new ContactEmail()
        if (this.contact) {
            if (this.contact.phones && this.contact.phones.length > 0) {
                for (const phone of this.contact.phones) {
                    this.phones.push(new ContactPhone(phone.asJSON))
                }
            }

            if (this.contact.activeContactStudent) {
                this.activeContactStudent.initData(this.contact.activeContactStudent.asJSON)
            }

            if (this.contact.contactDemographics) {
                this.contactDemographics.initData(this.contact.contactDemographics.asJSON)
            }
            if (this.contact.email) {
                this.email.initData(this.contact.email.asJSON)
            }
        }
        this.validation.validateAll({"phoneCount": this.validatedPhones.length, "contactDemographics": this.contactDemographics})
    }

    setContactId(contactId) {
        this.activeContactId = contactId
    }

    get contact() {
        if (this.activeContactId >= 0) {
            return this.rootStore.contactsStore.contacts[parseInt(this.activeContactId)]
        }
        return undefined
    }

    resetDefault() {
        this.contactDemographics = new ContactDemographic()
        this.email = new ContactEmail()
        this.activeContactStudent = undefined
    }

    setValue(collection, name, value, index) {
        if (index === undefined) {
            this.validation.validate(`${collection}.${name}`, value)
            this[collection].setValue(name, value)
        } else {
            this[collection][index].validation.validate(name, value)
            if (collection === 'phones') {
                this.validation.validate("phoneCount", this.validatedPhones.length)
            }
            this[collection][index].setValue(name, value)
        }
    }

    submit() {
        const { highestSequenceNumber } = this.rootStore.contactsStore
        if (this.validation.allValidated) {
            this.contact.phones = this.phones
            this.contact.contactDemographics.initData(this.contactDemographics.asJSON)
            this.contact.email.initData(this.email.asJSON)
            if (this.contact.activeContactStudent) {
                console.log('there is a contact....so that not it')
            }
            this.contact.activeContactStudent.setStudentDetails(this.activeContactStudent)
            this.contact.activeContactStudent.sequence = highestSequenceNumber
            this.contact.refreshValidation()
            this.display = false
            this.resetDefault()
        }
    }

    addPhone() {
        this.phones.push(new ContactPhone())
    }

    deletePhone(index) {
        this.phones.splice(index, 1)
    }

    get validatedPhones() {
        let validatedPhones = []
        if (this.phones) {
            for (const phone of this.phones) {
                if (phone.validation.allValidated === true) {
                    validatedPhones.push(phone)
                }
            }
        }
        return validatedPhones
    }
}

decorate(ContactEditorStore, {
    display: observable,
    activeContactId: observable,
    phones: observable,
    contactDemographics: observable,
    activeContactStudent: observable,
    email: observable,
    loadContactInfo: action,
    setContactId: action,
    resetDefault: action,
    setValue: action,
    submit: action,
    addPhone: action,
    deletePhone: action,
    contact: computed,
    validatedPhones: computed
})
export default ContactEditorStore