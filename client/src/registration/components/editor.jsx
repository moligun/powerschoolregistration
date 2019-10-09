import React from 'react'
import { inject, observer} from 'mobx-react'
import EditTicketForm from './editticketform'
import NewTicketForm from './newticketform'
class Editor extends React.Component {
    handleClose = () => {
        this.props.editorStore.displayEditor = false
    }
    handleCommentChange = (event) => {
        const { editorStore } = this.props
        editorStore.description = event.target.value
    }
    handleSubmit = () => {
        this.props.editorStore.submit()
    }

    handleSubmitClose = () => {
        const { editorStore } = this.props
        editorStore.displayEditor = false
        editorStore.submit()
    }
    render() {
        const { editorStore } = this.props
        const existingTicket = editorStore.ticketId > 0 ? true : false
        const ticketTitle = existingTicket ? `Edit Ticket #${editorStore.ticketId}` : 'New Ticket'
        if (editorStore.displayEditor === false) {
            return null
        }
        return (
            <div className="editTicket mt-2 border rounded shadow px-3 pt-2">
                <div className="d-flex w-100 justify-content-between align-items-start">
                    <h1>{ticketTitle}</h1>
                    <button type="button" className="close btn-large" data-dismiss="modal" onClick={this.handleClose} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {existingTicket ? (<EditTicketForm ticket={editorStore} />) : (<NewTicketForm ticket={editorStore} />)}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="d-flex w-100 align-items-baseline justify-content-between my-2">
                            <button type="button" className="btn btn-danger" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-warning text-light" onClick={this.handleSubmitClose}>Save & Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
      );
    }
}
export default inject("editorStore")(observer(Editor))