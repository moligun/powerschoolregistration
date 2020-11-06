import React from 'react'
import { observer } from 'mobx-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
function StudentStatus(props) {
    const { student, studentIndex } = props
    let status
    let badge
    if (student.validationSuccess === false) {
        status = <li className="list-group-item list-group-item-danger">Sections Need Attention</li>
        badge = <div><span className="badge badge-primary badge-pill alert-danger">Missing Requirements</span></div>
    } else if (student.submissionCompleted === false) {
        status = <li className="list-group-item list-group-item-warning">Ready for Submission</li>
        badge = <div><span className="badge badge-primary badge-pill alert-warning">Ready to Submit</span></div>
    } else if (student.submissionCompleted === true) {
        status = <li className="list-group-item list-group-item-success">Submission Completed</li>
        badge = <div><span className="badge badge-primary badge-pill alert-success">Submission Successful</span></div>
    }
    return (
        <li className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
            <h3>{student.name.last_name + ", " + student.name.first_name}</h3> 
            {badge}
            </div>
            <h4>Section Checklist</h4>
            <ul className="list-group">
                {student.validationAreas.map((validation, index) => 
                    <li key={`student.${studentIndex}-section-${index}`} className={`list-group-item ${validation.allValidated ? 'list-group-item-success' : 'list-group-item-danger'} d-flex align-items-baseline justify-content-between`}>
                        <div>
                            { validation.allValidated ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" /> }
                            {`${validation.title} ${validation.allValidated ? 'Completed' : 'Needs Attention'}`}
                        </div>
                        <button className="btn btn-sm btn-info" onClick={event => props.onButtonClick(event, studentIndex, index)}>Go to Section</button>
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