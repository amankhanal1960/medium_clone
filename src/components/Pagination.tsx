import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="Next"
      previousLabel="Previous"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage}
      containerClassName="text-black flex justify-center items-center gap-2 mt-6 mb-4"
      pageClassName="inline-block"
      pageLinkClassName="block px-3 py-2 border rounded hover:bg-gray-100 transition-colors sm:px-2 sm:py-1"
      activeClassName="bg-gray-700"
      activeLinkClassName="block w-full h-full text-white focus:outline-none hover:text-black"
      previousClassName="inline-block"
      previousLinkClassName="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors transform will-change-transform"
      nextClassName="inline-block"
      nextLinkClassName="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors transform will-change-transform"
      disabledClassName="opacity-50 cursor-not-allowed"
      disabledLinkClassName=""
    />
  );
};

export default Pagination;
