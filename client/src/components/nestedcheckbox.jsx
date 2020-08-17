import React from 'react'
import { observer } from 'mobx-react'
function NestedCheckbox(props) {
    return (
        <div className="form-check col-sm-5 ml-3">
            <input className="form-check-input" id={props.field.name} type="checkbox" value="1" name={props.field.name} checked={props.field.value === 1 || props.field.value === 'on'} onChange={props.onChange} />
            <label htmlFor={props.field.name}>{props.label}</label>
            {(props.field.value === 1 || props.field.value === 'on')  && props.children ? <div className="pr-5">{props.children}</div> : '' }
        </div>
    )
}
export default observer(NestedCheckbox)