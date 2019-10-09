import EditorStore from "./editorstore"
import TicketStore from "./ticketstore"
import AuthStore from "./authstore"
class RootStore {
    constructor() {
        this.ticketStore = new TicketStore(this)
        this.editorStore = new EditorStore(this)
        this.authStore = new AuthStore(this)
    }
}

const rootStore = new RootStore()
export default rootStore