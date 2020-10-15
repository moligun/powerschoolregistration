import { 
        observable, 
        action, 
        decorate,
        computed,
        flow
    } from "mobx"
import ContactPhone from './contactphone'
import ContactDemographics from "./contactdemographics"
import ContactStudent from "./contactstudent"
import ContactEmail from "./contactemail"
import Validation from "./validation"
import ContactService from '../services/contactservice'
class Contact {
    phones
    contactId = undefined
    indexId = undefined
    contactStudents
    contactData
    email
    removeContactAssocList = []
    validation
    validationRules = [
        {"name": "phoneCount", "rules": ["atLeast"], "comparisonValue": 1, "label": "Phone Number"},
        {"name": "contactDemographics.firstName", "rules": ["required"]},
        {"name": "contactDemographics.lastName", "rules": ["required"]}
    ]
    constructor(data, index, root) {
        this.rootStore = root
        this.contactData = data
        this.indexId = index
        this.validation = new Validation(this.validationRules)
        this.loadContactData()
        this.refreshValidation()
    }

    refreshValidation() {
        this.validation.validateAll({ "contactDemographics": this.contactDemographics, "phoneCount": this.validatedPhones.length})
    }
  
    loadContactData() {
        this.phones = observable.array()
        this.contactStudents = observable.array()
        const { contactData } = this
        this.contactId = contactData && contactData.contactId ? contactData.contactId : 0
        this.contactDemographics = new ContactDemographics(contactData)
        this.contactDemographics.contactId = this.contactId
        if (contactData && contactData.emails && contactData.emails.length > 0) {
            this.email = new ContactEmail(contactData.emails[0])
        } else {
            this.email = new ContactEmail()
        }
        this.email.contactId = this.contactId

        if (contactData && contactData.contactStudents && contactData.contactStudents.length > 0) {
            for (const student of contactData.contactStudents) {
                this.contactStudents.push(new ContactStudent(student, this.contactId))
            }
        }

        if (contactData && contactData.phones && contactData.phones.length > 0) {
            for (const phoneObj of contactData.phones) {
                this.phones.push(new ContactPhone(phoneObj, this.contactId))
            }
        }
    }

    addContactStudent() {
        const { student } = this.rootStore.formStore
        this.contactStudents.push(new ContactStudent({
            "dcid": student.id,
            "studentNumber": student.studentNumber
        }))
    }

    removeActiveStudent() {
        if (this.activeContactStudent) {
            this.activeContactStudent.markedForDeletion = true
        }
    }

    get activeContactStudent() {
        const { student } = this.rootStore.formStore
        if (student && this.contactStudents.length > 0) {
            for (const contactStudent of this.contactStudents) {
                if (student.id === contactStudent.dcid) {
                    return contactStudent
                }
            }
        }
        return false
    }

    get hasContactStudents() {
        if (this.contactStudents && this.contactStudents.length > 0) {
            return this.contactStudents.some((contactStudent) => contactStudent.deleted === false)
        }
        return false
    }

    refreshContactData = flow(function * (contactId) {
        try {
            const contact = yield ContactService.getContact(contactId)
            if (contact.data && contact.data.contactId > 0) {
                this.contactData = contact.data
                this.loadContactData()
            }
        } catch(error) {
            console.log(error)
        } finally {
            this.loading = false
        }

    })

    updatePackages() {
        let updates = []
        if (this.contactDemographics.changesMade === true) {
            updates.push(this.contactDemographics.update())
        }

        for (const studentContact of this.contactStudents) {
            if (studentContact.erroredOut === false && studentContact.changesMade === true) {
                updates = updates.concat(studentContact.update())
            }
        }

        for (const phone of this.phones) {
            if (phone.changesMade === true) {
                updates.push(phone.update())
            }
        }

        if (this.email.changesMade === true) {
            updates.push(this.email.update())
        }
        return updates
    }

    setValue(collection, name, value, index) {
        if (index === undefined) {
            this[collection].setValue(name, value)
        } else {
            this[collection][index].setValue(name, value)
        }
    }

    removePhone(index) {
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

    get asJSON() {
        let phones = []
        let contactStudents = []
        for (const phone of this.phones) {
            phones.push(phone.asJSON)
        }

        for (const contactStudent of this.contactStudents) {
            contactStudents.push(contactStudent.asJSON)
        }
        const obj = {
            "firstName": this.contactDemographics.firstName,
            "lastName": this.contactDemographics.lastName,
            phones,
            contactStudents,
            emails: [this.email.asJSON]
        }
        return obj
    }
}

decorate(Contact, {
    loadContactData: action,
    changeOrder: action,
    addPhone: action,
    removePhone: action,
    setValue: action,
    removeActiveStudent: action,
    addContactStudent: action,
    refreshValidation: action,
    refreshContactData: action,
    phones: observable,
    addresses: observable,
    contactStudents: observable,
    email: observable,
    contactDemographics: observable,
    contactData: observable,
    activeContactStudent: computed,
    validatedPhones: computed,
    asJSON: computed,
    hasContactStudents: computed
})
export default Contact