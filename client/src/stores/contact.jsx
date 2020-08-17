import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import ContactPhone from './contactphone'
import ContactDemographics from "./contactdemographics"
import ContactStudent from "./contactstudent"
import ContactEmail from "./contactemail"
import Validation from "./validation"
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
        if (contactData && contactData.emails && contactData.emails.length > 0) {
            this.email = new ContactEmail(contactData.emails[0])
        } else {
            this.email = new ContactEmail()
        }

        if (contactData && contactData.contactStudents && contactData.contactStudents.length > 0) {
            for (const student of contactData.contactStudents) {
                this.contactStudents.push(new ContactStudent(student))
            }
        }

        if (contactData && contactData.phones && contactData.phones.length > 0) {
            for (const phoneObj of contactData.phones) {
                this.phones.push(new ContactPhone(phoneObj))
            }
        }
    }

    addContactStudent() {
        const { activeStudentId } = this.rootStore.formStore
        this.contactStudents.push(new ContactStudent({
            "dcid": activeStudentId
        }))
    }

    removeActiveStudent() {
        const { activeStudentId } = this.rootStore.formStore
        if (activeStudentId && this.contactStudents.length > 0) {
            this.contactStudents.forEach((contactStudent, index) => {
                if (activeStudentId === contactStudent.dcid) {
                    if (contactStudent.studentContactId) {
                        this.removeContactAssocList.push(contactStudent.studentContactId)
                    }
                    this.contactStudents.splice(index, 1)
                }
            })
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
    phones: observable,
    addresses: observable,
    contactStudents: observable,
    email: observable,
    contactDemographics: observable,
    activeContactStudent: computed,
    validatedPhones: computed
})
export default Contact