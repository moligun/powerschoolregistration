import React from 'react'
import { observer, inject } from 'mobx-react'
import { FaSortUp, FaSortDown, FaCheck, FaTimes } from 'react-icons/fa'
class Contact extends React.Component {
    handleEdit = (event) => {
        const { contactEditorStore, contact } = this.props
        event.preventDefault()
        contactEditorStore.setContactId(contact.indexId)
        contactEditorStore.display = true
        contactEditorStore.editValid = true
    }

    handleRemove = (event) => {
        event.preventDefault()
        const { contact } = this.props
        contact.removeActiveStudent()
    }

    render() {
        const { contact } = this.props
        const { activeContactStudent } = contact
        const studentDetails = []
        for (const key in activeContactStudent.studentDetails) {
            if (key !== 'relationship') {
                studentDetails.push(
                    <div className="col-md-6 col-sm-12 d-flex justify-content-between align-items-center" key={`contact-${this.props.index}-${key}`}>
                        {key} {activeContactStudent.studentDetails[key] ? <FaCheck className="text-success" /> : <FaTimes className="text-danger" />}
                    </div>
                )
            }
        }
        return (
            <li key={'contact-' + this.props.index} className="list-group-item" data-id={contact.id} data-index={ this.props.index }>
                <div className="d-flex justify-content-between align-items-top">
                    <div className="button-group d-flex flex-column">
                        {this.props.index !== 0 ? 
                            <button className="btn btn-link p-0" onClick={this.props.handleUp}><FaSortUp size="2em" /></button> 
                            :
                            null 
                        }

                        {this.props.index < (this.props.itemCount - 1) ?
                            <button className="btn btn-link p-0" onClick={this.props.handleDown}><FaSortDown size="2em" /></button>
                            :
                            null
                        }
                    </div>
                    <div className="contact-group col-sm-7 col-md-9 col-lg-10 d-flex flex-wrap p-0">
                        <div className="contact-item col-sm-12 col-md-6 p-0">
                            <div className="contact-label">
                                Name
                            </div>
                            <div className="contact-information">
                                {contact.contactDemographics.firstName + ' ' + contact.contactDemographics.lastName}
                            </div>
                        </div>
                        <div className="contact-item col-sm-12 col-md-6 p-0">
                            <div className="contact-label">
                                Relationship
                            </div>
                            <div className="contact-information">
                                {activeContactStudent.studentDetails.relationship ? activeContactStudent.studentDetails.relationship : '<Not Specified>'}
                            </div>
                        </div>
                        <div className="contact-item col-sm-12 col-md-6 p-0">
                            <div className="contact-label">
                                Email
                            </div>
                            <div className="contact-information">
                                {contact.email.address}
                            </div>
                        </div>
                        <div className="contact-item row col-sm-12 mt-2 p-0">
                            {studentDetails}
                        </div>
                        <div className="contact-item col-sm-12 mt-2 p-0">
                            <div className="contact-label">
                                Phone Numbers
                            </div>
                            <div className="contact-information">
                                <ul className="list-group p-0">
                                    {contact.phones.map((phone, index) => 
                                        (phone.markedForDeletion === false && phone.deleted === false) ?
                                            <li className="list-group-item d-flex justify-content-between row p-0 ml-1" key={`contact-phone-${index}`}>
                                                <div className="contact-item col-sm-12 col-md-4 d-flex flex-column align-items-center p-0">
                                                    <div className="contact-label">
                                                        Phone Type
                                                    </div>
                                                    <div className="contact-information">
                                                        {phone.phoneType}
                                                    </div>
                                                </div>
                                                <div className="contact-item col-sm-12 col-md-4 d-flex flex-column align-items-center p-0">
                                                    <div className="contact-label">
                                                        Number
                                                    </div>
                                                    <div className="contact-information">
                                                        {phone.phoneNumber}
                                                    </div>
                                                </div>
                                                <div className="contact-item d-flex col-md-4 flex-column align-items-center p-0">
                                                    <div className="contact-information">
                                                        <div className="col-sm-12 d-flex justify-content-between align-items-center">
                                                            <div className="contact-label">Recieves Text?</div>{phone.sms ? <FaCheck className="text-success ml-2" /> : <FaTimes className="text-danger ml-2" />}
                                                        </div>
                                                        <div className="col-sm-12 d-flex justify-content-between align-items-center">
                                                            <div className="contact-label">Preferred?</div> {phone.preferred ? <FaCheck className="text-success ml-2" /> : <FaTimes className="text-danger ml-2" />}
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
                    <div className="button-group">
                        <button className="btn btn-sm btn-primary mr-1" onClick={this.handleEdit}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={this.handleRemove}>Remove</button>
                    </div>
                </div>
            </li>
        )
    }
}
export default inject(stores => ({
    contactEditorStore: stores.rootStore.contactEditorStore
}))(observer(Contact))