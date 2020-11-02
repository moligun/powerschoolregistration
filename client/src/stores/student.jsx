import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import Extension from './extension'
import Validation from './validation'
import StudentService from '../services/studentservice'
import healthRules from './validations/healthrules.json'
import contactRules from './validations/contactrules.json'
import releaseRules from './validations/releaserules.json'
import signatureRules from './validations/signaturerules.json'
import studentRules from './validations/studentrules.json'
class Student {
    submissionSuccess = false
    healthInformation = new Extension('u_health')
    studentExt = new Extension('s_in_stu_x')
    studentExt2 = new Extension('u_demo')
    studentExt3 = new Extension('u_lsc')
    release = new Extension('u_release')
    validations = new Validation()
    studentInformationValidation
    contactInformationValidation
    healthInformationValidation
    releaseInformationValidation
    signatureInformationValidation
    id = undefined
    studentNumber
    studentIndex
    name = {"first_name": "", "last_name": "", "middle_name": ""}
    phones = {
        "main": {"number": ""}
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
        "mvtransportation", "student_cell", "student_txt_phone"
    ]
    validationAreas
    studentData
    studentFields = observable.map()
    errors = []
    constructor(data, index, root) {
        this.studentInformationValidation = new Validation(studentRules, "Student Info")
        this.contactInformationValidation = new Validation(contactRules, "Contacts")
        this.healthInformationValidation = new Validation(healthRules, "Health Information")
        this.releaseInformationValidation = new Validation(releaseRules, "Agreements")
        this.signatureInformationValidation = new Validation(signatureRules, "Signature")
        this.validationAreas = [
            this.studentInformationValidation, 
            this.contactInformationValidation, 
            this.healthInformationValidation,
            this.releaseInformationValidation,
            this.signatureInformationValidation
        ]
        this.rootStore = root
        this.studentIndex = index
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
            if (this.studentData && this.studentData['addresses'] && this.studentData['addresses']['physical']) {
                this.addresses.physical = Object.assign(this.addresses.physical, this.studentData['addresses']['physical'])
            }
            if (this.studentData && this.studentData['addresses'] && this.studentData['addresses']['mailing']) {
                this.addresses.mailing = Object.assign(this.addresses.mailing, this.studentData['addresses']['mailing'])
            }
            if (this.studentData && this.studentData['phones'] && this.studentData['phones']['main']) {
                this.phones = Object.assign(this.phones, this.studentData['phones'])
            }
            this.name = Object.assign(this.name, this.studentData['name'])
            this.demographics = Object.assign(this.demographics, this.studentData['demographics'])
            if (this.studentData['school_enrollment'] && this.studentData['school_enrollment']['district_of_residence']) {
                this.schoolEnrollment["district_of_residence"] = this.studentData["school_enrollment"]["district_of_residence"]
            }
            if (this.studentData && this.studentData['_extension_data'] && this.studentData['_extension_data']['_table_extension']) {
                for (const extension of this.studentData['_extension_data']['_table_extension']) {
                    switch (extension.name) {
                        case 'u_health':
                            let healthFieldOptions = {
                                "he_food_date_last": {"value": ""}, 
                                "he_food_al_table": {"value": ""},
                                "he_health_agreement": {"value": "", "exclude": true}
                            }
                            this.healthInformation.loadExtensionData(extension, false, healthFieldOptions)
                            break
                        case 's_in_stu_x':
                            this.studentExt.loadExtensionData(extension, ["student_name_suffix"])
                            break
                        case 'u_demo':
                            this.studentExt2.loadExtensionData(extension, this.uDemoWhiteList)
                            break
                        case 'u_lsc':
                            this.studentExt3.loadExtensionData(extension, ["next_year_reg", "lsc_useragreementsigned"], {"lsc_useragreementsigned": {"value": ""}})
                            break
                        case 'u_release':
                            let defaultSignatureValues = {
                                "signature_date": {"value":""},
                                "disclaimer_1_name": {"value": ""},
                                "disclaimer_2_name": {"value": ""},
                                "disclaimer_3_name": {"value": ""},
                                "disclaimer_4_name": {"value": ""},
                                "disclaimer_5_name": {"value": ""}
                            }
                            this.release.loadExtensionData(extension, false, defaultSignatureValues)
                            break
                        default:
                            break
                    }
                }
            }
            this.refreshStudentValidation()
            this.refreshSignatureValidation()
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

    refreshContactValidation() {
        const { contactsStore } = this.rootStore
        if (contactsStore.validatedStudentContacts) {
            const values = {"count": contactsStore.validatedStudentContacts.length}
            this.contactInformationValidation.validateAll(values)
        }
    }

    refreshHealthValidation() {
        const healthValues = this.healthInformation.fieldsObj
        this.healthInformationValidation.validateAll(healthValues)
    }

    refreshReleaseValidation() {
        let releaseValues = this.release.fieldsObj
        const sharedHealth = this.healthInformation.getOrCreateField('he_shared')
        releaseValues[sharedHealth.name] = sharedHealth.value
        this.releaseInformationValidation.validateAll(releaseValues)
    }

    refreshSignatureValidation() {
        const signatureValues = this.studentExt3.fieldsObj
        signatureValues['release'] = this.release.fieldsObj
        this.signatureInformationValidation.validateAll(signatureValues)
    }

    refreshValidation(validationTrigger) {
        switch (validationTrigger) {
            case 'student':
                this.refreshStudentValidation()
                break
            case 'contacts':
                this.refreshContactValidation()
                break
            case 'health':
                this.refreshHealthValidation()
                break
            case 'release':
                this.refreshReleaseValidation()
                break
            case 'signature':
                this.refreshSignatureValidation()
                break
            default:
                return false
        }
        return true
    }

    addError(errorMessage) {
        let message = ''
        if (Array.isArray(errorMessage)) {
            for (const error of errorMessage) {
                if (typeof error === 'string') {
                    message = error
                } else {
                    message = error.field ? error.field + ': ' : ''
                    message += error.error_description ? error.error_description : ''
                    this.errors.push(message)
                }
            }
        } else if (errorMessage && errorMessage.error_description) {
            message = errorMessage.field ? errorMessage.field + ': ' : ''
            message += errorMessage.error_description ? errorMessage.error_description : ''
            this.errors.push(message)
        } else if (typeof errorMessage === 'string') {
            message = errorMessage
            this.errors.push(message)
        }
    }

    update() {
        return StudentService.updateStudent(this.asJSON)
    }

    get submissionCompleted() {
        if (this.submissionSuccess && this.submissionErrors.length === 0) {
            return true
        }
        return false
    }

    get submissionErrors() {
        let errors = []
        if (this.errors.length > 0) {
            for (const error of this.errors) {
                errors.push(error)
            }
        }
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

    get mailingAddressOnly() {
        const { mailing } = this.addresses
        return { mailing }
    }

    preprocessData() {
        const changeBooleanArray = ["mvtempliving", "mvtemplivinghardship", "mvlivingwithother"]
        for (const field of changeBooleanArray) {
            let fieldObj = this.studentExt2.getField(field)
            if (fieldObj.value === 1) {
                this.studentExt2.setFieldValue(field, 'Yes')
            } else if (fieldObj.value === 0) {
                this.studentExt2.setFieldValue(field, 'No')
            }
        }
    }

    get asJSON() {
        return {
            "id": this.id,
            "action": "UPDATE",
            "client_uid": this.studentIndex,
            "addresses": this.mailingAddressOnly,
            "phones": this.phones,
            "name": this.name,
            "demographics": this.demographics,
            "school_enrollment": this.schoolEnrollment,
            "@extensions": "u_health, s_in_stu_x",
            "_extension_data": {"_table_extension": [this.healthInformation.asJSON, this.studentExt.asJSON, this.studentExt2.asJSON, this.release.asJSON, this.studentExt3.asJSON]}
        }
    }
}

decorate(Student, {
    loadStudentData: action,
    getField: action,
    refreshStudentValidation: action,
    refreshSignatureValidation: action,
    refreshReleaseValidation: action,
    refreshHealthValidation: action,
    refreshContactValidation: action,
    refreshValidation: action,
    processSubmissionErrors: action,
    addError: action,
    preprocessData: action,
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
    submissionSuccess: observable,
    studentExt: observable,
    studentExt2: observable,
    studentExt3: observable,
    release: observable,
    validations: observable,
    mcKinneyExtras: computed,
    validationSuccess: computed,
    asJSON: computed,
    mcKinneyLivingValue: computed,
    submissionErrors: computed,
    submissionCompleted: computed,
    mailingAddressOnly: computed
})
export default Student