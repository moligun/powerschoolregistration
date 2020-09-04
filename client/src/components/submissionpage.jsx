import React from 'react'
import { inject, observer} from 'mobx-react'
class SubmissionPage extends React.Component {
    handleSubmit = (event) => {
        event.preventDefault()
        const { formStore, contactsStore } = this.props
        const firstContact = contactsStore.contacts[0]
        formStore.processSubmissions()
        formStore.changeSection(1)
        window.scrollTo(0, 0)
    }

    handlePrevious = (event) => {
        event.preventDefault()
        const { formStore } = this.props
        formStore.changeSection(-1)
        window.scrollTo(0, 0)
    }

    render() {
        const { studentStore } = this.props
        return (
            <div>
                <div>
                    <p>{studentStore.asJSON}</p>
                </div>
                <div className="w-100 d-flex justify-content-between">
                    <button onClick={this.handlePrevious} className="btn btn-secondary">Previous</button>
                    <button onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
                </div>
            </div>
        )
    }
}
export default inject(stores => ({
  formStore: stores.rootStore.formStore,
  studentStore: stores.rootStore.studentStore,
  contactsStore: stores.rootStore.contactsStore
}))(observer(SubmissionPage))