import React from 'react'
import Loading from './loading'
import { observer, inject } from 'mobx-react'
class StudentLookupForm extends React.Component {
    handleClick = () => {
        const { studentStore } = this.props
        studentStore.setStudentId('student_number')
    } 

    handleStudentIDChange = (event) => {
        const { editorStore } = this.props
        editorStore.studentId = event.target.value
    }

    detectEnterKey = (event) => {
        if (event.key === "Enter") {
            this.handleClick()
        }
    }

    render() {
        const { editorStore } = this.props
        if (editorStore.loading) {
            return (
                <Loading />
            )
        }
        return (
            <div className="studentContainer">
                {editorStore.errors.student.map((message, index) => (<div key={'error.' + index} className="alert alert-danger align-self-stretch">{message}</div>))}
                <div className="form-group">
                    <label htmlFor="student_number">Student ID</label>
                    <input type="text" autoFocus id="student_number" className="form-control" onChange={this.handleStudentIDChange} onKeyPress={this.detectEnterKey} value={editorStore.studentId} />
                    <button onClick={this.handleClick} className="btn btn-primary m-2">Lookup</button>
                </div>
            </div>
        )
    }
}

export default inject(stores => ({
    studentStore: stores.rootStore.studentStore,
    editorStore: stores.rootStore.editorStore
}))(observer(StudentLookupForm))