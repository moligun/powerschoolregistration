import React from 'react'
import { observer, inject } from 'mobx-react'
import ContactPhone from './contactphone'
import Select from './select'
import Validation from './validation'
import NestedRadio from './nestedradio'
import Formatter from '../stores/formatter'
class EditContactForm extends React.Component {
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
        let format = event.currentTarget.dataset.format
        if (format) {
            value = Formatter[format](value) 
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
        contactEditorStore.resetDefault()

    }

    render() {
        const { validation, activeContactStudent, phones,
                contactExtension, contactDemographics, relationshipOptions, 
                titleOptions, email } = this.props.contactEditorStore
        const firstNameValidation = validation.getValidation('contactDemographics.firstName')
        const lastNameValidation = validation.getValidation('contactDemographics.lastName')
        const phoneCountValidation = validation.getValidation('phoneCount')
        return (
            <div className="form">
                <h3>Edit Contact</h3>
                <fieldset data-collection="contactDemographics">
                    <legend>Contact Information</legend>
                    <div className="form-row">
                        <Select 
                        field={{"name": "prefix", "value": contactDemographics.prefix}} 
                            label="Title" options={titleOptions} onChange={this.handleChange} />
                        <div className="form-group col-md-4 col-sm-12">
                            <label className="font-weight-bold">First Name</label>
                            <input type="text" value={contactDemographics.firstName} className={`form-control ${firstNameValidation.validated === false ? 'border-danger' : ''}`} name="firstName" onChange={this.handleChange} />
                            <Validation validation={firstNameValidation} />
                        </div>
                        <div className="form-group col-md-4 col-sm-12">
                            <label className="font-weight-bold">Last Name</label>
                            <input type="text" value={contactDemographics.lastName} className={`form-control ${lastNameValidation.validated === false ? 'border-danger' : ''}`} name="lastName" onChange={this.handleChange} />
                            <Validation validation={lastNameValidation} />
                        </div>
                        <div className="form-group col-md-6 col-sm-12">
                            <label className="font-weight-bold">Employer</label>
                            <input type="text" value={contactDemographics.employer} className={`form-control ${lastNameValidation.validated === false ? 'border-danger' : ''}`} name="employer" onChange={this.handleChange} />
                        </div>
                        <div className="form-group col-md-6 col-sm-12" data-collection="email">
                            <label className="font-weight-bold">Email</label>
                            <input type="text" value={email.address} className="form-control" name="address" onChange={this.handleChange} />
                        </div>
                    </div>
                </fieldset>
                <fieldset data-collection="contactExtension">
                    <div className="form-row">
                        <NestedRadio 
                            field={contactExtension.getOrCreateField('needsinterpreterassist', 'Boolean')} 
                            options={[{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]}
                            className="col-sm-12 col-md-6"
                            label="Needs a Translator?" onChange={this.handleChange}
                            validation={validation.getValidation('contactExtension.needsinterpreterassist')} />
                    </div>
                </fieldset>
                <fieldset data-collection="activeContactStudent">
                    <div className="form-row">
                        <Select 
                        field={{"name": "relationship", "value": activeContactStudent.studentDetails.relationship}} 
                            label="Relationship" options={relationshipOptions} onChange={this.handleChange}
                            validation={validation.getValidation('activeContactStudent.relationship')} />
                        <div className="form-group d-flex flex-wrap justify-content-start w-100">
                            <div className="col-sm-12 col-md-6">
                                <NestedRadio 
                                    field={{"name": "emergency", "value": activeContactStudent.studentDetails.emergency}} 
                                    options={[{"label": "Yes", "value": true}, {"label": "No", "value": false}]}
                                    label="Emergency Contact?" onChange={this.handleChange}
                                    validation={validation.getValidation('activeContactStudent.emergency')} />
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <NestedRadio 
                                    field={{"name": "custodial", "value": activeContactStudent.studentDetails.custodial}} 
                                    options={[{"label": "Yes", "value": true}, {"label": "No", "value": false}]}
                                    label="Has Custody?" onChange={this.handleChange}
                                    validation={validation.getValidation('activeContactStudent.custodial')} />
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <NestedRadio 
                                    field={{"name": "schoolPickup", "value": activeContactStudent.studentDetails.schoolPickup}} 
                                    options={[{"label": "Yes", "value": true}, {"label": "No", "value": false}]}
                                    label="Can pick up student?" onChange={this.handleChange}
                                    validation={validation.getValidation('activeContactStudent.schoolPickup')} />
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <NestedRadio 
                                    field={{"name": "livesWith", "value": activeContactStudent.studentDetails.livesWith}} 
                                    options={[{"label": "Yes", "value": true}, {"label": "No", "value": false}]}
                                    label="Lives with student?" onChange={this.handleChange} 
                                    validation={validation.getValidation('activeContactStudent.livesWith')} />
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
                            phone.markedForDeletion === false  && phone.deleted === false ?
                                <li className="list-group-item" draggable="true" key={'phone-' + index}>
                                    <ContactPhone phone={ phone } index={ index } handleChange={this.handleChange} handlePhoneDelete={this.handlePhoneDelete} />
                                </li> : ''
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