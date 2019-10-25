import React from 'react';
import { observer, inject } from 'mobx-react';
class Pagination extends React.Component {
    handleClick = (event) => {
      event.preventDefault()
      const pageNum = parseInt(event.target.dataset.pagenum)
      const { updatePage } = this.props
      updatePage(pageNum)
    }
    render() {
      const { totalPages, activePage } = this.props
      const firstPageDisabledClass = activePage === 1 ? ' disabled' : ''
      const lastPageDisabledClass = activePage === totalPages ? ' disabled' : ''
      return (
        <nav aria-label="...">
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
        </nav>
      )
    }
}
export default inject(stores => ({
  ticketStore: stores.rootStore.ticketStore
}))(observer(Pagination))