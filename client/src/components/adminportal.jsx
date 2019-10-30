import React from 'react'
import { observer, inject } from 'mobx-react'
import Categories from './categorieslist'
import Users from './userlist'
class AdminPortal extends React.Component {
    render() {
        const { adminPage } = this.props.editorStore
        switch (adminPage) {
            case 'categories':
                return (<Categories />)
            case 'users':
            default:
                return (<Users />)

        }
    }
}

export default inject(stores => ({
    editorStore: stores.rootStore.editorStore
}))(observer(AdminPortal))