import React from 'react'
import { observer, inject } from 'mobx-react'
import { FaSortUp, FaSortDown } from 'react-icons/fa'
import Select from './select'
class Contact extends React.Component {
    state = {
        order: 0
    }
    componentDidMount() {
        this.setState({order: this.props.index + 1})
    }

    handleEdit = (event) => {
        const { contactEditorStore, contact } = this.props
        event.preventDefault()
        contactEditorStore.setContactId(contact.indexId)
        contactEditorStore.display = true
        contactEditorStore.editValid = true
        contactEditorStore.loadContactInfo()
        window.scrollTo(0, 0)
    }

    handleRemove = (event) => {
        event.preventDefault()
        const { contact, formStore } = this.props
        contact.removeActiveStudent()
        formStore.refreshActiveSectionValidation()
    }

    handleOrderChange = (event) => {
        const { activeStudentContacts } = this.props.contactsStore
        const currentIndex = this.props.index
        const nextIndex = event.currentTarget.value - 1
        if (currentIndex !== undefined && nextIndex !== undefined && (currentIndex !== nextIndex)) {
            const currentContact = activeStudentContacts[currentIndex]
            const nextContact = activeStudentContacts[nextIndex]
            const currentContactSequence = currentContact.activeContactStudent.sequence
            const replaceContactSequence = nextContact.activeContactStudent.sequence
            currentContact.activeContactStudent.sequence = replaceContactSequence
            nextContact.activeContactStudent.sequence = currentContactSequence
        }
    }

