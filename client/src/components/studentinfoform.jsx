import React from 'react'
import { inject, observer} from 'mobx-react'
import ContactsList from './contactslist'
import HealthInformation from './healthinformation'
import StudentInformation from './studentinformation'
import SubmissionPage from './submissionpage'
import { FaCheck, FaTimes } from 'react-icons/fa'
class StudentInfoForm extends React.Component {
    handleNext = (event) => {
        event.preventDefault()
        const { formStore } = this.props
        formStore.changeSection(1)
        window.scrollTo(0, 0)
    }

    handlePrevious = (event) => {
        event.preventDefault()
        const { formStore } = this.props
        formStore.changeSection(-1)
        window.scrollTo(0, 0)
    }

    handleSectionChange = (event) => {
        event.preventDefault()
        const index = parseInt(event.currentTarget.dataset.index)
        this.props.formStore.activeSectionId = index
        window.scrollTo(0, 0)
    }

    render() {
        const { contactEditor } = this.props
        const { student, formSections, activeSectionId, submitState } = this.props.formStore
        if (submitState === true) {
            return (<SubmissionPage />)
        }

        if (student === undefined) {
            return (<h2>Loading</h2>)
        }

        let activeSection
        switch (activeSectionId) {
            case 0:
                activeSection = <StudentInformation />
                break
            case 1:
                activeSection = <ContactsList />
                break
            case 2:
                activeSection = <HealthInformation />
                break
            default:
                break
        }

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <ul className="navbar-nav">
                        {formSections.map((value, index) => 
                            <li key={`section-${index}`} className={`nav-item ${index === activeSectionId ? "active" : ""}`}>
                                <button className={`btn btn-link nav-link`} onClick={this.handleSectionChange} data-index={index}>
                                    {value.name} {student[value.validation].allValidated ? <FaCheck className="text-success" /> : <FaTimes className="text-danger" /> }
                                </button> 
                            </li>
                        )}
                    </ul>
                </nav>
                {activeSection}
                <div className="w-100 d-flex justify-content-between">
                    <button onClick={this.handlePrevious} className="btn btn-secondary" disabled={contactEditor.display}>Previous</button>
                    <button onClick={this.handleNext} className="btn btn-primary" disabled={contactEditor.display}>Next</button>
                </div>
            </div>
        )
    }
}
export default inject(stores => ({
  formStore: stores.rootStore.formStore,
  contactEditor: stores.rootStore.contactEditorStore
}))(observer(StudentInfoForm))