import React from 'react'
import { inject, observer} from 'mobx-react'
import Input from './input'
import Select from './select'
class StudentInfoForm extends React.Component {
    handleChange = (event) => {
        const { student } = this.props.formStore
        let obj = student
        student.studentInformationValidation.validate(event.target.name, event.target.value)
        let dotNotationParts = event.target.name.split('.')
        let lastObjPart =  dotNotationParts.pop()
        let part = dotNotationParts.shift()
        while (part) {
            obj = obj[part]
            part = dotNotationParts.shift()
        }
        obj[lastObjPart] = event.target.value
    }
    handleExtChange = (event) => {
        const { student } = this.props.formStore
        const type = event.currentTarget.type
        const name = event.currentTarget.name
        const ext = event.currentTarget.dataset.ext
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
    }
    handleCancel = (event) => {
        event.preventDefault()
        this.props.formStore.displayForm = false
    }

    render() {
        const { student } = this.props.formStore
        const studentSuffixOptions = [
            {"label": "Jr", "value": "Jr"},
            {"label": "II", "value": "II"},
            {"label": "III", "value": "III"},
            {"label": "IV", "value": "IV"},
            {"label": "V", "value": "V"},
            {"label": "VI", "value": "VI"},
            {"label": "VII", "value": "VII"},
            {"label": "VIII", "value": "VIII"},
            {"label": "IX", "value": "IX"},
            {"label": "X", "value": "X"}
        ]
        const { studentExt, name, addresses, phones } = student
        return (
            <div>
                <fieldset>
                    <legend>Student Information</legend>
                    <div className="form-row">
                        <Input className="col-sm-12 col-md-6 col-lg-4" 
                            validation={student.validations.getValidation('name.first_name', ["required", "alpha"])} type="text" name="name.first_name" 
                            label="First Name" value={name.first_name} onChange={this.handleChange} />
                        <Input className="col-sm-12 col-md-6 col-lg-4" type="text" name="name.middle_name" 
                            label="Middle Name" value={name.middle_name} onChange={this.handleChange} />
                        <Input className="col-sm-12 col-md-6 col-lg-4" type="text" name="name.last_name" 
                            label="Last Name" value={name.last_name} onChange={this.handleChange} />
                        <Select className="col-sm-12 col-md-6 col-lg-4" name="name.suffix" 
                            label="Suffix" field={studentExt.getField('student_name_suffix')} 
                            onChange={this.handleExtChange} extension="studentExt" options={studentSuffixOptions} />
                    </div>
                    <div className="form-row">
                        <Input type="tel" name="phones.main.number" label="Home Phone" validation={student.studentInformationValidation.getValidation('phones.main.number')} value={phones.main.number} onChange={this.handleChange} />
                        <Input type="tel" name="phones.cell.number" label="Mobile Phone" validation={student.studentInformationValidation.getValidation('phones.cell.number')} value={phones.cell.number} onChange={this.handleChange} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Physical Address</legend>
                    <div className="form-row">
                        <Input type="text" label="Street" name="addresses.physical.street" 
                            validation={student.studentInformationValidation.getValidation('addresses.physical.street')}
                            value={addresses.physical.street} onChange={this.handleChange} />
                    </div>
                    <div className="form-row">
                        <Input type="text" label="City" name="addresses.physical.city" value={addresses.physical.city} onChange={this.handleChange}/>
                        <Input type="text" label="State" name="addresses.physical.state_province" value={addresses.physical.state_province} onChange={this.handleChange}/>
                        <Input type="text" label="Zip Code" name="addresses.physical.postal_code" value={addresses.physical.postal_code} onChange={this.handleChange}/>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Mailing Address</legend>
                    <div className="form-row">
                        <Input type="text" label="Street" name="addresses.mailing.street" value={addresses.mailing.street} onChange={this.handleChange} />
                    </div>
                    <div className="form-row">
                        <Input type="text" label="City" name="addresses.mailing.city" value={addresses.mailing.city} onChange={this.handleChange}/>
                        <Input type="text" label="State" name="addresses.mailing.state_province" value={addresses.mailing.state_province} onChange={this.handleChange}/>
                        <Input type="text" label="Zip Code" name="addresses.mailing.postal_code" value={addresses.mailing.postal_code} onChange={this.handleChange}/>
                    </div>
                </fieldset>
            </div>
        )
    }
}
export default inject(stores => ({
  formStore: stores.rootStore.formStore,
  contactEditor: stores.rootStore.contactEditorStore
}))(observer(StudentInfoForm))