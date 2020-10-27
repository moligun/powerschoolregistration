import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'
function ContactPhone(props) {
    const { phone, index } = props
    const phoneNumberValidation = phone.validation.getValidation("phoneNumber")
    return (
        <div className="form-row w-100" data-index={ index }>
            <div className="col-sm-12 d-flex justify-content-end">
                <button onClick={props.handlePhoneDelete} className="btn btn-danger btn-sm">Remove</button>
            </div>
            <div className="d-flex flex-column col-sm-12 col-md-6 col-lg-4">
                <label className="font-weight-bold">Phone Type</label>
                <select className="form-control" name="phoneType" value={phone.phoneType} onChange={props.handleChange} data-index={ index }>
                    <option>Phone Type...</option>
                    <option value="Daytime">Daytime</option>
                    <option value="Home">Home</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Work">Work</option>
                    <option value="Pager">Pager</option>
                </select>
            </div>
            <div className="d-flex flex-column col-sm-12 col-md-6 col-lg-4">
                <label className="font-weight-bold">Phone Number</label>
                <input type="text" className={`form-control ${phoneNumberValidation.validated ? '' : 'border-danger'}`} data-index={ index } name="phoneNumber" key={"phone-" + index} value={phone.phoneNumber} onChange={props.handleChange} />
                <Validation validation={phoneNumberValidation} />
            </div>
            <div className="d-flex flex-column col-sm-12 col-md-6 col-lg-4 justify-content-end mt-2">
                <div className="form-check form-check-inline mx-0">
                    <input className="form-check input" data-index={ index } name="sms" type="checkbox" 
                        onChange={props.handleChange} checked={ phone.sms } />
                    <label className="form-check-label pl-1 font-weight-bold">Receives Text Messages?</label>
                </div>
                <div className="form-check form-check-inline mx-0">
                    <input className="form-check input" data-index={ index } name="preferred" type="checkbox" 
                        onChange={props.handleChange} checked={ phone.preferred } />
                    <label className="form-check-label pl-1 font-weight-bold">Preferred Number?</label>
                </div>
            </div>
        </div>
    )
}

export default observer(ContactPhone)