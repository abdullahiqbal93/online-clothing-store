import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center mt-6 gap-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`p-2.5 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
          transition-all duration-200 border hover:border-gray-300
          ${currentPage > 1 ? 'hover:bg-gray-50 active:bg-gray-100' : ''}
          shadow-sm hover:shadow-md`}
      >
        <ArrowLeft className="h-4 w-4 text-gray-600" /> 
      </button>

      <div className="flex items-center gap-2 mx-4 px-4 py-2 bg-gray-50 rounded-full shadow-inner">
        <span className="text-sm font-medium text-gray-600">
          Page{' '}
          <span className="text-blue-600 font-semibold mx-1.5 px-2 py-1 bg-white rounded-full shadow-sm">
            {currentPage}
          </span>
          of{' '}
          <span className="text-gray-700 font-semibold">
            {totalPages || 1}
          </span>
        </span>
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`p-2.5 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
          transition-all duration-200 border hover:border-gray-300
          ${currentPage < totalPages ? 'hover:bg-gray-50 active:bg-gray-100' : ''}
          shadow-sm hover:shadow-md`}
      >
        <ArrowRight className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};

export default Pagination;