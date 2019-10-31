import React from 'react'
import DescriptionList from './descriptionlist'
import NewEditor from './neweditor'
import Loading from './loading'
import CategorySelector from './categoryselector'
import { inject, observer} from 'mobx-react'
class EditTicketForm extends React.Component {
    handleComment = (event) => {
        const { editorStore } = this.props
        editorStore.comment = event.target.value
    }

    handleStatus = (event) => {
        const { editorStore } = this.props
        editorStore.status = event.target.value
    }

    handleDeviceId = (event) => {
        const { editorStore } = this.props
        editorStore.deviceId = event.target.value
    }

    handleClose = () => {
        const { editorStore } = this.props
        editorStore.displayEditor = false
        editorStore.reset()
    }

    handleSubmit = async () => {
      const { editorStore } = this.props
      const data = editorStore.validateComments()
      if (data) {
        const response = await editorStore.updateTicket(data)
        if (response === true) {
            editorStore.comment = ''
        }
      }
    }

    handleCategoryChange = (event) => {
      const { editorStore } = this.props
      if (event.target.name === 'category') {
        editorStore.setCategory(event.target.value)
      } else if (event.target.name === 'subcategory') {
        editorStore.setSubcategory(event.target.value)
      }
    }

    render() {
      const { editorStore, ticketStore } = this.props
      const { ticket, ticketInfo, student, studentInfo, status, deviceId, editable } = editorStore
      const { ticketStatus } = ticketStore
      const handleClose = {
          name: "Close",
          fn: this.handleClose
      }
      const handleSubmit = {
          name: "Save",
          fn: this.handleSubmit
      }
      if (!ticket || !student) {
        return (
            <Loading />
        )
      }
      return (
          <NewEditor title={`${editable ? 'Edit ' : ''}Ticket ${ticket.id}`} handleClose={handleClose} handleSubmit={editable ? handleSubmit : false}>
            <div className="row">
                <div className="info-box col-sm-12">
                    <h2>Title</h2>
                    {ticket ? <p>{ticket.title}</p> : <Loading />}
                </div>
                <div className="info-box col-sm-12">
                    <h2>Issue</h2>
                    {ticket ? <p>{ticket.description}</p> : <Loading />}
                </div>
            </div>
            <div className="row">
                {studentInfo && <DescriptionList list={studentInfo}  title="Student Info" />}
                {ticketInfo && <DescriptionList list={ticketInfo} title="Ticket Info" />}
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <ul className="list-group">
                        {editorStore.comments.map((comment, index) => 
                            <li key={'comment.' + index} className="list-group-item">
                                <article>
                                    <header className="d-flex justify-content-between">
                                        <div><em>Status: {comment.status ? comment.status : 'OPEN'}</em></div>
                                        <div><em>{comment.author} @ {new Date(comment.created).toLocaleString('en-US')}</em></div>
                                    </header>
                                    <section className="commentBox">
                                        <header><strong>Comment</strong></header>
                                        {comment.comment}
                                    </section>
                                    {comment.history && 
                                        <section className="changesBox">
                                            <header><strong>Changes</strong></header>
                                            {comment.history}
                                        </section>
                                    }
                                </article>
                            </li>
                        )}
                    </ul>
                </div>
                {
                    editable &&
                    <div className="col-sm-12">
                        <div className="comment-form">
                            <div className="form-group">
                                <label htmlFor="commentText">Comment</label>
                                <textarea className="form-control" onChange={this.handleComment} id="commentText" value={editorStore.comment} />
                            </div>
                            <div className="form-group">
                                <label>Device ID</label>
                                <input type="text" autocomplete="off" className="form-control" value={deviceId} onChange={this.handleDeviceId} />
                            </div>
                            <label>Categories</label>
                            <CategorySelector category={editorStore.category} subcategory={editorStore.subcategory} handleCategory={this.handleCategoryChange} />
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-control" value={status} onChange={this.handleStatus}>
                                    {Object.keys(ticketStatus).map((value) => 
                                        <option key={'status.' + value} value={value}>{ticketStatus[value]}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                }
            </div>
          </NewEditor>
      )
    }
}
export default inject(stores => ({
    editorStore: stores.rootStore.editorStore,
    ticketStore: stores.rootStore.ticketStore,
    studentStore: stores.rootStore.studentStore,
    authStore: stores.rootStore.authStore
}))(observer(EditTicketForm))