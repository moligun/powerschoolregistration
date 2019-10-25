import React from 'react'
const DescriptionList = (props) => {
    return (
        <div className="info-box col-sm-12 col-md-6">
            <h2>{props.title}</h2>
            <dl className="d-flex justify-content-start flex-wrap">
                {Object.keys(props.list).map((value, index) =>
                    <React.Fragment key={`${value}.${index}`}>
                        <dt>{value}</dt>
                        <dd>{props.list[value]}</dd>
                    </React.Fragment>
                )}
            </dl>
            {props.children}
        </div>
    )
}

export default DescriptionList