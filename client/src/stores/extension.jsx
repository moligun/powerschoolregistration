import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
class Extension {
    name
    fields = observable.map()
    fieldOptions
    constructor(name) {
        this.name = name
    }
  
    loadExtensionData(data, whiteList, fieldOptions) {
        this.fieldOptions = fieldOptions
        if (data['_field'] && Array.isArray(data['_field'])) {
            data['_field'].forEach(field => {
                field.value = this.convertValueByType(field)
                if (fieldOptions && field.name in fieldOptions) {
                    if (fieldOptions[field.name]['value'] !== undefined) {
                        field.value = fieldOptions[field.name]['value']
                    }
                }

                if (whiteList === false || whiteList.includes(field.name)) {
                    this.fields.set(field.name, field)
                }
            }) 
        } else if (data['_field'] && data['_field'].value) {
            let field = data['_field']
            field.value = this.convertValueByType(field)
            if (fieldOptions && field.name in fieldOptions) {
                if (fieldOptions[field.name]['value'] !== undefined) {
                    field.value = fieldOptions[field.name]['value']
                }
            }

            if (whiteList === false || whiteList.includes(field.name)) {
                this.fields.set(field.name, field)
            }
        }
    }

    setFieldValue(name, value) {
        let fieldObj = this.fields.get(name)
        fieldObj.value = value
        fieldObj.value = this.convertValueByType(fieldObj)
        this.fields.set(name, fieldObj)
    }

    getOrCreateField(name, type = "text") {
        if (!this.fields.get(name)) {
            this.fields.set(name, {"name": name, type, "value": ""})
        }
        return this.fields.get(name)
    }

    convertValueByType(field) {
        let value = field.value

        const falseValues = ['0', 'false']
        if (field.type && field.type === "Boolean") {
            value = value && falseValues.includes(value) === false ? 1 : 0
        }
        return value
    }

    getField(name) {
        if (!this.fields.get(name)) {
            return {"name": name, "type": "text", "value": ""}
        }
        return this.fields.get(name)
    }

    get serverFields() {
        let filteredFields = []
        if (!this.fieldOptions) {
            return [...this.fields.values()]
        } else {
            for (const field of this.fields.values()) {
                if (this.fieldOptions[field.name] === undefined || this.fieldOptions[field.name]['exclude'] !== true) {
                    filteredFields.push(field)
                }
            }
        }
        return filteredFields
    }

    get fieldsObj() {
        let fieldObj = {}
        for (const field of this.fields.values()) {
            fieldObj[field.name] = field.value
        }
        return fieldObj
    }

    get asJSON() {
        return {
            "name": this.name,
            "_field": this.serverFields
        }
    }
}

decorate(Extension, {
    loadExtensionData: action,
    setFieldValue: action,
    getOrCreateField: action,
    name: observable,
    fields: observable,
    fieldsObj: computed,
    asJSON: computed,
    serverFields: computed
})
export default Extension