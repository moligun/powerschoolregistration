import React from 'react'
import { inject, observer} from 'mobx-react'
class SubmissionPage extends React.Component {
    handleSubmit = (event) => {
        event.preventDefault()
        const { formStore, contactsStore } = this.props
        const firstContact = contactsStore.contacts[0]
        console.log('submitting')
        formStore.processSubmissions()
        window.scrollTo(0, 0)
    }

    handlePrevious = (event) => {
        event.preventDefault()
        const { formStore } = this.props
        formStore.changeSection(-1)
        window.scrollTo(0, 0)
    }

    render() {
        const { studentStore, contactsStore, formStore} = this.props
        return (
            <div>
                <div>
                    <ol>
                        {studentStore.students.map((student) => 
                            <li>
                                {student.name.last_name + ", " + student.name.first_name} 
                                <span className={`${student.validationSuccess === true ? "alert-success" : "alert-danger"} ml-1 px-2`}>{student.validationSuccess ? "Ready to Submit" : "Needs Attention"}</span>
                                <ul>
                                    {student.validationAreas.map((validation) => 
                                        validation.allValidated === false && <li><span className="alert-danger">{validation.title} Needs Attention</span></li>
                                    )}
                                </ul>
                            </li>
                        )}
                    </ol>
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