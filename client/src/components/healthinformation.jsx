import React from 'react'
import { observer, inject } from 'mobx-react'
import NestedRadio from './nestedradio'
import NestedCheckbox from './nestedcheckbox'
import Select from './select'
import Input from './input'
import Formatter from '../stores/formatter'
import Validation from './validation'
class HealthInformation extends React.Component {
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
        let format = event.currentTarget.dataset.format
        if (format) {
            value = Formatter[format](value) 
        }
        healthInformation.setFieldValue(name, value)
        healthInformationValidation.validateAll(healthInformation.fieldsObj)
    }

    handleDateChange = (date, props) => {
        const { name } = props
        const { healthInformation, healthInformationValidation } = this.props
        const dateValue = date ? date.toLocaleDateString("en-US") : ''
        healthInformation.setFieldValue(name, dateValue)
        healthInformationValidation.validateAll(healthInformation.fieldsObj)
    }

    render() {
        const { healthInformation, healthInformationValidation } = this.props
        const asthmaSeverityOptions = [
            {"label": "Mild", "value": 1},
            {"label": "Severe", "value": 2}
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

        const allergenFreeOptions = [
            {"label": "I DO want my child to set at the \"Allergen Free\" table during his/her lunch hour", "value": 1},
            {"label": "I DO NOT want my child to set at the \"Allergen Free\" table during his/her lunch hour", "value": 0}
        ]

        return (
            <fieldset>
                <legend>Hospital Information</legend>
                <div className="form-row">
                    <Input type="text" label="Preferred Hospital"
                        name="preferred_hospital" value={healthInformation.getOrCreateField('preferred_hospital')['value']} onChange={this.handleChange} />

                </div>
                <legend>Health Information</legend>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_alg')} label="Allergies?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_alg')}>
                        <NestedRadio field={healthInformation.getOrCreateField('he_alg_epi')} validation={healthInformationValidation.getValidation('he_alg_epi')}
                            label="Epi Pen?" onChange={this.handleChange} />
                        <NestedRadio field={healthInformation.getOrCreateField('he_food_allergy')} validation={healthInformationValidation.getValidation('he_food_allergy')}
                            label="Food Allergy?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="textarea" label="List of Food Allergens" validation={healthInformationValidation.getValidation('he_food_allergens')}
                                    name="he_food_allergens" value={healthInformation.getOrCreateField('he_food_allergens')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="textarea" label="List of Food Allergy Symptoms" validation={healthInformationValidation.getValidation('he_food_sympt')}
                                    name="he_food_sympt" value={healthInformation.getOrCreateField('he_food_sympt')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="date" label="Date of last reaction" validation={healthInformationValidation.getValidation('he_food_date_last')}
                                    name="he_food_date_last" value={healthInformation.getOrCreateField('he_food_date_last')['value']} onChange={this.handleDateChange} />
                            </div>
                            <div className="form-row">
                                <p className="text-danger">
                                    This is to inform you that the school cafeteria has an "Allergen Free" table available. 
                                    You indicated that your child has a severe food allergy</p>
                                <NestedRadio displayBlock={true} field={healthInformation.getOrCreateField('he_food_al_table')}
                                    validation={healthInformationValidation.getValidation('he_food_al_table')} 
                                    options={allergenFreeOptions} onChange={this.handleChange} label={"Please select the appropriate response below."} />
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getOrCreateField('he_sesonal_allergy')} label="Seasonal Allergy?" onChange={this.handleChange} 
                            validation={healthInformationValidation.getValidation('he_sesonal_allergy')} >
                            <div className="form-row">
                                <Input type="textarea" label="List of Seasonal Allergens" name="he_seasonal_al_list" value={healthInformation.getOrCreateField('he_seasonal_al_list')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="textarea" label="List of Seasonal Allergy Symptoms" name="he_seasonal_al_sym" value={healthInformation.getOrCreateField('he_seasonal_al_sym')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="date" label="Date of last reaction"
                                    name="he_seasonal_date_last" value={healthInformation.getOrCreateField('he_seasonal_date_last')['value']} onChange={this.handleDateChange} />
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getOrCreateField('he_insect_allergy')} label="Insect Allergy?" 
                            validation={healthInformationValidation.getValidation('he_insect_allergy')} onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="textarea" label="List of Insect Allergens" name="he_insect_al_list" value={healthInformation.getOrCreateField('he_insect_al_list')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="textarea" label="List usual symptoms" name="he_insect_al_sym" value={healthInformation.getOrCreateField('he_insect_al_sym')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="date" label="Date of last reaction"
                                    name="he_insect_date_last" value={healthInformation.getOrCreateField('he_insect_date_last')['value']} onChange={this.handleDateChange} />
                            </div>
                        </NestedRadio>
                        <div className="form-row">
                            <Input type="textarea" label="What is Your Usual Allergy Treatment Plan?" name="he_insect_al_treat" 
                                value={healthInformation.getOrCreateField('he_insect_al_treat')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_asthma')} label="Asthma?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_asthma')}>
                        <div className="form-row">
                            <NestedRadio displayBlock={true} field={healthInformation.getOrCreateField('he_asthma_sev')}
                                validation={healthInformationValidation.getValidation('he_asthma_sev')} 
                                options={asthmaSeverityOptions} onChange={this.handleChange} label={"My student's Asthma is:"} />
                        </div>
                        <div className="d-flex flex-row align-items-baseline">
                            <div className="mr-2"><strong>Asthma Triggers</strong></div>
                            <Validation validation={healthInformationValidation.getValidation('he_asthma_trigger')} />
                        </div>
                        <div className="form-row">
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_cold')} label="Cold/Flu" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_temp')} label="Extreme Heat/Cold" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_exc')} label="Exercise" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_pol')} label="Pollen" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_ins')} label="Insects" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_smo')} label="Smoke" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_lat')} label="Latex" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_ani')} label="Animals" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_med')} label="Medication Allergy" onChange={this.handleChange}>
                                <Input type="textarea" name="he_asthma_med_exp" 
                                    placeholder="What medicine?"
                                    validation={healthInformationValidation.getValidation('he_asthma_med_exp')} 
                                    value={healthInformation.getOrCreateField('he_asthma_med_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_food')} label="Food Allergy" onChange={this.handleChange}>
                                <Input type="textarea" name="he_asthma_food_exp" 
                                    placeholder="What food?"
                                    validation={healthInformationValidation.getValidation('he_asthma_food_exp')} 
                                    value={healthInformation.getOrCreateField('he_asthma_food_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_oth')} label="Other" onChange={this.handleChange}>
                                <Input type="textarea" placeholder="Explain Other..." 
                                    name="he_asthma_oth_exp"
                                    validation={healthInformationValidation.getValidation('he_asthma_oth_exp')} 
                                    value={healthInformation.getOrCreateField('he_asthma_oth_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>
                        </div>
                        <div className="form-row">
                            <div className="d-flex flex-column align-items-baseline">
                                <div className="mr-2"><strong>What does your student do at home to relieve wheezing during an asthma episode?</strong></div>
                                <Validation validation={healthInformationValidation.getValidation('he_asthma_exercises')} />
                            </div>
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_breathing')} label="Breathing Exercises" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_inhaler')} label="Uses Inhaler" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_neb')} label="Uses Nebulizer" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_water')} label="Drinks Water" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_rest')} label="Rest/Relaxation" onChange={this.handleChange} />
                            <NestedCheckbox field={healthInformation.getOrCreateField('he_asthma_wheez_other')} label="Other" onChange={this.handleChange}>
                                <Input type="textarea" placeholder="Explain Other..." name="he_asthma_wheez_other_exp" 
                                    validation={healthInformationValidation.getValidation('he_asthma_wheez_other_exp')}
                                    value={healthInformation.getOrCreateField('he_asthma_wheez_other_exp')['value']} onChange={this.handleChange} />
                            </NestedCheckbox>

                        </div>
                        <div className="form-row">
                            <Input type="text" label="Frequency of Doctor Evaluations" name="he_asthma_dr_eval" value={healthInformation.getOrCreateField('he_asthma_dr_eval')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <Input type="text" className="col-sm-12 col-lg-6" label="ER Visits in the Past Year Due to Asthma" name="he_asthma_er" value={healthInformation.getOrCreateField('he_asthma_er')['value']} onChange={this.handleChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="School Days Missed Last Year Due to Asthma" name="he_asthma_miss_days" value={healthInformation.getOrCreateField('he_asthma_miss_days')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_seizure')} label="Experience Seizures?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_seizure')}>
                        <NestedRadio field={healthInformation.getOrCreateField('he_seizure_diag_dr')} 
                            validation={healthInformationValidation.getValidation('he_seizure_diag_dr')}
                            label="Diagnosed by a Physician?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" label="Name of Physician"
                                    validation={healthInformationValidation.getValidation('he_seizure_dr')}
                                    name="he_seizure_dr" value={healthInformation.getOrCreateField('he_seizure_dr')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                        <NestedRadio 
                            validation={healthInformationValidation.getValidation('he_seizure_diag_eeg')}
                            field={healthInformation.getOrCreateField('he_seizure_diag_eeg')} label="Diagnosed by a EEG?" onChange={this.handleChange} />
                         <Input className="col-sm-12" type="date" label="Date of Last Seizure?" name="he_seizure_date" value={healthInformation.getOrCreateField('he_seizure_date')['value']} onChange={this.handleDateChange} />
                        <NestedRadio field={healthInformation.getOrCreateField('he_seizure_med')} 
                            validation={healthInformationValidation.getValidation('he_seizure_med')}
                            label="Takes Medication Daily for Seizures?" onChange={this.handleChange} />
                        <NestedRadio field={healthInformation.getOrCreateField('he_seizure_over_five')} 
                            validation={healthInformationValidation.getValidation('he_seizure_over_five')}
                            label="Call 911 if Seizure at School Last More Than 5 Minutes?" onChange={this.handleChange}/>
                        <NestedRadio field={healthInformation.getOrCreateField('he_seizure_under_five')} 
                            validation={healthInformationValidation.getValidation('he_seizure_under_five')}
                            label="Call 911 if Seizure at School Last Less Than 5 Minutes?" onChange={this.handleChange}/>
                        <legend className="col-form-label "><em>Types of Seizures</em></legend>
                        <NestedRadio field={healthInformation.getOrCreateField('he_seizure_abs')} 
                            validation={healthInformationValidation.getValidation('he_seizure_abs')}
                            label="Absence Seizure?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" className="col-sm-12 col-lg-6" label="Length of Absence Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_abs_len')}
                                    name="he_seizure_abs_len" value={healthInformation.getOrCreateField('he_seizure_abs_len')['value']} onChange={this.handleChange} />
                                <Input type="text" className="col-sm-12 col-lg-6" label="Frequency of Absence Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_abs_fre')}
                                    name="he_seizure_abs_fre" value={healthInformation.getOrCreateField('he_seizure_abs_fre')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="textarea" label="Description of Absence Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_abs_desc')}
                                    name="he_seizure_abs_desc" value={healthInformation.getOrCreateField('he_seizure_abs_desc')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getOrCreateField('he_seizure_grand')} 
                            validation={healthInformationValidation.getValidation('he_seizure_grand')}
                            label="Grand Mal Seizure?" 
                            onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" className="col-sm-12 col-lg-6" label="Length of Grand Mal Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_grand_len')}
                                    name="he_seizure_grand_len" value={healthInformation.getOrCreateField('he_seizure_grand_len')['value']} onChange={this.handleChange} />
                                <Input type="text" className="col-sm-12 col-lg-6" label="Frequency of Grand Mal Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_grand_fre')}
                                    name="he_seizure_grand_fre" value={healthInformation.getOrCreateField('he_seizure_grand_fre')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="textarea" label="Description of Grand Mal Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_grand_desc')}
                                    name="he_seizure_grand_desc" value={healthInformation.getOrCreateField('he_seizure_grand_desc')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                        <NestedRadio field={healthInformation.getOrCreateField('he_seizure_partial')} 
                            validation={healthInformationValidation.getValidation('he_seizure_partial')}
                            label="Partial/Complex Seizure?" onChange={this.handleChange}>
                            <div className="form-row">
                                <Input type="text" className="col-sm-12 col-lg-6" label="Length of Partial/Complex Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_partial_len')}
                                    name="he_seizure_partial_len" value={healthInformation.getOrCreateField('he_seizure_partial_len')['value']} onChange={this.handleChange} />
                                <Input type="text" className="col-sm-12 col-lg-6" label="Frequency of Partial/Complex Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_partial_fre')}
                                    name="he_seizure_partial_fre" value={healthInformation.getOrCreateField('he_seizure_partial_fre')['value']} onChange={this.handleChange} />
                            </div>
                            <div className="form-row">
                                <Input type="textarea" label="Description of Partial/Complex Seizure" 
                                    validation={healthInformationValidation.getValidation('he_seizure_partial_desc')}
                                    name="he_seizure_partial_desc" value={healthInformation.getOrCreateField('he_seizure_partial_desc')['value']} onChange={this.handleChange} />
                            </div>
                        </NestedRadio>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_diabetes')} label="Diabetes?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_diabetes')}>
                        <div className="form-row">
                            <p className="text-danger">***Diabetes Medical Management and treatment plan and needed diabetes supplies must be on file with the school nurse before the first day of school for student to attend.</p>
                        </div>
                        <div className="form-row">
                            <Select className="col-sm-12 col-lg-6" field={healthInformation.getOrCreateField('he_diabetes_type')} 
                                validation={healthInformationValidation.getValidation('he_diabetes_type')}
                                label="Diabetes Type" onChange={this.handleChange} options={diabetesOptions} />
                            <Select className="col-sm-12 col-lg-6" field={healthInformation.getOrCreateField('he_diabetes_ins_by')} 
                                validation={healthInformationValidation.getValidation('he_diabetes_ins_by')}
                                label="Student Takes Insulin By" onChange={this.handleChange} options={insulinOptions} />
                            <Input type="date" className="col-sm-12 col-lg-6" label="Date of Diagnosis of Diabetes" name="he_diabetes_date" value={healthInformation.getOrCreateField('he_diabetes_date')['value']} onChange={this.handleDateChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="Usual Blood Sugar Range" name="he_diabetes_range" value={healthInformation.getOrCreateField('he_diabetes_range')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual Signs/Symptoms of Low Blood Sugar" name="he_diabetes_low_sym" value={healthInformation.getOrCreateField('he_diabetes_low_sym')['value']} onChange={this.handleChange} />
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual/Favored Treatment for Low Blood Sugar" name="he_diabetes_low_treat" value={healthInformation.getOrCreateField('he_diabetes_low_treat')['value']} onChange={this.handleChange} />
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual Signs/Symptoms of High Blood Sugar" name="he_diabetes_high_sym" value={healthInformation.getOrCreateField('he_diabetes_high_sym')['value']} onChange={this.handleChange} />
                            <Input type="textarea" className="col-sm-12 col-lg-6" label="Usual/Favored Treatment for High Blood Sugar" name="he_diabetes_high_treat" value={healthInformation.getOrCreateField('he_diabetes_high_treat')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <Input type="text" className="col-sm-12 col-lg-6" label="Name of Diabetes Physician" name="he_diabetes_dr" value={healthInformation.getOrCreateField('he_diabetes_dr')['value']} onChange={this.handleChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="Phone Number of Diabetes Physician" format="phoneFormat" name="he_diabetes_dr_num" value={healthInformation.getOrCreateField('he_diabetes_dr_num')['value']} onChange={this.handleChange} />
                            <Input type="text" className="col-sm-12 col-lg-6" label="Name of Diabetes Medical Center" name="he_diabetes_med_cen" value={healthInformation.getOrCreateField('he_diabetes_med_cen')['value']} onChange={this.handleChange} />

                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_mental')} label="Mental Disorders?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_mental')}>
                        <div className="form-row">
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_dep')}
                                field={healthInformation.getOrCreateField('he_mental_dep')} label="Depression?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_anx')}
                                field={healthInformation.getOrCreateField('he_mental_anx')} label="Anxiety?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_ocd')}
                                field={healthInformation.getOrCreateField('he_mental_ocd')} label="OCD?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_odd')}
                                field={healthInformation.getOrCreateField('he_mental_odd')} label="ODD?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_polar')}
                                field={healthInformation.getOrCreateField('he_mental_polar')} label="Bipolar Disorder?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_med')}
                                field={healthInformation.getOrCreateField('he_mental_med')} label="Taking medication for mental disorder?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_phys')}
                                field={healthInformation.getOrCreateField('he_mental_phys')} label="Regularly seeing physician for mental disorder?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_coun')}
                                field={healthInformation.getOrCreateField('he_mental_coun')} label="Receiving counseling for mental disorder?" onChange={this.handleChange} />
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_hosp')}
                                field={healthInformation.getOrCreateField('he_mental_hosp')} label="Has your student ever been hospitalized for any mental disorder?" onChange={this.handleChange}>
                                <div className="form-row">
                                    <Input type="text" className="col-sm-12" 
                                        validation={healthInformationValidation.getValidation('he_mental_hosp_date')}
                                        label="If so, what are the last dates of hospitalization?" name="he_mental_hosp_date" value={healthInformation.getOrCreateField('he_mental_hosp_date')['value']} onChange={this.handleChange} />
                                    <Input type="text" className="col-sm-12" 
                                        validation={healthInformationValidation.getValidation('he_mental_hosp_name')}
                                        label="What hospital was the student brought to?" name="he_mental_hosp_name" value={healthInformation.getOrCreateField('he_mental_hosp_name')['value']} onChange={this.handleChange} />
                                </div>
                            </NestedRadio>
                            <NestedRadio className="col-sm-12" 
                                validation={healthInformationValidation.getValidation('he_mental_harm')}
                                field={healthInformation.getOrCreateField('he_mental_harm')} label="Does your student have any history of self-harm?" onChange={this.handleChange}>
                                <div className="form-row">
                                    <Input type="textarea" className="col-sm-12" 
                                        validation={healthInformationValidation.getValidation('he_mental_harm_desc')}
                                        label="Please describe self-harm" name="he_mental_harm_desc" value={healthInformation.getOrCreateField('he_mental_harm_desc')['value']} onChange={this.handleChange} />
                                    <Input type="date" className="col-sm-12" 
                                        label="What was the last date of self-harm concern?" name="he_mental_harm_date" value={healthInformation.getOrCreateField('he_mental_harm_date')['value']} onChange={this.handleDateChange} />
                                </div>
                            </NestedRadio>
                        </div>

                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_autism')} label="Autism?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_autism')}>
                        <NestedRadio field={healthInformation.getOrCreateField('he_autism_diag')} 
                            validation={healthInformationValidation.getValidation('he_autism_diag')}
                            label="Diagnosed by a Physician?" onChange={this.handleChange} />
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_add')} label="ADD?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_add')}>
                        <NestedRadio field={healthInformation.getOrCreateField('he_add_dr')} 
                            validation={healthInformationValidation.getValidation('he_add_dr')}
                            label="Diagnosed by a Physician?" onChange={this.handleChange} />
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <Select className="col-md-6 col-sm-12" field={healthInformation.getOrCreateField('he_vision')} label="Eye/Vision Problems?" 
                        onChange={this.handleChange} options={visionOptions} 
                        validation={healthInformationValidation.getValidation('he_vision')} childrenTrigger="Other">
                            <Input type="textarea" placeholder="Explain Other..." 
                                name="he_vision_other"
                                validation={healthInformationValidation.getValidation('he_vision_other')} 
                                value={healthInformation.getOrCreateField('he_vision_other')['value']} onChange={this.handleChange} />
                    </Select>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_blood')} label="Blood Disorder?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_blood')}>
                        <div className="form-row">
                            <Input type="text" label="Name of Disorder" 
                                validation={healthInformationValidation.getValidation('he_blood_type')}
                                name="he_blood_type" value={healthInformation.getOrCreateField('he_blood_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_bone')} label="Bone/Joint Problems?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_bone')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Bone/Joint Problem" 
                                validation={healthInformationValidation.getValidation('he_bone_type')}
                                name="he_bone_type" value={healthInformation.getOrCreateField('he_bone_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_bowel')} label="Bowel/Bladder Problems?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_bowel')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Bowel/Bladder Problems" 
                                validation={healthInformationValidation.getValidation('he_bowel_type')}
                                name="he_bowel_type" value={healthInformation.getOrCreateField('he_bowel_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_hear')} label="Hearing Problems?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_hear')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Hearing Problem" 
                                validation={healthInformationValidation.getValidation('he_hear_type')}
                                name="he_hear_type" value={healthInformation.getOrCreateField('he_hear_type')['value']} onChange={this.handleChange} />
                        </div>
                        <div className="form-row">
                            <NestedRadio field={healthInformation.getOrCreateField('he_hear_aid')} 
                                validation={healthInformationValidation.getValidation('he_hear_aid')}
                                label="Hearing Aid?" onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_genetic')} label="Genetic Disorder?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_genetic')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Genetic Disorder" 
                                validation={healthInformationValidation.getValidation('he_genetic_type')}
                                name="he_genetic_type" value={healthInformation.getOrCreateField('he_genetic_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_serious')} label="Serious Injuries?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_serious')}>
                        <div className="form-row">
                            <Input type="textarea" label="When/Type" 
                                validation={healthInformationValidation.getValidation('he_serious_type')}
                                name="he_serious_type" value={healthInformation.getOrCreateField('he_serious_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_hospital')} label="Hospitalization?" onChange={this.handleChange}
                        validation={healthInformationValidation.getValidation('he_hospital')}>
                        <div className="form-row">
                            <Input type="textarea" label="When/Reason" 
                                validation={healthInformationValidation.getValidation('he_hospital_type')}
                                name="he_hospital_type" value={healthInformation.getOrCreateField('he_hospital_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_surgery')} label="Surgery(s)?" onChange={this.handleChange}
                        validation={healthInformationValidation.getValidation('he_surgery')}>
                        <div className="form-row">
                            <Input type="textarea" label="Describe Surgery" 
                                validation={healthInformationValidation.getValidation('he_surgery_type')}
                                name="he_surgery_type" value={healthInformation.getOrCreateField('he_surgery_type')['value']} onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_tb_contact')} label="TB/TB Contact?" onChange={this.handleChange}
                        validation={healthInformationValidation.getValidation('he_tb_contact')} />
                </div>
                <div className="form-row">
                    <Select className="col-sm-12 col-md-6" field={healthInformation.getOrCreateField('he_eating')} validation={healthInformationValidation.getValidation('he_eating')} 
                        label="Eating Disorder?" onChange={this.handleChange} options={eatingDisorderOptions} />
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_born')} label="Was the Child Born Premature?" onChange={this.handleChange} 
                        validation={healthInformationValidation.getValidation('he_born')}>
                        <div className="form-row">
                            <Input type="text" label="How many weeks/days early?" name="he_born_wk" 
                                value={healthInformation.getOrCreateField('he_born_wk')['value']}
                                validation={healthInformationValidation.getValidation('he_born_wk')} 
                                onChange={this.handleChange} />
                        </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <NestedRadio field={healthInformation.getOrCreateField('he_med')} label="Does your child take medications?" onChange={this.handleChange}
                        validation={healthInformationValidation.getValidation('he_med')}>
                            <div className="form-row">
                                <legend>Medication 1</legend>
                                <Input type="text" label="Medication Name" name="he_med_1" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_1')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_1')} 
                                    onChange={this.handleChange} />
                                <Input type="text" label="Dose" name="he_med_1_dose" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_1_dose')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_1_dose')} 
                                    onChange={this.handleChange} />
                                <Select className="col-sm-12" field={healthInformation.getOrCreateField('he_med_1_sc')} 
                                    validation={healthInformationValidation.getValidation('he_med_1_sc')} 
                                    label="Taken at school?" onChange={this.handleChange} options={[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}]} />
                            </div>
                            <div className="form-row">
                                <legend>Medication 2</legend>
                                <Input type="text" label="Medication Name" name="he_med_2" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_2')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_2')} 
                                    onChange={this.handleChange} />
                                <Input type="text" label="Dose" name="he_med_2_dose" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_2_dose')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_2_dose')} 
                                    onChange={this.handleChange} />
                                <Select className="col-sm-12" field={healthInformation.getOrCreateField('he_med_2_sc')} 
                                    validation={healthInformationValidation.getValidation('he_med_2_sc')} 
                                    label="Taken at school?" onChange={this.handleChange} options={[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}]} />
                            </div>
                            <div className="form-row">
                                <legend>Medication 3</legend>
                                <Input type="text" label="Medication Name" name="he_med_3" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_3')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_3')} 
                                    onChange={this.handleChange} />
                                <Input type="text" label="Dose" name="he_med_3_dose" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_3_dose')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_3_dose')} 
                                    onChange={this.handleChange} />
                                <Select className="col-sm-12" field={healthInformation.getOrCreateField('he_med_3_sc')} 
                                    validation={healthInformationValidation.getValidation('he_med_3_sc')} 
                                    label="Taken at school?" onChange={this.handleChange} options={[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}]} />
                            </div>
                            <div className="form-row">
                                <legend>Medication 4</legend>
                                <Input type="text" label="Medication Name" name="he_med_4" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_4')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_4')} 
                                    onChange={this.handleChange} />
                                <Input type="text" label="Dose" name="he_med_4_dose" 
                                    className="col-sm-12"
                                    value={healthInformation.getOrCreateField('he_med_4_dose')['value']}
                                    validation={healthInformationValidation.getValidation('he_med_4_dose')} 
                                    onChange={this.handleChange} />
                                <Select className="col-sm-12" field={healthInformation.getOrCreateField('he_med_4_sc')} 
                                    validation={healthInformationValidation.getValidation('he_med_4_sc')} 
                                    label="Taken at school?" onChange={this.handleChange} options={[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}]} />
                            </div>
                    </NestedRadio>
                </div>
                <div className="form-row">
                    <Input className="col-sm-12" type="textarea" label="Other Medical Problems" name="he_other" 
                        value={healthInformation.getOrCreateField('he_other')['value']}
                        onChange={this.handleChange} />
                    <Input className="col-sm-12" type="textarea" label="Comments/Concerns" name="he_concerns" 
                        value={healthInformation.getOrCreateField('he_concerns')['value']}
                        onChange={this.handleChange} />
                    <Select className="col-sm-12" field={healthInformation.getOrCreateField('he_health_agreement')} 
                        validation={healthInformationValidation.getValidation('he_health_agreement')} 
                        label="I agree that the information provided is accurate to the best of my knowledge" onChange={this.handleChange} options={[{"label": "Yes", "value": "Yes"}]} />

                </div>
                {JSON.stringify(healthInformation.asJSON)}
            </fieldset>
        )
    }
}

export default inject(stores => ({
    healthInformation: stores.rootStore.formStore.student.healthInformation,
    healthInformationValidation: stores.rootStore.formStore.student.healthInformationValidation
}))(observer(HealthInformation))