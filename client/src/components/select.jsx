import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'
function Select(props) {
    let inputClassValues
    inputClassValues = props.validation && props.validation.validated === false ? 'border border-danger ' : ''
    inputClassValues += props.readOnly ? 'form-control-plaintext' : 'form-control'  
    return (
        <div className={`form-group ${props.className ? props.className : 'col'}`}>
            <label className="font-weight-bold" htmlFor={props.field.name}>{props.label}</label>
            <select className={inputClassValues} id={props.field.name} name={props.field.name} 
                data-ext={props.extension ? props.extension : undefined} 
                value={props.field.value} onChange={props.onChange} 
                readOnly={props.readOnly ? true : false} 
                disabled={props.readOnly ? true : false}>
                <option key={props.field.name} value="">Select an Option...</option>
                {props.options.map((option) => <option key={props.field.name + "-" + option.value} value={option.value}>{option.label}</option>)}
            </select>
            {props.validation ? <Validation validation={props.validation} /> : null}
        </div>
    )
}
export default observer(Select)