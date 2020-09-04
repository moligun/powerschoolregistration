import React from 'react'
import { observer, inject } from 'mobx-react'
import ContactPhone from './contactphone'
import Select from './select'
import Validation from './validation'
class EditContactForm extends React.Component {
    constructor(props) {
        super(props)
        const { contactEditorStore } = this.props
        contactEditorStore.loadContactInfo()
    }

    componentDidUpdate() {
        const { validation, validatedPhones } = this.props.contactEditorStore
        validation.validate("phoneCount", validatedPhones.length)
    }

    handleChange = (event) => {
       const { contactEditorStore } = this.props
       const { name, type } = event.target
       const { collection } = event.currentTarget.closest('[data-collection]').dataset
       const { index } = event.currentTarget.dataset
       let value
       if (type === "checkbox") {
           value = event.target.checked ? true : false
       } else {
           value = event.target.value
       }
       contactEditorStore.setValue(collection, name, value, index)
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const { contactEditorStore, contactsStore } = this.props
        const { contacts } = contactsStore

        if (contactEditorStore.activeContactId === -1) {
            const contactIndex = contactsStore.addContact()
            contactEditorStore.setContactId(contactIndex)
        }
        if (contacts[contactEditorStore.activeContactId].activeContactStudent === false) {
            contacts[contactEditorStore.activeContactId].addContactStudent()
        }
        contactEditorStore.submit()
    }

    handleAddPhone = (event) => {
        const { contactEditorStore } = this.props
        event.preventDefault()
        contactEditorStore.addPhone()
    }

    handlePhoneDelete = (event) => {
        const { contactEditorStore } = this.props
        event.preventDefault()
        const phoneIndex = parseInt(event.currentTarget.closest('div[data-index]').dataset.index)
        contactEditorStore.deletePhone(phoneIndex)
    }

    handleCancel = (event) => {
        const { contactEditorStore } = this.props
        event.preventDefault()
        contactEditorStore.display = false

    }

    render() {
        const { validation, phones, activeContactStudent, 
                contactDemographics, relationshipOptions, 
                email } = this.props.contactEditorStore
        const firstNameValidation = validation.getValidation('contactDemographics.firstName')
        const lastNameValidation = validation.getValidation('contactDemographics.lastName')
        const phoneCountValidation = validation.getValidation('phoneCount')
        return (
            <div className="form">
                <h3>Edit Contact</h3>
                <fieldset data-collection="contactDemographics">
                    <legend>Contact Information</legend>
                    <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12">
                            <label>First Name</label>
                            <input type="text" value={contactDemographics.firstName} className={`form-control ${firstNameValidation.validated === false ? 'border-danger' : ''}`} name="firstName" onChange={this.handleChange} />
                            <Validation validation={firstNameValidation} />
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label>Last Name</label>
                            <input type="text" value={contactDemographics.lastName} className={`form-control ${lastNameValidation.validated === false ? 'border-danger' : ''}`} name="lastName" onChange={this.handleChange} />
                            <Validation validation={lastNameValidation} />
                        </div>
                        <div className="form-group col-md-6 col-sm-12" data-collection="email">
                            <label>Email</label>
                            <input type="text" value={email.address} className="form-control" name="address" onChange={this.handleChange} />
                        </div>
                    </div>
                </fieldset>
                <fieldset data-collection="activeContactStudent">
                    <div className="form-row">
                        <Select field={{"name": "relationship", 
                            "value": activeContactStudent.studentDetails.relationship}} 
                            label="Relationship" options={relationshipOptions} onChange={this.handleChange} />
                        <div className="form-group d-flex flex-wrap justify-content-start w-100">
                            <div className="form-check form-check-inline w-50 mx-0">
                                <input className="form-check input"  name="custodial" type="checkbox" 
                                    value="1" onChange={this.handleChange} checked={ activeContactStudent.studentDetails.custodial } />
                                <label className="form-check-label pl-1">Has Custody</label>
                            </div>
                            <div className="form-check form-check-inline w-50 mx-0">
                                <input className="form-check input" name="livesWith" type="checkbox" 
                                    value="1" onChange={this.handleChange} checked={ activeContactStudent.studentDetails.livesWith } />
                                <label className="form-check-label pl-1">Lives With</label>
                            </div>
                            <div className="form-check form-check-inline w-50 mx-0">
                                <input className="form-check input" name="schoolPickup" type="checkbox" 
                                    value="1" onChange={this.handleChange} checked={ activeContactStudent.studentDetails.schoolPickup } />
                                <label className="form-check-label pl-1">School Pickup</label>
                            </div>
                            <div className="form-check form-check-inline w-50 mx-0">
                                <input className="form-check input" name="emergency" type="checkbox" 
                                    value="1" onChange={this.handleChange} checked={ activeContactStudent.studentDetails.emergency } />
                                <label className="form-check-label pl-1">Emergency Contact</label>
                            </div>
                            <div className="form-check form-check-inline w-50 mx-0">
                                <input className="form-check input" name="receivesMail" type="checkbox" 
                                    value="1" onChange={this.handleChange} checked={ activeContactStudent.studentDetails.receivesMail } />
                                <label className="form-check-label pl-1">Receives Mail</label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <fieldset data-collection="phones">
                    <legend>Phones</legend>
                    <div className="form-group">
                        <button className="btn btn-sm btn-primary" onClick={this.handleAddPhone}>Add Phone</button>
                    </div>
                    <Validation validation={phoneCountValidation} />
                    <ul className={`list-group`}>
                        {phones.map((phone, index) => 
                            <li className="list-group-item" draggable="true" key={'phone-' + index}>
                                <ContactPhone phone={ phone } index={ index } handleChange={this.handleChange} handlePhoneDelete={this.handlePhoneDelete} />
                            </li>
                        )}
                    </ul> 
                    <div className="form-row d-flex justify-content-between py-5">
                        <button className="btn btn-sm btn-primary" onClick={this.handleCancel}>Cancel</button>
                        <button className="btn btn-sm btn-primary" onClick={this.handleSubmit} disabled={!validation.allValidated}>Submit</button>
                    </div>
                </fieldset>
            </div>
        )
    }
}

export default inject(stores => ({
    contactEditorStore: stores.rootStore.contactEditorStore,
    contactsStore: stores.rootStore.contactsStore
}))(observer(EditContactForm))