    render() {
        const { contact } = this.props
        const { activeContactStudent, contactDemographics } = contact
        const validationElement = contact.validation.allValidated ? null : <div className="alert alert-danger"><small>Missing Required Fields. Click Edit to Fix.</small></div>
        const studentDetails = []
        const studentDetailLabels = {
            "emergency": "Emergency Contact?",
            "custodial": "Has Custody?",
            "schoolPickup": "Can pick up student?",
            "livesWith": "Lives with student?"
        }
        const priorityOptions = [...Array(this.props.itemCount).keys()].map(
            (id) => {
                return {"label": id + 1, "value": id + 1}
            }
        )

        for (const key in studentDetailLabels) {
            studentDetails.push(
                <div className="col-md-6 col-sm-12 d-flex justify-content-between align-items-center" key={`contact-${this.props.index}-${key}`}>
                    <span className="font-weight-bold">{studentDetailLabels[key]}</span> 
                    {activeContactStudent.studentDetails[key].toString() === 'true' ? <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>}
                </div>
            )
        }
        return (
            <li draggable="true" id={`contact-${this.props.index}`} key={'contact-' + this.props.index} className="list-group-item" data-id={contact.id} data-index={ this.props.index } 
                onDragStart={this.props.handleDragStart} onDragOver={this.props.handleDragOver} onDragEnd={this.props.handleDragEnd}>
                {validationElement}
                <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex align-items-baseline">
                        <span className="font-weight-bold">Priority #</span>
                        <Select options={priorityOptions} noBlank={true} field={{"name": `contact-${this.props.index}`, "value": this.state.order}} 
                            onChange={this.handleOrderChange} />
                    </div>
                    {contact.loggedInUser && <div><span className="badge badge-info badge-pill">Your Account (Cannot be removed) </span></div>}
                    <div className="button-group">
                        <button className="btn btn-sm btn-primary mr-1" onClick={this.handleEdit}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={this.handleRemove} disabled={contact.loggedInUser}>Remove</button>
                    </div>
                </div>
                <div className="d-flex align-items-top">
                    <div className="button-group d-flex flex-column mr-3">
                        {this.props.index ? 
                            <button className="btn btn-link p-0" onClick={event => this.props.handleUp(event, this.props.index)}><FaSortUp size="2em" /></button> 
                            :
                            null 
                        }

                        {this.props.index < (this.props.itemCount - 1) ?
                            <button className="btn btn-link p-0" onClick={event => this.props.handleDown(event, this.props.index)}><FaSortDown size="2em" /></button>
                            :
                            null
                        }
                    </div>
                    <div className="contact-group w-100">
                        <div className="form-row">
                            <div className="contact-item col-sm-12 col-md-6 p-0">
                                <div className="contact-label font-weight-bold">
                                    Name
                                </div>
                                <div className="contact-information">
                                    {`${contactDemographics.prefix ? contactDemographics.prefix + ' ' : ''}${contactDemographics.firstName} ${contactDemographics.lastName}`}
                                </div>
                            </div>
                            <div className="contact-item col-sm-12 col-md-6 p-0">
                                <div className="contact-label font-weight-bold">
                                    Relationship
                                </div>
                                <div className="contact-information">
                                    {activeContactStudent.studentDetails.relationship ? activeContactStudent.studentDetails.relationship : '<Not Specified>'}
                                </div>
                            </div>
                            <div className="contact-item col-sm-12 col-md-6 p-0">
                                <div className="contact-label font-weight-bold">
                                    Email
                                </div>
                                <div className="contact-information">
                                    {contact.email.address ? contact.email.address : '<Not Specified>'}
                                </div>
                            </div>
                            <div className="contact-item col-sm-12 col-md-6 p-0">
                                <div className="contact-label font-weight-bold">
                                    Employer
                                </div>
                                <div className="contact-information">
                                    {contact.contactDemographics.employer ? contact.contactDemographics.employer : '<Not Specified>'}
                                </div>
                            </div>
                            <div className="contact-item row col-sm-12 mt-2 p-0">
                                <div className="col-md-6 col-sm-12 d-flex justify-content-between align-items-center">
                                    <span className="font-weight-bold">Needs a Translator?</span> 
                                    {contactDemographics.contactExtension.getField('needsinterpreterassist').value === 1 ? 
                                        <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>
                                    }
                                </div>
                            </div>
                            <div className="contact-item row col-sm-12 mt-2 p-0">
                                {studentDetails}
                            </div>
                            <div className="contact-item col-sm-12 mt-2 p-0">
                                <div className="contact-label font-weight-bold">
                                    Phone Numbers
                                </div>
                                <div className="contact-information">
                                    <ul className="list-group p-0">
                                        {contact.phones.map((phone, index) => 
                                            (phone.markedForDeletion === false && phone.deleted === false) ?
                                                <li className="list-group-item d-flex justify-content-between row p-0 mx-1" key={`contact-phone-${index}`}>
                                                    <div className="contact-item col-sm-12 col-md-4 d-flex flex-column align-items-center p-0">
                                                        <div className="contact-label font-weight-bold">
                                                            Phone Type
                                                        </div>
                                                        <div className="contact-information">
                                                            {phone.phoneType}
                                                        </div>
                                                    </div>
                                                    <div className="contact-item col-sm-12 col-md-4 d-flex flex-column align-items-center p-0">
                                                        <div className="contact-label font-weight-bold">
                                                            Number
                                                        </div>
                                                        <div className="contact-information">
                                                            {phone.phoneNumber}
                                                        </div>
                                                    </div>
                                                    <div className="contact-item d-flex col-md-4 flex-column align-items-center p-0">
                                                        <div className="contact-information">
                                                            <div className="col-sm-12 d-flex justify-content-between align-items-center">
                                                                <div className="contact-label font-weight-bold mr-2">Recieves Text?</div>{phone.sms ? <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>}
                                                            </div>
                                                            <div className="col-sm-12 d-flex justify-content-between align-items-center">
                                                                <div className="contact-label font-weight-bold mr-2">Preferred?</div> {phone.preferred ? <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li> 
                                                :
                                                ''
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}
export default inject(stores => ({
    contactEditorStore: stores.rootStore.contactEditorStore,
    formStore: stores.rootStore.formStore,
    contactsStore: stores.rootStore.contactsStore
}))(observer(Contact))