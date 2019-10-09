import React from 'react'
import DescriptionList from './descriptionlist.jsx'
import { inject, observer} from 'mobx-react'
class EditTicketForm extends React.Component {
    handleDescription = (event) => {
      this.props.ticket.description = event.target.value
    }
    render() {
      const studentInfo = {
          "name": "Aaba, Fake",
          "student ID": "867532",
          "device ID": "867532"
      }
      const ticketInfo = {
          "Created": "10/03/2019 @ 10:00AM",
          "Updated": "10/03/2019 @ 10:00AM",
          "Status": "WIP"
      }
      return (
        <React.Fragment>
            <div className="row">
                <div className="info-box col-sm-12">
                    <h2>Issue</h2>
                    <p>{this.props.editorStore.description}</p>
                </div>
            </div>
            <div className="row">
                <div className="info-box col-sm-12 col-md-6">
                    <h2>Student Info</h2>
                    <DescriptionList list={studentInfo} />
                </div>
                <div className="info-box col-sm-12 col-md-6">
                    <h2>Ticket Info</h2>
                    <DescriptionList list={ticketInfo} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    {[...this.props.editorStore.comments].map(comment => <p key={comment.id}>{comment.comment}</p>)}
                </div>
                <div className="col-sm-12">
                    <div className="comment-form">
                        <div className="form-group">
                            <label htmlFor="commentText">Comment</label>
                            <textarea className="form-control" onChange={this.handleDescription} id="commentText" />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-control">
                                <option>WIP</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
      )
    }
}
export default inject("editorStore")(observer(EditTicketForm))