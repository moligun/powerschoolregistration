import Ticket from './ticket.jsx'
import Pagination from './pagination.jsx'
import React from 'react';
import { observer, inject } from 'mobx-react'
import TicketFilters from './ticketfilters'
import FileDownload from 'js-file-download'
class Tickets extends React.Component {

    handleNewTicket = () => {
      const { editorStore, studentStore } = this.props
      editorStore.ticketId = null
      editorStore.displayEditor = true
      studentStore.student = undefined
      studentStore.errors = []
    }

    handleDownload = async () => {
      const { ticketStore } = this.props
      const fileString = await ticketStore.getCsvString()
      const currentDate = new Date()
      let year = currentDate.getFullYear()
      let date = currentDate.getDate()
      let month = currentDate.getMonth() + 1
      let hour = currentDate.getHours()
      let minutes = currentDate.getMinutes()
      let seconds = currentDate.getSeconds()
      let currentDateString = ''
      currentDateString += year.toString() + month.toString() + date.toString()
      currentDateString += hour.toString() + minutes.toString() + seconds.toString()
      const fileName = `${currentDateString}-ticketexport.csv`
      FileDownload(fileString, fileName)
    }

    handleShowFilters = () => {
      const { ticketStore } = this.props
      ticketStore.showFilters = !ticketStore.showFilters
    }
    render() {
      const { 
        ticketRegistry, 
        showFilters,
        loadingFile,
        activePage, 
        totalPages,
        updatePage,
        itemsPerPage,
        updateItemsPerPage,
        totalRecords
      } = this.props.ticketStore
      if (!ticketRegistry) {
        return null
      }
      return (
        <React.Fragment>
          {showFilters && <TicketFilters />}
              <h1>Tickets</h1>
          <div className="d-flex w-100 justify-content-between align-items-baseline">
              <button type="button" className="btn btn-secondary btn-sm" onClick={this.handleShowFilters}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button type="button" disabled={loadingFile} className="btn btn-secondary btn-sm" onClick={this.handleDownload}>
                { !loadingFile ? "Export" : "Downloading..." }
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={this.handleNewTicket}>
                New Ticket
              </button>
          </div>
          <div><em>{totalRecords ? totalRecords : 0 } Results</em></div>
          <ul className="list-group">
            {[...ticketRegistry.values()].map((ticket) => <Ticket ticket={ticket} key={ticket.id} />)}
          </ul>
          <Pagination 
            activePage={activePage} 
            totalPages={totalPages} 
            updatePage={updatePage} 
            itemsPerPage={itemsPerPage}
            updateItemsPerPage={updateItemsPerPage} />
        </React.Fragment>
      )
    }
}
export default inject(stores => ({
  ticketStore: stores.rootStore.ticketStore,
  editorStore: stores.rootStore.editorStore,
  studentStore: stores.rootStore.studentStore
}))(observer(Tickets))