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

    loadDistricts() {
        const config = {
            method: "GET",
            url: "/students/districts"
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

    updateStudent(data) {
        const config = {
            method: "POST",
            data,
            url: `/students`
        }
        return axios(config)
    }
}
const studentService = new StudentService()
export default studentService