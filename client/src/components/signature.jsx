import React from 'react'
import { observer, inject } from 'mobx-react'
import Select from './select'
import Input from './input'
class Signature extends React.Component {
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
        const validationName = ext === 'studentExt3' ? name : ext + '.' + name
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
        if (name === 'disclaimer_1_name') {
            const disclaimerFields = [
                "disclaimer_1_name",
                "disclaimer_2_name",
                "disclaimer_3_name",
                "disclaimer_4_name",
                "disclaimer_5_name",
            ]
            for (const disclaimerField of disclaimerFields) {
                extObj.setFieldValue(disclaimerField, value)
            }
        } else {
            extObj.setFieldValue(name, value)
        }
        signatureInformationValidation.validate(validationName, value)
    }

    handleDateChange = (date, props) => {
        const { extension, name } = props
        const { student } = this.props
        const validationName = extension + '.' + name
        const { signatureInformationValidation } = student
        const dateValue = date ? date.toLocaleDateString("en-US") : ''
        student[extension].setFieldValue(name, dateValue)
        signatureInformationValidation.validate(validationName, dateValue)
    }

    render() {
        const { studentExt3, signatureInformationValidation, release } = this.props.student
        return (
            <React.Fragment>
                <fieldset>
                    <legend>Electronic Signature</legend>
                    <div className="form-row">
                        <p className="text-danger">
                            The electronic signature below and its related fields are treated by Lafayette School Corporation like a handwritten signature on a paper form.
                        </p>
                        <p className="font-weight-bold font-italic">I affirm that all the information provided is true and correct to the best of my knowledge.</p>
                    </div>
                    <div className="form-row">
                        <Select field={studentExt3.getOrCreateField('lsc_useragreementsigned')} className="col-sm-12" extension="studentExt3" 
                            validation={signatureInformationValidation.getValidation('lsc_useragreementsigned')}
                            label="I Agree" onChange={this.handleChange} options={[{"label": "Yes", "value": "1"}]} />
                        <Input type="text" name="disclaimer_1_name" className="col-sm-12" 
                            validation={signatureInformationValidation.getValidation('release.disclaimer_1_name')}
                            label="Signature" subLabel="Type Name of Parent/Guardian" extension="release" 
                            value={release.getOrCreateField('disclaimer_1_name')['value']} onChange={this.handleChange} />
                        <Input type="date" name="signature_date" className="col-sm-12" 
                            validation={signatureInformationValidation.getValidation('release.signature_date')}
                            label="Date" extension="release" 
                            value={release.getOrCreateField('signature_date')['value']} onChange={this.handleDateChange} />
                    </div>
                    <div className="form-row">
                        <input type="hidden" name="disclaimer_2_name" 
                            value={release.getOrCreateField('disclaimer_2_name')['value']} />
                        <input type="hidden" name="disclaimer_3_name" 
                            value={release.getOrCreateField('disclaimer_3_name')['value']} />
                        <input type="hidden" name="disclaimer_4_name" 
                            value={release.getOrCreateField('disclaimer_4_name')['value']} />
                        <input type="hidden" name="disclaimer_5_name" 
                            value={release.getOrCreateField('disclaimer_5_name')['value']} />

                    </div>
                </fieldset>
            </React.Fragment>
        )
    }
}

export default inject(stores => ({
    student: stores.rootStore.formStore.student
}))(observer(Signature))