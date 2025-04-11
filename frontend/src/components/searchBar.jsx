import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSearchResults, resetSearchResults } from '@/lib/store/features/search/searchSlice';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { searchResults, isLoading } = useSelector(state => state.search);
    const searchRef = useRef();
    const searchContainerRef = useRef();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchVisible(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSearch = () => {
        if (isSearchVisible) {
            setSearchQuery('');
            dispatch(resetSearchResults());
        }
        setIsSearchVisible(!isSearchVisible);
        if (!isSearchVisible) {
            setTimeout(() => {
                searchRef.current?.focus();
            }, 100);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        if (value.length >= 3) {
            setTypingTimeout(
                setTimeout(() => {
                    dispatch(getSearchResults(value));
                }, 500)
            );
        } else {
            dispatch(resetSearchResults());
        }
    };

    const handleResultClick = (result) => {
        setSearchQuery('');
        setIsSearchVisible(false);
        dispatch(resetSearchResults());
        navigate(`/shop/product/${result._id}`);
    };

    const closeSearch = () => {
        setSearchQuery('');
        setIsSearchVisible(false);
        dispatch(resetSearchResults());
    };

    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    return (
        <div className="relative" ref={searchContainerRef}>
            <div onClick={toggleSearch} className="cursor-pointer">
                {isSearchVisible ? (
                    <X className="w-5 text-gray-700 hover:text-black transition-colors" />
                ) : (
                    <Search className="w-5 text-gray-700 hover:text-black transition-colors" />
                )}
            </div>

            {isMobile && isSearchVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div 
                        className="absolute top-0 left-0 right-0 bg-white z-50 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center p-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-black"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    ref={searchRef}
                                />
                                {searchQuery && (
                                    <button 
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onClick={() => {
                                            setSearchQuery('');
                                            dispatch(resetSearchResults());
                                        }}
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                )}
                            </div>
                            <button 
                                className="ml-3 p-2 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                onClick={closeSearch}
                                aria-label="Close search"
                            >
                                <X className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>

    
                        {searchQuery && (
                            <div className="bg-white max-h-80 overflow-y-auto px-4 pb-4 rounded-lg">
                                {isLoading ? (
                                    <div className="py-3 text-gray-500 text-center">Loading...</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className="py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                                            onClick={() => handleResultClick(result)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={result.images} 
                                                    alt={result.name} 
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">{result.name}</p>
                                                    <p className="text-sm text-gray-500">{result.brand}</p>
                                                    <p className="text-sm font-semibold">${result.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-3 text-gray-500 text-center">No results found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isMobile && isSearchVisible && (
                <div className="absolute top-0 right-8 w-64 transition-all duration-300 ease-in-out">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full border border-gray-300 rounded-full px-4 py-1 focus:outline-none focus:border-black transition-all"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        ref={searchRef}
                    />
                    
                    {searchQuery && (
                        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-80 overflow-y-auto">
                            {isLoading ? (
                                <div className="px-4 py-2 text-gray-500">Loading...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                                        onClick={() => handleResultClick(result)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={result.images} 
                                                alt={result.name} 
                                                className="w-8 h-8 object-cover rounded-full" 
                                            />
                                            <div>
                                                <p className="text-sm font-medium">{result.name}</p>
                                                <p className="text-xs text-gray-500">{result.brand}</p>
                                                <p className="text-xs font-semibold">${result.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500">No results found</div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;