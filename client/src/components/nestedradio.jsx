import React from 'react'
import { observer } from 'mobx-react'
import Validation from './validation'
function NestedRadio(props) {
    return (
        <div className={`${props.className ? props.className : 'col-sm-12'} pl-0`}>
            <div className="d-flex flex-row w-100 justify-content-around align-items-baseline">
                <legend className="col-form-label pl-1 d-flex justify-content-between">
                    {props.label}
                    {props.validation ? <Validation validation={props.validation} /> : ''}
                </legend>
                <div className="col-sm-6 col-md-6">
                    <div className="form-check form-check-inline">
                        <input type="radio" id={`${props.field.name}-yes`} className="form-check-input" name={props.field.name} value="1" checked={props.field.value === 1 } onChange={props.onChange} />
                        <label className="form-check-label" htmlFor={`${props.field.name}-yes`}>Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input type="radio" id={`${props.field.name}-no`} className="form-check-input" name={props.field.name} value="0" checked={props.field.value === 0 } onChange={props.onChange} />
                        <label htmlFor={`${props.field.name}-no`} className="form-check-label">No</label>
                    </div>
                </div>
            </div>
            {props.field.value === 1  && props.children ? <div className="ml-5 border border-info px-3 py-2">{props.children}</div> : '' }
        </div>
    )
}
export default observer(NestedRadio)