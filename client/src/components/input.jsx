import React from 'react'
import { observer } from 'mobx-react'
import DatePicker from 'react-datepicker'
import Validation from './validation'            
import "react-datepicker/dist/react-datepicker.css"
function Input(props) {
    let inputClassValues
    inputClassValues = props.validation && props.validation.validated === false ? 'border border-danger ' : ''
    inputClassValues += props.readOnly ? 'form-control-plaintext' : 'form-control'  
    let inputField
    switch(props.type) {
        case 'textarea':
            inputField = <textarea name={props.name} className={inputClassValues}
                placeholder={props.placeholder ? `${props.placeholder}` : ''} 
                id={props.name} value={props.value} onChange={props.onChange} data-ext={props.extension} />
            break
        case 'date':
            inputField = <DatePicker selected={props.value ? new Date(props.value) : ''} 
                onChange={date => props.onChange(date, props)} className={inputClassValues} wrapperClassName="w-100" />
            break
        default:
            inputField = <input type={props.type} name={props.name}
                className={inputClassValues} 
                data-ext={props.extension}
                placeholder={props.placeholder ? `${props.placeholder}` : ''} 
                id={props.name} value={props.value} onChange={props.onChange}  readOnly={props.readOnly ? true : false} />
            break
    }
    return (
        <div className={`form-group ${props.className ? props.className : 'col'}`} extension={props.extension}>
            {props.label ? <label htmlFor={props.name} className="font-weight-bold">{props.label}</label> : '' }
            {inputField}
            {props.subLabel ? <small className="form-text text-muted">{props.subLabel}</small> : '' }
            <Validation validation={props.validation} />
        </div>
    )
}
export default observer(Input)