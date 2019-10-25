import { observable, action, decorate, flow, onBecomeUnobserved, onBecomeObserved } from "mobx"
import TicketService from "../services/ticketservice"
class StudentStore {
    student
    studentId = ''
    studentIdType = 'student_number'
    loading = false
    errors = []
    constructor(root) {
        this.rootStore = root
        this.ticketService = TicketService
        onBecomeObserved(this, 'student', this.observeStudent)
        onBecomeUnobserved(this, 'student', this.unObserveStudent)
    }

    observeStudent = () => {
        this.loadStudentInfo()
    }

    unObserveStudent = () => {
        this.student = undefined
        this.studentId = undefined
    }

    setStudentId(idType) {
        const { editorStore } = this.rootStore
        editorStore.errors.student = []
        if (parseInt(editorStore.studentId)) {
            this.studentIdType = idType
            this.studentId = editorStore.studentId
            editorStore.displayEditor = true
        } else {
            editorStore.errors.student.push('Student ID must be numeric only.')
        }
    }

    loadStudentInfo = flow(function * () {
        this.errors = []
        try {
            const userInfo = yield this.ticketService.studentInfo(this.studentId, this.studentIdType)
            if (userInfo.data && userInfo.data.id) {
                this.student = userInfo.data
            } else {
                this.rootStore.editorStore.errors.student.push(userInfo.data.message)
                this.student = undefined
                this.studentId = undefined
            }
        } catch(error) {
            this.student = undefined
        } finally {
            this.rootStore.editorStore.loading = false
        }
    })
}
decorate(StudentStore, {
    loadStudentInfo: action,
    setStudentId: action,
    student: observable,
    studentId: observable,
    studentIdType: observable,
    errors: observable
})
export default StudentStore