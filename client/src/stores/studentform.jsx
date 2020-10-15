import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import Extension from './extension'
import Validation from './validation'
import StudentService from '../services/studentservice'
class StudentForm {
    healthInformation
    studentExt
    studentExt2
    release
    validations = new Validation()
    studentInformationValidation
    studentInformationValidationRules = [
        {"name": "phones.main.number", "rules": ["phone", "required"]},
        {"name": "phones.cell.number", "rules": ["phone"]},
        {"name": "addresses.physical.street", "rules": ["address"]},
        {"name": "studentExt2.mvtempliving", "rules": ["required"]}
    ]

    contactInformationValidation
    contactInformationValidationRules = [
        {"name": "count", "rules":["atLeast"], "comparisonValue": 3, "label": "Contacts with a Valid Phone Number"}
    ]

    healthInformationValidation
    healthInformationValidationRules = [
        {"name": "he_alg_epi", "rules": ["required"], "validateIf":[{"field": "he_alg", "value": 1}]},
        {"name": "he_sesonal_allergy", "rules": ["required"], "validateIf":[{"field": "he_alg", "value": 1}]},
        {"name": "he_insect_allergy", "rules": ["required"], "validateIf":[{"field": "he_alg", "value": 1}]},
        {"name": "he_food_allergy", "rules": ["required"], "validateIf":[{"field": "he_alg", "value": 1}]},
        {"name": "he_food_al_table", "rules": ["required"], "validateIf":[{"field": "he_alg", "value": 1}, {"field": "he_food_allergy", "value": 1}]},
        {"name": "he_food_allergens", "rules": ["required"], "validateIf":[{"field": "he_alg", "value": 1}, {"field": "he_food_allergy", "value": 1}]},
        {"name": "he_food_sympt", "rules": ["required"], "validateIf":[{"field": "he_alg", "value": 1}, {"field": "he_food_allergy", "value": 1}]},
        {"name": "he_alg", "rules": ["required"]}, {"name": "he_asthma", "rules": ["required"]}, {"name": "he_seizure", "rules": ["required"]}, 
        {"name": "he_diabetes", "rules": ["required"]}, {"name": "he_mental", "rules": ["required"]}, {"name": "he_autism", "rules": ["required"]}, 
        {"name": "he_add", "rules": ["required"]}, {"name": "he_vision", "rules": ["required"]}, {"name": "he_blood", "rules": ["required"]}, 
        {"name": "he_bone", "rules": ["required"]}, {"name": "he_bowel", "rules": ["required"]}, {"name": "he_hear", "rules": ["required"]},
        {"name": "he_genetic", "rules": ["required"]}, {"name": "he_serious", "rules": ["required"]}, {"name": "he_hospital", "rules": ["required"]}, 
        {"name": "he_surgery", "rules": ["required"]}, {"name": "he_tb_contact", "rules": ["required"]}, {"name": "he_eating", "rules": ["required"]}, 
        {"name": "he_born", "rules": ["required"]}
    ]
    releaseInformationValidation
    releaseInformationValidationRules = [
        {"name": "military_release", "rules": ["required"]},
        {"name": "chrip_release", "rules": ["required"]},
        {"name": "he_shared", "rules": ["required"]},
        {"name": "field_trip_release", "rules": ["required"]},
        {"name": "information_release", "rules": ["required"]},
        {"name": "fees_agreement", "rules": ["required"]},
        {"name": "internet_agreement", "rules": ["required"]}
    ]

    id = undefined
    studentNumber
    name = {"first_name": "", "last_name": "", "middle_name": ""}
    phones = {
        "main": {"number": ""},
        "cell": {"number": ""}
    }
    addresses = {
        "physical": {
            "street": "", "city": "", "state_province": "", "postal_code": ""
        },
        "mailing": {
            "street": "", "city": "", "state_province": "", "postal_code": ""
        }
    }
    demographics = {"birth_date": "", "gender": ""}
    schoolEnrollment = {"district_of_residence": 7855}
    mvLivingSituations = [
        {"label": "Motel or Hotel", "value": "mvmotelhotel"},
        {"label": "Shelter or Other Temporary Housing", "value": "mvsheltertemphousing"},
        {"label": "With Friends or Family Members (Shared Housing)", "value": "mvsharedhousing"},
        {"label": "Transitional Housing (through a community agency)", "value": "mvtransitionalhousing"},
        {"label": "In a Location Not Designed for Sleeping Accommodations such as Car, Park, or Campsite", "value": "mvcarparkcampsite"},
        {"label": "Moving from Place to Place", "value": "mvplacetoplace"}
    ]
    uDemoWhiteList = [
        "mvtempliving", "mvtemplivinghardship", 
        "mvlivingwithother", "mvmotelhotel",
        "mvsheltertemphousing", "mvsharedhousing",
        "mvtransitionalhousing", "mvcarparkcampsite",
        "mvplacetoplace", "mvmotelhotelname",
        "mvotherexplain", "mvadditionalkids"
    ]
    validationAreas
    studentData
    studentFields = observable.map()
    constructor(data) {
        this.studentInformationValidation = new Validation(this.studentInformationValidationRules, "Student Info")
        this.contactInformationValidation = new Validation(this.contactInformationValidationRules, "Contacts")
        this.healthInformationValidation = new Validation(this.healthInformationValidationRules, "Health Information")
        this.releaseInformationValidation = new Validation(this.releaseInformationValidationRules, "Agreements")
        this.validationAreas = [
            this.studentInformationValidation, 
            this.contactInformationValidation, 
            this.healthInformationValidation,
            this.releaseInformationValidation
        ]
        this.loadStudentData(data)
    }

