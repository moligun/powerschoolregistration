import { observable, action, decorate, flow, onBecomeUnobserved, onBecomeObserved } from "mobx"
import TicketService from "../services/ticketservice"
class CategoryStore {
    categories
    subcategories
    constructor(root) {
        this.rootStore = root
        this.ticketService = TicketService
        onBecomeObserved(this, 'categories', this.observeCategories)
        onBecomeUnobserved(this, 'categories', this.unObserveCategories)
    }

    observeCategories = () => {
        this.loadMainCategories()
    }

    unObserveCategories = () => {
        this.categories = undefined
        this.subcategories = undefined
    }

    loadMainCategories = flow(function * () {
        try {
            const categories = yield this.ticketService.categories()
            if (categories.data && categories.data.length > 0) {
                this.categories = categories.data
            } else {
                this.categories = undefined
                this.subcategories = undefined
            }
        } catch(error) {
            this.categories = undefined
        }
    })

    loadSubCategories = flow(function * (categoryId) {
        if (categoryId > 0) {
            try {
                const categories = yield this.ticketService.subCategories(categoryId)
                if (categories.data && categories.data.length > 0) {
                    this.subcategories = categories.data
                } else {
                    this.subcategories = undefined
                }
            } catch(error) {
                this.subcategories = undefined
            }
        } else {
            this.subcategories = undefined
        }
    })
}
decorate(CategoryStore, {
    loadMainCategories: action,
    loadSubCategories: action,
    categories: observable,
    subcategories: observable
})
export default CategoryStore