import React from 'react'
import { observer, inject } from 'mobx-react'
import Select from './select'
class Agreements extends React.Component {
    componentDidMount() {
        const { release, releaseInformationValidation, healthInformation } = this.props.student
        let data = release.fieldsObj
        let healthObj = healthInformation.getField('he_shared')
        data[healthObj.name] = healthObj.value
        releaseInformationValidation.validateAll(data)
    }
    handleChange = (event) => {
        const { student } = this.props
        const { release, releaseInformationValidation, healthInformation } = student
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
        let data = release.fieldsObj
        let healthObj = healthInformation.getField('he_shared')
        data[healthObj.name] = healthObj.value
        releaseInformationValidation.validateAll(data)
    }

    render() {
        const { release, releaseInformationValidation, healthInformation } = this.props.student
        return (
            <React.Fragment>
                <h2>Health Information</h2>
                <fieldset>
                    <legend>CHIRP</legend>
                    <div className="form-row">
                        <p>
                            The Lafayette School Corporation, with parental permission, releases immunization and health records to the Children’s and 
                            Hoosiers Immunization and Records Program (CHIRP). I understand that the information in the registry may be used to verify 
                            that my child has received proper immunizations and to inform me or my child of my child’s immunization status or that an 
                            immunization is due according to recommended immunization schedules. I understand that my child’s information may be available 
                            to the immunization data registry of another state, a healthcare provider or a provider’s designee, a local health department, 
                            an elementary or secondary school, a child care center, the office of Medicaid policy and planning or a contractor of the office 
                            of Medicaid policy and planning, a licensed child placing agency, and a college or university. I also understand that other 
                            entities may be added to this list through an amendment to I.C. 16-38-5-3. (This will allow the release of immunizations to other schools)
                        </p>
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="I Agree" 
                            field={release.getField('chrip_release')} 
                            onChange={this.handleChange} extension="release" 
                            validation={releaseInformationValidation.getValidation('chrip_release')}
                            options={[{"label": "Yes", "value": "Yes"}, {"label": "No", "value": "No"}]} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Shared Medical Information</legend>
                    <div className="form-row">
                        <p>
                            To promote safe care of my student, I give permission that health information obtained on this form will be shared 
                            with pertinent staff and others who supervise my child.
                        </p>
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="I Agree" 
                            field={healthInformation.getField('he_shared')} 
                            onChange={this.handleChange} extension="healthInformation" 
                            validation={releaseInformationValidation.getValidation('he_shared')}
                            options={[{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Student Athlete</legend>
                    <div>
                        <p>
                            As a student/student athlete, I have received and read both of the fact sheets regarding concussion and sudden cardiac arrest. 
                            I understand the nature and risk of concussion and head injury to students/student athletes, including the risks of continuing to 
                            participate/play after concussion or head injury, and the symptoms of sudden cardiac arrest. 
                            I, as the parent or legal guardian of the student registering, 
                            I have received and read both of the fact sheets regarding concussion and sudden cardiac arrest. 
                            I understand the nature and risk of concussion and head injury to students/student athletes, 
                            including the risks of continuing to participate/play after concussion or head injury, and the symptoms of sudden cardiac arrest.
                        </p>
                        <p>
                            Click <a href="https://secure.infosnap.com/resources/1520/files/Heads_Up__-_A_Fact_Sheet_for_Athletes.pdf" target="_blank" rel="noopener noreferrer">here</a>  
                            &nbsp;to view the complete Heads Up Fact Sheet for Student Athletes.
                        </p>
                        <p>
                            Click <a href="https://secure.infosnap.com/resources/1520/files/Heads_Up__-_A_Fact_Sheet_for_Parents.pdf" target="_blank" rel="noopener noreferrer">here</a> 
                            &nbsp;to view the complete Heads Up Fact Sheet for Parents.
                        </p>
                        <p>
                            Click <a href="https://secure.infosnap.com/resources/1520/files/sudden-cardiac-arrest-fact-sheet-student-athletes.pdf" target="_blank" rel="noopener noreferrer">here</a> 
                            &nbsp;to view the complete Sudden Cardiac Arrest Fact Sheet for Student Athletes.
                        </p>
                        <p>
                            Click <a href="https://secure.infosnap.com/resources/1520/files/sudden-cardiac-arrest-fact-sheet-parents.pdf" target="_blank" rel="noopener noreferrer">here</a> 
                            &nbsp;to view the complete Sudden Cardiac Arrest Fact Sheet for Parents.
                        </p>
                        <p>
                            Click <a href="https://secure.infosnap.com/resources/1520/files/parent-and-student-athlete-acknowledgement-and-signature-form.pdf" target="_blank" rel="noopener noreferrer">here</a> 
                            &nbsp;to view the complete Parent and Student Athlete Acknowledgement and Signature Form.
                        </p>
                    </div>
                </fieldset>
                <h2>Other</h2>
                <fieldset>
                    <legend>Blanket Field Trip Permission</legend>
                    <div className="form-row">
                        <p>
                            I give my permission for my child to attend field trips during the time they are enrolled in school. 
                            I understand LSC will attempt to notify me of all field trips. In addition to giving this permission, 
                            I understand I must notify the teacher/school in writing if I do not want them to attend an event. 
                            I understand I must have a medical information/authorization form on file for my child in order to attend. 
                            I hereby authorize the school personnel in charge of any field trip to release medical information to medical authorities 
                            and to obtain medical care and/or hospitalization for any illness or accident that may occur while my child is engaged in this field trip. 
                            I accept the responsibility for payment of any medical expenses.
                        </p>
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="I Agree" 
                            field={release.getField('field_trip_release')} 
                            onChange={this.handleChange} extension="release" 
                            validation={releaseInformationValidation.getValidation('field_trip_release')}
                            options={[{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Student Information</legend>
                    <div className="form-row">
                        <p>
                            I give my permission for the school to release the following: name, address, telephone listing, photograph, participation in activities or sports, 
                            awards received, parent guardian name. This information may be released to parent teacher organizations, media, or a school directory.
                        </p>
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="I Agree" 
                            field={release.getField('information_release')} 
                            onChange={this.handleChange} extension="release" 
                            validation={releaseInformationValidation.getValidation('information_release')}
                            options={[{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Fees Agreement</legend>
                    <div className="form-row">
                        <p>
                            I understand that I am financially responsible for book rental fees and any charges the school may assess for but not limited to lost books, 
                            cafeteria fees, library books, extracurricular activities, fund raisings and tuition. I shall also be responsible for all reasonable 
                            costs of the collection of this account, which may include but not limited to, late fees, client collection fees, collection agency fees, 
                            reasonable attorney fees and court costs on any outstanding balance.
                        </p>
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="I Agree" 
                            field={release.getField('fees_agreement')} 
                            onChange={this.handleChange} extension="release" 
                            validation={releaseInformationValidation.getValidation('fees_agreement')}
                            options={[{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]} />
                    </div>
                </fieldset>
                <h2>High School Only - Military Release</h2>
                <fieldset>
                    <div className="form-row">
                        <p>
                            The No Child Left Behind of 2001 states that schools must comply with a request by a military recruiter or an institute of 
                            higher education for secondary students' names, addresses and phone numbers, unless the parent denies this request in writing. 
                            Non-compliance from the school may result in loss of federal funds. 
                            I grant permission for the school to release information to a military recruiter or an institute of higher education.
                        </p>
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="I Agree" 
                            field={release.getField('military_release')} 
                            onChange={this.handleChange} extension="release" 
                            validation={releaseInformationValidation.getValidation('military_release')}
                            options={[{"label": "Yes", "value": 0}, {"label": "No", "value": 1}]} />
                    </div>
                </fieldset>
                <h2>Technology Information</h2>
                <fieldset>
                    <legend>Electronic Information Source Agreement / Internet</legend>
                    <div className="form-row">
                        <p>
                            Lafayette School Corporation strongly believes in the educational value of electronic services and recognizes their potential 
                            to support its curriculum and student learning by facilitating resource sharing, innovation, and communication. 
                            LSC uses a filtering system, and will make every effort to protect students and teachers from any misuses or abuses as a result 
                            of their experience with an information service. This places LSC in compliance with CIPA (Children’s Internet Protection Act). 
                            I give my permission for my child to use the Lafayette School Corporation network/internet. 
                            (The complete agreement can be found at the end of the registration)
                        </p>
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="I Agree" 
                            field={release.getField('internet_agreement')} 
                            onChange={this.handleChange} extension="release" 
                            validation={releaseInformationValidation.getValidation('internet_agreement')}
                            options={[{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]} />
                    </div>
                    <div className="form-row">
                        <Select className="col-sm-12" label="Does your child have Internet access at your home?" 
                            field={release.getField('internet_access')} 
                            onChange={this.handleChange} extension="release" 
                            validation={releaseInformationValidation.getValidation('internet_access')}
                            options={[{"label": "Yes", "value": 1}, {"label": "No", "value": 0}]} />
                    </div>
                </fieldset>
            </React.Fragment>
        )
    }
}

export default inject(stores => ({
    student: stores.rootStore.formStore.student
}))(observer(Agreements))