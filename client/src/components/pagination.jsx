import React from 'react';
import { observer, inject } from 'mobx-react';
class Pagination extends React.Component {
    handleClick = (event) => {
      event.preventDefault()
      const pageNum = parseInt(event.target.dataset.pagenum)
      const { updatePage } = this.props
      updatePage(pageNum)
    }

    handleItemsPerPage = (event) => {
      const numOfItems = parseInt(event.target.value)
      const { updateItemsPerPage } = this.props
      updateItemsPerPage(numOfItems)
    }

    render() {
      const { totalPages, activePage, itemsPerPage } = this.props
      const firstPageDisabledClass = activePage === 1 ? ' disabled' : ''
      const lastPageDisabledClass = activePage === totalPages ? ' disabled' : ''
      return (
        <nav aria-label="..." className="d-flex justify-content-between">
          <ul className="pagination">
            <li className={'page-item' + firstPageDisabledClass}>
              <button className="page-link" data-pagenum={activePage - 1} onClick={this.handleClick}>Previous</button>
            </li>
            {[...Array(totalPages).keys()].map((num) => {
              let pageNum = num + 1
              let lowestPage = activePage - 2
              let highestPage = activePage + 2
              if (highestPage > totalPages) {
                lowestPage -= highestPage - totalPages
              }
              if (lowestPage < 1) {
                highestPage += Math.abs(1 - lowestPage)
              }
              let activeClass = pageNum === activePage ? ' active' : ''
              if (
                (pageNum >= lowestPage && pageNum <= highestPage)
              ) {
                return (
                  <li key={'page-' + pageNum} className={'page-item' + activeClass}>
                    <button className="page-link" data-pagenum={pageNum} onClick={this.handleClick}>{pageNum}</button>
                  </li>
                )
              }
              return null
            })}
          <li className={'page-item' + lastPageDisabledClass}>
            <button className="page-link" data-pagenum={activePage + 1} onClick={this.handleClick}>Next</button>
          </li>
          </ul>
          <div className="items-per-page form-group d-flex align-items-baseline">
            <label className="mr-2">Per Page:</label>
            <select value={itemsPerPage} className="items-count-selector form-control" onChange={this.handleItemsPerPage}>
              <option>10</option>
              <option>50</option>
              <option>100</option>
              <option>500</option>
            </select>
          </div>
        </nav>
      )
    }
}
export default inject(stores => ({
  ticketStore: stores.rootStore.ticketStore
}))(observer(Pagination))