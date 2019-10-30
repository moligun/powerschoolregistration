import React from 'react'
import { observer, inject } from 'mobx-react'
class AdminToggle extends React.Component {
    handleClick = () => {
        const { editorStore } = this.props
        editorStore.displayAdmin = !editorStore.displayAdmin
    }
    render() {
        const {authStore, editorStore } = this.props
        if (!authStore.isAdmin) {
            return null
        }
        return (
            <button className="btn btn-sm btn-secondary" onClick={this.handleClick}>
                Go to {!editorStore.displayAdmin ? 'Admin Portal' : 'Standard Portal'}
            </button>
        )
    }
}
export default inject(stores => ({
    editorStore: stores.rootStore.editorStore,
    authStore: stores.rootStore.authStore
}))(observer(AdminToggle))