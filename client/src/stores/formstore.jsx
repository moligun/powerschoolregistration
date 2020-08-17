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
        console.log(newPageValue)
        if (newPageValue >= (this.formSections.length)) {
            if (this.activeStudentIndex < this.studentsCount) {
                this.activeStudentIndex++
                this.activeSectionId = 0
            }
        } else if (newPageValue < 0) {
            if (this.activeStudentIndex > 0) {
                this.activeStudentIndex--
                this.activeSectionId = this.formSections.length - 1
            }
        } else {
            this.activeSectionId = newPageValue
        }
    }
}
decorate(FormStore, {
    activeStudentIndex: observable,
    phones: observable,
    displayForm: observable,
    formSections: observable,
    activeSectionId: observable,
    student: computed,
    studentsCount: computed,
    setActiveId: action,
    changeSection: action
})
export default FormStore