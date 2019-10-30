import React from 'react'
import Loading from './loading'
import { observer, inject } from 'mobx-react'
import DescriptionList from './descriptionlist'
import Barcode from 'react-barcode'
import { FaPrint, FaTimes } from 'react-icons/fa'
class PrintView extends React.Component {
    componentDidUpdate() {
      const { authStore, editorStore } = this.props
      if (editorStore.ticket && !authStore.authorized) {
        this.handlePrint()
        this.handleClose()
      }
    }
    handleClose = () => {
      const { editorStore } = this.props
      editorStore.printView = false
    }

    handlePrint = () => {
      window.print()
    }

    render() {
      const { editorStore } = this.props
      if (!editorStore.ticket) {
        return (
          <Loading />
        )
      }
      return (
        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex justify-content-around mt-3 print-view-buttons">
              <button className="btn btn-primary btn-lg" onClick={this.handlePrint}><FaPrint /></button>
              <button className="btn btn-danger btn-lg" onClick={this.handleClose}><FaTimes /></button>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="info-box">
              <header><h2>Title</h2></header>
              <p>{editorStore.ticket.title}</p>
            </div>
            <div className="info-box">
              <header><h2>Description</h2></header>
              <p>{editorStore.ticket.description}</p>
            </div>
          </div>
          <DescriptionList list={editorStore.ticketPrintInfo} title="Ticket Info">
            <Barcode value={editorStore.ticket.studentnumber.toString()} width={5} displayValue={false} />
          </DescriptionList>
        </div>
      )
    }
}
export default inject(stores => ({
  editorStore: stores.rootStore.editorStore,
  authStore: stores.rootStore.authStore
}))(observer(PrintView))