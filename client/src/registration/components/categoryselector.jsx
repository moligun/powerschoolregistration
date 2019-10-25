import { observer, inject } from 'mobx-react';
import React from 'react';
import Loading from './loading'

class CategorySelector extends React.Component {
  componentDidMount() {
    const { category, categoryStore } = this.props
    if (category > 0) {
      categoryStore.loadSubCategories(category)
    }
  }
  handleCategoryChange = (event) => {
    const { categoryStore } = this.props
    if (event.target.name === 'category') {
      categoryStore.loadSubCategories(event.target.value)
    }
    this.props.handleCategory(event)
  }

  render() {
    const { categoryStore, category, subcategory } = this.props
    if (!categoryStore.categories) {
      return (
        <Loading />
      )
    }
    return (
      <div className="form-row">
        <div className="form-group col-sm-12">
            <select className="form-control" name="category" onChange={this.handleCategoryChange} value={category}>
              <option key="category.none" value="">Select Category...</option>
              {categoryStore.categories.map((category) =>
                <option key={'category.' + category.id} value={category.id}>{category.title}</option>
              )}
            </select>
        </div>
        {categoryStore.subcategories && 
          <div className="form-group col-sm-12">
            <select className="form-control" name="subcategory" value={subcategory} onChange={this.handleCategoryChange}>
                <option value="">Select Sub-Category...</option>
                {(categoryStore.subcategories).map((subcategory) =>
                        <option key={'subcategory.' + subcategory.id} value={subcategory.id}>{subcategory.title}</option>
                )}
            </select>
          </div>
        }
      </div>
    )
  }
}
export default inject(stores => ({
  categoryStore: stores.rootStore.categoryStore
}))(observer(CategorySelector));
