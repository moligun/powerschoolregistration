import Ticket from './ticket.jsx';
import Pagination from './pagination.jsx';
import React from 'react';
import { observer, inject } from 'mobx-react';
import TicketFilters from './ticketfilters'
class Tickets extends React.Component {

    handleNewTicket = () => {
      const { editorStore, studentStore } = this.props
      editorStore.ticketId = null
      editorStore.displayEditor = true
      studentStore.student = undefined
      studentStore.errors = []
    }

    handleShowFilters = () => {
      const { ticketStore } = this.props
      ticketStore.showFilters = !ticketStore.showFilters
    }
    render() {
      const { 
        ticketRegistry, 
        showFilters, 
        activePage, 
        totalPages,
        updatePage 
      } = this.props.ticketStore
      if (!ticketRegistry) {
        return null
      }
      return (
        <React.Fragment>
          {showFilters && <TicketFilters />}
          <div className="d-flex w-100 justify-content-between align-items-baseline">
              <h1>Tickets</h1>
              <button type="button" className="btn btn-secondary btn-sm" onClick={this.handleShowFilters}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={this.handleNewTicket}>
                New Ticket
              </button>
          </div>
          <ul className="list-group">
            {[...ticketRegistry.values()].map((ticket) => <Ticket ticket={ticket} key={ticket.id} />)}
          </ul>
          <Pagination activePage={activePage} totalPages={totalPages} updatePage={updatePage} />
        </React.Fragment>
      )
    }
}
export default inject(stores => ({
  ticketStore: stores.rootStore.ticketStore,
  editorStore: stores.rootStore.editorStore,
  studentStore: stores.rootStore.studentStore
}))(observer(Tickets))