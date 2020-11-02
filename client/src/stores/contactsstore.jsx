import { 
        observable, 
        action, 
        decorate, 
        flow,
        computed
    } from "mobx"
import StudentService from "../services/studentservice"
import Contact from "./contact"
class ContactsStore {
    contacts = observable.array()
    loading = true
    constructor(root) {
        this.rootStore = root
        this.contactService = StudentService
        this.loadContacts()
    }

    addContact() {
        try { 
            const index = this.contacts.length
            const contactObj = {
                "contactStudents":[
                    {
                        "dcid": this.rootStore.formStore.student.id,
                        "studentNumber": this.rootStore.formStore.student.studentNumber
                    }
                ]
            }
            this.contacts.push(new Contact(contactObj, index, this.rootStore))
            return index
        } catch(error) {
            console.log(error)
        }
    }

    getContactById(id) {
        for (const contact of this.contacts) {
            if (contact.contactId > 0 && contact.contactId === id) {
                return contact
            }
        }
    }

    loadContacts = flow(function * () {
        try {
            const contacts = yield this.contactService.loadContacts()
            let existingContacts = []
            if (contacts.data && contacts.data.length > 0) {
                let index = 0
                for (const contact of contacts.data) {
                    if (existingContacts.includes(contact.contactId) === false) {
                        existingContacts.push(contact.contactId)
                        this.contacts.push(new Contact(contact, index, this.rootStore))
                        index++
                    } else {
                        let existingContact = this.getContactById(contact.contactId)
                        if (contact && contact.contactStudents && contact.contactStudents.length > 0) {
                            for (const student of contact.contactStudents) {
                                if (existingContact.includesStudentContact(student.contactStudentId) === false) {
                                    existingContact.addExistingContactStudent(student, contact.contactId)
                                }
                            }
                        }
                    }
                }
            } else {
                this.contacts = undefined
            }
        } catch(error) {
            console.log(error)
        } finally {
            this.loading = false
        }

    })

    get highestSequenceNumber() {
        let sequence = this.activeStudentContacts.length
        const lastIndex = sequence - 1
        if (this.activeStudentContacts[lastIndex] && this.activeStudentContacts[lastIndex].activeContactStudent) {
            sequence = this.activeStudentContacts[lastIndex].activeContactStudent.sequence
        }
        return (sequence + 1)
    }

    get activeStudentContacts() {
        let studentContacts = []
        if (this.contacts) {
            for (const contact of this.contacts) {
                if (contact.activeContactStudent 
                    && contact.activeContactStudent.deleted === false
                    && contact.activeContactStudent.markedForDeletion === false) {
                    studentContacts.push(contact)
                }
            }
            studentContacts.sort((a, b) => {
                let firstComp = a.activeContactStudent.sequence
                let secondComp = b.activeContactStudent.sequence
                if (firstComp < secondComp) {
                    return -1
                }
                if (firstComp > secondComp) {
                    return 1
                }
                return 0
            })
        }
        return studentContacts
    }

    get validatedStudentContacts() {
        let studentContacts = []
        if (this.contacts) {
            for (const contact of this.contacts) {
                if (contact.activeContactStudent && 
                    contact.validation.allValidated &&
                    contact.activeContactStudent.deleted === false &&
                    contact.activeContactStudent.markedForDeletion === false) {
                    studentContacts.push(contact)
                }
            }
        }
        return studentContacts
    }

    get unusedStudentContacts() {
        let studentContacts = []
        if (this.contacts) {
            for (const contact of this.contacts) {
                if (!contact.activeContactStudent || (contact.activeContactStudent.deleted === false 
                    && (contact.activeContactStudent.markedForDeletion === true))) {
                    studentContacts.push(contact)
                }
            }
            studentContacts.sort((a, b) => {
                let firstComp = a.contactDemographics.lastName
                let secondComp = b.contactDemographics.lastName
                if (firstComp < secondComp) {
                    return -1
                }
                if (firstComp > secondComp) {
                    return 1
                }
                return 0
            })
        }
        return studentContacts
    }

    get removableStudentContacts() {
        let studentContacts = []
        if (this.contacts) {
            for (const contact of this.contacts) {
                if (contact.activeContactStudent) {
                    if (contact.activeContactStudent.markedForDeletion !== true 
                        && !contact.validation.allValidated 
                        && contact.activeContactStudent.deleted === false
                        && contact.loggedInUser === false) {
                        studentContacts.push(contact)
                    }
                }
            }
        }
        return studentContacts
    }
}
decorate(ContactsStore, {
    contacts: observable,
    loading: observable,
    loadContacts: action,
    addContact: action,
    activeStudentContacts: computed,
    validatedStudentContacts: computed,
    unusedStudentContacts: computed,
    highestSequenceNumber: computed,
    removableStudentContacts: computed
})
export default ContactsStore