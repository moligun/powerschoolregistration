import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'
function NestedRadio(props) {
    const flexDirectionClass = props.displayBlock !== true ? 'flex-row' : 'flex-column'
    const inlineOptionClass = props.displayBlock !== true ? 'form-check form-check-inline' : 'form-check'
    const options = props.options && props.options.length > 0 ? props.options : [{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]
    return (
        <div className={`${props.className ? props.className : 'col'} form-group`}>
            <div className={`d-flex ${flexDirectionClass} w-100 justify-content-around align-items-baseline`}>
                <legend className="col-form-label d-flex justify-content-start flex-shrink-1 font-weight-bold align-items-baseline">
                    <div className="mr-2">{props.label}</div>
                    <div>{props.validation ? <Validation validation={props.validation} /> : ''}</div>
                </legend>
                <div className="flex-shrink-0">
                    {options.map((option) => 
                        <div className={inlineOptionClass} key={`${props.field.name}-${option.value}`}>
                            <input type="radio" id={`${props.field.name}-${option.value}`} className="form-check-input" name={props.field.name} value={option.value} 
                                checked={props.field.value === option.value || props.field.value.toString() === option.value.toString()} onChange={props.onChange} />
                            <label className="form-check-label" htmlFor={`${props.field.name}-${option.value}`}>{option.label}</label>
                        </div>
                    )}
                </div>
            </div>
            {props.field.value === 1  && props.children ? <div className="ml-5 border border-info px-3 py-2">{props.children}</div> : '' }
        </div>
    )
}
export default observer(NestedRadio)