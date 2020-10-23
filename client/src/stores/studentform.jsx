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
    studentExt3
    release
    validations = new Validation()
    studentInformationValidation
    studentInformationValidationRules = [
        {"name": "phones.main.number", "rules": ["phone", "required"]},
        {"name": "phones.cell.number", "rules": ["phone"]},
        {"name": "addresses.mailing.street", "rules": ["address", "required"]},
        {"name": "addresses.mailing.city", "rules": ["address", "required"]},
        {"name": "addresses.mailing.state_province", "rules": ["address", "required"]},
        {"name": "addresses.mailing.postal_code", "rules": ["required", "address"]},
        {"name": "studentExt2.mvtempliving", "rules": ["required"]},
        {"name": "studentExt2.mvtemplivinghardship", "rules": ["required"]},
        {"name": "studentExt2.mvlivingwithother", "rules": ["required"]},
        {"name": "studentExt2.mvmotelhotelname", "rules": ["required"], 
            "validateIf":[
                {"field": "mcKinneyExtras", "value": true}, 
                {"field": "mcKinneyLivingValue", "value": "mvmotelhotel"}
            ]
        },
        {"name": "studentExt2.mvtransportation", "rules": ["required"], 
            "validateIf":[
                {"field": "mcKinneyExtras", "value": true}
            ]
        },
        {"name": "mcKinneyLivingValue", "rules": ["required"], "validateIf":[{"field": "mcKinneyExtras", "value": true}]}
    ]

    contactInformationValidation
    contactInformationValidationRules = [
        {"name": "count", "rules":["atLeast"], "comparisonValue": 3, "label": "Contacts with Required Fields Completed."}
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

    signatureInformationValidation
    signatureInformationRules = [
        {"name": "lsc_useragreementsigned", "rules": ["required"]}
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
        "mvotherexplain", "mvadditionalkids",
        "mvtransportation"
    ]
    validationAreas
    studentData
    studentFields = observable.map()
    errors = []
    constructor(data, root) {
        this.studentInformationValidation = new Validation(this.studentInformationValidationRules, "Student Info")
        this.contactInformationValidation = new Validation(this.contactInformationValidationRules, "Contacts")
        this.healthInformationValidation = new Validation(this.healthInformationValidationRules, "Health Information")
        this.releaseInformationValidation = new Validation(this.releaseInformationValidationRules, "Agreements")
        this.signatureInformationValidation = new Validation(this.signatureInformationRules, "Signature")
        this.validationAreas = [
            this.studentInformationValidation, 
            this.contactInformationValidation, 
            this.healthInformationValidation,
            this.releaseInformationValidation,
            this.signatureInformationValidation
        ]
        this.rootStore = root
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
                        break
                    case 's_in_stu_x':
                        this.studentExt = new Extension(extension, ["student_name_suffix"])
                        break
                    case 'u_demo':
                        this.studentExt2 = new Extension(extension, this.uDemoWhiteList)
                        break
                    case 'u_lsc':
                        this.studentExt3 = new Extension(extension, ["next_year_reg", "lsc_useragreementsigned"], {"lsc_useragreementsigned": ""})
                        this.signatureInformationValidation.validateAll(this.studentExt3.fieldsObj)
                        break
                    case 'u_release':
                        this.release = new Extension(extension, false)
                        break
                    default:
                        break
                }
            }
            this.refreshStudentValidation()
    }

    refreshStudentValidation() {
        this.studentInformationValidation.validateAll({
            "phones": this.phones, 
            "addresses": this.addresses, 
            "studentExt2": this.studentExt2.fieldsObj,
            "mcKinneyLivingValue": this.mcKinneyLivingValue.value,
            "mcKinneyExtras": this.mcKinneyExtras
        })
    }

    update() {
        return StudentService.updateStudent(this.asJSON)
    }

    processSubmissionErrors() {
        this.errors = []
        if (this.rootStore.contactsStore.contacts.length > 0) {
            for (const contact of this.rootStore.contactsStore.contacts) {
                if (contact.contactAssociatedWithStudent([this.studentNumber]) && contact.errors.length > 0) {
                    for (const error of contact.errors) {
                        this.errors.push(error)
                    }
                }
            }
        }
    }
    get submissionErrors() {
        let errors = []
        if (this.rootStore.contactsStore.contacts.length > 0) {
            for (const contact of this.rootStore.contactsStore.contacts) {
                if (contact.contactAssociatedWithStudent([this.studentNumber]) && contact.errors.length > 0) {
                    for (const error of contact.errors) {
                        let message = ''
                        message += contact.fullName
                        message += error && error.field ? ` (${error.field}): ` : ': '
                        message += error && error.error_description ? error.error_description : error
                        errors.push(message)
                    }
                }
            }
        }
        return errors
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
            "_extension_data": {"_table_extension": [this.healthInformation.asJSON, this.studentExt.asJSON, this.studentExt2.asJSON, this.release.asJSON, this.studentExt3.asJSON]}
        }
    }
}

decorate(StudentForm, {
    loadStudentData: action,
    getField: action,
    refreshStudentValidation: action,
    processSubmissionErrors: action,
    errors: observable,
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
    studentExt3: observable,
    release: observable,
    validations: observable,
    mcKinneyExtras: computed,
    validationSuccess: computed,
    asJSON: computed,
    mcKinneyLivingValue: computed,
    submissionErrors: computed
})
export default StudentForm