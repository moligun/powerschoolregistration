import React from 'react'
import { observer, inject } from 'mobx-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
class StudentsList extends React.Component {
    loadForm = () => {
        const { formStore } = this.props
    }
    render() {
        const { students } = this.props.studentStore
        const { activeStudentIndex } = this.props.formStore
        return (
            <nav>
                <ul className="nav nav-tabs">
                    {students && students.map((student, index) => 
                        <li key={'student-' + student.id} className="nav-item">
                            <button onClick={this.loadForm} className={`nav-link ${parseInt(index) === parseInt(activeStudentIndex) ? "active" : ""}`}>
                                {student.name.first_name + ", " + student.name.last_name} 
                                {student.validationSuccess ? <FaCheck className="text-success ml-1" /> : <FaTimes className="text-danger ml-1" />}
                            </button>
                        </li>
                    )}
                    {students && 
                        <li className="nav-item">
                            <button onClick={this.loadForm} className={`nav-link ${parseInt(students.length) === parseInt(activeStudentIndex) ? "active" : ""}`}>
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