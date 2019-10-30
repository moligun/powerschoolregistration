import React from 'react'
import { observer, inject } from 'mobx-react'
import Loading from './loading'
class Category extends React.Component {
    constructor(props) {
        super(props)
        this.state = {loading: false}
    }

    handleParentChange = async (event) => {
        this.setState({loading: true})
        const { categoryStore, category } = this.props
        await categoryStore.updateParentCategory(category.id, event.target.value)
        this.setState({loading: false})

    }

    render() {
        const { category, categoryStore } = this.props
        return (
            <tr>
                <td>{category.id}</td>
                <td>{category.title}</td>
                <td>
                    {
                        this.state.loading ? 
                            <Loading /> 
                            :
                            <select value={category.parent_id} className="form-control" onChange={this.handleParentChange}>
                                <option value="0">No Parent</option>
                                {[...categoryStore.parentCategories.values()].map((cat) => { 
                                    if (category.id !== cat.id) {
                                        return (
                                            <option value={cat.id}>{cat.title}</option>
                                        )
                                    }
                                    return false
                                })}
                            </select>
                    }
                </td>
            </tr>
        )
    }
}
export default inject(stores => ({
    categoryStore: stores.rootStore.categoryStore
}))(observer(Category))