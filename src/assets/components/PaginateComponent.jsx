import React from 'react';
import ReactPaginate from 'react-paginate';

const PaginateComponent = ({ paginationData, handlePageChange }) => {

  const { currentPage, totalPages } = paginationData;

  return (
    <ReactPaginate
      breakLabel="..."
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      previousLabel="Anterior"
      nextLabel="Siguiente"
      onPageChange={handlePageChange}
      containerClassName="pagination"
      subContainerClassName="pages pagination"
      activeClassName="selected"
      initialPage={currentPage - 1}
      forcePage={currentPage - 1 || 0}
      />
  );
};

export default PaginateComponent;
