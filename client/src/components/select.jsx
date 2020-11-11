import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'
function Select(props) {
    let inputClassValues
    inputClassValues = props.validation && props.validation.validated === false ? 'border border-danger ' : ''
    inputClassValues += props.readOnly ? 'form-control-plaintext' : 'form-control'  
    let fieldValue = props.field.value
    if (props.stringOnly) {
        if (fieldValue === 1) {
            fieldValue = "Yes"
        } else if (fieldValue === 0) {
            fieldValue = "No"
        }
    }
    return (
        <div className={`form-group ${props.className ? props.className : 'col'}`}>
            {props.label && <label className="font-weight-bold" htmlFor={props.field.name}>{props.label}</label>}
            <select className={inputClassValues} id={props.field.name} name={props.field.name} 
                data-ext={props.extension ? props.extension : undefined} 
                value={fieldValue} onChange={props.onChange} 
                readOnly={props.readOnly ? true : false} 
                disabled={props.readOnly ? true : false}>
                {props.noBlank !== true && <option key={props.field.name} value="">Select an Option...</option>}
                {props.options.map((option) => <option key={props.field.name + "-" + option.value} value={option.value}>{option.label}</option>)}
            </select>
            {props.validation ? <Validation validation={props.validation} /> : null}
            {props.childrenTrigger && props.childrenTrigger.toString() === fieldValue.toString() && props.children ? <div className="ml-5 border border-info px-3 py-2">{props.children}</div> : '' }
        </div>
    )
}
export default observer(Select)