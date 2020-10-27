import { 
        observable, 
        action, 
        decorate,
        computed
    } from "mobx"
import ContactService from '../services/contactservice'
class ContactStudent {
    dcid = undefined
    studentContactId = 0
    studentNumber
    contactId = 0
    deleted = false
    markedForDeletion = false
    studentDetails = {
        "custodial": "",
        "emergency": "",
        "livesWith": "",
        "relationship": "",
        "schoolPickup": "",
        "active": true
    }
    studentContactDetailId = 0
    guardianId = 0
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
        this.guardianId = data && data.guardianId ? data.guardianId : 0
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
            updates.push(
                ContactService.addContactStudent(this.contactId, this.asJSON)
                    .then(
                        action("updateContactStudentSuccess", (response) => {
                            if (response && response.data) {
                                if (response.data.savedObject) {
                                    const { savedObject } = response.data
                                    console.log(savedObject)
                                    this.setContactServerData(savedObject)
                                    this.initData(savedObject)
                                    return false
                                } else if (response.data.error_message) {
                                    if (response.data.error_message.error) {
                                        return response.data.error_message.error
                                    }
                                }
                            } else {
                                return ["Generic Issue adding contact."]
                            }
                        })
                    )
            )
        } else {
            if (this.markedForDeletion === true) {
                updates.push(
                    ContactService.deleteContactStudent(this.contactId, this.studentContactId)
                        .then(
                            action("deleteContactStudentSuccess", (response) => {
                                if (response.data) {
                                    if (response.data.action === "DELETE" && response.data.status === "SUCCESS") {
                                        this.markedForDeletion = false
                                        this.deleted = true
                                        return false
                                    } else {
                                        if (response.data.error_message.error) {
                                            return response.data.error_message.error
                                        }
                                    }
                                }
                                return ["Issues deleting contact"]
                            })
                        )
                )
            } else if (this.sequence !== this.data.sequence) {
                updates.push(
                    ContactService.updateContactStudent(this.contactId, this.studentContactId, this.contactJSON)
                        .then(
                            action("updateContactStudentSuccess", (response) => {
                                if (response && response.data) {
                                    if (response.data.savedObject) {
                                        const { savedObject } = response.data
                                        this.setContactServerData(savedObject)
                                        return false
                                    } else if (response.data.error_message) {
                                        if (response.data.error_message.error) {
                                            return response.data.error_message.error
                                        }
                                    }
                                } else {
                                    return ["Generic Issue updating contact order."]
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
                                if (response && response.data) {
                                    if (response.data.savedObject) {
                                        const { savedObject } = response.data
                                        this.setDetailsServerData(savedObject)
                                        return false
                                    } else if (response.data.error_message) {
                                        if (response.data.error_message.error) {
                                            return response.data.error_message.error
                                        }
                                    }
                                } else {
                                    return ["Generic Issue updating contactStudent details"]
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
    studentNumber: observable,
    asJSON: computed,
    detailJSON: computed,
    contactJSON: computed,
    changesMade: computed,
    detailChangesMade: computed
})
export default ContactStudent