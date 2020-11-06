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
    errors = []
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
        this.validation.validateAll({
            "contactDemographics": this.contactDemographics, 
            "phoneCount": this.validatedPhones.length,
            "contactExtension": {"needsinterpreterassist": this.contactDemographics.contactExtension.getField('needsinterpreterassist').value}
        })
    }
  
    loadContactData(existingStudentOrder) {
        this.phones = observable.array()
        this.contactStudents = observable.array()
        const { contactData } = this
        this.contactId = contactData && contactData.contactId ? contactData.contactId : 0
        this.contactDemographics = new ContactDemographics(contactData, this)
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
        
        if (existingStudentOrder !== undefined) {
            for (const contactStudent of this.contactStudents) {
                let contactStudentId = contactStudent.dcid
                contactStudent.sequence = existingStudentOrder[contactStudentId] ? existingStudentOrder[contactStudentId] : contactStudent.sequence
            }
        }

        if (contactData && contactData.phones && contactData.phones.length > 0) {
            for (const phoneObj of contactData.phones) {
                this.phones.push(new ContactPhone(phoneObj, this.contactId))
            }
        }
    }

    contactAssociatedWithStudent(studentNumbers) {
        if (studentNumbers && studentNumbers.length > 0 && this.contactStudents.length > 0) {
            for (const contactStudent of this.contactStudents) {
                if (studentNumbers.includes(parseInt(contactStudent.studentNumber))) {
                    return true
                }
            }
        }
        return false
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


    get loggedInUser() {
        const { userInfo } =this.rootStore.authStore
        if (this.activeContactStudent) {
            const activeGuardianId = userInfo && userInfo.dcid ? userInfo.dcid : undefined
            if (activeGuardianId !== undefined && parseInt(this.activeContactStudent.guardianId) === parseInt(activeGuardianId)) {
                return true
            }
        }
        return false
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
            return this.contactStudents.some((contactStudent) => 
                contactStudent.deleted === false && contactStudent.markedForDeletion === false
            )
        }
        return false
    }

    includesStudentContact(contactStudentId) {
        return this.contactStudents.some((contactStudent) => 
            parseInt(contactStudent.studentContactId) === parseInt(contactStudentId)
        )
    }

    addExistingContactStudent(student, contactId) {
        this.contactStudents.push(new ContactStudent(student, contactId))
    }

    refreshContactData = flow(function * (contactId, studentSequenceOrder) {
        try {
            const contact = yield ContactService.getContact(contactId)
            if (contact.data && contact.data.contactId > 0) {
                this.contactData = contact.data
                this.loadContactData(studentSequenceOrder)
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
            console.log('Demographics changes made')
            updates.push(this.contactDemographics.update())
        }

        if (this.email.changesMade === true) {
            console.log('changes made to email...is that right?')
            console.log(this.email)
            updates.push(this.email.update())
        }

        for (const studentContact of this.contactStudents) {
            if (studentContact.changesMade === true) {
                console.log('student contact changes made')
                updates = updates.concat(studentContact.update())
            }
        }

        for (const phone of this.phones) {
            if (phone.changesMade === true) {
                console.log('phones added')
                updates.push(phone.update())
            }
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

    addError(error) {
        this.errors.push(error[0])
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

    get fullName() {
        let nameString = ''
        if (this.contactDemographics.lastName) {
            nameString = this.contactDemographics.lastName 
            nameString += this.contactDemographics.firstName ? `, ${this.contactDemographics.firstName}` : ''
        }
        return nameString
    }

    get asJSON() {
        let phones = []
        let contactStudents = []
        for (const phone of this.phones) {
            phones.push(phone.asJSON)
        }

        const email = this.email.asJSON

        for (const contactStudent of this.contactStudents) {
            contactStudents.push(contactStudent.asJSON)
        }
        const obj = {
            "firstName": this.contactDemographics.firstName,
            "lastName": this.contactDemographics.lastName,
            phones,
            contactStudents,
            "@extensions": "personcorefields",
            "_extension_data": {"_table_extension": [this.contactExtension.asJSON]}
        }

        if (email.address) {
            obj['emails'] = [this.email.asJSON]
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
    addError: action,
    addExistingContactStudent: action,
    phones: observable,
    addresses: observable,
    contactStudents: observable,
    email: observable,
    contactDemographics: observable,
    contactData: observable,
    errors: observable,
    activeContactStudent: computed,
    validatedPhones: computed,
    asJSON: computed,
    hasContactStudents: computed,
    fullName: computed,
    loggedInUser: computed
})
export default Contact