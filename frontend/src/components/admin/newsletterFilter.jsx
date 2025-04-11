import React from 'react';

const NewsletterFilter = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Search</label>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by email"
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
};

export default NewsletterFilter;