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
                        "sequence": this.highestSequenceNumber,
                        "dcid": this.rootStore.formStore.activeStudentId
                    }
                ]
            }
            this.contacts.push(new Contact(contactObj, index, this.rootStore))
            return index
        } catch(error) {
            console.log(error)
        }
    }

    addExistingContact(id) {
        for (const contact of this.contacts) {
            if (contact.contactId > 0 && contact.contactId === id) {
                break
            }
        }
    }

    loadContacts = flow(function * () {
        try {
            const contacts = yield this.contactService.loadContacts()
            if (contacts.data && contacts.data.length > 0) {
                for (let index in contacts.data) {
                    let contact = contacts.data[index]
                    this.contacts.push(new Contact(contact, index, this.rootStore))
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
        for (const contact of this.contacts) {
            if (contact.activeContactStudent && contact.validation.allValidated) {
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
        return studentContacts
    }

    get unusedStudentContacts() {
        let studentContacts = []
        for (const contact of this.contacts) {
            if (!contact.activeContactStudent || !contact.validation.allValidated) {
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
        return studentContacts
    }

    get removableStudentContacts() {
        let studentContacts = []
        for (const contact of this.contacts) {
            if (contact.activeContactStudent) {
                if (!contact.validation.allValidated) {
                    studentContacts.push(
                        {
                            "contactId": contact.contactId,
                            "studentContactId": contact.activeContactStudent.studentContactId
                        }
                    )
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
    unusedStudentContacts: computed,
    highestSequenceNumber: computed,
    removableStudentContacts: computed
})
export default ContactsStore