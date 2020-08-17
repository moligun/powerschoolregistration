import AuthStore from "./authstore"
import StudentStore from "./studentstore"
import FormStore from "./formstore"
import ContactsStore from "./contactsstore"
import ContactEditorStore from "./contacteditor"
class RootStore {
    constructor() {
        this.authStore = new AuthStore(this)
        this.studentStore = new StudentStore(this)
        this.formStore = new FormStore(this)
        this.contactsStore = new ContactsStore(this)
        this.contactEditorStore = new ContactEditorStore(this)
    }
}

const rootStore = new RootStore()
export default rootStore