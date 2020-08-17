import React from 'react'
import { observer, inject } from 'mobx-react'
import StudentsList from './studentslist'
import StudentInfoForm from './studentinfoform'
class GuestPortal extends React.Component {
    render() {
        const { activeStudentIndex } = this.props.formStore
        return (
            <React.Fragment>
                <StudentsList />
                {activeStudentIndex !== undefined && <StudentInfoForm />}
            </React.Fragment>
        )
    }
}

export default inject(stores => ({
    formStore: stores.rootStore.formStore
}))(observer(GuestPortal))