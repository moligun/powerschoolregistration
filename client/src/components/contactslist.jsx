import React from 'react'
import { observer, inject } from 'mobx-react'
import EditContactForm from './editcontactform'
import Contact from './contact'
import Validation from './validation'
import Loading from './loading'
class ContactsList extends React.Component {
    componentDidMount() {
        const { formStore, contactsStore } = this.props
        if (formStore.student && contactsStore.validatedStudentContacts) {
            const values = {"count": contactsStore.validatedStudentContacts.length}
            formStore.student.contactInformationValidation.validateAll(values)
        }
    }

    componentDidUpdate() {
        const { formStore, contactsStore } = this.props
        if (formStore.student && contactsStore.validatedStudentContacts) {
            const values = {"count": contactsStore.validatedStudentContacts.length}
            formStore.student.contactInformationValidation.validateAll(values)
        }
    }

    handleUp = (event) => {
        event.preventDefault()
        const currentIndex = parseInt(event.currentTarget.closest('li').dataset.index)
        const nextIndex = currentIndex - 1
        if (currentIndex === 0) {
            return
        }
        const { activeStudentContacts } = this.props.contactsStore
        const currentContact = activeStudentContacts[currentIndex]
        const nextContact = activeStudentContacts[nextIndex]
        const currentContactSequence = currentContact.activeContactStudent.sequence
        const replaceContactSequence = currentContactSequence - 1 
        currentContact.activeContactStudent.sequence = replaceContactSequence
        nextContact.activeContactStudent.sequence = currentContactSequence
    }

    handleDropdown = (event) => {
        const buttonGroup = event.currentTarget.closest('.btn-group')
        buttonGroup.querySelector('.dropdown-menu').classList.toggle('show')
    }

    handleDown = (event) => {
        event.preventDefault()
        const currentIndex = parseInt(event.currentTarget.closest('li').dataset.index)
        const nextIndex = currentIndex + 1
        const { activeStudentContacts } = this.props.contactsStore
        const itemCount = activeStudentContacts.length
        if (itemCount === (currentIndex + 1)) {
            return
        }
        const currentContact = activeStudentContacts[currentIndex]
        const nextContact = activeStudentContacts[nextIndex]
        const currentContactSequence = currentContact.activeContactStudent.sequence
        const replaceContactSequence = currentContactSequence + 1 
        currentContact.activeContactStudent.sequence = replaceContactSequence
        nextContact.activeContactStudent.sequence = currentContactSequence
    }

    handleAdd = (event) => {
        event.preventDefault()
        const { contactEditorStore } = this.props
        contactEditorStore.setContactId(-1)
        contactEditorStore.display = true
    }

    handleAddExisting = (event) => {
        event.preventDefault()
        const { contactEditorStore } = this.props
        const indexId = parseInt(event.currentTarget.dataset.index)
        contactEditorStore.setContactId(indexId)
        contactEditorStore.display = true
    }

    render() {
        const { contactsStore, contactEditorStore, formStore } = this.props
        const { student } = formStore
        const { contactInformationValidation } = student
        const { activeStudentContacts, unusedStudentContacts } = contactsStore
        const itemCount = activeStudentContacts.length
        if (!contactsStore.contacts) {
            return (<Loading />)
        }
        if (contactEditorStore.display && contactEditorStore.activeContactId !== undefined) {
            return (<EditContactForm />)
        }
        return (
            <fieldset>
                <div className="d-flex align-items-center mb-1">
                    <legend className="w-25">Contacts</legend>
                    <div className="btn-group" role="group">
                        <button id="btnGroupDrop1" type="button" onClick={this.handleDropdown} className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add Contact
                        </button>
                        <div className="dropdown-menu p-2" aria-labelledby="btnGroupDrop1">
                            <button className="btn btn-primary w-100" onClick={this.handleAdd}>Add New</button>
                            {unusedStudentContacts.map((contact) => <button key={`existing-contact-${contact.indexId}`} onClick={this.handleAddExisting} className="btn btn-link w-100" data-index={contact.indexId}>{contact.contactDemographics.lastName + ', ' + contact.contactDemographics.firstName}</button>)}

                        </div>
                    </div>
                </div>
                <div>
                    <Validation validation={contactInformationValidation.getValidation("count")} className="alert alert-danger" />
                    {activeStudentContacts.length > 0 && 
                        <ul className="list-group">
                            {activeStudentContacts.map((contact, index) => 
                                <Contact contact={contact} key={`contact-${index}`} 
                                    handleClick={this.handleClick} index={ index } 
                                    handleUp={ this.handleUp } handleDown ={ this.handleDown } itemCount={ itemCount } />
                            )}
                        </ul>
                    }
                </div>
            </fieldset>
        )
    }
}

export default inject(stores => ({
    contactsStore: stores.rootStore.contactsStore,
    contactEditorStore: stores.rootStore.contactEditorStore,
    formStore: stores.rootStore.formStore
}))(observer(ContactsList))