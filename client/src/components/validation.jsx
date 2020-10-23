import React from 'react'
import { observer } from 'mobx-react'
function Validation(props) {
    return (
        <div className={props.className && props.validation && !props.validation.validated ? props.className : "form-text text-danger"}>
            {props.validation ? props.validation.validated ? null : props.validation.messages.map((message, index) => <small key={`error-message-${index}`}>{message}</small>) : null}
        </div>
    )
}
export default observer(Validation)