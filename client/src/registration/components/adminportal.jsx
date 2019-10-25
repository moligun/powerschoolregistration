import React from 'react'
import { observer, inject } from 'mobx-react'
import Users from './userlist'
class AdminPortal extends React.Component {
    render() {
        return (
            <Users />
        )
    }
}

export default inject(stores => ({
    userStore: stores.rootStore.userStore
}))(observer(AdminPortal))