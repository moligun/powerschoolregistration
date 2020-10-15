import React from 'react'
import { observer, inject } from 'mobx-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import Loading from './loading'
class StudentsList extends React.Component {
    handleClick = (event) => {
        const { formStore } = this.props
        const studentIndex = event.currentTarget.dataset.index
        formStore.submitState = false
        formStore.setActiveIndex(studentIndex)
    }

    handleReview = (event) => {
        const { formStore } = this.props
        formStore.submitState = true
    }

    render() {
        const { students, loading } = this.props.studentStore
        const { activeStudentIndex, submitState } = this.props.formStore
        if (loading === true) {
            return (
                <Loading />
            )
        }
        return (
            <nav>
                <ul className="nav nav-tabs">
                    {students && students.map((student, index) => 
                        <li key={'student-' + student.id} className="nav-item">
                            <button onClick={this.handleClick} data-index={index} className={`nav-link ${submitState === false && parseInt(index) === parseInt(activeStudentIndex) ? "active" : ""}`}>
                                {student.name.first_name + ", " + student.name.last_name} 
                                {student.validationSuccess ? <FaCheck className="text-success ml-1" /> : <FaTimes className="text-danger ml-1" />}
                            </button>
                        </li>
                    )}
                    {students && students.length > 0 &&
                        <li className="nav-item">
                            <button onClick={this.handleReview} className={`nav-link ${submitState === true ? "active" : ""}`}>
                                Review &amp; Submit
                            </button>
                        </li>
                    }
                </ul>
            </nav>
        )
    }
}

export default inject(stores => ({
    studentStore: stores.rootStore.studentStore,
    formStore: stores.rootStore.formStore
}))(observer(StudentsList))