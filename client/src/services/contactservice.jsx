const axios = require('axios')
class ContactService {
    createContact(data) {
        const config = {
            method: "POST",
            url: `/contacts/`,
            data
        }
        return axios(config)
    }

    getContact(contactId) {
        const config = {
            method: "GET",
            url: `/contacts/contact/${contactId}`
        }
        return axios(config)
    }

    deleteContactAssociation(id, studentContactId) {
        const config = {
            method: "DELETE",
            url: `/contacts/${id}/student/${studentContactId}`
        }
        return axios(config)
    }
    updateContactDemographics(id, data) {
        const config = {
            method: "PUT",
            url: `/contacts/${id}/demographics`,
            data
        }
        return axios(config)
    }

    addContactPhone(id, data) {
        const config = {
            method: "POST",
            url: `/contacts/${id}/phones`,
            data
        }
        return axios(config)
    }

    addContactEmail(id, data) {
        const config = {
            method: "POST",
            url: `/contacts/${id}/emails`,
            data
        }
        return axios(config)
    }

    updateContactEmail(id, contactEmailId, data) {
        const config = {
            method: "PUT",
            url: `/contacts/${id}/emails/${contactEmailId}`,
            data
        }
        return axios(config)
    }

    updateContactPhone(id, contactPhoneId, data) {
        const config = {
            method: "PUT",
            url: `/contacts/${id}/phones/${contactPhoneId}`,
            data
        }
        return axios(config)
    }

    deleteContactPhone(id, contactPhoneId) {
        const config = {
            method: "DELETE",
            url: `/contacts/${id}/phones/${contactPhoneId}`
        }
        return axios(config)
    }

    addContactStudent(id, data) {
        const config = {
            method: "POST",
            url: `/contacts/${id}/students`,
            data
        }
        return axios(config)
    }

    updateContactStudent(id, contactStudentId, data) {
        const config = {
            method: "PUT",
            url: `/contacts/${id}/students/${contactStudentId}`,
            data
        }
        return axios(config)
    }

    updateContactStudentDetails(id, contactStudentId, studentContactDetailId, data) {
        const config = {
            method: "PUT",
            url: `/contacts/${id}/students/${contactStudentId}/studentdetails/${studentContactDetailId}`,
            data
        }
        return axios(config)
    }

    deleteContactStudent(id, contactStudentId) {
        const config = {
            method: "DELETE",
            url: `/contacts/${id}/students/${contactStudentId}`
        }
        return axios(config)
    }
}
const contactService = new ContactService()
export default contactService