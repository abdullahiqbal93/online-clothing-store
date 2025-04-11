import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4">
      <Link to="/admin/dashboard" className="flex items-center hover:text-blue-600 transition-colors">
        <Home size={16} className="mr-1" />
        <span>Dashboard</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-800">{item.label}</span>
          ) : (
            <Link 
              to={item.path} 
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;