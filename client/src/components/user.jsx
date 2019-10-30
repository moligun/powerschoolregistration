import React from 'react'
import { observer, inject } from 'mobx-react'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
class User extends React.Component {
    handleClick = (event) => {
        const { user, userStore } = this.props
        event.preventDefault()
        const direction = event.currentTarget.dataset.dir
        userStore.updateAccess(user.id, direction)
    }

    render() {
        const { user } = this.props
        const nextLevel = user.access_level + 1
        const prevLevel = user.access_level - 1
        return (
            <tr>
                <td>{user.id}</td>
                <td>{user.lastname}</td>
                <td>{user.firstname}</td>
                <td>{user.email}</td>
                <td>{user.access_level}</td>
                <td>
                    {prevLevel >= 0 && 
                    <button onClick={this.handleClick} data-dir={"down"} className="btn">
                        <FaArrowDown />
                    </button>
                    }
                    {nextLevel <= 2 && 
                    <button onClick={this.handleClick} data-dir={"up"} className="btn">
                        <FaArrowUp />
                    </button>
                    }
                </td>
            </tr>
        )
    }
}
export default inject(stores => ({
    userStore: stores.rootStore.userStore
}))(observer(User))