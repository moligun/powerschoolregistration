import React from 'react'
import Tickets from './ticketlist'
import NewTicketForm from './newticketform'
import EditTicketForm from './editticketform'
import PrintView from './printview'
import { observer, inject } from 'mobx-react'
class UserPortal extends React.Component {
    render() {
        const { editorStore } = this.props
        if (editorStore.printView === true) {
            return (
                <PrintView />
            )
        } else if (editorStore.displayEditor && editorStore.ticketId) {
            return (
                <EditTicketForm />
            )
        } else if (editorStore.displayEditor) {
            return (
                <NewTicketForm />
            )
        } else {
            return (
                <Tickets />
            )
        } 
    }
}

export default inject(stores => ({
    editorStore: stores.rootStore.editorStore
}))(observer(UserPortal))