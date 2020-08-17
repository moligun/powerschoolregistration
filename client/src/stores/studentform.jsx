import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import Extension from './extension'
import Validation from './validation'
class StudentForm {
    healthInformation
    validations = new Validation()
    studentInformationValidation
    studentInformationValidationRules = [
        {"name": "phones.main.number", "rules": ["phone", "required"]},
        {"name": "phones.cell.number", "rules": ["phone"]},
        {"name": "addresses.physical.street", "rules": ["address"]}
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

    id = undefined
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
    studentData
    studentFields = observable.map()
    constructor(data) {
        this.studentInformationValidation = new Validation(this.studentInformationValidationRules)
        this.contactInformationValidation = new Validation(this.contactInformationValidationRules)
        this.healthInformationValidation = new Validation(this.healthInformationValidationRules)
        this.loadStudentData(data)
    }

    get validationSuccess() {
        let validationAreas = [
            this.studentInformationValidation, 
            this.contactInformationValidation, 
            this.healthInformationValidation
        ]
        return validationAreas.every((area) => area.allValidated)
    }

    loadStudentData(data) {
            this.studentData = data
            this.id = data.id
            this.addresses = Object.assign(this.addresses, this.studentData['addresses'])
            this.phones = Object.assign(this.phones, this.studentData['phones'])
            this.name = Object.assign(this.name, this.studentData['name'])
            this.demographics = Object.assign(this.demographics, this.studentData['demographics'])
            this.studentInformationValidation.validateAll({"phones": this.phones, "addresses": this.addresses})
            let whiteList = []
            for (const extension of this.studentData['_extension_data']['_table_extension']) {
                switch (extension.name) {
                    case 'u_health':
                        this.healthInformation = new Extension(extension, false)
                        this.healthInformationValidation.validateAll(this.healthInformation.fieldsObj)
                        break
                    case 's_in_stu_x':
                        whiteList = ['student_name_suffix']
                        this.studentExt = new Extension(extension, whiteList)
                        break
                    default:
                        break
                }
            }
    }

    get asJSON() {
        return {
            "id": this.id,
            "action": "UPDATE",
            "client_uid": 1,
            "addresses": this.addresses,
            "phones": this.phones,
            "name": this.name,
            "demographics": this.demographics,
            "@extensions": "u_health, s_in_stu_x",
            "_extension_data": {"_table_extension": [this.healthInformation.asJSON, this.studentExt.asJSON]}
        }
    }
}

decorate(StudentForm, {
    loadStudentData: action,
    getField: action,
    studentData: observable,
    name: observable,
    phones: observable,
    addresses: observable,
    demographics: observable,
    healthInformation: observable,
    validations: observable,
    validationSuccess: computed,
    asJSON: computed
})
export default StudentForm