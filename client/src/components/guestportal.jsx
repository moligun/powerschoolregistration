import React from 'react'
import StudentLookupForm from './studentlookupform';
import NewTicketForm from './newticketform';
import PrintView from './printview'
import { observer, inject } from 'mobx-react'
class GuestPortal extends React.Component {
    render() {
        const { editorStore } = this.props
        if (editorStore.printView === true) {
            return (
                <PrintView />
            )
        } else if (editorStore.displayEditor && editorStore.errors.student.length === 0) {
            return (
                <NewTicketForm />
            )
        } else {
            return (
                <div className="center-container d-flex flex-column justify-content-center">
                    <div className="jumbotron">
                        <h1>Scan Student Badge</h1>
                        <StudentLookupForm />
                    </div>
                </div>
            )
        }
    }
}

export default inject(stores => ({
    editorStore: stores.rootStore.editorStore
}))(observer(GuestPortal))