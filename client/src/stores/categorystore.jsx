import { observable, action, decorate, flow, onBecomeUnobserved, onBecomeObserved } from "mobx"
import TicketService from "../services/ticketservice"
class CategoryStore {
    allCategories = observable.map()
    parentCategories = observable.map()
    subCategories = observable.map()
    newTitle = ''
    constructor(root) {
        this.rootStore = root
        this.ticketService = TicketService
        onBecomeObserved(this, 'parentCategories', this.observeCategories)
        onBecomeUnobserved(this, 'parentCategories', this.unObserveCategories)
        onBecomeObserved(this, 'allCategories', this.observeCategories)
        onBecomeUnobserved(this, 'allCategories', this.unObserveCategories)
    }

    observeCategories = () => {
        this.loadMainCategories()
    }

    unObserveCategories = () => {
        this.allCategories = observable.map()
        this.subCategories = observable.map()
        this.parentCategories = observable.map()
    }

    updateParentCategory = flow(function * (id, parent_id) {
        try {
            const updatedCategory = yield this.ticketService.updateCategory(id, { parent_id })
            if (updatedCategory.data && updatedCategory.data.id) {
                let categoryId = updatedCategory.data.id
                let parentId = updatedCategory.data.parent_id
                this.allCategories.set(categoryId, updatedCategory.data)
                if (parentId === 0) {
                    this.parentCategories.set(categoryId, updatedCategory.data)
                }
            }
        } catch(error) {
            console.log(error)
        }
    })

    createCategory = flow(function * () {
        try {
            const data = {title: this.newTitle}
            const createdCategory = yield this.ticketService.createCategory(data)
            if (createdCategory.data && createdCategory.data.id) {
                this.allCategories.set(createdCategory.data.id, createdCategory.data)
                if (createdCategory.data.parent_id === 0) {
                    this.parentCategories.set(createdCategory.data.id, createdCategory.data)
                }
                this.newTitle = ''
            }
        } catch(error) {
            console.log(error)
        }
    })

    loadMainCategories = flow(function * () {
        try {
            const categories = yield this.ticketService.categories({})
            if (categories.data && categories.data.length > 0) {
                for (let index in categories.data) {
                    let category = categories.data[index]
                    this.allCategories.set(category.id, category)
                    if (category.parent_id === 0) {
                        this.parentCategories.set(category.id, category)
                    }
                }
            } else {
                this.allCategories = observable.map()
                this.subCategories = observable.map()
                this.parentCategories = observable.map()
            }
        } catch(error) {
            this.allCategories = observable.map()
            this.subCategories = observable.map()
            this.parentCategories = observable.map()
        }
    })

    loadSubCategories = flow(function * (categoryId) {
        if (categoryId > 0) {
            try {
                const categories = yield this.ticketService.subCategories(categoryId)
                if (categories.data && categories.data.length > 0) {
                    for (let index in categories.data) {
                        let category = categories.data[index]
                        this.subCategories.set(category.id, category)
                    }
                } else {
                    this.subCategories = observable.map()
                }
            } catch(error) {
                this.subCategories = observable.map()
            }
        } else {
            this.subCategories = observable.map()
        }
    })
}
decorate(CategoryStore, {
    loadMainCategories: action,
    loadSubCategories: action,
    updateParentCategory: action,
    allCategories: observable,
    parentCategories: observable,
    subCategories: observable,
    newTitle: observable,
    createCategory: action
})
export default CategoryStore