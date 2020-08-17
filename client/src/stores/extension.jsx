import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"

class Extension {
    name
    fields = observable.map()
    constructor(data, whiteList) {
        this.loadExtensionData(data, whiteList)
    }
  
    loadExtensionData(data, whiteList) {
        this.name = data.name
        data['_field'].forEach(field => {
            if (field.type && field.type === "Boolean") {
                field.value = field.value ? 1 : 0
            }

            if (whiteList === false || whiteList.includes(field.name)) {
                this.fields.set(field.name, field)
            }
        }) 
    }

    setFieldValue(name, value) {
        let fieldObj = this.fields.get(name)
        fieldObj.value = value
        this.fields.set(name, fieldObj)
    }

    getField(name) {
        if (!this.fields.get(name)) {
            this.fields.set(name, {"name": name, "type": "string", "value": ""})
        }
        return this.fields.get(name)
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
            "_field": [...this.fields.values()]
        }
    }
}

decorate(Extension, {
    loadExtensionData: action,
    setFieldValue: action,
    getField: action,
    name: observable,
    fields: observable,
    fieldsObj: computed,
    asJSON: computed
})
export default Extension