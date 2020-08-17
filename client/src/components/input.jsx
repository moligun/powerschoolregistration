import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'            
function Input(props) {
    return (
        <div className={`form-group ${props.className ? props.className : 'col'}`}>
            {props.label ? <label htmlFor={props.name}>{props.label}</label> : '' }
            {props.type === 'textarea' ? <textarea name={props.name} 
                className={`${props.validation && props.validation.validated === false ? 'border border-danger ' : ''} form-control`}
                placeholder={props.placeholder ? `${props.placeholder}` : ''} 
                id={props.name} value={props.value} onChange={props.onChange} />
                : 
                <input type={props.type} name={props.name} 
                    className={`${props.validation && props.validation.validated === false ? 'border border-danger ' : ''} form-control`} placeholder={props.placeholder ? `${props.placeholder}` : ''} 
                    id={props.name} value={props.value} onChange={props.onChange} /> }
                <Validation validation={props.validation} />
        </div>
    )
}
export default observer(Input)