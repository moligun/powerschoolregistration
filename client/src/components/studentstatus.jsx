import React from 'react'
import { observer } from 'mobx-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
function StudentStatus(props) {
    const { student, studentIndex } = props
    let status
    if (student.validationSuccess === false) {
        status = <li className="list-group-item list-group-item-danger">Sections Need Attention</li>
    } else if (student.validationSuccess === true) {
        status = <li className="list-group-item list-group-item-warning">Ready for Submission</li>
    }
    return (
        <li className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
            <h4>{student.name.last_name + ", " + student.name.first_name}</h4> 
            <div><span className={`${student.validationSuccess === true ? "alert-warning" : "alert-danger"} badge badge-primary badge-pill`}>
                {student.validationSuccess ? "Ready to Submit" : "Missing Requirements"}</span></div>

            </div>
            <h4>Section Checklist</h4>
            <ul className="list-group">
                {student.validationAreas.map((validation, index) => 
                    <li key={`student.${studentIndex}-section-${index}`} className={`list-group-item ${validation.allValidated ? 'list-group-item-success' : 'list-group-item-danger'}`}>
                        { validation.allValidated ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" /> }
                        {`${validation.title} ${validation.allValidated ? 'Completed' : 'Needs Attention'}`}
                    </li>
                )}
            </ul>
            <h4>Status</h4>
            <ul className="list-group">
                {status}
            </ul>
            {student.submissionErrors.length > 0 &&
                <React.Fragment>
                    <h4>Submission Errors</h4>
                    <ul className="list-group">
                        {student.submissionErrors.length > 0 && student.submissionErrors.map((error, index) => <li className="list-group-item list-group-item-danger" key={`student-${studentIndex}-error-${index}`}>{error}</li>)}
                    </ul>
                </React.Fragment>
            }
        </li>
    )
}
export default observer(StudentStatus)