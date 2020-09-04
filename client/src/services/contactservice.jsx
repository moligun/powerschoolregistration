const axios = require('axios')
class ContactService {
    deleteContactAssociation(id, studentContactId) {
        const config = {
            method: "DELETE",
            url: `/contacts/contact/${id}/student/${studentContactId}`
        }
        return axios(config)
    }
}
const contactService = new ContactService()
export default contactService