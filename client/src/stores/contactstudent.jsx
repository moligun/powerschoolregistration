import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import ContactService from '../services/contactservice'
import Contact from "./contact"
class ContactStudent {
    dcid = undefined
    studentContactId = 0
    contactId = 0
    errorCount = 0
    deleted = false
    markedForDeletion = false
    studentDetails = {
        "custodial": false,
        "emergency": false,
        "livesWith": false,
        "receivesMail": false,
        "relationship": "Not Set",
        "schoolPickup": false,
        "active": true
    }
    studentContactDetailId = 0
    sequence
    data
    detailData
    constructor(data, contactId) {
        this.setFullServerData(data)
        this.contactId = contactId
        this.initData(this.data)
    }

    setFullServerData(data) {
        this.data = data
        if (data && data.studentDetails && data.studentDetails[0]) {
            this.detailData = data.studentDetails[0]
        }
    }

    setContactServerData(data) {
        if (data) {
            this.data = data
        }
    }

    setDetailsServerData(data) {
        if (data) {
            this.detailData = data
        }
    }

    initData(data) {
        this.dcid = data && data.dcid ? data.dcid : 0
        this.sequence = data && data.sequence ? data.sequence : 0
        this.studentNumber = data && data.studentNumber ? data.studentNumber : 0
        this.studentContactId = data && data.studentContactId ? data.studentContactId : 0
        if (this.detailData) {
            this.studentContactDetailId = this.detailData.studentContactDetailId
            for (const field in this.studentDetails) {
                let dataField = this.detailData[field]
                if (typeof dataField === 'boolean') {
                    this.studentDetails[field] = dataField ? true : false
                } else {
                    this.studentDetails[field] = dataField ? dataField : ''
                }
            }
        }
    }

    update() {
        let updates = []
        if (this.studentContactId === 0) {
            console.log(this.contactId)
            updates.push(
                ContactService.addContactStudent(this.contactId, this.asJSON)
            )
        } else {
            if (this.markedForDeletion === true) {
                updates.push(
                    ContactService.deleteContactStudent(this.contactId, this.studentContactId)
                        .then(
                            action("deleteContactStudentSuccess", (response) => {
                                this.markedForDeletion = false
                                this.deleted = true
                            })
                        )
                )
            } else if (this.sequence !== this.data.sequence) {
                updates.push(
                    ContactService.updateContactStudent(this.contactId, this.studentContactId, this.contactJSON)
                        .then(
                            action("updateContactStudentSuccess", (response) => {
                                if (response && response.data && response.data.savedObject) {
                                    const { savedObject } = response.data
                                    this.setContactServerData(savedObject)
                                    this.errorCount = 0
                                } else {
                                    this.errorCount++
                                    console.log('error occurred')
                                }
                            })
                        )
                )
            }

            if (this.detailChangesMade) {
                updates.push(
                    ContactService.updateContactStudentDetails(
                        this.contactId, 
                        this.studentContactId, 
                        this.studentContactDetailId,
                        this.detailJSON
                        )
                        .then(
                            action("updateContactStudentDetailsSuccess", (response) => {
                                if (response && response.data && response.data.savedObject) {
                                    const { savedObject } = response.data
                                    this.setDetailsServerData(savedObject)
                                    this.errorCount = 0
                                } else {
                                    this.errorCount++
                                    console.log('error occurred')
                                }
                            })
                        )
                )
            }

        }
        return updates
    }

    get asJSON() {
        const { studentDetails, dcid, sequence, studentNumber } = this
        return {
            studentDetails: [studentDetails],
            dcid,
            sequence,
            studentNumber
        }
    }

    get contactJSON() {
        const { dcid, sequence } = this
        return {
            "dcid": dcid,
            "sequence": sequence,
            "studentDetails": []
        }
    }

    get detailJSON() {
        return this.studentDetails
    }

    get detailChangesMade() {
        const studentDetails = [
            "custodial",
            "emergency",
            "livesWith",
            "receivesMail",
            "relationship",
            "schoolPickup"
        ]
        const detailsMatch = (detail) => this.studentDetails[detail] !== this.detailData[detail]
        return studentDetails.some(detailsMatch)
    }

    get changesMade() {
        return !this.studentContactId ||
            this.markedForDeletion === true ||
            this.detailChangesMade ||
            this.sequence !== this.data.sequence

    }

    get erroredOut() {
        if (this.errorCount >= 2) {
            return true
        }
        return false
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
    setFullServerData: action,
    setContactServerData: action,
    setDetailsServerData: action,
    update: action,
    dcid: observable,
    studentContactId: observable,
    studentDetails: observable,
    sequence: observable,
    deleted: observable,
    contactId: observable,
    studentContactDetailId: observable,
    markedForDeletion: observable,
    detailData: observable,
    data: observable,
    errorCount: observable,
    erroredOut: computed,
    asJSON: computed,
    detailJSON: computed,
    contactJSON: computed,
    changesMade: computed,
    detailChangesMade: computed
})
export default ContactStudent