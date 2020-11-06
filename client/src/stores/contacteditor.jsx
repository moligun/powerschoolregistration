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
import Extension from "./extension"
class ContactEditorStore {
    phones = observable.array()
    contactDemographics
    contactExtension
    activeContactStudent
    editValid = false
    validation
    validationRules = [
        {"name": "phoneCount", "rules": ["atLeast"], "comparisonValue": 1, "label": "Phone Number"},
        {"name": "contactDemographics.firstName", "rules": ["required"]},
        {"name": "contactDemographics.lastName", "rules": ["required"]},
        {"name": "contactExtension.needsinterpreterassist", "rules": ["required"]},
        {"name": "activeContactStudent.emergency", "rules": ["required"]},
        {"name": "activeContactStudent.custodial", "rules": ["required"]},
        {"name": "activeContactStudent.schoolPickup", "rules": ["required"]},
        {"name": "activeContactStudent.custodial", "rules": ["required"]},
        {"name": "activeContactStudent.livesWith", "rules": ["required"]},
        {"name": "activeContactStudent.relationship", "rules": ["required", "notEqual"], "comparisonValue": "Not Set", "label": "Required"}
    ]
    email
    display = false
    activeContactId = undefined
    titleOptions = [
        {"label": "Ms.", "value": "Ms."},
        {"label": "Mr.", "value": "Mr."},
        {"label": "Mrs.", "value": "Mrs."}

    ]
    relationshipOptions= [
        {"label": "Aunt", "value": "Aunt"},
        {"label": "Babysitter", "value": "Babysitter"},
        {"label": "Brother", "value": "Brother"},
        {"label": "Day Care", "value": "Day Care"},
        {"label": "Father", "value": "Father"},
        {"label": "Friend", "value": "Friend"},
        {"label": "Grandfather", "value": "Grandfather"},
        {"label": "Grandmother", "value": "Grandmother"},
        {"label": "Guardian", "value": "Guardian"},
        {"label": "Mother", "value": "Mother"},
        {"label": "Neighbor", "value": "Neighbor"},
        {"label": "Other", "value": "Other"},
        {"label": "Sister", "value": "Sister"},
        {"label": "Stepfather", "value": "Stepfather"},
        {"label": "Stepmother", "value": "Stepmother"},
        {"label": "Uncle", "value": "Uncle"}
    ]

    constructor(root) {
        this.rootStore = root
        this.validation = new Validation(this.validationRules)
        this.contactExtension = new Extension('corepersonfields')
    }

    loadContactInfo() {
        this.phones = observable.array()
        this.activeContactStudent = new ContactStudent()
        this.contactDemographics = new ContactDemographics({}, this)
        this.email = new ContactEmail()
        if (this.contact) {
            if (this.contact.phones && this.contact.phones.length > 0) {
                for (const phone of this.contact.phones) {
                    this.phones.push(new ContactPhone(phone.asJSON, this.contact.contactId, phone.markedForDeletion))
                }
            }

            if (this.contact.activeContactStudent) {
                this.activeContactStudent.setDetailsServerData(this.contact.activeContactStudent.detailJSON)
                this.activeContactStudent.initData(this.contact.activeContactStudent.asJSON)
                this.activeContactStudent.contactId = this.contact.contactId
            } else {
                console.log('Wait...no active Contact Student?')
            }

            if (this.contact.contactDemographics) {
                this.contactDemographics.initData(this.contact.contactDemographics.asJSON)
                this.contactDemographics.contactId = this.contact.contactId
                this.cloneExtensionFields(this.contact.contactDemographics.contactExtension, this.contactExtension)
            }

            if (this.contact.email) {
                this.email.initData(this.contact.email.asJSON)
                this.email.contactId = this.contact.contactId
            }
        }
        
        this.validation.validateAll({
            "phoneCount": this.validatedPhones.length, 
            "contactDemographics": this.contactDemographics, 
            "activeContactStudent": this.activeContactStudent.detailJSON,
            "contactExtension": {"needsinterpreterassist": this.contactExtension.getField('needsinterpreterassist').value}
        })
    }

    cloneExtensionFields(source, destination) {
        if (source instanceof Extension && destination instanceof Extension) {
            for (const field of source.fields.values()) {
                let name = field.name
                destination.fields.set(name, Object.assign({}, field))
            }
        }
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
        this.contactExtension = new Extension('corepersonfields')
        this.activeContactStudent = undefined
    }

    setValue(collection, name, value, index) {
        if (index === undefined) {
            this.validation.validate(`${collection}.${name}`, value)
            if (collection === 'contactExtension') {
                this[collection].setFieldValue(name, value)
            } else {
                this[collection].setValue(name, value)
            }
        } else {
            this[collection][index].validation.validate(name, value)
            if (collection === 'phones') {
                this.validation.validate("phoneCount", this.validatedPhones.length)
            }
            this[collection][index].setValue(name, value)
        }
    }

    submit() {
        if (this.validation.allValidated) {
            this.contact.phones = this.phones
            this.contact.contactDemographics.initData(this.contactDemographics.asJSON)
            this.cloneExtensionFields(this.contactExtension, this.contact.contactDemographics.contactExtension)
            this.contact.email.initData(this.email.asJSON)
            this.contact.activeContactStudent.setStudentDetails(this.activeContactStudent)
            if (!this.editValid) {
                this.contact.activeContactStudent.sequence = this.rootStore.contactsStore.highestSequenceNumber
                this.contact.activeContactStudent.contactId = this.contact.contactId
            }
            this.editValid = false
            this.contact.refreshValidation()
            this.contact.activeContactStudent.markedForDeletion = false
            this.display = false
            this.resetDefault()
        }
    }

    addPhone() {
        const newPhone = new ContactPhone()
        if (this.contact && this.contact.contactId) {
            newPhone.contactId = this.contact.contactId
        }
        this.phones.push(newPhone)
    }

    deletePhone(index) {
        if (this.phones[index].contactsPhoneId === 0) {
            console.log('spliced, not marked')
            this.phones.splice(index)
        } else {
            console.log('marked')
            this.phones[index].markedForDeletion = true
        }
    }

    get validatedPhones() {
        let validatedPhones = []
        if (this.phones) {
            for (const phone of this.phones) {
                if (phone.deleted === false && 
                   phone.markedForDeletion === false && 
                   phone.validation.allValidated === true) 
                {
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
    editValid: observable,
    needsinterpreterassist: observable,
    cloneExtensionFields: action,
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