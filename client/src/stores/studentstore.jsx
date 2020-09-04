import { 
        observable, 
        action, 
        decorate, 
        flow,
        computed,
        onBecomeObserved,
        onBecomeUnobserved
    } from "mobx"
import StudentService from "../services/studentservice"
import StudentForm from "./studentform"
class StudentStore {
    students = []
    loading = true
    constructor(root) {
        this.rootStore = root
        this.studentService = StudentService
        onBecomeObserved(this, 'students', this.resumeObserve)
        onBecomeUnobserved(this, 'students', this.stopObserve)
    }

    resumeObserve = () => {
        this.loadStudents()
    }

    stopObserve = () => {
        this.students = undefined
    }

    get validatedStudentIndexes() {
        let indexes = []
        if (this.students.length > 0) {
            for (let index in this.students) {
                if (this.students[index].validationSuccess === true) {
                    indexes.push(index)
                }
            }
        } else {
            console.log('apparently no students?')
        }
        return indexes
    }

    loadStudents = flow(function * () {
        try {
            const students = yield this.studentService.loadStudents()
            if (students.data && students.data.length > 0) {
                for (let index in students.data) {
                    let student = students.data[index]['student']
                    this.students.push(new StudentForm(student))
                }
                this.rootStore.formStore.setActiveIndex(0)
            } else {
                this.students = undefined
            }
        } catch(error) {
            console.log(error)
        } finally {
            this.loading = false
        }
    })

    get asJSON() {
        let students = []
        for (const student of this.students) {
            students.push(student.asJSON)
        }
        return JSON.stringify(students)
    }
}
decorate(StudentStore, {
    students: observable,
    loading: observable,
    loadStudents: action,
    asJSON: computed,
    validatedStudentIndexes: computed
})
export default StudentStore