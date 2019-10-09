import React from 'react'
import { observer } from 'mobx-react'
class NewTicketForm extends React.Component {
    handleDescription = (event) => {
      this.props.ticket.description = event.target.value
    }
    render() {
      const { ticket } = this.props
      return (
        <div className="row">
            <div className="form-group col-sm-12">
                <label htmlFor="descriptionText">Description</label>
                <textarea className="form-control" onChange={this.handleDescription} id="descriptionText" />
            </div>
            <div className="form-group col-sm-12">
                <label>Status</label>
                <select className="form-control">
                    <option>WIP</option>
                </select>
            </div>
        </div>
      )
    }
}
export default observer(NewTicketForm)