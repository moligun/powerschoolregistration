class Formatter {
    static phoneFormat(value) {
        const phoneValue = value.replace(/[^\d]/g, '')
        if (phoneValue.length < 4) {
            return phoneValue
        }
        if (phoneValue.length < 7) {
            return `${phoneValue.slice(0, 3)}-${phoneValue.slice(3)}`
        }
        return `${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 6)}-${phoneValue.slice(6, 10)}`
    }
}
export default Formatter