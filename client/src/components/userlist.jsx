import Pagination from './pagination.jsx'
import React from 'react'
import { observer, inject } from 'mobx-react'
import User from './user'
import AdminTabs from './admintabs'
class Users extends React.Component {
    handleSearch = (event) => {
      const { userStore } = this.props
      userStore.activeFilters['search'] = event.target.value
    }

    handleClick = (event) => {
      event.preventDefault()
      const { userStore } = this.props
      userStore.loadUsers()
    }
    render() {
      const { 
        userRegistry,
        activePage,
        updatePage, 
        totalPages,
        itemsPerPage,
        updateItemsPerPage } = this.props.userStore
      if (!userRegistry) {
        return null
      }
      return (
        <React.Fragment>
          <AdminTabs />
          <div className="d-flex w-100 justify-content-between align-items-baseline">
              <h1>Users</h1>
              <div className="d-flex searchBox form-group">
                <input type="text" className="form-control mr-1" onChange={this.handleSearch} placeholder="Email or Name" />
                <button className="btn btn-primary btn-sm" onClick={this.handleClick}>Search</button>
              </div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>E-mail</th>
                <th>Access Level</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...userRegistry.values()].map((user) => <User key={user.id} user={user} />)}
            </tbody>
          </table>
          <Pagination 
            activePage={activePage} 
            totalPages={totalPages} 
            updatePage={updatePage}
            itemsPerPage={itemsPerPage}
            updateItemsPerPage={updateItemsPerPage}
          />
        </React.Fragment>
      )
    }
}
export default inject(stores => ({
  userStore: stores.rootStore.userStore
}))(observer(Users))