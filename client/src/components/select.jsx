import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'
function Select(props) {
    return (
        <div className={`form-group ${props.className ? props.className : 'col'}`}>
            <label htmlFor={props.field.name}>{props.label}</label>
            <select className="form-control" id={props.field.name} name={props.field.name} data-ext={props.extension ? props.extension : undefined} value={props.field.value} onChange={props.onChange}>
                <option key={props.field.name} value="">Select an Option...</option>
                {props.options.map((option) => <option key={props.field.name + "-" + option.value} value={option.value}>{option.label}</option>)}
            </select>
            {props.validation ? <Validation validation={props.validation} /> : null}
        </div>
    )
}
export default observer(Select)