import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
class ContactStudent {
    dcid = undefined
    studentContactId = 0
    studentDetails = {
        "custodial": "",
        "emergency": "",
        "livesWith": "",
        "receivesMail": "",
        "relationship": "",
        "schoolPickup": ""
    }
    sequence
    data
    constructor(data) {
        this.data = data
        this.initData()
    }

    initData() {
        this.dcid = this.data && this.data.dcid ? this.data.dcid : 0
        this.sequence = this.data && this.data.sequence ? this.data.sequence : 0
        this.studentContactId = this.data && this.data.studentContactId ? this.data.studentContactId : 0
        if (this.data && this.data.studentDetails) {
            for (const field in this.studentDetails) {
                let dataField = this.data["studentDetails"][0][field]
                if (typeof dataField === 'boolean') {
                    this.studentDetails[field] = dataField ? true : false
                } else {
                    this.studentDetails[field] = dataField ? dataField : ''
                }
            }
        }
    }

    get asJSON() {
        const { studentDetails, dcid, sequence } = this
        return {
            studentDetails: [studentDetails],
            dcid,
            sequence
        }
    }

    setStudentDetails(data) {
        if (data.studentDetails) {
            this.studentDetails = data.studentDetails
        }
    }

    setValue(name, value) {
        this["studentDetails"][name] = value
    }
}

decorate(ContactStudent, {
    initData: action,
    setValue: action,
    setStudentDetails: action,
    dcid: observable,
    studentDetails: observable,
    sequence: observable,
    asJSON: computed
})
export default ContactStudent