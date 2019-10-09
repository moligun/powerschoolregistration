import React from 'react'
import { observer, inject } from 'mobx-react'
class Ticket extends React.Component {
    handleEdit = async () => {
        this.props.editorStore.displayEditor = false
        this.props.editorStore.setTicketId(this.props.ticket.id)
        await this.props.editorStore.loadTicketInfo()
        this.props.editorStore.displayEditor = true
    }

    render() {
        return (
            <li className="list-group-item">
                <div>{this.props.ticket.description}</div>
                <button className="mx-auto" onClick={this.handleEdit}>Edit</button>
            </li>
        )
    }
}
export default inject("editorStore")(observer(Ticket))