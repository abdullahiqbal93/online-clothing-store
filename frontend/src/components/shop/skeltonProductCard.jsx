import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="animate-pulse flex flex-col items-center p-4 border border-gray-200 rounded-lg">
      <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
      <div className="w-3/4 h-6 bg-gray-300 rounded-md mb-2"></div>
      <div className="w-1/2 h-6 bg-gray-300 rounded-md"></div>
    </div>
  );
};

export default SkeletonProductCard;