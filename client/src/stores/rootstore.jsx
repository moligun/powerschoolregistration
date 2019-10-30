import EditorStore from "./editorstore"
import TicketStore from "./ticketstore"
import AuthStore from "./authstore"
import StudentStore from "./studentstore"
import CategoryStore from "./categorystore"
import UserStore from "./userstore"
class RootStore {
    constructor() {
        this.ticketStore = new TicketStore(this)
        this.editorStore = new EditorStore(this)
        this.authStore = new AuthStore(this)
        this.studentStore = new StudentStore(this)
        this.categoryStore = new CategoryStore(this)
        this.userStore = new UserStore(this)
    }
}

const rootStore = new RootStore()
export default rootStore