import React from 'react'
import { inject, observer} from 'mobx-react'
import StudentStatus from './studentstatus'
class SubmissionPage extends React.Component {
    handleSubmit = (event) => {
        event.preventDefault()
        const { formStore } = this.props
        formStore.processSubmissions()
    }

    handleSectionClick = (event, studentId, sectionId) => {
        event.preventDefault()
        const { formStore } = this.props
        formStore.setActiveIndex(studentId)
        formStore.activeSectionId = sectionId
        formStore.submitState = false
        window.scrollTo(0, 0)
    }

    handlePrevious = (event) => {
        event.preventDefault()
        const { formStore } = this.props
        formStore.changeSection(-1)
        window.scrollTo(0, 0)
    }

    render() {
        const { studentStore, formStore} = this.props
        return (
            <div>
                <div>
                    <h2>Overview Summary</h2>
                    <ul className="list-group">
                        {studentStore.students.map((student, studentIndex) => 
                            <StudentStatus key={`student-${studentIndex}`} student={student} studentIndex={studentIndex} onButtonClick={this.handleSectionClick}/>
                        )}
                    </ul>
                </div>
                <div className="w-100 d-flex justify-content-between">
                    <button onClick={this.handlePrevious} className="btn btn-secondary">Previous</button>
                    <button onClick={this.handleSubmit} className="btn btn-primary" disabled={formStore.submitting}>
                        { formStore.submitting ? 'Processing....' : 'Submit' }
                    </button>
                </div>
            </div>
        )
    }
}
export default inject(stores => ({
  formStore: stores.rootStore.formStore,
  studentStore: stores.rootStore.studentStore,
  contactsStore: stores.rootStore.contactsStore
}))(observer(SubmissionPage))