import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'            
function Input(props) {
    let inputClassValues
    inputClassValues += props.validation && props.validation.validated === false ? 'border border-danger' : ''
    inputClassValues += props.readOnly ? ' form-control-plaintext' : ' form-control'  
    return (
        <div className={`form-group ${props.className ? props.className : 'col'}`} extension={props.extension}>
            {props.label ? <label htmlFor={props.name} className="font-weight-bold">{props.label}</label> : '' }
            {props.type === 'textarea' ? <textarea name={props.name} 
                className={inputClassValues}
                placeholder={props.placeholder ? `${props.placeholder}` : ''} 
                id={props.name} value={props.value} onChange={props.onChange} />
                : 
                <input type={props.type} name={props.name}
                    className={inputClassValues} placeholder={props.placeholder ? `${props.placeholder}` : ''} 
                    id={props.name} value={props.value} onChange={props.onChange}  readOnly={props.readOnly ? true : false} /> }
                <Validation validation={props.validation} />
        </div>
    )
}
export default observer(Input)