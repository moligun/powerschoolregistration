import React from 'react'
import { observer, inject } from 'mobx-react'
class AdminTabs extends React.Component {
    handleClick = (event) => {
        const { editorStore } = this.props
        editorStore.adminPage = event.currentTarget.dataset.page
    }
    render() {
        const pages = {
            'users': 'Users',
            'categories': 'Categories'
        }
        const { editorStore } = this.props
        return (
            <ul className="nav nav-tabs">
                {Object.keys(pages).map((page) => {
                    let pageClass = 'nav-link'
                    pageClass += editorStore.adminPage === page ? ' active' : ''
                    return (
                        <li className="nav-item">
                            <button className={pageClass} onClick={this.handleClick} data-page={page}>{pages[page]}</button>
                        </li>
                    )
                })}
            </ul>
        )
    }
}
export default inject(stores => ({
    editorStore: stores.rootStore.editorStore
}))(observer(AdminTabs))