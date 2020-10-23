import React from 'react'
import { observer, inject } from 'mobx-react'
import Select from './select'
class Signature extends React.Component {
    componentDidMount() {
    }
    handleChange = (event) => {
        const { student } = this.props
        const { signatureInformationValidation } = student
        const type = event.currentTarget.type
        const name = event.currentTarget.name
        let ext = event.currentTarget.dataset.ext
        if (!ext) {
            console.log('no extension specified')
            return
        }
        const extObj = student[ext]
        const checkedTypes = ['checkbox', 'radio']
        let value = 0
        if (checkedTypes.includes(type)) {
            if (type === 'checkbox') {
                value = event.currentTarget.checked ? 1 : 0
            } else {
                value = parseInt(event.currentTarget.value)
            }
        } else {
            value = event.currentTarget.value
        }
        extObj.setFieldValue(name, value)
        signatureInformationValidation.validate(name, value)
    }

    render() {
        const { studentExt3, signatureInformationValidation } = this.props.student
        return (
            <React.Fragment>
                <fieldset>
                    <legend>Electronic Signature</legend>
                    <div className="form-row">
                        <p className="text-danger">
                            The electronic signature below and its related fields are treated by Lafayette School Corporation like a handwritten signature on a paper form.
                        </p>
                    </div>
                    <div className="form-row">
                        <Select field={studentExt3.getField('lsc_useragreementsigned')} extension="studentExt3" validation={signatureInformationValidation.getValidation('lsc_useragreementsigned')}
                            label="I Agree" onChange={this.handleChange} options={[{"label": "Yes", "value": "1"}]} />
                    </div>
                </fieldset>
            </React.Fragment>
        )
    }
}

export default inject(stores => ({
    student: stores.rootStore.formStore.student
}))(observer(Signature))