import React from 'react'
import { observer, inject } from 'mobx-react'
import NestedRadio from './nestedradio'
import NestedCheckbox from './nestedcheckbox'
import Select from './select'
import Input from './input'
class HealthInformation extends React.Component {
    componentDidMount() {
        const { healthInformationValidation, healthInformation } = this.props
        healthInformationValidation.validateAll(healthInformation.fieldsObj)
    }
    handleChange = (event) => {
        const { healthInformation, healthInformationValidation } = this.props
        const type = event.currentTarget.type
        const name = event.currentTarget.name
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
        healthInformation.setFieldValue(name, value)
        healthInformationValidation.validateAll(healthInformation.fieldsObj)
    }

    render() {
        const { healthInformation, healthInformationValidation } = this.props
        const asthmaSeverityOptions = [
            {"label": "High", "value": 2},
            {"label": "Mild", "value": 1}
        ]
        const diabetesOptions = [
            {"label": "Type 1", "value": "Type 1"},
            {"label": "Type 2", "value": "Type 2"}
        ]

        const insulinOptions = [
            {"label": "Syringe", "value": "Syringe"},
            {"label": "Pump", "value": "Pump"},
            {"label": "Both", "value": "Both"},
            {"label": "Does Not Take Insulin", "value": "Does Not Take Insulin"}
        ]

        const visionOptions = [
            {"label": "No", "value": "No"},
            {"label": "Glasses", "value": "Glasses"},
            {"label": "Contacts", "value": "Contacts"},
            {"label": "Other", "value": "Other"},
        ]

        const eatingDisorderOptions = [
            {"label": "None", "value": "No"},
            {"label": "Bulimia", "value": "Bulimia"},
            {"label": "Anorexia", "value": "Anorexia"}
        ]

        return (
            <fieldset>
                <legend>Health Information</legend>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getField('he_alg')} label="Allergies?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_alg')}>
                        <NestedRadio field={healthInformation.getField('he_alg_epi')} validation={healthInformationValidation.getValidation('he_alg_epi')}
                            label="Epi Pen?" onChange={this.handleChange} />
                        <NestedRadio field={healthInformation.getField('he_food_allergy')} validation={healthInformationValidation.getValidation('he_food_allergy')}
                            label="Food Allergy?" onChange={this.handleChange}>
                            <NestedRadio field={healthInformation.getField('he_food_al_table')} validation={healthInformationValidation.getValidation('he_food_al_table')}
                                label="Sit at an Allergens Free Table?" onChange={this.handleChange} />
                            <div className="form-row">
                                <Input type="textarea" label="List of Food Allergens" validation={healthInformationValidation.getValidation('he_food_allergens')}
                                    name="he_food_allergens" value={healthInformation.getField('he_food_allergens')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="textarea" label="List of Food Allergy Symptoms" validation={healthInformationValidation.getValidation('he_food_sympt')}
                                    name="he_food_sympt" value={healthInformation.getField('he_food_sympt')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getField('he_sesonal_allergy')} label="Seasonal Allergy?" onChange={this.handleChange} 
                            validation={healthInformationValidation.getValidation('he_sesonal_allergy')} >
                            <div className="form-row">
                                <Input type="text" label="List of Seasonal Allergens" name="he_seasonal_al_list" value={healthInformation.getField('he_seasonal_al_list')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="text" label="List of Seasonal Allergy Symptoms" name="he_seasonal_al_sym" value={healthInformation.getField('he_seasonal_al_sym')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getField('he_insect_allergy')} label="Insect Allergy?" 
                        validation={healthInformationValidation.getValidation('he_insect_allergy')} onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" label="List of Insect Allergens" name="he_insect_al_list" value={healthInformation.getField('he_insect_al_list')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="text" label="List of Insect Allergy Symptoms" name="he_insect_al_sym" value={healthInformation.getField('he_insect_al_sym')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                        <div className="form-row">
                            <div className="col">
                                <label>What is Your Usual Allergy Treatment Plan?</label>
                                <textarea className="form-control" value={healthInformation.getField('he_insect_al_treat')['value']} onChange={this.handleChange} />
                            </div>
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getField('he_asthma')} label="Asthma?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_asthma')}>
                        <div className="form-row ">
                            <Select field={healthInformation.getField('he_asthma_sev')} label="Severity" options={asthmaSeverityOptions} onChange={this.handleChange} />
                        </div>
                        <div className="form-row ">
                            <legend className="col-form-label"><strong>Asthma Triggers</strong></legend>
                            <NestedCheckbox field={healthInformation.getField('he_asthma_cold')} label="Cold/Flu" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_temp')} label="Extreme Heat/Cold" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_exc')} label="Exercise" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_pol')} label="Pollen" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_ins')} label="Insects" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_smo')} label="Smoke" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_lat')} label="Latex" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_ani')} label="Animals" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_med')} label="Medication Allergy" onChange={this.handleChange}>
                                <Input type="textarea" name="he_asthma_med_exp" value={healthInformation.getField('he_asthma_med_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>
                            <NestedCheckbox field={healthInformation.getField('he_asthma_food')} label="Food Allergy" onChange={this.handleChange}>
                                <Input type="textarea" name="he_asthma_food_exp" value={healthInformation.getField('he_asthma_food_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>
                            <NestedCheckbox field={healthInformation.getField('he_asthma_oth')} label="Other" onChange={this.handleChange}>
                                <Input type="textarea" name="he_asthma_oth_exp" value={healthInformation.getField('he_asthma_oth_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>
                        </div>
                        <div className="form-row ">
                            <legend className="col-form-label">
                                <strong>What does your student do at home to relieve wheezing during an asthma episode?</strong>
                            </legend>
                            <NestedCheckbox field={healthInformation.getField('he_asthma_breathing')} label="Breathing Exercises" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_inhaler')} label="Uses Inhaler" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_neb')} label="Uses Nebulizer" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_water')} label="Drinks Water" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_rest')} label="Rest/Relaxation" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getField('he_asthma_wheez_other')} label="Other" onChange={this.handleChange}>
                                <Input type="textarea" placeholder="Explain Other..." name="he_asthma_wheez_other_exp" 
                                    value={healthInformation.getField('he_asthma_wheez_other_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>

                        </div>
                        <div className="form-row">
                            <Input type="text" label="Frequency of Doctor Evaluations" name="he_asthma_dr_eval" value={healthInformation.getField('he_asthma_dr_eval')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <Input type="text" className="col-sm-12 col-lg-6" label="ER Visits in the Past Year Due to Asthma" name="he_asthma_er" value={healthInformation.getField('he_asthma_er')['value']} onChange={this.handleChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="School Days Missed Last Year Due to Asthma" name="he_asthma_miss_days" value={healthInformation.getField('he_asthma_miss_days')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getField('he_seizure')} label="Experience Seizures?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_seizure')}>
                        <NestedRadio field={healthInformation.getField('he_seizure_diag_dr')} label="Diagnosed by a Physician?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" label="Name of Physician" name="he_seizure_dr" value={healthInformation.getField('he_seizure_dr')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getField('he_seizure_diag_eeg')} label="Diagnosed by a EEG?" onChange={this.handleChange} />
                        <div className="form-row">
                            <Input type="text" label="Date of Last Seizure?" name="he_seizure_date" value={healthInformation.getField('he_seizure_date')['value']} onChange={this.handleChange} />
                        </div>
                        <NestedRadio field={healthInformation.getField('he_seizure_med')} label="Takes Medication Daily for Seizures?" onChange={this.handleChange} />
                        <NestedRadio field={healthInformation.getField('he_seizure_over_five')} label="Call 911 if Seizure at School Last More Than 5 Minutes?" onChange={this.handleChange}/>
                        <NestedRadio field={healthInformation.getField('he_seizure_under_five')} label="Call 911 if Seizure at School Last Less Than 5 Minutes?" onChange={this.handleChange}/>
                        <legend className="col-form-label "><em>Types of Seizures</em></legend>
                        <NestedRadio field={healthInformation.getField('he_seizure_abs')} label="Absence Seizure?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" className="col-sm-12 col-lg-6" label="Length of Absence Seizure" name="he_seizure_abs_len" value={healthInformation.getField('he_seizure_abs_len')['value']} onChange={this.handleChange} />
                                <Input type="text" className="col-sm-12 col-lg-6" label="Frequency of Absence Seizure" name="he_seizure_abs_fre" value={healthInformation.getField('he_seizure_abs_fre')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <div className="col">
                                    <label htmlFor="he_seizure_abs_desc">Description of Absence Seizure</label>
                                    <textarea type="text" className="form-control" id="he_seizure_abs_desc" name="he_seizure_abs_desc" value={healthInformation.getField('he_seizure_abs_desc')['value']} onChange={this.handleChange} />
                                </div>
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getField('he_seizure_grand')} label="Grand Mal Seizure?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" className="col-sm-12 col-lg-6" label="Length of Grand Mal Seizure" name="he_seizure_grand_len" value={healthInformation.getField('he_seizure_grand_len')['value']} onChange={this.handleChange} />
                                <Input type="text" className="col-sm-12 col-lg-6" label="Frequency of Grand Mal Seizure" name="he_seizure_grand_fre" value={healthInformation.getField('he_seizure_grand_fre')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <div className="col">
                                    <label htmlFor="he_seizure_grand_desc">Description of Grand Mal Seizure</label>
                                    <textarea type="text" className="form-control" id="he_seizure_grand_desc" name="he_seizure_grand_desc" value={healthInformation.getField('he_seizure_grand_desc')['value']} onChange={this.handleChange} />
                                </div>
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getField('he_seizure_partial')} label="Partial/Complex Seizure?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" className="col-sm-12 col-lg-6" label="Length of Partial/Complex Seizure" name="he_seizure_partial_len" value={healthInformation.getField('he_seizure_partial_len')['value']} onChange={this.handleChange} />
                                <Input type="text" className="col-sm-12 col-lg-6" label="Frequency of Partial/Complex Seizure" name="he_seizure_partial_fre" value={healthInformation.getField('he_seizure_partial_fre')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <div className="col">
                                    <label htmlFor="he_seizure_partial_desc">Description of Partial/Complex Seizure</label>
                                    <textarea type="text" className="form-control" id="he_seizure_partial_desc" name="he_seizure_partial_desc" value={healthInformation.getField('he_seizure_partial_desc')['value']} onChange={this.handleChange} />
                                </div>
                            </div>
                        </NestedRadio>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getField('he_diabetes')} label="Diabetes?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_diabetes')}>
                        <div className="form-row">
                            <Select className="col-sm-12 col-lg-6" field={healthInformation.getField('he_diabetes_type')} label="Diabetes Type" onChange={this.handleChange} options={diabetesOptions} />
                            <Select className="col-sm-12 col-lg-6" field={healthInformation.getField('he_diabetes_ins_by')} label="Student Takes Insulin By" onChange={this.handleChange} options={insulinOptions} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="Date of Diagnosis of Diabetes" name="he_diabetes_date" value={healthInformation.getField('he_diabetes_date')['value']} onChange={this.handleChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="Usual Blood Sugar Range" name="he_diabetes_range" value={healthInformation.getField('he_diabetes_range')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual Signs/Symptoms of Low Blood Sugar" name="he_diabetes_low_sym" value={healthInformation.getField('he_diabetes_low_sym')['value']} onChange={this.handleChange} />
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual/Favored Treatment for Low Blood Sugar" name="he_diabetes_low_treat" value={healthInformation.getField('he_diabetes_low_treat')['value']} onChange={this.handleChange} />
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual Signs/Symptoms of High Blood Sugar" name="he_diabetes_high_sym" value={healthInformation.getField('he_diabetes_high_sym')['value']} onChange={this.handleChange} />
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual/Favored Treatment for High Blood Sugar" name="he_diabetes_high_treat" value={healthInformation.getField('he_diabetes_high_treat')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <Input type="text" className="col-sm-12 col-lg-6" label="Name of Diabetes Physician" name="he_diabetes_dr" value={healthInformation.getField('he_diabetes_dr')['value']} onChange={this.handleChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="Phone Number of Diabetes Physician" name="he_diabetes_dr_num" value={healthInformation.getField('he_diabetes_dr_num')['value']} onChange={this.handleChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="Name of Diabetes Medical Center" name="he_diabetes_med_cen" value={healthInformation.getField('he_diabetes_med_cen')['value']} onChange={this.handleChange} />

                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getField('he_mental')} label="Mental Disorders?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_mental')}>
                        <div className="form-row">
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_dep')} label="Depression?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_anx')} label="Anxiety?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_ocd')} label="OCD?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_odd')} label="ODD?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_polar')} label="Bipolar Disorder?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_med')} label="Taking medication for mental disorder?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_phys')} label="Regularly seeing physician for mental disorder?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_coun')} label="Receiving counseling for mental disorder?" onChange={this.handleChange} />
                            <NestedRadio  className="col-sm-12 col-md-6" field={healthInformation.getField('he_mental_hosp')} label="Has ever been hospitalized for any mental disorder?" onChange={this.handleChange}>
                                <div className="form-row">
                                    <Input type="text" className="col-sm-12" label="Last Dates of Hospitalization?" name="he_mental_hosp_date" value={healthInformation.getField('he_mental_hosp_date')['value']} onChange={this.handleChange} />
                                    <Input type="text" className="col-sm-12" label="Hospital Name" name="he_mental_hosp_name" value={healthInformation.getField('he_mental_hosp_name')['value']} onChange={this.handleChange} />
                                </div>
                            </NestedRadio>
                        </div>

                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getField('he_autism')} label="Autism?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_autism')}>
                        <NestedRadio field={healthInformation.getField('he_autism_diag')} label="Diagnosed by a Physician?" onChange={this.handleChange} />
                    </NestedRadio>
                    <NestedRadio field={healthInformation.getField('he_add')} label="ADD?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_add')}>
                        <NestedRadio field={healthInformation.getField('he_add_dr')} label="Diagnosed by a Physician?" onChange={this.handleChange} />
                    </NestedRadio>
                    <Select className="col-md-6 col-sm-12" field={healthInformation.getField('he_vision')} label="Eye/Vision Problems?" 
                        onChange={this.handleChange} options={visionOptions} 
                        validation={healthInformationValidation.getValidation('he_vision')}/>
                    <NestedRadio field={healthInformation.getField('he_blood')} label="Blood Disorder?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_blood')}/>
                    <NestedRadio field={healthInformation.getField('he_bone')} label="Bone/Joint Problems?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_bone')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Bone/Joint Problem" name="he_bone_type" value={healthInformation.getField('he_bone_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                    <NestedRadio field={healthInformation.getField('he_bowel')} label="Bowel/Bladder Problems?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_bowel')} />
                    <NestedRadio field={healthInformation.getField('he_hear')} label="Hearing Problems?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_hear')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Hearing Problem" name="he_hear_type" value={healthInformation.getField('he_hear_type')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <NestedRadio field={healthInformation.getField('he_hear_aid')} label="Hearing Aid?" onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                    <NestedRadio field={healthInformation.getField('he_genetic')} label="Genetic Disorder?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_genetic')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Genetic Disorder" name="he_genetic_type" value={healthInformation.getField('he_genetic_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                    <NestedRadio field={healthInformation.getField('he_serious')} label="Serious Injuries?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_serious')} />
                    <NestedRadio field={healthInformation.getField('he_hospital')} label="Hospitalization?" onChange={this.handleChange}
                        validation={healthInformationValidation.getValidation('he_hospital')} />
                    <NestedRadio field={healthInformation.getField('he_surgery')} label="Surgery(s)?" onChange={this.handleChange}
                        validation={healthInformationValidation.getValidation('he_surgery')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Surgery" name="he_surgery_type" value={healthInformation.getField('he_surgery_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                    <NestedRadio field={healthInformation.getField('he_tb_contact')} label="TB/TB Contact?" onChange={this.handleChange}
                        validation={healthInformationValidation.getValidation('he_tb_contact')} />
                    <Select className="col-sm-12 col-md-6" field={healthInformation.getField('he_eating')} validation={healthInformationValidation.getValidation('he_eating')} 
                        label="Eating Disorder?" onChange={this.handleChange} options={eatingDisorderOptions} />
                    <NestedRadio field={healthInformation.getField('he_born')} label="Was the Child Born Premature?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_born')} />
                </div>
            </fieldset>
        )
    }
}

export default inject(stores => ({
    healthInformation: stores.rootStore.formStore.student.healthInformation,
    healthInformationValidation: stores.rootStore.formStore.student.healthInformationValidation
}))(observer(HealthInformation))