import Ticket from './ticket.jsx';
import React from 'react';
import { observer, inject } from 'mobx-react';
class Tickets extends React.Component {
    componentDidMount() {
        const { ticketStore } = this.props
        ticketStore.loadTickets()
        this.timer = setInterval((function(self){
            return () => {
                self.loadTickets()}
        })(ticketStore), 50000)
    }
    handleNewTicket = () => {
      const { editorStore } = this.props
      editorStore.ticketId = null
      editorStore.displayEditor = true
    }
    render() {
      const { ticketRegistry } = this.props.ticketStore
      const { displayEditor } = this.props.editorStore
      return (!displayEditor &&
        <React.Fragment>
          <div className="d-flex w-100 justify-content-between align-items-baseline">
              <h1>Tickets</h1>
              <button type="button" className="btn btn-primary btn-sm" onClick={this.handleNewTicket}>
                New Ticket
              </button>
          </div>
          <ul className="list-group">
            {[...ticketRegistry.values()].map((ticket) => <Ticket ticket={ticket} key={ticket.id} />)}
          </ul>
        </React.Fragment>
      )
    }
}
export default inject("ticketStore", "editorStore")(observer(Tickets))