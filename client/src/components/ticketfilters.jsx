import React from 'react';
import { observer, inject } from 'mobx-react';
import CategorySelector from './categoryselector'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import ticket from './ticket';
class TicketFilters extends React.Component {
    handleCategoryChange = (event) => {
      const { ticketStore } = this.props
      if (event.target.name === 'category') {
        ticketStore.setFilters('category_id', event.target.value)
        ticketStore.setFilters('subcategory_id', '')
      } else if (event.target.name === 'subcategory') {
        ticketStore.setFilters('subcategory_id', event.target.value)
      }
    }

    handleStartDateChange = (date) => {
      const { ticketStore } = this.props
      const dateRange = ticketStore.activeFilters.get('daterange')
      dateRange['startdate'] = date
      ticketStore.setFilters('daterange', dateRange)
    }

    handleEndDateChange = (date) => {
      const { ticketStore } = this.props
      const dateRange = ticketStore.activeFilters.get('daterange')
      dateRange['enddate'] = date
      ticketStore.setFilters('daterange', dateRange)
    }

    handleSearch = (event) => {
      const { ticketStore } = this.props
      ticketStore.setFilters('search', event.target.value)
    }

    handleFilterClose = () => {
      const { ticketStore } = this.props
      ticketStore.showFilters = false
    }

    handleCheck = (event) => {
      const { ticketStore } = this.props
      const splitName = event.target.name.split('.')
      const name = splitName[1]
      if (ticketStore.filterStatus.indexOf(name) === -1) {
        ticketStore.filterStatus.push(name)
      } else {
        let newArray = ticketStore.filterStatus.filter((value) => {
          if (value !== name) {
            return value
          } 
          return false
        })
        ticketStore.setFilters('status', newArray)
      }
    }

    handleApply = () => {
      const { ticketStore } = this.props
      ticketStore.updatePage(1)
      ticketStore.showFilters = false
    }

    handleReset = () => {
      const { ticketStore } = this.props
      ticketStore.setInitialFilters()
      ticketStore.loadTickets()
    }

    render() {
      const { 
        ticketStatus, filterSearch, 
        filterStatus, filterCategory, 
        filterSubcategory, filterStartDate, 
        filterEndDate 
      } = this.props.ticketStore
      return (
          <div className="filters d-flex flex-column align-items-stretch justify-content-between w-100">
              <div className="d-flex w-100 align-items-baseline justify-content-between">
                  <h1>Filters</h1>
                  <button type="button" className="close btn-large" data-dismiss="modal" onClick={this.handleFilterClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div className="form-group">
                <legend>Date Range</legend>
                <label className="d-block">Start Date</label>
                <DatePicker selected={filterStartDate} name="startdate" onChange={this.handleStartDateChange} className="form-control" />
                <label className="d-block">End Date</label>
                <DatePicker selected={filterEndDate} name="enddate" onChange={this.handleEndDateChange} className="form-control" />
              </div>
              <div className="form-group">
                <legend>Category</legend>
                <CategorySelector category={filterCategory} subcategory={filterSubcategory} handleCategory={this.handleCategoryChange} />
              </div>
              <div className="form-group">
                <legend>Status</legend>
                {Object.keys(ticketStatus).map((value) => 
                  <div key={`status.${value}`} className="form-check form-check-inline">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      name={'status.' + value} 
                      id={'status.' + value} 
                      checked={filterStatus.indexOf(value) !== -1 ? true : false}
                      onChange={this.handleCheck}
                    />
                    <label className="form-check-label" htmlFor={'status.' + value}>{ticketStatus[value]}</label>
                  </div>
                )}
              </div>
              <div className="form-group">
                <legend>Search</legend>
                <input type="text" name="search" placeholder="Student Name, Number, or Device ID" className="form-control" onChange={this.handleSearch} value={filterSearch}/>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-sm btn-primary" onClick={this.handleApply}>Apply Filters</button>
                <button className="btn btn-sm btn-danger" onClick={this.handleReset}>Clear Filters</button>
              </div>
          </div>
      )
    }
}
export default inject(stores => ({
  ticketStore: stores.rootStore.ticketStore
}))(observer(TicketFilters))