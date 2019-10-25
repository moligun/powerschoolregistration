import React from 'react'
import StudentLookupForm from './studentlookupform'
import NewEditor from './neweditor'
import Loading from './loading'
import { observer, inject } from 'mobx-react'
import DescriptionList from './descriptionlist'
import CategorySelector from './categoryselector'
class NewTicketForm extends React.Component {
    handleDescription = (event) => {
      this.props.editorStore.description = event.target.value
    }

    handleTitle = (event) => {
      const { editorStore } = this.props
      editorStore.title = event.target.value
    }

    handleCategoryChange = (event) => {
      const { editorStore } = this.props
      if (event.target.name === 'category') {
        editorStore.setCategory(event.target.value)
      } else if (event.target.name === 'subcategory') {
        editorStore.setSubcategory(event.target.value)
      }
    }

    handleSubmit = () => {
      const { editorStore } = this.props
      const data = editorStore.validateFields()
      if (data) {
        editorStore.submit(data)
        editorStore.reset()
      }
    }

    handleClose = () => {
      const { editorStore } = this.props
      editorStore.displayEditor = false
      editorStore.reset()
    }
    render() {
      const { editorStore, categoryStore } = this.props
      const handleClose = {
          name: "Close",
          fn: this.handleClose
      }
      const handleSubmit = {
          name: "Submit",
          fn: this.handleSubmit
      }
      if (!categoryStore.categories) {
        return (
          <Loading />
        )
      }
      return (
        <NewEditor title="New Ticket" handleClose={handleClose} handleSubmit={handleSubmit}>
          <div className="row">
              <div className="col-sm-12">
                {editorStore.student ? <DescriptionList list={editorStore.studentInfo} title="Student Info" /> : <StudentLookupForm />}
              </div>
              <div className="col-sm-12">
                <CategorySelector category={editorStore.category} subcategory={editorStore.subcategory} handleCategory={this.handleCategoryChange} />
              </div>
              <div className="form-group col-sm-12">
                  <label htmlFor="titleText">Title</label>
                  <input type="text" className="form-control" onChange={this.handleTitle} id="titleText" value={editorStore.title} />
              </div>
              <div className="form-group col-sm-12">
                  <label htmlFor="descriptionText">Description</label>
                  <textarea className="form-control" onChange={this.handleDescription} id="descriptionText" value={editorStore.description} />
              </div>
          </div>
        </NewEditor>
      )
    }
}
export default inject(stores => ({
  editorStore: stores.rootStore.editorStore,
  categoryStore: stores.rootStore.categoryStore
}))(observer(NewTicketForm))