import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'
function ContactPhone(props) {
    const { phone, index } = props
    const phoneNumberValidation = phone.validation.getValidation("phoneNumber")
    return (
        <div className="d-flex w-100 justify-content-between align-items-end" data-index={ index }>
            <h3>#{index + 1}</h3>
            <div className="d-flex flex-column">
                <label>Phone Type</label>
                <select className="form-control" name="phoneType" value={phone.phoneType} onChange={props.handleChange} data-index={ index }>
                    <option>Phone Type...</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Home">Home</option>
                </select>
            </div>
            <div className="d-flex flex-column">
                <label>Phone Number</label>
                <input type="text" className={`form-control ${phoneNumberValidation.validated ? '' : 'border-danger'}`} data-index={ index } name="phoneNumber" key={"phone-" + index} value={phone.phoneNumber} onChange={props.handleChange} />
                <Validation validation={phoneNumberValidation} />
            </div>
            <div className="d-flex flex-column">
                <div className="form-check form-check-inline mx-0">
                    <input className="form-check input" data-index={ index } name="sms" type="checkbox" 
                        onChange={props.handleChange} checked={ phone.sms } />
                    <label className="form-check-label pl-1">Receives Text Messages?</label>
                </div>
                <div className="form-check form-check-inline mx-0">
                    <input className="form-check input" data-index={ index } name="preferred" type="checkbox" 
                        onChange={props.handleChange} checked={ phone.preferred } />
                    <label className="form-check-label pl-1">Preferred Number?</label>
                </div>
            </div>
            <button onClick={props.handlePhoneDelete} className="btn btn-danger btn-sm">Delete</button>
        </div>
    )
}

export default observer(ContactPhone)