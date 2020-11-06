import { 
        observable, 
        computed,
        decorate,
        action,
        flow
    } from "mobx"
import contactService from "../services/contactservice"
import StudentService from "../services/studentservice"

class FormStore {
    displayForm = false
    activeStudentIndex
    formSections = [
        {"name": "Student Info", "validation": "studentInformationValidation", "triggerAlias": "student"}, 
        {"name": "Contacts", "validation": "contactInformationValidation", "triggerAlias": "contacts"},
        {"name": "Health Information", "validation": "healthInformationValidation", "triggerAlias": "health"},
        {"name": "Agreements", "validation": "releaseInformationValidation", "triggerAlias": "release"},
        {"name": "Signature", "validation": "signatureInformationValidation", "triggerAlias": "signature"}
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

    get activeFormSection() {
        if (this.activeSectionId !== undefined) {
            const activeSection = this.formSections[this.activeSectionId] ? this.formSections[this.activeSectionId] : undefined
            return activeSection
        }
        return undefined
    }

    setActiveIndex(id) {
        this.activeStudentIndex = id
    }

    refreshActiveSectionValidation() {
        if (this.student && this.activeFormSection && this.activeFormSection['triggerAlias']) {
            const validationTrigger = this.activeFormSection['triggerAlias']
            this.student.refreshValidation(validationTrigger)
            return true
        }
        return false
    }

    changeSection(changeBy) {
        let newSectionValue = changeBy + this.activeSectionId
        const maxSectionIndex = this.formSections.length - 1
        const studentsLeft = (this.activeStudentIndex + 1) < this.studentsCount
        if (newSectionValue > maxSectionIndex) {
            if (studentsLeft) {
                this.activeSectionId = 0
                this.activeStudentIndex++
            } else {
                this.submitState = true
                this.activeSectionId = maxSectionIndex
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
                contact.activeContactStudent.markedForDeletion = true
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
            studentStore.students[studentIndex].preprocessData()
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
                    let existingContactSequences = {}
                    for (const contactStudent of contact.contactStudents) {
                        let studentDcid = contactStudent.dcid
                        existingContactSequences[studentDcid] = contactStudent.sequence
                    }
                    const results = yield contactService.createContact(contact.asJSON)
                    if (results.data) {
                        if (results.data['success_message']) {
                            yield contact.refreshContactData(results.data['success_message']['id'], existingContactSequences)
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
                                console.log('nothing to update (from new)')
                            }
                        } else if (results.data['error_message']) {
                            contact.addError(results.data['error_message']['error'])
                        } else {
                            contact.addError(["Issues Adding Contact"])
                        }
                    }
                }
            }
            const studentResults = yield StudentService.updateStudent(studentPayload)
            const studentResultsObject = studentResults.data && studentResults.data.results ? studentResults.data.results.result : null
            if (Array.isArray(studentResultsObject)) {
                for (const student of studentResultsObject) {
                    let indexId = student.client_uid
                    if (indexId !== undefined && indexId !== '') {
                        if (student.status === 'SUCCESS') {
                            studentStore.students[indexId].submissionSuccess = true
                            studentStore.students[indexId].errors = []
                        } else if (student.status === 'ERROR') {
                            studentStore.students[indexId].submissionSuccess = false
                            let errorMessage = student.error_message ? student.error_message.error : 'Generic Student Error'
                            studentStore.students[indexId].addError(errorMessage)
                        }
                    }
                }
            } else if (studentResultsObject) {
                let student = studentResultsObject
                let indexId = student.client_uid !== undefined ? student.client_uid : undefined
                if (indexId !== undefined) {
                    if (student.status === 'SUCCESS') {
                        studentStore.students[indexId].submissionSuccess = true
                        studentStore.students[indexId].errors = []
                    } else if (student.status === 'ERROR') {
                        studentStore.students[indexId].submissionSuccess = false
                        let errorMessage = student.error_message ? student.error_message.error : 'Generic Student Error'
                        studentStore.students[indexId].addError(errorMessage)
                    }
                }
            }
            
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
    activeFormSection: computed,
    setActiveIndex: action,
    changeSection: action,
    processSubmissions: action,
    removeUnvalidatedContacts: action,
    refreshActiveSectionValidation: action
})
export default FormStore