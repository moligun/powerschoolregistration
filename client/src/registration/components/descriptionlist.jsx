import React from 'react'
const DescriptionList = (props) => {
    return (
        <dl className="d-flex justify-content-start flex-wrap">
            {
                Object.keys(props.list).map((key, id) => (
                    <React.Fragment key={key + `.${id}`}>
                        <dt>{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                        <dd>{props.list[key]}</dd>
                    </React.Fragment>
                ))
            }
        </dl>
    )
}

export default DescriptionList