    get validationSuccess() {
        return this.validationAreas.every((area) => area.allValidated)
    }

    get mcKinneyExtras() {
        let mcKinneyValues = [
            this.studentExt2.getField('mvtemplivinghardship').value,
            this.studentExt2.getField('mvtempliving').value,
            this.studentExt2.getField('mvlivingwithother').value,
        ]
        return mcKinneyValues.some((value) => value === 1 || value === 'Yes')
    }

    get mcKinneyLivingValue() {
        for (const obj of this.mvLivingSituations) {
            let field = this.studentExt2.getField(obj.value)
            if (field.value === 'Yes') {
                return {
                    "name": "mcKinneyLiving",
                    "value": obj.value
                }
            }
        }
        return {
            "name": "mcKinneyLiving",
            "value": ""
        }
    }

    loadStudentData(data) {
            this.studentData = data
            this.id = data.id
            this.studentNumber = data.local_id
            this.addresses = Object.assign(this.addresses, this.studentData['addresses'])
            this.phones = Object.assign(this.phones, this.studentData['phones'])
            this.name = Object.assign(this.name, this.studentData['name'])
            this.demographics = Object.assign(this.demographics, this.studentData['demographics'])
            if (this.studentData['school_enrollment'] && this.studentData['school_enrollment']['district_of_residence']) {
                this.schoolEnrollment["district_of_residence"] = this.studentData["school_enrollment"]["district_of_residence"]
            }
            for (const extension of this.studentData['_extension_data']['_table_extension']) {
                switch (extension.name) {
                    case 'u_health':
                        this.healthInformation = new Extension(extension, false)
                        this.healthInformationValidation.validateAll(this.healthInformation.fieldsObj)
                        break
                    case 's_in_stu_x':
                        this.studentExt = new Extension(extension, ["student_name_suffix"])
                        break
                    case 'u_demo':
                        this.studentExt2 = new Extension(extension, this.uDemoWhiteList)
                        break
                    case 'u_release':
                        this.release = new Extension(extension, false)
                        break
                    default:
                        break
                }
            }
            this.studentInformationValidation.validateAll({"phones": this.phones, "addresses": this.addresses, "studentExt2": this.studentExt2.fieldsObj})
    }

    update() {
        return StudentService.updateStudent(this.asJSON)
    }

    get asJSON() {
        const changeBooleanArray = ["mvtempliving", "mvtemplivinghardship", "mvlivingwithother"]
        for (const field of changeBooleanArray) {
            let fieldObj = this.studentExt2.getField(field)
            if (fieldObj.value === 1) {
                this.studentExt2.setFieldValue(field, 'Yes')
            } else if (fieldObj.value === 0) {
                this.studentExt2.setFieldValue(field, 'No')
            }
        }
        return {
            "id": this.id,
            "action": "UPDATE",
            "client_uid": 1,
            "addresses": this.addresses,
            "phones": this.phones,
            "name": this.name,
            "demographics": this.demographics,
            "school_enrollment": this.schoolEnrollment,
            "@extensions": "u_health, s_in_stu_x",
            "_extension_data": {"_table_extension": [this.healthInformation.asJSON, this.studentExt.asJSON, this.studentExt2.asJSON, this.release.asJSON]}
        }
    }
}

decorate(StudentForm, {
    loadStudentData: action,
    getField: action,
    id: observable,
    studentNumber: observable,
    studentData: observable,
    name: observable,
    phones: observable,
    addresses: observable,
    demographics: observable,
    healthInformation: observable,
    schoolEnrollment: observable,
    studentExt: observable,
    studentExt2: observable,
    release: observable,
    validations: observable,
    mcKinneyExtras: computed,
    validationSuccess: computed,
    asJSON: computed,
    mcKinneyLivingValue: computed
})
export default StudentForm