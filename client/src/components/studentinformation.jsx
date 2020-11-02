import React from 'react'
import { inject, observer} from 'mobx-react'
import Input from './input'
import Select from './select'
import NestedRadio from './nestedradio'
import Formatter from '../stores/formatter'
class StudentInfoForm extends React.Component {
    handleChange = (event) => {
        const { student } = this.props.formStore
        let obj = student
        let dotNotationParts = event.target.name.split('.')
        let lastObjPart =  dotNotationParts.pop()
        let part = dotNotationParts.shift()
        let value = event.target.value
        while (part) {
            obj = obj[part]
            part = dotNotationParts.shift()
        }
        let format = event.currentTarget.dataset.format
        if (format) {
            value = Formatter[format](value) 
        }
        obj[lastObjPart] = value
        student.refreshStudentValidation()
    }
    handleExtChange = (event) => {
        const { student } = this.props.formStore
        const type = event.currentTarget.type
        const name = event.currentTarget.name
        let ext = event.currentTarget.dataset.ext
        if (!ext) {
            ext = event.currentTarget.closest('[extension]').getAttribute('extension')
            if (!ext) {
                console.log('no extension specified')
                return
            }
        }
        const extObj = student[ext]
        const checkedTypes = ['checkbox', 'radio']
        let value = 0
        if (checkedTypes.includes(type)) {
            if (type === 'checkbox') {
                value = event.currentTarget.checked ? 1 : 0
            } else {
                value = event.currentTarget.value
                value = value === "Yes" || value === "No" ? value : parseInt(value)
            }
        } else {
            value = event.currentTarget.value
        }
        let format = event.currentTarget.dataset.format
        if (format) {
            value = Formatter[format](value) 
        }
        extObj.setFieldValue(name, value)
        if (name === 'student_cell') {
            extObj.getOrCreateField('student_txt_phone')
            extObj.setFieldValue('student_txt_phone', value)
        }
        student.refreshStudentValidation()
    }

    handleMvChange = (event) => {
        const { student } = this.props.formStore
        let ext = event.currentTarget.dataset.ext
        if (!ext) {
            ext = event.currentTarget.closest('[extension]').getAttribute('extension')
            if (!ext) {
                console.log('no extension specified')
                return
            }
        }
        const extObj = student[ext]
        const currentValue = event.currentTarget.value
        for (const mvLiving of student.mvLivingSituations) {
            let newValue = currentValue === mvLiving.value ? 'Yes' : 'No'
            extObj.setFieldValue(mvLiving.value, newValue)
            if (newValue === 'Yes') {
                event.currentTarget.value = mvLiving.value
            }
        }
        student.refreshStudentValidation()
    }
    handleCancel = (event) => {
        event.preventDefault()
        this.props.formStore.displayForm = false
    }

