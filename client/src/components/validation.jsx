import React from 'react'
import { observer } from 'mobx-react'
function Validation(props) {
    return (
        <div>
            {props.validation ? props.validation.validated ? null : props.validation.messages.map((message, index) => <small key={`error-message-${index}`} className="form-text text-danger">{message}</small>) : null}
        </div>
    )
}
export default observer(Validation)