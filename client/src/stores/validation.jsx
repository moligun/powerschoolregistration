import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"

class Validation {
    fields = observable.map()
    constructor(validations) {
        if (validations) {
            for (const validation of validations) {
                if (validation.name) {
                    this.setValidation(validation)
                }
            }
        }
    }

    get allValidated() {
        const validationFields = [...this.fields.values()]
        return validationFields.every((field) => field.validated === true)
    }

    validateAll(values) {
        for (const key of this.fields.keys()) {
            let value = key.indexOf('.') > 0 ? this.getDotNotationValue(key, values) : values[key]
            this.validate(key, value, values)
        }
    }

    getDotNotationValue(name, values) {
        let dotNotationParts = name.split('.')
        let lastObjPart =  dotNotationParts.pop()
        let part = dotNotationParts.shift()
        let obj = values
        while (part) {
            obj = obj[part]
            part = dotNotationParts.shift()
        }
        return obj[lastObjPart]
    }

    setValidation(validation) {
        const validationObj = {
            "requirements": validation.rules,
            "validated": false,
            "messages": [],
            "name": validation.name,
            "comparisonValue": validation.comparisonValue ? validation.comparisonValue : '',
            "label": validation.label ? validation.label : '',
            "validateIf": validation.validateIf ? validation.validateIf : false
        }
        this.fields.set(validation.name, validationObj)
    }

    getValidation(name, validationCriteria, value) {
        if (!this.fields.get(name)) {
            console.log(name)
            //this.setValidation(name, validationCriteria)
            return false
        }
        return this.fields.get(name)
    }

    validate(name, value, parentFields) {
        const validateObj = this.fields.get(name)
        if (!validateObj) {
            return true
        }

        if (validateObj.validateIf) {
            if (validateObj.validateIf && validateObj.validateIf.length > 0) {
                for (const validate of validateObj.validateIf) {
                    let {field, value } = validate
                    if (field && parentFields[field] && parentFields[field] === value) {
                        validateObj.validated = false
                    } else {
                        validateObj.validated = true
                        return true
                    }
                }
            }
        }

        validateObj.messages = []
        for (const requirement of validateObj.requirements) {
            this[requirement](validateObj, value)
        }
        if (validateObj.messages.length > 0) {
            validateObj.validated = false
        } else {
            validateObj.validated = true
        }
    }

    required(obj, value) {
        if (value === '') {
            obj.messages.push('Required')
        }
    }

    alpha(obj, value) {
        const regex = /[^A-Za-z]/g
        if (value !== undefined) {
            if (value.search(regex) > -1) {
                obj.messages.push('Only Letters')
            }
        } 
    }

    phone(obj, value) {
        const regex = /[^0-9-\s]/g
        if (value !== undefined) {
            if (value.search(regex) > -1) {
                obj.messages.push('Only Numbers and dashes (-)')
            }
        }
    }

    address(obj, value) {
        const regex = /[*,.()":;'@&]/g
        if (value !== undefined) {
            if (value.search(regex) > -1) {
                obj.messages.push('None of the following characters: *,.()":;\'@&.')
            }
        }
    }

    atLeast(obj, value) {
        console.log(`triggered ${value} og ${obj.comparisonValue}`)
        if (obj.comparisonValue) {
            if (value < obj.comparisonValue) {
                obj.messages.push(`Must include at least ${obj.comparisonValue} ${obj.label}`)
            }
        }
    }
}

decorate(Validation, {
    validate: action,
    getValidation: action,
    setValidation: action,
    validateAll: action,
    allValidated: computed,
    fields: observable
})
export default Validation