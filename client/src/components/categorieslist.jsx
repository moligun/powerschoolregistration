import Category from './category'
import React from 'react'
import { observer, inject } from 'mobx-react'
import AdminTabs from './admintabs'
class Categories extends React.Component {
    handleTitle = (event) => {
      const { categoryStore } = this.props
      categoryStore.newTitle = event.target.value
    }

    handleClick = () => {
      const { categoryStore } = this.props
      categoryStore.createCategory()
    }

    render() {
      const { categoryStore } = this.props
      if (!categoryStore.allCategories) {
        return null
      }
      return (
        <React.Fragment>
          <AdminTabs />
          <div className="d-flex w-100 justify-content-between align-items-baseline">
              <h1>Categories</h1>
              <div className="d-flex searchBox form-group">
                <input type="text" className="form-control mr-1" onChange={this.handleTitle} placeholder="Category Title" value={categoryStore.newTitle} />
                <button className="btn btn-primary btn-sm" onClick={this.handleClick}>Add</button>
              </div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Parent</th>
              </tr>
            </thead>
            <tbody>
              {[...categoryStore.allCategories.values()].map((category) => <Category key={category.id} category={category} />)}
            </tbody>
          </table>
        </React.Fragment>
      )
    }
}
export default inject(stores => ({
  categoryStore: stores.rootStore.categoryStore
}))(observer(Categories))