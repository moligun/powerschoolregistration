import { 
        observable, 
        computed,
        decorate,
        action
    } from "mobx"
class FormStore {
    displayForm = false
    activeStudentIndex
    formSections = [
        {"name": "Student Info", "validation": "studentInformationValidation"}, 
        {"name": "Contacts", "validation": "contactInformationValidation"},
        {"name": "Health Information", "validation": "healthInformationValidation"}
    ]
    activeSectionId = 0
    submitState = false
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
        let newPageValue = changeBy + this.activeSectionId
        if (newPageValue >= (this.formSections.length)) {
            if (this.activeStudentIndex < this.studentsCount) {
                this.activeStudentIndex++
                this.activeSectionId = 0
                if (this.activeStudentIndex > (this.studentsCount - 1)) {
                    this.submitState = true
                }
            } 
        } else if (newPageValue < 0) {
            this.submitState = false
            if (this.activeStudentIndex > 0) {
                this.activeStudentIndex--
                this.activeSectionId = this.formSections.length - 1
            }
        } else {
            this.activeSectionId = newPageValue
        }
    }

    processSubmissions() {
        if (this.rootStore.studentStore.validatedStudentIndexes.length > 0) {
            console.log('test 1')
            for (let index of this.rootStore.studentStore.validatedStudentIndexes) {
                this.setActiveIndex(index)
                console.log(this.rootStore.contactsStore.removableStudentContacts)
            }
        }
    }
}
decorate(FormStore, {
    activeStudentIndex: observable,
    phones: observable,
    displayForm: observable,
    formSections: observable,
    activeSectionId: observable,
    submitState: observable,
    student: computed,
    studentsCount: computed,
    setActiveIndex: action,
    changeSection: action,
    processSubmissions: action
})
export default FormStore