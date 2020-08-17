const axios = require('axios')
class StudentService {
    userInfo() {
        const config = {
            method: "GET",
            url: "/users/me",
            withCredentials: true
        }
        return axios(config)
    }

    loadStudents() {
        const config = {
            method: "GET",
            url: "/students"
        }
        return axios(config)
    }

    loadContacts() {
        const config = {
            method: "GET",
            url: "/contacts"
        }
        return axios(config)
    }

    updateUser(data) {
        const config = {
            method: "PUT",
            data,
            url: `/users/user/${data.id}`
        }
        return axios(config)
    }
}
const studentService = new StudentService()
export default studentService