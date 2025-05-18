function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, currentPage + 2);

  if (endPage - startPage < 4) {
    if (startPage === 0) {
      endPage = Math.min(totalPages - 1, 4);
    } else if (endPage === totalPages - 1) {
      startPage = Math.max(0, totalPages - 5);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-1 my-8">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className={`p-2 rounded-md ${
          currentPage === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Previous page"
      >
        Previous
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className={`p-2 rounded-md ${
          currentPage === totalPages - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;