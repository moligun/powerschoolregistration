import React from 'react'
import { inject, observer} from 'mobx-react'
class NewEditor extends React.Component {
    render() {
        const { handleClose, title, handleSubmit, editorStore } = this.props
        return (
            <div className="editTicket mt-2 border rounded shadow px-3 pt-2">
                <div className="d-flex w-100 justify-content-between align-items-start">
                    <h1>{title}</h1>
                    <button type="button" className="close btn-large" data-dismiss="modal" onClick={handleClose.fn} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {this.props.children}
                {editorStore.errors.form && 
                    <ul className="list-group mb-2">
                        {editorStore.errors.form.map((message, index) => (
                            <li key={'formerror.' + index} className="list-group-item list-group-item-danger">{message}</li>
                        ))}
                    </ul>
                }
                <div className="d-flex w-100 justify-content-between mb-1">
                    {handleClose && <button className="btn btn-danger" onClick={handleClose.fn}>{handleClose.name}</button>}
                    {handleSubmit && <button disabled={editorStore.loading} className="btn btn-primary" onClick={handleSubmit.fn}>{handleSubmit.name}</button>}
                </div>
            </div>
      );
    }
}
export default inject(stores => ({
    editorStore: stores.rootStore.editorStore
}))(observer(NewEditor))