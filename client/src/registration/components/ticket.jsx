import React from 'react'
import { observer, inject } from 'mobx-react'
import { FaPrint, FaPen } from 'react-icons/fa'
class Ticket extends React.Component {
    handleEdit = () => {
        this.props.editorStore.setTicketId(this.props.ticket.id)
        this.props.editorStore.displayEditor = true
        this.props.editorStore.status = this.props.ticket.status
    }

    handlePrintView = () => {
        const { editorStore, ticket } = this.props
        editorStore.setTicketId(ticket.id)
        editorStore.printView = true
    }

    render() {
        const { ticket } = this.props
        const created = new Date(ticket.created)
        const updated = new Date(ticket.last_updated)
        let category = ticket.category
        category += ticket.subcategory ? `- ${ticket.subcategory}` : ''
        const createdString = ticket.created ? created.toLocaleString('en-US', {timeZone: 'America/Indiana/Indianapolis'}) : ''
        const updatedString = ticket.last_updated ? updated.toLocaleString('en-US', {timeZone: 'America/Indiana/Indianapolis'}) : ''
        return (
            <li className="list-group-item">
                <div className="d-flex justify-content-between align-items-baseline">
                    <h3>{ticket.title}</h3>
                    <div className="d-flex justify-content-between actionbox">
                        <button className="mr-1 btn btn-sm" onClick={this.handleEdit}><FaPen /></button> 
                        <button className="btn btn-sm" onClick={this.handlePrintView}><FaPrint /></button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 col-md-4 text-center">
                        <header><strong>Student</strong></header> 
                        <section><em>{ticket.studentname}</em></section>
                     </div>
                    <div className="col-sm-6 col-md-4 text-center">
                        <header><strong>Category</strong></header> 
                        <section><em>{category}</em></section>
                     </div>
                    <div className="col-sm-6 col-md-4 text-center">
                        <header><strong>Device ID</strong></header> 
                        <section><em>{ticket.device_id}</em></section>
                     </div>
                </div>
                <div className="ticketTextBox ticketDescription">
                    <header><strong>Description</strong></header>
                    <section>{ticket.description}</section>
                </div>
                {ticket.comment && <div className="ticketTextBox ticketLastComment">
                    <header><strong>Last Comment</strong></header>
                    <section>{ticket.comment}</section>
                </div>}
                {updatedString.length > 0 && 
                    <div><em>Updated: {updatedString}</em></div>
                }
                <footer className="d-flex align-items-end justify-content-between">
                    <div><em>Created: {createdString}</em></div>
                    <div><em>Status: {ticket.status}</em></div>
                </footer>
            </li>
        )
    }
}
export default inject(stores => ({
    editorStore: stores.rootStore.editorStore
}))(observer(Ticket))