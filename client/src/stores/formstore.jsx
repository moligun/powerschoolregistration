import { 
        observable, 
        computed,
        decorate,
        action,
        flow
    } from "mobx"
import contact from "../components/contact"
import contactService from "../services/contactservice"
import StudentService from "../services/studentservice"

class FormStore {
    displayForm = false
    activeStudentIndex
    formSections = [
        {"name": "Student Info", "validation": "studentInformationValidation"}, 
        {"name": "Contacts", "validation": "contactInformationValidation"},
        {"name": "Health Information", "validation": "healthInformationValidation"},
        {"name": "Agreements", "validation": "releaseInformationValidation"},
        {"name": "Signature", "validation": "signatureInformationValidation"},
    ]
    activeSectionId = 0
    submitState = false
    submitting = false
    constructor(root) {
        this.rootStore = root
    }

    get studentsCount() {
        if (this.rootStore.studentStore.students !== undefined) {
            return this.rootStore.studentStore.students.length
        }
        return undefined
    }

    get student() {
        if (this.rootStore.studentStore.students !== undefined) {
            if (this.rootStore.studentStore.students[this.activeStudentIndex] !== undefined) {
                return this.rootStore.studentStore.students[this.activeStudentIndex]
            }
        }
        return undefined
    }

    setActiveIndex(id) {
        this.activeStudentIndex = id
    }

    changeSection(changeBy) {
        let newSectionValue = changeBy + this.activeSectionId
        console.log(newSectionValue)
        const maxSectionIndex = this.formSections.length - 1
        const studentsLeft = (this.activeStudentIndex + 1) < this.studentsCount
        if (newSectionValue > maxSectionIndex) {
            if (studentsLeft) {
                this.activeSectionId = 0
                this.activeStudentIndex++
            } else {
                this.submitState = true
                this.activeSectionId = maxSectionIndex + 1
                this.activeStudentIndex = this.studentsCount - 1
            }
        } else if (newSectionValue < 0) {
            if (this.activeStudentIndex > 0) {
                this.activeStudentIndex--
                this.activeSectionId = maxSectionIndex
            } else {
                if (this.submitState) {
                    this.activeSectionId = maxSectionIndex
                    this.activeStudentIndex = this.studentsCount - 1
                    this.submitState = false
                } else {
                    this.activeSectionId = 0
                }
            }
        } else {
            if (this.submitState) {
                this.activeSectionId = maxSectionIndex
                this.activeStudentIndex = this.studentsCount - 1
                this.submitState = false
            } else {
                this.activeSectionId = newSectionValue
            }
        }
    }

    removeUnvalidatedContacts() {
        const originalActiveIndex = this.activeStudentIndex
        const { contactsStore, studentStore } = this.rootStore
        for (const studentIndex of studentStore.validatedStudentIndexes) {
            this.setActiveIndex(studentIndex)
            for (const contact of contactsStore.removableStudentContacts) {
                contact.activeContactStudent.deleted = true
            }
        }
        this.setActiveIndex(originalActiveIndex)
    }

    processSubmissions = flow(function* () {
        this.submitting = true
        this.removeUnvalidatedContacts()
        const { studentStore } = this.rootStore
        let studentPayload = {
            "students": {
                "student": []
            }
        }
        let activeStudentNumbers = []
        for (const studentIndex of studentStore.validatedStudentIndexes) {
            studentPayload.students.student.push(studentStore.students[studentIndex].asJSON)
            activeStudentNumbers.push(studentStore.students[studentIndex].studentNumber)
        }
        try {
            for (const contact of this.rootStore.contactsStore.contacts){
                if (contact.contactAssociatedWithStudent(activeStudentNumbers) === false) {
                    continue
                } 
                contact.errors = []

                if (contact.contactId > 0) {
                    let contactUpdatePackage = contact.updatePackages()
                    if (contactUpdatePackage.length > 0) {
                            const results = yield Promise.all(contactUpdatePackage)
                            if (results && results.length > 0) {
                                for (const result of results) {
                                    if (result !== false) {
                                        contact.addError(result)
                                    }
                                }
                            }
                    } else {
                        console.log('nothing to update')
                    }
                } else if (contact.hasContactStudents) {
                    const results = yield contactService.createContact(contact.asJSON)
                    if (results.data) {
                        if (results.data['success_message']) {
                            yield contact.refreshContactData(results.data['success_message']['id'])
                        } else if (results.data['error_message']) {
                            console.log(results.data['error_message'])
                        }
                    }
                }
            }
            const studentResults = yield StudentService.updateStudent(studentPayload)
            console.log(studentResults)
        } catch (error) {
            console.log(error)
        } finally {
            this.submitting = false
        }
    })
}
decorate(FormStore, {
    activeStudentIndex: observable,
    phones: observable,
    displayForm: observable,
    formSections: observable,
    activeSectionId: observable,
    submitState: observable,
    submitting: observable,
    student: computed,
    studentsCount: computed,
    setActiveIndex: action,
    changeSection: action,
    processSubmissions: action,
    removeUnvalidatedContacts: action
})
export default FormStore