    render() {
        const { student } = this.props.formStore
        const { districts } = this.props.studentStore
        const { studentExt, studentExt2, name, phones, schoolEnrollment, demographics } = student
        const studentDob = demographics.birth_date ? new Date(demographics.birth_date).toLocaleDateString('en-US') : ''
        return (
            <div>
                <fieldset>
                    <legend>Student Information</legend>
                    <div className="form-row">
                        <Input className="col-sm-12 col-md-6 col-lg-4" type="text" name="name.first_name" 
                            label="First Name" value={name.first_name} readOnly />
                        <Input className="col-sm-12 col-md-6 col-lg-4" type="text" name="name.middle_name" 
                            label="Middle Name" value={name.middle_name} readOnly />
                        <Input className="col-sm-12 col-md-6 col-lg-4" type="text" name="name.last_name" 
                            label="Last Name" value={name.last_name} readOnly />
                        <Input className="col-sm-12 col-md-6 col-lg-4" name="name.suffix" 
                            label="Suffix" value={studentExt.getOrCreateField('student_name_suffix').value} readOnly />
                        <Input type="text" name="demographics.birth_date" className="col-md-6 col-sm-12 col-lg-4"
                            label="Date of Birth" 
                            value={studentDob} readOnly />
                    </div>
                    <div className="form-row">
                        <Input type="tel" name="phones.main.number" label="Home Phone" 
                            validation={student.studentInformationValidation.getValidation('phones.main.number')} 
                            value={phones.main.number} format="phoneFormat" onChange={this.handleChange} />
                        <Input type="tel" name="student_cell" 
                            label="Cell Phone" value={studentExt2.getOrCreateField('student_cell').value}
                            validation={student.studentInformationValidation.getValidation('studentExt2.student_cell')} 
                            extension="studentExt2"
                            format="phoneFormat" 
                            onChange={this.handleExtChange} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Physical Address</legend>
                    <div className="form-row">
                        <Input type="text" label="Street" name="addresses.physical.street" 
                            value={student.addresses.physical.street} readOnly />
                    </div>
                    <div className="form-row">
                        <Input type="text" label="City" name="addresses.physical.city" value={student.addresses.physical.city} readOnly />
                        <Input type="text" label="State" name="addresses.physical.state_province" value={student.addresses.physical.state_province} readOnly />
                        <Input type="text" label="Zip Code" name="addresses.physical.postal_code" value={student.addresses.physical.postal_code} readOnly />
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="Select School Corporation of Residence if different from Lafayette School Corporation" 
                            field={{name: "schoolEnrollment.district_of_residence", value: schoolEnrollment.district_of_residence}} 
                            onChange={this.handleChange} extension="studentExt" options={districts} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Mailing Address</legend>
                    <div className="form-row">
                        <Input type="text" label="Street" name="addresses.mailing.street" 
                            value={student.addresses.mailing.street} 
                            onChange={this.handleChange}
                            validation={student.studentInformationValidation.getValidation('addresses.mailing.street')} />
                    </div>
                    <div className="form-row">
                        <Input type="text" label="City" 
                            name="addresses.mailing.city" 
                            value={student.addresses.mailing.city} 
                            onChange={this.handleChange}
                            validation={student.studentInformationValidation.getValidation('addresses.mailing.city')} 
                        />
                        <Input type="text" label="State" 
                            name="addresses.mailing.state_province" 
                            value={student.addresses.mailing.state_province} 
                            onChange={this.handleChange}
                            validation={student.studentInformationValidation.getValidation('addresses.mailing.state_province')} 
                        />
                        <Input type="text" label="Zip Code" 
                            name="addresses.mailing.postal_code" 
                            value={student.addresses.mailing.postal_code} 
                            onChange={this.handleChange}
                            validation={student.studentInformationValidation.getValidation('addresses.mailing.postal_code')} 
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Residency Information, McKinney-Vento Act</legend>
                    <div className="form-row">
                        <p>
                            This questionnaire is in compliance with the McKinney-Vento Act, U.S.C. 42 § 11432(a). 
                            Your answers will help the administrator determine residency documents necessary for enrollment of your student.</p>
                    </div>
                    <div className="form-row" extension="studentExt2">

                        <NestedRadio className="col-sm-12" field={studentExt2.getOrCreateField('mvtempliving')} 
                            label="Is this student's home address a temporary living arrangement, other than a rental?" 
                            onChange={this.handleExtChange} options={[{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}]}
                            validation={student.studentInformationValidation.getValidation('studentExt2.mvtempliving')} />
                        <NestedRadio className="col-sm-12" field={studentExt2.getOrCreateField('mvtemplivinghardship')} 
                            label="Is this a temporary living arrangement due to a loss of housing or economic hardship?" 
                            onChange={this.handleExtChange} options={[{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}]}
                            validation={student.studentInformationValidation.getValidation('studentExt2.mvtemplivinghardship')} />
                        <NestedRadio 
                            className="col-sm-12"
                            field={studentExt2.getOrCreateField('mvlivingwithother')} 
                            label="As a student, are you living with someone other than your parent or legal guardian?" 
                            onChange={this.handleExtChange} options={[{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}]}
                            validation={student.studentInformationValidation.getValidation('studentExt2.mvlivingwithother')} />
                    </div>
                    {this.props.formStore.student.mcKinneyExtras === true && 
                        <React.Fragment>
                            <div className="form-row">
                                <p className="font-weight-bold col-sm-12">Residency and Educational Rights</p>
                                <p className="col-sm-12">Students without fixed, regular, and adequate living situations have the following rights:</p>
                                <ol>
                                   <li className="mb-2">
                                       Immediate enrollment in the school they last attended or the local school where they are 
                                       currently staying even if they do not have all of the documents normally required at the 
                                       time of enrollment without fear of being separated or treated differently due to their housing situations;</li>
                                    <li className="mb-2">Transportation to the school of origin for the regular school day;</li>
                                    <li>Access to free meals, Title I and other educational programs, and transportation to extra-curricular 
                                        activities to the same extent that it is offered to other students. </li>
                                </ol>
                                <p className="col-sm-12">Any questions about these rights can be directed to either John Layton, (765) 771-6000, 
                                    jlayton@lsc.k12.in.us or the State Coordinator at (317) 460-1340.</p>
                            </div>
                            <div className="form-row">
                                <Select className="col-sm-12" label="Please choose which of the following situations the student currently resides" 
                                    field={student.mcKinneyLivingValue} 
                                    onChange={this.handleMvChange} extension="studentExt2" 
                                    options={student.mvLivingSituations}
                                    validation={student.studentInformationValidation.getValidation('mcKinneyLivingValue')} />

                                    {student.mcKinneyLivingValue.value === 'mvmotelhotel' &&
                                        <Input type="text" label="Hotel/Motel Name" 
                                            className="col-sm-12" name="mvmotelhotelname" 
                                            value={studentExt2.getOrCreateField('mvmotelhotelname').value} 
                                            extension="studentExt2" onChange={this.handleExtChange}
                                            validation={student.studentInformationValidation.getValidation('studentExt2.mvmotelhotelname')} />
                                    }
                            </div>
                            <div className="form-row" extension="studentExt2">
                                <Input type="textarea" label="Please explain any other living situations" 
                                    className="col-sm-12" name="mvotherexplain" 
                                    value={studentExt2.getOrCreateField('mvotherexplain').value} 
                                    onChange={this.handleExtChange} />
                                <NestedRadio field={studentExt2.getOrCreateField('mvtransportation')} 
                                    label="Are you requesting transportation under the McKinney-Vento Act?" 
                                    onChange={this.handleExtChange} options={[{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}]}
                                    validation={student.studentInformationValidation.getValidation('studentExt2.mvtransportation')} />
                                <Input type="textarea" label="Other Children Living in the Home" 
                                    className="col-sm-12" name="mvadditionalkids" 
                                    value={studentExt2.getOrCreateField('mvadditionalkids').value} 
                                    onChange={this.handleExtChange} />
                            </div>
                        </React.Fragment>
                    }
                </fieldset>
            </div>
        )
    }
}
export default inject(stores => ({
  formStore: stores.rootStore.formStore,
  studentStore: stores.rootStore.studentStore,
  contactEditor: stores.rootStore.contactEditorStore
}))(observer(StudentInfoForm))